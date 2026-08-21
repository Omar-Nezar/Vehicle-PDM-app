import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuditLogs } from "src/slices/userSlice";
import type { RootState, AppDispatch } from "src/store/store";
import type { AuditLog } from "src/slices/userSlice";
import { exportToCSV } from "src/functions/utility/generateCsv";

import { DataTable } from "./AuditLog/DataTable";
import { columns } from "./AuditLog/columns"
import { Button } from "@/components/ui/button";

export default function AuditLogs() {
    const dispatch = useDispatch<AppDispatch>();
    const { logs, loading } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(getAuditLogs());
    }, [dispatch]);

    const buildCsvData = (logs: AuditLog[]) => {
        return logs.map((log) => ({
            method: log.method,
            route: log.route,
            statusCode: log.statusCode,
            userId: log.userId || "",
            body: log.body || {},
            ip: log.ip || "",
            durationMs: log.durationMs || "",
            createdAt: new Date(log.createdAt).toISOString(),
        }));
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Audit Logs</h1>

            <div className="flex justify-end mb-4">
                <Button
                    onClick={() => {
                        const data = buildCsvData(logs);
                        exportToCSV("audit_logs.csv", data);
                    }}
                >
                    Download CSV
                </Button>
            </div>

            <div className="rounded-lg border border-border bg-card">

                <DataTable columns={columns} data={logs} loading={loading} />

            </div>
        </div>
    );
};
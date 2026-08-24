import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuditLogs } from "src/slices/userSlice";
import type { RootState, AppDispatch } from "src/store/store";

import { DataTable } from "./AuditLog/DataTable";
import { columns } from "./AuditLog/columns"

export default function AuditLogs() {
    const dispatch = useDispatch<AppDispatch>();
    const { logs, loading } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(getAuditLogs());
    }, [dispatch]);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Audit Logs</h1>
            <div className="rounded-lg border border-border bg-card">

                <DataTable columns={columns} data={logs} loading={loading} />

            </div>
        </div>
    );
};
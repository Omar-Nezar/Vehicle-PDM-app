import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { getServiceHistory, getVehicles, getAuditLogs } from "src/slices/userSlice";
import type { RootState } from "src/store/store";
import { exportToCSV } from "src/functions/utility/generateCsv";

import showToast from "../common/Toast";
import { ActionCard } from "../common/ActionCard";

import { Download } from "lucide-react";

export default function Misc() {
    const dispatch = useAppDispatch();

    const { history, vehicles, logs } = useAppSelector(
        (state: RootState) => state.user
    );

    const [downloading, setDownloading] = useState("");


    interface DownloadCSVParams {
        downloading: string;
        action: () => any;
        filename: string;
        successMessage: string;
        successDescription: string;
        getRecords: (data: any) => any[];
    }

    const handleDownloadCSV = async ({
        downloading,
        action,
        filename,
        successMessage,
        successDescription,
        getRecords,
    }: DownloadCSVParams) => {
        try {
            setDownloading(downloading);

            const promise = action();

            showToast({
                promise,
                message: successMessage,
                description: successDescription,
            });

            const data = await promise;

            const records = getRecords(data);

            if (!records || records.length === 0) {
                throw new Error("No data available");
            }

            exportToCSV(filename, records);
        } catch (error) {
            console.error(error);
        } finally {
            setDownloading("");
        }
    };

    const handleDownloadAuditLogs = () => {
        return handleDownloadCSV({
            downloading: "audit",
            action: () => dispatch(getAuditLogs()).unwrap(),

            filename: `audit_logs_${new Date()
                .toISOString()
                .slice(0, 10)}.csv`,

            successMessage: "Audit logs downloaded",

            successDescription: "Full audit logs CSV has been generated",

            getRecords: (data) =>
                data?.auditLogs ?? data?.logs ?? logs,
        });
    };

    const handleDownloadServiceHistory = () => {
        return handleDownloadCSV({
            downloading: "history",
            action: () => dispatch(getServiceHistory()).unwrap(),

            filename: `service_history_${new Date()
                .toISOString()
                .slice(0, 10)}.csv`,

            successMessage: "Service history downloaded",

            successDescription: "Full service history CSV has been generated",

            getRecords: (data) =>
                data?.serviceHistory ?? data?.history ?? history,
        });
    };

    const handleDownloadVehicles = () => {
        return handleDownloadCSV({
            downloading: "vehicles",
            action: () => dispatch(getVehicles()).unwrap(),

            filename: `vehicles_${new Date()
                .toISOString()
                .slice(0, 10)}.csv`,

            successMessage: "Vehicles set downloaded",

            successDescription: "Full vehicles set CSV has been generated",

            getRecords: (data) =>
                data?.vehicles ?? data?.history ?? vehicles,
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Miscellaneous
                </h1>

                <p className="text-sm text-muted-foreground mt-1">
                    Administrative utilities and data exports.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 2xl:grid-cols-3">
                <ActionCard
                    title="Audit Logs"
                    description="Download audit logs as a CSV file."
                    buttonText="Download Audit Logs"
                    loadingText="Preparing CSV..."
                    loading={downloading === "audit"}
                    onClick={handleDownloadAuditLogs}
                    icon={<Download className="h-4 w-4 mr-2" />}
                />
                <ActionCard
                    title="Service History"
                    description="Download the complete vehicle service history as a CSV file."
                    buttonText="Download Service History"
                    loadingText="Preparing CSV..."
                    loading={downloading === "history"}
                    onClick={handleDownloadServiceHistory}
                    icon={<Download className="h-4 w-4 mr-2" />}
                />
                <ActionCard
                    title="Vehicles"
                    description="Download the complete set of vehicles as a CSV file."
                    buttonText="Download Vehicles"
                    loadingText="Preparing CSV..."
                    loading={downloading === "vehicles"}
                    onClick={handleDownloadVehicles}
                    icon={<Download className="h-4 w-4 mr-2" />}
                />
            </div>
        </div>
    );
}
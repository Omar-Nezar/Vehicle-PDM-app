import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVehicles } from "src/slices/userSlice";
import type { RootState, AppDispatch } from "src/store/store";

import { DataTable } from "./ViewCars/DataTable";
import { columns } from "./ViewCars/columns"

export default function AuditLogs() {
    const dispatch = useDispatch<AppDispatch>();
    const { vehicles, loading } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(getVehicles());
    }, [dispatch]);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">View Cars</h1>
            <div className="rounded-lg border border-border bg-card">

                <DataTable columns={columns} data={vehicles} loading={loading} />

            </div>
        </div>
    );
};
import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "./data-table-features"
import type { Vehicle } from "src/slices/carSlice"

const columnHelper = createColumnHelper<DataTableFeatures, Vehicle>()

export const columns = [
    columnHelper.accessor("vehicle_id", {
        header: "Vehicle ID",
    }),
    columnHelper.accessor("model", {
        header: "Model",
    }),
    columnHelper.accessor("engine_type", {
        header: "Engine",
    }),
    columnHelper.accessor("engine_cc", {
        header: "Engine CC",
    }),
    columnHelper.accessor("vehicle_class", {
        header: "Class",
    }),
    columnHelper.accessor("drivetrain", {
        header: "Drivetrain",
    }),
    columnHelper.accessor("manufacture_year", {
        header: "Year",
    }),
    columnHelper.accessor("avg_daily_km", {
        header: "Avg. Daily KM",
        cell: (info) => `${info.getValue()} km`,
    }),
]

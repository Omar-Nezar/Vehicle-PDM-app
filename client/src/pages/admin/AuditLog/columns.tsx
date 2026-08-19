import { createColumnHelper } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowUpDown } from "lucide-react"
import { type DataTableFeatures } from "./data-table-features"
import type { AuditLog } from "src/slices/userSlice"

const columnHelper = createColumnHelper<DataTableFeatures, AuditLog>()

export const columns = [
    columnHelper.accessor("method", {
        header: "Method",
        cell: (info) => {
            const method = info.getValue()
            return (
                <Badge
                    className="w-15 text-center"
                    variant={
                        method === "GET"
                            ? "secondary"
                            : method === "POST"
                                ? "default"
                                : method === "DELETE"
                                    ? "destructive"
                                    : "outline"
                    }
                >
                    {method}
                </Badge>
            )
        },
    }),
    columnHelper.accessor("route", {
        header: "Route",
        cell: (info) => (
            <div className="text-muted-foreground max-w-50 truncate">
                {info.getValue()}
            </div>
        ),
    }),
    columnHelper.accessor("statusCode", {
        header: "Status",
        cell: (info) => {
            const statusCode = info.getValue()
            return (
                <Badge
                    className="w-10 text-center"
                    variant={
                        statusCode >= 500
                            ? "destructive"
                            : statusCode >= 400
                                ? "secondary"
                                : "default"
                    }
                >
                    {statusCode}
                </Badge>
            )
        },
    }),
    columnHelper.accessor("userId", {
        header: "User",
        cell: (info) => info.getValue() || "—",
    }),
    columnHelper.accessor("body", {
        header: "Body",
        cell: (info) => {
            const body = info.getValue()

            return (
                <Popover>
                    <PopoverTrigger render={
                        <Button
                            variant="link"
                            size="sm"
                            className="cursor-pointer text-blue-500 pl-0"
                            disabled={!body}
                        >
                            View
                        </Button>
                    }

                    />
                    <PopoverContent className="w-100 max-h-75 overflow-auto">
                        <pre className="text-xs font-mono leading-relaxed p-1 bg-muted rounded">
                            {JSON.stringify(body, null, 2)}
                        </pre>
                    </PopoverContent>
                </Popover>
            )
        },
    }),
    columnHelper.accessor("ip", {
        header: "IP",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("durationMs", {
        header: "Duration",
        cell: (info) => {
            const duration = info.getValue()
            return duration ? `${duration} ms` : "—"
        },
    }),
    columnHelper.accessor("createdAt", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Time
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
        cell: (info) => {
            const createdAt = info.getValue()
            return new Date(createdAt).toLocaleString()
        },
    }),
]
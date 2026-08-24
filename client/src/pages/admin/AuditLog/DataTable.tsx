import React from "react"

import {
    type ColumnDef,
    type RowData,
    type SortingState,
    type ColumnFiltersState,
    type PaginationState,
    type Updater,
    flexRender,
    useTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { features, type DataTableFeatures } from "./data-table-features"
import { Separator } from "@/components/ui/separator"
import { DataTablePagination } from "./pagination"

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData, any>[]
    data: TData[]
    loading?: boolean
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    loading = false,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [globalFilter, setGlobalFilter] = React.useState("")
    const table = useTable({
        features,
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onGlobalFilterChange: (updater: Updater<string | undefined>) => {
            setGlobalFilter((currentFilter) => {
                const nextFilter = typeof updater === "function"
                    ? updater(currentFilter)
                    : updater
                return nextFilter ?? ""
            })
        },
        state: {
            sorting,
            columnFilters,
            pagination,
            globalFilter,
        },
    })

    return (
        <div className="rounded-md border">
            <div className="flex items-center py-4 pl-2">
                <Input
                    placeholder="Filter audit logs..."
                    value={globalFilter}
                    onChange={(event) =>
                        table.setGlobalFilter(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <Table className="w-full text-xs">
                <TableHeader className="bg-muted">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="text-left">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="text-foreground">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={table.getVisibleLeafColumns().length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() ? "selected" : undefined}
                                className="border-t border-border hover:bg-muted/50 transition"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-foreground">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={table.getVisibleLeafColumns().length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No audit logs found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Separator />
            <DataTablePagination table={table} />
        </div>
    )
}
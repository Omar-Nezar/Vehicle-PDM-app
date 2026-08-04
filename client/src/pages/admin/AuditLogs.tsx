import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuditLogs } from "src/slices/userSlice";
import type { RootState, AppDispatch } from "src/store/store";
import type { AuditLog } from "src/slices/userSlice";

import Layout from "../common/Layout";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AuditLogs() {
    const dispatch = useDispatch<AppDispatch>();
    const { logs, loading } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchAuditLogs());
    }, [dispatch]);

    return (
        <Layout>
            <h1 className="text-2xl font-semibold mb-6">Audit Logs</h1>

            <div className="rounded-lg border border-border bg-card">
                <Table className="w-full text-xs">
                    <TableHeader className="bg-muted">
                        <TableRow className="text-left">
                            <TableHead className="text-foreground">Method</TableHead>
                            <TableHead className="text-foreground">Route</TableHead>
                            <TableHead className="text-foreground">Status</TableHead>
                            <TableHead className="text-foreground">User</TableHead>
                            <TableHead className="text-foreground">Body</TableHead>
                            <TableHead className="text-foreground">IP</TableHead>
                            <TableHead className="text-foreground">Duration</TableHead>
                            <TableHead className="text-foreground">Time</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log: AuditLog) => (
                                <TableRow key={log._id} className="border-t border-border hover:bg-muted/50 transition">
                                    <TableCell className="text-foreground">
                                        <Badge className="w-15 text-center"
                                            variant={
                                                log.method === "GET"
                                                    ? "secondary"
                                                    : log.method === "POST"
                                                        ? "default"
                                                        : log.method === "DELETE"
                                                            ? "destructive"
                                                            : "outline"
                                            }
                                        >
                                            {log.method}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-muted-foreground max-w-50 truncate">
                                        {log.route}
                                    </TableCell>

                                    <TableCell className="text-foreground">
                                        <Badge className="w-10 text-center"
                                            variant={
                                                log.statusCode >= 500
                                                    ? "destructive"
                                                    : log.statusCode >= 400
                                                        ? "secondary"
                                                        : "default"
                                            }
                                        >
                                            {log.statusCode}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-foreground">
                                        {log.userId || "—"}
                                    </TableCell>

                                    <TableCell className="text-foreground">
                                        <Popover>
                                            <PopoverTrigger render={
                                                <Button variant="link" size="sm" className="cursor-pointer text-blue-500 pl-0" disabled={!log.body}>
                                                    View
                                                </Button>
                                            }>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-100 max-h-75 overflow-auto">
                                                <pre className="text-xs font-mono leading-relaxed p-1 bg-muted rounded">
                                                    {JSON.stringify(log.body, null, 2)}
                                                </pre>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                        {log.ip}
                                    </TableCell>

                                    <TableCell className="text-foreground">
                                        {log.durationMs ? `${log.durationMs} ms` : "—"}
                                    </TableCell>

                                    <TableCell className="text-foreground">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
};
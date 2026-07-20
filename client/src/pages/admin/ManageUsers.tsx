import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { delUser, getUsers } from "../../slices/userSlice";
import AdminLayout from "./AdminLayout"
import getUserBadge from "../../functions/admin/getBadge";
import { Trash2 } from "lucide-react";
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ManageUsers() {
  const dispatch = useAppDispatch();
  const { users, loading, delLoading, error } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);


  const handleDelete = async (_id: string) => {
    try {
      const promise = dispatch(delUser(_id)).unwrap();

      toast.promise(promise, {
        loading: "Deleting...",
        success: () => {
          return {
            message: "Login successful!",
            description: "You have logged in successfully.",
            duration: 10000,
            action: toast.dismiss()
          };
        },
        error: () =>
          "Deletion failed!",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Manage Users
      </h1>

      <div className="rounded-lg border border-border bg-card">
        {loading && (
          <p className="p-4 text-muted-foreground">Loading...</p>
        )}

        {error && (
          <p className="p-4 text-destructive">{error}</p>
        )}

        {!loading && !error && (
          <Table className="w-full text-sm">
            <TableHeader className="bg-muted">
              <TableRow className="text-left">
                <TableHead className="p-3 text-foreground">Name</TableHead>
                <TableHead className="p-3 text-foreground">Email</TableHead>
                <TableHead className="p-3 text-foreground">Role</TableHead>
                <TableHead className="p-3 text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => {
                const badge = getUserBadge(user.type);

                return (
                  <TableRow
                    key={user._id}
                    className="border-t border-border hover:bg-muted/50 transition"
                  >
                    <TableCell className="p-3 text-foreground">
                      {user.name}
                    </TableCell>

                    <TableCell className="p-3 text-muted-foreground">
                      {user.email}
                    </TableCell>

                    <TableCell className="p-3">
                      <Badge className={`px-2 py-1 rounded text-xs ${badge.className}`}>
                        {badge.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
}
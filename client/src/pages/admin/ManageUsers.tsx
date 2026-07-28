import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { delUser, getUsers } from "../../slices/userSlice";
import AdminLayout from "../common/Layout"
import UserBadge from "./UserBadge";
import Toast from "../common/Toast"

import { Trash2 } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);


  const handleDelete = async (_id: string) => {
    try {
      setDeletingId(_id);
      const promise = dispatch(delUser(_id)).unwrap();
      Toast({ promise, message: "User Deleted Successfully", description: `User ${_id} Deleted` })
      await promise
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
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
                      <UserBadge type={user.type} />
                    </TableCell>

                    <TableCell className="p-3 text-right">
                      <Badge
                        variant="destructive"
                        onClick={() => handleDelete(user._id)}
                        className="px-2 py-1 cursor-pointer hover:bg-destructive/30 dark:hover:bg-destructive/30"
                      >
                        {deletingId === user._id ? (
                          <Spinner data-icon='inline-start' />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        <span>Delete</span>
                      </Badge>
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
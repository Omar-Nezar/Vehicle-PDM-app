import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { delUser, getUsers, getUserCars } from "../../slices/userSlice";
import Layout from "../common/Layout";
import UserBadge from "./UserBadge";
import Toast from "../common/Toast";
import CarCard from "../common/CarCard";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Trash2, ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManageUsers() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openUserId, setOpenUserId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { users, userCars, loading, error } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDelete = async (_id: string) => {
    try {
      setDeletingId(_id);
      const promise = dispatch(delUser(_id)).unwrap();
      Toast({
        promise,
        message: "User Deleted Successfully",
        description: `User ${_id} Deleted`,
      });
      await promise;
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Manage Users
      </h1>

      <div className="rounded-lg border border-border bg-card">
        {loading && <p className="p-4 text-muted-foreground">Loading...</p>}

        {error && <p className="p-4 text-destructive">{error}</p>}

        {!loading && !error && (
          <Table className="w-full text-sm">
            <TableHeader className="bg-muted">
              <TableRow className="text-left">
                <TableHead className="p-3 text-foreground">Name</TableHead>
                <TableHead className="p-3 text-foreground">Email</TableHead>
                <TableHead className="p-3 text-foreground">Role</TableHead>
                <TableHead className="p-3 text-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>


            {users.map((user) => {
              const isOpen = openUserId === user._id;
              const cars = userCars[user._id] || [];

              // Standard open toggle handler with state + dispatch
              const handleOpenChange = (open: boolean) => {
                setOpenUserId(open ? user._id : null);
                if (open && (!userCars[user._id] || userCars[user._id].length === 0)) {
                  dispatch(getUserCars(user._id));
                }
              };

              return (
                <Collapsible
                  key={user._id}
                  open={isOpen}
                  onOpenChange={handleOpenChange}
                  className="w-full"
                  render={(props) => (<TableBody {...props} />)}
                >
                  {/* Render TableRow via Base UI function slot to ensure event propagation */}
                  <CollapsibleTrigger className="w-full" nativeButton={false}
                    render={(props) => (
                      <TableRow
                        {...props}
                        className="cursor-pointer hover:bg-muted/50 transition w-full"
                      >
                        <TableCell className="p-3 flex items-center gap-2 font-medium">
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
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
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents Base UI trigger from firing when deleting
                              handleDelete(user._id);
                            }}
                            className="px-2 py-1 cursor-pointer inline-flex items-center gap-1"
                          >
                            {deletingId === user._id ? (
                              <Spinner />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            <span>Delete</span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )}
                  />

                  {/* Content Panel rendered directly as a TableRow */}
                  <CollapsibleContent
                    render={(props) => (
                      <TableRow {...props}>
                        <TableCell colSpan={4} className="bg-muted/30 p-4">
                          {!userCars[user._id] ? (
                            <div className="flex justify-center p-4">
                              <Spinner />
                            </div>
                          ) : cars.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center">
                              No cars found
                            </p>
                          ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {cars.map((car: any) => (
                                <CarCard key={car._id} car={car} />
                              ))}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  />
                </Collapsible>
              );
            })}

          </Table>
        )}
      </div>
    </Layout >
  );
}
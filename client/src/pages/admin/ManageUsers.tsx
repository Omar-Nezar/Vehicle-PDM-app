import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUsers } from "../../slices/userSlice";

export default function ManageUsers() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div className="p-6 bg-background min-h-screen">
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
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="p-3 text-muted-foreground">Name</th>
                <th className="p-3 text-muted-foreground">Email</th>
                <th className="p-3 text-muted-foreground">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-border hover:bg-muted/50 transition"
                >
                  <td className="p-3 text-foreground">
                    {user.name}
                  </td>

                  <td className="p-3 text-muted-foreground">
                    {user.email}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
                      {user.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
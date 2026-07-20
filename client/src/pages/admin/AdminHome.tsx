import AdminLayout from "./AdminLayout";

export default function AdminHome() {
  return (
    <AdminLayout>
      <div className="flex flex-1 overflow-hidden">

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">
            Welcome to Admin Dashboard 👋
          </h1>
        </main>
      </div>
    </AdminLayout>
  );
}
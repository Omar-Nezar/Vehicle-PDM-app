import { useState } from "react";
import Header from "../common/Header";
import Sidebar from "../common/SideBar";

export default function AdminHome() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={open} onClose={() => setOpen(false)} />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">
            Welcome to Admin Dashboard 👋
          </h1>
        </main>
      </div>
    </div>
  );
}
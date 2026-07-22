"use client";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import SideBar from "./SideBar";
import getUserType from "src/functions/utility/getUserType";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const type = getUserType()
  return (
    <SidebarProvider style={
      {
        "--sidebar-width": "10rem",
        "--sidebar-width-mobile": "10rem",
      } as React.CSSProperties
    }>
      <div className="flex min-h-screen w-full bg-background">
        <SideBar />

        {/* Main area */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="h-14 border-b flex items-center px-4 bg-background">
            <SidebarTrigger />

            <h1 className="ml-4 font-semibold text-foreground">
              {type === "admin" && <>Admin Dashboard</>}
              {type === "car_owner" && <>Car Owner Dashboard</>}
              {type === "inventory_manager" && <>Inventory Manager Dashboard</>}
            </h1>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 bg-muted">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
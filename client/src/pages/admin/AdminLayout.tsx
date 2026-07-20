"use client";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import SideBar from "../common/SideBar";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {

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
              Admin Dashboard
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
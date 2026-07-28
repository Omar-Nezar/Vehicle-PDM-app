import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarFooter
} from "@/components/ui/sidebar";
import { Home, Users, User, CarFront } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

import decodeToken from "src/functions/utility/decodeToken";

export default function AppSidebar() {

    const linkActive = (isActive: boolean) =>
        cn(
            "flex items-center gap-2 py-3 w-full h-full rounded-sm",
            isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
        );

    const { name, type, email } = decodeToken()!

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {type === "car_owner" &&
                    <>
                        <SidebarGroup>
                            <SidebarGroupLabel>Car Owner</SidebarGroupLabel>

                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton className="rounded-2xl" >
                                            <NavLink
                                                to="/carownerhome"
                                                className={({ isActive }) => linkActive(isActive)}
                                            >
                                                <Home className="w-4 h-4" />
                                                <span>Dashboard</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton className="rounded-2xl">
                                            <NavLink
                                                to="/managecars"
                                                className={({ isActive }) => linkActive(isActive)}
                                            >
                                                <CarFront className="w-4 h-4" />
                                                <span>Manage Cars</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </>}
                {type === "admin" &&
                    <>
                        <SidebarGroup>
                            <SidebarGroupLabel>Admin</SidebarGroupLabel>

                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton className="rounded-2xl">
                                            <NavLink
                                                to="/adminhome"
                                                className={({ isActive }) => linkActive(isActive)}
                                            >
                                                <Home className="w-4 h-4" />
                                                <span>Dashboard</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton className="rounded-2xl">
                                            <NavLink
                                                to="/manageusers"
                                                className={({ isActive }) => linkActive(isActive)}
                                            >
                                                <Users className="w-4 h-4" />
                                                <span>Manage Users</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </>}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="flex items-center gap-2 py-3 rounded-2xl">
                            {/* Profile image can be added ater */}
                            <User className="w-4 h-4" />
                            <div className="flex flex-col text-left">
                                <span className="text-xs font-medium">
                                    {name || "User"}
                                </span>
                                <span className="text-muted-foreground text-[8px]">
                                    {email || "Email"}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
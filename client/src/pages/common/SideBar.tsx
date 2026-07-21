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
} from "@/components/ui/sidebar";
import { Home, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="rounded-2xl">
                                    <NavLink
                                        to="/adminhome"
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 py-3 w-full h-full rounded-2xl ${isActive
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground"
                                            }`
                                        }
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
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 py-3 w-full h-full rounded-2xl ${isActive
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground"
                                            }`
                                        }
                                    >
                                        <Users className="w-4 h-4" />
                                        <span>Manage Users</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
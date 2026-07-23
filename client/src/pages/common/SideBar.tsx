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
import { Home, Users, CarFront } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

import getUserType from "src/functions/utility/getUserType";

export default function AppSidebar() {

    const linkActive = (isActive: boolean) =>
        cn(
            "flex items-center gap-2 py-3 w-full h-full rounded-2xl",
            isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
        );

    const type = getUserType()

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
                                        <SidebarMenuButton className="rounded-2xl">
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
                                                to="/addCar"
                                                className={({ isActive }) => linkActive(isActive)}
                                            >
                                                <CarFront className="w-4 h-4" />
                                                <span>Add Cars</span>
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

            <SidebarRail />
        </Sidebar>
    );
}
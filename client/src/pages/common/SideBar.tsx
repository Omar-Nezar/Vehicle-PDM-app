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
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Home, Users, User, CarFront, LogOut, Bell, ChevronsUpDown, BadgeCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

import decodeToken from "src/functions/utility/decodeToken";
import { useAppDispatch } from "src/store/hooks";
import { logoutUser } from "src/slices/authSlice";
import { useNavigate } from "react-router-dom";
import showToast from "../common/Toast";
import UserAvatar from "./UserAvatar";
import getInitials from "src/functions/utility/getInitials";

export default function AppSidebar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const promise = dispatch(logoutUser()).unwrap();

        showToast({
            promise,
            message: "Logged out",
            description: "You have been logged out successfully",
        });

        try {
            await promise;
            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (err) {
            console.error(err)
        }
    };

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
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    />
                                }
                            >
                                <UserAvatar alt={name} fallback={getInitials(name)} />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{name}</span>
                                    <span className="truncate text-xs">{email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={/*isMobile ? "bottom" :*/ "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <UserAvatar alt={name} fallback={getInitials(name)} />
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{name}</span>
                                                <span className="truncate text-xs">{email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <BadgeCheck />
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Bell />
                                        Notifications
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
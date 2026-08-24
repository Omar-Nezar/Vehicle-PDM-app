import { useState } from "react"
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

import {
    Home,
    Users,
    CarFront,
    LogOut,
    Bell,
    ChevronsUpDown,
    BadgeCheck,
    ClipboardClock,
    FileDown
} from "lucide-react";

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import decodeToken from "src/functions/utility/decodeToken";
import { useAppDispatch } from "src/store/hooks";
import { logoutUser } from "src/slices/authSlice";
import { useNavigate } from "react-router-dom";
import showToast from "../common/Toast";
import UserAvatar from "./UserAvatar";
import getInitials from "src/functions/utility/getInitials";
import AccountModal from "./ManageAccount";

export default function AppSidebar() {
    const [accountModalOpen, setAccountModalOpen] = useState(false);
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

    const sidebarConfig = {
        "car_owner": {
            label: "Car Owner",
            items: [
                {
                    label: "Dashboard",
                    to: "/carownerhome",
                    icon: Home,
                },
                {
                    label: "Manage Cars",
                    to: "/managecars",
                    icon: CarFront,
                },
            ],
        },
        "admin": {
            label: "Admin",
            items: [
                {
                    label: "Dashboard",
                    to: "/adminhome",
                    icon: Home,
                },
                {
                    label: "Manage Users",
                    to: "/manageusers",
                    icon: Users,
                },
                {
                    label: "Audit Logs",
                    to: "/auditlogs",
                    icon: ClipboardClock,
                },
                {
                    label: "Misc",
                    to: "/history",
                    icon: FileDown
                }
            ],
        },
    };

    type SidebarType = keyof typeof sidebarConfig; // "car_owner" | "admin"
    const { name, type: decodedType, email } = decodeToken()!
    const sidebarType = decodedType as SidebarType;

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {sidebarConfig[sidebarType] && (
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            {sidebarConfig[sidebarType].label}
                        </SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu className="gap-2">
                                {sidebarConfig[sidebarType].items.map((item, index) => {
                                    const isActive = location.pathname === item.to
                                    const Icon = item.icon;

                                    return (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton
                                                className="rounded-2xl"
                                                isActive={isActive}
                                                render={
                                                    <Link to={item.to}>
                                                        <Icon className="w-4 h-4" />
                                                        <span>{item.label}</span>
                                                    </Link>
                                                }
                                            />
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
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
                                    <DropdownMenuItem onSelect={() => setAccountModalOpen(true)} onClick={() => setAccountModalOpen(true)}>
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
            <AccountModal
                open={accountModalOpen}
                onOpenChange={setAccountModalOpen}
            />
        </Sidebar>
    );
}
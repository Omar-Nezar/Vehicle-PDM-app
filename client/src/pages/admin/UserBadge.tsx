import { Badge } from "@/components/ui/badge";
import { Users, ShieldUser, UserRoundCog } from "lucide-react";
import getUserBadge from "src/functions/admin/getBadge";

type UserBadgeProps = {
    type: string;
}

export default function UserBadge({ type }: UserBadgeProps) {
    const badge = getUserBadge(type)
    return (
        <Badge className={`w-25 px-2 py-1 rounded text-xs flex items-center gap-2 ${badge.className}`}>
            <span className="w-4 flex justify-center">
                {type === "car_owner" && <Users />}
                {type === "admin" && <ShieldUser />}
                {type === "inventory_manager" && <UserRoundCog />}
            </span>
            <span className="flex-1 text-left">{badge.label}</span>
        </Badge>
    )
}
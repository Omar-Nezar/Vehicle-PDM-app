import { cn } from "@/lib/utils";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Altima from "src/assets/Altima.png";
import Sunny from "src/assets/Sunny.png";
import XTrail from "src/assets/X-Trail.png";
import Patrol from "src/assets/Patrol.png";
import Pathfinder from "src/assets/Pathfinder.png";

const carImages: Record<string, string> = {
    Altima,
    Sunny,
    "X-Trail": XTrail,
    Patrol,
    Pathfinder,
};

export type Car = {
    _id: string;
    vehicle_id: string;
    model: string;
    engine_type: string;
    engine_cc: number;
    weight_kg: number;
    vehicle_class: string;
    drivetrain: string;
    manufacture_year: number;
    avg_daily_km: number;
};

type CarCardProps = {
    car: Car;
    actions?: React.ReactNode;
    className?: string;
};

export default function CarCard({
    car,
    actions,
    className,
}: CarCardProps) {
    return (
        <Card
            className={cn(
                "relative w-full max-w-sm pt-0 bg-card",
                className
            )}
        >
            {/* Image */}
            <div className="aspect-video w-full bg-linear-to-r from-muted to-background flex items-center justify-center overflow-hidden">
                <img
                    src={carImages[car.model] || Altima}
                    alt={car.model}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Header */}
            <CardHeader className="text-center">
                <CardTitle>
                    <Badge className="text-md">
                        {car.model}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <Separator />

            {/* Vehicle Details */}
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <p>
                        <strong>VID:</strong> {car.vehicle_id}
                    </p>

                    <p>
                        <strong>Year:</strong> {car.manufacture_year}
                    </p>

                    <p>
                        <strong>Engine:</strong> {car.engine_type}
                    </p>

                    <p>
                        <strong>Capacity:</strong> {car.engine_cc} cc
                    </p>

                    <p>
                        <strong>Weight:</strong> {car.weight_kg} kg
                    </p>

                    <p>
                        <strong>Class:</strong> {car.vehicle_class}
                    </p>

                    <p>
                        <strong>Drivetrain:</strong> {car.drivetrain}
                    </p>

                    <p>
                        <strong>Daily Avg:</strong> {car.avg_daily_km} km
                    </p>
                </div>

                {/* Optional Actions */}
                {actions && (
                    <div className="flex justify-end gap-2 pt-4">
                        {actions}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
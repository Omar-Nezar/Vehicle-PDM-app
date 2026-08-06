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

type Car = {
    _id: string;
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    mileage: number;
};

type CarCardProps = {
    car: Car;
    actions?: React.ReactNode; // optional buttons
    className?: string;
};

export default function CarCard({
    car,
    actions,
    className,
}: CarCardProps) {
    return (
        <Card
            className={cn("relative w-full max-w-sm pt-0 bg-card", className)}
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
                        {car.make} {car.model}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <Separator />

            {/* Content */}
            <CardContent className="space-y-2 text-sm text-muted-foreground ml-2">
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Plate:</strong> {car.plateNumber}</p>
                <p><strong>Mileage:</strong> {car.mileage} km</p>

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
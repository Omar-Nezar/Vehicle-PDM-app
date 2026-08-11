import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { type RootState } from "src/store/store";
import { addCar, getVehicleByVid, resetVehicleState } from "src/slices/carSlice";
import showToast from "../common/Toast";
import ErrorDiv from "../common/ErrorDiv";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vidSchema, type vidFormData } from "@schemas/vid.schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import LoadingButton from "../common/LoadingButton";

type AddCarModalProps = {
    children: React.ReactElement;
};

export default function AddCarModal({
    children,
}: AddCarModalProps) {
    const dispatch = useAppDispatch();

    const { auxLoading, findLoading, selectedVehicle } = useAppSelector((state: RootState) => state.car);

    const [open, setOpen] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        trigger,
        formState: { errors },
    } = useForm<vidFormData>({
        resolver: zodResolver(vidSchema),
        defaultValues: {
            vid: "",
        },
    });

    const vid = watch("vid");

    // Clear everything when modal opens/closes
    useEffect(() => {
        if (!open) {
            reset({
                vid: "",
            });

            setConfirmed(false);
        }
    }, [open, reset]);

    // Reset confirmation whenever VIN changes
    useEffect(() => {
        setConfirmed(false);
    }, [vid]);

    const handleLookup = async () => {
        const isValid = await trigger("vid");

        if (!isValid) {
            return;
        }

        await dispatch(getVehicleByVid(vid)).unwrap();

    };

    const onSubmit = async (data: vidFormData) => {
        if (!confirmed) return;

        const promise = dispatch(addCar(data.vid)).unwrap();

        showToast({
            promise,
            message: "Vehicle added successfully",
            description: `${selectedVehicle?.model ?? "Vehicle"} has been added to your account`,
        });

        await promise;

        reset();
        dispatch(resetVehicleState())
        setConfirmed(false);
        setOpen(false);
    };

    const cancel = () => {
        dispatch(resetVehicleState())
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={children} />

            <DialogContent className="max-w-md">
                <DialogHeader className="text-center">
                    <DialogTitle>Add Vehicle</DialogTitle>
                    <Separator />
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <Label>VIN</Label>

                        <div className="flex gap-2">
                            <Input
                                {...register("vid")}
                                placeholder="Enter vehicle VIN"
                                className="font-mono w-2/3"
                                disabled={!!selectedVehicle}
                            />

                            <LoadingButton
                                type="button"
                                variant="secondary"
                                onClick={handleLookup}
                                loading={findLoading}
                                loadingChildren="Finding..."
                                className={"ml-auto justify-end"}
                                disabled={
                                    !vid ||
                                    !!selectedVehicle
                                }
                            >
                                Find
                            </LoadingButton>
                        </div>

                        <ErrorDiv message={errors.vid?.message} />

                    </div>

                    {/* Vehicle Details */}
                    {selectedVehicle && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">
                                    Vehicle Found
                                </h3>

                                <Badge>
                                    {selectedVehicle.vehicle_id}
                                </Badge>
                            </div>

                            <Card>
                                <CardContent className="grid grid-cols-2 gap-4 pt-6 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">
                                            Model
                                        </p>
                                        <p className="font-medium">
                                            {selectedVehicle.model}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Manufacture Year
                                        </p>
                                        <p className="font-medium">
                                            {selectedVehicle.manufacture_year}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Engine
                                        </p>
                                        <p className="font-medium">
                                            {selectedVehicle.engine_type}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Engine Capacity
                                        </p>
                                        <p className="font-medium">
                                            {selectedVehicle.engine_cc} cc
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Vehicle Class
                                        </p>
                                        <p className="font-medium">
                                            {selectedVehicle.vehicle_class}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Drivetrain
                                        </p>
                                        <p className="font-medium">
                                            {selectedVehicle.drivetrain}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Weight
                                        </p>
                                        <p className="font-medium">
                                            {selectedVehicle.weight_kg} kg
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Average Daily Distance
                                        </p>
                                        <p className="font-medium">
                                            {selectedVehicle.avg_daily_km} km
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ownership Confirmation */}
                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <Checkbox
                                    id="confirm"
                                    checked={confirmed}
                                    onCheckedChange={(checked: boolean) =>
                                        setConfirmed(checked === true)
                                    }
                                />

                                <div className="space-y-1">
                                    <Label
                                        htmlFor="confirm"
                                        className="cursor-pointer font-medium"
                                    >
                                        Confirm vehicle ownership
                                    </Label>

                                    <p className="text-xs text-muted-foreground">
                                        I confirm that this vehicle belongs
                                        to me and that the information shown
                                        above is correct.
                                    </p>
                                </div>
                                <Button variant="destructive" onClick={cancel}>Cancel</Button>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <LoadingButton
                        type="submit"
                        className="w-full h-11 cursor-pointer"
                        loading={auxLoading}
                        disabled={!selectedVehicle || !confirmed}
                        loadingChildren="Adding..."
                    >
                        Add Vehicle
                    </LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    );
}
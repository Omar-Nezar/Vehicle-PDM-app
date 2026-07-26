import { useState, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { type RootState } from "src/store/store";
import { addCar } from "src/slices/carSlice";
import showToast from "../common/Toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    vehicleSchema,
    type VehicleFormData,
    brands,
    models,
} from "@schemas/car.schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxList,
    ComboboxItem,
} from "@/components/ui/combobox";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AddCarModal({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state: RootState) => state.car);

    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            make: "",
            model: "",
        },
    });

    const onSubmit = async (data: VehicleFormData) => {
        const promise = dispatch(addCar(data)).unwrap();

        showToast({
            promise,
            message: "Car Details Added Successfully",
            description: "Car Details Saved",
            errMsg: "Failed to Add Car",
        });

        await promise;
        reset();
        setOpen(false); // close modal after success
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger>
                {children}
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader className="text-center">
                    <DialogTitle>Add Vehicle</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Brand */}
                    <div className="space-y-2">
                        <Label>Brand</Label>

                        <Combobox
                            items={brands}
                            value={watch("make")}
                            onValueChange={(value) =>
                                setValue("make", value ?? "", { shouldValidate: true })
                            }
                        >
                            <ComboboxInput placeholder="Select Brand" />
                            <ComboboxContent>
                                <ComboboxEmpty>No items found</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>

                        {errors.make && (
                            <p className="text-sm text-red-500">{errors.make.message}</p>
                        )}
                    </div>

                    {/* Model */}
                    <div className="space-y-2">
                        <Label>Model</Label>

                        <Combobox
                            items={models}
                            value={watch("model")}
                            onValueChange={(value) =>
                                setValue("model", value ?? "", { shouldValidate: true })
                            }
                        >
                            <ComboboxInput placeholder="Select Model" />
                            <ComboboxContent>
                                <ComboboxEmpty>No items found</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>

                        {errors.model && (
                            <p className="text-sm text-red-500">{errors.model.message}</p>
                        )}
                    </div>

                    {/* Year + Mileage */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Year</Label>
                            <Input
                                type="number"
                                {...register("year", { valueAsNumber: true })}
                            />
                            {errors.year && (
                                <p className="text-sm text-red-500">{errors.year.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Mileage</Label>
                            <Input
                                type="number"
                                {...register("mileage", { valueAsNumber: true })}
                            />
                            {errors.mileage && (
                                <p className="text-sm text-red-500">
                                    {errors.mileage.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Plate */}
                    <div className="space-y-2">
                        <Label>Plate Number</Label>
                        <Input {...register("plateNumber")} />
                        {errors.plateNumber && (
                            <p className="text-sm text-red-500">
                                {errors.plateNumber.message}
                            </p>
                        )}
                    </div>

                    {/* VIN */}
                    <div className="space-y-2">
                        <Label>VIN</Label>
                        <Input {...register("vin")} />
                        {errors.vin && (
                            <p className="text-sm text-red-500">{errors.vin.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Adding..." : "Add Vehicle"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
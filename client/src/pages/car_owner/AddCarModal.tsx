import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { type RootState } from "src/store/store";
import { addCar, updateCar } from "src/slices/carSlice";
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
import { Separator } from "@/components/ui/separator"

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
import LoadingButton from "../common/LoadingButton";

type AddCarModalProps = {
    children: React.ReactElement;
    mode?: "add" | "edit";
    car?: Partial<VehicleFormData> & { _id?: string };
};

export default function AddCarModal({
    children,
    mode = "add",
    car,
}: AddCarModalProps) {
    const dispatch = useAppDispatch();
    const { auxLoading } = useAppSelector((state: RootState) => state.car);

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
            make: car?.make ?? "",
            model: car?.model ?? "",
            year: car?.year,
            mileage: car?.mileage,
            plateNumber: car?.plateNumber ?? "",
            vin: car?.vin ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                make: car?.make ?? "",
                model: car?.model ?? "",
                year: car?.year,
                mileage: car?.mileage,
                plateNumber: car?.plateNumber ?? "",
                vin: car?.vin ?? "",
            });
        }
    }, [open, car, reset]);

    const onSubmit = async (data: VehicleFormData) => {
        const action =
            mode === "edit" && car?._id
                ? updateCar({ id: car._id, data })
                : addCar(data);

        const promise = dispatch(action).unwrap();

        showToast({
            promise,
            message:
                mode === "edit"
                    ? "Car updated successfully"
                    : "Car added successfully",
            description:
                mode === "edit"
                    ? "Changes saved"
                    : "Car details saved",
        });

        await promise;
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger render={children} />

            <DialogContent className="max-w-md">
                <DialogHeader className="text-center">
                    <DialogTitle>
                        {mode === "edit" ? "Edit Vehicle" : "Add Vehicle"}
                    </DialogTitle>
                    <Separator />
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
                                min={1980}
                                max={new Date().getFullYear()}
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
                        <Input disabled={mode === "edit"}
                            {...register("vin")} />
                        {errors.vin && (
                            <p className="text-sm text-red-500">{errors.vin.message}</p>
                        )}
                    </div>

                    <LoadingButton className="w-full h-11 cursor-pointer" type="submit" loading={auxLoading} loadingChildren={mode === "edit" ? "Editing..." : "Adding..."}>
                        {mode === "edit" ? "Edit Car" : "Add Car"}
                    </LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    );
};
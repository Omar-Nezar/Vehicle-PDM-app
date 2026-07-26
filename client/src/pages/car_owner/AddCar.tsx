import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { type RootState } from "src/store/store";
import { addCar } from "src/slices/carSlice";
import showToast from "../common/Toast";
import Layout from "../common/Layout";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, type VehicleFormData, brands, models } from "@schemas/car.schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from "@/components/ui/combobox";

const AddVehicle = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state: RootState) => state.car);

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
            "make": "",
            "model": ""
        }
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
        reset(); // clear form
    };

    return (
        <Layout>
            <div className="flex justify-center items-center min-h-screen/20 bg-muted/40">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Add Vehicle</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Brand */}
                            <div className="space-y-2">
                                <Label>Brand</Label>

                                <Combobox
                                    items={brands}
                                    value={watch("make")}
                                    onValueChange={(value) =>
                                        setValue("make", value ?? "", { shouldValidate: true })
                                    }>
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

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out 
                                    ${errors.make ? "max-h-10 opacity-100 mb-1" : "max-h-0 opacity-0"}`}
                                >
                                    <p className="text-sm text-red-500">{errors.make?.message}</p>
                                </div>
                            </div>

                            {/* Model */}
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <Combobox
                                    items={models}
                                    value={watch("model")}
                                    onValueChange={(value) =>
                                        setValue("model", value ?? "", { shouldValidate: true })
                                    }>
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
                                <div
                                    className={`overflow-hidden transition-all duration-400 ease-in-out 
                                    ${errors.model
                                            ? "max-h-10 opacity-100 mb-1"
                                            : "max-h-0 opacity-0"}`}
                                >
                                    <p className="text-sm text-red-500">{errors.model?.message}</p>
                                </div>
                            </div>

                            {/* Year + Mileage */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input
                                        type="number"
                                        {...register("year", { valueAsNumber: true })}
                                    />
                                    <div
                                        className={`overflow-hidden transition-all duration-400 ease-in-out 
                                        ${errors.year
                                                ? "max-h-10 opacity-100 mb-1"
                                                : "max-h-0 opacity-0"}`}
                                    >
                                        <p className="text-sm text-red-500">{errors.year?.message}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Mileage</Label>
                                    <Input
                                        type="number"
                                        {...register("mileage", { valueAsNumber: true })}
                                    />
                                    <div
                                        className={`overflow-hidden transition-all duration-400 ease-in-out 
                                        ${errors.mileage
                                                ? "max-h-10 opacity-100 mb-1"
                                                : "max-h-0 opacity-0"}`}
                                    >
                                        <p className="text-sm text-red-500">{errors.mileage?.message}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Plate */}
                            <div className="space-y-2">
                                <Label>Plate Number</Label>
                                <Input {...register("plateNumber")} />
                                <div
                                    className={`overflow-hidden transition-all duration-400 ease-in-out 
                                    ${errors.plateNumber
                                            ? "max-h-10 opacity-100 mb-1"
                                            : "max-h-0 opacity-0"}`}
                                >
                                    <p className="text-sm text-red-500">
                                        {errors.plateNumber?.message}
                                    </p>
                                </div>
                            </div>

                            {/* VIN */}
                            <div className="space-y-2">
                                <Label>VIN</Label>
                                <Input {...register("vin")} />
                            </div>
                            <div
                                className={`overflow-hidden transition-all duration-400 ease-in-out 
                                ${errors.vin
                                        ? "max-h-10 opacity-100 mb-1"
                                        : "max-h-0 opacity-0"}`}
                            >
                                <p className="text-sm text-red-500">
                                    {errors.vin?.message}
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Adding..." : "Add Vehicle"}
                            </Button>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default AddVehicle;
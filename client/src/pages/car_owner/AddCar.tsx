import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { type RootState } from "src/store/store"
import { addCar } from "src/slices/carSlice";
import showToast from "../common/Toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AddVehicle = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state: RootState) => state.car);

    const [form, setForm] = useState({
        make: "",
        model: "",
        year: "",
        plateNumber: "",
        mileage: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const promise = await dispatch(addCar({
            ...form,
            year: Number(form.year),
            mileage: Number(form.mileage),
        })).unwrap();

        showToast({ promise, message: "Car Details Added Successfully", description: "Car Details Saved", errMsg: "Failed to Add Car" })
        await promise;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Add Vehicle</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="make">Make</Label>
                            <Input id="make" name="make" onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input id="model" name="model" onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Input id="year" name="year" type="number" onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mileage">Mileage</Label>
                                <Input id="mileage" name="mileage" type="number" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plateNumber">Plate Number</Label>
                            <Input id="plateNumber" name="plateNumber" onChange={handleChange} />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Adding..." : "Add Vehicle"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddVehicle;
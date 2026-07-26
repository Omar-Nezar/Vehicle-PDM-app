import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { type RootState } from "src/store/store";
import { getUserCars, deleteCar } from "src/slices/carSlice";

import Layout from "../common/Layout";
import showToast from "../common/Toast";
import AddCarModal from "./AddCarModal";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Trash2, Pencil, Plus } from "lucide-react";

export default function ManageCars() {
    const dispatch = useAppDispatch();
    const { cars, loading } = useAppSelector(
        (state: RootState) => state.car
    );

    useEffect(() => {
        dispatch(getUserCars());
    }, [dispatch, cars]);

    console.warn("Cars! ", cars)
    const handleDelete = async (id: string) => {
        const promise = dispatch(deleteCar(id)).unwrap();

        showToast({
            promise,
            message: "Vehicle deleted",
            description: "Vehicle removed successfully",
        });

        await promise;
    };

    return (
        <Layout>
            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">My Vehicles</h1>

                    <AddCarModal>
                        <Button className="flex items-center gap-2">
                            <Plus size={16} />
                            Add Vehicle
                        </Button>
                    </AddCarModal>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="text-muted-foreground">Loading vehicles...</p>
                )}

                {/* Empty State */}
                {!loading && cars.length === 0 && (
                    <div className="text-center py-16 border rounded-xl">
                        <p className="text-muted-foreground mb-4">
                            No vehicles found
                        </p>
                        <p className="text-muted-foreground text-xs mb-4">
                            Add your first vehicle
                        </p>
                    </div>
                )}

                {/* Vehicle Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <Card key={car._id} className="shadow-md hover:shadow-lg transition">
                            <CardHeader>
                                <CardTitle>
                                    {car.make} {car.model}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <p><strong>Year:</strong> {car.year}</p>
                                <p><strong>Plate:</strong> {car.plateNumber}</p>
                                <p><strong>Mileage:</strong> {car.mileage} km</p>

                                {/* Actions */}
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" size="icon">
                                        <Pencil size={16} />
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(car._id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </Layout>
    );
};
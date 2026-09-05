// features/vehicle/vehicleSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    addCarRequest,
    getCarsRequest,
    getVehicleByVidRequest,
    delCarRequest,
    getCarsSurvivalRequest,
} from "./api/carApi";

export interface Vehicle {
    _id: string;
    vehicle_id: string; // VID (e.g. "V1")
    model: string;
    engine_type: string;
    engine_cc: number;
    weight_kg: number;
    vehicle_class: string;
    drivetrain: string;
    manufacture_year: number;
    avg_daily_km: number;
}

export const addCar = createAsyncThunk(
    "vehicle/add",
    async (vid: string, thunkAPI) => {
        try {
            return await addCarRequest(vid);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to add vehicle"
            );
        }
    }
);


// -----------------------------
// Get user's vehicle registry
// -----------------------------

export const getUserCars = createAsyncThunk(
    "vehicle/getUserCars",
    async (_, thunkAPI) => {
        try {
            return await getCarsRequest();
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch vehicles"
            );
        }
    }
);

export const getCarsSurvival = createAsyncThunk(
    "vehicle/getCarsSurvival",
    async (_, thunkAPI) => {
        try {
            return await getCarsSurvivalRequest();
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch survival predictions"
            );
        }
    }
);


// -----------------------------
// Get one vehicle by VID
// -----------------------------

export const getVehicleByVid = createAsyncThunk(
    "vehicle/getByVid",
    async (vid: string, thunkAPI) => {
        try {
            return await getVehicleByVidRequest(vid);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch vehicle"
            );
        }
    }
);

// -----------------------------
// Remove vehicle from registry
// -----------------------------

export const deleteCar = createAsyncThunk(
    "vehicle/deleteCar",
    async (vid: string, thunkAPI) => {
        try {
            return await delCarRequest(vid);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to delete vehicle"
            );
        }
    }
);

interface VehicleState {
    cars: Vehicle[];
    survival: unknown;
    selectedVehicle?: Vehicle
    loading: boolean;
    survivalLoading: boolean;
    auxLoading: boolean;
    findLoading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: VehicleState = {
    cars: [],
    survival: {},
    selectedVehicle: undefined,
    loading: false,
    survivalLoading: false,
    auxLoading: false,
    findLoading: false,
    error: null,
    success: false,
};

const vehicleSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {
        resetVehicleState: (state) => {
            state.loading = false;
            state.survivalLoading = false;
            state.auxLoading = false;
            state.findLoading = false;
            state.selectedVehicle = undefined;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {

        // =============================
        // ADD
        // =============================

        builder
            .addCase(addCar.pending, (state) => {
                state.auxLoading = true;
                state.error = null;
                state.success = false;
            })

            .addCase(addCar.fulfilled, (state, action) => {
                state.auxLoading = false;
                state.error = null;
                state.success = true;
                state.cars = action.payload.cars;
            })

            .addCase(addCar.rejected, (state, action) => {
                state.auxLoading = false;
                state.success = false;
                state.error = action.payload as string;
            });


        // =============================
        // GET USER CARS
        // =============================

        builder
            .addCase(getUserCars.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })

            .addCase(getUserCars.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.cars = action.payload.cars;
            })

            .addCase(getUserCars.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(getCarsSurvival.pending, (state) => {
                state.survivalLoading = true;
                state.error = null;
            })
            .addCase(getCarsSurvival.fulfilled, (state, action) => {
                state.survivalLoading = false;
                state.survival = action.payload;
            })
            .addCase(getCarsSurvival.rejected, (state, action) => {
                state.survivalLoading = false;
                state.error = action.payload as string;
            });


        // =============================
        // GET ONE VEHICLE
        // =============================

        builder
            .addCase(getVehicleByVid.pending, (state) => {
                state.findLoading = true;
                state.error = null;
            })

            .addCase(getVehicleByVid.fulfilled, (state, action) => {
                state.findLoading = false;
                state.error = null;
                state.selectedVehicle = action.payload.car;
            })

            .addCase(getVehicleByVid.rejected, (state, action) => {
                state.findLoading = false;
                state.error = action.payload as string;
            });


        // =============================
        // DELETE
        // =============================

        builder
            .addCase(deleteCar.pending, (state) => {
                state.auxLoading = true;
                state.error = null;
                state.success = false;
            })

            .addCase(deleteCar.fulfilled, (state, action) => {
                state.auxLoading = false;
                state.error = null;
                state.success = true;
                state.cars = action.payload.cars;

                /*
                 * If the deleted vehicle was selected,
                 * clear it.
                 */
                if (
                    state.selectedVehicle &&
                    state.selectedVehicle.vehicle_id ===
                    action.meta.arg
                ) {
                    state.selectedVehicle = undefined;
                }
            })

            .addCase(deleteCar.rejected, (state, action) => {
                state.auxLoading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetVehicleState } = vehicleSlice.actions;
export default vehicleSlice.reducer;
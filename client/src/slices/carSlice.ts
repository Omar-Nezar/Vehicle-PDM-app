// features/vehicle/vehicleSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCarRequest, getCarsRequest, delCarRequest, updCarRequest } from "./api/carApi";

interface VehicleState {
    cars: any[];
    loading: boolean;
    auxLoading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: VehicleState = {
    cars: [],
    loading: false,
    auxLoading: false,
    error: null,
    success: false,
};

export const addCar = createAsyncThunk(
    "vehicle/add",
    async (vehicleData: any, thunkAPI) => {
        try {
            return await addCarRequest(vehicleData);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to add vehicle"
            );
        }
    }
);

export const getUserCars = createAsyncThunk(
    "vehicle/getUserCars",
    async (_, thunkAPI) => {
        try {
            const res = await getCarsRequest()
            return res;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

export const updateCar = createAsyncThunk(
    "vehicle/update",
    async (
        { id, data }: { id: string; data: any },
        thunkAPI
    ) => {
        try {
            return await updCarRequest(id, data);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to update vehicle"
            );
        }
    }
);

export const deleteCar = createAsyncThunk(
    "vehicle/deleteCar",
    async (_id: string, thunkApi) => {
        try {
            return await delCarRequest(_id);
        } catch (err: any) {
            return thunkApi.rejectWithValue(err.response?.data?.message);
        }
    }
);

const vehicleSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {
        resetVehicleState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // ADD
            .addCase(addCar.pending, (state) => {
                state.auxLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addCar.fulfilled, (state, action) => {
                state.auxLoading = false;
                state.success = true;
                state.error = null;
                state.cars.unshift(action.payload.car);
            })
            .addCase(addCar.rejected, (state, action) => {
                state.auxLoading = false;
                state.error = action.payload as string;
            });
        builder
            // GET
            .addCase(getUserCars.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getUserCars.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = action.payload.cars;
                state.success = true
            })
            .addCase(getUserCars.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
        builder
            // DELETE
            .addCase(deleteCar.pending, (state) => {
                state.auxLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                state.auxLoading = false
                state.error = null
                state.success = true
                state.cars = state.cars.filter(
                    (car) => car._id !== action.meta.arg
                );
            })
            .addCase(deleteCar.rejected, (state, action) => {
                state.auxLoading = false;
                state.success = false;
                state.error = action.payload as string;
            });
        builder
            // UPDATE
            .addCase(updateCar.pending, (state, action) => {
                state.auxLoading = true;
                state.success = false;
                state.error = null
            })
            .addCase(updateCar.fulfilled, (state, action) => {
                state.auxLoading = false;
                state.success = false;
                state.error = null
                const car = action.payload.car
                const index = state.cars.findIndex(
                    (c) => c._id === car._id
                );

                if (index !== -1) {
                    state.cars[index] = car;
                }
            })
            .addCase(updateCar.rejected, (state, action) => {
                state.auxLoading = false;
                state.success = false;
                state.error = action.payload as string
            });
    },
});

export const { resetVehicleState } = vehicleSlice.actions;
export default vehicleSlice.reducer;
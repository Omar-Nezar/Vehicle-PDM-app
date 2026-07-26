// features/vehicle/vehicleSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCarRequest, getCarsRequest, delCarRequest } from "./api/carApi";

interface VehicleState {
    cars: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: VehicleState = {
    cars: [],
    loading: false,
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
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addCar.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(addCar.rejected, (state, action) => {
                state.loading = false;
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
            })
            .addCase(getUserCars.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
        builder
            // DELETE
            .addCase(deleteCar.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = true
                state.cars = state.cars.filter(
                    (car) => car._id !== action.payload
                );
            })
            .addCase(deleteCar.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetVehicleState } = vehicleSlice.actions;
export default vehicleSlice.reducer;
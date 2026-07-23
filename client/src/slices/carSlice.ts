// features/vehicle/vehicleSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCarRequest } from "./api/carApi";

interface VehicleState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: VehicleState = {
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
    },
});

export const { resetVehicleState } = vehicleSlice.actions;
export default vehicleSlice.reducer;
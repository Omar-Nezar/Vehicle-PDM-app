import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsersRequest, getUserCarsRequest, delUserRequest, getAuditLogsRequest, getServiceHistoryRequest, getVehiclesRequest } from "./api/userApi";
import type { Vehicle } from "./carSlice";

type User = {
    _id: string;
    name: string;
    email: string;
    type: string;
};

export interface AuditLog {
    _id: string;
    userId?: string;
    method: string;
    route: string;
    statusCode: number;
    body?: any;
    ip?: string;
    userAgent?: string;
    durationMs?: number;
    createdAt: string;
}

export interface ServiceHistory {
    _id: string;
    vehicle_id: string;
    service_date: Date;
    season: string;
    ambient_temp: number;
    vehicle_age: number;
    mileage: number;
    missed_services: number;
    service_type: string;
    failure_occurred: number;
    failure_type?: string;
    parts_replaced?: string;
    service_cost: number;
    createdAt: Date;
    updatedAt: Date;
}

export const delUser = createAsyncThunk(
    "users/delUser",
    async (_id: string, thunkAPI) => {
        try {
            return await delUserRequest(_id)
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "User Deletion Failed"
            );
        }
    }
);

export const getUsers = createAsyncThunk(
    "users/getUsers",
    async (_, thunkAPI) => {
        try {
            const data = await getUsersRequest()
            return data
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "User Fetch Failed"
            );
        }
    }
);

export const getUserCars = createAsyncThunk(
    "admin/getUserCars",
    async (userId: string, thunkAPI) => {
        try {
            return await getUserCarsRequest(userId);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "User Cars Fetch Failed"
            );
        }
    }
);

export const getAuditLogs = createAsyncThunk(
    "admin/getLogs",
    async (_, thunkAPI) => {
        try {
            return await getAuditLogsRequest();
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Audit Logs Fetch Failed"
            );
        }
    }
);

export const getServiceHistory = createAsyncThunk(
    "admin/getServiceHistory",
    async (_, thunkAPI) => {
        try {
            return await getServiceHistoryRequest()
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Service history fetch failed"
            )
        }
    }
)

export const getVehicles = createAsyncThunk(
    "admin/getVehicles",
    async (_, thunkAPI) => {
        try {
            return await getVehiclesRequest()
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Vehicles fetch failed"
            )
        }
    }
)

type State = {
    users: User[];
    userCars: { [userId: string]: Vehicle[] };
    loading: boolean;
    delLoading: boolean;
    auxLoading: boolean;
    error: string | null;
    logs: AuditLog[];
    history: ServiceHistory[];
    vehicles: Vehicle[];
};

const initialState: State = {
    users: [],
    userCars: {},
    loading: false,
    delLoading: false,
    auxLoading: false,
    error: null,
    logs: [],
    history: [],
    vehicles: []
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GET USERS
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            // GET USER CARS
            .addCase(getUserCars.pending, (state) => {
                state.auxLoading = true;
                state.error = null;
            })
            .addCase(getUserCars.fulfilled, (state, action) => {
                state.auxLoading = false;
                state.userCars[action.meta.arg] = action.payload.cars;
            })
            .addCase(getUserCars.rejected, (state, action) => {
                state.auxLoading = false;
                state.error = action.payload as string;
            });
        builder
            // DEL
            .addCase(delUser.pending, (state) => {
                state.delLoading = true;
                state.error = null;
            })
            .addCase(delUser.fulfilled, (state, action) => {
                state.delLoading = false;
                state.users = state.users.filter(
                    (user) => user._id !== action.meta.arg
                );
            })
            .addCase(delUser.rejected, (state, action) => {
                state.delLoading = false;
                state.error = action.payload as string;
            });
        builder
            // AUDIT
            .addCase(getAuditLogs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload.logs;
            })
            .addCase(getAuditLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            // SERVICE HISTORY
            .addCase(getServiceHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getServiceHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload.history
            })
            .addCase(getServiceHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            });
        builder
            // VEHICLES
            .addCase(getVehicles.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVehicles.fulfilled, (state, action) => {
                state.loading = false
                state.vehicles = action.payload.vehicles
            })
            .addCase(getVehicles.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
});

export default userSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    loginRequest,
    registerRequest,
    type LoginPayload,
    type RegisterPayload,
} from "./api/authApi";

interface AuthState {
    token: any;
    loading: boolean;
    error: string | null;
}

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data: LoginPayload, thunkAPI) => {
        try {

            const res = await loginRequest(data)
            const token = res.token;
            localStorage.setItem("authToken", token);
            return res;

        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (data: RegisterPayload, thunkAPI) => {
        try {
            const res = await registerRequest(data);
            const token = res.token
            localStorage.setItem("authToken", token);
            return res;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Registration failed"
            );
        }
    }
);

const initialState: AuthState = {
    token: localStorage.getItem("authToken"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
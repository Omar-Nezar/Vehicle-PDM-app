import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    loginRequest,
    registerRequest,
    verifyRegistrationRequest,
    logoutRequest,
    updUserRequest,
    forgotPasswordRequest,
    resetPasswordRequest,
    changePasswordRequest,
    type LoginPayload,
    type RegisterPayload,
    type ChangePasswordPayload
} from "./api/authApi";

interface AuthState {
    token: any;
    loading: boolean;
    msg: string | null;
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

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            return await logoutRequest()
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Logout failed"
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (data: RegisterPayload, thunkAPI) => {
        try {
            return await registerRequest(data);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const verifyRegistration = createAsyncThunk(
    "auth/verifyRegistration",
    async (token: string, thunkApi) => {
        try {
            const res = await verifyRegistrationRequest(token)
            const authToken = res.token
            localStorage.setItem("authToken", authToken);
            return res;
        } catch (err: any) {
            return thunkApi.rejectWithValue(
                err.response?.data?.message || "Registration verification failed"
            )
        }
    }
)

export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async (data: { name: string }, thunkApi) => {
        try {
            return await updUserRequest(data)
        } catch (err: any) {
            return thunkApi.rejectWithValue(
                err.response?.data?.message || "Update failed"
            );
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email: string, thunkApi) => {
        try {
            return await forgotPasswordRequest({ email })
        } catch (err: any) {
            return thunkApi.rejectWithValue(
                err.response?.data?.message || "Something went wrong"
            );
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (data: { id: string; token: string; password: string; confirmPassword: string }, thunkApi) => {
        try {
            return await resetPasswordRequest(data)
        } catch (err: any) {
            return thunkApi.rejectWithValue(
                err.response?.data?.message || "Reset failed"
            );
        }
    }
);

export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (data: ChangePasswordPayload, thunkApi) => {
        try {
            return await changePasswordRequest(data);
        } catch (err: any) {
            return thunkApi.rejectWithValue(
                err.response?.data?.message || "Password change failed"
            );
        }
    }
);

const initialState: AuthState = {
    token: localStorage.getItem("authToken"),
    loading: false,
    msg: null,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token;
            state.msg = action.payload.msg;
        },
        resetAuth: (state) => {
            state.token = null
            state.loading = false
            state.msg = null
            state.error = null
        }
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
            })
            .addCase(registerUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
        // Register verification
        builder
            .addCase(verifyRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyRegistration.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(verifyRegistration.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            // UPD
            .addCase(updateUser.pending, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.token = action.payload.token
                localStorage.setItem("authToken", action.payload.token);
            })
            .addCase(updateUser.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
        // LOGOUT
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false
                state.token = null;
            })
            .addCase(logoutUser.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload;
            });
        // FORGOT PASSWORD
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.msg = action.payload.message
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        // RESET PASSWORD
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.msg = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        // CHANGE PASSWORD
        builder
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.msg = action.payload.message;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setToken, resetAuth } = authSlice.actions;
export default authSlice.reducer;
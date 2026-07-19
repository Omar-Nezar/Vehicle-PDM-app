import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsersRequest } from "./api/userApi";

export const getUsers = createAsyncThunk(
    "users/getUsers",
    async (_, thunkAPI) => {
        try {
            return getUsersRequest()
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

type User = {
    _id: string;
    name: string;
    email: string;
    type: string;
};

type State = {
    users: User[];
    loading: boolean;
    error: string | null;
};

const initialState: State = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
    },
});

export default userSlice.reducer;
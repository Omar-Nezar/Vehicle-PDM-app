import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsersRequest } from "./api/userApi";
import { delUserRequest } from "./api/userApi";

export const delUser = createAsyncThunk(
    "users/delUser",
    async (data: string, thunkAPI) => {
        try {
            return await delUserRequest(data)
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "User Fetch Failed"
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

type User = {
    _id: string;
    name: string;
    email: string;
    type: string;
};

type State = {
    users: User[];
    loading: boolean;
    delLoading: boolean;
    error: string | null;
};

const initialState: State = {
    users: [],
    loading: false,
    delLoading: false,
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
        builder
            .addCase(delUser.pending, (state) => {
                state.delLoading = true;
                state.error = null;
            })
            .addCase(delUser.fulfilled, (state, action) => {
                state.delLoading = false;
            })
            .addCase(delUser.rejected, (state, action) => {
                state.delLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;
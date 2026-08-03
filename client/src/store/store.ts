import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice"
import carReducer from "../slices/carSlice";
import { injectStore } from "src/slices/api/base";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    car: carReducer
  },
});

injectStore(store);

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
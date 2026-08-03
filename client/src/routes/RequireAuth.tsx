import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function RequireAuth() {
    const { token, msg } = useAppSelector((state) => state.auth) || { token: localStorage.getItem("authToken"), msg: null };

    if (!token) {
        if (!msg) {
            return <Navigate to="/login" replace state={{ msg: "Unauthorized Access!" }} />;
        } else {
            return <Navigate to="/login" replace state={{ msg, description: "Please log in again." }} />;
        }
    }

    return <Outlet />;
}
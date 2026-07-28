// src/routes/RequireGuest.tsx
import { Navigate, Outlet } from "react-router-dom";
import determineHome from "src/functions/utility/determineHome";

export default function RequireGuest() {
    const route = determineHome()

    // If logged in -> kick them out of auth pages
    if (route !=="/") {
        return (
            <Navigate
                to={route}
                replace
                state={{
                    msg: "Already logged in!",
                    description: "Redirected to your dashboard",
                }}
            />
        );
    }

    return <Outlet />;
}
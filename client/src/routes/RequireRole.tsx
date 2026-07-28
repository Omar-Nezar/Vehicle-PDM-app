import { Navigate, Outlet } from "react-router-dom";
import getUserType from "src/functions/utility/getUserType";
import determineHome from "src/functions/utility/determineHome";

export default function RequireRole({ role }: { role: string }) {
    const type = getUserType()


    if (!type || type !== role) {
        return (
            <Navigate
                to={determineHome(type!)}
                replace
                state={{
                    msg: "Unauthorized Access!",
                    description: "You have been redirected to your home page"
                }}
            />
        )
    }

    return <Outlet />;
}
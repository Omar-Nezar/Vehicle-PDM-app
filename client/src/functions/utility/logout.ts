import { useAppDispatch } from "src/store/hooks";
import { logoutUser } from "src/slices/authSlice";
import showToast from "src/pages/common/Toast";
import { useNavigate } from "react-router-dom";

export const useHandleLogout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async (useCase?: string) => {
        const promise = dispatch(logoutUser()).unwrap();

        if (useCase === "chgPwd") {
            showToast({
                promise,
                message: "Password changed",
                description:
                    "Your password has been changed successfully. You have been automatically logged out.",
            });
        } else {
            showToast({
                promise,
                message: "Logged out",
                description: "You have been logged out successfully.",
            });
        }

        try {
            await promise;

            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return handleLogout;
};
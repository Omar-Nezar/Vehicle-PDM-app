import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import showToast from "../common/Toast";
import { useAppDispatch } from "src/store/hooks";
import { verifyRegistration } from "src/slices/authSlice";

export default function VerifyRegistration() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { token } = useParams<{ token: string }>();
    const verified = useRef(false);
    useEffect(() => {
        const verify = async () => {
            if (verified.current) return;
            verified.current = true;
            if (!token) {
                showToast({
                    message: "Invalid Link",
                    description: "Verification token is missing",
                    errMsg: "Verification failed",
                });

                navigate("/login");
                return;
            }

            try {
                const promise = dispatch(verifyRegistration(token)).unwrap();

                showToast({
                    promise,
                    message: "Registration Successful",
                    description: "You have been automatically logged in",
                });

                await promise;

                navigate("/carownerhome");

            } catch (error) {
                console.error(error);

                navigate("/login");
            }
        };

        verify();

    }, [token, dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">
                Verifying your registration...
            </p>
        </div>
    );
}
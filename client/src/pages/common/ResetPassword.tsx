import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { resetPassword } from "src/slices/authSlice";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPwdSchema, type ResetFormData } from "@schemas/resetPwd.schema";

import showToast from "./Toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ResetPassword() {
    const { id, token } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { loading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!id || !token) {
            navigate("/login", {
                replace: true,
                state: { msg: "Unauthorized Access!" }
            });
        }
    }, [id, token, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetPwdSchema),
    });

    const onSubmit = async (data: ResetFormData) => {
        if (!id || !token) {
            return showToast({
                message: "Error",
                description: "Invalid reset link",
            });
        }

        const promise = dispatch(resetPassword({ id, token, password: data.password, confirmPassword: data.confirmPassword })).unwrap();
        showToast({ promise, message: "Password Reset Successful!", description: "Your password has been reset" })

        await promise
        navigate("/login", { replace: true })
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        Reset Password
                    </CardTitle>
                    <CardDescription>
                        Enter your new password
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Password */}
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" {...register("password")} />
                            <div
                                className={`overflow-hidden transition-all duration-400 ease-in-out 
                                    ${errors.password
                                        ? "max-h-10 opacity-100 mb-1"
                                        : "max-h-0 opacity-0"}`}
                            >
                                <p className="text-red-500 text-sm">{errors.password?.message}</p>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label>Confirm Password</Label>
                            <Input type="password" {...register("confirmPassword")} />
                            <div
                                className={`overflow-hidden transition-all duration-400 ease-in-out 
                                    ${errors.confirmPassword
                                        ? "max-h-10 opacity-100 mb-1"
                                        : "max-h-0 opacity-0"}`}
                            >
                                <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
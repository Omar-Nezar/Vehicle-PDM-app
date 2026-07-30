import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { resetPassword } from "src/slices/authSlice";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPwdSchema } from "@schemas/resetPwd.schema";
import { z } from "zod";

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

type FormData = z.infer<typeof resetPwdSchema>;

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
    } = useForm<FormData>({
        resolver: zodResolver(resetPwdSchema),
    });

    const onSubmit = (data: FormData) => {
        if (!id || !token) {
            return showToast({
                message: "Error",
                description: "Invalid reset link",
            });
        }

        dispatch(resetPassword({ id, token, password: data.password }));
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
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label>Confirm Password</Label>
                            <Input type="password" {...register("confirm")} />
                            {errors.confirm && (
                                <p className="text-sm text-red-500">
                                    {errors.confirm.message}
                                </p>
                            )}
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
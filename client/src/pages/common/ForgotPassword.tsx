import { Link } from "react-router-dom"
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { RotateCcwKey } from "lucide-react"

import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { forgotPassword } from "src/slices/authSlice";
import showToast from "./Toast"
import LoadingButton from "./LoadingButton";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const dispatch = useAppDispatch();

    const { loading } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email) {
            const res = await dispatch(forgotPassword(email)).unwrap();
            showToast({ message: res.message, description: "Please check your email" })
        } else {
            showToast({ message: "Reset aborted!", description: "Please enter a value" })
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-2 text-center">

                    <div className="mx-auto flex h-15 w-15 items-center justify-center">
                        <RotateCcwKey className="h-15 w-15 text-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        Forgot Password
                    </CardTitle>

                    <CardDescription>
                        Enter your email address to reset your password
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-2">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <LoadingButton className="w-full cursor-pointer" type="submit" loading={loading} loadingChildren="Sending...">
                            Reset Password
                        </LoadingButton>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">
                            OR
                        </span>
                        <Separator className="flex-1" />
                    </div>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't need help?
                        <Link to="/login">
                            <Button variant="link" size="sm" className="block pl-0 mt-1 mx-auto cursor-pointer">
                                Back to Login
                            </Button>
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
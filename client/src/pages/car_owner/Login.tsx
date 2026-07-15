import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { CircleUserRound } from "lucide-react"

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

import { loginUser } from "../../slices/authSlice";
import type { RootState, AppDispatch } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useAppSelector(
        (state: RootState) => state.auth
    );

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(loginUser(form)).unwrap()
            .then((res) => {
                if (res && res.user) {
                    navigate("/carownerhome");
                }
            })
            .catch((err) => {
                console.error("Login failed:", err);
            })
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-2 text-center">

                    <div className="mx-auto flex h-15 w-15 items-center justify-center">
                        <CircleUserRound className="h-15 w-15 text-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        Login
                    </CardTitle>

                    <CardDescription>
                        Sign in to access your vehicle maintenance dashboard
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-2">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">
                                    Password
                                </Label>

                            </div>

                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
                        </div>

                        <Button className="w-full h-11 cursor-pointer" type="submit" disabled={loading}>
                            Sign in
                        </Button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">
                            OR
                        </span>
                        <Separator className="flex-1" />
                    </div>
                    {error && (
                        <p className="text-red-500 text-center">
                            {error}
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-3 mt-6 text-center text-sm text-muted-foreground">
                        <p>
                            Don't have an account?
                            <Link to="/register">
                                <Button variant="link" size="sm" className="block pl-0 mt-1 mx-auto cursor-pointer">
                                    Create account
                                </Button>
                            </Link>
                        </p>

                        <p>
                            Lost your password?
                            <Link to="/forgotpassword">
                                <Button variant="link" size="sm" className="block pl-0 mt-1 mx-auto cursor-pointer">
                                    Forgot password
                                </Button>
                            </Link>
                        </p>
                    </div>

                    <p className="mt-3 text-center text-sm text-muted-foreground">
                        Not a Car Owner?
                        <Link to="/elevatedlogin">
                            <Button variant="link" size="sm" className="block pl-0 mt-1 mx-auto cursor-pointer">
                                Elevated Sign in
                            </Button>
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
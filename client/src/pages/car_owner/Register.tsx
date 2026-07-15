import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
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

import { registerUser } from "../../slices/authSlice";
import { useAppDispatch } from "../../store/hooks";

export default function Register() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    type RegisterFormData = {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>();

    const onSubmit = (data: RegisterFormData) => {
        dispatch(
            registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            })
        );
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">

                    <div className="mx-auto flex h-15 w-15 items-center justify-center">
                        <CircleUserRound className="h-15 w-15 text-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        Register
                    </CardTitle>

                    <CardDescription>
                        Create a new account to begin
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name
                            </Label>

                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>

                            </div>

                            <div>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Retype your password"
                                    {...register("confirmPassword", { required: "Please confirm your password" })}
                                />
                                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <Button className="w-full h-11 cursor-pointer" type="submit" disabled={isSubmitting}>
                            Create Account
                        </Button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">
                            OR
                        </span>
                        <Separator className="flex-1" />
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?
                        <Link to="/login">
                            <Button variant="link" size="sm" className="pl-1 cursor-pointer">
                                Sign in
                            </Button>
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
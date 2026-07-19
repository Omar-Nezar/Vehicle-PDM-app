import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { CircleUserRound } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod";

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
import { toast } from "sonner";

import { registerUser } from "../../slices/authSlice";
import { useAppDispatch } from "../../store/hooks";
import { registerSchema } from "@schemas/user.schema";

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
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormData) => {
        const promise = dispatch(registerUser({
            name: data.name,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        })).unwrap();

        toast.promise(promise, {
            loading: "Registering...",
            success: (data) => {
                localStorage.setItem("token", data.token);
                navigate("/carownerhome");
                return {
                    message: "Registration successful!",
                    description: "We have logged you in automatically.",
                    action: toast.dismiss()
                };
            },
            error: () =>
                "Registration failed!",
        });
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
                                {...register("name")}
                            />
                            <div
                                className={`overflow-hidden transition-all duration-400 ease-in-out 
                                    ${errors.name
                                        ? "max-h-10 opacity-100 mb-1"
                                        : "max-h-0 opacity-0"}`}
                            >
                                <p className="text-red-500 text-sm">{errors.name?.message}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                            />
                            <div
                                className={`overflow-hidden transition-all duration-400 ease-in-out 
                                    ${errors.email
                                        ? "max-h-10 opacity-100 mb-1"
                                        : "max-h-0 opacity-0"}`}
                            >
                                <p className="text-red-500 text-sm">{errors.email?.message}</p>
                            </div>
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
                                {...register("password")}
                            />
                            <div
                                className={`overflow-hidden transition-all duration-400 ease-in-out 
                                    ${errors.password
                                        ? "max-h-10 opacity-100 mb-1"
                                        : "max-h-0 opacity-0"}`}
                            >
                                <p className="text-red-500 text-sm">{errors.password?.message}</p>
                            </div>
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
                                    {...register("confirmPassword")}
                                />
                                <div
                                    className={`overflow-hidden transition-all duration-400 ease-in-out 
                                        ${errors.confirmPassword
                                            ? "max-h-10 opacity-100 mt-1"
                                            : "max-h-0 opacity-0"}`}
                                >
                                    <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
                                </div>
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
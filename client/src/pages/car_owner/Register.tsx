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

import { registerUser } from "../../slices/authSlice";
import { useAppDispatch } from "../../store/hooks";
import { registerSchema } from "@schemas/user.schema";
import LoadingButton from "../common/LoadingButton";
import showToast from "../common/Toast";
import PasswordInput from "../common/PasswordInput";
import ErrorDiv from "../common/ErrorDiv";

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

    const onSubmit = async (data: RegisterFormData) => {
        const promise = dispatch(registerUser({
            name: data.name,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        })).unwrap();

        showToast({ promise, message: "Please check your email", description: "Please verify your email to complete registration" })

        await promise
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
                            <ErrorDiv message={errors.name?.message} />
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
                            <ErrorDiv message={errors.name?.message} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">
                                    Password
                                </Label>

                            </div>

                            <PasswordInput
                                id="password"
                                placeholder="Enter your password"
                                {...register("password")}
                            />
                            <ErrorDiv message={errors.name?.message} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>

                            </div>

                            <div>
                                <PasswordInput
                                    id="confirmPassword"
                                    placeholder="Retype your password"
                                    {...register("confirmPassword")}
                                />
                                <ErrorDiv message={errors.name?.message} />
                            </div>
                        </div>

                        <LoadingButton className="w-full h-11 cursor-pointer" type="submit" loading={isSubmitting} loadingChildren="Creating account...">
                            Create Account
                        </LoadingButton>
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
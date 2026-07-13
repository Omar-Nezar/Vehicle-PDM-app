import { Link } from "react-router-dom"

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

import { CircleUserRound } from "lucide-react"

export default function Register() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-3 text-center">

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

                <CardContent className="pt-6">
                    <form className="space-y-5">

                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name
                            </Label>

                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
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
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>

                            </div>

                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Retype your password"
                            />
                        </div>

                        <Button className="w-full h-11 cursor-pointer">
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

                    <p className="mt-6 text-center text-sm text-muted-foreground">
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
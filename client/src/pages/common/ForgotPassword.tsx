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

import { RotateCcwKey } from "lucide-react"

export default function ForgotPassword() {
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
                    <form className="space-y-5">
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

                        <Button className="w-full h-11 cursor-pointer">
                            Reset Password
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
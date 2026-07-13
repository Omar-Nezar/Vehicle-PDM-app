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

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-3 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Login
                    </CardTitle>

                    <CardDescription>
                        Sign in to access your vehicle maintenance dashboard
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
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

                        <Button className="w-full h-11 cursor-pointer">
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

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?
                        <Button variant="link" size="sm" className="pl-1 cursor-pointer">
                            Create account
                        </Button>
                    </p>
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Lost your password?
                        <Button variant="link" size="sm" className="pl-1 cursor-pointer">
                            Forgot password
                        </Button>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
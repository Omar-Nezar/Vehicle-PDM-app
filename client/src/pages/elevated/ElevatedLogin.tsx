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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { ShieldUser } from "lucide-react"

export default function ElevatedLogin() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-2 text-center">

                    <div className="mx-auto flex h-15 w-15 items-center justify-center">
                        <ShieldUser className="h-15 w-15 text-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        Elevated Login
                    </CardTitle>

                    <CardDescription>
                        Sign in to access admin dashboard
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-2">
                    <form className="space-y-5">
                        <div className="w-full">
                            <Label className="mb-2" htmlFor="userType">
                                User Type
                            </Label>
                            <Select id="userType">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select user type" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="inventory">Inventory Manager</SelectItem>
                                </SelectContent>
                            </Select>
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
                        Lost your password?
                        <Button variant="link" size="sm" className="pl-1 cursor-pointer">
                            Forgot password
                        </Button>
                    </p>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Not an admin?
                        <Link to="/login">
                            <Button variant="link" size="sm" className="pl-1 cursor-pointer">
                                Back to regular login
                            </Button>
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
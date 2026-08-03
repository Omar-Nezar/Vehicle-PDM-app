import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string
}

const PasswordInput = React.forwardRef<
    HTMLInputElement,
    PasswordInputProps
>(({ className, containerClassName, ...props }, ref) => {
    const [show, setShow] = React.useState(false)

    return (
        <div className={cn("relative flex items-center", containerClassName)}>
            <Input
                ref={ref}
                type={show ? "text" : "password"}
                className={cn("pr-10", className)}
                {...props}
            />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-1 h-7 w-7 flex items-center justify-center"
            >
                {show ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </Button>
        </div>
    )
})

PasswordInput.displayName = "PasswordInput"
export default PasswordInput
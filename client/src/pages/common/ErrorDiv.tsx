import { cn } from "@/lib/utils"

type ErrorDivProps = {
    message?: string;
    className?: string;
};

export default function ErrorDiv({ message, className = "" }: ErrorDivProps) {
    const isVisible = Boolean(message);

    return (
        <div
            className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isVisible
                    ? "max-h-10 opacity-100 mt-1"
                    : "max-h-0 opacity-0",
                className
            )}
        >
            <p className="text-red-500 text-sm">{message}</p>
        </div>
    );
}
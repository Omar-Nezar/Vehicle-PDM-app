import { toast } from "sonner";

type ToastProps = {
    promise?: Promise<any>;
    message: string;
    description?: string;
    duration?: number;
    errMsg?: string;
};

export default function showToast({
    promise,
    message,
    description,
    duration = 3000,
    errMsg = "Something went wrong",
}: ToastProps) {
    const styledMessage = (
        <span className="text-base font-semibold">
            {message}
        </span>
    );

    const styledDescription = (
        <span className="text-xs text-muted-foreground">
            {description}
        </span>
    );

    if (promise) {
        return toast.promise(promise, {
            loading: "Loading...",
            success: () => ({
                message: styledMessage,
                description: styledDescription,
                duration,
                action: {
                    label: "Dismiss",
                    onClick: () => toast.dismiss(),
                },
            }),
            error: (err) => typeof err === "string" ? err : errMsg
        });
    }

    return toast(styledMessage, {
        description: styledDescription,
        duration,
        action: {
            label: "Dismiss",
            onClick: () => toast.dismiss(),
        },
    });
}
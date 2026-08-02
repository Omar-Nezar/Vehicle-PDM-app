import { useState, useEffect, useMemo } from "react";
import { useAppDispatch } from "src/store/hooks";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "src/slices/authSlice";
import showToast from "../common/Toast";
import decodeToken from "src/functions/utility/decodeToken";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@schemas/updateUser.schema";

import ChangePassword from "./ChangePassword";
import LoadingButton from "./LoadingButton";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type FormData = {
    name: string;
};

export default function AccountModal({ open, onOpenChange }: Props) {
    const [view, setView] = useState<"account" | "password">("account");
    const dispatch = useAppDispatch();

    // Memoize decoded token so reference remains stable across renders
    const user = useMemo(() => decodeToken(), []);

    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: user?.name || "",
        },
    });

    // Reset form state when modal opens
    useEffect(() => {
        if (open) {
            reset({
                name: user?.name || "",
            });
            setIsEditing(false);
            setView("account"); // reset view
        }
    }, [open, user?.name, reset]);

    const onSubmit = async (data: FormData) => {
        const promise = dispatch(updateUser(data)).unwrap();

        showToast({
            promise,
            message: "Profile updated",
            description: "Your account details were updated",
        });

        try {
            await promise;
            setIsEditing(false);
            onOpenChange(false); // Close modal on success
        } catch { }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Account</DialogTitle>
                </DialogHeader>

                <div className="overflow-hidden">
                    <div
                        className={`flex w-[200%] transition-transform duration-500 ease-in-out 
                            ${view === "account"
                                ? "translate-x-0"
                                : "-translate-x-1/2"}`}
                    >

                        {/* ================= ACCOUNT VIEW ================= */}
                        <div className="w-1/2 pr-2">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input {...register("name")} disabled={!isEditing} />
                                </div>
                                <div
                                    className={`origin-top transition-all duration-300 ${errors.name ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                                        }`}
                                >
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name?.message}
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={user?.email || ""} disabled />
                                </div>

                                {/* Role */}
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input value={user?.type || ""} disabled />
                                </div>

                                {/* Change password link */}
                                <Button
                                    type="button"
                                    onClick={() => setView("password")}
                                    variant="link" size="sm"
                                    className="cursor-pointer mx-0 p-0"
                                    disabled={isEditing}
                                >
                                    Change password
                                </Button>

                                {/* Actions */}
                                <div className="flex justify-end gap-2">
                                    {!isEditing ? (
                                        <Button type="button" onClick={() => setIsEditing(true)}>
                                            Edit
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    reset();
                                                    setIsEditing(false);
                                                }}
                                            >
                                                Cancel
                                            </Button>

                                            <LoadingButton className="w-1/4 cursor-pointer" type="submit" loading={isSubmitting} loadingChildren="Saving..." disabled={!isDirty}>
                                                Save
                                            </LoadingButton>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* ================= PASSWORD VIEW ================= */}
                        <div className="w-1/2 pl-2">
                            <ChangePassword onBack={() => setView("account")} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
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

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type FormData = {
    name: string;
};

export default function AccountModal({ open, onOpenChange }: Props) {
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                        {/* Name */}
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                {...register("name")}
                                disabled={!isEditing}
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
  

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-4">
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

                                <Button
                                    type="submit"
                                    disabled={!isDirty || isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save"}
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
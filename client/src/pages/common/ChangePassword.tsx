import { ChevronLeft } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePwdSchema } from "@schemas/changePwd.schema";
import { type ChangeFormData } from "@schemas/changePwd.schema";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { changePassword } from "src/slices/authSlice";
import showToast from "./Toast";
import LoadingButton from "./LoadingButton";
import PasswordInput from "./PasswordInput";
import ErrorDiv from "./ErrorDiv";
import { useHandleLogout } from "src/functions/utility/logout";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type PasswordFormProps = {
    onBack: () => void;
};

export default function PasswordForm({ onBack }: PasswordFormProps) {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);
    const handleLogout = useHandleLogout();
    const { register, handleSubmit, reset, clearErrors, formState: { errors } } = useForm<ChangeFormData>({
        resolver: zodResolver(changePwdSchema),
    });

    const onSubmit = async (data: ChangeFormData) => {
        try {
            await dispatch(changePassword(data)).unwrap();
            handleLogout("chgPwd");
        } catch (err) {
            console.error(err);
            showToast({ message: "Password change failed", description: "Please try again later" });
        }
    };

    const handleBack = () => {
        reset();          // reset all fields to default values
        clearErrors();    // remove validation errors
        onBack();         // go back to parent view
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-2">

            <div className="space-y-2">
                <Label>Current Password</Label>
                <PasswordInput placeholder="Enter your current password" {...register("oldPassword")} />
                <ErrorDiv message={errors.password?.message} />
            </div>

            <div className="space-y-2">
                <Label>New Password</Label>
                <PasswordInput placeholder="Enter your new password" {...register("password")} />
                <ErrorDiv message={errors.password?.message} />
            </div>

            <div className="space-y-2">
                <Label>Confirm Password</Label>
                <PasswordInput placeholder="Retype your password" {...register("confirmPassword")} />
                <ErrorDiv message={errors.confirmPassword?.message} />
            </div>

            {/* Actions */}

            <Button type="button" variant="ghost" className="cursor-pointer mx-0 px-4" onClick={handleBack} disabled={loading}>
                <ChevronLeft className="w-4 h-4" data-icon="inline-start" />
                Back
            </Button>
            <div className="flex justify-end">
                <LoadingButton className="w-1/2 cursor-pointer" type="submit" loading={loading} loadingChildren="Updating Password...">
                    Update Password
                </LoadingButton>
            </div>
        </form >
    );
}
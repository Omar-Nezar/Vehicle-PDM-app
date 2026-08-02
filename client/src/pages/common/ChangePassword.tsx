import { ChevronLeft } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePwdSchema } from "@schemas/changePwd.schema";
import { type ChangeFormData } from "@schemas/changePwd.schema";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { changePassword } from "src/slices/authSlice";
import showToast from "./Toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingButton from "./LoadingButton";


type PasswordFormProps = {
    onBack: () => void;
};

export default function PasswordForm({ onBack }: PasswordFormProps) {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);
    const { register, handleSubmit, reset, clearErrors, formState: { errors } } = useForm<ChangeFormData>({
        resolver: zodResolver(changePwdSchema),
    });

    const onSubmit = async (data: ChangeFormData) => {
        const promise = dispatch(changePassword(data)).unwrap();
        showToast({ promise, message: "Password Changed Successfully!", description: "Your password has been changed" })

        await promise
    };

    const handleBack = () => {
        reset();          // reset all fields to default values
        clearErrors();    // remove validation errors
        onBack();         // go back to parent view
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" {...register("oldPassword")} />
                <div
                    className={`overflow-hidden transition-all duration-300 ${errors.oldPassword ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <p className="text-red-500 text-sm">{errors.oldPassword?.message}</p>
                </div>
            </div>


            <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" {...register("password")} />
                <div
                    className={`overflow-hidden transition-all duration-300 ${errors.password ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <p className="text-red-500 text-sm">{errors.password?.message}</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" {...register("confirmPassword")} />
                <div
                    className={`overflow-hidden transition-all duration-300 ${errors.confirmPassword ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
                </div>
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
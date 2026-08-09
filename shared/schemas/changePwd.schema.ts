import { z } from "zod";
import { userBaseSchema, passwordRules } from "./userBase.schema.js";

export const changePwdSchema = userBaseSchema
    .pick({
        password: true,
        confirmPassword: true,
    })
    .extend({
        oldPassword: z.string().min(8, "Old password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.password !== data.oldPassword, {
        error: "New password must be different from old password",
        path: ["password"],
    })
    .superRefine(passwordRules);

export type ChangeFormData = z.infer<typeof changePwdSchema>;
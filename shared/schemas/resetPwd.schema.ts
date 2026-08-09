import { z } from "zod"
import { userBaseSchema, passwordRules } from "./userBase.schema.js";

export const resetPwdSchema = userBaseSchema
    .pick({
        password: true,
        confirmPassword: true,
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .superRefine(passwordRules);

export type ResetFormData = z.infer<typeof resetPwdSchema>
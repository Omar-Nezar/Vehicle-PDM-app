import { z } from "zod";
import { userBaseSchema } from "./userBase.schema.js";

export const resetPwdSchema = userBaseSchema.pick({
    password: true,
    confirmPassword: true,
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ResetFormData = z.infer<typeof resetPwdSchema>;
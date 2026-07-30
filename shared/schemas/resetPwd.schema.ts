import { z } from "zod";

export const resetPwdSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Passwords do not match",
        path: ["confirm"],
    });
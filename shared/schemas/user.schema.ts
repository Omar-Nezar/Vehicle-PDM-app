import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),

    email: z.email("Invalid email"),

    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string("Please confirm your password").min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).superRefine((data, ctx) => {
    if (!/[0-9]/.test(data.password)) {
        ctx.addIssue({
            path: ["password"],
            message: "Must include a number",
            code: "custom",
        });
    }

    if (!/[!@#$%^&*]/.test(data.password)) {
        ctx.addIssue({
            path: ["password"],
            message: "Must include a special character",
            code: "custom",
        });
    }
});

export type RegisterFormData = z.infer<typeof registerSchema>;
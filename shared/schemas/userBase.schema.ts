import { z } from "zod";

export const userBaseSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
});

export const passwordRules = (data: { password: string }, ctx: z.RefinementCtx) => {
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
};

export type UserBase = z.infer<typeof userBaseSchema>;
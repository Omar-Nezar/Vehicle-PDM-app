import { userBaseSchema } from "./userBase.schema";

export const registerSchema = userBaseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
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
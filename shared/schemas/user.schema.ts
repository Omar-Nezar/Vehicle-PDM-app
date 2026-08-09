import { userBaseSchema, passwordRules, type UserBase } from "./userBase.schema.js";

export const registerSchema = userBaseSchema
  .refine((data: UserBase) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine(passwordRules);
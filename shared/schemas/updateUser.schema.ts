import { userBaseSchema } from "./userBase.schema"
export const updateUserSchema = userBaseSchema.pick({
    name: true,
});
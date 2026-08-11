import { z } from "zod";

export const brands = ["Nissan"];
export const models = ["Altima", "Sunny", "X-Trail", "Patrol", "Pathfinder"]

export const vidSchema = z.object({
    vid: z
        .string()
        .trim()
        .min(1, "VIN is required")
        .regex(/^V\d+$/, "VIN must start with a capital V followed by digits"),
});

export type vidFormData = z.infer<typeof vidSchema>
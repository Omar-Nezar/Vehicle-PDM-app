import { z } from "zod";

export const vehicleSchema = z.object({
  make: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number({ error: "Year must be a number" })
    .min(1900, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),

  mileage: z
    .number({ error: "Mileage must be a number" })
    .min(0, "Mileage cannot be negative"),

  plateNumber: z
    .string()
    .min(1, "Plate number is required")
    .max(10, "Too long")
    .transform((val) => val.toUpperCase()),

  vin: z.string().min(1, "Model is required"),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
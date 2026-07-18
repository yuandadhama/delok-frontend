import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Organization name must be at least 3 characters")
    .max(100, "Organization name must not exceed 100 characters"),
});

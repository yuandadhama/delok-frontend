import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 character"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 character"),
});

export type signUpSchema = z.infer<typeof signUpSchema>;

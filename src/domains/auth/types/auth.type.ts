import { z } from "zod";
import { signUpSchema } from "../schemas/sign-up.schema";

export type SignUpForm = z.infer<typeof signUpSchema>;

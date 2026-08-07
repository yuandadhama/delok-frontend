"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { signUpSchema } from "../schemas/sign-up.schema";
import type { SignUpForm } from "../types/auth.type";
import { AuthService } from "../api/auth.service";
import { ROUTES } from "@/src/constants/routes";

export function useSignUp() {
  const router = useRouter();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    const response = await AuthService.signUp({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (response.error) {
      form.setError("root", {
        message: response.error.message,
      });

      return;
    }

    router.push(ROUTES.AUTH.VERIFY_EMAIL);
  });

  return {
    form,
    submit,
  };
}

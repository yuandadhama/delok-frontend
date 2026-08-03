import { authClient } from "@/src/lib/auth/auth-client";

export class AuthService {
  static async signUp(data: { name: string; email: string; password: string }) {
    return authClient.signUp.email(data);
  }

  static async signInGoogle() {
    return authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  static async signInGithub() {
    return authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  }
}

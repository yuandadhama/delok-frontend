import { authClient } from "@/src/lib/auth/auth-client";

/**
 * AuthService
 *
 * Centralized service for all authentication-related requests.
 *
 * This layer acts as an abstraction over Better Auth so that the UI
 * (hooks, forms, pages, and components) never communicates directly
 * with authClient.
 *
 * Benefits:
 * - Single place to manage authentication logic.
 * - Easy to replace Better Auth in the future.
 * - Keeps UI components focused on presentation.
 * - Makes testing and maintenance easier.
 */
export class AuthService {
  /**
   * Register a new user using email and password.
   *
   * This method simply forwards the request to Better Auth.
   * Additional business logic (analytics, logging, etc.)
   * can be added here in the future without changing the UI.
   */
  static async signUp(data: { name: string; email: string; password: string }) {
    return authClient.signUp.email(data);
  }

  /**
   * Start Google OAuth authentication flow.
   *
   * After successful authentication, the user will be redirected
   * to the dashboard page.
   */
  static async signInGoogle() {
    return authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  /**
   * Start GitHub OAuth authentication flow.
   *
   * After successful authentication, the user will be redirected
   * to the dashboard page.
   */
  static async signInGithub() {
    return authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  }
}

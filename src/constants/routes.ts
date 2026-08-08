export const ROUTES = {
  HOME: "/",

  AUTH: {
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",

    VERIFY_EMAIL: "/sign-up/verify-email",

    VERIFIED: "/sign-up/verified",

    FORGOT_PASSWORD: "/sign-in/forgot-password",

    RESET_PASSWORD: "/sign-in/reset-password",
  },

  WORKSPACE: {
    ROOT: "/workspace",

    ORGANIZATION: (organizationSlug: string) =>
      `/workspace/${organizationSlug}`,

    ORGANIZATION_SETTINGS: (organizationSlug: string) =>
      `/workspace/${organizationSlug}/settings`,

    PROJECTS: (organizationSlug: string) =>
      `/workspace/${organizationSlug}/projects`,

    PROJECT: (organizationSlug: string, projectId: string) =>
      `/workspace/${organizationSlug}/projects/${projectId}`,
  },
} as const;

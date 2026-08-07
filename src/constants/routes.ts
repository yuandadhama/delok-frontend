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

  DASHBOARD: {
    ROOT: "/dashboard",

    ORGANIZATION: (organizationSlug: string) => `/${organizationSlug}`,

    ORGANIZATION_SETTINGS: (organizationSlug: string) =>
      `/${organizationSlug}/settings`,

    PROJECTS: (organizationSlug: string) => `/${organizationSlug}/projects`,

    PROJECT: (organizationSlug: string, projectId: string) =>
      `/${organizationSlug}/project/${projectId}`,
  },
} as const;

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md font-medium transition-all duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus:outline-none focus:ring-2 focus:ring-primary",

        {
          "px-3 py-2 text-sm": size === "sm",
          "px-4 py-2 text-sm": size === "md",
          "px-5 py-3 text-base": size === "lg",

          "bg-primary text-primary-foreground hover:opacity-90":
            variant === "primary",

          "bg-surface border border-border text-foreground hover:bg-surface-hover":
            variant === "secondary",

          "bg-danger text-white hover:opacity-90": variant === "danger",

          "bg-success text-white hover:opacity-90": variant === "success",

          "bg-transparent text-foreground hover:bg-surface-hover":
            variant === "ghost",
        },

        className,
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

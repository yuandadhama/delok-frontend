// ./src/components/ui/Input.tsx

"use client";

import { forwardRef, InputHTMLAttributes, useMemo, useState } from "react";
import clsx from "clsx";

type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, type = "text", className, ...props }, ref) => {
    const isPassword = useMemo(() => type === "password", [type]);

    const [showPassword, setShowPassword] = useState(false);

    const resolvedType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={resolvedType}
            className={clsx(
              "w-full",

              "rounded-md",

              "border",

              "border-border",

              "bg-surface",

              "text-foreground",

              "placeholder:text-muted-foreground",

              "px-3",

              "py-2",

              "outline-none",

              "transition",

              "focus:ring-1",

              "focus:ring-primary",

              "focus:border-primary",

              error && "border-danger focus:ring-danger",

              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className=" absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 cursor-pointer"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7" />
                  <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                  <path d="M20 20 4 4" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 cursor-pointer"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>

        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}

        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;

import React, { useMemo, useState } from "react";

type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (e: any) => void;
};

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  error,
  value,
  onChange,
}: InputProps) {
  const isPassword = useMemo(() => type === "password", [type]);
  const [showPassword, setShowPassword] = useState(false);

  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={resolvedType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="
            border
            rounded
            px-3
            py-2
            outline-none
            focus:ring-2
            focus:ring-blue-500
            w-full
            pr-10
          "
          required
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
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

      <div className="text-red-600">{error}</div>
    </div>
  );
}

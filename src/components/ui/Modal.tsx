"use client";

import { HTMLAttributes, useEffect } from "react";
import clsx from "clsx";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  ...props
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
      {...props}
    >
      <div
        className={clsx(
          "w-full max-w-sm rounded-lg border border-border bg-surface shadow-lg",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="p-6 pb-0">
            <h2 className="mb-1 text-lg font-semibold text-foreground">
              {title}
            </h2>
            {description && (
              <p className="mb-4 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

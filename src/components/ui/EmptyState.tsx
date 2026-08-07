import { HTMLAttributes } from "react";
import clsx from "clsx";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface py-12 text-center",
        className,
      )}
      {...props}
    >
      {icon && <span className="text-muted-foreground/60">{icon}</span>}
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

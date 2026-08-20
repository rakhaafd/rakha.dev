import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: string;
  divider?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  divider = false,
  className,
  children,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
            {title}
          </h2>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-secondary/50 text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        {children}
      </div>

      {subtitle && (
        <p className="text-sm text-muted-foreground font-sans">
          {subtitle}
        </p>
      )}

      {divider && (
        <div className="pt-2">
          <div className="h-[1px] w-full border-b border-dashed border-border/70" />
        </div>
      )}
    </div>
  );
}

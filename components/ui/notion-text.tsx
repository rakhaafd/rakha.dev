import React from "react";

export interface NotionTextSegment {
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  href?: string | null;
}

interface NotionTextProps {
  segments?: NotionTextSegment[];
  fallback?: string;
}

export function NotionText({ segments, fallback }: NotionTextProps) {
  if (!segments || segments.length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <>
      {segments.map((segment, index) => {
        let content: React.ReactNode = segment.plain_text;

        if (segment.annotations?.bold) {
          content = <strong className="font-medium text-foreground">{content}</strong>;
        }
        if (segment.annotations?.italic) {
          content = <em className="italic">{content}</em>;
        }
        if (segment.annotations?.underline) {
          content = (
            <u className="underline decoration-foreground/25 decoration-1.5 underline-offset-4">
              {content}
            </u>
          );
        }
        if (segment.annotations?.strikethrough) {
          content = <del className="line-through opacity-80">{content}</del>;
        }
        if (segment.annotations?.code) {
          content = (
            <code className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono text-foreground border border-border/50">
              {content}
            </code>
          );
        }
        if (segment.href) {
          content = (
            <a
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
            >
              {content}
            </a>
          );
        }

        return <React.Fragment key={index}>{content}</React.Fragment>;
      })}
    </>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { CertificateItem } from "@/lib/notion";
import { cn } from "@/lib/utils";
import { NotionText } from "@/components/ui/notion-text";

interface CertificateCardProps {
  certificate: CertificateItem;
  className?: string;
}

export function CertificateCard({ certificate, className }: CertificateCardProps) {
  return (
    <Card className={cn("p-3.5 sm:p-5 transition-colors duration-150 space-y-2 sm:space-y-3", className)}>
      <div className="flex items-start justify-between gap-2.5">
        <div className="space-y-1 pr-1 flex-1">
          {/* Mobile: title & badges stacked, Desktop: sejajar */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-2">
            <h3 className="font-serif text-sm sm:text-lg font-medium text-foreground leading-snug">
              {certificate.title}
            </h3>
            {certificate.category && certificate.category.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {certificate.category.map((cat) => (
                  <Badge key={cat} variant="subtle" className="text-[11px] sm:text-xs px-1.5 py-0">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-serif">
            {certificate.issuer}
            {certificate.date ? ` • ${certificate.date}` : ""}
          </p>
        </div>

        {certificate.credentialUrl && (
          <Link
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary transition-colors duration-150 shrink-0 mt-0.5"
            title="View Credential"
            aria-label="View Credential"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {certificate.details && (
        <p className="hidden sm:block text-sm text-muted-foreground/80 leading-relaxed font-sans border-t border-border/30 pt-2.5">
          <NotionText segments={certificate.detailsSegments} fallback={certificate.details} />
        </p>
      )}
    </Card>
  );
}
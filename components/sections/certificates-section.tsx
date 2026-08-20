import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getCertificatesFromNotion } from "@/lib/notion";
import { CertificateCard } from "@/components/ui/certificate-card";

export async function CertificatesSection() {
  const allCertificates = await getCertificatesFromNotion();

  if (!allCertificates || allCertificates.length === 0) {
    return null;
  }

  // Display top 3 certificates on homepage
  const featuredCertificates = allCertificates.slice(0, 3);

  return (
    <section id="certificates" className="space-y-8">
      <SectionHeading
        title="Certifications"
      />

      <div className="grid grid-cols-1 gap-3">
        {featuredCertificates.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>

      {/* Button to view all certificates */}
      <div className="flex justify-center pt-2">
        <Button asChild variant="outline" size="sm" className="gap-2 text-xs">
          <Link href="/certificates">
            <span>More Certificate</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

import Link from "next/link";
import { MainLayout } from "@/components/layouts/main-layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getCertificatesFromNotion } from "@/lib/notion";
import { CertificateCard } from "@/components/ui/certificate-card";

// Revalidate Notion data every 60 seconds (ISR)
export const revalidate = 60;

export const metadata = {
  title: "Certificates | Rakha",
  description: "Complete list of certifications, course completions, and achievements.",
};

export default async function CertificatesPage() {
  const certificates = await getCertificatesFromNotion();

  return (
    <MainLayout>
      <div className="space-y-10 pt-4 sm:pt-8">
        {/* Top Header & Back Button */}
        <div className="space-y-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-xs -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <SectionHeading
            title="All Certifications"
          />
        </div>

        {/* Reusable Certificate Cards List */}
        <div className="grid grid-cols-1 gap-3">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

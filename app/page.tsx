import { MainLayout } from "@/components/layouts/main-layout";
import { HeroSection } from "@/components/sections/hero-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { CertificatesSection } from "@/components/sections/certificates-section";

// Revalidate Notion data every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {
  return (
    <MainLayout>
      <div className="space-y-16 sm:space-y-24">
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificatesSection />
      </div>
    </MainLayout>
  );
}

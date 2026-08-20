import Link from "next/link";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layouts/main-layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { ArrowLeft, ArrowUpRight, ExternalLink, Calendar, User, Tag } from "lucide-react";
import { getProjectById, getProjectsFromNotion } from "@/lib/notion";
import { FaGithub, FaGlobe } from "react-icons/fa6";

// Revalidate Notion data every 60 seconds (ISR)
export const revalidate = 60;

// Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  // Combine images array or single image fallback
  const projectImages = project.images && project.images.length > 0
    ? project.images
    : project.image
    ? [project.image]
    : [];

  return (
    <MainLayout>
      <div className="space-y-8 pt-4 sm:pt-8 max-w-3xl mx-auto">
        {/* Navigation & Back Button */}
        <div>
          <Button asChild variant="ghost" size="sm" className="gap-2 text-xs -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/projects">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Projects</span>
            </Link>
          </Button>
        </div>

        {/* Project Header Info */}
        <div className="space-y-4 border-b border-border/60 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                  {project.title}
                </h1>
                {project.type && (
                  <Badge variant="outline" className="text-xs">
                    {project.type}
                  </Badge>
                )}
              </div>

              {project.role && (
                <p className="text-md text-muted-foreground font-serif pt-1">
                  Role: <span className="text-foreground">{project.role}</span>
                </p>
              )}
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2">
              {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary transition-colors duration-150"
              aria-label="View Source Code"
              title="GitHub Source"
            >
              <FaGithub className="h-4 w-4" />
            </Link>
          )}
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary transition-colors duration-150"
            >
              <FaGlobe className="h-4.75 w-3.75" />
            </Link>
          )}
            </div>
          </div>

          {/* Tech Stack Chips */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-sm font-serif px-2.5 py-0.5 rounded border border-border/50 text-muted-foreground bg-secondary/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Simple Image Carousel (Displayed only on Detail page) */}
        {projectImages.length > 0 && (
          <div className="pt-2">
            <ImageCarousel images={projectImages} alt={project.title} />
          </div>
        )}

        {/* Narrative & Deep Dive Details */}
        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <h2 className="font-serif text-xl font-medium text-foreground">
              Overview
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed font-sans">
              {project.description}
            </p>
          </div>

          {project.details && (
            <div className="space-y-3 pt-4 border-t border-dashed border-border/60">
              <h2 className="font-serif text-xl font-medium text-foreground">
                Project Details & Features
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed font-sans whitespace-pre-line">
                {project.details}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

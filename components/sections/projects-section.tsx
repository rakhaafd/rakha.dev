import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getProjectsFromNotion } from "@/lib/notion";
import { ProjectCard } from "@/components/ui/project-card";

export async function ProjectsSection() {
  const allProjects = await getProjectsFromNotion();

  if (!allProjects || allProjects.length === 0) {
    return null;
  }

  // Display top 3 featured/ordered projects on homepage
  const featuredProjects = allProjects.slice(0, 3);

  return (
    <section id="projects" className="space-y-8">
      <div className="flex items-baseline justify-between">
        <SectionHeading
          title="Projects"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Button to view all projects */}
      <div className="flex justify-center pt-2">
        <Button asChild variant="outline" size="sm" className="gap-2 text-xs">
          <Link href="/projects">
            <span>More Project</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

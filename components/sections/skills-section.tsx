import { SectionHeading } from "@/components/ui/section-heading";
import { getSkillsFromNotion } from "@/lib/notion";
import { getSkillIcon } from "@/lib/icons";

export async function SkillsSection() {
  const skillGroups = await getSkillsFromNotion();

  if (!skillGroups || skillGroups.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="space-y-8">
      <SectionHeading
        title="Skill Sets" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGroups.map((group) => (
          <div
            key={group.category}
            className="rounded-lg border border-border/70 bg-card p-5 space-y-4 hover:border-foreground/20 hover:bg-secondary/20 transition-colors duration-150 cursor-pointer"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <h3 className="font-serif text-base font-medium text-foreground">
                {group.category}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const Icon = getSkillIcon(skill.icon);
                return (
                  <div
                    key={skill.name}
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-border/50 bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/80 transition-colors duration-150 text-xs"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

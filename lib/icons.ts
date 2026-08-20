import React from "react";
import * as SiIcons from "react-icons/si";
import * as Fa6Icons from "react-icons/fa6";
import * as LucideIcons from "lucide-react";
import { Code2 } from "lucide-react";

export function getSkillIcon(iconName?: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return Code2;

  const cleanName = iconName.trim();

  // Check SiIcons (Simple Icons)
  if (cleanName in SiIcons) {
    const icon = (SiIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cleanName];
    if (icon) return icon;
  }

  // Check Fa6Icons (Font Awesome 6)
  if (cleanName in Fa6Icons) {
    const icon = (Fa6Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cleanName];
    if (icon) return icon;
  }

  // Check LucideIcons
  if (cleanName in LucideIcons) {
    const icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cleanName];
    if (icon) return icon;
  }

  return Code2;
}

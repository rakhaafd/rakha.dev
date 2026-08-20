"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  User,
  Code2,
  FolderGit2,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", href: "/#about", sectionId: "about", icon: User },
  { name: "Skills", href: "/#skills", sectionId: "skills", icon: Code2 },
  { name: "Projects", href: "/#projects", sectionId: "projects", icon: FolderGit2 },
  { name: "Certificates", href: "/#certificates", sectionId: "certificates", icon: Award },
];

export function Sidebar() {
  const [activeSection, setActiveSection] = React.useState("about");
  const [isMobileNavVisible, setIsMobileNavVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  // Track active section and scroll direction on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Auto-hide mobile navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsMobileNavVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsMobileNavVisible(true);
      }
      lastScrollY.current = currentScrollY;

      // Track active section on scroll
      const sections = navItems.map((item) => item.sectionId);
      const scrollPosition = currentScrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Floating Bottom Navbar (lg:hidden) - Auto Hides on Scroll Down */}
      <div
        className={cn(
          "lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 select-none transition-all duration-300 ease-in-out",
          isMobileNavVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex items-center gap-1 px-3 py-2 rounded-full border border-border/70 bg-background/85 backdrop-blur-md shadow-lg shadow-black/5">
          {/* Navigation Section Icons */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.sectionId;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                aria-label={item.name}
                className={cn(
                  "p-2.5 rounded-full transition-colors duration-150 relative flex items-center justify-center",
                  isActive
                    ? "bg-secondary text-foreground border border-border/70"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
              </Link>
            );
          })}

          {/* Divider | */}
          <div className="h-4 w-px bg-border/60 mx-1.5 shrink-0" />

          {/* Theme Switcher Toggle on the Right */}
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Desktop Permanent Compact Sidebar (w-16 xl:w-20) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-16 xl:w-20 flex-col justify-between items-center py-8 px-2 border-r border-border/60 bg-background/95 backdrop-blur-md z-30 select-none">
        {/* Navigation Items (Centered & Clean) */}
        <nav className="flex flex-col items-center space-y-3 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.sectionId;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                aria-label={item.name}
                className={cn(
                  "p-2.5 rounded-md transition-colors duration-150 group relative",
                  isActive
                    ? "bg-secondary text-foreground border border-border/60"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 transition-colors shrink-0" />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Area: Theme Switcher Only */}
        <div className="flex flex-col items-center pt-6 border-t border-border/60 w-full">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}

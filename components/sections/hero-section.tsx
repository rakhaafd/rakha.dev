import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaDiscord,
  FaSpotify,
} from "react-icons/fa6";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/rakhaafd",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/rakhaafd",
    icon: FaLinkedinIn,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/rakhaafd",
    icon: FaInstagram,
  },
  {
    name: "Discord",
    href: "https://discord.com/users/759794651418591252",
    icon: FaDiscord,
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/user/31ic7thlmv2jf3qv6gr3kyd2igb4",
    icon: FaSpotify,
  },
];

export function HeroSection() {
  return (
    <section id="about" className="space-y-6 pt-2 sm:pt-6">
      {/* Top Cover Banner */}
      <div className="relative w-full h-40 sm:h-52 md:h-60 rounded-xl overflow-hidden border border-border/70 bg-secondary/30 shadow-xs">
        <img
          src="/images/banner.jpeg"
          alt="Rakha Fausta Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Name & Title */}
      <div className="space-y-2 pt-2">
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
          Rakha Fausta Adinata Raharja
        </h1>
        <p className="text-base sm:text-lg italic text-muted-foreground font-sans">
          Software Engineer <span className="font-medium">Wannabe.</span>
        </p>
      </div>

      {/* Narrative Bio */}
      <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed max-w-3xl font-sans">
        Specializing in modern fullstack ecosystems with{" "}
        <span className="text-foreground font-medium underline decoration-foreground/25 decoration-1.5 underline-offset-4">
          Next.js, Golang, Laravel, and ERP Technologies
        </span>
        . Passionate about software architecture, and scalable system.
      </p>

      {/* Social Links */}
      <div className="flex items-center gap-2 pt-1 text-muted-foreground">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              className="p-2 rounded-md border border-border/50 bg-secondary/30 hover:border-border hover:bg-secondary hover:text-foreground transition-colors duration-150"
            >
              <Icon className="h-4 w-4" />
            </Link>
          );
        })}
      </div>

      {/* Action CTAs */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button asChild variant="default" size="sm" className="gap-2 text-xs">
          <Link href="https://rxresu.me/rakhaafd/rakha-fausta" target="_blank" rel="noopener noreferrer">
            <span>Resume</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-2 text-xs">
          <Link href="mailto:rakhafausta07@gmail.com" target="_blank" rel="noopener noreferrer">
            <span>Get in Touch</span>
            <Mail className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

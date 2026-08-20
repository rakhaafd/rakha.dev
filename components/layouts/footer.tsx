import * as React from "react";
import { Container } from "./container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 py-8 mt-10 text-xs text-muted-foreground/60 select-none lg:pb-8">
      <Container size="default">
        <div className="flex justify-end items-center text-right font-sans">
          <span>{currentYear} • Build with ☕ by Rakha.</span>
        </div>
      </Container>
    </footer>
  );
}

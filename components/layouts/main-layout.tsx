import * as React from "react";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { Container } from "./container";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 selection:bg-foreground selection:text-background">
      {/* Left Permanent Clean Compact Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-16 xl:pl-20 transition-all duration-200">
        <main className="flex-1 w-full pt-6 sm:pt-10 pb-16">
          <Container size="default">{children}</Container>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

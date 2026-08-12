import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { TrialModalProvider } from "@/components/marketing/trial-modal-provider";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

/**
 * Marketing site layout: navbar + footer + free-trial modal on every page.
 * Admin pages live under app/admin and use their own layout.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MotionConfig reducedMotion="user">
      <TrialModalProvider>
        <div className="flex min-h-screen flex-col">
          {/* Skip link — first focusable element, for keyboard users */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-lime focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-bold focus:uppercase focus:tracking-wider focus:text-obsidian"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </TrialModalProvider>
    </MotionConfig>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Dumbbell } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { useTrialModal } from "@/components/marketing/trial-modal-provider";

/**
 * Sticky navbar: transparent over the hero, solid obsidian + hairline
 * once scrolled. Mobile: full-screen slide-down menu.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openTrial } = useTrialModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-hairline bg-obsidian/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Town Fitness Point — home">
          <span className="flex size-9 items-center justify-center rounded-md bg-lime text-obsidian">
            <Dumbbell className="size-5" aria-hidden />
          </span>
          <span className="font-display text-sm font-bold uppercase leading-tight tracking-[0.18em] md:text-base">
            Town<br className="hidden" /> <span className="text-lime">Fitness</span> Point
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-lime" : "text-mist hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openTrial}
            className="hidden rounded-md bg-lime px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong sm:inline-flex"
          >
            Free Trial
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2 text-ink transition hover:bg-surface lg:hidden"
          >
            {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen ? (
        <div className="border-t border-hairline bg-obsidian/95 backdrop-blur-md lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-6" aria-label="Mobile">
            {[...NAV_LINKS, { href: "/gallery", label: "Gallery" }, { href: "/blog", label: "Blog" }].map(
              (link, i) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-3 py-3 font-display text-lg font-semibold ${
                      active ? "bg-surface text-lime" : "text-ink hover:bg-surface"
                    }`}
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    {link.label}
                  </Link>
                );
              }
            )}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openTrial();
              }}
              className="mt-4 rounded-md bg-lime px-5 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-obsidian"
            >
              Book Free Trial
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

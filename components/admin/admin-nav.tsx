"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/trials", label: "Free Trials" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/trainers", label: "Trainers" },
  { href: "/admin/classes", label: "Classes" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="scrollbar-none -mx-2 overflow-x-auto px-2 pb-1"
      aria-label="Admin sections"
    >
      <div className="flex gap-1">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                active
                  ? "bg-lime text-obsidian"
                  : "text-mist hover:bg-surface hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Town Fitness Point — Premium Gym & Fitness Center",
    template: "%s · Town Fitness Point",
  },
  description:
    "Premium gym and fitness center. Elite coaching, pro-grade equipment and small-group classes. Book your free session at Town Fitness Point.",
  keywords: [
    "gym",
    "fitness center",
    "personal training",
    "HIIT",
    "strength training",
    "Town Fitness Point",
  ],
  openGraph: {
    type: "website",
    siteName: "Town Fitness Point",
    title: "Town Fitness Point — Premium Gym & Fitness Center",
    description:
      "Elite coaching, pro-grade equipment and small-group classes. Book your free session.",
    images: [{ url: "/images/hero.jpg", width: 1600, height: 900, alt: "Town Fitness Point training floor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Town Fitness Point — Premium Gym & Fitness Center",
    description:
      "Elite coaching, pro-grade equipment and small-group classes. Book your free session.",
    images: ["/images/hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-obsidian font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

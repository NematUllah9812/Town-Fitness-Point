import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images may be served from Supabase Storage (media bucket) or from
    // /images/* (local placeholder assets). Owners may also paste URLs.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Security headers (see DEPLOYMENT.md for the full list + rationale).
  // NOTE: X-Frame-Options / frame-ancestors are intentionally NOT set so
  // the site can be embedded in preview iframes; add them in front of
  // production behind a CDN/WAF if desired.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

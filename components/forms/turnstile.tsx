"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget — renders only when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured. The token is written
 * into a hidden input named cf-turnstile-response so Server Actions
 * pick it up with zero extra plumbing. Verification happens server-side.
 */
export function Turnstile({ id }: { id: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!siteKey || loaded) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const w = window as unknown as {
        turnstile?: {
          render: (
            el: HTMLElement,
            opts: { sitekey: string; callback: (token: string) => void }
          ) => void;
        };
      };
      if (w.turnstile && containerRef.current) {
        w.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            if (inputRef.current) inputRef.current.value = token;
          },
        });
        setLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [siteKey, loaded]);

  if (!siteKey) return null;

  return (
    <div className="mt-4">
      <input ref={inputRef} type="hidden" name="cf-turnstile-response" />
      <div ref={containerRef} id={`turnstile-${id}`} />
    </div>
  );
}

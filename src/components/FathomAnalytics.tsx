"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as Fathom from "fathom-client";

export function FathomAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load Fathom on mount
  useEffect(() => {
    Fathom.load("SXHQNLTW", {
      includedDomains: ["resz.mehdib.me"],
    });
  }, []);

  // Track pageview on route change
  useEffect(() => {
    if (pathname) {
      Fathom.trackPageview();
    }
  }, [pathname, searchParams]);

  return null;
}


"use client";

import { useEffect } from "react";
import * as Fathom from "fathom-client";

export function FathomAnalytics() {
  useEffect(() => {
    Fathom.load("SXHQNLTW", {
      // Track this specific subdomain
      includedDomains: ["resz.mehdib.me"],
    });
  }, []);

  return null;
}


// components/ConsoleWarning.tsx
"use client";

import { useEffect } from "react";

export default function ConsoleWarning() {
  useEffect(() => {
    console.log(
      "%cStop!",
      "color: red; font-size: 48px; font-weight: bold;"
    );
    console.log(
      "%cThis is a browser feature intended for developers. " +
        "If someone told you to copy-paste something here to hack an account or enable a feature, it's a scam.",
      "color: black; font-size: 16px;"
    );
  }, []);

  return null; // This component doesn't render anything visible
}

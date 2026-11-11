"use client";

import { useEffect } from "react";

export default function DevLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
    document.body.classList.add("overflow-y-auto");
    return () => {
      document.body.classList.add("overflow-hidden");
      document.body.classList.remove("overflow-y-auto");
    };
  }, []);

  return <div data-dev-page className="min-h-screen">{children}</div>;
}

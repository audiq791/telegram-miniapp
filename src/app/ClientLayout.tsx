"use client";

import { useEffect } from "react";
import { useLargeScale } from "../hooks/useLargeScale";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isLargeScale = useLargeScale();

  useEffect(() => {
    document.body.classList.toggle("large-scale", isLargeScale);
    return () => {
      document.body.classList.remove("large-scale");
    };
  }, [isLargeScale]);

  return <>{children}</>;
}

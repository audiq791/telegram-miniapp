"use client";

import { useLargeScale } from "../hooks/useLargeScale";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isLargeScale = useLargeScale();

  return (
    <body className={`font-sans ${isLargeScale ? 'large-scale' : ''}`}>
      {children}
    </body>
  );
}
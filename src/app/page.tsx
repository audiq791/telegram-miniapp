"use client";

import { useEffect, useState } from "react";
import Onboarding from "../onboarding/Onboarding";
import MainApp from "../screens/MainApp";
import { readTelegramSession } from "@/lib/auth/storage";

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        if (readTelegramSession()) {
          if (!cancelled) {
            setShowOnboarding(false);
          }
          return;
        }

        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const payload = (await response.json()) as { authenticated?: boolean };

        if (!cancelled) {
          setShowOnboarding(!payload.authenticated);
        }
      } finally {
        if (!cancelled) {
          setIsBooting(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isBooting) {
    return <div className="min-h-dvh bg-zinc-50" />;
  }

  const handleLogout = () => {
    setShowOnboarding(true);
  };

  return (
    <>
      {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}
      {!showOnboarding && <MainApp onLogout={handleLogout} />}
    </>
  );
}

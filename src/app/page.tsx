"use client";

import { useEffect, useState } from "react";
import Onboarding from "../onboarding/Onboarding";
import MainApp from "../screens/MainApp";
import { readPendingPasswordSetup, readTelegramSession } from "@/lib/auth/storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseBrowserClient();

    const bootstrap = async () => {
      try {
        if (readTelegramSession()) {
          if (!cancelled) {
            setShowOnboarding(false);
            setIsBooting(false);
          }
          return;
        }

        if (supabase) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!cancelled && session && !readPendingPasswordSetup()) {
            setShowOnboarding(false);
          }
        }
      } finally {
        if (!cancelled) {
          setIsBooting(false);
        }
      }
    };

    bootstrap();

    const subscription = supabase?.auth.onAuthStateChange((_, session) => {
      if (!cancelled) {
        setShowOnboarding((!session || readPendingPasswordSetup()) && !readTelegramSession());
      }
    });

    return () => {
      cancelled = true;
      subscription?.data.subscription.unsubscribe();
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

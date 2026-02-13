"use client";

import { useState } from "react";
import Onboarding from "../onboarding/Onboarding";
import MainApp from "../screens/MainApp";

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <>
      {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}
      {!showOnboarding && <MainApp />}
    </>
  );
}

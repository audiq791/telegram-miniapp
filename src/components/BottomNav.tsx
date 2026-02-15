"use client";

import { motion } from "framer-motion";
import {
  WalletCards,
  ShoppingBag,
  Layers,
  UserRound,
} from "lucide-react";
import { TabButton } from "./ui";

type BottomNavProps = {
  tab: "wallet" | "market" | "services" | "profile";
  onTabChange: (tab: "wallet" | "market" | "services" | "profile") => void;
  onWalletClick: () => void;
  onMarketClick: () => void;
  onServicesClick: () => void;
  onProfileClick: () => void;
  isVisible: boolean;
};

export default function BottomNav({
  tab,
  onTabChange,
  onWalletClick,
  onMarketClick,
  onServicesClick,
  onProfileClick,
  isVisible
}: BottomNavProps) {
  if (!isVisible) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-zinc-200 transform-gpu"
      style={{ 
        paddingBottom: "env(safe-area-inset-bottom)",
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}
    >
      <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-4 gap-2">
        <TabButton
          active={tab === "wallet"}
          onClick={() => {
            if (tab !== "wallet") {
              onTabChange("wallet");
              onWalletClick();
            }
          }}
          label="Кошелёк"
          icon={<WalletCards size={18} strokeWidth={1.9} />}
        />
        <TabButton
          active={tab === "market"}
          onClick={() => {
            if (tab !== "market") {
              onTabChange("market");
              onMarketClick();
            }
          }}
          label="Маркет"
          icon={<ShoppingBag size={18} strokeWidth={1.9} />}
        />
        <TabButton
          active={tab === "services"}
          onClick={() => {
            if (tab !== "services") {
              onTabChange("services");
              onServicesClick();
            }
          }}
          label="Сервисы"
          icon={<Layers size={18} strokeWidth={1.9} />}
        />
        <TabButton
          active={tab === "profile"}
          onClick={() => {
            if (tab !== "profile") {
              onTabChange("profile");
              onProfileClick();
            }
          }}
          label="Профиль"
          icon={<UserRound size={18} strokeWidth={1.9} />}
        />
      </div>
    </nav>
  );
}
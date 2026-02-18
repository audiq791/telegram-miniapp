import { memo } from "react";
import { motion } from "framer-motion";
import { WalletCards, ShoppingBag, UserRound, Layers } from "lucide-react";
import { TabButton } from "./ui";

type NavbarProps = {
  tab: "wallet" | "market" | "services" | "profile";
  onTabChange: (tab: "wallet" | "market" | "services" | "profile") => void;
  isVisible: boolean;
  safeAreaPadding: string;
};

function Navbar({ tab, onTabChange, isVisible, safeAreaPadding }: NavbarProps) {
  return (
    <motion.nav
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-zinc-200"
      style={{ 
        paddingBottom: safeAreaPadding,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-4 gap-2">
        <TabButton active={tab === "wallet"} onClick={() => onTabChange("wallet")} label="Кошелёк" icon={<WalletCards size={18} strokeWidth={1.9} />} />
        <TabButton active={tab === "market"} onClick={() => onTabChange("market")} label="Маркет" icon={<ShoppingBag size={18} strokeWidth={1.9} />} />
        <TabButton active={tab === "services"} onClick={() => onTabChange("services")} label="Сервисы" icon={<Layers size={18} strokeWidth={1.9} />} />
        <TabButton active={tab === "profile"} onClick={() => onTabChange("profile")} label="Профиль" icon={<UserRound size={18} strokeWidth={1.9} />} />
      </div>
    </motion.nav>
  );
}

export default memo(Navbar);
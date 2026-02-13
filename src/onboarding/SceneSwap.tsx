"use client";

import { motion } from "framer-motion";
import { Repeat2 } from "lucide-react";

export default function SceneSwap() {
  return (
    <div className="mt-6 rounded-[28px] border border-zinc-200 bg-zinc-50 overflow-hidden shadow-sm">
      <div className="relative h-[340px] w-full">
        <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:18px_18px]" />

        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative h-44 w-44">
            <OrbitToken className="absolute left-1/2 top-0" style={{ x: "-50%" }} label="B" />
            <OrbitToken className="absolute right-0 top-1/2" style={{ y: "-50%" }} label="VV" />
            <OrbitToken className="absolute left-1/2 bottom-0" style={{ x: "-50%" }} label="FUEL" />
            <OrbitToken className="absolute left-0 top-1/2" style={{ y: "-50%" }} label="MG" />
          </div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 h-52 w-52 rounded-full border border-zinc-200"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: [0.92, 1.02, 0.92], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-14 w-14 rounded-2xl bg-zinc-900 text-white grid place-items-center shadow-sm">
            <Repeat2 size={20} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function OrbitToken({
  className,
  style,
  label,
}: {
  className?: string;
  style?: any;
  label: string;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{ rotate: -360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <div className="h-14 w-14 rounded-2xl bg-white border border-zinc-200 shadow-sm grid place-items-center">
        <div className="text-xs font-semibold text-zinc-900">{label}</div>
      </div>
    </motion.div>
  );
}

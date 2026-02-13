"use client";

import { motion } from "framer-motion";

export default function SceneDigitize() {
  return (
    <div className="mt-6 rounded-[28px] border border-zinc-200 bg-zinc-50 overflow-hidden shadow-sm">
      <div className="relative h-[340px] w-full">
        <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:18px_18px]" />

        <motion.div className="absolute left-1/2 top-[62%]" style={{ x: "-50%", y: "-50%" }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [40, 0, -60, -120],
                x: [0, (i - 2.5) * 16, (i - 2.5) * 22, (i - 2.5) * 10],
                scale: [0.9, 1, 0.85, 0.6],
                filter: ["blur(0px)", "blur(0px)", "blur(1px)", "blur(2px)"],
              }}
              transition={{
                duration: 2.6,
                delay: i * 0.12,
                repeat: Infinity,
                repeatDelay: 0.7,
                ease: "easeInOut",
              }}
            >
              <Coin />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-[42%]"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: [0.9, 1.02, 1], opacity: [0.9, 1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          <TokenB />
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-[42%] h-40 w-40 rounded-full"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#00000010,transparent_60%)]" />
        </motion.div>
      </div>
    </div>
  );
}

function Coin() {
  return (
    <div className="h-10 w-10 rounded-full bg-white border border-zinc-200 shadow-sm grid place-items-center">
      <div className="h-7 w-7 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#f4f4f5)] border border-zinc-200 grid place-items-center">
        <div className="text-[10px] font-bold text-zinc-700">₽</div>
      </div>
    </div>
  );
}

function TokenB() {
  return (
    <div className="h-28 w-28 rounded-[28px] bg-white border border-zinc-200 shadow-sm grid place-items-center">
      <div className="h-20 w-20 rounded-3xl bg-zinc-900 text-white grid place-items-center">
        <div className="text-3xl font-bold">B</div>
      </div>
      <div className="mt-3 text-[11px] text-zinc-500">bonus</div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import EventBus, { InterludeQuestProgress } from "@/game/EventBus";

const COLOR_MAP: Record<
  NonNullable<InterludeQuestProgress["color"]>,
  { fill: string; glow: string; text: string; border: string }
> = {
  amber: {
    fill: "bg-amber-400",
    glow: "shadow-[0_0_8px_#fbbf24]",
    text: "text-amber-300",
    border: "border-amber-400/80",
  },
  sky: {
    fill: "bg-sky-400",
    glow: "shadow-[0_0_8px_#38bdf8]",
    text: "text-sky-300",
    border: "border-sky-400/80",
  },
  emerald: {
    fill: "bg-emerald-400",
    glow: "shadow-[0_0_8px_#34d399]",
    text: "text-emerald-300",
    border: "border-emerald-400/80",
  },
  rose: {
    fill: "bg-rose-400",
    glow: "shadow-[0_0_8px_#fb7185]",
    text: "text-rose-300",
    border: "border-rose-400/80",
  },
};

export default function InterludeProgressHUD() {
  const [quests, setQuests] = useState<InterludeQuestProgress[]>([]);

  useEffect(() => {
    const onProgress = ({ quests: next }: { quests: InterludeQuestProgress[] }) => {
      setQuests(next);
    };
    const onSceneReady = ({ sceneKey }: { sceneKey: string }) => {
      if (!sceneKey.startsWith("Interlude")) {
        setQuests([]);
      }
    };

    EventBus.on("interlude-progress", onProgress);
    EventBus.on("scene-ready", onSceneReady);
    return () => {
      EventBus.off("interlude-progress", onProgress);
      EventBus.off("scene-ready", onSceneReady);
    };
  }, []);

  if (quests.length === 0) return null;

  return (
    <aside
      aria-label="Tiến độ nhiệm vụ chặng đệm"
      className="pointer-events-none fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 sm:gap-2.5 select-none"
    >
      {quests.map((q) => {
        const pct = q.total > 0 ? Math.min(100, Math.max(0, Math.round((q.current / q.total) * 100))) : 0;
        const done = q.current >= q.total;
        const theme = COLOR_MAP[q.color ?? "amber"];

        return (
          <div
            key={q.id}
            className={`retro-frame bg-slate-950/90 px-2 py-2.5 flex flex-col items-center gap-1.5 shadow-xl border-2 ${
              done ? "border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.45)]" : "border-slate-700"
            }`}
          >
            {/* Top Icon */}
            <span className="text-[32px] sm:text-[36px] leading-none filter drop-shadow">{q.emoji}</span>

            {/* Vertical Progress Bar Track (fills bottom-to-top) */}
            <div className="relative w-3.5 sm:w-4 h-28 sm:h-36 bg-slate-900 border-2 border-black overflow-hidden flex flex-col justify-end p-0.5">
              {/* Step notches for 8-bit retro look */}
              <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none opacity-35">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="w-full border-b border-slate-950" />
                ))}
              </div>

              {/* Animated Fill */}
              <div
                style={{ height: `${pct}%` }}
                className={`w-full transition-all duration-300 ${theme.fill} ${theme.glow}`}
              />
            </div>

            {/* n/x Counter */}
            <span className={`font-pixel text-[20px] sm:text-[22px] font-bold tracking-tight ${theme.text}`}>
              {q.suffix ? `${q.current}${q.suffix}` : `${q.current}/${q.total}`}
            </span>

            {/* Short Label */}
            <span className="font-pixel text-[18px] text-amber-100/80 uppercase tracking-wider text-center max-w-[46px] leading-tight">
              {done ? "XONG ✓" : q.label}
            </span>
          </div>
        );
      })}
    </aside>
  );
}

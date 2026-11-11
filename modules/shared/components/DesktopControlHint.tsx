"use client";

import React from "react";
import { useT } from "@/modules/shared/i18n";

export default function DesktopControlHint() {
  const t = useT();
  return (
    <div className="pointer-events-auto select-none retro-frame px-3 py-1.5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-slate-200">
      {/* Movement instruction */}
      <div className="flex items-center gap-2">
        <span className="flex gap-1">
          <span className="pixel-key px-1.5 py-0 text-[14px]">W</span>
          <span className="pixel-key px-1.5 py-0 text-[14px]">A</span>
          <span className="pixel-key px-1.5 py-0 text-[14px]">S</span>
          <span className="pixel-key px-1.5 py-0 text-[14px]">D</span>
        </span>
        <span className="text-amber-400 font-pixel text-[12px] mx-0.5">/</span>
        <span className="flex gap-1">
          <span className="pixel-key px-1.5 py-0 text-[14px]">↑</span>
          <span className="pixel-key px-1.5 py-0 text-[14px]">↓</span>
          <span className="pixel-key px-1.5 py-0 text-[14px]">←</span>
          <span className="pixel-key px-1.5 py-0 text-[14px]">→</span>
        </span>
        <span className="font-pixel text-[14px] text-amber-200 ml-1.5 tracking-wide">
          {t("DI CHUYỂN", "MOVE")}
        </span>
      </div>

      <span className="hidden sm:inline text-amber-500/60 font-pixel text-[14px]">◆</span>

      {/* Interact instruction */}
      <div className="flex items-center gap-2">
        <span className="pixel-key px-2 py-0 text-[14px] text-emerald-300">
          SPACE
        </span>
        <span className="text-amber-400 font-pixel text-[12px]">/</span>
        <span className="pixel-key px-1.5 py-0 text-[14px] text-emerald-300">
          ENTER
        </span>
        <span className="font-pixel text-[14px] text-emerald-300 ml-1.5 tracking-wide">
          {t("TƯƠNG TÁC", "INTERACT")}
        </span>
      </div>

      <span className="hidden sm:inline text-amber-500/60 font-pixel text-[14px]">◆</span>

      {/* Menu instruction */}
      <div className="flex items-center gap-2">
        <span className="pixel-key px-1.5 py-0 text-[14px] text-rose-300">
          ESC
        </span>
        <span className="font-pixel text-[14px] text-rose-300 ml-1.5 tracking-wide">
          MENU
        </span>
      </div>
    </div>
  );
}

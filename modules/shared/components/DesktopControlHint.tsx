"use client";

import React from "react";

export default function DesktopControlHint() {
  return (
    <div className="pointer-events-auto select-none retro-frame px-5 py-2.5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-5 text-slate-200">
      {/* Movement instruction */}
      <div className="flex items-center gap-2">
        <span className="flex gap-1">
          <span className="pixel-key px-2 py-0.5 text-[30px]">W</span>
          <span className="pixel-key px-2 py-0.5 text-[30px]">A</span>
          <span className="pixel-key px-2 py-0.5 text-[30px]">S</span>
          <span className="pixel-key px-2 py-0.5 text-[30px]">D</span>
        </span>
        <span className="text-amber-400 font-pixel text-[24px] mx-0.5">/</span>
        <span className="flex gap-1">
          <span className="pixel-key px-2 py-0.5 text-[30px]">↑</span>
          <span className="pixel-key px-2 py-0.5 text-[30px]">↓</span>
          <span className="pixel-key px-2 py-0.5 text-[30px]">←</span>
          <span className="pixel-key px-2 py-0.5 text-[30px]">→</span>
        </span>
        <span className="font-pixel text-[28px] text-amber-200 ml-1.5 tracking-wide">
          DI CHUYỂN
        </span>
      </div>

      <span className="hidden sm:inline text-amber-500/60 font-pixel text-[28px]">◆</span>

      {/* Interact instruction */}
      <div className="flex items-center gap-2">
        <span className="pixel-key px-2.5 py-0.5 text-[30px] text-emerald-300">
          SPACE
        </span>
        <span className="text-amber-400 font-pixel text-[24px]">/</span>
        <span className="pixel-key px-2 py-0.5 text-[30px] text-emerald-300">
          ENTER
        </span>
        <span className="font-pixel text-[28px] text-emerald-300 ml-1.5 tracking-wide">
          TƯƠNG TÁC
        </span>
      </div>

      <span className="hidden sm:inline text-amber-500/60 font-pixel text-[28px]">◆</span>

      {/* Menu instruction */}
      <div className="flex items-center gap-2">
        <span className="pixel-key px-2 py-0.5 text-[30px] text-rose-300">
          ESC
        </span>
        <span className="font-pixel text-[28px] text-rose-300 ml-1.5 tracking-wide">
          MENU
        </span>
      </div>
    </div>
  );
}

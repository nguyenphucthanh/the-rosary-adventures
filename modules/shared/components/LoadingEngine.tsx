"use client";

import React from "react";
import { useT } from "@/modules/shared/i18n";

/** Fallback shown while the Phaser bundle for a game loads. */
export default function LoadingEngine() {
  const t = useT();
  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-950 text-amber-400 font-mono text-[28px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span>{t("Đang nạp động cơ Phaser 3...", "Loading Phaser 3 engine...")}</span>
      </div>
    </div>
  );
}

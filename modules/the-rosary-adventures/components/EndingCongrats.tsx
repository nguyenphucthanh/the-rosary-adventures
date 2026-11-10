"use client";

import React, { useEffect, useState } from "react";
import EventBus from "@/modules/shared/game/EventBus";
import { resetProgress } from "@/modules/the-rosary-adventures/utils/saveManager";

/** Shown when the Epilogue ends: congratulations + one big button to start over. */
export default function EndingCongrats() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    EventBus.on("game-complete", show);
    return () => EventBus.off("game-complete", show);
  }, []);

  if (!open) return null;

  const restart = () => {
    resetProgress();
    setOpen(false);
    EventBus.emit("game-restart");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/95 select-none">
      <div className="retro-frame-gold bg-slate-950 w-full max-w-lg p-6 sm:p-8 text-center flex flex-col items-center gap-4">
        <div className="text-5xl animate-pulse">🎉📿🎉</div>
        <h1 className="pixel-title text-[48px] sm:text-3xl text-amber-300">CHÚC MỪNG!</h1>
        <p className="font-retro text-[36px] sm:text-[40px] text-amber-100">
          Bạn đã hoàn thành hành trình 20 Mầu Nhiệm Mân Côi cùng Chúa Thánh Thần và Mẹ Maria.
        </p>
        <p className="font-pixel text-[24px] sm:text-[28px] text-amber-200/80">
          Hoa Trái Thánh Thần: Bác ái · Hoan lạc · Bình an
        </p>
        <button
          type="button"
          onClick={restart}
          className="retro-btn-gold w-full mt-2 py-5 sm:py-6 font-pixel text-[36px] sm:text-[48px] text-amber-100 active:translate-y-0.5"
        >
          🔄 CHƠI LẠI TỪ ĐẦU
        </button>
      </div>
    </div>
  );
}

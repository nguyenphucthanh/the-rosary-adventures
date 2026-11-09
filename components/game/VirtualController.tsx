"use client";

import React, { useState, useCallback } from "react";
import EventBus from "@/game/EventBus";

export interface VirtualControllerProps {
  className?: string;
}

export default function VirtualController({
  className = "",
}: VirtualControllerProps) {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const vibrate = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleDirectionPress = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      setActiveDirection(dir);
      vibrate();
      EventBus.emit("input-direction", { direction: dir });
    },
    []
  );

  const handleDirectionRelease = useCallback(() => {
    setActiveDirection(null);
    EventBus.emit("input-direction", { direction: "idle" });
  }, []);

  const handleActionPress = useCallback((act: "A" | "B") => {
    setActiveButton(act);
    vibrate();
    EventBus.emit("input-action", { action: act });
  }, []);

  const handleActionRelease = useCallback(() => {
    setActiveButton(null);
  }, []);

  return (
    <div
      className={`pointer-events-none select-none touch-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between px-3 sm:px-8 pb-[max(1rem,env(safe-area-inset-bottom))] ${className}`}
    >
      {/* Authentic 8-bit D-Pad (Bottom-Left) */}
      <div className="pointer-events-auto relative w-38 h-38 flex items-center justify-center">
        {/* Base Plate */}
        <div className="absolute inset-2 rounded-full bg-slate-950/80 border-2 border-black shadow-2xl" />

        {/* Up Button */}
        <button
          type="button"
          aria-label="Di chuyển lên"
          onPointerDown={() => handleDirectionPress("up")}
          onPointerUp={handleDirectionRelease}
          onPointerCancel={handleDirectionRelease}
          className={`absolute top-0 w-12 h-12 flex items-center justify-center font-pixel text-base transition-all ${
            activeDirection === "up"
              ? "bg-amber-400 text-black border-2 border-black translate-y-1"
              : "bg-slate-800 text-amber-300 border-t-2 border-l-2 border-slate-600 border-b-2 border-r-2 border-black"
          }`}
        >
          ▲
        </button>

        {/* Left Button */}
        <button
          type="button"
          aria-label="Di chuyển sang trái"
          onPointerDown={() => handleDirectionPress("left")}
          onPointerUp={handleDirectionRelease}
          onPointerCancel={handleDirectionRelease}
          className={`absolute left-0 w-12 h-12 flex items-center justify-center font-pixel text-base transition-all ${
            activeDirection === "left"
              ? "bg-amber-400 text-black border-2 border-black translate-x-1"
              : "bg-slate-800 text-amber-300 border-t-2 border-l-2 border-slate-600 border-b-2 border-r-2 border-black"
          }`}
        >
          ◀
        </button>

        {/* Center Pivot */}
        <div className="w-10 h-10 bg-slate-900 border-2 border-black flex items-center justify-center pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-700 border border-black" />
        </div>

        {/* Right Button */}
        <button
          type="button"
          aria-label="Di chuyển sang phải"
          onPointerDown={() => handleDirectionPress("right")}
          onPointerUp={handleDirectionRelease}
          onPointerCancel={handleDirectionRelease}
          className={`absolute right-0 w-12 h-12 flex items-center justify-center font-pixel text-base transition-all ${
            activeDirection === "right"
              ? "bg-amber-400 text-black border-2 border-black -translate-x-1"
              : "bg-slate-800 text-amber-300 border-t-2 border-l-2 border-slate-600 border-b-2 border-r-2 border-black"
          }`}
        >
          ▶
        </button>

        {/* Down Button */}
        <button
          type="button"
          aria-label="Di chuyển xuống"
          onPointerDown={() => handleDirectionPress("down")}
          onPointerUp={handleDirectionRelease}
          onPointerCancel={handleDirectionRelease}
          className={`absolute bottom-0 w-12 h-12 flex items-center justify-center font-pixel text-base transition-all ${
            activeDirection === "down"
              ? "bg-amber-400 text-black border-2 border-black -translate-y-1"
              : "bg-slate-800 text-amber-300 border-t-2 border-l-2 border-slate-600 border-b-2 border-r-2 border-black"
          }`}
        >
          ▼
        </button>
      </div>

      {/* Authentic 8-bit Action Buttons A & B (Bottom-Right) */}
      <div className="pointer-events-auto flex items-end gap-3 sm:gap-5 pb-2">
        {/* Button B (Menu / Cancel) */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            aria-label="Nút B - Hủy hoặc Menu"
            onPointerDown={() => handleActionPress("B")}
            onPointerUp={handleActionRelease}
            onPointerCancel={handleActionRelease}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full font-pixel text-xl flex items-center justify-center retro-btn-red shadow-xl ${
              activeButton === "B" ? "translate-y-1 scale-95" : ""
            }`}
          >
            B
          </button>
          <span className="font-pixel text-[12px] text-rose-300 mt-1 uppercase drop-shadow font-bold">
            HỦY
          </span>
        </div>

        {/* Button A (Interact / Select) */}
        <div className="flex flex-col items-center mb-6">
          <button
            type="button"
            aria-label="Nút A - Tương tác hoặc Trò chuyện"
            onPointerDown={() => handleActionPress("A")}
            onPointerUp={handleActionRelease}
            onPointerCancel={handleActionRelease}
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full font-pixel text-2xl flex items-center justify-center retro-btn-green shadow-2xl ${
              activeButton === "A" ? "translate-y-1 scale-95" : ""
            }`}
          >
            A
          </button>
          <span className="font-pixel text-[13px] text-emerald-300 mt-1 uppercase drop-shadow font-bold">
            CHỌN
          </span>
        </div>
      </div>
    </div>
  );
}

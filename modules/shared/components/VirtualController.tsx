"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import EventBus from "@/modules/shared/game/EventBus";

export interface VirtualControllerProps {
  className?: string;
}

const BASE = 144; // px, joystick base diameter
const KNOB = 60; // px, thumb knob diameter
const RADIUS = (BASE - KNOB) / 2; // max knob travel from centre
const DEAD_ZONE = 0.18; // fraction of RADIUS ignored so a resting thumb does not move the player

function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const emit = (x: number, y: number) => EventBus.emit("input-move", { x, y });

  const update = (e: React.PointerEvent) => {
    const el = baseRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    const mag = Math.min(dist / RADIUS, 1);
    if (mag < DEAD_ZONE) return emit(0, 0);
    // speed ramps from 0 at the dead-zone edge to 1 at the rim; direction stays exact
    const speed = (mag - DEAD_ZONE) / (1 - DEAD_ZONE);
    const len = Math.hypot(dx, dy) || 1;
    emit((dx / len) * speed, (dy / len) * speed);
  };

  const release = () => {
    pointerId.current = null;
    setActive(false);
    setKnob({ x: 0, y: 0 });
    emit(0, 0);
  };

  // Never leave the player walking if the HUD unmounts mid-drag.
  useEffect(() => () => EventBus.emit("input-move", { x: 0, y: 0 }), []);

  // Stop the browser from treating a drag on the stick as scroll / swipe-back.
  useEffect(() => {
    const block = (e: TouchEvent) => e.cancelable && e.preventDefault();
    const el = baseRef.current;
    el?.addEventListener("touchstart", block, { passive: false });
    el?.addEventListener("touchmove", block, { passive: false });
    return () => {
      el?.removeEventListener("touchstart", block);
      el?.removeEventListener("touchmove", block);
    };
  }, []);

  return (
    <div
      ref={baseRef}
      role="application"
      aria-label="Cần điều khiển di chuyển"
      onPointerDown={(e) => {
        if (pointerId.current !== null) return;
        pointerId.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        setActive(true);
        if (navigator.vibrate) navigator.vibrate(10);
        update(e);
      }}
      onPointerMove={(e) => e.pointerId === pointerId.current && update(e)}
      onPointerUp={(e) => e.pointerId === pointerId.current && release()}
      onPointerCancel={(e) => e.pointerId === pointerId.current && release()}
      onLostPointerCapture={() => pointerId.current !== null && release()}
      className="pointer-events-auto relative touch-none shrink-0 ml-[max(1.5rem,env(safe-area-inset-left))] sm:ml-0"
      style={{ width: BASE, height: BASE }}
    >
      <div
        className={`absolute inset-0 rounded-full border-4 border-black shadow-2xl ${
          active ? "bg-slate-900/90" : "bg-slate-950/80"
        }`}
      />
      <div className="absolute inset-4 rounded-full border-2 border-slate-700/70" />
      <span className="absolute left-1/2 top-1 -translate-x-1/2 font-pixel text-[20px] text-amber-300/60">▲</span>
      <span className="absolute left-1/2 bottom-1 -translate-x-1/2 font-pixel text-[20px] text-amber-300/60">▼</span>
      <span className="absolute top-1/2 left-1 -translate-y-1/2 font-pixel text-[20px] text-amber-300/60">◀</span>
      <span className="absolute top-1/2 right-1 -translate-y-1/2 font-pixel text-[20px] text-amber-300/60">▶</span>
      <div
        className={`absolute rounded-full border-4 border-black ${
          active ? "bg-amber-400" : "bg-amber-500/90"
        }`}
        style={{
          width: KNOB,
          height: KNOB,
          left: (BASE - KNOB) / 2 + knob.x,
          top: (BASE - KNOB) / 2 + knob.y,
        }}
      >
        <div className="absolute left-2 top-2 w-3 h-3 bg-amber-200/80" />
      </div>
    </div>
  );
}

function EdgeGuard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const block = (e: TouchEvent) => e.cancelable && e.preventDefault();
    el?.addEventListener("touchstart", block, { passive: false });
    return () => el?.removeEventListener("touchstart", block);
  }, []);
  return <div ref={ref} aria-hidden className="pointer-events-auto touch-none fixed left-0 top-0 bottom-0 w-5" />;
}

export default function VirtualController({
  className = "",
}: VirtualControllerProps) {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const vibrate = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

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
      {/* Left-edge guard: browsers start "swipe back" from the first ~24px; a thumb landing here is absorbed. */}
      <EdgeGuard />

      {/* Analog joystick (Bottom-Left): slide the thumb inside the circle */}
      <Joystick />

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
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full font-pixel text-[40px] flex items-center justify-center retro-btn-red shadow-xl ${
              activeButton === "B" ? "translate-y-1 scale-95" : ""
            }`}
          >
            B
          </button>
          <span className="font-pixel text-[24px] text-rose-300 mt-1 uppercase drop-shadow font-bold">
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
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full font-pixel text-[48px] flex items-center justify-center retro-btn-green shadow-2xl ${
              activeButton === "A" ? "translate-y-1 scale-95" : ""
            }`}
          >
            A
          </button>
          <span className="font-pixel text-[26px] text-emerald-300 mt-1 uppercase drop-shadow font-bold">
            CHỌN
          </span>
        </div>
      </div>
    </div>
  );
}

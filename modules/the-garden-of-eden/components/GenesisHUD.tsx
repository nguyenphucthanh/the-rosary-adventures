"use client";

import { useEffect, useState } from "react";
import { GENESIS_STAGES, SEAL_COUNT, STAGE_SCENES } from "@/modules/the-garden-of-eden/data/stagesData";
import type { GenesisSaveData } from "@/modules/the-garden-of-eden/types/game";
import EventBus from "@/modules/shared/game/EventBus";

export default function GenesisHUD({ saveData }: { saveData: GenesisSaveData | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [grace, setGrace] = useState({ current: 0, max: 0 });
  const progress = saveData?.stagesProgress ?? {};
  const lit = GENESIS_STAGES.filter((s) => progress[s.key]?.sealLit || progress[s.key]?.completed).length;

  // Esc (desktop) and virtual button B (mobile) toggle the scroll.
  useEffect(() => {
    const toggle = () => setIsOpen((o) => !o);
    const onKey = (e: KeyboardEvent) => e.code === "Escape" && toggle();
    let dual = false; // Stage 9 uses B to swap Adam/Eve
    const onScene = (d: { sceneKey: string }) => (dual = d.sceneKey === "Stage09EveCoopScene");
    const onAction = (d: { action: "A" | "B" | "MENU" }) => d.action === "B" && !dual && toggle();
    window.addEventListener("keydown", onKey);
    EventBus.on("input-action", onAction);
    EventBus.on("scene-ready", onScene);
    return () => {
      window.removeEventListener("keydown", onKey);
      EventBus.off("input-action", onAction);
      EventBus.off("scene-ready", onScene);
    };
  }, []);

  useEffect(() => {
    EventBus.on("grace-update", setGrace);
    return () => EventBus.off("grace-update", setGrace);
  }, []);

  return (
    <>
      {grace.max > 0 && (
        <div className="fixed top-14 sm:top-16 left-2 sm:left-4 z-30 flex gap-1 pointer-events-none" title="Ân Sủng">
          {Array.from({ length: grace.max }, (_, i) => (
            <span key={i} className={`w-4 h-4 border-2 ${i < grace.current ? "bg-amber-400 border-amber-200" : "bg-slate-800 border-slate-600"}`} />
          ))}
        </div>
      )}
      <div className="fixed top-14 sm:top-16 right-2 sm:right-4 z-30 flex flex-col items-end gap-1 select-none pointer-events-auto">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            title="Xem Cuộn Sách Sáng Thế"
            className="retro-frame px-3 py-1.5 bg-slate-950/90 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <span className="text-[18px] leading-none">📜</span>
            <span className="font-pixel text-[14px] sm:text-[16px] text-amber-300">SÁNG THẾ {lit}/{SEAL_COUNT}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/80 select-none">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col retro-frame-gold bg-slate-950 p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-600/60">
              <div>
                <h2 className="pixel-title text-[32px] sm:text-[36px] text-amber-300">CUỘN SÁCH SÁNG THẾ</h2>
                <p className="font-pixel text-[22px] text-amber-100/70">Đã khắc sáng: {lit}/{SEAL_COUNT} Ấn Dấu</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Đóng" className="retro-btn-red px-3 py-1 text-[24px] font-pixel active:translate-y-0.5">
                ✕
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-3">
              {GENESIS_STAGES.map((s) => {
                const isLit = !!(progress[s.key]?.sealLit || progress[s.key]?.completed);
                const scene = progress[s.key]?.completed ? STAGE_SCENES[s.key] : undefined; // replay only finished stages
                return (
                  <li
                    key={s.key}
                    className={`p-3.5 border-2 flex items-start gap-3 ${isLit ? "bg-amber-950/40 border-amber-500/90" : "bg-slate-900/60 border-slate-800 opacity-80"}`}
                  >
                    <div
                      className={`mt-0.5 w-7 h-7 shrink-0 flex items-center justify-center text-[14px] border-2 ${isLit ? "bg-amber-400 border-amber-200 text-slate-950" : "bg-slate-800 border-slate-600 text-slate-500"}`}
                    >
                      {isLit ? "✨" : s.index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-mono px-1.5 bg-slate-800 text-amber-200 rounded">{s.scripture}</span>
                      <h3 className="font-retro text-[18px] sm:text-[20px] text-amber-100 font-bold mt-0.5">{s.titleVi}</h3>
                      <p className="font-retro text-[16px] text-amber-200/90">{isLit ? s.fruitVi : s.genreVi}</p>
                    </div>
                    {scene && (
                      <button
                        type="button"
                        onClick={() => { setIsOpen(false); EventBus.emit("scene-change-request", { targetSceneKey: scene }); }}
                        className="retro-btn self-center px-3 py-1.5 font-pixel text-[14px] text-amber-300 shrink-0"
                      >
                        ▶ CHƠI LẠI
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { MYSTERIES_DATA, INTERLUDES_DATA, SEASONS } from "@/modules/the-rosary-adventures/data/mysteries";
import { SaveData, MysterySeason } from "@/modules/the-rosary-adventures/types/game";
import { EPILOGUE_SCENE, PROLOGUE_SCENE, STAGE_SCENES } from "@/modules/the-rosary-adventures/data/stages";
import EventBus from "@/modules/shared/game/EventBus";

interface RosaryHUDProps {
  saveData: SaveData | null;
}

export default function RosaryHUD({ saveData }: RosaryHUDProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<MysterySeason>("joyful");
  const [extraLit, setExtraLit] = useState(0);

  const savedLitCount = saveData
    ? MYSTERIES_DATA.filter(
      (m) => saveData.mysteriesProgress[m.key]?.beadLit || saveData.mysteriesProgress[m.key]?.completed
    ).length
    : 0;
  const litBeadsCount = Math.min(20, Math.max(savedLitCount, extraLit));

  // Listen to bead-lit event for instant visual feedback
  useEffect(() => {
    const handleBeadLit = () => {
      setExtraLit((prev) => Math.min(20, Math.max(prev, savedLitCount) + 1));
    };
    EventBus.on("bead-lit", handleBeadLit);
    return () => {
      EventBus.off("bead-lit", handleBeadLit);
    };
  }, [savedLitCount]);

  // Esc (desktop) and virtual button B (mobile) toggle the menu, as the control hint and plan promise.
  useEffect(() => {
    const toggle = () => setIsOpen((o) => !o);
    const onKey = (e: KeyboardEvent) => e.code === "Escape" && toggle();
    const onAction = (d: { action: "A" | "B" | "MENU" }) => d.action === "B" && toggle();
    window.addEventListener("keydown", onKey);
    EventBus.on("input-action", onAction);
    return () => {
      window.removeEventListener("keydown", onKey);
      EventBus.off("input-action", onAction);
    };
  }, []);

  const replay = (mysteryKey: string) => {
    setIsOpen(false);
    EventBus.emit("dialogue-close"); // drop any open dialogue without running its onComplete
    EventBus.emit("scene-change-request", { targetSceneKey: STAGE_SCENES[mysteryKey], mysteryKey });
  };

  const goTo = (targetSceneKey: string) => {
    setIsOpen(false);
    EventBus.emit("dialogue-close");
    EventBus.emit("scene-change-request", { targetSceneKey });
  };

  const progress = saveData?.mysteriesProgress || {};
  const finished = !!progress["mung_05_doi_trieu_thien"]?.completed; // the ending is a spoiler until the journey is done

  // Current Season's 5 mysteries
  const currentSeasonMysteries = MYSTERIES_DATA.filter(
    (m) => m.season === selectedSeason
  );

  return (
    <>
      {/* 1. Floating Top HUD Button (Collapsible / Compact Ribbon) */}
      <div className="fixed top-14 sm:top-16 right-2 sm:right-4 z-30 flex flex-col items-end gap-1 select-none pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Nhấn để xem Chuỗi 20 Mầu Nhiệm Mân Côi"
          className="retro-frame px-3 py-1.5 bg-slate-950/90 flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 group shadow-lg"
        >
          {/* Rosary Icon with gentle shine */}
          <span className="text-[18px] leading-none filter drop-shadow">📿</span>

          {/* Beads Miniature Counter */}
          <div className="flex flex-col items-start text-left">
            <span className="font-pixel text-[14px] sm:text-[16px] text-amber-300 tracking-wider">
              CHUỖI MÂN CÔI
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              {/* Mini 5 dots for Joyful season */}
              <div className="flex items-center gap-1 mr-1">
                {MYSTERIES_DATA.slice(0, 5).map((m, idx) => {
                  const isLit = !!progress[m.key]?.beadLit;
                  return (
                    <span
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${isLit
                        ? "bg-amber-400 border-amber-200 shadow-[0_0_6px_#f59e0b] animate-pulse"
                        : "bg-slate-800 border-slate-600"
                        }`}
                    />
                  );
                })}
              </div>
              <span className="font-pixel text-[14px] text-amber-100 font-bold">
                {litBeadsCount}/20
              </span>
            </div>
          </div>

          {/* Quick View Tag */}
          <span className="text-amber-400 font-pixel text-[12px] ml-1 group-hover:translate-x-0.5 transition-transform">
            ▶
          </span>
        </button>
      </div>

      {/* 2. Full Retro Modal (Bảng Chiêm Ngắm 20 Mầu Nhiệm) */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col retro-frame-gold bg-slate-950 p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-600/60">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="pixel-title text-[32px] sm:text-[36px] text-amber-300">
                    20 MẦU NHIỆM MÂN CÔI
                  </h2>
                  <p className="font-pixel text-[22px] sm:text-[24px] text-amber-100/70">
                    Đã thắp sáng: {litBeadsCount}/20 hạt mầu nhiệm
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng"
                className="retro-btn-red px-3 py-1 text-[24px] font-pixel active:translate-y-0.5"
              >
                ✕
              </button>
            </div>

            {/* Prologue / Epilogue shortcuts */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-3">
              <button
                type="button"
                onClick={() => goTo(PROLOGUE_SCENE)}
                className="retro-btn-gold px-2 py-2 font-pixel text-[24px] text-amber-100 active:translate-y-0.5"
              >
                🕯️ MÀN MỞ ĐẦU
              </button>
              <button
                type="button"
                disabled={!finished}
                onClick={() => goTo(EPILOGUE_SCENE)}
                title={finished ? undefined : "Hoàn thành Chặng 20 để mở khóa"}
                className="retro-btn-gold px-2 py-2 font-pixel text-[24px] text-amber-100 active:translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none"
              >
                {finished ? "🏡 MÀN KẾT" : "🔒 MÀN KẾT"}
              </button>
            </div>

            {/* Season Tabs Selector (4 Mùa) */}
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5 sm:gap-2 my-3">
              {(Object.keys(SEASONS) as MysterySeason[]).map((seasonKey) => {
                const s = SEASONS[seasonKey];
                const isSelected = selectedSeason === seasonKey;
                // Count lit beads in this season
                const seasonMysteries = MYSTERIES_DATA.filter(
                  (m) => m.season === seasonKey
                );
                const seasonLitCount = seasonMysteries.filter(
                  (m) => progress[m.key]?.beadLit
                ).length;

                return (
                  <button
                    key={seasonKey}
                    type="button"
                    onClick={() => setSelectedSeason(seasonKey)}
                    className={`px-2 py-2 text-center font-pixel text-[24px] border-2 transition-all flex flex-col items-center gap-0 ${isSelected
                      ? "bg-amber-600 border-amber-300 text-white shadow-md -translate-y-0.5"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{s.labelVi}</span>
                    </div>
                    <span className="text-[20px] opacity-80">
                      {seasonLitCount}/5 Hạt
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mysteries List for Selected Season */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-1">
              {currentSeasonMysteries.map((item) => {
                const isCompleted = !!progress[item.key]?.completed;
                const isLit = !!progress[item.key]?.beadLit;
                const interlude = INTERLUDES_DATA.find((it) => it.afterMysteryKey === item.key);
                const interludeDone = interlude ? !!progress[interlude.key]?.completed : false;

                return (
                  <React.Fragment key={item.key}>
                    <div
                      className={`p-3.5 border-2 transition-all ${isLit
                        ? "bg-amber-950/40 border-amber-500/90 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                        : "bg-slate-900/60 border-slate-800 opacity-80"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        {/* Left: Bead Status & Title */}
                        <div className="flex items-start gap-3">
                          {/* Lit Bead Icon */}
                          <div
                            className={`mt-0.5 w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[14px] border-2 ${isLit
                              ? "bg-amber-400 border-amber-200 text-slate-950 shadow-[0_0_10px_#f59e0b] animate-pulse"
                              : "bg-slate-800 border-slate-600 text-slate-500"
                              }`}
                          >
                            {isLit ? "✨" : item.seasonIndex + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-pixel text-[12px] text-amber-400">
                                {item.decadeNameVi}
                              </span>
                              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-800 text-amber-200 rounded">
                                {item.scriptureVi}
                              </span>
                            </div>

                            <h3 className="font-retro text-[18px] sm:text-[20px] text-amber-100 font-bold mt-0.5">
                              {item.titleVi}
                            </h3>

                            {/* Spiritual Fruit (Hoa trái suy niệm) */}
                            <div className="mt-1.5 font-retro text-[18px] sm:text-[22px] text-amber-200/90 flex items-center gap-1.5">
                              <span>{item.fruitVi}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Badge */}
                        <div className="shrink-0 text-right">
                          {isLit ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-400 text-amber-300 font-pixel text-[11px] rounded">
                              <span>ĐÃ SÁNG</span>
                              <span>★</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 font-pixel text-[10px] rounded">
                              CHƯA SÁNG
                            </span>
                          )}
                          {isCompleted && STAGE_SCENES[item.key] && (
                            <button
                              type="button"
                              onClick={() => replay(item.key)}
                              className="mt-1.5 block ml-auto retro-btn-gold px-2.5 py-1 font-pixel text-[11px] text-amber-100 active:translate-y-0.5"
                            >
                              ▶ CHƠI LẠI
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Mid-Stage or Season Bridge right after this Mystery */}
                    {interlude && STAGE_SCENES[interlude.key] && (
                      <div
                        className={`ml-4 sm:ml-6 p-2.5 border-2 border-dashed transition-all flex items-center justify-between gap-2 ${interlude.kind === "bridge"
                          ? "bg-sky-950/35 border-sky-500/70"
                          : "bg-emerald-950/35 border-emerald-500/70"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-[18px]">{interlude.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-pixel text-[10px] ${interlude.kind === "bridge" ? "text-sky-300" : "text-emerald-300"
                                  }`}
                              >
                                {interlude.badgeVi}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 bg-slate-800 text-amber-200 rounded">
                                {interlude.scriptureVi}
                              </span>
                              {interludeDone && (
                                <span className="font-pixel text-[10px] text-amber-300">✓ ĐÃ QUA</span>
                              )}
                            </div>
                            <div className="font-retro text-[16px] text-amber-100 font-bold">
                              {interlude.titleVi}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => replay(interlude.key)}
                          className="shrink-0 retro-btn-gold px-2.5 py-1 font-pixel text-[11px] text-amber-100 active:translate-y-0.5"
                        >
                          ⚡ CHƠI NGAY
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Modal Footer Guidance */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-pixel text-[22px] sm:text-[24px] text-slate-400">
              <span>Mỗi chặng hoàn thành sẽ thắp sáng 1 hạt Mân Côi tương ứng</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

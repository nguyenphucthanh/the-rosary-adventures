"use client";

import { useEffect, useState } from "react";
import { NOAH_STAGES, SEAL_COUNT, STAGE_SCENES } from "@/modules/noahs-ark/data/stagesData";
import type { NoahSaveData } from "@/modules/noahs-ark/types/game";
import EventBus from "@/modules/shared/game/EventBus";
import { useLang, useT } from "@/modules/shared/i18n";

export default function NoahHUD({ saveData }: { saveData: NoahSaveData | null }) {
  const t = useT();
  const lang = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [grace, setGrace] = useState({ current: 0, max: 0 });
  const progress = saveData?.stagesProgress ?? {};
  const isLit = (key: (typeof NOAH_STAGES)[number]["key"]) => !!(progress[key]?.tokenLit || progress[key]?.completed);
  const lit = NOAH_STAGES.filter((s) => isLit(s.key)).length;

  // Esc (desktop) and virtual button B (mobile) toggle the chart.
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

  useEffect(() => {
    EventBus.on("grace-update", setGrace);
    return () => EventBus.off("grace-update", setGrace);
  }, []);

  return (
    <>
      {grace.max > 0 && (
        <div className="fixed top-14 sm:top-16 left-2 sm:left-4 z-30 flex gap-1 pointer-events-none" title={t("Giọt Bình An", "Drops of Peace")}>
          {Array.from({ length: grace.max }, (_, i) => (
            <span key={i} className={`w-4 h-4 border-2 ${i < grace.current ? "bg-sky-400 border-sky-200" : "bg-slate-800 border-slate-600"}`} />
          ))}
        </div>
      )}
      <div className="fixed top-14 sm:top-16 right-2 sm:right-4 z-30 flex flex-col items-end gap-1 select-none pointer-events-auto">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            title={t("Xem Hải Đồ Giao Ước", "View the Covenant Sea Chart")}
            className="retro-frame px-3 py-1.5 bg-slate-950/90 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <span className="text-[18px] leading-none">🚢</span>
            <span className="font-pixel text-[14px] sm:text-[16px] text-amber-300">{t("HẢI ĐỒ", "SEA CHART")} {lit}/{SEAL_COUNT}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/80 select-none">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col retro-frame-gold bg-slate-950 p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-600/60">
              <div>
                <h2 className="pixel-title text-[32px] sm:text-[36px] text-amber-300">{t("HẢI ĐỒ GIAO ƯỚC", "COVENANT SEA CHART")}</h2>
                <p className="font-pixel text-[22px] text-amber-100/70">{t("Đã thắp sáng", "Lit")}: {lit}/{SEAL_COUNT} {t("Ấn Dấu Cầu Vồng", "Rainbow Seals")}</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label={t("Đóng", "Close")} className="retro-btn-red px-3 py-1 text-[24px] font-pixel active:translate-y-0.5">
                ✕
              </button>
            </div>

            {/* Ark map: the eight seals as a rainbow strip */}
            <div className="flex gap-1 mt-3" aria-hidden>
              {NOAH_STAGES.map((s) => (
                <span key={s.key} className="h-3 flex-1 border-2 border-slate-700" style={{ background: isLit(s.key) ? s.color : "#1e293b" }} />
              ))}
            </div>

            <ul className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-3">
              {NOAH_STAGES.map((s) => {
                const on = isLit(s.key);
                const scene = progress[s.key]?.completed ? STAGE_SCENES[s.key] : undefined; // replay only finished stages
                return (
                  <li key={s.key} className={`p-3.5 border-2 flex items-start gap-3 ${on ? "bg-amber-950/40 border-amber-500/90" : "bg-slate-900/60 border-slate-800 opacity-80"}`}>
                    <div
                      className="mt-0.5 w-7 h-7 shrink-0 flex items-center justify-center text-[14px] border-2 border-slate-600 text-slate-950"
                      style={{ background: on ? s.color : "#1e293b", color: on ? undefined : "#64748b" }}
                    >
                      {on ? "✨" : s.index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-mono px-1.5 bg-slate-800 text-amber-200 rounded">{s.scripture}</span>
                      <h3 className="font-retro text-[18px] sm:text-[20px] text-amber-100 font-bold mt-0.5">{lang === "en" ? s.titleEn : s.titleVi}</h3>
                      <p className="font-retro text-[16px] text-amber-200/90">{on ? (lang === "en" ? s.fruitEn : s.fruitVi) : (lang === "en" ? s.genreEn : s.genreVi)}</p>
                    </div>
                    {scene && (
                      <button
                        type="button"
                        onClick={() => { setIsOpen(false); EventBus.emit("scene-change-request", { targetSceneKey: scene }); }}
                        className="retro-btn self-center px-3 py-1.5 font-pixel text-[14px] text-amber-300 shrink-0"
                      >
                        ▶ {t("CHƠI LẠI", "REPLAY")}
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

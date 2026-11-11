import { DEFAULT_CHARACTER, type CharacterCustomization } from "@/modules/shared/types";
import { EXODUS_STAGE_KEYS } from "@/modules/moses-the-exodus/types/game";
import { EXODUS_STAGES } from "@/modules/moses-the-exodus/data/stagesData";
import { STORAGE_KEY as MOSES_KEY } from "@/modules/moses-the-exodus/utils/saveManager";
import { NOAH_STAGE_KEYS } from "@/modules/noahs-ark/types/game";
import { NOAH_STAGES } from "@/modules/noahs-ark/data/stagesData";
import { STORAGE_KEY as NOAH_KEY } from "@/modules/noahs-ark/utils/saveManager";
import { GENESIS_STAGE_KEYS } from "@/modules/the-garden-of-eden/types/game";
import { GENESIS_STAGES } from "@/modules/the-garden-of-eden/data/stagesData";
import { STORAGE_KEY as EDEN_KEY } from "@/modules/the-garden-of-eden/utils/saveManager";
import { MYSTERY_KEYS } from "@/modules/the-rosary-adventures/types/game";
import { MYSTERIES_DATA } from "@/modules/the-rosary-adventures/data/mysteries";
import { DEFAULT_SAVE_SLOT, STORAGE_KEY_PREFIX as ROSARY_PREFIX } from "@/modules/the-rosary-adventures/utils/saveManager";

export interface StageOption { key: string; label: string }
/** What a stored save currently says (null when it is missing or invalid). */
export interface SaveView { done: Set<string>; resume: string; character: CharacterCustomization; name: string }

export interface GameCfg {
  id: string;
  title: string;
  route: string;
  storageKey: string;
  stages: StageOption[];
  /** Build a save where exactly `done` stages are completed and the game resumes at `resume`. */
  build(done: Set<string>, resume: string, character: CharacterCustomization): unknown;
  read(parsed: unknown): SaveView | null;
}

/** Moses, Noah and Eden share one save shape; only the seal field name differs. */
function stageGame(o: { id: string; title: string; route: string; storageKey: string; keys: readonly string[]; labels: Record<string, string>; sealField: string }): GameCfg {
  const sealed = o.keys.filter((k) => k.startsWith("stage_"));
  return {
    id: o.id, title: o.title, route: o.route, storageKey: o.storageKey,
    stages: o.keys.map((k) => ({ key: k, label: o.labels[k] ?? k })),
    build(done, resume, character) {
      const progress: Record<string, Record<string, unknown>> = {};
      for (const k of o.keys) if (done.has(k)) progress[k] = { completed: true, [o.sealField]: sealed.includes(k), ...(sealed.includes(k) ? { bestAttempts: 1 } : {}) };
      const idx = sealed.indexOf(resume);
      return {
        version: "1.0.0", timestamp: Date.now(),
        currentStageKey: resume,
        currentStageIndex: idx >= 0 ? idx : resume.startsWith("epilogue") ? sealed.length - 1 : 0,
        player: { customization: character, x: 100, y: 100, direction: "down" },
        stagesProgress: progress,
      };
    },
    read(p) {
      const d = p as { version?: string; currentStageKey?: string; player?: { customization?: CharacterCustomization }; stagesProgress?: Record<string, { completed?: boolean }> } | null;
      if (!d || d.version !== "1.0.0" || typeof d.currentStageKey !== "string" || !d.player?.customization || !d.stagesProgress) return null;
      return { done: new Set(o.keys.filter((k) => d.stagesProgress?.[k]?.completed)), resume: d.currentStageKey, character: d.player.customization, name: d.player.customization.name };
    },
  };
}

const moses = stageGame({
  id: "moses", title: "Moses – The Exodus", route: "/moses-the-exodus", storageKey: MOSES_KEY, keys: EXODUS_STAGE_KEYS, sealField: "tabletLit",
  labels: { prologue_cay_gay_nguoi_muc_tu: "Prologue: Bản đồ sa mạc & cây gậy", epilogue_vuot_qua_moi: "Epilogue: Cuộc Vượt Qua Mới", ...Object.fromEntries(EXODUS_STAGES.map((s) => [s.key, `Stage ${s.index + 1}: ${s.titleVi}`])) },
});
const noah = stageGame({
  id: "noah", title: "Noah's Ark", route: "/noahs-ark", storageKey: NOAH_KEY, keys: NOAH_STAGE_KEYS, sealField: "tokenLit",
  labels: { prologue_canh_chim_va_con_tau: "Prologue", epilogue_con_tau_hoi_thanh: "Epilogue", ...Object.fromEntries(NOAH_STAGES.map((s) => [s.key, `Stage ${s.index + 1}: ${s.titleVi}`])) },
});
const eden = stageGame({
  id: "eden", title: "The Garden of Eden", route: "/the-garden-of-eden", storageKey: EDEN_KEY, keys: GENESIS_STAGE_KEYS, sealField: "sealLit",
  labels: { prologue_trang_sach_dau: "Prologue", epilogue_khu_vuon_tam_hon: "Epilogue", ...Object.fromEntries(GENESIS_STAGES.map((s) => [s.key, `Stage ${s.index + 1}: ${s.titleVi}`])) },
});

const rosary: GameCfg = {
  id: "rosary", title: "The Rosary Adventures", route: "/the-rosary-adventures", storageKey: `${ROSARY_PREFIX}${DEFAULT_SAVE_SLOT}`,
  stages: MYSTERIES_DATA.map((m) => ({ key: m.key, label: `${m.index + 1}. ${m.seasonLabelVi} – ${m.titleVi}` })),
  build(done, resume, character) {
    const progress: Record<string, unknown> = {};
    for (const k of MYSTERY_KEYS) progress[k] = { completed: done.has(k), beadLit: done.has(k), questsCompleted: [] };
    return {
      version: "1.0.0", timestamp: Date.now(),
      currentMysteryKey: resume, currentMysteryIndex: Math.max(0, MYSTERY_KEYS.indexOf(resume as (typeof MYSTERY_KEYS)[number])),
      player: { customization: character, x: 100, y: 100, direction: "down" },
      mysteriesProgress: progress, inventory: [],
    };
  },
  read(p) {
    const d = p as { version?: string; currentMysteryKey?: string; player?: { customization?: CharacterCustomization }; mysteriesProgress?: Record<string, { completed?: boolean }> } | null;
    if (!d || d.version !== "1.0.0" || typeof d.currentMysteryKey !== "string" || !d.player?.customization || !d.mysteriesProgress) return null;
    return { done: new Set(MYSTERY_KEYS.filter((k) => d.mysteriesProgress?.[k]?.completed)), resume: d.currentMysteryKey, character: d.player.customization, name: d.player.customization.name };
  },
};

export const GAMES: GameCfg[] = [moses, noah, eden, rosary];
export { DEFAULT_CHARACTER };

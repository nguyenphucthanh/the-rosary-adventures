import { type CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";

export const NOAH_STAGE_KEYS = [
  "prologue_canh_chim_va_con_tau",
  "stage_01_nguoi_cong_chinh",
  "stage_02_ban_ve_go_bach",
  "stage_03_muon_thu_len_tau",
  "stage_04_dong_cua_mua_lu",
  "stage_05_lenh_denh_bien_nuoc",
  "stage_06_dinh_nui_ararat",
  "stage_07_nhanh_la_oliu",
  "stage_08_cau_vong_giao_uoc",
  "epilogue_con_tau_hoi_thanh",
] as const;

export type NoahStageKey = (typeof NOAH_STAGE_KEYS)[number];

export interface StageProgress {
  completed: boolean;
  tokenLit: boolean; // Ấn Dấu Cầu Vồng Giao Ước đã thắp sáng
  bestAttempts?: number;
}

export interface NoahSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: NoahStageKey;
  currentStageIndex: number; // 0..7 (8 Ấn Dấu Cầu Vồng chính)
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: Partial<Record<NoahStageKey, StageProgress>>;
}

export function createInitialSaveData(customization: CharacterCustomization = DEFAULT_CHARACTER): NoahSaveData {
  return {
    version: "1.0.0",
    timestamp: Date.now(),
    currentStageKey: NOAH_STAGE_KEYS[0],
    currentStageIndex: 0,
    player: { customization, x: 100, y: 100, direction: "down" },
    stagesProgress: {},
  };
}

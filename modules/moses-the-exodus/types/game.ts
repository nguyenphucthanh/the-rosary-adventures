import { type CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";

export const EXODUS_STAGE_KEYS = [
  "prologue_cay_gay_nguoi_muc_tu",
  "stage_01_thung_coi_song_nin",
  "stage_02_hoang_tu_va_gieng_nuoc_madian",
  "stage_03_bui_cay_boc_chay",
  "stage_04_doi_dien_pharao",
  "stage_05_anh_sang_dat_gosen",
  "stage_06_dem_le_vuot_qua",
  "stage_07_re_nuoc_bien_do",
  "stage_08_khuc_ca_nuoc_mara",
  "stage_09_banh_manna_tu_troi",
  "stage_10_dap_da_va_doi_tay",
  "stage_11_muoi_dieu_ran_xinai",
  "stage_12_be_vang_chuyen_cau",
  "stage_13_nha_tam_giao_uoc",
  "epilogue_vuot_qua_moi",
] as const;

export type ExodusStageKey = (typeof EXODUS_STAGE_KEYS)[number];

export interface StageProgress {
  completed: boolean;
  tabletLit: boolean; // Ấn Dấu Xuất Hành đã khắc sáng trên Bia Đá
  bestAttempts?: number;
}

export interface ExodusSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: ExodusStageKey;
  currentStageIndex: number; // 0..12 (13 Ấn Dấu Xuất Hành chính)
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: Partial<Record<ExodusStageKey, StageProgress>>;
}

export function createInitialSaveData(customization: CharacterCustomization = DEFAULT_CHARACTER): ExodusSaveData {
  return {
    version: "1.0.0",
    timestamp: Date.now(),
    currentStageKey: EXODUS_STAGE_KEYS[0],
    currentStageIndex: 0,
    player: { customization, x: 100, y: 100, direction: "down" },
    stagesProgress: {},
  };
}

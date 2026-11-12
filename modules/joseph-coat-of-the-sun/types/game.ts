import { type CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";

export const JOSEPH_STAGE_KEYS = [
  "prologue_chiec_ao_ban_do",
  "stage_01_giac_mo_bo_lua",
  "stage_02_duong_den_dothan",
  "stage_03_gieng_can_dothan",
  "stage_04_doan_lai_buon_sa_mac",
  "stage_05_nha_putiphac",
  "stage_06_hanh_lang_cua_mo",
  "stage_07_trong_nguc",
  "stage_08_cung_pharao_bay_bo",
  "stage_09_te_tuong_kho_lua",
  "stage_10_nan_doi_cac_anh_tro_lai",
  "stage_11_chen_bac_giuda",
  "stage_12_gosen_tha_thu",
  "epilogue_giuse_va_chua_gie_su",
] as const;

export type JosephStageKey = (typeof JOSEPH_STAGE_KEYS)[number];

export interface StageProgress {
  completed: boolean;
  rayLit: boolean; // tia nắng trên Chiếc Áo Mặt Trời đã thắp sáng
  bestAttempts?: number;
}

export interface JosephSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: JosephStageKey;
  currentStageIndex: number; // 0..11 = 12 tia nắng
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: Partial<Record<JosephStageKey, StageProgress>>;
}

export function createInitialSaveData(customization: CharacterCustomization = DEFAULT_CHARACTER): JosephSaveData {
  return {
    version: "1.0.0",
    timestamp: Date.now(),
    currentStageKey: JOSEPH_STAGE_KEYS[0],
    currentStageIndex: 0,
    player: { customization, x: 100, y: 100, direction: "down" },
    stagesProgress: {},
  };
}

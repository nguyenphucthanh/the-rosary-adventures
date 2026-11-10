import { type CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";

export const GENESIS_STAGE_KEYS = [
  "prologue_trang_sach_dau",
  "stage_01_anh_sang",
  "stage_02_vom_troi",
  "stage_03_dat_lien_thao_moc",
  "stage_04_mat_troi_tinh_tu",
  "stage_05_ca_bien_chim_troi",
  "stage_06_muon_thu_con_nguoi",
  "stage_07_ngay_nghi_ngoi",
  "stage_08_bon_dong_song",
  "stage_09_tao_dung_eva",
  "stage_10_con_ran_trai_cam",
  "stage_11_tron_chay_trong_vuon",
  "stage_12_loi_hua_cuu_do",
  "epilogue_khu_vuon_tam_hon",
] as const;

export type GenesisStageKey = (typeof GENESIS_STAGE_KEYS)[number];

export interface StageProgress {
  completed: boolean;
  sealLit: boolean; // Ấn Dấu Sáng Thế đã khắc sáng
  bestAttempts?: number;
}

export interface GenesisSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: GenesisStageKey;
  currentStageIndex: number; // 0..11 (12 Ấn Dấu chính)
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: Partial<Record<GenesisStageKey, StageProgress>>;
}

export function createInitialSaveData(customization: CharacterCustomization = DEFAULT_CHARACTER): GenesisSaveData {
  return {
    version: "1.0.0",
    timestamp: Date.now(),
    currentStageKey: GENESIS_STAGE_KEYS[0],
    currentStageIndex: 0,
    player: { customization, x: 100, y: 100, direction: "down" },
    stagesProgress: {},
  };
}

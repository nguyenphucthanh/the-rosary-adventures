import { type CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";

export const DAVID_STAGE_KEYS = [
  "prologue_dan_hac_nguoi_muc_tu",
  "stage_01_dong_co_belem_xuc_dau",
  "stage_02_tieng_dan_cung_dien_saun",
  "stage_03_thung_lung_ela_goliat",
  "stage_04_giao_uoc_gionathan_mui_ten",
  "stage_05_banh_thanh_hang_adulam",
  "stage_06_hang_engedi_cat_vat_ao",
  "stage_07_ba_abigaiin_hoa_giai",
  "stage_08_cay_giao_binh_nuoc_khachila",
  "stage_09_khuc_ca_cay_cung",
  "stage_10_dang_quang_khepron_muoi_hai_chi_toc",
  "stage_11_mach_nuoc_gikhon_thanh_xion",
  "stage_12_ruoc_hom_bia_loi_hua_muon_doi",
  "epilogue_con_vua_davit",
] as const;

export type DavidStageKey = (typeof DAVID_STAGE_KEYS)[number];

export interface StageProgress {
  completed: boolean;
  psalmSealLit: boolean; // Ấn Thánh Vịnh trên Cây Đàn Hạc đã thắp sáng
  bestAttempts?: number;
}

export interface DavidSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: DavidStageKey;
  currentStageIndex: number; // 0..11 (12 Ấn Thánh Vịnh & Vương Quyền chính)
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: Partial<Record<DavidStageKey, StageProgress>>;
}

export function createInitialSaveData(customization: CharacterCustomization = DEFAULT_CHARACTER): DavidSaveData {
  return {
    version: "1.0.0",
    timestamp: Date.now(),
    currentStageKey: DAVID_STAGE_KEYS[0],
    currentStageIndex: 0,
    player: { customization, x: 100, y: 100, direction: "down" },
    stagesProgress: {},
  };
}

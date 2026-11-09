export type MysterySeason = "joyful" | "luminous" | "sorrowful" | "glorious";

export interface MysteryInfo {
  key: string;
  season: MysterySeason;
  index: number; // 0..19
  seasonIndex: number; // 0..4 (1st to 5th decade of each mystery)
  titleVi: string;
  titleEn: string;
  scriptureVi: string;
  scriptureEn: string;
  fruitVi: string;
  fruitEn: string;
}

export interface CharacterCustomization {
  name: string;
  gender: "boy" | "girl";
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitColor: string;
  accessory?: string;
  spriteKey: string;
}

export interface PlayerPosition {
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
}

export interface PlayerState extends PlayerPosition {
  customization: CharacterCustomization;
}

export interface MysteryProgress {
  completed: boolean;
  beadLit: boolean;
  questsCompleted: string[];
}

export interface SaveData {
  version: "1.0.0";
  timestamp: number;
  currentMysteryKey: string;
  currentMysteryIndex: number;
  player: PlayerState;
  mysteriesProgress: Record<string, MysteryProgress>;
  inventory: string[];
}

export const DEFAULT_CHARACTER: CharacterCustomization = {
  name: "Lữ Khách",
  gender: "boy",
  skinTone: "#f5d0a9",
  hairStyle: "short",
  hairColor: "#3d2314",
  outfitColor: "#2b5c8f",
  accessory: "rosary_beads",
  spriteKey: "player_boy_default",
};

export const MYSTERY_KEYS = [
  // 5 Sự Vui
  "vui_01_truyen_tin",
  "vui_02_vieng_ba",
  "vui_03_sinh_chua",
  "vui_04_dang_chua",
  "vui_05_tim_chua",
  // 5 Sự Sáng
  "sang_01_phep_rua",
  "sang_02_tiec_cuoi_cana",
  "sang_03_rao_giang",
  "sang_04_bien_hinh",
  "sang_05_thanh_the",
  // 5 Sự Thương
  "thuong_01_vuon_cay_dau",
  "thuong_02_danh_don",
  "thuong_03_doi_mao_gai",
  "thuong_04_vac_thap_gia",
  "thuong_05_chiu_chet",
  // 5 Sự Mừng
  "mung_01_phuc_sinh",
  "mung_02_len_troi",
  "mung_03_thanh_than_hien_xuong",
  "mung_04_duc_me_len_troi",
  "mung_05_doi_trieu_thien",
] as const;

export function createInitialSaveData(
  customization: CharacterCustomization = DEFAULT_CHARACTER
): SaveData {
  const initialProgress: Record<string, MysteryProgress> = {};
  for (const key of MYSTERY_KEYS) {
    initialProgress[key] = {
      completed: false,
      beadLit: false,
      questsCompleted: [],
    };
  }

  return {
    version: "1.0.0",
    timestamp: Date.now(),
    currentMysteryKey: MYSTERY_KEYS[0],
    currentMysteryIndex: 0,
    player: {
      customization,
      x: 100,
      y: 100,
      direction: "down",
    },
    mysteriesProgress: initialProgress,
    inventory: [],
  };
}

import { MYSTERY_KEYS } from "@/types/game";

/** Mystery key -> Phaser scene key. Only stages that are built appear here. */
export const STAGE_SCENES: Record<string, string> = {
  vui_01_truyen_tin: "Joyful01AnnunciationScene",
  vui_02_vieng_ba: "Joyful02VisitationScene",
  vui_03_sinh_chua: "Joyful03NativityScene",
  vui_04_dang_chua: "Joyful04PresentationScene",
  vui_05_tim_chua: "Joyful05FindingScene",
  sang_01_phep_rua: "Luminous01BaptismScene",
  sang_02_tiec_cuoi_cana: "Luminous02CanaScene",
  sang_03_rao_giang: "Luminous03BeatitudesScene",
  sang_04_bien_hinh: "Luminous04TransfigurationScene",
  sang_05_thanh_the: "Luminous05EucharistScene",
  thuong_01_vuon_cay_dau: "Sorrowful01GardenScene",
  thuong_02_danh_don: "Sorrowful02PraetoriumScene",
  thuong_03_doi_mao_gai: "Sorrowful03ThornsScene",
  thuong_04_vac_thap_gia: "Sorrowful04CrossScene",
  thuong_05_chiu_chet: "Sorrowful05CalvaryScene",
  mung_01_phuc_sinh: "Glorious01ResurrectionScene",
  mung_02_len_troi: "Glorious02AscensionScene",
  mung_03_thanh_than_hien_xuong: "Glorious03PentecostScene",
  mung_04_duc_me_len_troi: "Glorious04AssumptionScene",
  mung_05_doi_trieu_thien: "Glorious05CoronationScene",
};

export const PROLOGUE_SCENE = "PrologueScene";
export const EPILOGUE_SCENE = "EpilogueScene";

const KEYS: readonly string[] = MYSTERY_KEYS;

export const nextMysteryKey = (key: string): string | undefined => KEYS[KEYS.indexOf(key) + 1];

/** Where "Continue" lands: the saved stage, or the latest built stage before it. */
export function resumeMysteryKey(saved?: string): string {
  let i = Math.max(0, KEYS.indexOf(saved ?? ""));
  while (i > 0 && !STAGE_SCENES[KEYS[i]]) i--;
  return KEYS[i];
}

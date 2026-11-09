import { MYSTERY_KEYS } from "@/types/game";
import { INTERLUDES_DATA } from "@/data/mysteries";

/** Mystery or Interlude key -> Phaser scene key. Only stages that are built appear here. */
export const STAGE_SCENES: Record<string, string> = {
  vui_01_truyen_tin: "Joyful01AnnunciationScene",
  vui_02_vieng_ba: "Joyful02VisitationScene",
  vui_03_sinh_chua: "Joyful03NativityScene",
  mid_b1_ba_vua: "InterludeB1ThreeKingsScene",
  vui_04_dang_chua: "Joyful04PresentationScene",
  vui_05_tim_chua: "Joyful05FindingScene",
  bridge_a1_xuong_moc: "InterludeA1WorkshopScene",
  sang_01_phep_rua: "Luminous01BaptismScene",
  mid_b2_me_ca_la: "InterludeB2MiraculousCatchScene",
  sang_02_tiec_cuoi_cana: "Luminous02CanaScene",
  sang_03_rao_giang: "Luminous03BeatitudesScene",
  mid_b3_dep_yen_bao_to: "InterludeB3CalmingStormScene",
  sang_04_bien_hinh: "Luminous04TransfigurationScene",
  sang_05_thanh_the: "Luminous05EucharistScene",
  bridge_a2_suoi_kidron: "InterludeA2KidronValleyScene",
  thuong_01_vuon_cay_dau: "Sorrowful01GardenScene",
  thuong_02_danh_don: "Sorrowful02PraetoriumScene",
  thuong_03_doi_mao_gai: "Sorrowful03ThornsScene",
  mid_b4_vac_thap_gia_nho: "InterludeB4CarryCrossScene",
  thuong_04_vac_thap_gia: "Sorrowful04CrossScene",
  thuong_05_chiu_chet: "Sorrowful05CalvaryScene",
  bridge_a3_binh_minh: "InterludeA3DawnRollStoneScene",
  mung_01_phuc_sinh: "Glorious01ResurrectionScene",
  mid_b5_duong_emmau: "InterludeB5EmmausRoadScene",
  mung_02_len_troi: "Glorious02AscensionScene",
  mung_03_thanh_than_hien_xuong: "Glorious03PentecostScene",
  mid_b6_cua_dep: "InterludeB6BeautifulGateScene",
  mung_04_duc_me_len_troi: "Glorious04AssumptionScene",
  mung_05_doi_trieu_thien: "Glorious05CoronationScene",
};

export const PROLOGUE_SCENE = "PrologueScene";
export const EPILOGUE_SCENE = "EpilogueScene";

const KEYS: readonly string[] = MYSTERY_KEYS;

export const nextMysteryKey = (key: string): string | undefined => KEYS[KEYS.indexOf(key) + 1];

/** Next stage in full adventure flow (checks if an action interlude follows `key`, or if `key` is itself an interlude). */
export function nextStageKey(key: string): string | undefined {
  const selfInterlude = INTERLUDES_DATA.find((it) => it.key === key);
  if (selfInterlude) return selfInterlude.nextStageKey;
  const followingInterlude = INTERLUDES_DATA.find((it) => it.afterMysteryKey === key);
  if (followingInterlude) return followingInterlude.key;
  return nextMysteryKey(key);
}

/** Where "Continue" lands: the saved stage, or the latest built stage before it. */
export function resumeMysteryKey(saved?: string): string {
  if (saved && STAGE_SCENES[saved]) return saved;
  let i = Math.max(0, KEYS.indexOf(saved ?? ""));
  while (i > 0 && !STAGE_SCENES[KEYS[i]]) i--;
  return KEYS[i];
}

import { MYSTERY_KEYS } from "@/types/game";

/** Mystery key -> Phaser scene key. Only stages that are built appear here. */
export const STAGE_SCENES: Record<string, string> = {
  vui_01_truyen_tin: "Joyful01AnnunciationScene",
  vui_02_vieng_ba: "Joyful02VisitationScene",
  vui_03_sinh_chua: "Joyful03NativityScene",
  vui_04_dang_chua: "Joyful04PresentationScene",
  vui_05_tim_chua: "Joyful05FindingScene",
  sang_01_phep_rua: "Luminous01BaptismScene",
};

const KEYS: readonly string[] = MYSTERY_KEYS;

export const nextMysteryKey = (key: string): string | undefined => KEYS[KEYS.indexOf(key) + 1];

/** Where "Continue" lands: the saved stage, or the latest built stage before it. */
export function resumeMysteryKey(saved?: string): string {
  let i = Math.max(0, KEYS.indexOf(saved ?? ""));
  while (i > 0 && !STAGE_SCENES[KEYS[i]]) i--;
  return KEYS[i];
}

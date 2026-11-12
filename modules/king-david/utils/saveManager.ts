import { DavidSaveData, createInitialSaveData } from "@/modules/king-david/types/game";

export const STORAGE_KEY = "king_david_save_v1";

export function validateSaveData(data: unknown): data is DavidSaveData {
  const d = data as Partial<DavidSaveData> | null;
  return (
    !!d &&
    typeof d === "object" &&
    d.version === "1.0.0" &&
    typeof d.timestamp === "number" &&
    typeof d.currentStageKey === "string" &&
    typeof d.currentStageIndex === "number" &&
    !!d.player &&
    typeof d.player.customization?.name === "string" &&
    typeof d.player.x === "number" &&
    typeof d.player.y === "number" &&
    !!d.stagesProgress &&
    typeof d.stagesProgress === "object"
  );
}

export function saveGame(data: DavidSaveData): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
    return true;
  } catch (e) {
    console.error("Failed to save game:", e);
    return false;
  }
}

export function loadGame(): DavidSaveData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return validateSaveData(parsed) ? parsed : null;
  } catch (e) {
    console.error("Failed to load save:", e);
    return null;
  }
}

/** Read-modify-write for auto-save; starts fresh when no save exists. */
export function updateSave(mutate: (save: DavidSaveData) => void): DavidSaveData | null {
  const save = loadGame() ?? createInitialSaveData();
  mutate(save);
  return saveGame(save) ? save : null;
}

/** New game: wipe progress, keep the character. */
export function resetProgress(): boolean {
  return saveGame(createInitialSaveData(loadGame()?.player.customization));
}

import { SaveData, createInitialSaveData } from "@/types/game";

const STORAGE_KEY_PREFIX = "rosary_adventure_save_";
export const DEFAULT_SAVE_SLOT = "slot_1";

/**
 * Validates whether an unknown object adheres to the expected SaveData schema.
 */
export function validateSaveData(data: unknown): data is SaveData {
  if (!data || typeof data !== "object") return false;

  const candidate = data as Partial<SaveData>;
  if (candidate.version !== "1.0.0") return false;
  if (typeof candidate.timestamp !== "number") return false;
  if (typeof candidate.currentMysteryKey !== "string") return false;
  if (typeof candidate.currentMysteryIndex !== "number") return false;

  if (!candidate.player || typeof candidate.player !== "object") return false;
  const player = candidate.player;
  if (!player.customization || typeof player.customization !== "object") return false;
  if (typeof player.customization.name !== "string") return false;
  if (typeof player.x !== "number" || typeof player.y !== "number") return false;

  if (!candidate.mysteriesProgress || typeof candidate.mysteriesProgress !== "object") return false;
  if (!Array.isArray(candidate.inventory)) return false;

  return true;
}

/**
 * Saves game state to browser localStorage.
 */
export function saveGame(data: SaveData, slot: string = DEFAULT_SAVE_SLOT): boolean {
  if (typeof window === "undefined") return false;
  try {
    const updatedData: SaveData = {
      ...data,
      timestamp: Date.now(),
    };
    const serialized = JSON.stringify(updatedData);
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${slot}`, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to save game to ${slot}:`, error);
    return false;
  }
}

/**
 * Loads game state from browser localStorage. Returns null if empty or corrupted.
 */
export function loadGame(slot: string = DEFAULT_SAVE_SLOT): SaveData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${slot}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (validateSaveData(parsed)) {
      return parsed;
    }

    console.warn(`Save data in ${slot} failed validation`);
    return null;
  } catch (error) {
    console.error(`Failed to load save from ${slot}:`, error);
    return null;
  }
}

/**
 * Read-modify-write helper used for auto-save. Starts from a fresh save when none exists,
 * so progress is never lost. Returns the saved data, or null if the write failed.
 */
export function updateSave(mutate: (save: SaveData) => void, slot: string = DEFAULT_SAVE_SLOT): SaveData | null {
  const save = loadGame(slot) ?? createInitialSaveData();
  mutate(save);
  return saveGame(save, slot) ? save : null;
}

/**
 * Checks if a valid saved game exists in the specified slot.
 */
export function hasSavedGame(slot: string = DEFAULT_SAVE_SLOT): boolean {
  return loadGame(slot) !== null;
}

/**
 * Removes saved game from the specified slot.
 */
export function deleteSaveGame(slot: string = DEFAULT_SAVE_SLOT): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}${slot}`);
    return true;
  } catch (error) {
    console.error(`Failed to remove save from ${slot}:`, error);
    return false;
  }
}

/**
 * Exports save data as a downloadable .json file.
 */
export function exportSaveAsJSON(data: SaveData, customFilename?: string): void {
  if (typeof window === "undefined") return;

  const serialized = JSON.stringify(data, null, 2);
  const blob = new Blob([serialized], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const playerName = data.player?.customization?.name?.replace(/[^a-zA-Z0-9_-]/g, "_") || "pilgrim";
  const dateStr = new Date(data.timestamp).toISOString().split("T")[0];
  const filename = customFilename || `rosary_save_${playerName}_${dateStr}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Reads and validates a .json file uploaded by user, returning SaveData.
 */
export function importSaveFromJSON(file: File): Promise<SaveData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (validateSaveData(parsed)) {
          resolve(parsed);
        } else {
          reject(new Error("File save không đúng định dạng hoặc đã bị hỏng."));
        }
      } catch (err) {
        reject(new Error("Không thể đọc nội dung file JSON."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc file."));
    };

    reader.readAsText(file);
  });
}

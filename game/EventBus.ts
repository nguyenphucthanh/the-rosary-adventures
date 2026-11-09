import mitt, { Emitter } from "mitt";

export type GameEvents = {
  // Scene lifecycle
  "scene-ready": { sceneKey: string };
  "scene-change-request": { targetSceneKey: string; mysteryKey?: string };

  // Dialogue & Interaction
  "dialogue-open": {
    speaker: string;
    avatarUrl?: string;
    avatarEmoji?: string;
    lines: string[];
    options?: { label: string; onSelect: () => void }[];
    onComplete?: () => void;
  };
  "dialogue-close": void;

  // Progression & Save
  "mystery-completed": { mysteryKey: string; mysteryIndex: number };
  "bead-lit": { mysteryIndex: number };
  "trigger-save": void;
  "game-saved": { success: boolean; timestamp: number };

  // Player state & Mobile Virtual Controller inputs
  "character-updated": { customization: import("@/types/game").CharacterCustomization };
  "player-position-update": { x: number; y: number; direction: "up" | "down" | "left" | "right" };
  "input-direction": { direction: "up" | "down" | "left" | "right" | "idle" };
  "input-action": { action: "A" | "B" | "MENU" };
};

export const EventBus: Emitter<GameEvents> = mitt<GameEvents>();
export default EventBus;

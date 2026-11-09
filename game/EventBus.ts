import mitt, { Emitter } from "mitt";

export interface InterludeQuestProgress {
  id: string;
  emoji: string;
  label: string;
  current: number;
  total: number;
  suffix?: string;
  color?: "amber" | "sky" | "emerald" | "rose";
}

export type GameEvents = {
  // Scene lifecycle
  "scene-ready": { sceneKey: string };
  "scene-change-request": { targetSceneKey: string; mysteryKey?: string };

  // Action Mid-Stage / Bridge side vertical progress bars
  "interlude-progress": { quests: InterludeQuestProgress[] };

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
  "game-complete": void; // Epilogue finished: show congratulations
  "game-restart": void; // progress already reset: go back to the title
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

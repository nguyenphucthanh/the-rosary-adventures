import * as Phaser from "phaser";
import { registerExodusTextures } from "@/modules/moses-the-exodus/game/utils/exodusTextures";
import { STAGE_SCENES } from "@/modules/moses-the-exodus/data/stagesData";
import { loadGame } from "@/modules/moses-the-exodus/utils/saveManager";
import EventBus from "@/modules/shared/game/EventBus";

// ponytail: only the storybook pictures are downloaded (public/games/moses-the-exodus/intro/<id>.png); all in-world art is drawn in code.
const INTRO_IDS = ["start", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "end"];
/** Until PrologueScene exists the gallery is the landing scene. */
export const FIRST_SCENE = "PrologueScene";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    for (const id of INTRO_IDS) this.load.image(`intro-${id}`, `/games/moses-the-exodus/intro/${id}.png`);
  }

  create() {
    registerExodusTextures(this);
    EventBus.emit("scene-ready", { sceneKey: "PreloadScene" });
    const resume = loadGame()?.currentStageKey; // continue where the child stopped, if that stage is built
    this.scene.start((resume && STAGE_SCENES[resume]) || FIRST_SCENE);
  }
}

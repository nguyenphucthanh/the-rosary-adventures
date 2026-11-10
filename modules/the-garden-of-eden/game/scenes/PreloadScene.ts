import * as Phaser from "phaser";
import { registerGenesisTextures } from "@/modules/the-garden-of-eden/game/utils/genesisTextures";
import { STAGE_SCENES } from "@/modules/the-garden-of-eden/data/stagesData";
import { loadGame } from "@/modules/the-garden-of-eden/utils/saveManager";
import EventBus from "@/modules/shared/game/EventBus";

// ponytail: nothing is downloaded (all art is drawn in code), so no loading bar — textures build instantly.
export const FIRST_SCENE = "PrologueScene";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  create() {
    registerGenesisTextures(this);
    EventBus.emit("scene-ready", { sceneKey: "PreloadScene" });
    const resume = loadGame()?.currentStageKey; // continue where the child stopped, if that stage is built
    this.scene.start((resume && STAGE_SCENES[resume]) || FIRST_SCENE);
  }
}

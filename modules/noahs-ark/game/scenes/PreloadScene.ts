import * as Phaser from "phaser";
import { registerNoahTextures } from "@/modules/noahs-ark/game/utils/noahTextures";
import { STAGE_SCENES } from "@/modules/noahs-ark/data/stagesData";
import { loadGame } from "@/modules/noahs-ark/utils/saveManager";
import EventBus from "@/modules/shared/game/EventBus";

// ponytail: nothing is downloaded (all art is drawn in code), so no loading bar — textures build instantly.
const INTRO_IDS = ["prologue", "stage1", "stage2", "stage3", "stage4", "stage5", "stage6", "stage7", "stage8", "epilogue"];
export const FIRST_SCENE = "PrologueScene";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // static storybook pictures shown before each stage (public/games/noahs-ark/intro/<id>.png)
    for (const id of INTRO_IDS) this.load.image(`intro-${id}`, `/games/noahs-ark/intro/${id}.png`);
  }

  create() {
    registerNoahTextures(this);
    EventBus.emit("scene-ready", { sceneKey: "PreloadScene" });
    const resume = loadGame()?.currentStageKey; // continue where the child stopped, if that stage is built
    this.scene.start((resume && STAGE_SCENES[resume]) || FIRST_SCENE);
  }
}

import * as Phaser from "phaser";
import { registerJosephTextures } from "@/modules/joseph-coat-of-the-sun/game/utils/josephTextures";
import { STAGE_SCENES } from "@/modules/joseph-coat-of-the-sun/data/stagesData";
import { loadGame } from "@/modules/joseph-coat-of-the-sun/utils/saveManager";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
import EventBus from "@/modules/shared/game/EventBus";

// ponytail: only the storybook pictures are downloaded (public/games/joseph-coat-of-the-sun/intro/<id>.png); in-world art is drawn in code.
const INTRO_IDS = ["start", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "end"];
export const FIRST_SCENE = "PrologueScene";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // Ignore load errors while an intro picture is still being generated so the game still boots.
    this.load.on("loaderror", () => {});
    for (const id of INTRO_IDS) this.load.image(`intro-${id}`, `/games/joseph-coat-of-the-sun/intro/${id}.png`);
  }

  create() {
    registerJosephTextures(this);
    if (!this.textures.exists("intro-default")) {
      const { canvas, ctx } = makeCanvas(320, 200);
      rect(ctx, 0, 0, 320, 120, PAL.L);
      rect(ctx, 0, 120, 320, 80, PAL.G);
      rect(ctx, 148, 60, 24, 30, PAL.y);
      this.textures.addCanvas("intro-default", canvas);
    }
    EventBus.emit("scene-ready", { sceneKey: "PreloadScene" });
    const resume = loadGame()?.currentStageKey;
    this.scene.start((resume && STAGE_SCENES[resume]) || FIRST_SCENE);
  }
}

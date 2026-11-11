import * as Phaser from "phaser";
import { BootScene } from "@/modules/moses-the-exodus/game/scenes/BootScene";
import { PreloadScene } from "@/modules/moses-the-exodus/game/scenes/PreloadScene";
import { Stage01NileBasketScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage01NileBasketScene";
import { Stage02PrinceChoiceScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage02PrinceChoiceScene";
import { Stage03BurningBushScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage03BurningBushScene";
import { Stage04PharaohPlaguesScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage04PharaohPlaguesScene";
import { Stage06PassoverNightScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage06PassoverNightScene";
import { Stage05GoshenLightScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage05GoshenLightScene";
import { Stage08MiriamMaraScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage08MiriamMaraScene";
import { Stage09MannaQuailScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage09MannaQuailScene";
import { Stage11SinaiCommandmentsScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage11SinaiCommandmentsScene";
import { Stage10RephidimHandsScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage10RephidimHandsScene";
import { Stage07RedSeaCrossingScene } from "@/modules/moses-the-exodus/game/scenes/stages/Stage07RedSeaCrossingScene";
import { PrologueScene } from "@/modules/moses-the-exodus/game/scenes/stages/PrologueScene";

export const createGameConfig = (parent: string | HTMLElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  pixelArt: true, // nearest-neighbour + no antialias: required for crisp 8-bit art
  roundPixels: true,
  backgroundColor: "#0f172a",
  physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: "100%", height: "100%" },
  // ponytail: add Stage04..Stage13 and EpilogueScene here as they are built.
  scene: [BootScene, PreloadScene, PrologueScene, Stage01NileBasketScene, Stage02PrinceChoiceScene, Stage03BurningBushScene, Stage04PharaohPlaguesScene, Stage05GoshenLightScene, Stage06PassoverNightScene, Stage07RedSeaCrossingScene, Stage08MiriamMaraScene, Stage09MannaQuailScene, Stage10RephidimHandsScene, Stage11SinaiCommandmentsScene],
});

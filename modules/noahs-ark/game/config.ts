import * as Phaser from "phaser";
import { BootScene } from "@/modules/noahs-ark/game/scenes/BootScene";
import { PreloadScene } from "@/modules/noahs-ark/game/scenes/PreloadScene";
import { PrologueScene } from "@/modules/noahs-ark/game/scenes/stages/PrologueScene";
import { Stage01RighteousScene } from "@/modules/noahs-ark/game/scenes/stages/Stage01RighteousScene";
import { Stage02BlueprintScene } from "@/modules/noahs-ark/game/scenes/stages/Stage02BlueprintScene";
import { Stage03AnimalPairsScene } from "@/modules/noahs-ark/game/scenes/stages/Stage03AnimalPairsScene";
import { Stage04FloodScene } from "@/modules/noahs-ark/game/scenes/stages/Stage04FloodScene";
import { Stage05ArkVoyageScene } from "@/modules/noahs-ark/game/scenes/stages/Stage05ArkVoyageScene";
import { Stage06AraratWindScene } from "@/modules/noahs-ark/game/scenes/stages/Stage06AraratWindScene";
import { Stage07OliveDoveScene } from "@/modules/noahs-ark/game/scenes/stages/Stage07OliveDoveScene";
import { Stage08RainbowCovenantScene } from "@/modules/noahs-ark/game/scenes/stages/Stage08RainbowCovenantScene";
import { EpilogueScene } from "@/modules/noahs-ark/game/scenes/stages/EpilogueScene";

export const createGameConfig = (parent: string | HTMLElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  pixelArt: true, // nearest-neighbour + no antialias: required for crisp 8-bit art
  roundPixels: true,
  backgroundColor: "#0f172a",
  physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: "100%", height: "100%" },
  scene: [BootScene, PreloadScene, PrologueScene, Stage01RighteousScene, Stage02BlueprintScene, Stage03AnimalPairsScene, Stage04FloodScene, Stage05ArkVoyageScene, Stage06AraratWindScene, Stage07OliveDoveScene, Stage08RainbowCovenantScene, EpilogueScene],
});

import * as Phaser from "phaser";
import { BootScene } from "@/modules/the-garden-of-eden/game/scenes/BootScene";
import { PreloadScene } from "@/modules/the-garden-of-eden/game/scenes/PreloadScene";
import { PrologueScene } from "@/modules/the-garden-of-eden/game/scenes/stages/PrologueScene";
import { Stage01LightScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage01LightScene";
import { Stage02SkyScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage02SkyScene";
import { Stage03LandScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage03LandScene";
import { Stage04StarsScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage04StarsScene";
import { Stage05SeaBirdsScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage05SeaBirdsScene";
import { Stage06AnimalsManScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage06AnimalsManScene";
import { Stage07SabbathScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage07SabbathScene";
import { Stage08EdenRiversScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage08EdenRiversScene";
import { Stage09EveCoopScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage09EveCoopScene";
import { Stage10SerpentScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage10SerpentScene";
import { Stage11HidingScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage11HidingScene";
import { Stage12PromiseScene } from "@/modules/the-garden-of-eden/game/scenes/stages/Stage12PromiseScene";
import { EpilogueScene } from "@/modules/the-garden-of-eden/game/scenes/stages/EpilogueScene";

export const createGameConfig = (parent: string | HTMLElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  pixelArt: true, // nearest-neighbour + no antialias: required for crisp 8-bit art
  roundPixels: true,
  backgroundColor: "#0f172a",
  physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: "100%", height: "100%" },
  scene: [BootScene, PreloadScene, PrologueScene, Stage01LightScene, Stage02SkyScene, Stage03LandScene, Stage04StarsScene, Stage05SeaBirdsScene, Stage06AnimalsManScene, Stage07SabbathScene, Stage08EdenRiversScene, Stage09EveCoopScene, Stage10SerpentScene, Stage11HidingScene, Stage12PromiseScene, EpilogueScene],
});

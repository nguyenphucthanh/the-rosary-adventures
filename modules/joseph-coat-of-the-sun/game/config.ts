import * as Phaser from "phaser";
import { BootScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/BootScene";
import { PreloadScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/PreloadScene";
import { PrologueScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/PrologueScene";
import { Stage01DreamSheavesScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage01DreamSheavesScene";
import { Stage02RoadToDothanScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage02RoadToDothanScene";
import { Stage03DryWellScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage03DryWellScene";
import { Stage04DesertCaravanScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage04DesertCaravanScene";
import { Stage05PotipharHouseScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage05PotipharHouseScene";
import { Stage06OpenDoorScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage06OpenDoorScene";
import { Stage07PrisonDreamsScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage07PrisonDreamsScene";
import { Stage08PharaohDreamScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage08PharaohDreamScene";
import { Stage09GranariesScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage09GranariesScene";
import { Stage10FamineScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage10FamineScene";
import { Stage11SilverCupScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage11SilverCupScene";
import { Stage12GoshenScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/Stage12GoshenScene";
import { EpilogueScene } from "@/modules/joseph-coat-of-the-sun/game/scenes/stages/EpilogueScene";

export const createGameConfig = (parent: string | HTMLElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  pixelArt: true, // nearest-neighbour + no antialias: required for crisp 8-bit art
  roundPixels: true,
  backgroundColor: "#0f172a",
  physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: "100%", height: "100%" },
  // Stage scenes are appended here as they are built (Prologue first).
  scene: [BootScene, PreloadScene, PrologueScene, Stage01DreamSheavesScene, Stage02RoadToDothanScene, Stage03DryWellScene, Stage04DesertCaravanScene, Stage05PotipharHouseScene, Stage06OpenDoorScene, Stage07PrisonDreamsScene, Stage08PharaohDreamScene, Stage09GranariesScene, Stage10FamineScene, Stage11SilverCupScene, Stage12GoshenScene, EpilogueScene],
});

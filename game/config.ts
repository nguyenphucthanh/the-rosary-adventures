import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { TitleScene } from "./scenes/TitleScene";
import { BaseMysteryScene } from "./scenes/BaseMysteryScene";
import { StageTransitionScene } from "./scenes/StageTransitionScene";
import { SeasonWarpScene } from "./scenes/SeasonWarpScene";
import { Luminous01BaptismScene } from "./scenes/mysteries/Luminous01BaptismScene";
import { Joyful01AnnunciationScene } from "./scenes/mysteries/Joyful01AnnunciationScene";
import { Joyful02VisitationScene } from "./scenes/mysteries/Joyful02VisitationScene";
import { Joyful03NativityScene } from "./scenes/mysteries/Joyful03NativityScene";
import { Joyful04PresentationScene } from "./scenes/mysteries/Joyful04PresentationScene";
import { Joyful05FindingScene } from "./scenes/mysteries/Joyful05FindingScene";

export const createGameConfig = (
  parent: string | HTMLElement
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  pixelArt: true, // nearest-neighbour + no antialias: required for crisp 8-bit art
  roundPixels: true,
  backgroundColor: "#0f172a",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%",
  },
  scene: [BootScene, PreloadScene, TitleScene,
    StageTransitionScene,
    SeasonWarpScene,
    Joyful01AnnunciationScene,
    Joyful02VisitationScene,
    Joyful03NativityScene,
    Joyful04PresentationScene,
    Joyful05FindingScene,
    Luminous01BaptismScene,
    BaseMysteryScene,
  ],
});

import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { TitleScene } from "./scenes/TitleScene";
import { BaseMysteryScene } from "./scenes/BaseMysteryScene";
import { StageTransitionScene } from "./scenes/StageTransitionScene";
import { SeasonWarpScene } from "./scenes/SeasonWarpScene";
import { Luminous01BaptismScene } from "./scenes/mysteries/Luminous01BaptismScene";
import { Luminous02CanaScene } from "./scenes/mysteries/Luminous02CanaScene";
import { Luminous03BeatitudesScene } from "./scenes/mysteries/Luminous03BeatitudesScene";
import { Luminous04TransfigurationScene } from "./scenes/mysteries/Luminous04TransfigurationScene";
import { Luminous05EucharistScene } from "./scenes/mysteries/Luminous05EucharistScene";
import { Sorrowful01GardenScene } from "./scenes/mysteries/Sorrowful01GardenScene";
import { Sorrowful02PraetoriumScene } from "./scenes/mysteries/Sorrowful02PraetoriumScene";
import { Sorrowful03ThornsScene } from "./scenes/mysteries/Sorrowful03ThornsScene";
import { Sorrowful04CrossScene } from "./scenes/mysteries/Sorrowful04CrossScene";
import { Sorrowful05CalvaryScene } from "./scenes/mysteries/Sorrowful05CalvaryScene";
import { Glorious01ResurrectionScene } from "./scenes/mysteries/Glorious01ResurrectionScene";
import { Glorious02AscensionScene } from "./scenes/mysteries/Glorious02AscensionScene";
import { Glorious03PentecostScene } from "./scenes/mysteries/Glorious03PentecostScene";
import { Glorious04AssumptionScene } from "./scenes/mysteries/Glorious04AssumptionScene";
import { Glorious05CoronationScene } from "./scenes/mysteries/Glorious05CoronationScene";
import { Joyful01AnnunciationScene } from "./scenes/mysteries/Joyful01AnnunciationScene";
import { Joyful02VisitationScene } from "./scenes/mysteries/Joyful02VisitationScene";
import { Joyful03NativityScene } from "./scenes/mysteries/Joyful03NativityScene";
import { Joyful04PresentationScene } from "./scenes/mysteries/Joyful04PresentationScene";
import { Joyful05FindingScene } from "./scenes/mysteries/Joyful05FindingScene";
import { PrologueScene } from "./scenes/mysteries/PrologueScene";
import { EpilogueScene } from "./scenes/mysteries/EpilogueScene";

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
    PrologueScene,
    EpilogueScene,
    Joyful01AnnunciationScene,
    Joyful02VisitationScene,
    Joyful03NativityScene,
    Joyful04PresentationScene,
    Joyful05FindingScene,
    Luminous01BaptismScene,
    Luminous02CanaScene,
    Luminous03BeatitudesScene,
    Luminous04TransfigurationScene,
    Luminous05EucharistScene,
    Sorrowful01GardenScene,
    Sorrowful02PraetoriumScene,
    Sorrowful03ThornsScene,
    Sorrowful04CrossScene,
    Sorrowful05CalvaryScene,
    Glorious01ResurrectionScene,
    Glorious02AscensionScene,
    Glorious03PentecostScene,
    Glorious04AssumptionScene,
    Glorious05CoronationScene,
    BaseMysteryScene,
  ],
});

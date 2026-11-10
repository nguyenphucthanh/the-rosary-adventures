import * as Phaser from "phaser";
import { BootScene } from "@/modules/the-rosary-adventures/game/scenes/BootScene";
import { PreloadScene } from "@/modules/the-rosary-adventures/game/scenes/PreloadScene";
import { TitleScene } from "@/modules/the-rosary-adventures/game/scenes/TitleScene";
import { BaseMysteryScene } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { StageTransitionScene } from "@/modules/the-rosary-adventures/game/scenes/StageTransitionScene";
import { SeasonWarpScene } from "@/modules/the-rosary-adventures/game/scenes/SeasonWarpScene";
import { Luminous01BaptismScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Luminous01BaptismScene";
import { Luminous02CanaScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Luminous02CanaScene";
import { Luminous03BeatitudesScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Luminous03BeatitudesScene";
import { Luminous04TransfigurationScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Luminous04TransfigurationScene";
import { Luminous05EucharistScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Luminous05EucharistScene";
import { Sorrowful01GardenScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Sorrowful01GardenScene";
import { Sorrowful02PraetoriumScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Sorrowful02PraetoriumScene";
import { Sorrowful03ThornsScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Sorrowful03ThornsScene";
import { Sorrowful04CrossScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Sorrowful04CrossScene";
import { Sorrowful05CalvaryScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Sorrowful05CalvaryScene";
import { Glorious01ResurrectionScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Glorious01ResurrectionScene";
import { Glorious02AscensionScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Glorious02AscensionScene";
import { Glorious03PentecostScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Glorious03PentecostScene";
import { Glorious04AssumptionScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Glorious04AssumptionScene";
import { Glorious05CoronationScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Glorious05CoronationScene";
import { Joyful01AnnunciationScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Joyful01AnnunciationScene";
import { Joyful02VisitationScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Joyful02VisitationScene";
import { Joyful03NativityScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Joyful03NativityScene";
import { Joyful04PresentationScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Joyful04PresentationScene";
import { Joyful05FindingScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/Joyful05FindingScene";
import { InterludeB1ThreeKingsScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeB1ThreeKingsScene";
import { InterludeA1WorkshopScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeA1WorkshopScene";
import { InterludeB2MiraculousCatchScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeB2MiraculousCatchScene";
import { InterludeB3CalmingStormScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeB3CalmingStormScene";
import { InterludeA2KidronValleyScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeA2KidronValleyScene";
import { InterludeB4CarryCrossScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeB4CarryCrossScene";
import { InterludeA3DawnRollStoneScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeA3DawnRollStoneScene";
import { InterludeB5EmmausRoadScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeB5EmmausRoadScene";
import { InterludeB6BeautifulGateScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/InterludeB6BeautifulGateScene";
import { PrologueScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/PrologueScene";
import { EpilogueScene } from "@/modules/the-rosary-adventures/game/scenes/mysteries/EpilogueScene";

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
    InterludeB1ThreeKingsScene,
    Joyful04PresentationScene,
    Joyful05FindingScene,
    InterludeA1WorkshopScene,
    Luminous01BaptismScene,
    InterludeB2MiraculousCatchScene,
    Luminous02CanaScene,
    Luminous03BeatitudesScene,
    InterludeB3CalmingStormScene,
    Luminous04TransfigurationScene,
    Luminous05EucharistScene,
    InterludeA2KidronValleyScene,
    Sorrowful01GardenScene,
    Sorrowful02PraetoriumScene,
    Sorrowful03ThornsScene,
    InterludeB4CarryCrossScene,
    Sorrowful04CrossScene,
    Sorrowful05CalvaryScene,
    InterludeA3DawnRollStoneScene,
    Glorious01ResurrectionScene,
    InterludeB5EmmausRoadScene,
    Glorious02AscensionScene,
    Glorious03PentecostScene,
    InterludeB6BeautifulGateScene,
    Glorious04AssumptionScene,
    Glorious05CoronationScene,
    BaseMysteryScene,
  ],
});

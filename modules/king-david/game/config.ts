import * as Phaser from "phaser";
import { BootScene } from "@/modules/king-david/game/scenes/BootScene";
import { PreloadScene } from "@/modules/king-david/game/scenes/PreloadScene";
import { PrologueScene } from "@/modules/king-david/game/scenes/stages/PrologueScene";
import { Stage01BethlehemAnointingScene } from "@/modules/king-david/game/scenes/stages/Stage01BethlehemAnointingScene";
import { Stage02RoyalHarpSoothingScene } from "@/modules/king-david/game/scenes/stages/Stage02RoyalHarpSoothingScene";
import { Stage03ValleyOfElahGoliathScene } from "@/modules/king-david/game/scenes/stages/Stage03ValleyOfElahGoliathScene";
import { Stage04JonathanArrowsScene } from "@/modules/king-david/game/scenes/stages/Stage04JonathanArrowsScene";
import { Stage05AdullamSanctuaryScene } from "@/modules/king-david/game/scenes/stages/Stage05AdullamSanctuaryScene";
import { Stage06EnGediMercyScene } from "@/modules/king-david/game/scenes/stages/Stage06EnGediMercyScene";
import { Stage07AbigailPeaceScene } from "@/modules/king-david/game/scenes/stages/Stage07AbigailPeaceScene";
import { Stage08SpearAndJugScene } from "@/modules/king-david/game/scenes/stages/Stage08SpearAndJugScene";
import { Stage09SongOfTheBowScene } from "@/modules/king-david/game/scenes/stages/Stage09SongOfTheBowScene";
import { Stage10HebronCoronationScene } from "@/modules/king-david/game/scenes/stages/Stage10HebronCoronationScene";
import { Stage11GihonSpringZionScene } from "@/modules/king-david/game/scenes/stages/Stage11GihonSpringZionScene";
import { Stage12ArkToJerusalemScene } from "@/modules/king-david/game/scenes/stages/Stage12ArkToJerusalemScene";
import { EpilogueScene } from "@/modules/king-david/game/scenes/stages/EpilogueScene";

export const createGameConfig = (parent: string | HTMLElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  pixelArt: true, // nearest-neighbour + no antialias: required for crisp 8-bit art
  roundPixels: true,
  backgroundColor: "#0f172a",
  physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: "100%", height: "100%" },
  scene: [
    BootScene,
    PreloadScene,
    PrologueScene,
    Stage01BethlehemAnointingScene,
    Stage02RoyalHarpSoothingScene,
    Stage03ValleyOfElahGoliathScene,
    Stage04JonathanArrowsScene,
    Stage05AdullamSanctuaryScene,
    Stage06EnGediMercyScene,
    Stage07AbigailPeaceScene,
    Stage08SpearAndJugScene,
    Stage09SongOfTheBowScene,
    Stage10HebronCoronationScene,
    Stage11GihonSpringZionScene,
    Stage12ArkToJerusalemScene,
    EpilogueScene,
  ],
});

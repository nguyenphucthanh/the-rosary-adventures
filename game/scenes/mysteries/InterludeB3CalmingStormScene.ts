import * as Phaser from "phaser";
import audio from "../../audio/AudioManager";
import { DEPTH } from "../BaseMysteryScene";
import { InteractiveScene } from "../InteractiveScene";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";
import { registerVisitationTextures } from "../../utils/visitationTextureGenerator";
import { registerInfancyTextures } from "../../utils/infancyTextureGenerator";
import { registerLightTextures } from "../../utils/lightTextureGenerator";
import { registerGalileeTextures } from "../../utils/galileeTextureGenerator";
import { registerInterludeTextures } from "../../utils/interludeTextureGenerator";

const W = 640;
const H = 500;
const GOAL = 6;

interface WaveHazard {
  sprite: Phaser.GameObjects.Image;
  vx: number;
}

interface AnchorStar {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  collected: boolean;
}

/**
 * Mid-Stage B3 (After Luminous 3): Calming the Storm on the Lake (Mc 4, 35-41).
 * Kid-friendly Wave-Dodging Action: Move across the wooden decks & stone causeways of Lake Galilee
 * during a storm to collect 6 glowing Faith Anchors while dodging rolling waves (touching a wave just
 * nudges you gently!). Then speak to Jesus to calm the sea!
 */
export class InterludeB3CalmingStormScene extends InteractiveScene {
  private water!: Phaser.GameObjects.TileSprite;
  private stormOverlay!: Phaser.GameObjects.Rectangle;
  private waves: WaveHazard[] = [];
  private anchors: AnchorStar[] = [];
  private collectedCount = 0;
  private finished = false;
  private knockCooldown = 0;

  constructor() {
    super("InterludeB3CalmingStormScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerLightTextures(this);
    registerGalileeTextures(this);
    registerInterludeTextures(this);

    this.waves = [];
    this.anchors = [];
    this.walkers = [];
    this.collectedCount = 0;
    this.finished = false;
    this.knockCooldown = 0;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildStormyLake();
    this.buildCharactersAndAnchors();
    this.defineInteractables();

    this.begin("mid_b3_dep_yen_bao_to", [320, 410], {
      speaker: "Biển Hồ Galilê Giữa Cơn Bão",
      emoji: "⛵",
      lines: [
        "Chặng Đệm Hành Động: Chúa Dẹp Yên Bão Tố (Mc 4, 35-41).",
        "Một cơn lốc lớn nổi lên, sóng ập vào thuyền! Các môn đệ hoảng sợ, còn Chúa Giêsu vẫn đang ở đằng lái.",
        "Hãy di chuyển lách qua những con sóng trắng, thu thập đủ 6 Mỏ Neo Đức Tin phát sáng rồi đến đánh thức Chúa Giêsu nhé!",
      ],
    });
    this.syncProgress();
  }

  private syncProgress(calmed = false) {
    this.emitInterludeProgress([
      {
        id: "faith_anchors",
        emoji: "⚓",
        label: "MỎ NEO",
        current: this.collectedCount,
        total: GOAL,
        color: "sky",
      },
      {
        id: "calm_storm",
        emoji: "⛵",
        label: "DẸP BÃO",
        current: calmed ? 1 : 0,
        total: 1,
        color: "amber",
      },
    ]);
  }

  private buildStormyLake() {
    this.water = this.add.tileSprite(0, 0, W, H, "water_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        if (!this.finished) this.water.tilePositionX = (this.water.tilePositionX + 2) % 16;
      },
    });

    // Walkable sandbar & wooden boat arena in the middle of the lake
    this.add.tileSprite(88, 92, W - 176, H - 156, "dirt_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.image(220, 140, "fishing_boat").setDepth(DEPTH.RUG + 1);
    this.add.image(420, 140, "fishing_boat").setDepth(DEPTH.RUG + 1);
    this.edgeWalls(W, H);

    // Keep player inside the lake arena
    this.block(44, H / 2, 88, H);
    this.block(W - 44, H / 2, 88, H);
    this.block(W / 2, 46, W, 92);
    this.block(W / 2, H - 32, W, 64);

    // Rocks & reeds along the outer banks
    for (const [x, y] of [
      [48, 140],
      [592, 140],
      [48, 360],
      [592, 360],
    ]) {
      this.prop(x, y, "boulder", 24, 10);
    }

    // Dark storm sky overlay (lifts when Jesus calms the storm!)
    this.stormOverlay = this.add
      .rectangle(0, 0, W, H, 0x0f172a, 0.42)
      .setOrigin(0)
      .setDepth(DEPTH.FX - 4);
  }

  private buildCharactersAndAnchors() {
    // Jesus at the stern of the upper boat, Peter & James beside Him
    this.add.sprite(320, 138, "jesus_adult").setOrigin(0.5, 1).setDepth(138);
    this.hint(320, 104);
    this.add.sprite(175, 142, "peter").setOrigin(0.5, 1).setDepth(142);
    this.add.sprite(465, 142, "james").setOrigin(0.5, 1).setDepth(142);

    // 6 Faith Anchors placed around the stormy causeway
    const spots: [number, number][] = [
      [150, 210],
      [490, 210],
      [250, 285],
      [390, 285],
      [150, 365],
      [490, 365],
    ];
    for (const [x, y] of spots) {
      const glow = this.add.image(x, y, "glow_small").setDepth(y - 1).setAlpha(0.55);
      this.tweens.add({ targets: glow, alpha: 0.85, duration: 900, yoyo: true, repeat: -1 });
      const sprite = this.add.image(x, y, "faith_anchor").setDepth(y);
      this.tweens.add({
        targets: sprite,
        y: y - 3,
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.anchors.push({ sprite, glow, collected: false });
    }

    // 4 gentle rolling waves moving horizontally across lanes
    const lanes = [
      { y: 205, vx: 65, x: 180 },
      { y: 255, vx: -72, x: 440 },
      { y: 315, vx: 68, x: 260 },
      { y: 365, vx: -62, x: 380 },
    ];
    for (const l of lanes) {
      const sprite = this.add.image(l.x, l.y, "storm_wave").setDepth(DEPTH.FX - 2);
      this.waves.push({ sprite, vx: l.vx });
    }
  }

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [320, 128],
        r: 68,
        label: () =>
          this.collectedCount >= GOAL
            ? "[A] Cầu xin Chúa Giêsu dẹp yên bão tố!"
            : `[A] Chúa Giêsu (${this.collectedCount}/${GOAL} Mỏ Neo)`,
        active: () => !this.finished,
        act: () => this.talkToJesus(),
      },
    ];
  }

  private talkToJesus() {
    if (this.collectedCount < GOAL) {
      this.talk("Chúa Giêsu", "⛵", [
        `Hãy vững lòng tin! Con hãy thu thập đủ ${GOAL} Mỏ Neo Đức Tin (${this.collectedCount}/${GOAL}) rồi quay lại đây nhé.`,
      ]);
      return;
    }

    this.finished = true;
    this.syncProgress(true);
    // Calm the storm: remove waves, lift the dark storm overlay, play blessing chime!
    this.waves.forEach((w) => w.sprite.destroy());
    this.waves = [];
    this.tweens.add({ targets: this.stormOverlay, alpha: 0, duration: 700 });
    audio.sfx("bless");
    this.sparkleBurst(320, 130);

    this.talk(
      "Chúa Giêsu",
      "✨",
      [
        "Chúa Giêsu thức dậy, ngăm đe gió và truyền cho biển: “Im đi! Câm đi!”",
        "Gió liền tắt, và biển lặng như tờ! Người nói: “Sao nhát thế? Làm sao mà anh em vẫn chưa có lòng tin?” (Mc 4, 39-40)",
      ],
      () =>
        this.completeInterlude(
          "CHẶNG ĐỆM B3",
          "Chúa Dẹp Yên Bão Tố (Mc 4, 35-41)",
          "Luôn cậy trông và cầu nguyện với Chúa Giêsu mỗi khi gặp nỗi sợ hãi hay khó khăn.",
          "Mặt hồ đã bình yên rực rỡ ánh nắng! Giờ đây chúng ta cùng theo Chúa Giêsu tiến lên đỉnh núi Tabor nhé!"
        )
    );
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;
    const delta = this.game.loop.delta;

    if (this.knockCooldown > 0) this.knockCooldown -= delta;

    // Move waves back and forth
    for (const w of this.waves) {
      w.sprite.x = Math.round(w.sprite.x + (w.vx * delta) / 1000);
      if (w.sprite.x < 110) {
        w.sprite.x = 110;
        w.vx = Math.abs(w.vx);
      } else if (w.sprite.x > W - 110) {
        w.sprite.x = W - 110;
        w.vx = -Math.abs(w.vx);
      }

      // Gentle nudge if player touches a wave (no health loss!)
      if (
        this.knockCooldown <= 0 &&
        Phaser.Math.Distance.Between(this.player.x, this.player.y, w.sprite.x, w.sprite.y) < 22
      ) {
        this.knockCooldown = 700;
        audio.sfx("blip", 0);
        this.player.y = Math.min(H - 64, Math.round(this.player.y + 18));
      }
    }

    // Collect Faith Anchors on touch
    for (const a of this.anchors) {
      if (a.collected) continue;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, a.sprite.x, a.sprite.y) < 28) {
        a.collected = true;
        audio.sfx("pickup");
        this.sparkleBurst(a.sprite.x, a.sprite.y);
        a.sprite.destroy();
        a.glow.destroy();
        this.collectedCount++;
        this.syncProgress();
      }
    }
  }
}

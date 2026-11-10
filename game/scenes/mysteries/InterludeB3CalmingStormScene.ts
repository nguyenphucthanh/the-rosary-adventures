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

    this.begin("mid_b3_dep_yen_bao_to", [320, 270], {
      speaker: "Biển Hồ Galilê Giữa Cơn Bão",
      emoji: "⛵",
      lines: [
        "Chặng Đệm Hành Động: Chúa Dẹp Yên Bão Tố (Mc 4, 35-41).",
        "Một cơn lốc lớn nổi lên, sóng ập vào thuyền! Các môn đệ hoảng sợ, còn Chúa Giêsu vẫn đang ở đằng lái.",
        "Hãy chạy trên boong thuyền, lách qua những con sóng trắng, thu thập đủ 6 Mỏ Neo Đức Tin phát sáng rồi ra đuôi thuyền đánh thức Chúa Giêsu đang ngủ nhé!",
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

    // One big fishing boat in the middle of the lake: the whole walkable deck
    this.add.image(120, 50, "storm_boat").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);
    this.block(70, H / 2, 140, H); // hull sides + open water
    this.block(W - 70, H / 2, 140, H);
    this.block(W / 2, 60, W, 140); // bow
    this.block(W / 2, H - 50, W, 90); // stern rail
    this.prop(320, 205, "boat_mast", 10, 8);

    // Dark storm sky overlay (lifts when Jesus calms the storm!)
    this.stormOverlay = this.add
      .rectangle(0, 0, W, H, 0x0f172a, 0.42)
      .setOrigin(0)
      .setDepth(DEPTH.FX - 4);
  }

  private buildCharactersAndAnchors() {
    // Jesus sleeps on the stern cushion, Peter & James hold the deck beside the mast
    this.add.sprite(320, 392, "jesus_adult").setOrigin(0.5, 1).setDepth(392);
    this.hint(320, 358);
    this.add.sprite(190, 170, "peter").setOrigin(0.5, 1).setDepth(170);
    this.add.sprite(450, 170, "james").setOrigin(0.5, 1).setDepth(170);

    // 6 Faith Anchors placed around the stormy causeway
    const spots: [number, number][] = [
      [185, 240],
      [455, 240],
      [250, 290],
      [390, 290],
      [185, 340],
      [455, 340],
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
      { y: 215, vx: 65, x: 200 },
      { y: 265, vx: -72, x: 440 },
      { y: 315, vx: 68, x: 260 },
      { y: 355, vx: -62, x: 380 },
    ];
    for (const l of lanes) {
      const sprite = this.add.image(l.x, l.y, "storm_wave").setDepth(DEPTH.FX - 2);
      this.waves.push({ sprite, vx: l.vx });
    }
  }

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [320, 380],
        r: 56,
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
    this.sparkleBurst(320, 380);

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

  private knockback(fromX: number, fromY: number) {
    const base = Math.atan2(this.player.y - fromY, this.player.x - fromX);
    const a = base + Phaser.Math.FloatBetween(-0.9, 0.9);
    audio.sfx("blip", 0);
    this.cameras.main.shake(250, 0.008);
    this.player.setMovementLock(true);
    this.player.setDrag(540, 540);
    this.player.setVelocity(Math.cos(a) * 360, Math.sin(a) * 360);
    this.time.delayedCall(650, () => {
      this.player.setDrag(0, 0);
      this.player.setMovementLock(false);
    });
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;
    const delta = this.game.loop.delta;

    if (this.knockCooldown > 0) this.knockCooldown -= delta;

    // Move waves back and forth
    for (const w of this.waves) {
      w.sprite.x = Math.round(w.sprite.x + (w.vx * delta) / 1000);
      if (w.sprite.x < 185) {
        w.sprite.x = 185;
        w.vx = Math.abs(w.vx);
      } else if (w.sprite.x > W - 185) {
        w.sprite.x = W - 185;
        w.vx = -Math.abs(w.vx);
      }

      // Big wave hit: shove the player ~120px away in a random-ish direction
      if (
        this.knockCooldown <= 0 &&
        Math.abs(this.player.x - w.sprite.x) < 22 &&
        Math.abs(this.player.y - w.sprite.y) < 14
      ) {
        this.knockCooldown = 1200;
        this.knockback(w.sprite.x, w.sprite.y);
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

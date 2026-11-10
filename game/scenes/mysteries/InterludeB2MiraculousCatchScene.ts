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
const BOAT_Y = 310;
const GOAL = 8;

interface SwimmingFish {
  sprite: Phaser.GameObjects.Image;
  vx: number;
}

/**
 * Mid-Stage B2 (After Luminous 1): Miraculous Catch of Fish on Lake Galilee (Lc 5, 1-11).
 * Kid-friendly Arcade Action: Walk left & right along Simon Peter's boat deck (or the sandy pier)
 * and press [A] / Space to cast a wide fishing net into the water above, catching 8 fish!
 */
export class InterludeB2MiraculousCatchScene extends InteractiveScene {
  private water!: Phaser.GameObjects.TileSprite;
  private fishes: SwimmingFish[] = [];
  private caught = 0;
  private casting = false;
  private finished = false;
  private spawnTimer = 0;

  constructor() {
    super("InterludeB2MiraculousCatchScene");
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

    this.fishes = [];
    this.walkers = [];
    this.caught = 0;
    this.casting = false;
    this.finished = false;
    this.spawnTimer = 0;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildLakeAndShore();
    this.buildBoatAndApostles();
    this.interactables = [];

    // Pre-spawn a few friendly fish right away
    for (let i = 0; i < 4; i++) this.spawnFish(140 + i * 100);

    this.begin("mid_b2_me_ca_la", [320, 310], {
      speaker: "Hồ Galilê – Thuyền Ông Simon",
      emoji: "🐟",
      lines: [
        "Chặng Đệm Hành Động: Mẻ Cá Lạ Trên Hồ Galilê (Lc 5, 1-11).",
        "Chúa Giêsu bảo ông Simon: “Hãy chèo ra chỗ nước sâu mà thả lưới bắt cá.”",
        "Ông Simon thưa: “Thưa Thầy, chúng tôi đã vất vả suốt đêm mà không bắt được gì cả; nhưng vâng lời Thầy, tôi sẽ thả lưới!”",
        "Hãy di chuyển qua lại trên boong thuyền và nhấn nút [A] (hoặc phím Space) để quăng lưới bắt đủ 8 chú cá nhé!",
      ],
    });
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "galilee_fish",
        emoji: "🐟",
        label: "MẺ CÁ",
        current: this.caught,
        total: GOAL,
        color: "sky",
      },
    ]);
  }

  private buildLakeAndShore() {
    // Deep Lake Galilee water at the top, sandy shore at the bottom
    this.water = this.add.tileSprite(0, 0, W, 350, "water_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.time.addEvent({
      delay: 120,
      loop: true,
      callback: () => (this.water.tilePositionX = (this.water.tilePositionX + 1) % 16),
    });

    this.add.rectangle(0, 350, W, 6, 0xe0f2fe).setOrigin(0).setDepth(DEPTH.RUG); // shoreline foam
    this.add.tileSprite(0, 356, W, H - 356, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 420, W, H - 420, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.edgeWalls(W, H);

    // Block deep water above the boat so player stays safely on the boat deck & shore
    this.block(W / 2, 135, W, 270);

    // Reeds, trees & boulders along the shore
    for (const rx of [60, 110, 520, 570]) {
      this.add.image(rx, 354, "reed").setOrigin(0.5, 1).setDepth(354);
    }
    this.prop(64, 460, "hill_tree", 14, 10);
    this.prop(W - 64, 460, "hill_tree", 14, 10);
    this.prop(140, 450, "boulder", 24, 10);
    this.prop(500, 450, "boulder", 24, 10);
  }

  private buildBoatAndApostles() {
    // Two large fishing boats side-by-side forming a wide walkable deck across the water edge
    this.add.image(240, BOAT_Y, "fishing_boat").setDepth(DEPTH.RUG + 1);
    this.add.image(400, BOAT_Y, "fishing_boat").setDepth(DEPTH.RUG + 1);
    // Wooden gangplank connecting boat to shore
    this.add.image(320, 348, "plank_bridge").setDepth(DEPTH.RUG + 2);

    // Jesus on the bow, Peter & Andrew on the sides
    this.add.sprite(168, BOAT_Y + 4, "jesus_adult").setOrigin(0.5, 1).setDepth(BOAT_Y + 4);
    this.add.sprite(472, BOAT_Y + 4, "peter").setOrigin(0.5, 1).setDepth(BOAT_Y + 4);
    this.add.sprite(220, 420, "andrew").setOrigin(0.5, 1).setDepth(420);
    this.add.sprite(420, 420, "john_apostle").setOrigin(0.5, 1).setDepth(420);
  }

  /** [A] / Space always casts the net; no floating prompt (the intro explains it). */
  protected handleActionTrigger() {
    this.castNet();
  }

  private spawnFish(customX?: number) {
    if (this.finished || this.fishes.length >= 7) return;
    const goRight = Math.random() < 0.5;
    const x = customX ?? (goRight ? 36 : W - 36);
    const y = Phaser.Math.Between(140, 250);
    const isGold = Math.random() < 0.35;
    const sprite = this.add
      .image(x, y, isGold ? "fish_gold" : "fish_silver")
      .setFlipX(goRight)
      .setDepth(DEPTH.RUG + 2);
    const speed = Phaser.Math.Between(30, 120);
    this.fishes.push({ sprite, vx: goRight ? speed : -speed });
  }

  private castNet() {
    if (this.casting || this.finished || !this.player) return;
    this.casting = true;
    audio.sfx("whoosh");

    // Aim at the fish nearest the player's column (led by the 240ms flight time) so the net lands on it
    const px = this.player.x;
    let netX = Phaser.Math.Clamp(Math.round(px), 30, W - 30);
    let netY = 195;
    let best = 70;
    for (const f of this.fishes) {
      const fx = f.sprite.x + f.vx * 0.24;
      if (Math.abs(fx - px) < best) {
        best = Math.abs(fx - px);
        netX = Phaser.Math.Clamp(Math.round(fx), 30, W - 30);
        netY = Math.round(f.sprite.y);
      }
    }

    const net = this.add.image(netX, BOAT_Y - 12, "fishing_net").setDepth(DEPTH.FX);
    const glow = this.add.image(netX, netY, "glow_gold").setDepth(DEPTH.FX - 1).setAlpha(0.45);

    this.tweens.add({
      targets: net,
      y: netY,
      duration: 240,
      onComplete: () => {
        // Catch fish under the net (radius matches the 28px net sprite, a bit generous)
        let caughtNow = 0;
        for (let i = this.fishes.length - 1; i >= 0; i--) {
          const f = this.fishes[i];
          if (Phaser.Math.Distance.Between(netX, netY, f.sprite.x, f.sprite.y) <= 34) {
            caughtNow++;
            f.sprite.destroy();
            this.fishes.splice(i, 1);
          }
        }

        if (caughtNow > 0) {
          this.caught = Math.min(GOAL, this.caught + caughtNow);
          this.syncProgress();
          audio.sfx("pickup");
          this.sparkleBurst(netX, netY);
          // Replenish fish so the lake stays lively
          this.spawnFish();
        } else {
          audio.sfx("blip", 2);
        }

        this.time.delayedCall(220, () => {
          net.destroy();
          glow.destroy();
          this.casting = false;
          if (this.caught >= GOAL && !this.finished) {
            this.finishCatch();
          }
        });
      },
    });
  }

  update() {
    super.update();
    if (this.finished) return;
    const delta = this.game.loop.delta;

    this.spawnTimer += delta;
    if (this.spawnTimer >= 950) {
      this.spawnTimer = 0;
      this.spawnFish();
    }

    for (const f of this.fishes) {
      f.sprite.x = Math.round(f.sprite.x + (f.vx * delta) / 1000);
      if (f.sprite.x < 30) {
        f.sprite.x = 30;
        f.vx = Math.abs(f.vx);
        f.sprite.setFlipX(true);
      } else if (f.sprite.x > W - 30) {
        f.sprite.x = W - 30;
        f.vx = -Math.abs(f.vx);
        f.sprite.setFlipX(false);
      }
    }
  }

  private finishCatch() {
    this.finished = true;
    audio.sfx("bless");
    this.sparkleBurst(168, BOAT_Y - 12);
    this.sparkleBurst(472, BOAT_Y - 12);

    this.time.delayedCall(500, () =>
      this.completeInterlude(
        "CHẶNG ĐỆM B2",
        "Mẻ Cá Lạ Trên Hồ Galilê (Lc 5, 1-11)",
        "Tin tưởng vâng lời Chúa Giêsu và hăng hái theo Chúa trở thành những người 'lưới người như lưới cá'.",
        "Chúa Giêsu bảo ông Simon: “Đừng sợ, từ nay anh sẽ là người thu phục người ta.” Các ông liền bỏ mọi sự mà theo Người!"
      )
    );
  }
}

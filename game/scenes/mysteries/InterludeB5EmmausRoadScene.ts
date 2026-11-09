import * as Phaser from "phaser";
import audio from "../../audio/AudioManager";
import { DEPTH } from "../BaseMysteryScene";
import { InteractiveScene } from "../InteractiveScene";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";
import { registerVisitationTextures } from "../../utils/visitationTextureGenerator";
import { registerInfancyTextures } from "../../utils/infancyTextureGenerator";
import { registerLightTextures } from "../../utils/lightTextureGenerator";
import { registerCanaTextures } from "../../utils/canaTextureGenerator";
import { registerGalileeTextures } from "../../utils/galileeTextureGenerator";
import { registerPassionTextures } from "../../utils/passionTextureGenerator";
import { registerGloryTextures } from "../../utils/gloryTextureGenerator";
import { registerInterludeTextures } from "../../utils/interludeTextureGenerator";

const W = 640;
const H = 520;
const HEART_GOAL = 6;
const LOAF_GOAL = 3;

interface CollectibleItem {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  collected: boolean;
}

interface DoubtHazard {
  sprite: Phaser.GameObjects.Image;
  vx: number;
}

/**
 * Mid-Stage B5 (After Glorious 1 -> Before Glorious 2):
 * "Hành Trình Emmau — Trái Tim Bừng Cháy" (Lc 24, 13-35).
 * Action: Walk the sunset road to Emmaus with the Risen Jesus and two disciples.
 * 1) Catch 6 Burning-Heart Word of God Embers (❤️‍🔥 0/6 LỜI CHÚA)
 * 2) Collect 3 Emmaus Loaves (🍞 0/3 BẺ BÁNH) while dodging drifting grey doubt-clouds,
 *    then gather at the Emmaus table where Jesus breaks the bread!
 */
export class InterludeB5EmmausRoadScene extends InteractiveScene {
  private hearts: CollectibleItem[] = [];
  private loaves: CollectibleItem[] = [];
  private clouds: DoubtHazard[] = [];
  private tablePlate!: Phaser.GameObjects.Image;
  private sunsetOverlay!: Phaser.GameObjects.Rectangle;
  private heartCount = 0;
  private loafCount = 0;
  private finished = false;
  private nudgeCooldown = 0;

  constructor() {
    super("InterludeB5EmmausRoadScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerLightTextures(this);
    registerCanaTextures(this);
    registerGalileeTextures(this);
    registerPassionTextures(this);
    registerGloryTextures(this);
    registerInterludeTextures(this);

    this.hearts = [];
    this.loaves = [];
    this.clouds = [];
    this.walkers = [];
    this.heartCount = 0;
    this.loafCount = 0;
    this.finished = false;
    this.nudgeCooldown = 0;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildEmmausWorld();
    this.buildCharactersAndItems();
    this.defineInteractables();

    this.begin("mid_b5_duong_emmau", [320, 450], {
      speaker: "Hai Môn Đệ Emmau",
      emoji: "❤️‍🔥",
      lines: [
        "Chặng Đệm Hành Động: Hành Trình Emmau — Trái Tim Bừng Cháy (Lc 24, 13-35).",
        "Trên đường chiều về làng Emmau, Chúa Giêsu Phục Sinh cùng đi và giải thích Kinh Thánh khiến lòng hai môn đệ bừng cháy!",
        "Hãy lách qua những Đám Mây Buồn Bã, thu thập đủ 6 Ngọn Lửa Lời Chúa (❤️‍🔥) và 3 Tấm Bánh Emmau (🍞) rồi đến bàn tiệc cùng Chúa nhé!",
      ],
    });
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "burning_hearts",
        emoji: "❤️‍🔥",
        label: "LỜI CHÚA",
        current: this.heartCount,
        total: HEART_GOAL,
        color: "rose",
      },
      {
        id: "emmaus_bread",
        emoji: "🍞",
        label: "BẺ BÁNH",
        current: this.loafCount,
        total: LOAF_GOAL,
        color: "amber",
      },
    ]);
  }

  private buildEmmausWorld() {
    // Countryside grass + winding dirt road leading to the Emmaus inn at top
    this.add.tileSprite(0, 0, W, H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(144, 88, W - 288, H - 88, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(200, 96, W - 400, 96, "cobble_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);

    // Warm sunset sky horizon at top
    this.add.rectangle(0, 0, W, 76, 0x7c2d12).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 48, W, 28, 0xd97706).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(W / 2, 38, W, 76);

    // Emmaus village house on the left & olive/hill trees along the road
    this.prop(110, 148, "elizabeth_house", 96, 24);
    for (const [x, y] of [
      [540, 150],
      [76, 290],
      [564, 290],
      [84, 430],
      [556, 430],
    ]) {
      this.prop(x, y, "hill_tree", 24, 12);
    }
    for (const [x, y] of [
      [125, 220],
      [515, 220],
      [125, 365],
      [515, 365],
    ]) {
      this.prop(x, y, "rose_bush", 16, 8);
    }

    // Emmaus supper table in the upper courtyard
    this.prop(320, 156, "emmaus_table", 56, 14);
    this.tablePlate = this.add.image(326, 138, "plate_empty").setDepth(157);
    this.add.image(304, 136, "chalice_wine").setDepth(157);

    // Warm golden sunset wash
    this.sunsetOverlay = this.add
      .rectangle(0, 0, W, H, 0xf59e0b, 0.14)
      .setOrigin(0)
      .setDepth(DEPTH.FX - 4);
  }

  private buildCharactersAndItems() {
    // Risen Jesus at the Emmaus table, flanked by Cleopas and his companion
    this.add.sprite(320, 134, "jesus_risen").setOrigin(0.5, 1).setDepth(134);
    this.hint(320, 100);
    this.add.sprite(268, 154, "apostle_d").setOrigin(0.5, 1).setDepth(154);
    this.add.sprite(372, 154, "apostle_e").setOrigin(0.5, 1).setDepth(154);

    // 6 Burning-Heart Word of God Embers along the road
    const heartSpots: [number, number][] = [
      [210, 235],
      [430, 235],
      [320, 290],
      [200, 350],
      [440, 350],
      [250, 415],
    ];
    for (const [x, y] of heartSpots) {
      const glow = this.add.image(x, y, "glow_small").setDepth(y - 1).setAlpha(0.55);
      this.tweens.add({ targets: glow, alpha: 0.85, duration: 900, yoyo: true, repeat: -1 });
      const sprite = this.add.image(x, y, "burning_heart").setDepth(y);
      this.tweens.add({
        targets: sprite,
        y: y - 3,
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.hearts.push({ sprite, glow, collected: false });
    }

    // 3 Warm Emmaus Loaves along the road
    const loafSpots: [number, number][] = [
      [320, 215],
      [260, 325],
      [390, 415],
    ];
    for (const [x, y] of loafSpots) {
      const glow = this.add.image(x, y, "glow_small").setDepth(y - 1).setAlpha(0.55);
      this.tweens.add({ targets: glow, alpha: 0.85, duration: 900, yoyo: true, repeat: -1 });
      const sprite = this.add.image(x, y, "emmaus_loaf").setDepth(y);
      this.tweens.add({
        targets: sprite,
        y: y - 3,
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.loaves.push({ sprite, glow, collected: false });
    }

    // 3 Drifting grey doubt clouds moving horizontally across the road
    const cloudLanes = [
      { x: 220, y: 260, vx: 58 },
      { x: 420, y: 325, vx: -64 },
      { x: 260, y: 385, vx: 54 },
    ];
    for (const lane of cloudLanes) {
      const sprite = this.add.image(lane.x, lane.y, "doubt_cloud").setDepth(DEPTH.FX - 2);
      this.clouds.push({ sprite, vx: lane.vx });
    }
  }

  private defineInteractables() {
    this.interactables = [
      {
        // Table is at y=156; at y=200 puts the prompt at y=164 (on the lower front edge of the table, clear of all faces)
        at: () => [320, 200],
        r: 68,
        label: () =>
          this.heartCount >= HEART_GOAL && this.loafCount >= LOAF_GOAL
            ? "[A] Xin Chúa Giêsu ở lại và Bẻ Bánh!"
            : `[A] Bàn Tiệc Emmau (${this.heartCount}/${HEART_GOAL} Lời Chúa · ${this.loafCount}/${LOAF_GOAL} Bánh)`,
        active: () => !this.finished,
        act: () => this.breakBreadAtTable(),
      },
    ];
  }

  private breakBreadAtTable() {
    if (this.heartCount < HEART_GOAL || this.loafCount < LOAF_GOAL) {
      this.talk("Hai Môn Đệ Emmau", "🍞", [
        "“Mời Ông ở lại với chúng tôi, vì trời đã xế chiều, và ngày sắp tàn.” (Lc 24, 29)",
        `Con hãy thu thập đủ ${HEART_GOAL} Ngọn Lửa Lời Chúa (${this.heartCount}/${HEART_GOAL}) và ${LOAF_GOAL} Tấm Bánh Emmau (${this.loafCount}/${LOAF_GOAL}) trên đường nhé!`,
      ]);
      return;
    }

    this.finished = true;
    this.clouds.forEach((c) => c.sprite.destroy());
    this.clouds = [];
    this.tablePlate.setTexture("plate_bread");
    this.tweens.add({ targets: this.sunsetOverlay, alpha: 0.28, duration: 600 });

    audio.sfx("angel");
    this.sparkleBurst(320, 140);

    this.talk(
      "Chúa Giêsu Phục Sinh",
      "✨",
      [
        "Khi đồng bàn với họ, Chúa Giêsu cầm lấy bánh, dâng lời chúc tụng, và bẻ ra trao cho họ.",
        "Mắt họ liền mở ra và họ nhận ra Người! Họ bảo nhau: “Dọc đường, khi Người nói chuyện và giải thích Kinh Thánh cho chúng ta, lòng chúng ta đã chẳng bừng cháy lên sao?” (Lc 24, 30-32)",
      ],
      () =>
        this.completeInterlude(
          "CHẶNG ĐỆM B5",
          "Hành Trình Emmau — Trái Tim Bừng Cháy (Lc 24, 13-35)",
          "Nhận ra Chúa Giêsu Phục Sinh qua việc lắng nghe Lời Chúa và tham dự Thánh Lễ Bẻ Bánh.",
          "Hai môn đệ vội vã trở về Giê-ru-sa-lem loan báo Tin Mừng! Giờ đây chúng ta cùng tiến lên Núi Ô-liu trong Chặng 17 nhé!"
        )
    );
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;
    const delta = this.game.loop.delta;

    if (this.nudgeCooldown > 0) this.nudgeCooldown -= delta;

    // Move drifting doubt clouds
    for (const c of this.clouds) {
      c.sprite.x = Math.round(c.sprite.x + (c.vx * delta) / 1000);
      if (c.sprite.x < 160) {
        c.sprite.x = 160;
        c.vx = Math.abs(c.vx);
      } else if (c.sprite.x > W - 160) {
        c.sprite.x = W - 160;
        c.vx = -Math.abs(c.vx);
      }

      if (
        this.nudgeCooldown <= 0 &&
        Phaser.Math.Distance.Between(this.player.x, this.player.y, c.sprite.x, c.sprite.y) < 22
      ) {
        this.nudgeCooldown = 700;
        audio.sfx("blip", 0);
        this.player.y = Math.min(H - 48, Math.round(this.player.y + 14));
      }
    }

    // Collect Burning-Heart Embers
    for (const h of this.hearts) {
      if (h.collected) continue;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, h.sprite.x, h.sprite.y) < 28) {
        h.collected = true;
        audio.sfx("pickup");
        this.sparkleBurst(h.sprite.x, h.sprite.y);
        h.sprite.destroy();
        h.glow.destroy();
        this.heartCount++;
        this.syncProgress();
      }
    }

    // Collect Emmaus Loaves
    for (const l of this.loaves) {
      if (l.collected) continue;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, l.sprite.x, l.sprite.y) < 28) {
        l.collected = true;
        audio.sfx("pickup");
        this.sparkleBurst(l.sprite.x, l.sprite.y);
        l.sprite.destroy();
        l.glow.destroy();
        this.loafCount++;
        this.syncProgress();
      }
    }
  }
}

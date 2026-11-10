import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";
import { registerInterludeTextures } from "@/modules/the-rosary-adventures/game/utils/interludeTextureGenerator";

const W = 640;
const H = 500;
const TOMB_X = 320;
const TOMB_Y = 176;
const GOAL = 8;

interface DawnDrop {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  vy: number;
  targetY: number;
}

/**
 * Season Bridge A3 (Between Sorrowful 5 & Glorious 1): Dawn of the Resurrection (Mt 28, 2).
 * Kid-friendly Dawn Light Catcher & Stone Roll Action:
 * Catch 8 falling Golden Dawn Rays across the garden while the night shade slowly lifts into Easter morning!
 * Then join the Angel of the Lord at the tomb to roll the heavy stone away!
 */
export class InterludeA3DawnRollStoneScene extends InteractiveScene {
  private nightShade!: Phaser.GameObjects.Rectangle;
  private tombStone!: Phaser.GameObjects.Image;
  private drops: DawnDrop[] = [];
  private caught = 0;
  private stoneRolled = false;
  private finished = false;
  private spawnTimer = 0;

  constructor() {
    super("InterludeA3DawnRollStoneScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAllForGlory(this);
    registerInterludeTextures(this);

    this.drops = [];
    this.walkers = [];
    this.caught = 0;
    this.stoneRolled = false;
    this.finished = false;
    this.spawnTimer = 0;

    if (!this.anims.exists("angel_flap")) {
      this.anims.create({
        key: "angel_flap",
        frames: this.anims.generateFrameNumbers("archangel_gabriel", { frames: [0, 1] }),
        frameRate: 3,
        repeat: -1,
      });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildGardenBeforeDawn();
    this.buildTombAndAngel();
    this.defineInteractables();

    this.begin("bridge_a3_binh_minh", [320, 410], {
      speaker: "Rạng Đông Ngày Thứ Nhất Trong Tuần",
      emoji: "🌅",
      lines: [
        "Cầu Nối Mùa Thương → Mùa Mừng: Ánh Bình Minh Phục Sinh (Mt 28, 2).",
        "“Và kìa, đất rung chuyển dữ dội: thiên thần Chúa từ trời xuống, đến lăn tảng đá ra, rồi ngồi lên trên.”",
        "Đêm tối Thứ Sáu Tuần Thánh đang qua đi! Hãy chạy quanh khu vườn hứng đủ 8 Tia Sáng Bình Minh để xua tan bóng đêm, rồi cùng Thiên Thần lăn tảng đá ra khỏi cửa mộ nhé!",
      ],
    });
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "dawn_rays",
        emoji: "🌅",
        label: "TIA SÁNG",
        current: this.caught,
        total: GOAL,
        color: "amber",
      },
      {
        id: "roll_stone",
        emoji: "🪨",
        label: "LĂN ĐÁ",
        current: this.stoneRolled ? 1 : 0,
        total: 1,
        color: "emerald",
      },
    ]);
  }

  private buildGardenBeforeDawn() {
    this.add.tileSprite(0, 0, W, H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(264, 180, 112, H - 180, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.edgeWalls(W, H);

    // Trees, lilies, and boulders
    for (const [x, y] of [
      [56, 130],
      [584, 130],
      [56, 430],
      [584, 430],
    ]) {
      this.prop(x, y, "hill_tree", 14, 10);
    }
    for (const [x, y] of [
      [120, 290],
      [520, 290],
      [140, 440],
      [500, 440],
    ]) {
      this.add.image(x, y, "lily_big").setOrigin(0.5, 1).setDepth(y);
    }

    // Night shade that fades as player catches dawn rays
    this.nightShade = this.add
      .rectangle(0, 0, W, H, 0x0b1030, 0.52)
      .setOrigin(0)
      .setDepth(DEPTH.FX - 4);
  }

  private buildTombAndAngel() {
    this.prop(TOMB_X, TOMB_Y, "tomb_face", 80, 16);
    // The heavy stone initially sealing the tomb mouth
    this.tombStone = this.add
      .image(TOMB_X, TOMB_Y + 2, "rolled_stone")
      .setOrigin(0.5, 1)
      .setDepth(TOMB_Y + 3);

    // Sleeping Roman guards on either side
    for (const [x, y] of [
      [210, 220],
      [430, 220],
    ]) {
      this.add.sprite(x, y, "soldier").setOrigin(0.5, 1).setDepth(y).setAngle(90);
    }

    // The Angel of the Lord hovering beside the tomb
    this.add.image(TOMB_X + 64, TOMB_Y - 18, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.55);
    this.add
      .sprite(TOMB_X + 64, TOMB_Y, "archangel_gabriel")
      .setOrigin(0.5, 1)
      .setDepth(TOMB_Y + 2)
      .play("angel_flap");
    this.hint(TOMB_X + 64, TOMB_Y - 38);
  }

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [TOMB_X + 64, TOMB_Y - 8],
        r: 78,
        label: () =>
          this.caught >= GOAL
            ? "[A] Cùng Thiên Thần lăn tảng đá cửa mộ!"
            : `[A] Thiên Thần Chúa (Cần ${this.caught}/${GOAL} Tia Sáng)`,
        active: () => !this.finished,
        act: () => this.rollTombStone(),
      },
    ];
  }

  private spawnDawnRay() {
    if (this.finished || this.caught >= GOAL || this.drops.length >= 4) return;
    const x = Phaser.Math.Between(120, W - 120);
    const targetY = Phaser.Math.Between(230, H - 64);
    const glow = this.add.image(x, 60, "glow_small").setDepth(DEPTH.FX - 2).setAlpha(0.75);
    const sprite = this.add.image(x, 60, "dawn_ray").setDepth(DEPTH.FX - 1);
    this.drops.push({
      sprite,
      glow,
      vy: Phaser.Math.Between(44, 62),
      targetY,
    });
  }

  private rollTombStone() {
    if (this.caught < GOAL) {
      this.talk("Thiên Thần Chúa", "👼", [
        `Hãy thu thập đủ ${GOAL} Tia Sáng Bình Minh (${this.caught}/${GOAL}) để xua tan bóng đêm trước khi lăn tảng đá nhé!`,
      ]);
      return;
    }
    if (this.stoneRolled) return;
    this.stoneRolled = true;
    this.finished = true;
    this.syncProgress();

    audio.sfx("door");
    this.cameras.main.shake(350, 0.006);

    // Roll the stone to the left side of the tomb (away from the Angel on the right)!
    this.tweens.add({
      targets: this.tombStone,
      x: TOMB_X - 66,
      duration: 650,
      ease: "Stepped",
      easeParams: [8],
      onComplete: () => {
        audio.sfx("angel");
        this.sparkleBurst(TOMB_X, TOMB_Y - 12);
        this.time.delayedCall(500, () =>
          this.completeInterlude(
            "CẦU NỐI MÙA A3",
            "Ánh Bình Minh Phục Sinh (Mt 28, 2)",
            "Niềm hy vọng Phục Sinh xóa tan mọi bóng tối đau khổ và mở ra sự sống đời đời.",
            "Tảng đá lớn đã lăn ra, bình minh Phục Sinh bừng sáng! Hãy bước vào Năm Sự Mừng vinh hiển!"
          )
        );
      },
    });
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;
    const delta = this.game.loop.delta;

    this.spawnTimer += delta;
    if (this.spawnTimer >= 1100) {
      this.spawnTimer = 0;
      this.spawnDawnRay();
    }

    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      if (d.sprite.y < d.targetY) {
        d.sprite.y = Math.round(d.sprite.y + (d.vy * delta) / 1000);
        d.glow.y = d.sprite.y;
      } else {
        d.vy -= delta * 0.025;
        if (d.vy < -35) {
          d.sprite.destroy();
          d.glow.destroy();
          this.drops.splice(i, 1);
          continue;
        }
      }

      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, d.sprite.x, d.sprite.y) < 34) {
        audio.sfx("pickup");
        this.sparkleBurst(d.sprite.x, d.sprite.y);
        d.sprite.destroy();
        d.glow.destroy();
        this.drops.splice(i, 1);
        this.caught++;
        this.syncProgress();

        // Gradually brighten the garden as dawn rays are collected!
        const newAlpha = Math.max(0.05, 0.52 * (1 - this.caught / GOAL));
        this.nightShade.setAlpha(newAlpha);
      }
    }
  }
}

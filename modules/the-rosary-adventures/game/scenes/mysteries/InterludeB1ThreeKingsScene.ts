import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { registerInterludeTextures } from "@/modules/the-rosary-adventures/game/utils/interludeTextureGenerator";

const W = 640;
const H = 520;
const GOAL = 8;

interface FallingStar {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  vy: number;
  targetY: number;
}

/**
 * Mid-Stage B1 (After Joyful 3): Journey of the Three Kings following the Star of Bethlehem (Mt 2, 1-12).
 * Kid-friendly action: The Star glides across the top of the desert oasis dropping glowing star-sparks
 * and royal gifts (Gold, Frankincense, Myrrh). Run to catch 8 of them!
 */
export class InterludeB1ThreeKingsScene extends InteractiveScene {
  private starGuide!: Phaser.GameObjects.Image;
  private starGlow!: Phaser.GameObjects.Image;
  private drops: FallingStar[] = [];
  private caught = 0;
  private finished = false;
  private spawnTimer = 0;
  private elapsedSec = 0;
  private helperTriggered = false;

  constructor() {
    super("InterludeB1ThreeKingsScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerInterludeTextures(this);

    this.drops = [];
    this.walkers = [];
    this.caught = 0;
    this.finished = false;
    this.spawnTimer = 0;
    this.elapsedSec = 0;
    this.helperTriggered = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildDesertWorld();
    this.buildMagiAndStar();
    this.defineInteractables();

    this.begin("mid_b1_ba_vua", [320, 380], {
      speaker: "Ba Vua Phương Đông",
      emoji: "🐪",
      lines: [
        "Chặng Đệm Hành Động: Hành Trình Ba Vua Theo Ánh Sao (Mt 2, 1-12).",
        "“Chúng tôi đã thấy ngôi sao của Người xuất hiện bên phương Đông, nên chúng tôi đến bái lạy Người.” (Mt 2, 2)",
        "Ngôi Sao Bethlehem đang thả xuống những hạt ánh sao và lễ vật Vàng, Nhũ Hương, Mộc Dược!",
        "Hãy di chuyển khắp đường sa mạc để hứng đủ 8 Ánh Sao & Lễ Vật trước khi chúng chạm cát biến mất nhé!",
      ],
    });
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "magi_gifts",
        emoji: "⭐",
        label: "LỄ VẬT",
        current: this.caught,
        total: GOAL,
        color: "amber",
      },
    ]);
  }

  private buildDesertWorld() {
    // Sandy desert floor + darker oasis trail
    this.add.tileSprite(0, 0, W, H, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(96, 120, W - 192, H - 180, "night_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(128, 144, W - 256, H - 228, "dirt_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);

    // Starry desert night sky header
    this.add.rectangle(0, 0, W, 92, 0x0b1030).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(W / 2, 46, W, 92);
    for (let i = 0; i < 36; i++) {
      this.add
        .rectangle((i * 47) % W, 10 + ((i * 23) % 72), 2, 2, i % 3 === 0 ? 0xfef08a : 0xf8fafc)
        .setOrigin(0)
        .setDepth(DEPTH.RUG);
    }

    // Oasis palms, boulders, and sleeping camels (gentle obstacles)
    for (const [x, y] of [
      [56, 170],
      [584, 170],
      [56, 440],
      [584, 440],
    ]) {
      this.prop(x, y, "desert_palm", 14, 10);
    }
    for (const [x, y] of [
      [210, 250],
      [430, 310],
    ]) {
      this.prop(x, y, "camel_sleep", 28, 12);
    }
    for (const [x, y] of [
      [110, 310],
      [530, 260],
    ]) {
      this.prop(x, y, "boulder", 24, 10);
    }

    // Night blue ambiance wash
    this.add.rectangle(0, 0, W, H, 0x0b1030, 0.24).setOrigin(0).setDepth(DEPTH.FX - 4);
  }

  private buildMagiAndStar() {
    // The Three Wise Men watching and cheering from the oasis edge
    const kings: [string, number, number][] = [
      ["magi_gold", 250, 138],
      ["magi_incense", 320, 132],
      ["magi_myrrh", 390, 138],
    ];
    for (const [key, x, y] of kings) {
      this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
      this.hint(x, y - 34);
    }

    // Guiding Star of Bethlehem gliding left & right across the night sky
    this.starGlow = this.add.image(W / 2, 54, "glow_gold").setDepth(DEPTH.FX - 2).setAlpha(0.75);
    this.starGuide = this.add.image(W / 2, 54, "star_big").setDepth(DEPTH.FX - 1);
    this.tweens.add({
      targets: [this.starGuide, this.starGlow],
      x: { from: 150, to: W - 150 },
      duration: 4200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [320, 122],
        r: 64,
        label: () => "[A] Trò chuyện với Ba Vua",
        active: () => !this.finished,
        act: () =>
          this.talk("Ba Vua Phương Đông", "👑", [
            "Vàng tôn vinh Chúa là Vua, Nhũ hương tuyên xưng Chúa là Thiên Chúa, Mộc dược tiên báo cuộc khổ nạn cứu độ.",
            `Con đã thu thập được ${this.caught}/${GOAL} Ánh Sao & Lễ Vật rồi. Cố lên nhé!`,
          ]),
      },
    ];
  }

  private spawnDrop(extraSlow = false) {
    if (this.finished || this.drops.length >= 4) return;
    const keys = ["star_big", "gift_gold", "gift_incense", "gift_myrrh"];
    const key = keys[Phaser.Math.Between(0, keys.length - 1)];
    const startX = Phaser.Math.Clamp(
      Math.round(this.starGuide.x + Phaser.Math.Between(-90, 90)),
      130,
      W - 130
    );
    const targetY = Phaser.Math.Between(200, H - 64);
    const glow = this.add.image(startX, 96, "glow_small").setDepth(DEPTH.FX - 1).setAlpha(0.7);
    const sprite = this.add.image(startX, 96, key).setDepth(DEPTH.FX);
    this.drops.push({
      sprite,
      glow,
      vy: extraSlow ? 32 : Phaser.Math.Between(42, 58),
      targetY,
    });
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;
    const delta = this.game.loop.delta;

    this.spawnTimer += delta;
    this.elapsedSec += delta / 1000;

    // Holy Spirit helper after 20s if the child needs a hand
    if (this.elapsedSec > 20 && !this.helperTriggered && this.caught < GOAL) {
      this.helperTriggered = true;
      this.spawnDrop(true);
      this.spawnDrop(true);
    }

    if (this.spawnTimer >= 1350) {
      this.spawnTimer = 0;
      this.spawnDrop(this.helperTriggered);
    }

    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      if (d.sprite.y < d.targetY) {
        d.sprite.y = Math.round(d.sprite.y + (d.vy * delta) / 1000);
        d.glow.y = d.sprite.y;
      } else {
        // Sits on the sand pulsing briefly so kids can still grab it easily
        d.vy -= delta * 0.03;
        if (d.vy < -35) {
          d.sprite.destroy();
          d.glow.destroy();
          this.drops.splice(i, 1);
          continue;
        }
      }

      // Check player catch distance (generous 32px radius for kids)
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, d.sprite.x, d.sprite.y) < 34) {
        audio.sfx("pickup");
        this.sparkleBurst(d.sprite.x, d.sprite.y);
        d.sprite.destroy();
        d.glow.destroy();
        this.drops.splice(i, 1);
        this.caught++;
        this.syncProgress();

        if (this.caught >= GOAL) {
          this.finishStage();
          break;
        }
      }
    }
  }

  private finishStage() {
    this.finished = true;
    this.drops.forEach((d) => {
      d.sprite.destroy();
      d.glow.destroy();
    });
    this.drops = [];
    audio.sfx("angel");
    this.sparkleBurst(320, 140);
    this.time.delayedCall(500, () =>
      this.completeInterlude(
        "CHẶNG ĐỆM B1",
        "Hành Trình Ba Vua Theo Ánh Sao (Mt 2, 1-12)",
        "Kiên trì bước theo ánh sáng Lời Chúa và dâng lên Chúa tấm lòng thảo hiếu mỗi ngày.",
        "Ba Vua đã dâng Vàng, Nhũ Hương và Mộc Dược cho Chúa Hài Đồng. Giờ đây chúng ta cùng tiến lên Đền Thờ Giê-ru-sa-lem nhé!"
      )
    );
  }
}

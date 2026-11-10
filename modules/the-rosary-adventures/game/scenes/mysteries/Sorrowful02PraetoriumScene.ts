import * as Phaser from "phaser";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import EventBus from "@/modules/shared/game/EventBus";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { registerLightTextures } from "@/modules/the-rosary-adventures/game/utils/lightTextureGenerator";
import { registerCanaTextures } from "@/modules/the-rosary-adventures/game/utils/canaTextureGenerator";
import { registerGalileeTextures } from "@/modules/the-rosary-adventures/game/utils/galileeTextureGenerator";
import { registerPassionTextures } from "@/modules/the-rosary-adventures/game/utils/passionTextureGenerator";

const W = 640;
const H = 560;
const WALL_H = 48;
const SPAWN: [number, number] = [320, 524];
const POST_AT: [number, number] = [334, 246];
const JESUS_AT: [number, number] = [306, 248];
const WELL_AT: [number, number] = [590, 120];
const CLOTH_AT: [number, number] = [558, 142];
const MAT_AT: [number, number] = [150, 214];
const SEEN_R = 42;

/** Patrolling guards: a lane each. The child must slip past while they walk away. */
const PATROLS: { from: [number, number]; to: [number, number]; ms: number }[] = [
  { from: [170, 300], to: [170, 470], ms: 2600 },
  { from: [230, 392], to: [520, 392], ms: 3600 },
  { from: [506, 170], to: [506, 340], ms: 2400 },
];

const PRAYERS = [
  "Lạy Chúa Giêsu, vì tội lỗi chúng con mà Chúa chịu đánh đòn. Con thương Chúa nhiều lắm. (Is 53, 5)",
  "Chúa không hề oán thán, Chúa lặng lẽ chịu đựng. Xin dạy con biết hãm mình và kiên nhẫn như Chúa. (Is 53, 7)",
  "'Nhờ những vết thương của Người, chúng ta được chữa lành.' Xin tha tội cho con và cho mọi người. (Is 53, 5)",
];

export class Sorrowful02PraetoriumScene extends InteractiveScene {
  private step = 0; // 0 sneak to the well, 1 carry cloth to the mat, 2 pray, 3 done
  private prayers = 0;
  private dialogue = false;
  private safeUntil = 0;
  private guards: Phaser.GameObjects.Sprite[] = [];
  private gloom!: Phaser.GameObjects.Rectangle;
  private offering?: Phaser.GameObjects.Image;

  constructor() {
    super("Sorrowful02PraetoriumScene");
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
    this.resetCarry();
    this.walkers = [];
    this.guards = [];
    this.step = 0;
    this.prayers = 0;
    this.dialogue = false;
    this.safeUntil = 0;
    this.offering = undefined;

    const open = () => (this.dialogue = true);
    const close = () => (this.dialogue = false);
    EventBus.on("dialogue-open", open);
    EventBus.on("dialogue-close", close);
    this.events.once("shutdown", () => {
      EventBus.off("dialogue-open", open);
      EventBus.off("dialogue-close", close);
    });

    if (!this.anims.exists("cana_lamp_flicker")) {
      this.anims.create({ key: "cana_lamp_flicker", frames: this.anims.generateFrameNumbers("cana_lamp", { frames: [0, 1] }), frameRate: 3, repeat: -1 });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildCourtyard();
    this.buildCharacters();
    this.defineInteractables();

    this.begin("thuong_02_danh_don", SPAWN, {
      speaker: "Dinh Tổng Trấn Philatô",
      emoji: "🏛️",
      lines: [
        "Mầu Nhiệm Thứ Hai Năm Sự Thương: Đức Chúa Giêsu Chịu Đánh Đòn (Ga 19, 1).",
        "Sân dinh lạnh lẽo bằng đá xám. Chúa Giêsu bị trói vào cột đá, không hề mở miệng oán thán.",
        "Hãy lẻn qua các toán lính đang tuần tra, đến giếng nước bên hông dinh lấy một mảnh vải sạch. Đừng để lính nhìn thấy con nhé!",
      ],
    });
  }

  // ---------- world ----------

  private buildCourtyard() {
    this.add.tileSprite(0, 0, W, H, "slab_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(236, 170, 200, 160, "cobble_tile").setOrigin(0).setDepth(DEPTH.RUG).setTint(0x9ca3af);
    this.edgeWalls(W, H);
    this.add.tileSprite(0, 0, W, WALL_H, "stone_wall").setOrigin(0).setDepth(DEPTH.WALL - 1).setTint(0xb0b4bc);
    this.block(W / 2, WALL_H / 2, W, WALL_H);
    for (const x of [90, 320, 550]) this.prop(x, 104, "temple_pillar", 20, 10).setTint(0xb0b4bc);
    for (const x of [200, 440]) {
      this.add.sprite(x, WALL_H, "cana_lamp").setOrigin(0.5, 0).setDepth(DEPTH.WALL).play("cana_lamp_flicker");
      const glow = this.add.image(x, WALL_H + 22, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.3);
      this.tweens.add({ targets: glow, alpha: 0.45, duration: 900, yoyo: true, repeat: -1, delay: x });
    }
    for (const [x, y] of [[50, 260], [600, 280], [60, 470], [596, 470]]) this.prop(x, y, "crate", 18, 10);
    for (const [x, y] of [[280, 470], [400, 470]]) this.prop(x, y, "clay_jar", 10, 6);
    this.prop(WELL_AT[0], WELL_AT[1], "cana_well", 28, 10);
    this.add.image(MAT_AT[0], MAT_AT[1], "sleeping_mat").setDepth(DEPTH.RUG + 1);
    this.add
      .text(MAT_AT[0], MAT_AT[1] - 18, "Chiếu cầu nguyện", { fontFamily: "'Dearpix', monospace", fontSize: "20px", color: "#fef08a", resolution: 4 })
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.FX);
    // cold, grey light over everything; lifts a little with every prayer
    this.gloom = this.add.rectangle(0, 0, W, H, 0x1c1830, 0.5).setOrigin(0).setDepth(DEPTH.FX - 5);
  }

  private buildCharacters() {
    this.prop(POST_AT[0], POST_AT[1], "scourge_post", 18, 8);
    this.add.sprite(...JESUS_AT, "jesus_bound").setOrigin(0.5, 1).setDepth(JESUS_AT[1]);
    for (const x of [272, 372]) {
      this.add.sprite(x, 244, "soldier").setOrigin(0.5, 1).setDepth(244);
      this.block(x, 240, 14, 8);
    }
    for (const [key, x, y] of [["apostle_a", 190, 150], ["mourner", 222, 134], ["apostle_b", 430, 142], ["apostle_c", 462, 158]] as const) {
      this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 4, 14, 8);
    }
    for (const p of PATROLS) {
      const g = this.add.sprite(p.from[0], p.from[1], "soldier").setOrigin(0.5, 1).setDepth(p.from[1]);
      this.walkers.push(g);
      this.guards.push(g);
      this.tweens.add({
        targets: g,
        x: p.to[0],
        y: p.to[1],
        duration: p.ms,
        yoyo: true,
        repeat: -1,
        hold: 700,
        ease: "Linear",
        onYoyo: () => g.setFlipX(true),
        onRepeat: () => g.setFlipX(false),
      });
    }
  }

  private defineInteractables() {
    this.spawnLoot("cloth", ...CLOTH_AT);
    this.interactables = [
      {
        at: () => CLOTH_AT,
        r: 34,
        label: () => "[A] Lấy mảnh vải sạch",
        active: () => this.step === 0 && this.lootActive("cloth"),
        act: () => {
          this.takeLoot("cloth");
          this.step = 1;
          this.talk("Bên Giếng", "💧", ["Con đã lấy được mảnh vải sạch. Hãy lẻn về chiếu cầu nguyện ở bên trái sân, nơi con có thể nhìn Chúa từ xa nhé."]);
        },
      },
      {
        at: () => MAT_AT,
        r: 44,
        label: () => (this.step === 1 ? "[A] Đặt mảnh vải lên chiếu" : "[A] Cầu nguyện cho Chúa"),
        active: () => this.step === 1 || (this.step === 2 && this.prayers < PRAYERS.length),
        act: () => (this.step === 1 ? this.offer() : this.pray()),
      },
    ];
  }

  // ---------- stealth ----------

  update() {
    super.update();
    if (this.dialogue || !this.player || this.time.now < this.safeUntil) return;
    for (const g of this.guards) {
      if (Phaser.Math.Distance.Between(g.x, g.y, this.player.x, this.player.y + 8) < SEEN_R) return this.caught();
    }
  }

  private caught() {
    this.safeUntil = this.time.now + 2500;
    this.cameras.main.flash(300, 255, 120, 120);
    const dropped = !!this.held;
    if (dropped) {
      this.dropItem();
      this.spawnLoot("cloth", ...CLOTH_AT);
      this.step = 0;
    }
    this.player.setPosition(SPAWN[0], SPAWN[1]);
    this.talk("Lính La Mã", "🛡️", [
      "'Này, đứa nhỏ kia! Đi chỗ khác!' Lính La Mã đuổi con về cổng dinh.",
      dropped ? "Con đánh rơi mảnh vải. Hãy đến giếng lấy lại và canh lúc lính quay đi nhé." : "Đừng nản lòng. Hãy đợi lính quay lưng đi rồi mới lẻn qua nhé.",
    ]);
  }

  // ---------- prayer ----------

  private offer() {
    this.dropItem();
    this.step = 2;
    this.offering = this.add.image(MAT_AT[0], MAT_AT[1] - 2, "cloth").setDepth(DEPTH.RUG + 2);
    this.sparkleBurst(MAT_AT[0], MAT_AT[1] - 8);
    this.talk("Chiếu Cầu Nguyện", "🙏", [
      "Con đặt mảnh vải sạch xuống, dâng lên Chúa như một lời xin lỗi âm thầm.",
      "Từ xa, con nhìn thấy Chúa bị trói nơi cột đá. Hãy cầu nguyện ba lần cho Chúa nhé.",
    ]);
  }

  private pray() {
    const n = this.prayers++;
    this.tweens.add({ targets: this.gloom, alpha: 0.5 - 0.15 * (n + 1), duration: 900, ease: "Stepped", easeParams: [4] });
    this.sparkleBurst(MAT_AT[0], MAT_AT[1] - 16);
    if (n + 1 < PRAYERS.length) {
      this.talk("Lời Cầu Nguyện", "🙏", [PRAYERS[n], `Bầu không khí dịu bớt u ám... (${n + 1}/${PRAYERS.length})`]);
      return;
    }
    this.step = 3;
    const glow = this.add.image(JESUS_AT[0], JESUS_AT[1] - 22, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.5);
    this.tweens.add({ targets: glow, alpha: 0.8, duration: 800, yoyo: true, repeat: -1 });
    this.cameras.main.flash(500, 255, 245, 210);
    this.talk("Lời Cầu Nguyện", "🙏", [PRAYERS[n], "Một niềm bình an lặng lẽ lan khắp sân dinh. Chúa Giêsu biết con đang ở bên Người."], () => this.finish());
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        2,
        "Năm Sự Thương",
        "Đức Chúa Giêsu Chịu Đánh Đòn",
        "Tinh thần hãm mình, đền tội và kiên nhẫn chịu đựng vì Chúa.",
        "Khi con chịu thiệt thòi hay bị đau, hãy dâng lên Chúa để đền tội cho mình và cho mọi người nhé!",
        ["sneak_past_guards", "clean_cloth", "three_prayers"]
      )
    );
  }
}

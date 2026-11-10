import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";

const W = 640;
const GARDEN_H = 560;
const H = 840;
const TOMB_AT: [number, number] = [320, 200];
const DOOR_IN: [number, number] = [320, 214]; // in front of the tomb opening
const CHAMBER_IN: [number, number] = [320, 790]; // where the player lands inside
const EXIT_AT: [number, number] = [320, 806];
const BENCH_AT: [number, number] = [320, 660];
const OUT_AT: [number, number] = [DOOR_IN[0], DOOR_IN[1] + 30]; // player stands at the tomb door
const JESUS_AT: [number, number] = [OUT_AT[0] + 46, OUT_AT[1] + 8];
const MAGDALENE_NEAR: [number, number] = [OUT_AT[0] - 46, OUT_AT[1] + 8];
const MAGDALENE_AT: [number, number] = [170, 330];

/** The grave-cloths scattered in the tomb; each goes to the tidy corner on the bench. */
const CLOTHS = [
  { id: "linen_a", key: "linen", name: "dải băng vải", at: [190, 740] as [number, number] },
  { id: "linen_b", key: "linen", name: "dải băng vải", at: [450, 700] as [number, number] },
  { id: "head_cloth", key: "linen", name: "khăn che đầu Chúa", at: [250, 650] as [number, number] },
];

export class Glorious01ResurrectionScene extends InteractiveScene {
  private tidy = new Set<string>();
  private tidied = false;
  private met = false;
  private exiting = false;
  private shade!: Phaser.GameObjects.Rectangle;
  private magdalene!: Phaser.GameObjects.Sprite;

  constructor() {
    super("Glorious01ResurrectionScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAllForGlory(this);
    this.resetCarry();
    this.walkers = [];
    this.tidy = new Set();
    this.tidied = this.met = this.exiting = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildGarden();
    this.buildTomb();
    this.defineInteractables();

    this.begin("mung_01_phuc_sinh", [320, 470], {
      speaker: "Khu Vườn Sáng Sớm",
      emoji: "🌅",
      lines: [
        "Mầu Nhiệm Thứ Nhất Năm Sự Mừng: Đức Chúa Giêsu Sống Lại Từ Cõi Chết (Mt 28, 1-10).",
        "Sáng sớm tinh sương, tảng đá lớn đã bị lăn ra khỏi mộ. Quân lính canh ngã gục, và ngôi mộ trống không.",
        "Hãy bước vào trong mộ, gom các dải băng vải và gấp khăn che đầu Chúa để sang một góc nhé.",
      ],
    });
  }

  // ---------- world ----------

  private buildGarden() {
    this.add.tileSprite(0, 0, W, GARDEN_H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(264, 210, 112, GARDEN_H - 210, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    // the world is one tall strip: a wall separates the garden from the tomb chamber
    this.block(W / 2, GARDEN_H + 20, W, 40);
    this.edgeWalls(W, H);
    // dawn: cool wash that lifts when the cloths are tidy
    this.shade = this.add.rectangle(0, 0, W, GARDEN_H, 0x1e3a8a, 0.28).setOrigin(0).setDepth(DEPTH.FX - 5);
    const sun = this.add.image(560, 30, "glow_gold").setDepth(DEPTH.FX - 4).setAlpha(0.7);
    this.tweens.add({ targets: sun, alpha: 1, duration: 2000, yoyo: true, repeat: -1 });
    for (const [x, y] of [[50, 120], [590, 130], [40, 420], [600, 430]]) this.prop(x, y, "hill_tree", 12, 8);
    for (const [x, y] of [[100, 300], [540, 320], [110, 500], [520, 510], [200, 440], [440, 450]]) {
      this.add.image(x, y, "lily_big").setOrigin(0.5, 1).setDepth(y);
    }
    for (const [x, y] of [[60, 250], [580, 270], [210, 120], [430, 110]]) this.prop(x, y, "boulder", 26, 8);
    // soldiers who fainted at the sight of the angels
    for (const [x, y] of [[230, 290], [410, 300]]) {
      this.add.sprite(x, y, "soldier").setOrigin(0.5, 1).setDepth(y).setAngle(90);
    }
    // the angel who rolled the stone away
    this.time.delayedCall(900, () => audio.sfx("angel"));
    const angel = this.add.sprite(430, 168, "archangel_gabriel").setOrigin(0.5, 1).setDepth(168).play("angel_flap");
    this.tweens.add({ targets: angel, y: 162, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.add.image(430, 140, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.35);
  }

  private buildTomb() {
    this.prop(TOMB_AT[0], TOMB_AT[1], "tomb_face", 80, 14);
    this.prop(TOMB_AT[0] + 66, TOMB_AT[1] + 4, "rolled_stone", 28, 10);
    // chamber
    this.add.tileSprite(120, 600, 400, 240, "tomb_floor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(120, 600, 400, 40, 0x1e293b).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.block(100, 720, 40, 240);
    this.block(540, 720, 40, 240);
    this.block(320, 590, 400, 20);
    this.prop(BENCH_AT[0], BENCH_AT[1], "stone_bench", 44, 14);
    const glow = this.add.image(320, 700, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.3);
    this.tweens.add({ targets: glow, alpha: 0.5, duration: 1600, yoyo: true, repeat: -1 });
    for (const x of [150, 490]) this.prop(x, 640, "menorah", 20, 8);
    for (const c of CLOTHS) this.spawnLoot(c.id, c.at[0], c.at[1], c.key);
  }

  update() {
    super.update();
    // after the folding, hold the player at the tomb door until the scene ends
    if (this.exiting && this.player) {
      this.player.setPosition(OUT_AT[0], OUT_AT[1]);
      (this.player.body as Phaser.Physics.Arcade.Body | null)?.setVelocity(0, 0);
    }
  }

  private teleport(to: [number, number]) {
    const cam = this.cameras.main;
    cam.fadeOut(250, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => {
      this.player.setPosition(to[0], to[1]);
      cam.fadeIn(250, 0, 0, 0);
    });
  }

  private defineInteractables() {
    this.interactables = [
      {
        at: () => DOOR_IN,
        r: 40,
        label: () => "[A] Bước vào ngôi mộ trống",
        active: () => true,
        act: () => this.teleport(CHAMBER_IN),
      },
      {
        at: () => EXIT_AT,
        r: 30,
        label: () => "[A] Ra khỏi mộ",
        active: () => true,
        act: () => {
          this.teleport(OUT_AT);
          if (this.tidied && !this.met) this.time.delayedCall(260, () => (this.exiting = true));
          if (this.tidied && !this.met) this.time.delayedCall(700, () => this.jesusAppears());
        },
      },
      ...CLOTHS.map((c) => ({
        at: (): [number, number] => c.at,
        r: 32,
        label: () => `[A] Nhặt ${c.name}`,
        active: () => !this.tidy.has(c.id) && this.lootActive(c.id),
        act: () => this.takeLoot(c.id),
      })),
      {
        at: () => [BENCH_AT[0], BENCH_AT[1] + 10],
        r: 40,
        label: () => (this.held ? "[A] Xếp gọn vào góc" : "Góc xếp khăn"),
        active: () => !this.tidied,
        act: () => this.fold(),
      },
      {
        at: () => MAGDALENE_AT,
        r: 44,
        label: () => "[A] Bà Maria Mađalêna",
        active: () => !this.met,
        act: () =>
          this.talk("Maria Mađalêna", "💜", this.tidied
            ? ["Con thấy khăn liệm được gấp gọn riêng một chỗ. Chính Thầy đã sống lại rồi! (Ga 20, 7)", "Hãy ra vườn tìm Thầy, Người đang đợi con."]
            : ["Mẹ mang dầu thơm đến xức xác Thầy, mà mộ lại trống không... Con vào xem trong mộ giúp Mẹ nhé."]),
      },
    ];
    this.hint(MAGDALENE_AT[0], MAGDALENE_AT[1] - 38);
    this.magdalene = this.add.sprite(MAGDALENE_AT[0], MAGDALENE_AT[1], "magdalene").setOrigin(0.5, 1).setDepth(MAGDALENE_AT[1]);
    this.block(MAGDALENE_AT[0], MAGDALENE_AT[1] - 4, 14, 8);
  }

  // ---------- quest ----------

  private fold() {
    if (!this.held) {
      this.talk("Góc xếp khăn", "🧺", ["Hãy nhặt các dải băng vải và khăn che đầu rải trong mộ, rồi mang đến góc này nhé."]);
      return;
    }
    const id = this.held.id;
    this.tidy.add(id);
    this.dropItem();
    const n = this.tidy.size;
    const folded = this.add
      .image(BENCH_AT[0] - 12 + (n - 1) * 12, BENCH_AT[1] - 16, "linen_folded")
      .setOrigin(0.5, 1)
      .setDepth(BENCH_AT[1] + 1);
    this.sparkleBurst(folded.x, folded.y - 6);
    if (n < CLOTHS.length) {
      this.talk("Ngôi mộ trống", "🕊️", [`Con đã gấp gọn ${n}/${CLOTHS.length} vật. Còn vài thứ nữa.`]);
      return;
    }
    this.tidied = true;
    this.shade.setAlpha(0.05);
    this.talk("Ngôi mộ trống", "🕊️", [
      "Khăn che đầu được cuốn riêng ở một chỗ, không để chung với băng vải. (Ga 20, 7)",
      "Chúa không còn ở trong mộ nữa. Người đã sống lại! Hãy ra vườn xem sao.",
    ]);
  }

  private jesusAppears() {
    this.met = true;
    this.shade.setAlpha(0);
    // Magdalene hurries over to the tomb door; the player stays put there
    this.walkers.push(this.magdalene);
    this.walk(this.magdalene, [MAGDALENE_NEAR]);
    const j = this.add.sprite(JESUS_AT[0], JESUS_AT[1], "jesus_risen").setOrigin(0.5, 1).setDepth(JESUS_AT[1]).setAlpha(0);
    this.add.image(JESUS_AT[0] + 24, JESUS_AT[1], "banner").setOrigin(0.5, 1).setDepth(JESUS_AT[1]);
    const glow = this.add.image(JESUS_AT[0], JESUS_AT[1] - 16, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0);
    this.tweens.add({ targets: [j, glow], alpha: 1, duration: 900 });
    this.cameras.main.flash(500, 255, 255, 200);
    this.sparkleBurst(JESUS_AT[0], JESUS_AT[1] - 20);
    this.time.delayedCall(1100, () =>
      this.talk(
        "Chúa Giêsu Phục Sinh",
        "🌅",
        [
          "Chúa Giêsu hiện ra, vinh hiển, các dấu đinh sáng lấp lánh trên tay chân. Người gọi: 'Maria!'",
          "Người nói: 'Đừng sợ! Hãy đi báo tin cho anh em Thầy.' (Mt 28, 10)",
          "Chúa đã chiến thắng sự chết. Hãy vui mừng và báo tin vui cho mọi người nhé!",
        ],
        () => this.finish()
      )
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        1,
        "Năm Sự Mừng",
        "Đức Chúa Giêsu Sống Lại Từ Cõi Chết",
        "Niềm tin vững vàng vào sự phục sinh và niềm hy vọng bất diệt vượt qua sự chết.",
        "Chúa đã sống lại! Khi buồn hay sợ, hãy nhớ: tình yêu mạnh hơn sự chết. Alleluia!",
        ["fold_linen", "meet_risen_lord"]
      )
    );
  }
}

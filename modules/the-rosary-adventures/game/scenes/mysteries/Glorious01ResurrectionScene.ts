import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

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
  { id: "linen_a", key: "linen", name: tx("dải băng vải", "linen strips"), at: [190, 740] as [number, number] },
  { id: "linen_b", key: "linen", name: tx("dải băng vải", "linen strips"), at: [450, 700] as [number, number] },
  { id: "head_cloth", key: "linen", name: tx("khăn che đầu Chúa", "the Lord's head cloth"), at: [250, 650] as [number, number] },
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
      speaker: tx("Khu Vườn Sáng Sớm", "The Early Morning Garden"),
      emoji: "🌅",
      lines: [
        tx("Mầu Nhiệm Thứ Nhất Năm Sự Mừng: Đức Chúa Giêsu Sống Lại Từ Cõi Chết (Mt 28, 1-10).", "First Glorious Mystery: The Resurrection of Jesus (Mt 28:1-10)."),
        tx("Sáng sớm tinh sương, tảng đá lớn đã bị lăn ra khỏi mộ. Quân lính canh ngã gục, và ngôi mộ trống không.", "At the crack of dawn the great stone has been rolled from the tomb. The guards have fallen, and the tomb is empty."),
        tx("Hãy bước vào trong mộ, gom các dải băng vải và gấp khăn che đầu Chúa để sang một góc nhé.", "Step into the tomb, gather the linen strips and fold the Lord's head cloth into a corner."),
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
        label: () => tx("[A] Bước vào ngôi mộ trống", "[A] Enter the empty tomb"),
        active: () => true,
        act: () => this.teleport(CHAMBER_IN),
      },
      {
        at: () => EXIT_AT,
        r: 30,
        label: () => tx("[A] Ra khỏi mộ", "[A] Leave the tomb"),
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
        label: () => tx(`[A] Nhặt ${c.name}`, `[A] Pick up ${c.name}`),
        active: () => !this.tidy.has(c.id) && this.lootActive(c.id),
        act: () => this.takeLoot(c.id),
      })),
      {
        at: () => [BENCH_AT[0], BENCH_AT[1] + 10],
        r: 40,
        label: () => (this.held ? tx("[A] Xếp gọn vào góc", "[A] Fold it into the corner") : tx("Góc xếp khăn", "Folding corner")),
        active: () => !this.tidied,
        act: () => this.fold(),
      },
      {
        at: () => MAGDALENE_AT,
        r: 44,
        label: () => tx("[A] Bà Maria Mađalêna", "[A] Mary Magdalene"),
        active: () => !this.met,
        act: () =>
          this.talk(tx("Maria Mađalêna", "Mary Magdalene"), "💜", this.tidied
            ? [tx("Con thấy khăn liệm được gấp gọn riêng một chỗ. Chính Thầy đã sống lại rồi! (Ga 20, 7)", "You saw the burial cloth folded neatly in a place by itself. The Master has truly risen! (Jn 20:7)"), tx("Hãy ra vườn tìm Thầy, Người đang đợi con.", "Go to the garden and look for the Master. He is waiting for you.")]
            : [tx("Mẹ mang dầu thơm đến xức xác Thầy, mà mộ lại trống không... Con vào xem trong mộ giúp Mẹ nhé.", "I brought perfumed oil to anoint the Lord's body, but the tomb is empty... Please go in and look inside for me.")]),
      },
    ];
    this.hint(MAGDALENE_AT[0], MAGDALENE_AT[1] - 38);
    this.magdalene = this.add.sprite(MAGDALENE_AT[0], MAGDALENE_AT[1], "magdalene").setOrigin(0.5, 1).setDepth(MAGDALENE_AT[1]);
    this.block(MAGDALENE_AT[0], MAGDALENE_AT[1] - 4, 14, 8);
  }

  // ---------- quest ----------

  private fold() {
    if (!this.held) {
      this.talk(tx("Góc xếp khăn", "Folding corner"), "🧺", [tx("Hãy nhặt các dải băng vải và khăn che đầu rải trong mộ, rồi mang đến góc này nhé.", "Pick up the linen strips and the head cloth lying in the tomb, then bring them to this corner.")]);
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
      this.talk(tx("Ngôi mộ trống", "The empty tomb"), "🕊️", [tx(`Con đã gấp gọn ${n}/${CLOTHS.length} vật. Còn vài thứ nữa.`, `You folded ${n}/${CLOTHS.length} items. A few more to go.`)]);
      return;
    }
    this.tidied = true;
    this.shade.setAlpha(0.05);
    this.talk(tx("Ngôi mộ trống", "The empty tomb"), "🕊️", [
      tx("Khăn che đầu được cuốn riêng ở một chỗ, không để chung với băng vải. (Ga 20, 7)", "The head cloth was rolled up in a place by itself, not with the linen strips. (Jn 20:7)"),
      tx("Chúa không còn ở trong mộ nữa. Người đã sống lại! Hãy ra vườn xem sao.", "The Lord is no longer in the tomb. He is risen! Go to the garden and see."),
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
        tx("Chúa Giêsu Phục Sinh", "The Risen Jesus"),
        "🌅",
        [
          tx("Chúa Giêsu hiện ra, vinh hiển, các dấu đinh sáng lấp lánh trên tay chân. Người gọi: 'Maria!'", "Jesus appears in glory, the nail marks shining on His hands and feet. He calls: ‘Mary!’"),
          tx("Người nói: 'Đừng sợ! Hãy đi báo tin cho anh em Thầy.' (Mt 28, 10)", "He says: ‘Do not be afraid! Go and tell my brothers.’ (Mt 28:10)"),
          tx("Chúa đã chiến thắng sự chết. Hãy vui mừng và báo tin vui cho mọi người nhé!", "The Lord has conquered death. Rejoice and share the good news with everyone!"),
        ],
        () => this.finish()
      )
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        1,
        tx("Năm Sự Mừng", "Glorious"),
        tx("Đức Chúa Giêsu Sống Lại Từ Cõi Chết", "The Resurrection of Jesus"),
        tx("Niềm tin vững vàng vào sự phục sinh và niềm hy vọng bất diệt vượt qua sự chết.", "Firm faith in the resurrection and an unfailing hope that overcomes death."),
        tx("Chúa đã sống lại! Khi buồn hay sợ, hãy nhớ: tình yêu mạnh hơn sự chết. Alleluia!", "The Lord is risen! When you feel sad or afraid, remember: love is stronger than death. Alleluia!"),
        ["fold_linen", "meet_risen_lord"]
      )
    );
  }
}

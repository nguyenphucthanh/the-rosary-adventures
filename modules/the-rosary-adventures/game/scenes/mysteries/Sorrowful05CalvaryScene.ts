import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { registerLightTextures } from "@/modules/the-rosary-adventures/game/utils/lightTextureGenerator";
import { registerCanaTextures } from "@/modules/the-rosary-adventures/game/utils/canaTextureGenerator";
import { registerGalileeTextures } from "@/modules/the-rosary-adventures/game/utils/galileeTextureGenerator";
import { registerPassionTextures } from "@/modules/the-rosary-adventures/game/utils/passionTextureGenerator";

const W = 640;
const H = 560;
const CROSS_AT: [number, number] = [320, 214];
const MARY_AT: [number, number] = [262, 268];
const JOHN_AT: [number, number] = [378, 268];
const CENTURION_AT: [number, number] = [520, 410];

/** The three faith-candles: where they lie, and the word of Jesus each one lights. */
const CANDLES = [
  {
    id: "forgive", name: "nến Tha thứ", label: "Tha thứ", from: [110, 430] as [number, number], holder: [290, 276] as [number, number],
    word: "Lạy Cha, xin tha cho họ, vì họ không biết việc họ làm. (Lc 23, 34)",
    lesson: "Chúa Giêsu tha thứ cho cả những người đóng đinh Người. Hãy học tha thứ cho người làm con buồn nhé.",
  },
  {
    id: "trust", name: "nến Phó thác", label: "Phó thác", from: [520, 470] as [number, number], holder: [320, 284] as [number, number],
    word: "Lạy Cha, con phó thác hồn con trong tay Cha. (Lc 23, 46)",
    lesson: "Chúa Giêsu phó thác tất cả trong tay Cha. Khi sợ hãi, hãy phó thác cho Cha trên trời như Người.",
  },
  {
    id: "mother", name: "nến Trao Mẹ", label: "Này là Mẹ con", from: [320, 506] as [number, number], holder: [350, 276] as [number, number],
    word: "Thưa Bà, đây là con của Bà. — Này là Mẹ của con. (Ga 19, 26-27)",
    lesson: "Chúa Giêsu trao Đức Mẹ làm Mẹ của chúng ta. Hãy yêu mến Mẹ Maria và xin Mẹ chở che nhé.",
  },
];

export class Sorrowful05CalvaryScene extends InteractiveScene {
  private lit = new Set<string>();
  private done = false;
  private sky!: Phaser.GameObjects.Rectangle;

  constructor() {
    super("Sorrowful05CalvaryScene");
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
    this.lit = new Set();
    this.done = false;

    if (!this.anims.exists("candle_burn")) {
      this.anims.create({ key: "candle_burn", frames: this.anims.generateFrameNumbers("candle_flame", { frames: [0, 1] }), frameRate: 5, repeat: -1 });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildHill();
    this.buildCharacters();
    this.defineInteractables();

    this.begin("thuong_05_chiu_chet", [320, 520], {
      speaker: "Đồi Can-vê",
      emoji: "✝️",
      lines: [
        "Mầu Nhiệm Thứ Năm Năm Sự Thương: Đức Chúa Giêsu Chịu Chết Trên Cây Thập Tự (Lc 23, 33-46).",
        "Giữa ban ngày mà bầu trời tối đen. Chúa Giêsu bị treo trên thập giá, Đức Mẹ và thánh Gioan đứng dưới chân Người.",
        "Hãy nhặt ba ngọn nến đức tin: Tha thứ, Phó thác và Trao Mẹ, rồi đặt đúng vào ba chân đế dưới thập giá nhé.",
      ],
    });
  }

  // ---------- world ----------

  private buildHill() {
    this.add.tileSprite(0, 0, W, H, "calvary_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(244, 230, 152, H - 230, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR).setTint(0x7a6a5a);
    this.edgeWalls(W, H);
    // eclipse: the sun goes dark at noon; the whole hill sits under a heavy grey sky
    this.sky = this.add.rectangle(0, 0, W, H, 0x050510, 0.5).setOrigin(0).setDepth(DEPTH.FX - 5);
    this.add.image(120, 40, "eclipse").setDepth(DEPTH.FX - 4);
    // temple veil far away, seen as two halves
    for (const [i, cropX] of [0, 28].entries()) {
      this.add.image(540 + cropX, 20, "temple_veil").setOrigin(0, 0).setDepth(DEPTH.FX - 4).setCrop(cropX, 0, 28, 76).setName(`veil${i}`);
    }
    for (const [x, y] of [[40, 300], [600, 320], [70, 480], [580, 500]]) this.prop(x, y, "boulder", 26, 8);
    for (const [x, y] of [[60, 180], [590, 190]]) this.prop(x, y, "hill_tree", 12, 8).setTint(0x6b7280);
    this.prop(CROSS_AT[0] - 96, CROSS_AT[1] + 10, "crucifix_thief", 12, 8);
    this.prop(CROSS_AT[0] + 96, CROSS_AT[1] + 10, "crucifix_thief", 12, 8);
    this.prop(CROSS_AT[0], CROSS_AT[1], "crucifix_jesus", 16, 8);
    const g = this.add.image(CROSS_AT[0], CROSS_AT[1] - 30, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.2);
    this.tweens.add({ targets: g, alpha: 0.4, duration: 1800, yoyo: true, repeat: -1 });
    for (const c of CANDLES) {
      this.add.image(c.holder[0], c.holder[1], "candle_holder").setOrigin(0.5, 1).setDepth(c.holder[1]);
      this.add
        .text(c.holder[0], c.holder[1] + 4, c.label, { fontFamily: "'Dearpix', monospace", fontSize: "20px", color: "#fef08a", resolution: 4 })
        .setOrigin(0.5, 0)
        .setDepth(DEPTH.FX);
    }
  }

  private buildCharacters() {
    for (const [key, [x, y]] of [["mary_sorrow", MARY_AT], ["john_apostle", JOHN_AT]] as const) {
      this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 4, 14, 8);
    }
    this.hint(MARY_AT[0], MARY_AT[1] - 38);
    this.add.sprite(...CENTURION_AT, "centurion").setOrigin(0.5, 1).setDepth(CENTURION_AT[1]);
    this.block(CENTURION_AT[0], CENTURION_AT[1] - 4, 14, 8);
    for (const [x, y] of [[80, 380], [140, 392]]) {
      this.add.sprite(x, y, "soldier").setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 4, 14, 8);
    }
  }

  private defineInteractables() {
    for (const c of CANDLES) this.spawnLoot(c.id, c.from[0], c.from[1], "candle");
    this.interactables = [
      ...CANDLES.map((c) => ({
        at: (): [number, number] => c.from,
        r: 34,
        label: () => `[A] Nhặt ${c.name}`,
        active: () => !this.lit.has(c.id) && this.lootActive(c.id),
        act: () => this.takeLoot(c.id),
      })),
      ...CANDLES.map((c) => ({
        at: (): [number, number] => [c.holder[0], c.holder[1] + 10],
        r: 24,
        label: () => (this.held ? `[A] Đặt nến vào "${c.label}"` : `Chân đế "${c.label}"`),
        active: () => !this.lit.has(c.id),
        act: () => this.place(c),
      })),
      {
        at: () => MARY_AT,
        r: 44,
        label: () => "[A] Đức Mẹ Maria",
        active: () => !this.done,
        act: () =>
          this.talk("Đức Mẹ Maria", "💙", [
            "Mẹ đứng dưới chân thập giá, đau xót như bị gươm đâm thâu qua lòng. (Lc 2, 35)",
            "Mẹ ở bên Con cho đến phút cuối. Con hãy ở lại cầu nguyện với Mẹ nhé.",
          ]),
      },
      {
        at: () => CROSS_AT,
        r: 60,
        label: () => "[A] Nhìn lên thập giá",
        active: () => !this.done,
        act: () =>
          this.talk("Chúa Giêsu", "✝️", [
            "Chúa Giêsu bị đóng đinh giữa hai người phạm tội. Người nói: 'Hôm nay, anh sẽ được ở với tôi trên Thiên Đàng.' (Lc 23, 43)",
            "Hãy thắp ba ngọn nến đức tin dưới chân thập giá để nghe những lời sau cùng của Chúa.",
          ]),
      },
      {
        at: () => CENTURION_AT,
        r: 44,
        label: () => "[A] Nói chuyện với viên đại đội trưởng",
        active: () => !this.done,
        act: () => this.talk("Đại Đội Trưởng", "🛡️", ["Tôi đã đứng canh ở đây suốt từ sáng... Người này lạ lắm, chưa từng thấy ai chịu đau đớn mà vẫn tha thứ như thế."]),
      },
    ];
  }

  // ---------- quest ----------

  private place(c: (typeof CANDLES)[number]) {
    if (!this.held) {
      this.talk(`Chân đế "${c.label}"`, "🕯️", [`Chân đế này chờ ${c.name}. Hãy nhặt nến trên đồi mang đến đây nhé.`]);
      return;
    }
    if (this.held.id !== c.id) {
      audio.sfx("wrong");
      this.talk(`Chân đế "${c.label}"`, "🕯️", [`Chưa đúng rồi. Chân đế này dành cho ${c.name}. Hãy xem tên dưới mỗi chân đế nhé.`]);
      return;
    }
    this.lit.add(c.id);
    this.dropItem();
    const [x, y] = c.holder;
    this.add.sprite(x, y - 8, "candle_flame").setOrigin(0.5, 1).setDepth(y + 1).play("candle_burn");
    const glow = this.add.image(x, y - 16, "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.7);
    this.tweens.add({ targets: glow, alpha: 0.4, duration: 600, yoyo: true, repeat: -1 });
    this.sparkleBurst(x, y - 18);
    this.sky.setAlpha(Math.max(0.3, this.sky.alpha - 0.07));
    const last = this.lit.size === CANDLES.length;
    this.talk("Chúa Giêsu", "✝️", [c.word, c.lesson], last ? () => this.climax() : undefined);
  }

  private climax() {
    this.done = true;
    audio.playMusic(""); // silence at the death of Jesus, then the sorrowful theme returns softly
    audio.sfx("door");
    this.time.delayedCall(4500, () => audio.playMusic("sorrowful"));
    const cam = this.cameras.main;
    cam.shake(900, 0.006);
    cam.flash(500, 255, 255, 255);
    // the temple veil tears in two
    for (const [i, dir] of [-1, 1].entries()) {
      const half = this.children.getByName(`veil${i}`) as Phaser.GameObjects.Image;
      this.tweens.add({ targets: half, x: half.x + dir * 12, duration: 1200, ease: "Stepped", easeParams: [6] });
    }
    this.time.delayedCall(1100, () =>
      this.talk(
        "Đại Đội Trưởng",
        "🛡️",
        [
          "Chúa Giêsu kêu lớn tiếng rồi trút hơi thở cuối cùng. Đất rung chuyển, bức màn Đền Thờ xé làm đôi từ trên xuống dưới. (Lc 23, 45-46)",
          "Viên đại đội trưởng La Mã đấm ngực và thốt lên: 'Quả thật, người này là Con Thiên Chúa!' (Mt 27, 54)",
          "Chúa Giêsu đã hiến mạng sống vì yêu thương chúng ta đến cùng.",
        ],
        () => this.finish()
      )
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        5,
        "Năm Sự Thương",
        "Đức Chúa Giêsu Chịu Chết Trên Cây Thập Tự",
        "Lòng biết ơn sâu xa ơn cứu độ và tình yêu hy sinh đến cùng của Chúa Giêsu.",
        "Mỗi lần làm dấu Thánh Giá, hãy nhớ Chúa Giêsu đã yêu bạn đến chết vì bạn. Cảm ơn Chúa nhé!",
        ["light_three_candles", "last_words", "centurion_confession"]
      )
    );
  }
}

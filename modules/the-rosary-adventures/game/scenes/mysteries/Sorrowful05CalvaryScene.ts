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
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 560;
const CROSS_AT: [number, number] = [320, 214];
const MARY_AT: [number, number] = [262, 268];
const JOHN_AT: [number, number] = [378, 268];
const CENTURION_AT: [number, number] = [520, 410];

/** The three faith-candles: where they lie, and the word of Jesus each one lights. */
const CANDLES = [
  {
    id: "forgive", name: tx("nến Tha thứ", "Candle of Forgiveness"), label: tx("Tha thứ", "Forgiveness"), from: [110, 430] as [number, number], holder: [290, 276] as [number, number],
    word: tx("Lạy Cha, xin tha cho họ, vì họ không biết việc họ làm. (Lc 23, 34)", "Father, forgive them, they know not what they do. (Lk 23:34)"),
    lesson: tx("Chúa Giêsu tha thứ cho cả những người đóng đinh Người. Hãy học tha thứ cho người làm con buồn nhé.", "Jesus forgave even those who nailed Him to the cross. Learn to forgive those who make you sad."),
  },
  {
    id: "trust", name: tx("nến Phó thác", "Candle of Trust"), label: tx("Phó thác", "Trust"), from: [520, 470] as [number, number], holder: [320, 284] as [number, number],
    word: tx("Lạy Cha, con phó thác hồn con trong tay Cha. (Lc 23, 46)", "Father, into your hands I commend my spirit. (Lk 23:46)"),
    lesson: tx("Chúa Giêsu phó thác tất cả trong tay Cha. Khi sợ hãi, hãy phó thác cho Cha trên trời như Người.", "Jesus entrusted everything into the Father's hands. When you're afraid, trust in the Father in heaven like Him."),
  },
  {
    id: "mother", name: tx("nến Trao Mẹ", "Candle of the Gift of Mother"), label: tx("Này là Mẹ con", "Behold your mother"), from: [320, 506] as [number, number], holder: [350, 276] as [number, number],
    word: tx("Thưa Bà, đây là con của Bà. — Này là Mẹ của con. (Ga 19, 26-27)", "Woman, behold your son. — Behold your mother. (Jn 19:26-27)"),
    lesson: tx("Chúa Giêsu trao Đức Mẹ làm Mẹ của chúng ta. Hãy yêu mến Mẹ Maria và xin Mẹ chở che nhé.", "Jesus gave Mary to be our Mother. Love Mother Mary and ask her to protect you."),
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
      speaker: tx("Đồi Can-vê", "Calvary"),
      emoji: "✝️",
      lines: [
        tx("Mầu Nhiệm Thứ Năm Năm Sự Thương: Đức Chúa Giêsu Chịu Chết Trên Cây Thập Tự (Lc 23, 33-46).", "Fifth Sorrowful Mystery: The Crucifixion and Death of Jesus (Lk 23:33-46)."),
        tx("Giữa ban ngày mà bầu trời tối đen. Chúa Giêsu bị treo trên thập giá, Đức Mẹ và thánh Gioan đứng dưới chân Người.", "In the middle of the day the sky turns black. Jesus hangs on the cross, with Mary and Saint John standing at His feet."),
        tx("Hãy nhặt ba ngọn nến đức tin: Tha thứ, Phó thác và Trao Mẹ, rồi đặt đúng vào ba chân đế dưới thập giá nhé.", "Pick up the three candles of faith: Forgiveness, Trust and Gift of Mother, and place each on the right one of the three stands below the cross."),
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
        label: () => tx(`[A] Nhặt ${c.name}`, `[A] Pick up ${c.name}`),
        active: () => !this.lit.has(c.id) && this.lootActive(c.id),
        act: () => this.takeLoot(c.id),
      })),
      ...CANDLES.map((c) => ({
        at: (): [number, number] => [c.holder[0], c.holder[1] + 10],
        r: 24,
        label: () => (this.held ? tx(`[A] Đặt nến vào "${c.label}"`, `[A] Place the candle on the "${c.label}" stand`) : tx(`Chân đế "${c.label}"`, `"${c.label}" stand`)),
        active: () => !this.lit.has(c.id),
        act: () => this.place(c),
      })),
      {
        at: () => MARY_AT,
        r: 44,
        label: () => tx("[A] Đức Mẹ Maria", "[A] Mother Mary"),
        active: () => !this.done,
        act: () =>
          this.talk(tx("Đức Mẹ Maria", "Mother Mary"), "💙", [
            tx("Mẹ đứng dưới chân thập giá, đau xót như bị gươm đâm thâu qua lòng. (Lc 2, 35)", "Mary stands at the foot of the cross, her heart pierced as if by a sword. (Lk 2:35)"),
            tx("Mẹ ở bên Con cho đến phút cuối. Con hãy ở lại cầu nguyện với Mẹ nhé.", "Mary stays with her Son until the last moment. Stay and pray with her."),
          ]),
      },
      {
        at: () => CROSS_AT,
        r: 60,
        label: () => tx("[A] Nhìn lên thập giá", "[A] Look up at the cross"),
        active: () => !this.done,
        act: () =>
          this.talk(tx("Chúa Giêsu", "Jesus"), "✝️", [
            tx("Chúa Giêsu bị đóng đinh giữa hai người phạm tội. Người nói: 'Hôm nay, anh sẽ được ở với tôi trên Thiên Đàng.' (Lc 23, 43)", "Jesus is crucified between two criminals. He says: ‘Today you will be with me in Paradise.’ (Lk 23:43)"),
            tx("Hãy thắp ba ngọn nến đức tin dưới chân thập giá để nghe những lời sau cùng của Chúa.", "Light the three candles of faith at the foot of the cross to hear the Lord's last words."),
          ]),
      },
      {
        at: () => CENTURION_AT,
        r: 44,
        label: () => tx("[A] Nói chuyện với viên đại đội trưởng", "[A] Talk to the centurion"),
        active: () => !this.done,
        act: () => this.talk(tx("Đại Đội Trưởng", "Centurion"), "🛡️", [tx("Tôi đã đứng canh ở đây suốt từ sáng... Người này lạ lắm, chưa từng thấy ai chịu đau đớn mà vẫn tha thứ như thế.", "I've stood guard here since morning... This man is strange. I've never seen anyone suffer and still forgive like that.")]),
      },
    ];
  }

  // ---------- quest ----------

  private place(c: (typeof CANDLES)[number]) {
    if (!this.held) {
      this.talk(tx(`Chân đế "${c.label}"`, `"${c.label}" stand`), "🕯️", [tx(`Chân đế này chờ ${c.name}. Hãy nhặt nến trên đồi mang đến đây nhé.`, `This stand is waiting for ${c.name}. Pick up the candle on the hill and bring it here.`)]);
      return;
    }
    if (this.held.id !== c.id) {
      audio.sfx("wrong");
      this.talk(tx(`Chân đế "${c.label}"`, `"${c.label}" stand`), "🕯️", [tx(`Chưa đúng rồi. Chân đế này dành cho ${c.name}. Hãy xem tên dưới mỗi chân đế nhé.`, `Not right. This stand is for ${c.name}. Check the name under each stand.`)]);
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
    this.talk(tx("Chúa Giêsu", "Jesus"), "✝️", [c.word, c.lesson], last ? () => this.climax() : undefined);
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
        tx("Đại Đội Trưởng", "Centurion"),
        "🛡️",
        [
          tx("Chúa Giêsu kêu lớn tiếng rồi trút hơi thở cuối cùng. Đất rung chuyển, bức màn Đền Thờ xé làm đôi từ trên xuống dưới. (Lc 23, 45-46)", "Jesus cries out in a loud voice and breathes His last. The earth shakes and the curtain of the Temple is torn in two from top to bottom. (Lk 23:45-46)"),
          tx("Viên đại đội trưởng La Mã đấm ngực và thốt lên: 'Quả thật, người này là Con Thiên Chúa!' (Mt 27, 54)", "The Roman centurion beats his breast and says: ‘Truly this man was the Son of God!’ (Mt 27:54)"),
          tx("Chúa Giêsu đã hiến mạng sống vì yêu thương chúng ta đến cùng.", "Jesus gave His life out of love for us to the very end."),
        ],
        () => this.finish()
      )
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        5,
        tx("Năm Sự Thương", "Sorrowful"),
        tx("Đức Chúa Giêsu Chịu Chết Trên Cây Thập Tự", "The Crucifixion and Death of Jesus"),
        tx("Lòng biết ơn sâu xa ơn cứu độ và tình yêu hy sinh đến cùng của Chúa Giêsu.", "Deep gratitude for salvation and for Jesus' love that sacrificed everything."),
        tx("Mỗi lần làm dấu Thánh Giá, hãy nhớ Chúa Giêsu đã yêu bạn đến chết vì bạn. Cảm ơn Chúa nhé!", "Every time you make the Sign of the Cross, remember that Jesus loved you even to death. Thank You, Lord!"),
        ["light_three_candles", "last_words", "centurion_confession"]
      )
    );
  }
}

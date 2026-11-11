import * as Phaser from "phaser";
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
const WALL_H = 48;
const JESUS_AT: [number, number] = [320, 168];
const CLOAK_AT: [number, number] = [526, 150];
const MOCKERS: [number, number][] = [[240, 156], [400, 156]];
const STRIP = 28; // height of a divider wall
/** Dividers: [y of top edge, gap x-start, gap x-end]. The gap is plugged with thorns the soldiers scattered. */
const DIVIDERS: [number, number, number][] = [[340, 288, 352], [200, 96, 160]];

interface Thorn {
  x: number;
  y: number;
  img: Phaser.GameObjects.Image;
  wall: Phaser.GameObjects.Rectangle;
  gone: boolean;
}

export class Sorrowful03ThornsScene extends InteractiveScene {
  private thorns: Thorn[] = [];
  private step = 0; // 0 clear thorns, 1 fold the cloak, 2 honour the King, 3 done
  private cloak!: Phaser.GameObjects.Image;

  constructor() {
    super("Sorrowful03ThornsScene");
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
    this.thorns = [];
    this.step = 0;

    if (!this.anims.exists("cana_lamp_flicker")) {
      this.anims.create({ key: "cana_lamp_flicker", frames: this.anims.generateFrameNumbers("cana_lamp", { frames: [0, 1] }), frameRate: 3, repeat: -1 });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildBarracks();
    this.buildCharacters();
    this.defineInteractables();

    this.begin("thuong_03_doi_mao_gai", [320, 524], {
      speaker: tx("Trại Lính La Mã", "The Roman Barracks"),
      emoji: "👑",
      lines: [
        tx("Mầu Nhiệm Thứ Ba Năm Sự Thương: Đức Chúa Giêsu Chịu Đội Mão Gai (Mt 27, 27-31).", "Third Sorrowful Mystery: The Crowning with Thorns (Mt 27:27-31)."),
        tx("Lính La Mã khoác áo choàng cho Chúa, đặt mão gai lên đầu Người và nhạo báng: 'Vạn tuế Vua dân Do Thái!'", "The Roman soldiers drape a cloak on Jesus, set a crown of thorns on His head and mock Him: ‘Hail, King of the Jews!’"),
        tx("Bọn lính đã vãi gai nhọn chặn lối đi. Con hãy dọn sạch từng chiếc gai để đến gần Chúa nhé.", "The soldiers scattered sharp thorns across the path. Clear away each thorn to get close to the Lord."),
      ],
    });
  }

  // ---------- world ----------

  private buildBarracks() {
    this.add.tileSprite(0, 0, W, H, "cobble_tile").setOrigin(0).setDepth(DEPTH.FLOOR).setTint(0xd8c9b0);
    this.add.tileSprite(224, 56, 192, 130, "rug_tile").setOrigin(0).setDepth(DEPTH.RUG).setTint(0xb08080);
    this.edgeWalls(W, H);
    this.add.tileSprite(0, 0, W, WALL_H, "stone_wall").setOrigin(0).setDepth(DEPTH.WALL - 1).setTint(0xc8b896);
    this.block(W / 2, WALL_H / 2, W, WALL_H);
    for (const x of [110, 320, 530]) {
      this.add.sprite(x, WALL_H, "cana_lamp").setOrigin(0.5, 0).setDepth(DEPTH.WALL).play("cana_lamp_flicker");
      const glow = this.add.image(x, WALL_H + 22, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.35);
      this.tweens.add({ targets: glow, alpha: 0.5, duration: 900, yoyo: true, repeat: -1, delay: x });
    }
    // dividers with a thorn-plugged gap
    for (const [top, g0, g1] of DIVIDERS) {
      for (const [x0, x1] of [[0, g0], [g1, W]]) {
        this.add.tileSprite(x0, top, x1 - x0, STRIP, "stone_wall").setOrigin(0).setDepth(top + STRIP).setTint(0xc8b896);
        this.block((x0 + x1) / 2, top + STRIP / 2, x1 - x0, STRIP);
      }
      for (let x = g0; x < g1; x += 16) this.addThorn(x + 8, top + STRIP - 4);
    }
    for (const [x, y] of [[50, 420], [590, 420], [50, 280], [592, 280]]) this.prop(x, y, "crate", 18, 10);
    for (const [x, y] of [[110, 500], [530, 500], [220, 270], [430, 270]]) this.prop(x, y, "clay_jar", 10, 6);
    this.prop(40, 130, "menorah", 20, 8);
    this.prop(600, 130, "menorah", 20, 8);
    this.prop(JESUS_AT[0], 118, "throne", 28, 10);
  }

  private addThorn(x: number, y: number) {
    const img = this.add.image(x, y, "thorn").setOrigin(0.5, 1).setDepth(y);
    const wall = this.add.rectangle(x, y - 5, 16, 10);
    this.obstacles.add(wall);
    this.thorns.push({ x, y: y - 4, img, wall, gone: false });
  }

  private buildCharacters() {
    this.add.sprite(...JESUS_AT, "jesus_thorns").setOrigin(0.5, 1).setDepth(JESUS_AT[1]);
    this.hint(JESUS_AT[0], JESUS_AT[1] - 40);
    for (const [x, y] of MOCKERS) {
      this.add.sprite(x, y, "soldier").setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 4, 14, 8);
    }
    this.add.sprite(110, 250, "apostle_b").setOrigin(0.5, 1).setDepth(250);
    this.add.sprite(520, 410, "apostle_c").setOrigin(0.5, 1).setDepth(410);
    this.cloak = this.add.image(CLOAK_AT[0], CLOAK_AT[1], "cloak").setOrigin(0.5, 1).setDepth(CLOAK_AT[1]);
  }

  // ---------- interaction ----------

  private defineInteractables() {
    this.interactables = [
      ...this.thorns.map((t) => ({
        at: (): [number, number] => [t.x, t.y],
        r: 26,
        label: () => tx(`[A] Nhặt gai (${this.thorns.filter((o) => o.gone).length}/${this.thorns.length})`, `[A] Pick up a thorn (${this.thorns.filter((o) => o.gone).length}/${this.thorns.length})`),
        active: () => !t.gone,
        act: () => this.pickThorn(t),
      })),
      ...MOCKERS.map(([x, y]) => ({
        at: (): [number, number] => [x, y],
        r: 44,
        label: () => tx("[A] Nghe lính nói", "[A] Listen to the soldiers"),
        active: () => this.step < 3,
        act: () =>
          this.talk(tx("Lính La Mã", "Roman Soldier"), "🛡️", [
            tx("'Vạn tuế Vua dân Do Thái!' Bọn lính quỳ xuống nhạo báng, nhổ vào Người và lấy cây sậy đánh vào đầu Người. (Mt 27, 29-30)", "‘Hail, King of the Jews!’ The soldiers kneel to mock Him, spit on Him and strike His head with a reed. (Mt 27:29-30)"),
            tx("Chúa Giêsu không đáp lại. Người im lặng chịu đựng vì yêu thương chúng ta.", "Jesus does not answer. He suffers in silence out of love for us."),
          ]),
      })),
      {
        at: () => CLOAK_AT,
        r: 36,
        label: () => tx("[A] Gấp áo choàng tím", "[A] Fold the purple cloak"),
        active: () => this.step === 1,
        act: () => this.foldCloak(),
      },
      {
        at: () => JESUS_AT,
        r: 52,
        label: () => (this.step === 2 ? tx("[A] Quỳ tôn vinh Chúa", "[A] Kneel and honor the Lord") : tx("[A] Trò chuyện với Chúa Giêsu", "[A] Talk to Jesus")),
        active: () => this.step < 3,
        act: () => (this.step === 2 ? this.honour() : this.talkJesus()),
      },
    ];
  }

  private pickThorn(t: Thorn) {
    t.gone = true;
    this.obstacles.remove(t.wall, true, true);
    this.sparkleBurst(t.x, t.y - 4);
    this.tweens.add({ targets: t.img, alpha: 0, y: "-=10", duration: 300, onComplete: () => t.img.destroy() });
    if (this.thorns.every((o) => o.gone)) {
      this.step = 1;
      this.time.delayedCall(700, () =>
        this.talk(tx("Trại Lính", "The Barracks"), "🌿", [tx("Con đã dọn sạch những chiếc gai nhọn! Con đường đã thông.", "You cleared the sharp thorns! The path is open."), tx("Ở góc phòng có chiếc áo choàng tím bị vứt dưới đất. Hãy đến gấp lại cho ngay ngắn nhé.", "In the corner there is a purple cloak thrown on the ground. Go fold it neatly.")])
      );
    }
  }

  private talkJesus() {
    this.talk(tx("Chúa Giêsu", "Jesus"), "👑", [
      this.step === 0
        ? tx("Chúa Giêsu lặng lẽ nhìn con. Người đội mão gai, tay cầm cây sậy, vẫn hiền hòa như xưa. Con hãy dọn gai trên đường đến gần Người nhé.", "Jesus looks at you quietly. He wears the crown of thorns and holds the reed, yet is as gentle as ever. Clear the thorns on the path to get near Him.")
        : tx("Chúa Giêsu nhìn con bằng ánh mắt dịu dàng. Hãy gấp chiếc áo choàng tím rơi dưới đất để tỏ lòng kính trọng Người nhé.", "Jesus looks at you with tender eyes. Fold the purple cloak lying on the ground to show Him respect."),
    ]);
  }

  private foldCloak() {
    this.step = 2;
    this.cloak.setTexture("cloak_folded");
    this.sparkleBurst(CLOAK_AT[0], CLOAK_AT[1] - 6);
    this.talk(tx("Áo Choàng Tím", "The Purple Cloak"), "🟣", [
      tx("Con gấp chiếc áo choàng thật cẩn thận, như gấp một báu vật.", "You fold the cloak very carefully, like folding a treasure."),
      tx("Bọn lính coi đây là trò hề, nhưng với con, Chúa Giêsu mới là Vua đích thực của tình yêu và sự tha thứ. Hãy đến quỳ tôn vinh Người nhé.", "The soldiers take this as a joke, but to you Jesus is the true King of love and forgiveness. Go kneel and honor Him."),
    ]);
  }

  private honour() {
    this.step = 3;
    const [jx, jy] = JESUS_AT;
    const glow = this.add.image(jx, jy - 24, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.5);
    this.tweens.add({ targets: glow, alpha: 0.85, duration: 800, yoyo: true, repeat: -1 });
    this.cameras.main.flash(500, 255, 240, 200);
    this.sparkleBurst(jx, jy - 28);
    this.talk(
      "Con",
      "🙇",
      [
        tx("Con quỳ xuống trước mặt Chúa và thưa: 'Vạn tuế Chúa Giêsu, Vua của con, Vua của tình yêu và tha thứ!'", "You kneel before the Lord and say: ‘Hail Jesus, my King, King of love and forgiveness!’"),
        tx("Chúa Giêsu mỉm cười hiền hậu. Mão gai trên đầu Người là triều thiên của Vị Vua yêu thương đến cùng.", "Jesus smiles gently. The crown of thorns on His head is the crown of a King who loves to the end."),
      ],
      () => this.finish()
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        3,
        tx("Năm Sự Thương", "Sorrowful"),
        tx("Đức Chúa Giêsu Chịu Đội Mão Gai", "The Crowning with Thorns"),
        tx("Chịu đựng những hiểu lầm, khinh chê vì lòng trung thành với đức tin.", "Endure misunderstanding and scorn for the sake of faithfulness to your faith."),
        tx("Khi có người chê cười vì bạn đi lễ, đọc kinh, hãy mỉm cười và nhớ: Chúa Giêsu cũng từng bị nhạo báng vì yêu thương bạn!", "When someone laughs at you for going to Mass or praying, smile and remember: Jesus was mocked too because He loves you!"),
        ["clear_thorns", "fold_the_cloak", "honour_the_king"]
      )
    );
  }
}

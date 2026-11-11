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
const H = 880;
const SIDE = 120; // house bands on both sides of the street
const JESUS_AT: [number, number] = [320, 560];
const SIMON_AT: [number, number] = [250, 760];
const VERONICA_AT: [number, number] = [500, 350];
const MARY_AT: [number, number] = [452, 540];
const CLOTH_ID = "veronica_cloth";

export class Sorrowful04CrossScene extends InteractiveScene {
  private step = 0; // 0 Jesus has fallen, 1 Simon carries, 2 wipe the Holy Face, 3 done
  private jesus!: Phaser.GameObjects.Sprite;
  private simon!: Phaser.GameObjects.Sprite;

  constructor() {
    super("Sorrowful04CrossScene");
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
    this.step = 0;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildRoad();
    this.buildCharacters();
    this.defineInteractables();

    this.begin("thuong_04_vac_thap_gia", [320, 840], {
      speaker: "Via Dolorosa",
      emoji: "✝️",
      lines: [
        tx("Mầu Nhiệm Thứ Tư Năm Sự Thương: Đức Chúa Giêsu Vác Thập Giá Lên Đồi Can-vê (Lc 23, 26-32).", "Fourth Sorrowful Mystery: Jesus Carries the Cross to Calvary (Lk 23:26-32)."),
        tx("Con đường đá dốc đứng, bụi mù. Chúa Giêsu vác thập giá nặng nề và đã ngã quỵ giữa đường.", "The stone road is steep and dusty. Jesus carries the heavy cross and has collapsed along the way."),
        tx("Hãy thuyết phục ông Simon người Kyrênê giúp Chúa vác thập giá, rồi mang khăn của bà Veronica đến lau mặt cho Người nhé.", "Persuade Simon of Cyrene to help the Lord carry the cross, then bring Veronica's cloth to wipe His face."),
      ],
    });
  }

  // ---------- world ----------

  private buildRoad() {
    this.add.tileSprite(0, 0, W, H, "cobble_tile").setOrigin(0).setDepth(DEPTH.FLOOR).setTint(0xe0c9a0);
    this.add.tileSprite(0, 0, W, 130, "calvary_tile").setOrigin(0).setDepth(DEPTH.FLOOR + 0.5);
    this.add.tileSprite(SIDE, 130, W - SIDE * 2, 40, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR + 0.5).setTint(0xb5a080);
    this.edgeWalls(W, H);
    // dusty warm haze
    this.add.rectangle(0, 0, W, H, 0xd97706, 0.1).setOrigin(0).setDepth(DEPTH.FX - 5);
    // house bands left and right, y-sorted house fronts
    for (const x of [0, W - SIDE]) {
      this.add.tileSprite(x, 0, SIDE, H, "stone_wall").setOrigin(0).setDepth(1).setTint(0xd9c9a8);
      this.block(x + SIDE / 2, H / 2, SIDE, H);
    }
    for (const y of [220, 400, 590, 780]) {
      this.add.image(SIDE - 6, y, "house_front").setOrigin(1, 1).setDepth(y);
      this.add.image(W - SIDE + 6, y + 40, "house_front").setOrigin(0, 1).setDepth(y + 40).setFlipX(true);
    }
    this.add
      .text(500, 120, tx("ĐỒI CAN-VÊ", "CALVARY"), { fontFamily: "'Dearpix', monospace", fontSize: "20px", color: "#fef08a", resolution: 4 })
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.FX);
    this.prop(260, 130, "crucifix_thief", 14, 8).setTint(0x7a6a5c);
    this.prop(320, 118, "crucifix_jesus", 14, 8).setTint(0x7a6a5c);
    this.prop(380, 130, "crucifix_thief", 14, 8).setTint(0x7a6a5c);
    for (const [x, y] of [[190, 450], [450, 690], [200, 300], [440, 250]]) this.prop(x, y, "clay_jar", 10, 6);
    this.prop(180, 640, "market_stall", 52, 12);
    this.prop(456, 440, "crate", 18, 10);
  }

  private buildCharacters() {
    this.jesus = this.add.sprite(...JESUS_AT, "jesus_fallen").setOrigin(0.5, 1).setDepth(JESUS_AT[1]);
    this.block(JESUS_AT[0], JESUS_AT[1] - 6, 40, 12);
    this.hint(JESUS_AT[0], JESUS_AT[1] - 34);
    for (const x of [262, 380]) {
      this.add.sprite(x, JESUS_AT[1] - 26, "soldier").setOrigin(0.5, 1).setDepth(JESUS_AT[1] - 26);
      this.block(x, JESUS_AT[1] - 30, 14, 8);
    }
    this.add.sprite(...MARY_AT, "mary_sorrow").setOrigin(0.5, 1).setDepth(MARY_AT[1]);
    this.block(MARY_AT[0], MARY_AT[1] - 4, 14, 8);
    this.simon = this.add.sprite(...SIMON_AT, "simon").setOrigin(0.5, 1).setDepth(SIMON_AT[1]);
    this.walkers.push(this.simon);
    this.hint(SIMON_AT[0], SIMON_AT[1] - 38);
    for (const [key, x, y] of [["apostle_a", 198, 770], ["mourner", 212, 728], ["apostle_c", 300, 744], ["apostle_b", 168, 700]] as const) {
      this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 4, 14, 8);
    }
    this.add.sprite(...VERONICA_AT, "veronica").setOrigin(0.5, 1).setDepth(VERONICA_AT[1]);
    this.block(VERONICA_AT[0], VERONICA_AT[1] - 4, 14, 8);
    this.hint(VERONICA_AT[0], VERONICA_AT[1] - 38);
  }

  // ---------- interaction ----------

  private defineInteractables() {
    this.interactables = [
      {
        at: () => SIMON_AT,
        r: 48,
        label: () => tx("[A] Nói chuyện với ông Simon", "[A] Talk to Simon"),
        active: () => this.step === 0,
        act: () => this.askSimon(),
      },
      {
        at: () => [VERONICA_AT[0], VERONICA_AT[1] + 4],
        r: 48,
        label: () => tx("[A] Hỏi bà Veronica", "[A] Ask Veronica"),
        active: () => this.step === 1 && !this.held,
        act: () => this.veronica(),
      },
      {
        at: () => JESUS_AT,
        r: 56,
        label: () => (this.step === 2 ? tx("[A] Lau mặt cho Chúa", "[A] Wipe the Lord's face") : tx("[A] Nhìn Chúa Giêsu", "[A] Look at Jesus")),
        active: () => this.step < 3,
        act: () => this.jesusSpeaks(),
      },
      {
        at: () => MARY_AT,
        r: 44,
        label: () => tx("[A] Đức Mẹ Maria", "[A] Mother Mary"),
        active: () => this.step < 3,
        act: () =>
          this.talk(tx("Đức Mẹ Maria", "Mother Mary"), "💙", [
            tx("Đức Mẹ đứng lặng, nước mắt rơi, dõi theo Con yêu dấu. Mẹ không rời Chúa Giêsu một bước.", "Mary stands silently, tears falling, watching her beloved Son. She does not leave Jesus for a single step."),
            tx("'Con hãy giúp Con của Mẹ nhé.'", "‘Please help my Son.’"),
          ]),
      },
    ];
  }

  private askSimon() {
    this.talk(
      tx("Ông Simon", "Simon"),
      "🧔",
      [
        tx("Tôi chỉ là người từ đồng ruộng về, đứng ngơ ngác giữa đám đông này... Mọi người đang làm gì thế?", "I'm just a man coming from the fields, standing confused in this crowd... What is everyone doing?"),
        tx("Chúa Giêsu đã ngã quỵ dưới thập giá. Chúng con cần một người mạnh khỏe giúp Người. (Lc 23, 26)", "Jesus has collapsed under the cross. We need a strong man to help Him. (Lk 23:26)"),
      ],
      undefined,
      [
        { label: tx("Xin bác hãy giúp Chúa vác thập giá!", "Please help the Lord carry the cross!"), onSelect: () => this.simonHelps() },
        { label: tx("Thôi, bác cứ đi đường của bác.", "No, I'll just go on my way."), onSelect: () => this.talk(tx("Ông Simon", "Simon"), "🧔", [tx("Ừ... nhưng nhìn gương mặt mệt mỏi của vị Thầy kia, tôi thấy lòng nặng trĩu. Con còn muốn nhờ tôi giúp không?", "Well... but looking at that tired Teacher's face, my heart feels heavy. Do you still want my help?")]) },
      ]
    );
  }

  private simonHelps() {
    this.step = 1;
    this.talk(tx("Ông Simon", "Simon"), "🧔", [tx("Được rồi, nhà ngươi nói có lý. Để tôi ghé vai vác đỡ thập giá cho Người!", "All right, you make a good point. Let me put my shoulder to the cross for Him!")], () =>
      this.walk(this.simon, [[SIMON_AT[0] + 40, 640], [JESUS_AT[0] + 44, JESUS_AT[1] + 6]], () => {
        this.jesus.setTexture("jesus_carry").setPosition(JESUS_AT[0], JESUS_AT[1] - 2);
        this.sparkleBurst(JESUS_AT[0], JESUS_AT[1] - 24);
        this.talk("Con", "🙏", [
          tx("Ông Simon ghé vai vác thập giá, Chúa Giêsu đứng dậy được rồi. (Lc 23, 26)", "Simon puts his shoulder under the cross, and Jesus can stand up. (Lk 23:26)"),
          tx("Giờ con hãy đến hỏi bà Veronica ở bên đường: bà có chiếc khăn để lau mặt cho Chúa đấy.", "Now go ask Veronica by the roadside: she has a cloth to wipe the Lord's face."),
        ]);
      })
    );
  }

  private veronica() {
    this.talk(
      tx("Bà Veronica", "Veronica"),
      "👵",
      [tx("Tôi không chịu nổi khi thấy gương mặt Chúa đầy máu và mồ hôi. Con hãy cầm lấy khăn này, đem đến lau mặt cho Người nhé.", "I can't bear to see the Lord's face covered in blood and sweat. Take this cloth and bring it to wipe His face.")],
      () => {
        this.spawnLoot(CLOTH_ID, VERONICA_AT[0] - 24, VERONICA_AT[1] + 6, "cloth");
        this.takeLoot(CLOTH_ID);
        this.step = 2;
      }
    );
  }

  private jesusSpeaks() {
    if (this.step === 0) {
      this.talk(tx("Chúa Giêsu", "Jesus"), "✝️", [tx("Chúa Giêsu ngã quỵ trên đường đá, thập giá đè nặng trên vai. Người cần có người đỡ. Con hãy tìm ông Simon đứng giữa đám đông phía dưới nhé.", "Jesus has fallen on the stone road, the cross heavy on His shoulder. He needs someone to support Him. Find Simon in the crowd below.")]);
    } else if (this.step === 1) {
      this.talk(tx("Chúa Giêsu", "Jesus"), "✝️", [tx("Chúa Giêsu bước đi chậm chạp, mồ hôi đẫm trán. Hãy đến bà Veronica xin chiếc khăn để lau mặt cho Người.", "Jesus walks slowly, sweat soaking His forehead. Go to Veronica and ask for the cloth to wipe His face.")]);
    } else {
      this.wipe();
    }
  }

  private wipe() {
    this.step = 3;
    this.dropItem();
    this.sparkleBurst(JESUS_AT[0], JESUS_AT[1] - 28);
    this.cameras.main.flash(500, 255, 245, 210);
    const face = this.add.image(JESUS_AT[0], JESUS_AT[1] - 92, "holy_face").setDepth(DEPTH.FX).setAlpha(0);
    const glow = this.add.image(JESUS_AT[0], JESUS_AT[1] - 92, "glow_gold").setDepth(DEPTH.FX - 1).setAlpha(0);
    this.tweens.add({ targets: face, alpha: 1, duration: 1000, ease: "Stepped", easeParams: [5] });
    this.tweens.add({ targets: glow, alpha: 0.7, duration: 1000, yoyo: true, repeat: -1 });
    this.time.delayedCall(1200, () =>
      this.talk(
        tx("Thánh Nhan", "The Holy Face"),
        "🕊️",
        [
          tx("Con nhẹ nhàng lau mặt cho Chúa. Một việc nhỏ bé, nhưng tràn đầy yêu thương.", "You gently wipe the Lord's face. A small act, but full of love."),
          tx("Khi bỏ khăn xuống, trên đó hiện lên Thánh Nhan của Chúa Giêsu. Thiên Chúa luôn nhớ những việc tốt nhỏ bé của con.", "When you lower the cloth, the Holy Face of Jesus appears on it. God always remembers your small good deeds."),
          tx("'Mỗi lần anh em làm như thế cho một người bé nhỏ nhất, là anh em làm cho chính Thầy.' (Mt 25, 40)", "‘Whatever you did for one of these least brothers of mine, you did for me.’ (Mt 25:40)"),
        ],
        () => {
          this.tweens.add({ targets: [this.jesus, this.simon], y: "-=70", duration: 2200 });
          this.finish();
        }
      )
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        4,
        tx("Năm Sự Thương", "Sorrowful"),
        tx("Đức Chúa Giêsu Vác Thập Giá Lên Đồi Can-vê", "Jesus Carries the Cross to Calvary"),
        tx("Sẵn sàng vác thập giá đời mình mỗi ngày và giúp người khác vác gánh nặng của họ.", "Be ready to carry the cross of your own life each day and help others carry their burdens."),
        tx("Gặp ai đang mệt mỏi, buồn phiền, hãy ghé vai giúp họ như ông Simon và bà Veronica nhé!", "When you meet someone tired or sad, lend them a shoulder like Simon and Veronica!"),
        ["persuade_simon", "veronica_cloth", "holy_face"]
      )
    );
  }
}

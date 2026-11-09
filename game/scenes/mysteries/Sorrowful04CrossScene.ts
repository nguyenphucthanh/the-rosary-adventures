import * as Phaser from "phaser";
import { DEPTH } from "../BaseMysteryScene";
import { InteractiveScene } from "../InteractiveScene";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";
import { registerVisitationTextures } from "../../utils/visitationTextureGenerator";
import { registerInfancyTextures } from "../../utils/infancyTextureGenerator";
import { registerLightTextures } from "../../utils/lightTextureGenerator";
import { registerCanaTextures } from "../../utils/canaTextureGenerator";
import { registerGalileeTextures } from "../../utils/galileeTextureGenerator";
import { registerPassionTextures } from "../../utils/passionTextureGenerator";

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
        "Mầu Nhiệm Thứ Tư Năm Sự Thương: Đức Chúa Giêsu Vác Thập Giá Lên Đồi Can-vê (Lc 23, 26-32).",
        "Con đường đá dốc đứng, bụi mù. Chúa Giêsu vác thập giá nặng nề và đã ngã quỵ giữa đường.",
        "Hãy thuyết phục ông Simon người Kyrênê giúp Chúa vác thập giá, rồi mang khăn của bà Veronica đến lau mặt cho Người nhé.",
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
      .text(500, 120, "ĐỒI CAN-VÊ", { fontFamily: "'Dearpix', monospace", fontSize: "20px", color: "#fef08a", resolution: 4 })
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
        label: () => "[A] Nói chuyện với ông Simon",
        active: () => this.step === 0,
        act: () => this.askSimon(),
      },
      {
        at: () => [VERONICA_AT[0], VERONICA_AT[1] + 4],
        r: 48,
        label: () => "[A] Hỏi bà Veronica",
        active: () => this.step === 1 && !this.held,
        act: () => this.veronica(),
      },
      {
        at: () => JESUS_AT,
        r: 56,
        label: () => (this.step === 2 ? "[A] Lau mặt cho Chúa" : "[A] Nhìn Chúa Giêsu"),
        active: () => this.step < 3,
        act: () => this.jesusSpeaks(),
      },
      {
        at: () => MARY_AT,
        r: 44,
        label: () => "[A] Đức Mẹ Maria",
        active: () => this.step < 3,
        act: () =>
          this.talk("Đức Mẹ Maria", "💙", [
            "Đức Mẹ đứng lặng, nước mắt rơi, dõi theo Con yêu dấu. Mẹ không rời Chúa Giêsu một bước.",
            "'Con hãy giúp Con của Mẹ nhé.'",
          ]),
      },
    ];
  }

  private askSimon() {
    this.talk(
      "Ông Simon",
      "🧔",
      [
        "Tôi chỉ là người từ đồng ruộng về, đứng ngơ ngác giữa đám đông này... Mọi người đang làm gì thế?",
        "Chúa Giêsu đã ngã quỵ dưới thập giá. Chúng con cần một người mạnh khỏe giúp Người. (Lc 23, 26)",
      ],
      undefined,
      [
        { label: "Xin bác hãy giúp Chúa vác thập giá!", onSelect: () => this.simonHelps() },
        { label: "Thôi, bác cứ đi đường của bác.", onSelect: () => this.talk("Ông Simon", "🧔", ["Ừ... nhưng nhìn gương mặt mệt mỏi của vị Thầy kia, tôi thấy lòng nặng trĩu. Con còn muốn nhờ tôi giúp không?"]) },
      ]
    );
  }

  private simonHelps() {
    this.step = 1;
    this.talk("Ông Simon", "🧔", ["Được rồi, nhà ngươi nói có lý. Để tôi ghé vai vác đỡ thập giá cho Người!"], () =>
      this.walk(this.simon, [[SIMON_AT[0] + 40, 640], [JESUS_AT[0] + 44, JESUS_AT[1] + 6]], () => {
        this.jesus.setTexture("jesus_carry").setPosition(JESUS_AT[0], JESUS_AT[1] - 2);
        this.sparkleBurst(JESUS_AT[0], JESUS_AT[1] - 24);
        this.talk("Con", "🙏", [
          "Ông Simon ghé vai vác thập giá, Chúa Giêsu đứng dậy được rồi. (Lc 23, 26)",
          "Giờ con hãy đến hỏi bà Veronica ở bên đường: bà có chiếc khăn để lau mặt cho Chúa đấy.",
        ]);
      })
    );
  }

  private veronica() {
    this.talk(
      "Bà Veronica",
      "👵",
      ["Tôi không chịu nổi khi thấy gương mặt Chúa đầy máu và mồ hôi. Con hãy cầm lấy khăn này, đem đến lau mặt cho Người nhé."],
      () => {
        this.spawnLoot(CLOTH_ID, VERONICA_AT[0] - 24, VERONICA_AT[1] + 6, "cloth");
        this.takeLoot(CLOTH_ID);
        this.step = 2;
      }
    );
  }

  private jesusSpeaks() {
    if (this.step === 0) {
      this.talk("Chúa Giêsu", "✝️", ["Chúa Giêsu ngã quỵ trên đường đá, thập giá đè nặng trên vai. Người cần có người đỡ. Con hãy tìm ông Simon đứng giữa đám đông phía dưới nhé."]);
    } else if (this.step === 1) {
      this.talk("Chúa Giêsu", "✝️", ["Chúa Giêsu bước đi chậm chạp, mồ hôi đẫm trán. Hãy đến bà Veronica xin chiếc khăn để lau mặt cho Người."]);
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
        "Thánh Nhan",
        "🕊️",
        [
          "Con nhẹ nhàng lau mặt cho Chúa. Một việc nhỏ bé, nhưng tràn đầy yêu thương.",
          "Khi bỏ khăn xuống, trên đó hiện lên Thánh Nhan của Chúa Giêsu. Thiên Chúa luôn nhớ những việc tốt nhỏ bé của con.",
          "'Mỗi lần anh em làm như thế cho một người bé nhỏ nhất, là anh em làm cho chính Thầy.' (Mt 25, 40)",
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
        "Năm Sự Thương",
        "Đức Chúa Giêsu Vác Thập Giá Lên Đồi Can-vê",
        "Sẵn sàng vác thập giá đời mình mỗi ngày và giúp người khác vác gánh nặng của họ.",
        "Gặp ai đang mệt mỏi, buồn phiền, hãy ghé vai giúp họ như ông Simon và bà Veronica nhé!",
        ["persuade_simon", "veronica_cloth", "holy_face"]
      )
    );
  }
}

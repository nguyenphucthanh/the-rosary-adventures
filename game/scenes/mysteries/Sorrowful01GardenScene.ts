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
const H = 560;
const JESUS_AT: [number, number] = [300, 178];
const ROCK_AT: [number, number] = [356, 188];
const ANGEL_AT: [number, number] = [470, 190];
const BELL_AT: [number, number] = [320, 486];
const ROUNDS = 3;

const SLEEPERS = [
  { key: "peter", name: "Phêrô", at: [150, 340] as [number, number] },
  { key: "james", name: "Giacôbê", at: [320, 392] as [number, number] },
  { key: "john_apostle", name: "Gioan", at: [490, 340] as [number, number] },
];

const ROUND_LINES = [
  ["Chúa Giêsu trở lại, thấy các môn đệ ngủ, liền nói với Phêrô:", "'Anh em không thể thức với Thầy một giờ sao? Hãy tỉnh thức và cầu nguyện, để khỏi sa chước cám dỗ.' (Mt 26, 40-41)", "Các môn đệ buồn ngủ quá, lại thiếp đi rồi. Con hãy rung chuông đánh thức họ lần nữa nhé."],
  ["Chúa Giêsu lại cầu nguyện: 'Lạy Cha, nếu con không thể tránh chén này mà không uống, thì xin cứ theo ý Cha.' (Mt 26, 42)", "Các môn đệ mắt nặng trĩu, lại thiếp đi. Con hãy đánh thức họ lần thứ ba."],
];

export class Sorrowful01GardenScene extends InteractiveScene {
  private round = 0;
  private asleep = new Set<number>();
  private step = 0; // 0 get bell, 1 stay awake, 2 chalice, 3 done
  private sleepers: Phaser.GameObjects.Sprite[] = [];
  private zs: Phaser.GameObjects.Text[] = [];
  private angel?: Phaser.GameObjects.Sprite;
  private chalice?: Phaser.GameObjects.Image;

  constructor() {
    super("Sorrowful01GardenScene");
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
    this.round = 0;
    this.step = 0;
    this.asleep = new Set();
    this.sleepers = [];
    this.zs = [];
    this.angel = this.chalice = undefined;

    if (!this.anims.exists("garden_angel")) {
      this.anims.create({ key: "garden_angel", frames: this.anims.generateFrameNumbers("archangel_gabriel", { frames: [0, 1] }), frameRate: 2, repeat: -1 });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildGarden();
    this.buildCharacters();
    this.defineInteractables();

    this.begin("thuong_01_vuon_cay_dau", [320, 524], {
      speaker: "Vườn Giếtsêmani",
      emoji: "🌙",
      lines: [
        "Mầu Nhiệm Thứ Nhất Năm Sự Thương: Đức Chúa Giêsu Cầu Nguyện Trong Vườn Cây Dầu (Lc 22, 39-46).",
        "Đêm tối tĩnh mịch, gió rít qua những cành ôliu già. Chúa Giêsu quỳ cầu nguyện, còn ba môn đệ thì ngủ gục dưới gốc cây.",
        "Hãy nhặt chiếc chuông nhỏ gần chỗ con đứng, rồi rung chuông đánh thức Phêrô, Giacôbê và Gioan nhé.",
      ],
    });
  }

  // ---------- world ----------

  private buildGarden() {
    this.add.tileSprite(0, 0, W, H, "dark_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(256, 120, 128, H - 120, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR).setTint(0x6b7280);
    this.edgeWalls(W, H);
    // night: flat blue wash, moon, a few twinkling stars
    this.add.rectangle(0, 0, W, H, 0x0b1030, 0.38).setOrigin(0).setDepth(DEPTH.FX - 5);
    const moonGlow = this.add.image(560, 54, "glow_gold").setDepth(DEPTH.FX - 4).setAlpha(0.35);
    this.tweens.add({ targets: moonGlow, alpha: 0.5, duration: 2200, yoyo: true, repeat: -1 });
    this.add.image(560, 54, "moon").setDepth(DEPTH.FX - 3);
    for (const [x, y] of [[60, 40], [150, 70], [240, 30], [380, 60], [450, 30], [610, 110], [40, 130]]) {
      const s = this.add.image(x, y, "sparkle").setDepth(DEPTH.FX - 3).setAlpha(0.7);
      this.tweens.add({ targets: s, alpha: 0.15, duration: 900 + x, yoyo: true, repeat: -1 });
    }
    for (const [x, y] of [[60, 130], [590, 150], [50, 300], [596, 300], [64, 470], [586, 480], [190, 96], [450, 96]]) this.prop(x, y, "olive", 16, 8);
    for (const [x, y] of [[120, 240], [540, 250], [200, 470], [450, 470]]) this.prop(x, y, "boulder", 24, 8);
    for (const [x, y] of [[230, 300], [420, 450], [100, 420], [560, 400]]) this.add.image(x, y, "flower_w").setOrigin(0.5, 1).setDepth(y);
    this.prop(ROCK_AT[0], ROCK_AT[1] + 4, "prayer_rock", 40, 10);
  }

  private buildCharacters() {
    this.add.sprite(...JESUS_AT, "jesus_kneel").setOrigin(0.5, 1).setDepth(JESUS_AT[1]);
    const glow = this.add.image(JESUS_AT[0], JESUS_AT[1] - 20, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.3);
    this.tweens.add({ targets: glow, alpha: 0.5, duration: 1500, yoyo: true, repeat: -1 });
    SLEEPERS.forEach((s) => {
      const sp = this.add.sprite(s.at[0], s.at[1], s.key).setOrigin(0.5, 1).setDepth(s.at[1]);
      this.block(s.at[0], s.at[1] - 4, 14, 8);
      this.sleepers.push(sp);
      const z = this.add
        .text(s.at[0] + 10, s.at[1] - 40, "z Z", { fontFamily: "'Dearpix', monospace", fontSize: "10px", color: "#bfdbfe", resolution: 4 })
        .setDepth(DEPTH.FX)
        .setVisible(false);
      this.tweens.add({ targets: z, y: z.y - 4, duration: 800, yoyo: true, repeat: -1, ease: "Stepped" });
      this.zs.push(z);
    });
  }

  private defineInteractables() {
    this.spawnLoot("bell", ...BELL_AT);
    this.interactables = [
      {
        at: () => BELL_AT,
        r: 34,
        label: () => "[A] Nhặt chuông nhỏ",
        active: () => this.step === 0 && this.lootActive("bell"),
        act: () => {
          this.takeLoot("bell");
          this.step = 1;
          this.startRound();
        },
      },
      ...SLEEPERS.map((s, i) => ({
        at: (): [number, number] => s.at,
        r: 40,
        label: () => `[A] Rung chuông đánh thức ${s.name}`,
        active: () => this.asleep.has(i),
        act: () => this.wake(i),
      })),
      {
        at: () => JESUS_AT,
        r: 52,
        label: () => "[A] Lắng nghe Chúa cầu nguyện",
        active: () => this.step < 3,
        act: () =>
          this.talk("Chúa Giêsu", "🙏", [
            "'Lạy Cha, nếu Cha muốn, xin cất chén này khỏi con. Tuy nhiên, xin đừng theo ý con, mà xin theo ý Cha.' (Lc 22, 42)",
            "Người đau đớn lo sợ, mồ hôi như những giọt máu rơi xuống đất. Con hãy ở lại tỉnh thức với Người nhé. (Lc 22, 44)",
          ]),
      },
      {
        at: () => [ANGEL_AT[0], ANGEL_AT[1] + 22],
        r: 44,
        label: () => "[A] Nhận chén vâng phục",
        active: () => this.step === 2 && this.lootActive("chalice"),
        act: () => this.takeLoot("chalice"),
      },
      {
        at: () => [ROCK_AT[0], ROCK_AT[1] + 22],
        r: 44,
        label: () => "[A] Đặt chén lên phiến đá",
        active: () => this.step === 2 && !this.chalice,
        act: () => this.placeChalice(),
      },
    ];
  }

  // ---------- quest ----------

  private startRound() {
    SLEEPERS.forEach((_, i) => {
      this.asleep.add(i);
      this.sleepers[i].setTint(0x6b7bb0);
      this.zs[i].setVisible(true);
    });
  }

  private wake(i: number) {
    if (this.held?.id !== "bell") {
      this.talk(SLEEPERS[i].name, "😴", ["Zzz... Con hãy nhặt chiếc chuông nhỏ rồi rung để đánh thức tôi nhé."]);
      return;
    }
    this.asleep.delete(i);
    this.sleepers[i].clearTint();
    this.zs[i].setVisible(false);
    const [x, y] = SLEEPERS[i].at;
    this.sparkleBurst(x, y - 20);
    const ring = this.add
      .text(x, y - 44, "Ting!", { fontFamily: "'Dearpix', monospace", fontSize: "10px", color: "#fef08a", resolution: 4 })
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.FX);
    this.tweens.add({ targets: ring, y: ring.y - 10, alpha: 0, duration: 900, onComplete: () => ring.destroy() });
    if (this.asleep.size > 0) return;
    this.round++;
    if (this.round < ROUNDS) {
      this.talk("Chúa Giêsu", "🙏", ROUND_LINES[this.round - 1], () => this.time.delayedCall(1200, () => this.startRound()));
    } else {
      this.time.delayedCall(500, () => this.angelAppears());
    }
  }

  private angelAppears() {
    this.step = 2;
    this.dropItem();
    this.talk(
      "Chúa Giêsu",
      "🙏",
      ["Lần này các môn đệ đã thức cùng Chúa. Chúa Giêsu cầu nguyện thiết tha hơn nữa. (Lc 22, 44)", "Bỗng có một thiên thần từ trời hiện ra, thêm sức cho Người. (Lc 22, 43)"],
      () => {
        this.cameras.main.flash(500, 255, 245, 200);
        this.angel = this.add.sprite(ANGEL_AT[0], ANGEL_AT[1] - 8, "archangel_gabriel").setOrigin(0.5, 1).setDepth(ANGEL_AT[1]).setAlpha(0).play("garden_angel");
        this.tweens.add({ targets: this.angel, alpha: 1, duration: 900, ease: "Stepped", easeParams: [5] });
        const g = this.add.image(ANGEL_AT[0], ANGEL_AT[1] - 24, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.5);
        this.tweens.add({ targets: g, alpha: 0.8, duration: 800, yoyo: true, repeat: -1 });
        this.spawnLoot("chalice", ANGEL_AT[0], ANGEL_AT[1] + 22, "chalice_empty");
        this.talk("Thiên Thần", "👼", ["Hãy cầm lấy chén vâng phục này, đặt lên phiến đá bên cạnh Chúa để an ủi Người nhé."]);
      }
    );
  }

  private placeChalice() {
    if (this.held?.id !== "chalice") {
      this.talk("Phiến Đá", "🪨", ["Phiến đá này đang chờ chén vâng phục của thiên thần. Con hãy đến nhận chén rồi mang lại đây nhé."]);
      return;
    }
    this.dropItem();
    this.step = 3;
    this.chalice = this.add.image(ROCK_AT[0], ROCK_AT[1] - 14, "chalice_empty").setOrigin(0.5, 1).setDepth(ROCK_AT[1] + 6);
    this.sparkleBurst(ROCK_AT[0], ROCK_AT[1] - 24);
    this.talk(
      "Chúa Giêsu",
      "🙏",
      [
        "Chúa Giêsu cầm lấy chén vâng phục và thưa cùng Cha: 'Lạy Cha, xin đừng theo ý con, mà xin theo ý Cha.' (Lc 22, 42)",
        "Đứng dậy, Người nói với các môn đệ: 'Anh em hãy chỗi dậy, chúng ta đi nào!' (Mt 26, 46)",
      ],
      () => this.finish()
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        1,
        "Năm Sự Thương",
        "Đức Chúa Giêsu Cầu Nguyện Trong Vườn Cây Dầu",
        "Tỉnh thức, cầu nguyện và vâng phục ý Chúa trong mọi nghịch cảnh.",
        "Khi buồn khổ hay sợ hãi, hãy nói với Cha trên trời như Chúa Giêsu: 'Xin theo ý Cha'. Cha luôn ở bên bạn!",
        ["ring_bell_3_rounds", "angel_chalice", "obey_the_father"]
      )
    );
  }
}

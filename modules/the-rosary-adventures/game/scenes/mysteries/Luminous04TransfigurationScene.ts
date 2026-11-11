import * as Phaser from "phaser";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { registerLightTextures } from "@/modules/the-rosary-adventures/game/utils/lightTextureGenerator";
import { registerGalileeTextures } from "@/modules/the-rosary-adventures/game/utils/galileeTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 720;
const SUMMIT_Y = 236; // above this the player has reached the top
const JESUS_AT: [number, number] = [320, 178];
const MOSES_AT: [number, number] = [252, 164];
const ELIJAH_AT: [number, number] = [388, 164];

/** Mist bands (y, height) the torches burn away, bottom to top. */
const BANDS: [number, number][] = [[500, 80], [380, 80], [260, 70]];
const TORCHES: [number, number][] = [[200, 625], [440, 490], [200, 375]];
/** Tent sites: each wants one symbol. */
const SITES = [
  { x: 170, y: 118, item: "icon_tablet", label: tx("Môsê", "Moses"), name: tx("bia Luật", "Tablet of the Law") },
  { x: 320, y: 100, item: "icon_cross", label: tx("Thiên Chúa", "God"), name: tx("thánh giá vàng", "golden cross") },
  { x: 470, y: 118, item: "icon_flame", label: tx("Êlia", "Elijah"), name: tx("ngọn lửa ngôn sứ", "prophetic flame") },
];
const SYMBOLS: [string, number, number][] = [["icon_tablet", 90, 226], ["icon_cross", 550, 226], ["icon_flame", 320, 244]];

export class Luminous04TransfigurationScene extends InteractiveScene {
  private lit = new Set<number>();
  private mist: { rect: Phaser.GameObjects.Rectangle; wall: Phaser.GameObjects.Rectangle }[] = [];
  private torchSprites: Phaser.GameObjects.Image[] = [];
  private placed = new Set<number>();
  private summit = false;
  private tentsOn = false;
  private finished = false;

  constructor() {
    super("Luminous04TransfigurationScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerLightTextures(this);
    registerGalileeTextures(this);
    this.resetCarry();
    this.walkers = [];
    this.lit = new Set();
    this.placed = new Set();
    this.mist = [];
    this.torchSprites = [];
    this.summit = this.tentsOn = this.finished = false;

    if (!this.anims.exists("torch_burn")) {
      this.anims.create({ key: "torch_burn", frames: this.anims.generateFrameNumbers("torch_lit", { frames: [0, 1] }), frameRate: 6, repeat: -1 });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildMountain();
    this.buildMist();
    this.buildSummit();
    this.buildCharacters();
    this.defineInteractables();

    this.begin("sang_04_bien_hinh", [320, 684], {
      speaker: tx("Núi Tabor", "Mount Tabor"),
      emoji: "☀️",
      lines: [
        tx("Mầu Nhiệm Thứ Tư Năm Sự Sáng: Đức Chúa Giêsu Biến Hình Trên Núi Tabor (Mt 17, 1-8).", "Fourth Luminous Mystery: The Transfiguration of Jesus on Mount Tabor (Mt 17:1-8)."),
        tx("Chúa dẫn Phêrô, Giacôbê và Gioan lên núi cao. Sương mù dày che kín lối đi.", "Jesus leads Peter, James and John up a high mountain. Thick fog hides the path."),
        tx("Hãy thắp ba ngọn đuốc cổ để xua tan sương mù và leo lên đỉnh núi nhé!", "Light the three ancient torches to clear the fog and climb to the summit!"),
      ],
    });
  }

  // ---------- world ----------

  private buildMountain() {
    this.add.tileSprite(0, 0, W, H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(160, 0, 320, H, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.edgeWalls(W, H);
    // sunset: flat warm wash + sun glow
    this.add.rectangle(0, 0, W, H, 0xf97316, 0.1).setOrigin(0).setDepth(DEPTH.FX - 5);
    const sun = this.add.image(W - 70, 40, "glow_gold").setDepth(DEPTH.FX - 4).setAlpha(0.6);
    this.tweens.add({ targets: sun, alpha: 0.9, duration: 1800, yoyo: true, repeat: -1 });
    // rocks and wind-bent trees along the slope
    for (let i = 0; i < 9; i++) {
      const y = 300 + i * 46;
      this.prop(i % 2 ? 560 + (i % 3) * 14 : 70 + (i % 3) * 14, y, "boulder", 26, 8);
    }
    for (const [x, y] of [[40, 220], [600, 230], [50, 480], [596, 520], [44, 690], [602, 696]]) this.prop(x, y, "hill_tree", 12, 8);
    for (const [x, y] of [[130, 560], [500, 420], [140, 300], [510, 640]]) this.add.image(x, y, "flower_y").setOrigin(0.5, 1).setDepth(y);
  }

  private buildMist() {
    BANDS.forEach(([y, h]) => {
      const rect = this.add.rectangle(0, y, W, h, 0xffffff, 0.7).setOrigin(0).setDepth(DEPTH.FX - 3);
      this.tweens.add({ targets: rect, alpha: 0.55, duration: 1500, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [4] });
      const wall = this.add.rectangle(W / 2, y + h / 2, W, h);
      this.obstacles.add(wall);
      this.mist.push({ rect, wall });
    });
  }

  private buildSummit() {
    for (const s of SITES) {
      this.add.image(s.x, s.y, "tent_site").setDepth(DEPTH.RUG + 1);
      this.add
        .text(s.x, s.y - 18, s.label, { fontFamily: "'Dearpix', monospace", fontSize: "20px", color: "#fef08a", resolution: 4 })
        .setOrigin(0.5, 1)
        .setDepth(DEPTH.FX);
    }
    // torches
    TORCHES.forEach(([x, y]) => {
      const t = this.add.image(x, y, "torch_unlit").setOrigin(0.5, 1).setDepth(y);
      this.torchSprites.push(t);
      this.block(x, y - 3, 8, 6);
      this.hint(x, y - 36);
    });
  }

  private buildCharacters() {
    const person = (key: string, x: number, y: number) => this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
    person("jesus_adult", ...JESUS_AT);
    person("peter", 242, 214);
    person("james", 320, 232);
    person("john_apostle", 398, 214);
    this.hint(242, 176);
  }

  // ---------- interaction ----------

  private defineInteractables() {
    this.interactables = [
      ...TORCHES.map(([x, y], i) => ({
        at: (): [number, number] => [x, y],
        r: 36,
        label: () => tx("[A] Thắp đuốc", "[A] Light the torch"),
        active: () => !this.lit.has(i),
        act: () => this.lightTorch(i),
      })),
      ...SYMBOLS.map(([id, x, y]) => ({
        at: (): [number, number] => [x, y],
        r: 32,
        label: () => tx("[A] Nhặt biểu tượng", "[A] Pick up the symbol"),
        active: () => this.tentsOn && this.lootActive(id),
        act: () => this.takeLoot(id),
      })),
      ...SITES.map((s, i) => ({
        at: (): [number, number] => [s.x, s.y + 14],
        r: 40,
        label: () => (this.held ? tx(`[A] Đặt vào lều ${s.label}`, `[A] Place in the ${s.label} tent`) : tx(`[A] Lều ${s.label}`, `[A] ${s.label} tent`)),
        active: () => this.tentsOn && !this.placed.has(i),
        act: () => this.placeSymbol(i),
      })),
      {
        at: (): [number, number] => [242, 214],
        r: 44,
        label: () => tx("[A] Trò chuyện với Phêrô", "[A] Talk to Peter"),
        active: () => this.summit && !this.finished,
        act: () =>
          this.talk(tx("Thánh Phêrô", "Saint Peter"), "🎣", [
            this.tentsOn
              ? tx("Xin giúp con dựng ba lều: một cho Thầy, một cho Môsê, một cho Êlia. Hãy đặt đúng biểu tượng vào từng lều nhé. (Mt 17, 4)", "Please help me set up three tents: one for You, one for Moses, one for Elijah. Place the right symbol in each tent. (Mt 17:4)")
              : tx("Con sợ quá...", "I'm so scared..."),
          ]),
      },
    ];
  }

  private lightTorch(i: number) {
    this.lit.add(i);
    const [x, y] = TORCHES[i];
    this.torchSprites[i].destroy();
    this.add.sprite(x, y, "torch_lit").setOrigin(0.5, 1).setDepth(y).play("torch_burn");
    const glow = this.add.image(x, y - 20, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.5);
    this.tweens.add({ targets: glow, alpha: 0.8, duration: 700, yoyo: true, repeat: -1 });
    this.sparkleBurst(x, y - 20);
    const { rect, wall } = this.mist[i];
    this.obstacles.remove(wall, true, true);
    this.tweens.killTweensOf(rect);
    this.tweens.add({ targets: rect, alpha: 0, duration: 900, ease: "Stepped", easeParams: [5], onComplete: () => rect.destroy() });
    if (this.lit.size === TORCHES.length) {
      this.time.delayedCall(900, () => this.talk(tx("Núi Tabor", "Mount Tabor"), "☀️", [tx("Sương mù đã tan! Con đường lên đỉnh núi đã sáng.", "The fog has cleared! The path to the summit is bright."), tx("Hãy leo lên gặp Chúa Giêsu và ba môn đệ nhé.", "Climb up to meet Jesus and the three disciples.")]));
    }
  }

  update() {
    super.update();
    if (!this.summit && this.player && this.player.y < SUMMIT_Y) {
      this.summit = true;
      this.talk(
        tx("Thánh Phêrô", "Saint Peter"),
        "🎣",
        [
          tx("Chúa Giêsu biến đổi hình dạng trước mặt các môn đệ: mặt Người chói lọi như mặt trời, áo Người trắng như ánh sáng. (Mt 17, 2)", "Jesus was transfigured before the disciples: His face shone like the sun and His clothes became white as light. (Mt 17:2)"),
          tx("Môsê và Êlia hiện ra đàm đạo với Người. 'Thưa Thầy, chúng con ở đây thật tốt! Xin dựng ba lều.' (Mt 17, 3-4)", "Moses and Elijah appear and talk with Him. ‘Lord, it is good for us to be here! Let us make three tents.’ (Mt 17:3-4)"),
          tx("Hãy nhặt ba biểu tượng trên đỉnh núi và đặt vào ba lều: bia Luật cho Môsê, ngọn lửa cho Êlia, thánh giá vàng cho Thiên Chúa.", "Pick up the three symbols on the summit and place them in the three tents: the Tablet of the Law for Moses, the flame for Elijah, the golden cross for God."),
        ],
        () => {
          this.tentsOn = true;
          for (const [id, x, y] of SYMBOLS) this.spawnLoot(id, x, y);
        }
      );
    }
  }

  private placeSymbol(i: number) {
    const s = SITES[i];
    if (!this.held) {
      this.talk(tx("Lều ", "Tent ") + s.label, "⛺", [tx(`Lều này chờ ${s.name}. Hãy nhặt biểu tượng trên đỉnh núi mang đến nhé.`, `This tent is waiting for ${s.name}. Pick up the symbol on the summit and bring it here.`)]);
      return;
    }
    if (this.held.id !== s.item) {
      this.talk(tx("Lều ", "Tent ") + s.label, "⛺", [tx(`Chưa đúng rồi. Lều của ${s.label} cần ${s.name}.`, `Not right. The ${s.label} tent needs ${s.name}.`)]);
      return;
    }
    this.placed.add(i);
    this.dropItem();
    this.add.image(s.x, s.y + 8, "tent").setOrigin(0.5, 1).setDepth(s.y + 8);
    this.add.image(s.x, s.y - 12, s.item).setDepth(DEPTH.FX - 6);
    this.sparkleBurst(s.x, s.y - 8);
    if (this.placed.size === SITES.length) this.time.delayedCall(900, () => this.transfigure());
  }

  private transfigure() {
    this.finished = true;
    const cam = this.cameras.main;
    cam.flash(700, 255, 255, 255);
    const [jx, jy] = JESUS_AT;
    for (const [dx, dy, a] of [[0, -22, 0.8], [-10, -10, 0.5], [10, -10, 0.5]] as const) {
      const g = this.add.image(jx + dx, jy + dy, "glow_gold").setDepth(DEPTH.FX - 2).setAlpha(a);
      this.tweens.add({ targets: g, alpha: a * 0.5, duration: 700, yoyo: true, repeat: -1 });
    }
    for (const [key, [x, y]] of [["moses", MOSES_AT], ["elijah", ELIJAH_AT]] as const) {
      const s = this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y).setAlpha(0);
      this.tweens.add({ targets: s, alpha: 1, duration: 1000, ease: "Stepped", easeParams: [5] });
    }
    const cloud = this.add.image(jx, 20, "cloud_big").setDepth(DEPTH.FX - 1).setAlpha(0);
    this.tweens.add({ targets: cloud, alpha: 0.95, y: 60, duration: 1600, ease: "Stepped", easeParams: [8] });
    this.time.delayedCall(2000, () =>
      this.talk(
        tx("Tiếng Từ Đám Mây", "The Voice from the Cloud"),
        "☁️",
        [tx("Một đám mây sáng ngời bao phủ các ngài, và có tiếng phán: (Mt 17, 5)", "A bright cloud covers them, and a voice says: (Mt 17:5)"), tx("'Đây là Con yêu dấu của Ta, Ta hài lòng về Người. Hãy vâng nghe lời Người!'", "‘This is my beloved Son, with whom I am well pleased. Listen to Him!’")],
        () => this.finish()
      )
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        4,
        tx("Năm Sự Sáng", "Luminous"),
        tx("Đức Chúa Giêsu Biến Hình Trên Núi Tabor", "The Transfiguration of Jesus on Mount Tabor"),
        tx("Say mê lắng nghe Lời Chúa và chiêm ngắm vinh quang Nước Trời.", "Listen eagerly to God's Word and contemplate the glory of the Kingdom."),
        tx("Hãy dành thời gian lắng nghe Chúa Giêsu mỗi ngày, vì Người là Con yêu dấu của Cha!", "Make time to listen to Jesus every day, because He is the Father's beloved Son!"),
        ["light_torches", "three_tents", "hear_the_voice"]
      )
    );
  }
}

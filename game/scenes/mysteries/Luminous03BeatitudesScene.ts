import { DEPTH } from "../BaseMysteryScene";
import { InteractiveScene } from "../InteractiveScene";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";
import { registerVisitationTextures } from "../../utils/visitationTextureGenerator";
import { registerInfancyTextures } from "../../utils/infancyTextureGenerator";
import { registerLightTextures } from "../../utils/lightTextureGenerator";
import { registerGalileeTextures } from "../../utils/galileeTextureGenerator";

const W = 640;
const H = 640;
const LAKE_H = 112;
const ROCK: [number, number] = [320, 220];
const JESUS_AT: [number, number] = [320, 181]; // on top of the rock (top edge y=176)

const NEEDY = [
  {
    sprite: "mourner", item: "icon_hope", at: [150, 540] as [number, number], name: "Người Khóc Than", emoji: "😢",
    plight: "Tôi vừa mất người thân, lòng tôi đau buồn lắm. Tôi cần một niềm hy vọng. (Mt 5, 4)",
    thanks: "Cảm ơn con! Chúa nói: 'Phúc thay ai sầu khổ, vì họ sẽ được Thiên Chúa ủi an.' (Mt 5, 4)",
  },
  {
    sprite: "hungry", item: "icon_bread", at: [320, 556] as [number, number], name: "Người Nghèo Đói", emoji: "🥖",
    plight: "Mấy ngày nay tôi chưa có gì bỏ bụng. Tôi cần chút bánh để sống. (Mt 5, 3.6)",
    thanks: "Cảm ơn con! 'Phúc thay ai đói khát nên công chính, vì họ sẽ được no thỏa.' (Mt 5, 6)",
  },
  {
    sprite: "prisoner", item: "icon_peace", at: [490, 540] as [number, number], name: "Người Bị Bắt Bớ", emoji: "🕊️",
    plight: "Tôi bị người ta xua đuổi, bắt bớ chỉ vì sống ngay lành. Tôi cần bình an. (Mt 5, 10)",
    thanks: "Cảm ơn con! 'Phúc thay ai bị bách hại vì sống công chính, vì Nước Trời là của họ.' (Mt 5, 10)",
  },
];
const ITEMS: [string, number, number][] = [["icon_hope", 110, 400], ["icon_bread", 530, 380], ["icon_peace", 320, 440]];
const ITEM_NAME: Record<string, string> = { icon_hope: "niềm hy vọng", icon_bread: "bánh sẻ chia", icon_peace: "chim bồ câu bình an" };

export class Luminous03BeatitudesScene extends InteractiveScene {
  private helped = new Set<string>();
  private finished = false;

  constructor() {
    super("Luminous03BeatitudesScene");
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
    this.helped = new Set();
    this.finished = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildHill();
    this.buildCharacters();
    for (const [id, x, y] of ITEMS) this.spawnLoot(id, x, y);
    this.defineInteractables();

    this.begin("sang_03_rao_giang", [320, 610], {
      speaker: "Đồi Bát Phúc",
      emoji: "🏔️",
      lines: [
        "Mầu Nhiệm Thứ Ba Năm Sự Sáng: Đức Chúa Giêsu Rao Giảng Nước Trời Và Kêu Gọi Sám Hối (Mc 1, 14-15; Mt 5–7).",
        "Dưới chân đồi có ba người đang đau khổ. Hãy nhặt các món quà Lời Chúa trên đồi và trao đúng người cần nhé!",
      ],
    });
  }

  private buildHill() {
    this.add.tileSprite(0, 0, W, H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(256, LAKE_H, 128, H - LAKE_H, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.edgeWalls(W, H);

    // Lake of Galilee along the top
    const water = this.add.tileSprite(0, 0, W, LAKE_H, "water_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, LAKE_H - 4, W, 4, 0xe0f2fe).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.time.addEvent({ delay: 140, loop: true, callback: () => (water.tilePositionX = (water.tilePositionX + 1) % 16) });
    this.block(W / 2, (LAKE_H - 8) / 2, W, LAKE_H - 8);
    for (let x = 12; x < W; x += 40) this.add.image(x + (x % 3) * 4, LAKE_H, "reed").setOrigin(0.5, 1).setDepth(LAKE_H);

    // sun + soft flat beams
    const sun = this.add.image(W - 80, 30, "glow_gold").setDepth(DEPTH.FX - 1).setAlpha(0.5);
    this.tweens.add({ targets: sun, alpha: 0.8, duration: 1600, yoyo: true, repeat: -1 });
    const beams = this.add.graphics().setDepth(3).fillStyle(0xfef9c3, 0.1);
    beams.fillPoints([{ x: 520, y: 0 }, { x: 560, y: 0 }, { x: 430, y: 330 }, { x: 390, y: 330 }], true);

    // the preaching rock
    this.prop(ROCK[0], ROCK[1], "preach_rock", 56, 16);

    // hillside decor: trees, boulders, flowers
    for (const [x, y] of [[50, 170], [590, 180], [60, 330], [584, 340], [44, 620], [600, 624]]) this.prop(x, y, "hill_tree", 12, 8);
    for (const [x, y] of [[130, 200], [510, 210], [200, 330], [450, 320]]) this.prop(x, y, "boulder", 26, 8);
    for (let i = 0; i < 16; i++) {
      const x = 30 + ((i * 97) % 580);
      const y = 170 + ((i * 53) % 440);
      if (x > 240 && x < 400) continue;
      this.add.image(x, y, (["flower_w", "flower_p", "flower_y"] as const)[i % 3]).setOrigin(0.5, 1).setDepth(y);
    }
  }

  private buildCharacters() {
    const person = (key: string, x: number, y: number) => this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
    person("jesus_adult", ...JESUS_AT).setDepth(ROCK[1] + 1);
    this.hint(JESUS_AT[0], JESUS_AT[1] - 38);
    person("peter", 262, 246);
    person("andrew", 378, 246);
    // listening crowd
    for (const [k, x, y] of [["shepherd", 210, 470], ["scribe", 430, 480], ["merchant", 90, 470], ["sweeper", 560, 470], ["shepherd", 380, 400], ["merchant", 250, 380]] as const) person(k, x, y);
    for (const n of NEEDY) {
      person(n.sprite, ...n.at);
      this.hint(n.at[0], n.at[1] - 34);
    }
  }

  private defineInteractables() {
    const need = (n: (typeof NEEDY)[number]) => ({
      at: () => n.at,
      r: 46,
      label: () => (this.held ? `[A] Trao cho ${n.name}` : `[A] Trò chuyện với ${n.name}`),
      active: () => !this.helped.has(n.item),
      act: () => this.give(n),
    });
    this.interactables = [
      ...ITEMS.map(([id]) => ({
        at: () => this.lootPos(id),
        r: 30,
        label: () => `[A] Nhặt ${ITEM_NAME[id]}`,
        active: () => this.lootActive(id),
        act: () => this.takeLoot(id),
      })),
      ...NEEDY.map(need),
      {
        at: () => JESUS_AT,
        r: 56,
        label: () => "[A] Trò chuyện với Chúa Giêsu",
        active: () => !this.finished,
        act: () => this.jesus(),
      },
    ];
  }

  private lootPos(id: string): [number, number] {
    const i = ITEMS.find((t) => t[0] === id)!;
    return [i[1], i[2]];
  }

  private give(n: (typeof NEEDY)[number]) {
    if (!this.held) {
      this.talk(n.name, n.emoji, [n.plight, "Hãy nhặt một món quà Lời Chúa trên đồi mang đến cho tôi nhé."]);
      return;
    }
    if (this.held.id !== n.item) {
      this.talk(n.name, n.emoji, [`Cảm ơn con, nhưng ${ITEM_NAME[this.held.id]} chưa phải điều tôi đang cần.`, "Thử món quà khác nhé."]);
      return;
    }
    this.helped.add(n.item);
    this.dropItem();
    this.sparkleBurst(n.at[0], n.at[1] - 16);
    const done = this.helped.size === NEEDY.length;
    this.talk(n.name, n.emoji, [n.thanks, ...(done ? ["Cả ba người đã được an ủi! Hãy lên đồi gặp Chúa Giêsu nhé."] : [])]);
  }

  private jesus() {
    if (this.helped.size < NEEDY.length) {
      this.talk("Chúa Giêsu", "✨", [`Hãy an ủi những người đang đau khổ dưới chân đồi trước nhé. Đã có ${this.helped.size}/${NEEDY.length} người được giúp.`]);
      return;
    }
    this.talk(
      "Chúa Giêsu",
      "✨",
      [
        "'Phúc thay ai có tâm hồn nghèo khó, vì Nước Trời là của họ.' (Mt 5, 3)",
        "Người nhìn con và mỉm cười.",
        "'Thời kỳ đã mãn, Nước Thiên Chúa đã đến gần. Anh em hãy sám hối và tin vào Tin Mừng.' (Mc 1, 15)",
      ],
      () => this.finish()
    );
  }

  private finish() {
    this.finished = true;
    this.sparkleBurst(JESUS_AT[0], JESUS_AT[1] - 20);
    this.time.delayedCall(500, () =>
      this.complete(
        3,
        "Năm Sự Sáng",
        "Đức Chúa Giêsu Rao Giảng Nước Trời Và Kêu Gọi Sám Hối",
        "Sống tinh thần Tám Mối Phúc Thật và hoán cải tâm hồn mỗi ngày.",
        "Mỗi lần bạn an ủi và chia sẻ với người khác, bạn đang sống Tám Mối Phúc. Hãy sám hối và tin vào Tin Mừng nhé!",
        ["gift_hope", "gift_bread", "gift_peace"]
      )
    );
  }
}

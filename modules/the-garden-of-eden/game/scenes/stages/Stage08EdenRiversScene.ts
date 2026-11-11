import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { registerEdenTextures } from "@/modules/the-garden-of-eden/game/utils/edenTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 320;
const H = 240;
const SX = 160;
const SY = 120;
const RIVERS = [tx("Pi-sôn", "Pishon"), tx("Ghi-khôn", "Gihon"), tx("Hít-đê-ken", "Tigris"), tx("Êu-phơ-rát", "Euphrates")]; // N, E, S, W
// each sluice flips two neighbouring rivers (bit per river: N E S W)
const LEVERS = [
  { x: 64, y: 64, flips: [0, 1] },
  { x: 256, y: 64, flips: [1, 2] },
  { x: 256, y: 176, flips: [2, 3] },
  { x: 64, y: 176, flips: [3, 0] },
];
const START = [false, true, false, true]; // E and W flow; N and S are blocked. Solve: levers 1+2.
// the six shy animals: bush position, texture, name, clue
const BEASTS = [
  { x: 36, y: 118, tex: "gen_sheep", name: tx("Cừu", "Sheep"), clue: tx("Em nghe tiếng “be he” nhỏ nhẹ, thấy dấu chân guốc đôi nhỏ và vài sợi lông trắng xù.", "You hear a soft “baa”, and see small split-hoof tracks and some fluffy white wool.") },
  { x: 284, y: 118, tex: "gen_lion", name: tx("Sư tử", "Lion"), clue: tx("Một tiếng gầm vang rền! Dấu chân to có vuốt, và một chiếc bờm vàng lấp ló.", "A rolling roar! Big clawed tracks and a golden mane peeking out.") },
  { x: 120, y: 36, tex: "gen_deer", name: "Nai", clue: tx("Một bóng chạy rất nhanh, nhẹ nhàng. Có cặp sừng nhiều nhánh và dấu guốc thanh mảnh.", "A swift, light shadow runs by. Branching antlers and slender hoof prints.") },
  { x: 204, y: 206, tex: "gen_elephant", name: "Voi", clue: tx("Đất rung nhẹ! Dấu chân tròn rất to và một chiếc vòi dài vươn ra hái lá.", "The ground trembles! Huge round footprints and a long trunk reaching for leaves.") },
  { x: 36, y: 214, tex: "gen_bird", name: "Chim", clue: tx("Tiếng hót líu lo trên cành cao, và dấu chân ba ngón nhỏ xíu trên bờ đất.", "Cheerful chirping from a high branch, and tiny three-toed prints on the bank.") },
  { x: 282, y: 44, tex: "gen_fish", name: tx("Cá", "Fish"), clue: tx("Bọt tăm nổi lên mặt nước, có cái đuôi vẫy lấp lánh dưới dòng sông.", "Bubbles rise to the surface and a shiny tail flicks in the river.") },
];

/** Stage 8: set four sluice levers so all four rivers flow, then observe six shy animals and name them for Adam. */
export class Stage08EdenRiversScene extends BaseGenesisScene {
  private flow = [...START];
  private phase: 1 | 2 | "done" = 1;
  private levers: Phaser.GameObjects.Sprite[] = [];
  private leverOn = [false, false, false, false];
  private riverTiles: { t: Phaser.GameObjects.TileSprite; i: number }[] = [];
  private beds: Phaser.GameObjects.Sprite[] = [];
  private named: boolean[] = [];
  private last = -1; // beast just observed, waiting to be named
  private adamPos: [number, number] = [SX + 28, SY + 34];
  private counter?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage08EdenRiversScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_08_bon_dong_song";
    this.spawn = [SX, SY + 44];
  }

  create() {
    this.flow = [...START];
    this.phase = 1;
    this.levers = [];
    this.leverOn = [false, false, false, false];
    this.riverTiles = [];
    this.beds = [];
    this.named = BEASTS.map(() => false);
    this.last = -1;
    this.intro = { illustration: "rivers", speaker: STAGE_TEXT.s8.speaker, lines: STAGE_TEXT.s8.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerStageTextures(this);
    registerEdenTextures(this);
    this.add.tileSprite(0, 0, W, H, "gen_floor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0x22c55e).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    // river beds N, E, S, W from the spring, drawn as dry soil or running water
    const strips: [number, number, number, number][] = [[SX - 8, 16, 16, SY - 30], [SX + 20, SY - 8, W - 28 - SX - 20, 16], [SX - 8, SY + 14, 16, H - 16 - SY - 14], [12, SY - 8, SX - 20 - 12, 16]];
    strips.forEach(([x, y, w, h], i) => this.riverTiles.push({ t: this.add.tileSprite(x, y, w, h, "gen_soil").setOrigin(0).setDepth(DEPTH.RUG), i }));
    // the withering beds at each river's end
    [[SX, 22], [W - 20, SY], [SX, H - 24], [20, SY]].forEach(([x, y]) => this.beds.push(this.add.sprite(x, y, "gen_flowerbed", 0).setOrigin(0.5, 1).setDepth(y)));
    this.add.image(SX, SY + 8, "gen_spring").setOrigin(0.5, 1).setDepth(SY + 8);
    this.block(SX, SY - 2, 30, 14);
    RIVERS.forEach((n, i) => this.add.text([SX, 232, SX, 88][i], [36, SY - 16, H - 36, SY - 16][i], n, { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#bae6fd", resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX));
    for (const [x, y] of [[100, 90], [220, 150], [100, 150], [220, 90]]) this.prop(x, y, "gen_tree_s", 8, 6);
    this.add.sprite(...this.adamPos, "gen_adam", 0).setOrigin(0.5, 1).setDepth(this.adamPos[1]);
    this.counter = this.add.text(SX, 12, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);

    LEVERS.forEach((l, i) => {
      this.levers.push(this.add.sprite(l.x, l.y, "gen_lever", 0).setOrigin(0.5, 1).setDepth(l.y));
      this.block(l.x, l.y - 3, 12, 6);
      this.interactables.push({ x: l.x, y: l.y - 4, r: 20, label: tx(`[A] Gạt đập ${i + 1}`, `[A] Flip dam ${i + 1}`), active: () => this.phase === 1, act: () => this.pull(i) });
    });
    // bushes hide the animals once the rivers run
    BEASTS.forEach((b, i) => {
      const bush = this.add.image(b.x, b.y, "gen_bush").setOrigin(0.5, 1).setDepth(b.y + 1).setVisible(false).setData("bush", true);
      this.block(b.x, b.y - 3, 14, 6);
      this.interactables.push({ x: b.x, y: b.y - 4, r: 20, label: tx("[A] Quan sát", "[A] Observe"), active: () => this.phase === 2 && !this.named[i], act: () => this.observe(i, bush) });
      for (const t of [0.55, 0.68, 0.81]) this.add.image(Math.round(SX + (b.x - SX) * t), Math.round(SY + 10 + (b.y - SY - 10) * t) + (t * 10 % 2 ? 3 : -3), "gen_paw").setDepth(DEPTH.RUG + 1).setVisible(false).setData("paw", true);
    });
    this.interactables.push({ x: this.adamPos[0], y: this.adamPos[1], r: 24, label: tx("[A] Nói chuyện với A-đam", "[A] Talk to Adam"), active: () => this.phase === 2, act: () => this.nameWithAdam() });
    this.refresh();
  }

  protected onStageStart() {
    this.saveCheckpoint("p1", null, SX, SY + 44);
  }

  private refresh() {
    this.riverTiles.forEach(({ t, i }) => t.setTexture(this.flow[i] ? "gen_water" : "gen_soil"));
    this.beds.forEach((b, i) => b.setFrame(this.flow[i] ? 1 : 0));
    const n = this.flow.filter(Boolean).length;
    this.counter?.setText(this.phase === 1 ? tx(`Dòng sông chảy: ${n}/4`, `Rivers flowing: ${n}/4`) : this.phase === 2 ? tx(`Đã đặt tên: ${this.named.filter(Boolean).length}/${BEASTS.length}`, `Named: ${this.named.filter(Boolean).length}/${BEASTS.length}`) : "");
  }

  private pull(i: number) {
    audio.sfx("door");
    this.leverOn[i] = !this.leverOn[i];
    this.levers[i].setFrame(this.leverOn[i] ? 1 : 0);
    LEVERS[i].flips.forEach((r) => (this.flow[r] = !this.flow[r]));
    this.refresh();
    if (!this.flow.every(Boolean)) return;
    this.phase = 2;
    audio.sfx("bless");
    this.cameras.main.flash(400, 186, 230, 253);
    this.children.list.forEach((o) => { if (o.getData?.("bush")) (o as Phaser.GameObjects.Image).setVisible(true); if (o.getData?.("paw")) (o as Phaser.GameObjects.Image).setVisible(true); });
    this.refresh();
    this.time.delayedCall(500, () => this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), STAGE_TEXT.s8.phase2.map(tr)));
  }

  /** Look at one animal's clue; it stays "pending" until Adam is told its name. */
  private observe(i: number, bush: Phaser.GameObjects.Image) {
    audio.sfx("pickup");
    this.last = i;
    const b = BEASTS[i];
    const s = this.add.sprite(b.x, b.y - 2, b.tex, 0).setOrigin(0.5, 1).setDepth(b.y + 2);
    this.tweens.add({ targets: s, alpha: 0, delay: 1500, duration: 500, ease: "Stepped", easeParams: [4], onComplete: () => s.destroy() });
    void bush;
    this.talk(tx("Quan sát", "Observe"), [b.clue, tx("Hãy về kể cho A-đam nghe để ông đặt tên.", "Go back and tell Adam so he can name it.")]);
  }

  private nameWithAdam() {
    const i = this.last;
    if (i < 0 || this.named[i]) return this.talk(tx("A-đam", "Adam"), [tx("Em hãy đến bụi cây, quan sát dấu vết một con vật rồi quay về kể cho ta nhé.", "Go to the bushes, look at an animal's tracks, then come back and tell me.")]);
    const pool = BEASTS.filter((_, k) => k !== i).map((b) => b.name);
    const names = Phaser.Utils.Array.Shuffle([BEASTS[i].name, ...Phaser.Utils.Array.Shuffle(pool).slice(0, 2)]);
    this.talk(tx("A-đam", "Adam"), [tx("Em đã thấy gì vậy? Theo em, con vật ấy tên là gì?", "What did you see? What do you think the animal is called?")], undefined, names.map((n) => ({
      label: n,
      onSelect: () => (n === BEASTS[i].name ? this.right(i) : this.wrong()),
    })));
  }

  private right(i: number) {
    this.named[i] = true;
    this.last = -1;
    audio.sfx("chime");
    this.sparkleBurst(this.adamPos[0], this.adamPos[1] - 14, 8);
    this.refresh();
    if (this.named.every(Boolean)) {
      this.phase = "done";
      this.refresh();
      return this.talk(tx("A-đam", "Adam"), [tx(`Đúng rồi, ${BEASTS[i].name}! Vậy là ta đã đặt tên cho cả sáu loài.`, `That's right, ${BEASTS[i].name}! Now we have named all six creatures.`)], () => this.finishStage(STAGE_TEXT.s8));
    }
    this.talk(tx("A-đam", "Adam"), [tx(`Đúng rồi, ${BEASTS[i].name}! Còn ${this.named.filter((n) => !n).length} loài nữa.`, `That's right, ${BEASTS[i].name}! ${this.named.filter((n) => !n).length} more to go.`)]);
  }

  private wrong() {
    audio.sfx("wrong");
    this.last = -1;
    this.talk(tx("A-đam", "Adam"), [tx("Hừm, chưa đúng đâu. Em hãy quay lại bụi cây quan sát kỹ hơn nhé.", "Hmm, not quite. Go back to the bushes and look more carefully.")]);
  }
}

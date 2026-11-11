import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerStageTextures } from "@/modules/noahs-ark/game/utils/stageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import EventBus from "@/modules/shared/game/EventBus";
import { t as tx } from "@/modules/shared/i18n";

const T = 16;
const W = 320;
const H = 240;
const PITCH_MS = 16000;

/**
 * '#' frame  '.' deck  'C' cypress block  'T' slot  'P' start  'G' roller gate (closed until the lever is pulled)  'L' lever.
 * Every floor was checked with a Sokoban solver (see Phase 4 notes), so all three are solvable.
 */
const FLOORS = [
  { name: tx("Tầng 1 – Đáy Tàu", "Deck 1 – The Hull"), rows: ["##########", "#P.......#", "#..C.....#", "#.....#..#", "#.C...#T.#", "#.....#T.#", "##########"] },
  { name: tx("Tầng 2 – Khoang Nhiều Ngăn", "Deck 2 – The Many Rooms"), rows: ["############", "#P....#....#", "#..C..G..T.#", "#.....G..T.#", "#.C...G..T.#", "#..L.C#....#", "#.....#....#", "############"] },
  { name: tx("Tầng 3 – Mái Tàu & Cửa Sổ", "Deck 3 – Roof & Window"), rows: ["############", "#P.....#...#", "#..C...G.T.#", "#.C.#..G.T.#", "#....C.G.T.#", "#.L.C..G.T.#", "#......#...#", "############"] },
];

/** Stage 2: Sokoban + crafting. Push cypress blocks into the blueprint slots, then seal every joint with hot pitch before it cools. */
export class Stage02BlueprintScene extends BaseNoahScene {
  private floor = 0;
  private cols = 0;
  private ox = 0;
  private oy = 0;
  private objs: Phaser.GameObjects.GameObject[] = [];
  private crates: Phaser.GameObjects.Image[] = [];
  private crateColliders: Phaser.Physics.Arcade.Collider[] = [];
  private slots: [number, number][] = [];
  private joints: { img: Phaser.GameObjects.Image; x: number; y: number; sealed: boolean }[] = [];
  private gates: { img: Phaser.GameObjects.GameObject; body: Phaser.GameObjects.Rectangle }[] = [];
  private lever?: Phaser.GameObjects.Sprite;
  private leverPulled = false;
  private phase: "blocks" | "pitch" | "done" = "blocks";
  private hotUntil = 0;
  private pushing = false;
  private holdA = false; // virtual A held (keyboard uses the Space key state)
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private info?: Phaser.GameObjects.Text;
  private potAt: [number, number] = [0, 0];
  private pot?: Phaser.GameObjects.Image;

  constructor() {
    super("Stage02BlueprintScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_02_ban_ve_go_bach";
    this.spawn = [100, 100];
  }

  create() {
    this.floor = 0;
    this.objs = [];
    this.crates = [];
    this.pushing = false;
    this.phase = "blocks";
    this.hotUntil = 0;
    this.intro = { illustration: "stage2", speaker: NOAH_TEXT.s2.speaker, lines: NOAH_TEXT.s2.intro.map(tr) };
    super.create();
    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const down = (d: { action: string }) => d.action === "A" && (this.holdA = true);
    const up = (d: { action: string }) => d.action === "A" && (this.holdA = false);
    EventBus.on("input-action", down);
    EventBus.on("input-action-release", up);
    this.events.once("shutdown", () => { EventBus.off("input-action", down); EventBus.off("input-action-release", up); this.holdA = false; });
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, W, H, "noah_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(W / 2, 2, W, 4); this.block(W / 2, H - 2, W, 4); this.block(2, H / 2, 4, H); this.block(W - 2, H / 2, 4, H);
    for (const [x, y] of [[16, 232], [304, 232], [16, 120], [304, 120]]) this.add.image(x, y, "noah_cypress").setOrigin(0.5, 1).setDepth(y);
    this.add.sprite(40, 52, "noah_noah").setOrigin(0.5, 1).setDepth(52);
    this.add.sprite(280, 52, "noah_shem").setOrigin(0.5, 1).setDepth(52);
    this.add.sprite(300, 200, "noah_ham").setOrigin(0.5, 1).setDepth(200);
    this.add.sprite(24, 200, "noah_japheth").setOrigin(0.5, 1).setDepth(200);
    this.info = this.add.text(W / 2, 6, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  protected onStageStart() {
    this.loadFloor(0);
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.loadFloor(state as number);
  }

  private tileXY(c: number, r: number): [number, number] {
    return [this.ox + c * T + T / 2, this.oy + r * T + T / 2];
  }

  private add_<T extends Phaser.GameObjects.GameObject>(o: T): T {
    this.objs.push(o);
    return o;
  }

  private solid(x: number, y: number, w: number, h: number) {
    const r = this.add_(this.add.rectangle(x, y, w, h));
    this.obstacles.add(r);
    return r;
  }

  /** Build floor `n` from its map and put the child at the start tile. */
  private loadFloor(n: number) {
    this.objs.forEach((o) => { this.tweens.killTweensOf(o); o.destroy(); });
    this.objs = [];
    this.crateColliders.forEach((c) => c.destroy());
    this.crateColliders = [];
    this.crates = [];
    this.slots = [];
    this.joints = [];
    this.gates = [];
    this.lever = undefined;
    this.pot = undefined;
    this.floor = n;
    this.leverPulled = false;
    this.phase = "blocks";
    this.hotUntil = 0;
    this.pushing = false;
    this.interactables = [];
    const f = FLOORS[n], rows = f.rows;
    this.cols = rows[0].length;
    this.ox = Math.floor((W / T - this.cols) / 2) * T;
    this.oy = Math.floor((H / T - rows.length) / 2) * T;
    let start: [number, number] = [0, 0];
    rows.forEach((row, r) => [...row].forEach((ch, c) => {
      const [x, y] = this.tileXY(c, r);
      if (ch === "#") { this.add_(this.add.image(x, y, "noah_hull").setDepth(y + 8)); this.solid(x, y, T, T); return; }
      this.add_(this.add.image(x, y, "noah_deck").setDepth(DEPTH.FLOOR));
      if (ch === "T") { this.slots.push([c, r]); this.add_(this.add.image(x, y, "noah_slot").setDepth(DEPTH.RUG)); }
      if (ch === "P") start = [x, y + 4];
      if (ch === "C") {
        const img = this.add_(this.add.image(x, y + 3, "noah_wood").setDepth(y)) as Phaser.GameObjects.Image;
        this.physics.add.existing(img);
        const b = img.body as Phaser.Physics.Arcade.Body;
        b.setSize(16, 16).setOffset(0, -3).setImmovable(true);
        this.crates.push(img);
        this.crateColliders.push(this.physics.add.collider(this.player, img)); // needed for touching.* in tryPush
      }
      if (ch === "G") this.gates.push({ img: this.add_(this.add.image(x, y, "noah_gate").setDepth(y)), body: this.solid(x, y, T, T) });
      if (ch === "L") {
        this.lever = this.add_(this.add.sprite(x, y + 2, "noah_lever", 0).setDepth(y + 8)) as Phaser.GameObjects.Sprite;
        this.solid(x, y, T, T);
        this.interactables.push({ x, y: y + 6, r: 24, label: tx("[A] Kéo cần gạt mở ray", "[A] Pull the lever to open the rail"), active: () => !this.leverPulled, act: () => this.pull() });
      }
    }));
    // pitch pot in the bottom-left corner
    this.potAt = this.tileXY(1, rows.length - 2);
    this.pot = this.add_(this.add.image(this.potAt[0], this.potAt[1] + 8, "noah_pot").setOrigin(0.5, 1).setDepth(this.potAt[1])) as Phaser.GameObjects.Image;
    this.pot.setVisible(false);
    this.interactables.push({ x: this.potAt[0], y: this.potAt[1], r: 22, label: tx("[A] Lấy nhựa thông nóng", "[A] Take hot pitch"), active: () => this.phase === "pitch" && this.time.now > this.hotUntil, act: () => this.heat() });
    // slimmer feet box than the default 18x14 so the child slides through 1-tile gaps and past corners
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(10, 8).setOffset(11, 20);
    this.player.setPosition(start[0], start[1]);
    this.player.setVelocity(0, 0);
    this.saveCheckpoint(`floor${n}`, n, start[0], start[1]);
    this.refreshInfo();
  }

  private pull() {
    this.leverPulled = true;
    audio.sfx("door");
    this.lever?.setFrame(1);
    this.gates.forEach((g) => { g.img.destroy(); g.body.destroy(); });
    this.gates = [];
    this.sparkleBurst(this.lever?.x ?? 0, (this.lever?.y ?? 0) - 6, 6);
  }

  private heat() {
    this.hotUntil = this.time.now + PITCH_MS;
    audio.sfx("pickup");
    this.sparkleBurst(this.potAt[0], this.potAt[1] - 6, 6);
  }

  private tileOf(img: Phaser.GameObjects.Image): [number, number] {
    return [Math.round((img.x - this.ox - T / 2) / T), Math.round((img.y - 3 - this.oy - T / 2) / T)];
  }

  private free(c: number, r: number) {
    const ch = FLOORS[this.floor].rows[r]?.[c];
    if (!ch || ch === "#" || ch === "L" || (ch === "G" && this.gates.length)) return false;
    return !this.crates.some((k) => { const [a, b] = this.tileOf(k); return a === c && b === r; });
  }

  /** Walking into a block pushes it one tile when the tile behind is free. */
  private tryPush() {
    if (this.holdA || this.spaceKey?.isDown) return this.tryPull();
    const b = this.player.body as Phaser.Physics.Arcade.Body;
    const dir = b.touching.right ? [1, 0] : b.touching.left ? [-1, 0] : b.touching.down ? [0, 1] : b.touching.up ? [0, -1] : null;
    if (!dir) return;
    const [dx, dy] = dir, fx = this.player.x, fy = this.player.y + 9;
    let best: Phaser.GameObjects.Image | undefined, bd = Infinity;
    for (const k of this.crates) {
      const along = dx ? (k.x - fx) * dx : (k.y - fy) * dy, across = dx ? Math.abs(k.y - fy) : Math.abs(k.x - fx);
      const d = Math.hypot(k.x - fx, k.y - fy);
      if (along > 2 && along < 18 && across < 12 && d < bd) { best = k; bd = d; }
    }
    if (!best) return;
    const [c, r] = this.tileOf(best);
    if (!this.free(c + dx, r + dy)) return;
    this.pushing = true;
    audio.sfx("step");
    this.tweens.add({
      targets: best, x: best.x + dx * T, y: best.y + dy * T, duration: 150, ease: "Stepped", easeParams: [5],
      onUpdate: () => best!.setDepth(best!.y - 3),
      onComplete: () => { this.pushing = false; this.checkBlocks(); },
    });
  }

  /** Hold A / Space and walk away from a block: it follows into the tile you just left. */
  private tryPull() {
    const m = this.player.getMoveIntent();
    if (!m.x && !m.y) return;
    const horiz = Math.abs(m.x) >= Math.abs(m.y);
    const dx = horiz ? Math.sign(m.x) : 0, dy = horiz ? 0 : Math.sign(m.y);
    const fx = this.player.x, fy = this.player.y + 9;
    // block must sit right behind the child (opposite the walking direction)
    const k = this.crates.find((c) => {
      const along = dx ? (fx - c.x) * dx : (fy - c.y) * dy, across = dx ? Math.abs(c.y - fy) : Math.abs(c.x - fx);
      return along > 2 && along < 20 && across < 10;
    });
    if (!k) return;
    this.pushing = true;
    audio.sfx("step");
    this.crateColliders.forEach((c) => (c.active = false)); // let the child step away without bumping the block
    this.tweens.add({
      targets: k, x: k.x + dx * T, y: k.y + dy * T, duration: 150, ease: "Stepped", easeParams: [5],
      onUpdate: () => k.setDepth(k.y - 3),
      onComplete: () => { this.pushing = false; this.crateColliders.forEach((c) => (c.active = true)); this.checkBlocks(); },
    });
  }

  private checkBlocks() {
    if (this.phase !== "blocks") return;
    const filled = this.slots.every(([c, r]) => this.crates.some((k) => { const [a, b] = this.tileOf(k); return a === c && b === r; }));
    if (!filled) return;
    this.phase = "pitch";
    audio.sfx("chime");
    this.cameras.main.flash(250, 255, 244, 200);
    this.pot?.setVisible(true);
    this.joints = this.slots.map(([c, r]) => {
      const [x, y] = this.tileXY(c, r);
      return { img: this.add_(this.add.image(x, y, "noah_joint").setDepth(y + 1)) as Phaser.GameObjects.Image, x, y, sealed: false };
    });
    this.refreshInfo();
  }

  private refreshInfo() {
    const f = FLOORS[this.floor];
    const hint = this.phase === "blocks" ? tx("đẩy gỗ vào ô vàng (giữ A + lùi để kéo)", "push the wood onto the gold square (hold A + step back to pull)") : this.phase === "pitch" ? (this.time.now < this.hotUntil ? tx(`nhựa nóng ${Math.ceil((this.hotUntil - this.time.now) / 1000)}s – trét mối nối!`, `hot pitch ${Math.ceil((this.hotUntil - this.time.now) / 1000)}s – seal the joints!`) : tx("lấy nhựa thông ở thùng", "get pitch from the barrel")) : "";
    this.info?.setText(`${f.name}  |  ${hint}`);
  }

  private floorDone() {
    this.phase = "done";
    audio.sfx("bless");
    this.sparkleBurst(this.player.x, this.player.y - 8, 12);
    if (this.floor + 1 < FLOORS.length) this.talk(tx("Bản Vẽ Của Chúa", "God's Blueprint"), NOAH_TEXT.s2.floorDone.map(tr), () => this.loadFloor(this.floor + 1));
    else this.finishStage(NOAH_TEXT.s2);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.dialogueOpen) return;
    this.refreshInfo();
    if (!this.pushing && this.phase === "blocks") this.tryPush();
    if (this.phase !== "pitch") return;
    const hot = this.time.now < this.hotUntil;
    if (this.hotUntil && !hot && this.joints.some((j) => j.sealed)) {
      // pitch cooled before every joint was sealed: start over
      this.joints.forEach((j) => { j.sealed = false; j.img.setTexture("noah_joint"); });
      this.hotUntil = 0;
      audio.sfx("wrong");
      this.talk(tx("Nhựa Thông", "Pitch"), NOAH_TEXT.s2.cooled.map(tr));
      return;
    }
    if (!hot) return;
    for (const j of this.joints) {
      if (!j.sealed && Math.hypot(this.player.x - j.x, this.player.y + 9 - j.y) < 22) {
        j.sealed = true;
        j.img.setTexture("noah_sealed");
        audio.sfx("pickup");
      }
    }
    if (this.joints.every((j) => j.sealed)) this.floorDone();
  }
}

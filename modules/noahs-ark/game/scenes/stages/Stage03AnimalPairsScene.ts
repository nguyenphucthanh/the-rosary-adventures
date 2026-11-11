import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerStageTextures } from "@/modules/noahs-ark/game/utils/stageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 320;
const H = 240;

interface Node { x: number; y: number; exits: string[]; sw?: number; gate?: number; cabin?: number }
/** Trail network. Junctions (sw) cycle through their exits; barriers (gate) hold animals until opened; cabins end each trail. */
const NODES: Record<string, Node> = {
  S: { x: 160, y: 238, exits: ["A"] },
  A: { x: 160, y: 196, exits: ["B", "C"], sw: 0 },
  B: { x: 88, y: 150, exits: ["H", "M"], sw: 1 },
  C: { x: 232, y: 150, exits: ["M", "K"], sw: 2 },
  H: { x: 88, y: 100, exits: ["HC"], gate: 0 },
  M: { x: 160, y: 100, exits: ["LC"], gate: 1 },
  K: { x: 232, y: 100, exits: ["KC"] },
  HC: { x: 88, y: 60, exits: [], cabin: 0 },
  LC: { x: 160, y: 60, exits: [], cabin: 1 },
  KC: { x: 232, y: 60, exits: [], cabin: 2 },
};
const SWITCHES = [
  { x: 176, y: 196, label: tx("Ngã ba dưới", "Lower fork") }, { x: 72, y: 150, label: tx("Ngã ba trái", "Left fork") }, { x: 248, y: 150, label: tx("Ngã ba phải", "Right fork") },
];
const BARRIERS = [{ node: "H", label: tx("Cổng rào Khoang Hiền", "Gentle Pen gate") }, { node: "M", label: tx("Cổng rào Khoang Lớn", "Big Pen gate") }];
const CABIN_NAMES = [tx("Khoang Thú Hiền", "Gentle Animals' Pen"), tx("Khoang Thú Lớn", "Big Animals' Pen"), tx("Khoang Chim Trời", "Birds' Pen")];

interface Kind { tex: string; spd: number; cabin: number; fierce?: boolean; name: string }
const KINDS: Record<string, Kind> = {
  sheep: { tex: "noah_sheep", spd: 34, cabin: 0, name: tx("chiên", "lamb") },
  rabbit: { tex: "noah_rabbit", spd: 40, cabin: 0, name: tx("thỏ", "rabbit") },
  deer: { tex: "noah_deer", spd: 38, cabin: 0, name: tx("hươu", "deer") },
  lion: { tex: "noah_lion", spd: 60, cabin: 1, fierce: true, name: tx("sư tử", "lion") },
  elephant: { tex: "noah_elephant", spd: 28, cabin: 1, name: "voi" },
  zebra: { tex: "noah_zebra", spd: 40, cabin: 1, name: tx("ngựa vằn", "zebra") },
  dove: { tex: "noah_dove", spd: 46, cabin: 2, name: tx("chim bồ câu", "dove") },
};
// Three groups of pairs: 2, 3 then 4. One pair walks at a time; the next appears after the previous is home.
const WAVES: string[][] = [
  ["sheep", "lion"],
  ["rabbit", "elephant", "dove"],
  ["deer", "zebra", "lion", "dove"],
];
const PAIR_GAP = 1500; // ms of calm between pairs
const LOST = [
  { kind: "rabbit", x: 40, y: 206 }, { kind: "deer", x: 282, y: 214 }, { kind: "zebra", x: 40, y: 128 },
];
const RALLY: [number, number][] = [[118, 222], [160, 226], [202, 222]];

interface Pair { kind: string; x: number; y: number; to: string; sprites: Phaser.GameObjects.Sprite[]; dx: number; dy: number; done: boolean }

/** Stage 3: pair herding. Call the lost animals, then flip trail switches and barriers so every pair reaches its own cabin and lions never meet gentle animals. */
export class Stage03AnimalPairsScene extends BaseNoahScene {
  private phase: "lost" | "wave" | "idle" = "lost";
  private found = [false, false, false];
  private lostS: Phaser.GameObjects.Sprite[] = [];
  private cries: Phaser.GameObjects.Image[] = [];
  private sw = [0, 0, 0];
  private open = [false, false];
  private levers: Phaser.GameObjects.Sprite[] = [];
  private barrierImgs: Phaser.GameObjects.Image[] = [];
  private route?: Phaser.GameObjects.Graphics;
  private rain?: Phaser.GameObjects.Graphics;
  private pairs: Pair[] = [];
  private wave = 0;
  private waveT = 0;
  private spawned = 0;
  private gapT = 0;
  private busy = false;
  private entered = 0;

  constructor() {
    super("Stage03AnimalPairsScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_03_muon_thu_len_tau";
    this.spawn = [100, 216];
  }

  create() {
    this.phase = "lost";
    this.found = [false, false, false];
    this.lostS = [];
    this.cries = [];
    this.levers = [];
    this.barrierImgs = [];
    this.pairs = [];
    this.sw = [0, 0, 0];
    this.open = [false, false];
    this.wave = 0;
    this.busy = false;
    this.intro = { illustration: "stage3", speaker: NOAH_TEXT.s3.speaker, lines: NOAH_TEXT.s3.intro.map(tr) };
    super.create();
  }

  private anim(key: string) {
    if (!this.anims.exists(key)) this.anims.create({ key, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    return key;
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, W, H, "noah_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(W / 2, 2, W, 4); this.block(W / 2, H - 2, W, 4); this.block(2, H / 2, 4, H); this.block(W - 2, H / 2, 4, H);
    this.add.rectangle(0, 0, W, H, 0x4c1d95, 0.18).setOrigin(0).setDepth(DEPTH.LIGHT); // storm-purple dusk

    // trails (static sand) + a gold dotted overlay for the currently chosen exits
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    g.fillStyle(0xe9cf8f, 1);
    for (const [id, n] of Object.entries(NODES)) for (const e of n.exits) {
      const m = NODES[e], steps = Math.ceil(Math.hypot(m.x - n.x, m.y - n.y) / 4);
      for (let i = 0; i <= steps; i++) g.fillRect(Math.round(n.x + ((m.x - n.x) * i) / steps) - 5, Math.round(n.y + ((m.y - n.y) * i) / steps) - 5, 10, 10);
      void id;
    }
    this.route = this.add.graphics().setDepth(DEPTH.RUG + 0.5);

    CABIN_NAMES.forEach((name, i) => {
      const n = NODES[["HC", "LC", "KC"][i]];
      this.add.image(n.x, n.y + 4, "noah_cabin", i).setOrigin(0.5, 1).setDepth(n.y + 4);
      this.block(n.x, n.y - 6, 28, 12);
      this.add.text(n.x, 8, name, { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.FX);
    });
    for (const [x, y] of [[20, 90], [300, 90], [20, 170], [300, 170]]) this.prop(x, y, "noah_cypress", 10, 6);
    this.add.sprite(120, 120, "noah_noah").setOrigin(0.5, 1).setDepth(120);

    SWITCHES.forEach((s, i) => {
      this.levers.push(this.add.sprite(s.x, s.y, "noah_lever", 0).setOrigin(0.5, 1).setDepth(s.y));
      this.interactables.push({ x: s.x, y: s.y - 4, r: 20, label: tx(`[A] Đổi hướng: ${s.label}`, `[A] Switch direction: ${s.label}`), active: () => this.phase !== "lost", act: () => this.flip(i) });
    });
    BARRIERS.forEach((b, i) => {
      const n = NODES[b.node], x = n.x + 18, y = n.y + 8;
      this.barrierImgs.push(this.add.image(n.x, n.y + 6, "noah_gate").setOrigin(0.5, 1).setDepth(n.y + 6));
      this.levers.push(this.add.sprite(x, y, "noah_lever", 0).setOrigin(0.5, 1).setDepth(y));
      this.interactables.push({ x, y: y - 4, r: 20, label: `[A] ${b.label}`, active: () => this.phase !== "lost", act: () => this.toggleGate(i) });
    });
    this.drawRoute();

    // lost animals
    LOST.forEach((l, i) => {
      const k = KINDS[l.kind];
      this.lostS.push(this.add.sprite(l.x, l.y, k.tex).setOrigin(0.5, 1).setDepth(l.y).play(this.anim(k.tex)));
      const cry = this.add.image(l.x, l.y - this.lostS[i].height - 4, "noah_cry").setOrigin(0.5, 1).setDepth(DEPTH.FX);
      this.tweens.add({ targets: cry, y: cry.y - 3, duration: 500, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.cries.push(cry);
      this.interactables.push({ x: l.x, y: l.y - 6, r: 26, label: tx(`[A] Gọi ${k.name} lạc bầy`, `[A] Call the lost ${k.name}`), active: () => !this.found[i], act: () => this.callHome(i) });
    });
    this.rain = this.add.graphics().setDepth(DEPTH.FX - 3);
  }

  protected onStageStart() {
    this.saveCheckpoint("lost", -1, 100, 216);
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.sw = [0, 0, 0];
    this.open = [false, false];
    this.levers.forEach((l) => l.setFrame(0));
    this.syncGates();
    this.startWave(state as number);
  }

  private flip(i: number) {
    const n = NODES[["A", "B", "C"][i]];
    this.sw[i] = (this.sw[i] + 1) % n.exits.length;
    this.levers[i].setFrame(this.sw[i]);
    audio.sfx("select");
    this.drawRoute();
  }

  private toggleGate(i: number) {
    this.open[i] = !this.open[i];
    this.levers[3 + i].setFrame(this.open[i] ? 1 : 0);
    audio.sfx("door");
    this.syncGates();
  }

  private syncGates() {
    this.barrierImgs.forEach((b, i) => b.setVisible(!this.open[i]));
  }

  private drawRoute() {
    const g = this.route?.clear().fillStyle(0xfbbf24, 1);
    (["A", "B", "C"] as const).forEach((id, i) => {
      const n = NODES[id], m = NODES[n.exits[this.sw[i]]], steps = Math.ceil(Math.hypot(m.x - n.x, m.y - n.y) / 8);
      for (let s = 1; s < steps; s++) g?.fillRect(Math.round(n.x + ((m.x - n.x) * s) / steps) - 1, Math.round(n.y + ((m.y - n.y) * s) / steps) - 1, 3, 3);
    });
  }

  private callHome(i: number) {
    this.found[i] = true;
    audio.sfx("pickup");
    this.cries[i].destroy();
    const [x, y] = RALLY[i];
    this.tweens.add({ targets: this.lostS[i], x, y, duration: 1100, ease: "Stepped", easeParams: [10], onUpdate: () => this.lostS[i].setDepth(this.lostS[i].y) });
    if (this.found.every(Boolean)) {
      this.talk(tx("Muôn Thú", "The Animals"), NOAH_TEXT.s3.found.map(tr), () => this.talk(tx("Ông Nô-ê", "Noah"), NOAH_TEXT.s3.phase2.map(tr), () => {
        this.lostS.forEach((s) => s.destroy());
        this.saveCheckpoint("wave0", 0, 100, 216);
        this.startWave(0);
      }));
    } else this.talk(tx("Muôn Thú", "The Animals"), [tx(`Em đã tìm thấy ${this.found.filter(Boolean).length}/3 con thú lạc.`, `You found ${this.found.filter(Boolean).length}/3 lost animals.`)]);
  }

  private clearPairs() {
    this.pairs.forEach((p) => p.sprites.forEach((s) => s.destroy()));
    this.pairs = [];
  }

  private startWave(n: number) {
    if (n < 0) return;
    this.clearPairs();
    this.phase = "wave";
    this.wave = n;
    this.waveT = 0;
    this.spawned = 0;
    this.gapT = PAIR_GAP;
    this.entered = 0;
    this.busy = false;
    this.saveCheckpoint(`wave${n}`, n, 100, 216);
  }

  private spawnPair(kind: string) {
    const k = KINDS[kind], s = NODES.S;
    const sprites = [0, 1].map((i) => {
      const tex = kind === "lion" && i === 1 ? "noah_lioness" : k.tex; // a pair is male + female
      return this.add.sprite(s.x - i * 14, s.y, tex).setOrigin(0.5, 1).play(this.anim(tex));
    });
    this.pairs.push({ kind, x: s.x, y: s.y, to: "A", sprites, dx: 0, dy: -1, done: false });
  }

  private fail(msg: string) {
    if (this.busy) return;
    this.busy = true;
    audio.sfx("wrong");
    this.talk(tx("Muôn Thú", "The Animals"), [msg], () => this.resetToCheckpoint());
  }

  private waveClear() {
    this.busy = true;
    audio.sfx("bless");
    if (this.wave + 1 < WAVES.length) {
      this.talk(tx("Ông Nô-ê", "Noah"), NOAH_TEXT.s3.wave.map(tr), () => { this.startWave(this.wave + 1); });
    } else {
      this.rain?.clear();
      this.finishStage(NOAH_TEXT.s3);
    }
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.dialogueOpen || this.phase !== "wave" || this.busy) return;
    const dt = Math.min(delta, 50) / 1000;
    this.waveT += delta;
    const w = WAVES[this.wave];
    if (this.pairs.every((p) => p.done)) {
      this.gapT += delta;
      if (this.spawned < w.length && this.gapT >= PAIR_GAP) { this.spawnPair(w[this.spawned++]); this.gapT = 0; }
    }

    // drizzle gets heavier with each group
    this.rain?.clear().fillStyle(0xe0f2fe, 0.5);
    for (let i = 0; i < this.wave * 12; i++) this.rain?.fillRect(((i * 67 + this.waveT * 0.05) % W) | 0, ((i * 41 + this.waveT * 0.25) % H) | 0, 1, 3);

    for (const p of this.pairs) {
      if (p.done) continue;
      const k = KINDS[p.kind], node = NODES[p.to];
      if (node.gate !== undefined && !this.open[node.gate] && Math.hypot(node.x - p.x, node.y - p.y) < 8) { this.place(p); continue; } // waits at the closed barrier
      const dx = node.x - p.x, dy = node.y - p.y, d = Math.hypot(dx, dy), step = k.spd * dt;
      if (d > step) { p.x += (dx / d) * step; p.y += (dy / d) * step; p.dx = dx / d; p.dy = dy / d; }
      else {
        p.x = node.x; p.y = node.y;
        if (node.cabin !== undefined) {
          if (node.cabin !== k.cabin) return this.fail(tx(`Ôi, ${k.name} vào nhầm ${CABIN_NAMES[node.cabin]}! Hãy đổi hướng đúng và thử lại.`, `Oh no, the ${k.name} went into the wrong place: ${CABIN_NAMES[node.cabin]}! Switch the right direction and try again.`));
          p.done = true;
          audio.sfx("chime");
          p.sprites.forEach((s) => s.setVisible(false));
          if (++this.entered === w.length) return this.waveClear();
          continue;
        }
        if (node.gate !== undefined && !this.open[node.gate]) { this.place(p); continue; }
        p.to = node.exits[node.sw !== undefined ? this.sw[node.sw] : 0];
      }
      this.place(p);
    }
    // a lion must never share the trail with a gentle animal
    const lions = this.pairs.filter((p) => !p.done && KINDS[p.kind].fierce);
    for (const q of this.pairs) {
      if (q.done || KINDS[q.kind].fierce || q.kind === "dove") continue;
      if (lions.some((l) => Math.hypot(l.x - q.x, l.y - q.y) < 26)) return this.fail(tx("Sư tử đã đến quá gần làm thú hiền hoảng sợ! Hãy tách hai đường đi và thử lại.", "The lion came too close and frightened the gentle animals! Keep their paths apart and try again."));
    }
  }

  private place(p: Pair) {
    const flying = p.kind === "dove", bob = flying ? -8 + (Math.floor(this.waveT / 250) % 2) * 2 : 0;
    p.sprites.forEach((s, i) => {
      s.setPosition(Math.round(p.x - p.dx * 14 * i), Math.round(p.y - p.dy * 14 * i + bob)).setDepth(p.y + 3 - i).setFlipX(p.dx < -0.1);
    });
  }
}

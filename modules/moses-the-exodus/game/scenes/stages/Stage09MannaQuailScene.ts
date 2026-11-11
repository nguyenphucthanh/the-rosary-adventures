import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerMannaTextures } from "@/modules/moses-the-exodus/game/utils/mannaTextures";
import { STAGE9, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 352;
const H = 300;
const X0 = 24, X1 = 328, Y0 = 72, Y1 = 268;
const START: [number, number] = [176, 236];
const CAP = 3;
const PILE_SLOTS = 8;
const TENT_Y = 112;
const TENTS = [{ x: 80, people: 2 }, { x: 176, people: 3 }, { x: 272, people: 2 }];
const AARON: [number, number] = [312, 184];
const JAR: [number, number] = [294, 192];
// Rounds: manna clumps [x, y, omers]; the sun starts sweeping after `delay` ms and crosses the field in `sweep` ms
const ROUNDS = [
  { mult: 1, jar: false, delay: 6000, sweep: 40000, piles: [[290, 168, 3], [248, 214, 2], [196, 176, 2], [140, 220, 1], [88, 184, 1]] },
  { mult: 2, jar: true, delay: 6000, sweep: 56000, piles: [[274, 156, 3], [244, 212, 3], [212, 170, 3], [176, 220, 3], [140, 176, 2], [104, 216, 2], [66, 172, 1], [304, 218, 1]] },
] as const;
const WALK_SPEED = 14, WALK_FAIL_Y = 236;
const WALKERS = [{ t: 3000, tent: 0 }, { t: 7500, tent: 2 }, { t: 12000, tent: 1 }, { t: 16500, tent: 0 }, { t: 21000, tent: 2 }, { t: 25500, tent: 1 }];

type Phase = "wait" | "r1" | "r2" | "r3" | "done";
interface Pile { v: number; x: number; y: number; taken: boolean; melted: boolean; img: Phaser.GameObjects.Sprite; txt: Phaser.GameObjects.Text; glow: Phaser.GameObjects.Image }
interface Tent { x: number; need: number; have: number; txt: Phaser.GameObjects.Text; glow: Phaser.GameObjects.Image }
interface Walker { t: number; tent: number; state: "idle" | "walk" | "done"; img: Phaser.GameObjects.Image; glow: Phaser.GameObjects.Image }

/** Stage 9: gather the exact omers for each tent before the sun melts the manna (weekday, double Friday), then keep the Sabbath. */
export class Stage09MannaQuailScene extends BaseExodusScene {
  private phase: Phase = "wait";
  private round = 0;
  private elapsed = 0;
  private carried = 0;
  private piles: Pile[] = [];
  private tents: Tent[] = [];
  private walkers: Walker[] = [];
  private jarDone = false;
  private reminded = 0;
  private beam?: Phaser.GameObjects.Rectangle;
  private beamCore?: Phaser.GameObjects.Rectangle;
  private jarImg?: Phaser.GameObjects.Image;
  private jarGlow?: Phaser.GameObjects.Image;
  private jarTxt?: Phaser.GameObjects.Text;
  private carryImg?: Phaser.GameObjects.Image;
  private carryTxt?: Phaser.GameObjects.Text;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage09MannaQuailScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_09_banh_manna_tu_troi";
    this.spawn = START;
  }

  create() {
    this.phase = "wait";
    this.round = 0;
    this.elapsed = 0;
    this.carried = 0;
    this.piles = [];
    this.tents = [];
    this.walkers = [];
    this.jarDone = false;
    this.reminded = 0;
    this.intro = { illustration: "9", speaker: STAGE9.speaker, lines: STAGE9.intro.map(tr) };
    super.create();
  }

  // ---------------------------------------------------------------- world

  protected buildWorld() {
    registerSiteTextures(this);
    registerMannaTextures(this);

    // sand field, sky, sun, warm light
    this.add.tileSprite(0, 0, W, H, "exodus_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 44, 0x7dd3fc).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(300, 14, 14, 14, 0xfef08a).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(300, 14, 20, 8, 0xfef08a, 0.5).setDepth(DEPTH.FLOOR + 1);
    this.add.tileSprite(0, 44, W, 28, "site_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, Y0 - 4, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfff1c9, 0.06).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.block(W / 2, Y0 / 2, W, Y0);
    this.block(W / 2, (Y1 + H) / 2, W, H - Y1);
    this.block(X0 / 2, H / 2, X0, H);
    this.block((X1 + W) / 2, H / 2, W - X1, H);

    // dust path in front of the tents + decor
    this.add.rectangle(X0 + 8, TENT_Y + 8, X1 - X0 - 16, 6, 0xd6b98c, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    for (const [x, y, k] of [[40, 252, "site_rock"], [316, 250, "site_shrub"], [48, 128, "site_shrub"], [314, 124, "site_rock"], [126, 126, "site_jar"], [226, 126, "site_pot"]] as [number, number, string][]) this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y);

    // tents with a counter above each
    TENTS.forEach((tn, i) => {
      this.prop(tn.x, TENT_Y, "site_tent", 40, 10);
      const glow = this.add.image(tn.x, TENT_Y - 26, "exodus_glow_gold").setDepth(DEPTH.FX - 70).setAlpha(0.7).setVisible(false);
      const txt = this.add.text(tn.x, TENT_Y - 36, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.UI - 5);
      this.tents[i] = { x: tn.x, need: 0, have: 0, txt, glow };
    });

    // Moses (decor) and Aaron with the golden jar
    this.add.image(40, 180, "exodus_moses_leader").setOrigin(0.5, 1).setDepth(180);
    this.block(40, 176, 12, 6);
    this.add.image(AARON[0], AARON[1], "exodus_aaron").setOrigin(0.5, 1).setDepth(AARON[1]);
    this.block(AARON[0], AARON[1] - 4, 12, 6);
    this.jarImg = this.add.image(JAR[0], JAR[1], "mn_goldjar").setOrigin(0.5, 1).setDepth(JAR[1]).setVisible(false);
    this.jarGlow = this.add.image(JAR[0], JAR[1] - 10, "exodus_glow_gold").setDepth(DEPTH.FX - 70).setAlpha(0.7).setVisible(false);
    this.tweens.add({ targets: this.jarGlow, alpha: 1, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });

    this.jarTxt = this.add.text(JAR[0], JAR[1] - 24, "0/1", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.UI - 5).setVisible(false);

    // sunbeam: flat, stepped, sweeps right to left
    this.beam = this.add.rectangle(X1 + 40, Y0, 30, Y1 - Y0, 0xfef08a, 0.22).setOrigin(0).setDepth(DEPTH.FX - 60).setVisible(false);
    this.beamCore = this.add.rectangle(X1 + 40, Y0, 8, Y1 - Y0, 0xfffbeb, 0.3).setOrigin(0).setDepth(DEPTH.FX - 59).setVisible(false);

    // interactables
    const cx = (x: number, y: number, r: number, label: () => string, active: () => boolean, act: () => void) => this.interactables.push({ x, y, r, label, active, act });
    const gather = () => this.phase === "r1" || this.phase === "r2";
    TENTS.forEach((tn, i) => cx(tn.x, TENT_Y + 8, 28, () => tr(STAGE9.tent), () => gather() && this.tents[i].have < this.tents[i].need, () => this.giveTent(i)));
    cx(AARON[0], AARON[1] + 4, 28, () => tr(STAGE9.jar), () => this.phase === "r2" && !this.jarDone, () => this.giveJar());
    // every possible pile slot + walker is an interactable resolved by lookup so rounds can rebuild them
    for (let i = 0; i < PILE_SLOTS; i++) cx(0, 0, 18, () => tr(this.carried >= CAP ? STAGE9.pileFull : STAGE9.pile), () => gather() && !!this.piles[i] && !this.piles[i].taken && !this.piles[i].melted, () => this.takePile(i));
    for (let i = 0; i < WALKERS.length; i++) cx(0, 0, 24, () => tr(STAGE9.walker), () => this.phase === "r3" && this.walkers[i]?.state === "walk", () => this.remind(i));

    this.carryImg = this.add.image(0, 0, "mn_omer").setDepth(DEPTH.FX).setVisible(false);
    this.carryTxt = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.FX);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  // ---------------------------------------------------------------- rounds

  protected onStageStart() {
    this.phase = "wait";
    this.talk(STAGE9.speaker, STAGE9.start.map(tr), () => this.startRound(0));
  }

  protected onCheckpointRestore(id: string) {
    this.startRound(id === "r3" ? 2 : id === "r2" ? 1 : 0);
  }

  private startRound(r: number) {
    this.round = r;
    this.elapsed = 0;
    this.carried = 0;
    this.jarDone = false;
    this.reminded = 0;
    this.player.setPosition(START[0], START[1]);
    this.saveCheckpoint(`r${r + 1}`, null, START[0], START[1]);
    this.piles.forEach((p) => { this.tweens.killTweensOf([p.img, p.txt, p.glow]); p.img.destroy(); p.txt.destroy(); p.glow.destroy(); });
    this.piles = [];
    this.walkers.forEach((w) => { w.img.destroy(); w.glow.destroy(); });
    this.walkers = [];
    const gathering = r < 2;
    this.beam?.setVisible(gathering).setX(X1 + 40);
    this.beamCore?.setVisible(gathering).setX(X1 + 40 + 11);
    this.jarImg?.setVisible(gathering && ROUNDS[Math.min(r, 1)].jar);
    this.jarGlow?.setVisible(gathering && ROUNDS[Math.min(r, 1)].jar);
    this.jarTxt?.setText("0/1").setVisible(gathering && ROUNDS[Math.min(r, 1)].jar);
    if (gathering) {
      const cfg = ROUNDS[r];
      this.tents.forEach((tn, i) => { tn.have = 0; tn.need = TENTS[i].people * cfg.mult; tn.glow.setVisible(false); });
      cfg.piles.forEach(([x, y, v], i) => {
        const glow = this.add.image(x, y - 6, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.5);
        const img = this.add.sprite(x, y, "mn_clump", v - 1).setOrigin(0.5, 1).setDepth(y);
        const txt = this.add.text(x, y - 14, String(v), { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fef9c3", resolution: 4 }).setOrigin(0.5, 1).setDepth(y + 1);
        this.tweens.add({ targets: [img, txt], y: "-=2", duration: 600, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2], delay: i * 110 });
        this.tweens.add({ targets: glow, alpha: 0.9, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
        this.piles.push({ v, x, y, taken: false, melted: false, img, txt, glow });
      });
      this.phase = r === 0 ? "r1" : "r2";
      this.piles.forEach((p, i) => { const it = this.interactables[TENTS.length + 1 + i]; it.x = p.x; it.y = p.y; });
    } else {
      this.tents.forEach((tn) => { tn.have = 0; tn.need = 0; tn.glow.setVisible(false); });
      WALKERS.forEach((cfg, i) => {
        const x = TENTS[cfg.tent].x + 4;
        const glow = this.add.image(x, TENT_Y + 4, "exodus_glow_gold").setDepth(DEPTH.FX - 70).setAlpha(0.6).setVisible(false);
        const img = this.add.image(x, TENT_Y + 12, i % 2 ? "exodus_slave" : "exodus_bully").setOrigin(0.5, 1).setDepth(TENT_Y + 12).setVisible(false);
        this.walkers.push({ t: cfg.t, tent: cfg.tent, state: "idle", img, glow });
      });
      this.phase = "r3";
    }
    if (r === 1) this.talk(STAGE9.speaker, STAGE9.r2Intro.map(tr));
    if (r === 2) this.talk(STAGE9.speaker, STAGE9.r3Intro.map(tr));
  }

  private setCarried(n: number) {
    this.carried = n;
  }

  private takePile(i: number) {
    const p = this.piles[i];
    if (!p || p.taken || p.melted) return;
    if (this.carried + p.v > CAP) { audio.sfx("wrong"); return; }
    p.taken = true;
    p.img.setVisible(false); p.txt.setVisible(false); p.glow.setVisible(false);
    this.setCarried(this.carried + p.v);
    audio.sfx("pickup");
  }

  private giveTent(i: number) {
    if (this.carried <= 0) { audio.sfx("wrong"); return; }
    const tn = this.tents[i];
    tn.have += this.carried;
    this.setCarried(0);
    if (tn.have > tn.need) { this.fail(STAGE9.spoiled); return; }
    audio.sfx("pickup");
    if (tn.have === tn.need) { tn.glow.setVisible(true); audio.sfx("chime"); this.sparkleBurst(tn.x, TENT_Y - 16, 8); }
    this.checkRoundDone();
  }

  private toast(x: number, y: number, msg: string, color = "#fecaca") {
    const t = this.add.text(Math.round(x), Math.round(y), msg, { fontFamily: "Dearpix, monospace", fontSize: "10px", color, backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.UI);
    this.tweens.add({ targets: t, y: t.y - 6, alpha: 0, duration: 1800, delay: 400, onComplete: () => t.destroy() });
  }

  private giveJar() {
    if (this.carried !== 1) {
      audio.sfx("wrong");
      this.toast(AARON[0], AARON[1] - 30, tr(this.carried === 0 ? STAGE9.jarEmpty : STAGE9.jarWrong));
      return;
    }
    this.setCarried(0);
    this.jarDone = true;
    this.jarGlow?.setAlpha(1);
    this.jarTxt?.setText("1/1").setVisible(true);
    this.toast(AARON[0], AARON[1] - 30, "+1", "#bbf7d0");
    audio.sfx("bless");
    this.sparkleBurst(JAR[0], JAR[1] - 12, 10);
    this.checkRoundDone();
  }

  private checkRoundDone() {
    const cfg = ROUNDS[this.round];
    if (!this.tents.every((tn) => tn.have === tn.need) || (cfg.jar && !this.jarDone)) return;
    const next = this.round + 1;
    this.phase = "wait";
    this.beam?.setVisible(false);
    this.beamCore?.setVisible(false);
    audio.sfx("bless");
    this.talk(STAGE9.speaker, [tr(this.round === 0 ? STAGE9.r1Ok : STAGE9.r2Ok)], () => this.startRound(next));
  }

  private fail(msg: { vi: string; en: string }) {
    audio.sfx("wrong");
    this.phase = "wait";
    this.talk(STAGE9.speaker, [tr(msg)], () => this.startRound(this.round));
  }

  private remind(i: number) {
    const w = this.walkers[i];
    if (!w || w.state !== "walk") return;
    w.state = "done";
    w.img.setVisible(false); w.glow.setVisible(false);
    this.reminded++;
    audio.sfx("chime");
    this.sparkleBurst(w.img.x, w.img.y - 14, 6);
    if (this.reminded >= WALKERS.length) this.won();
  }

  private won() {
    this.phase = "done";
    audio.sfx("complete");
    this.cameras.main.flash(500, 255, 244, 200);
    this.completeStage();
    this.time.delayedCall(900, () =>
      this.talk("Ấn Dấu thứ 9", STAGE9.outro.map(tr), () =>
        this.talk("Suy niệm", [tr(STAGE9.lesson)], () =>
          this.talk("Hoang địa Xin", STAGE9.cutscene.map(tr), () => this.goToNextStage()))));
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const view = this.cameras.main.worldView;
    const p = this.player;
    let hud = "";
    if (this.phase === "r1" || this.phase === "r2" || this.phase === "r3") {
      hud = tr(STAGE9.round[this.round]);
      hud += this.round < 2 ? `  ·  ${tr(STAGE9.basket)}: ${this.carried}/${CAP}` : `  ·  ${tr(STAGE9.reminded)}: ${this.reminded}/${WALKERS.length}`;
    }
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(hud);
    this.carryImg?.setVisible(this.carried > 0).setPosition(Math.round(p.x), Math.round(p.y - 30)).setDepth(p.y + 17);
    this.carryTxt?.setVisible(this.carried > 0).setText(String(this.carried)).setPosition(Math.round(p.x), Math.round(p.y - 37)).setDepth(p.y + 18);
    this.tents.forEach((tn, i) => {
      if (this.round >= 2) { tn.txt.setVisible(false); return; }
      const base = TENTS[i].people;
      tn.txt.setVisible(true).setText(this.round === 0 ? `${tn.have}/${tn.need}` : `${base}×2: ${tn.have}`);
    });

    p.speedScale = 1;
    if (this.introActive || this.dialogueOpen) return;
    if (this.phase === "r1" || this.phase === "r2") this.updateGather(delta);
    else if (this.phase === "r3") this.updateSabbath(delta);
  }

  private updateGather(delta: number) {
    this.elapsed += delta;
    const cfg = ROUNDS[this.round];
    const t = Math.max(0, this.elapsed - cfg.delay);
    const bx = Math.round(X1 + 40 - (t / cfg.sweep) * (X1 + 40 - X0 + 30));
    this.beam?.setX(bx);
    this.beamCore?.setX(bx + 11);
    let melted = false;
    for (const pl of this.piles) {
      if (!pl.taken && !pl.melted && pl.x >= bx && this.elapsed > cfg.delay) {
        pl.melted = true;
        pl.img.setVisible(false); pl.txt.setVisible(false); pl.glow.setVisible(false);
        melted = true;
      }
    }
    if (melted || bx < X0 - 30) {
      const left = this.piles.filter((pl) => !pl.taken && !pl.melted).reduce((s, pl) => s + pl.v, 0);
      const need = this.tents.reduce((s, tn) => s + Math.max(0, tn.need - tn.have), 0) + (cfg.jar && !this.jarDone ? 1 : 0);
      if (left + this.carried < need) this.fail(STAGE9.melted);
    }
  }

  private updateSabbath(delta: number) {
    this.elapsed += delta;
    for (const w of this.walkers) {
      if (w.state === "idle" && this.elapsed >= w.t) {
        w.state = "walk";
        w.img.setVisible(true);
        w.glow.setVisible(true);
      }
      if (w.state !== "walk") continue;
      const y = w.img.y + (WALK_SPEED * delta) / 1000;
      w.img.setY(y).setDepth(y);
      w.glow.setPosition(w.img.x, y - 12);
      const idx = this.walkers.indexOf(w);
      const it = this.interactables[TENTS.length + 1 + PILE_SLOTS + idx];
      it.x = w.img.x; it.y = y - 4;
      if (y >= WALK_FAIL_Y) { this.fail(STAGE9.sabbathFail); return; }
    }
  }
}

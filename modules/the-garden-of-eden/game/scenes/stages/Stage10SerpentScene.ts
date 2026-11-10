import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerGenesisTextures } from "@/modules/the-garden-of-eden/game/utils/genesisTextures";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { registerEdenTextures } from "@/modules/the-garden-of-eden/game/utils/edenTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 320;
const H = 240;
const EVE_AT: [number, number] = [172, 150];
const ADAM_AT: [number, number] = [132, 176];
const NEED = [6, 8, 10]; // smoke clouds to block per wave
// the serpent's three lies and God's truth against each
const DEBATE = [
  { q: "Rắn: “Thật sao? Chúa cấm các ngươi ăn MỌI cây trong vườn ư?”", ok: "Không! Chúa cho ăn mọi cây, chỉ trừ một cây giữa vườn để chúng ta nhớ Chúa là Đấng Tạo Hóa.", bad: ["Đúng vậy, Chúa cấm chúng ta ăn mọi cây trong vườn.", "Chúng ta chỉ được ăn khi nào Rắn cho phép."] },
  { q: "Rắn: “Chẳng chết đâu! Chúa sợ các ngươi ăn vào sẽ mở mắt bằng Thiên Chúa đấy!”", ok: "Đó là lời nói dối kiêu ngạo! Mọi ơn lành Chúa đều đã ban vì yêu thương con người.", bad: ["Có thể Chúa giấu chúng ta một điều gì đó tốt hơn.", "Chắc không sao đâu, chỉ thử một lần thôi."] },
  { q: "Rắn: “Nhìn kìa, trái này thật ngon lành, đẹp mắt và đáng quý!”", ok: "Đẹp mắt chưa chắc là tốt. Chúa đã dặn, và vâng lời Chúa mới đem lại bình an thật.", bad: ["Trái đẹp thế thì chắc chắn tốt cho chúng ta.", "Ăn một miếng nhỏ thì Chúa sẽ không biết đâu."] },
];
interface Puff { s: Phaser.GameObjects.Sprite; tx: number; ty: number; vx: number; vy: number }
interface Trap { s: Phaser.GameObjects.Sprite; t: number }

/** Stage 10: shield the couple from the serpent's smoke (3 waves), refute each lie with God's word, then the Fall. */
export class Stage10SerpentScene extends BaseGenesisScene {
  private wave = 0;
  private mode: "idle" | "wave" | "talk" | "done" = "idle";
  private puffs: Puff[] = [];
  private traps: Trap[] = [];
  private blocked = 0;
  private spawnT = 0;
  private trapT = 0;
  private invuln = 0;
  private shield?: Phaser.GameObjects.Image;
  private meter?: Phaser.GameObjects.Text;
  private eve?: Phaser.GameObjects.Sprite;
  private adam?: Phaser.GameObjects.Sprite;

  constructor() {
    super("Stage10SerpentScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_10_con_ran_trai_cam";
    this.spawn = [210, 190];
  }

  create() {
    this.wave = 0;
    this.mode = "idle";
    this.puffs = [];
    this.traps = [];
    this.blocked = 0;
    this.invuln = 0;
    this.intro = { illustration: "serpent", speaker: STAGE_TEXT.s10.speaker, lines: STAGE_TEXT.s10.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerGenesisTextures(this);
    registerStageTextures(this);
    registerEdenTextures(this);
    this.add.tileSprite(0, 0, W, H, "gen_forestfloor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H, 0x1e1b4b, 0.35).setOrigin(0).setDepth(DEPTH.LIGHT); // uneasy dusk
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0x5b21b6).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    this.add.image(160, 84, "gen_tree_knowledge").setOrigin(0.5, 1).setDepth(84);
    this.block(160, 78, 14, 12);
    const serp = this.add.sprite(130, 60, "gen_serpent", 0).setOrigin(0.5, 1).setDepth(DEPTH.FX - 5);
    if (!this.anims.exists("gen_serpent_a")) this.anims.create({ key: "gen_serpent_a", frames: this.anims.generateFrameNumbers("gen_serpent", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    serp.play("gen_serpent_a");
    this.eve = this.add.sprite(...EVE_AT, "gen_eve", 0).setOrigin(0.5, 1).setDepth(EVE_AT[1]);
    this.adam = this.add.sprite(...ADAM_AT, "gen_adam", 0).setOrigin(0.5, 1).setDepth(ADAM_AT[1]);
    for (const [x, y] of [[40, 40], [280, 44], [34, 200], [290, 196]]) this.prop(x, y, "gen_tree_s", 8, 6);
    this.shield = this.add.image(0, 0, "gen_shield").setDepth(DEPTH.FX - 4).setVisible(false);
    this.meter = this.add.text(W / 2, 12, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);
  }

  protected onStageStart() {
    this.initGrace(3);
    this.startWave();
  }

  protected onCheckpointRestore() {
    this.startWave(); // a lost wave is simply played again
  }

  private clearField() {
    this.puffs.forEach((p) => p.s.destroy());
    this.traps.forEach((t) => t.s.destroy());
    this.puffs = [];
    this.traps = [];
  }

  private startWave() {
    this.clearField();
    this.blocked = 0;
    this.spawnT = 600;
    this.trapT = 1500;
    this.mode = "wave";
    this.saveCheckpoint(`w${this.wave}`, null, 210, 190);
    this.shield?.setVisible(true);
    this.meter?.setText(`Đợt ${this.wave + 1}/3 · Chặn khói 0/${NEED[this.wave]}`);
  }

  private spawnPuff() {
    const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const sx = Phaser.Math.Clamp(160 + Math.cos(a) * 170, 14, W - 14), sy = Phaser.Math.Clamp(150 + Math.sin(a) * 120, 14, H - 14);
    const [tx, ty] = Math.random() < 0.6 ? EVE_AT : ADAM_AT;
    const d = Math.hypot(tx - sx, ty - 10 - sy) || 1, sp = 36 + this.wave * 12;
    this.puffs.push({ s: this.add.sprite(sx, sy, "gen_smoke", 0).setDepth(DEPTH.FX - 3), tx, ty: ty - 10, vx: ((tx - sx) / d) * sp, vy: ((ty - 10 - sy) / d) * sp });
  }

  private spawnTrap() {
    const x = Phaser.Math.Between(30, W - 30), y = Phaser.Math.Between(110, H - 24);
    if (Math.hypot(x - this.player.x, y - this.player.y) < 36) return;
    this.traps.push({ s: this.add.sprite(x, y, "gen_trap", 0).setDepth(DEPTH.RUG + 2), t: 0 });
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.dialogueOpen || this.mode !== "wave") return;
    const dt = Math.min(delta, 50) / 1000;
    const px = this.player.x, py = this.player.y + 4;
    this.shield?.setPosition(Math.round(px), Math.round(py)).setDepth(this.player.depth + 1);

    this.spawnT -= delta;
    if (this.spawnT <= 0 && this.puffs.length < 6) { // no total cap: keep throwing until the quota is blocked
      this.spawnPuff();
      this.spawnT = 1200 - this.wave * 220;
    }
    this.trapT -= delta;
    if (this.trapT <= 0 && this.traps.length < 3) { this.spawnTrap(); this.trapT = 2200; }

    for (const p of [...this.puffs]) {
      p.s.x += p.vx * dt; p.s.y += p.vy * dt;
      p.s.setFrame(Math.floor((time ?? 0) / 250) % 2).setPosition(Math.round(p.s.x), Math.round(p.s.y));
      if (Math.hypot(p.s.x - px, p.s.y - py) < 15) { // the Shield of Truth catches it
        this.puffs.splice(this.puffs.indexOf(p), 1);
        this.sparkleBurst(p.s.x, p.s.y, 5);
        p.s.destroy();
        audio.sfx("chime");
        this.blocked++;
        this.meter?.setText(`Đợt ${this.wave + 1}/3 · Chặn khói ${this.blocked}/${NEED[this.wave]}`);
        if (this.blocked >= NEED[this.wave]) return this.debate();
      } else if (Math.hypot(p.s.x - p.tx, p.s.y - p.ty) < 9) { // it reached them
        this.puffs.splice(this.puffs.indexOf(p), 1);
        p.s.destroy();
        this.hitFx(p.tx === EVE_AT[0] ? this.eve : this.adam, p.tx, p.ty);
        if (this.loseGrace()) return;
      }
    }
    for (const t of [...this.traps]) {
      t.t += delta;
      t.s.setFrame(t.t < 1300 ? Math.floor(t.t / 160) % 2 : 1); // blinks, then goes off
      if (t.t >= 1300 && t.t < 1900 && this.time.now > this.invuln && Math.hypot(t.s.x - px, t.s.y - py) < 14) {
        this.invuln = this.time.now + 1300;
        this.hitFx(this.player, px, py - 10);
        if (this.loseGrace()) return;
      }
      if (t.t >= 1900) { this.traps.splice(this.traps.indexOf(t), 1); t.s.destroy(); }
    }
  }

  /** Hit feedback: red flash + shake on the victim, dark burst, floating "-1", meter blink. */
  private hitFx(target: Phaser.GameObjects.Sprite | undefined, x: number, y: number) {
    if (target) {
      const bx = target.x;
      target.setTint(0xff5555);
      this.time.delayedCall(250, () => target.active && target.clearTint());
      this.tweens.add({ targets: target, x: { from: bx - 2, to: bx + 2 }, duration: 50, yoyo: true, repeat: 3, onComplete: () => target.active && target.setX(bx) });
    }
    this.sparkleBurst(x, y, 8);
    const t = this.add.text(Math.round(x), Math.round(y - 8), "-1 Ân Sủng", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fca5a5", backgroundColor: "#0f172acc", padding: { x: 2, y: 1 }, resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);
    this.tweens.add({ targets: t, y: t.y - 14, alpha: 0, duration: 900, ease: "Stepped", easeParams: [5], onComplete: () => t.destroy() });
    this.meter?.setColor("#f87171");
    this.time.delayedCall(400, () => this.meter?.setColor("#fde68a"));
    this.cameras.main.flash(120, 255, 60, 60);
  }

  private debate() {
    this.mode = "talk";
    this.clearField();
    this.shield?.setVisible(false);
    const d = DEBATE[this.wave];
    const opts = Phaser.Utils.Array.Shuffle([d.ok, ...d.bad]);
    this.talk("Con Rắn", [d.q, "Em hãy chọn Lời Chúa đúng để đáp lại."], undefined, opts.map((o) => ({
      label: o,
      onSelect: () => {
        if (o === d.ok) return this.truth();
        audio.sfx("wrong");
        this.talk("Chúa Thánh Thần", ["Đó là lời của Con Rắn đấy! Hãy nhớ điều Chúa thật sự đã phán. Đợt này sẽ bắt đầu lại."], () => this.resetToCheckpoint());
      },
    })));
  }

  private truth() {
    audio.sfx("bless");
    this.cameras.main.flash(300, 255, 244, 180);
    this.wave++;
    if (this.wave < NEED.length) return this.talk("Chúa Thánh Thần", [`Đúng rồi! Lời Chúa là sự thật. Con Rắn sắp tung đợt cám dỗ ${this.wave + 1}.`], () => this.startWave());
    this.fall();
  }

  /** Both choose freely and eat; the Eden sky darkens and thorns spring up. */
  private fall() {
    this.mode = "done";
    this.meter?.setText("");
    this.talk("Cuộn Sách Sáng Thế", STAGE_TEXT.s10.fall.map(tr), () => {
      audio.sfx("wrong");
      this.cameras.main.shake(700, 0.012);
      const dark = this.add.rectangle(0, 0, W, H, 0x05060d, 0).setOrigin(0).setDepth(DEPTH.FX - 6);
      this.tweens.add({ targets: dark, alpha: 0.6, duration: 1400, ease: "Stepped", easeParams: [6] });
      for (let i = 0; i < 9; i++) this.time.delayedCall(i * 130, () => this.add.image(Phaser.Math.Between(90, 230), Phaser.Math.Between(88, 130), "gen_thorn").setDepth(DEPTH.FX - 5));
      this.time.delayedCall(2200, () => this.finishStage(STAGE_TEXT.s10));
    });
  }
}

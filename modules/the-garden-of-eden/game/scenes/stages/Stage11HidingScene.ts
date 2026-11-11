import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerGenesisTextures } from "@/modules/the-garden-of-eden/game/utils/genesisTextures";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { registerEdenTextures } from "@/modules/the-garden-of-eden/game/utils/edenTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 320;
const H = 240;
const ADAM_AT: [number, number] = [90, 50];
const EVE_AT: [number, number] = [302, 126];
const LOCKS = [{ x: 192, y: 112 }, { x: 258, y: 120 }]; // Light Locks: north gate (Adam), east gate (Eve)
const BUSHES: [number, number][] = [[40, 224], [104, 224], [210, 224], [268, 224], [60, 140], [130, 140], [200, 140], [250, 140]];
const CONE = { len: 62, half: 0.5 };
// Fear Phantoms patrol one lane each
const PATROLS = [
  { y: 190, min: 24, max: 296, speed: 44 },
  { y: 118, min: 24, max: 256, speed: 36 },
];
// "Nối Mạch Chân Thành": the right thought for each step, from hiding/blaming to confessing
const STEPS = [
  { q: tx("Bước 1: Điều đầu tiên cần làm là gì?", "Step 1: What is the first thing to do?"), ok: tx("Nhận ra mình đã sai và thấy hối hận", "Realize you were wrong and feel sorry"), bad: [tx("Chối là mình không làm", "Deny that you did it"), tx("Trốn kỹ hơn vào bụi cây", "Hide deeper in the bushes")] },
  { q: tx("Bước 2: Còn chuyện đổ lỗi thì sao?", "Step 2: What about blaming others?"), ok: tx("Không đổ lỗi cho người khác", "Do not blame anyone else"), bad: [tx("Nói đó là lỗi của người bên cạnh", "Say it was the other person's fault"), tx("Nói rằng ai cũng làm như vậy", "Say everyone does it")] },
  { q: tx("Bước 3: Rồi phải làm gì khi Chúa gọi “Ngươi ở đâu?”", "Step 3: What do you do when God calls, “Where are you?”"), ok: tx("Can đảm bước ra thưa thật với Chúa", "Bravely step out and tell God the truth"), bad: [tx("Đợi Chúa đi qua rồi mới ra", "Wait until God passes by"), tx("Nhờ người khác nói thay", "Ask someone else to speak for you")] },
  { q: tx("Bước 4: Cuối cùng, em xin điều gì?", "Step 4: Finally, what do you ask for?"), ok: tx("Xin Chúa thứ tha và quyết tâm sửa mình", "Ask God's forgiveness and resolve to do better"), bad: [tx("Hứa sẽ không để ai biết nữa", "Promise no one will find out again"), tx("Quên chuyện này đi cho nhẹ lòng", "Forget about it to feel lighter")] },
];
interface Phantom { s: Phaser.GameObjects.Sprite; y: number; min: number; max: number; speed: number; dir: 1 | -1; x: number }

/** Stage 11: stealth maze. Hide in bushes from the Fear Phantoms' sight cones, open Light Locks, find Adam and Eve, then untangle blame. */
export class Stage11HidingScene extends BaseGenesisScene {
  private phantoms: Phantom[] = [];
  private cones?: Phaser.GameObjects.Graphics;
  private locks: Phaser.GameObjects.Sprite[] = [];
  private gates: ReturnType<BaseGenesisScene["door"]>[] = [];
  private thorn!: ReturnType<BaseGenesisScene["door"]>;
  private thornT = 0;
  private found = [false, false];
  private opened = [false, false];
  private busy = false;
  private invuln = 0;
  private adamS?: Phaser.GameObjects.Sprite;
  private eveS?: Phaser.GameObjects.Sprite;

  constructor() {
    super("Stage11HidingScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_11_tron_chay_trong_vuon";
    this.spawn = [24, 218];
  }

  create() {
    this.phantoms = [];
    this.locks = [];
    this.gates = [];
    this.found = [false, false];
    this.opened = [false, false];
    this.busy = false;
    this.invuln = 0;
    this.thornT = 0;
    this.intro = { illustration: "hiding", speaker: STAGE_TEXT.s11.speaker, lines: STAGE_TEXT.s11.intro.map(tr) };
    super.create();
  }

  private thorns(x0: number, y0: number, x1: number, y1: number) {
    this.add.tileSprite((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0, "gen_thorn").setDepth(y1);
    this.block((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0);
  }

  protected buildWorld() {
    registerGenesisTextures(this);
    registerStageTextures(this);
    registerEdenTextures(this);
    this.add.tileSprite(0, 0, W, H, "gen_forestfloor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H, 0x1e1b4b, 0.45).setOrigin(0).setDepth(DEPTH.LIGHT); // dusk
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0x4c1d95).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    this.thorns(8, 144, 112, 160); this.thorns(176, 144, W - 8, 160); // south room -> corridor (rhythm gate sits in the gap)
    this.thorns(8, 80, 176, 96); this.thorns(208, 80, W - 8, 96); // corridor -> north room (Light Lock gate in the gap)
    this.thorns(272, 96, 288, 112); this.thorns(272, 128, 288, 144); // east gap to Eve
    this.thorn = this.door(128, 152, 32, 16, "gen_thorn");
    this.gates = [this.door(192, 88, 32, 16, "gen_thorn"), this.door(280, 120, 16, 16, "gen_thorn")];
    LOCKS.forEach((l, i) => {
      this.locks.push(this.add.sprite(l.x, l.y, "gen_lock", 0).setOrigin(0.5, 1).setDepth(l.y));
      this.interactables.push({ x: l.x, y: l.y - 6, r: 22, label: tx("[A] Đèn Lương Tâm mở khóa", "[A] Unlock the Conscience Lamp"), active: () => !this.opened[i], act: () => this.unlock(i) });
    });
    BUSHES.forEach(([x, y]) => this.add.image(x, y, "gen_bush").setOrigin(0.5, 1).setDepth(y + 1));
    this.adamS = this.add.sprite(...ADAM_AT, "gen_adam", 0).setOrigin(0.5, 1).setDepth(ADAM_AT[1]);
    this.eveS = this.add.sprite(...EVE_AT, "gen_eve", 0).setOrigin(0.5, 1).setDepth(EVE_AT[1]);
    this.interactables.push(
      { x: ADAM_AT[0], y: ADAM_AT[1], r: 24, label: tx("[A] Nói chuyện với A-đam", "[A] Talk to Adam"), active: () => !this.found[0], act: () => this.find(0) },
      { x: EVE_AT[0], y: EVE_AT[1], r: 24, label: tx("[A] Nói chuyện với E-va", "[A] Talk to Eve"), active: () => !this.found[1], act: () => this.find(1) },
    );
    if (!this.anims.exists("gen_phantom_a")) this.anims.create({ key: "gen_phantom_a", frames: this.anims.generateFrameNumbers("gen_phantom", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    PATROLS.forEach((p, i) => this.phantoms.push({ s: this.add.sprite(0, 0, "gen_phantom").setOrigin(0.5, 1).play("gen_phantom_a"), y: p.y, min: p.min, max: p.max, speed: p.speed, dir: i ? -1 : 1, x: i ? p.max : p.min }));
    this.cones = this.add.graphics().setDepth(DEPTH.FX - 4);
  }

  protected onStageStart() {
    this.saveCheckpoint("start", null, 24, 218);
  }

  protected onCheckpointRestore() {
    this.invuln = this.time.now + 1200;
  }

  private unlock(i: number) {
    audio.sfx("chime");
    this.opened[i] = true;
    this.locks[i].setFrame(1);
    this.gates[i].set(false);
    this.sparkleBurst(LOCKS[i].x, LOCKS[i].y - 8, 8);
    this.saveCheckpoint(`lock${i}`, null, LOCKS[i].x, LOCKS[i].y + 6);
  }

  private find(i: number) {
    this.found[i] = true;
    audio.sfx("pickup");
    const lines = i === 0
      ? [tx("A-đam: “Tôi sợ lắm... Chính người nữ Chúa cho ở với tôi đã đưa trái cây cho tôi ăn!”", "Adam: “I was so afraid... The woman You gave me gave me the fruit to eat!”")]
      : [tx("E-va: “Không phải lỗi của tôi... Con rắn đã lừa dối tôi, tôi mới ăn!”", "Eve: “It's not my fault... The serpent deceived me, so I ate!”")];
    this.talk(i === 0 ? tx("A-đam", "Adam") : "E-va", lines, () => {
      if (this.found[0] && this.found[1]) this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), [tx("Cả hai đều đang trốn tránh và đổ lỗi. Em hãy giúp họ nối lại những suy nghĩ chân thành để can đảm bước ra nhé.", "Both are hiding and blaming. Help them connect sincere thoughts so they can bravely step out.")], () => this.puzzle(0));
    });
  }

  private puzzle(n: number) {
    if (n >= STEPS.length) return this.finale();
    const s = STEPS[n];
    this.talk(tx("Mạch Chân Thành", "Path of Sincerity"), [s.q], undefined, Phaser.Utils.Array.Shuffle([s.ok, ...s.bad]).map((o) => ({
      label: o,
      onSelect: () => {
        if (o === s.ok) { audio.sfx("chime"); return this.puzzle(n + 1); }
        audio.sfx("wrong");
        this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), [tx("Chưa đúng rồi. Hãy nghĩ xem điều gì làm lòng mình nhẹ nhõm và thật thà hơn.", "Not quite. Think about what makes your heart lighter and more honest.")], () => this.puzzle(n));
      },
    })));
  }

  private finale() {
    this.busy = true;
    audio.sfx("bless");
    this.cameras.main.flash(700, 255, 244, 180);
    for (const s of [this.adamS, this.eveS]) if (s) this.tweens.add({ targets: s, x: this.player.x + (s === this.adamS ? -16 : 16), y: this.player.y + 14, duration: 1500, ease: "Stepped", easeParams: [12], onUpdate: () => s.setDepth(s.y) });
    this.time.delayedCall(1900, () => this.finishStage(STAGE_TEXT.s11));
  }

  private hidden(px: number, py: number) {
    return BUSHES.some(([x, y]) => Math.hypot(px - x, py - (y - 6)) < 13);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.dialogueOpen || this.busy) return;
    const dt = Math.min(delta, 50) / 1000;
    this.thornT += delta;
    const open = this.thornT % 3000 < 1800; // the Thorn Gate breathes: open 1.8 s, shut 1.2 s
    if (this.thorn.isClosed() === open) this.thorn.set(!open);

    const px = this.player.x, py = this.player.y + 9, hide = this.hidden(px, py);
    this.player.setAlpha(hide ? 0.55 : 1);
    this.cones?.clear().fillStyle(0xdc2626, 0.28);
    for (const p of this.phantoms) {
      p.x += p.dir * p.speed * dt;
      if (p.x > p.max || p.x < p.min) { p.dir = (p.dir * -1) as 1 | -1; p.x = Phaser.Math.Clamp(p.x, p.min, p.max); }
      p.s.setPosition(Math.round(p.x), p.y).setDepth(p.y + 4).setFlipX(p.dir < 0);
      const a = p.dir > 0 ? 0 : Math.PI, ox = p.x, oy = p.y - 12;
      this.cones?.fillTriangle(Math.round(ox), Math.round(oy), Math.round(ox + Math.cos(a - CONE.half) * CONE.len), Math.round(oy + Math.sin(a - CONE.half) * CONE.len), Math.round(ox + Math.cos(a + CONE.half) * CONE.len), Math.round(oy + Math.sin(a + CONE.half) * CONE.len));
      const dx = px - ox, dy = py - oy, d = Math.hypot(dx, dy);
      const seen = !hide && d < CONE.len && Math.abs(Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - a)) < CONE.half;
      if (seen && this.time.now > this.invuln) {
        this.invuln = this.time.now + 1200;
        audio.sfx("wrong");
        this.resetToCheckpoint();
        return;
      }
    }
  }
}

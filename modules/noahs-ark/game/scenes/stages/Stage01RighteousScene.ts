import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerStageTextures } from "@/modules/noahs-ark/game/utils/stageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 320;
const H = 240;
const CONE = { len: 54, half: 0.5 };
// Conscience Stones (each one lit = a checkpoint)
const STONES = [
  { x: 80, y: 214, name: tx("Ngay Thẳng", "Honesty"), line: tx("Nói thật và làm điều đúng, dù không ai nhìn thấy.", "Tell the truth and do what is right, even when no one is watching.") },
  { x: 284, y: 124, name: tx("Hiền Hòa", "Gentleness"), line: tx("Đáp lại lời nặng nề bằng lời dịu dàng.", "Answer harsh words with gentle ones.") },
  { x: 56, y: 120, name: tx("Trung Tín", "Faithfulness"), line: tx("Giữ lời hứa với Chúa và với mọi người.", "Keep your promises to God and to everyone.") },
  { x: 112, y: 46, name: tx("Cầu Nguyện", "Prayer"), line: tx("Dành thời gian trò chuyện với Chúa mỗi ngày.", "Spend time talking with God every day.") },
];
// Faith Walls: shelter from the Tempting Wind (wind blows left → right, so the lee is the right-hand side) and from sight
const WALLS: [number, number][] = [[130, 206], [236, 212], [200, 130], [96, 134], [170, 50], [40, 52]];
// Discord Shadows patrol one lane each
const PATROLS = [
  { y: 190, min: 24, max: 296, speed: 40, dir: 1 },
  { y: 112, min: 24, max: 296, speed: 34, dir: -1 },
  { y: 40, min: 24, max: 196, speed: 40, dir: 1 },
];
const NOAH_AT: [number, number] = [268, 64];
interface Shadow { s: Phaser.GameObjects.Sprite; y: number; min: number; max: number; speed: number; dir: 1 | -1; x: number }

/** Stage 1: lantern stealth. Light 4 Conscience Stones, slip past the Discord Shadows, shelter from the wind, climb Prayer Hill. */
export class Stage01RighteousScene extends BaseNoahScene {
  private shadows: Shadow[] = [];
  private cones?: Phaser.GameObjects.Graphics;
  private wind?: Phaser.GameObjects.Graphics;
  private warn?: Phaser.GameObjects.Text;
  private glow?: Phaser.GameObjects.Image;
  private lit = [false, false, false, false];
  private stoneS: Phaser.GameObjects.Sprite[] = [];
  private gate!: ReturnType<BaseNoahScene["door"]>;
  private invuln = 0;
  private busy = false;
  private t0 = 0;

  constructor() {
    super("Stage01RighteousScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_01_nguoi_cong_chinh";
    this.spawn = [24, 218];
  }

  create() {
    this.shadows = [];
    this.stoneS = [];
    this.lit = [false, false, false, false];
    this.invuln = 0;
    this.busy = false;
    this.t0 = 0;
    this.intro = { illustration: "stage1", speaker: NOAH_TEXT.s1.speaker, lines: NOAH_TEXT.s1.intro.map(tr) };
    super.create();
  }

  private fence(x0: number, y0: number, x1: number, y1: number) {
    this.add.tileSprite((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0, "noah_fence").setDepth(y1);
    this.block((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0);
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, W, H, "noah_dust").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(224, 8, 88, 76, "noah_grass").setOrigin(0).setDepth(DEPTH.FLOOR + 0.1); // Prayer Hill: the only green
    this.add.rectangle(0, 0, W, H, 0x1e1b4b, 0.35).setOrigin(0).setDepth(DEPTH.LIGHT); // dusk
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0x4c1d95).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    this.fence(8, 150, 232, 162); this.fence(264, 150, W - 8, 162); // bottom lane -> middle lane (gap at the right)
    this.fence(8, 84, 40, 96); this.fence(72, 84, W - 8, 96); // middle lane -> top lane (gap at the left)
    this.gate = this.door(216, 46, 16, 76, "noah_gate");

    STONES.forEach((s, i) => {
      this.stoneS.push(this.add.sprite(s.x, s.y, "noah_pedestal", 0).setOrigin(0.5, 1).setDepth(s.y));
      this.block(s.x, s.y - 4, 12, 8);
      this.interactables.push({ x: s.x, y: s.y - 6, r: 24, label: tx(`[A] Bệ Đá ${s.name}`, `[A] Stone Altar ${s.name}`), active: () => !this.lit[i], act: () => this.light(i) });
    });
    WALLS.forEach(([x, y]) => this.prop(x, y, "noah_wall", 16, 6));
    // Prayer Hill: altar, trees, Noah and his family
    this.add.image(NOAH_AT[0] + 24, NOAH_AT[1] + 14, "noah_altar").setOrigin(0.5, 1).setDepth(NOAH_AT[1] + 14);
    this.add.image(300, 40, "noah_cypress").setOrigin(0.5, 1).setDepth(40);
    for (const [k, dx] of [["noah_wife", -16], ["noah_shem", 10], ["noah_ham", 22]] as const) this.add.sprite(NOAH_AT[0] + dx, NOAH_AT[1] + 34, k).setOrigin(0.5, 1).setDepth(NOAH_AT[1] + 34);
    this.add.sprite(...NOAH_AT, "noah_noah").setOrigin(0.5, 1).setDepth(NOAH_AT[1]);
    this.interactables.push({ x: NOAH_AT[0], y: NOAH_AT[1] - 6, r: 26, label: tx("[A] Nói chuyện với ông Nô-ê", "[A] Talk to Noah"), active: () => this.lit.every(Boolean) && !this.busy, act: () => this.meetNoah() });

    if (!this.anims.exists("noah_shadow")) this.anims.create({ key: "noah_shadow", frames: this.anims.generateFrameNumbers("noah_shadow", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    PATROLS.forEach((p) => this.shadows.push({ s: this.add.sprite(0, 0, "noah_shadow").setOrigin(0.5, 1).play("noah_shadow"), y: p.y, min: p.min, max: p.max, speed: p.speed, dir: p.dir as 1 | -1, x: p.dir > 0 ? p.min : p.max }));
    this.cones = this.add.graphics().setDepth(DEPTH.FX - 4);
    this.wind = this.add.graphics().setDepth(DEPTH.FX - 3);
    this.warn = this.add.text(W / 2, 14, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI).setVisible(false);
  }

  protected onStageStart() {
    this.glow = this.add.image(this.player.x, this.player.y, "noah_glow_gold").setDepth(DEPTH.FX - 5).setAlpha(0.7); // the Righteous Lantern
    this.saveCheckpoint("start", null, 24, 218);
    this.t0 = this.time.now;
  }

  protected onCheckpointRestore() {
    this.invuln = this.time.now + 1500;
    this.t0 = this.time.now - 200; // restart the wind cycle early so the child gets a calm moment
  }

  private light(i: number) {
    this.lit[i] = true;
    audio.sfx("chime");
    this.stoneS[i].setFrame(1);
    this.sparkleBurst(STONES[i].x, STONES[i].y - 12, 8);
    const s = STONES[i];
    this.saveCheckpoint(`stone${i}`, null, s.x, s.y + 6);
    const n = this.lit.filter(Boolean).length;
    this.talk(tx(`Bệ Đá ${s.name}`, `Stone Altar ${s.name}`), [s.line, tx(`Đã thắp sáng ${n}/4 Bệ Đá Lương Tâm.`, `${n}/4 Conscience Altars lit.`)], () => {
      if (n === 4) {
        this.gate.set(false);
        audio.sfx("door");
        this.talk(tx("Đồi Cầu Nguyện", "Prayer Hill"), [tx("Cổng lên Đồi Cầu Nguyện đã mở! Ông Nô-ê đang chờ em trên đó.", "The gate to Prayer Hill is open! Noah is waiting for you up there.")]);
      }
    });
  }

  private meetNoah() {
    this.busy = true;
    this.talk(tx("Thiên Chúa", "God"), [tx("“Nô-ê, Ta thấy ngươi là người công chính giữa những người đồng thời. Cơn hồng thủy sẽ đến. Hãy đóng một con tàu lớn để cứu gia đình ngươi và muôn loài.” (St 6, 13-14)", "“Noah, I see that you are righteous among your generation. The flood is coming. Build a great ark to save your family and all creatures.” (Gen 6:13-14)")], () =>
      this.talk(tx("Ông Nô-ê", "Noah"), [tx("“Lạy Chúa, con xin vâng. Con sẽ làm đúng như lời Chúa dạy.”", "“Lord, I will obey. I will do just as You command.”")], () => this.finishStage(NOAH_TEXT.s1))
    );
  }

  /** Lee of a Faith Wall: right-hand side, same row. Sheltered from wind and sight. */
  private sheltered(px: number, py: number) {
    return WALLS.some(([x, y]) => px >= x - 16 && px <= x + 40 && Math.abs(py - (y - 4)) < 15);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    this.glow?.setPosition(Math.round(this.player.x), Math.round(this.player.y - 2));
    if (this.introActive || this.dialogueOpen || this.busy) return;
    const dt = Math.min(delta, 50) / 1000;
    const px = this.player.x, py = this.player.y + 9, cover = this.sheltered(px, py);
    this.player.setAlpha(cover ? 0.6 : 1);

    // Tempting Wind: 9 s cycle — long warning 6.5-8.3 s (shelter spots pulse), gust 8.3-8.9 s
    const ph = (this.time.now - this.t0) % 9000;
    const warning = ph >= 6500 && ph < 8300, gust = ph >= 8300 && ph < 8900;
    this.warn?.setVisible(warning || gust).setText(warning ? tx("Gió sắp thổi! Chạy ra sau Tường Đá (bên phải)!", "The wind is coming! Run behind the Stone Wall (on the right)!") : tx("Gió thổi!", "Wind!"));
    this.wind?.clear();
    if (warning && !gust && !cover && (ph / 200 | 0) % 2) { // flash safe spots on the ground
      this.wind?.fillStyle(0xfde68a, 0.35);
      for (const [x, y] of WALLS) this.wind?.fillRect(x + 16, y - 16, 24, 16);
    }
    if (warning || gust) {
      this.wind?.fillStyle(0xe0f2fe, gust ? 0.55 : 0.2);
      for (let i = 0; i < 14; i++) this.wind?.fillRect(((i * 53 + (gust ? ph * 0.4 : 0)) % W) | 0, (20 + ((i * 37) % 210)) | 0, gust ? 22 : 10, 1);
    }
    this.glow?.setAlpha(gust && !cover ? 0.15 : 0.7);
    if (gust && !cover && this.time.now > this.invuln) {
      this.invuln = this.time.now + 1500;
      audio.sfx("wrong");
      this.talk(tx("Đèn Công Chính", "Lantern of Righteousness"), [tx("Gió đã thổi tắt đèn! Em quay lại Bệ Đá gần nhất để thắp lại.", "The wind blew out the lantern! Go back to the nearest Stone Altar to relight it.")], () => this.resetToCheckpoint());
      return;
    }

    this.cones?.clear().fillStyle(0xdc2626, 0.28);
    for (const p of this.shadows) {
      p.x += p.dir * p.speed * dt;
      if (p.x > p.max || p.x < p.min) { p.dir = (p.dir * -1) as 1 | -1; p.x = Phaser.Math.Clamp(p.x, p.min, p.max); }
      p.s.setPosition(Math.round(p.x), p.y).setDepth(p.y + 4).setFlipX(p.dir < 0);
      const a = p.dir > 0 ? 0 : Math.PI, ox = p.x, oy = p.y - 10;
      this.cones?.fillTriangle(Math.round(ox), Math.round(oy), Math.round(ox + Math.cos(a - CONE.half) * CONE.len), Math.round(oy + Math.sin(a - CONE.half) * CONE.len), Math.round(ox + Math.cos(a + CONE.half) * CONE.len), Math.round(oy + Math.sin(a + CONE.half) * CONE.len));
      const dx = px - ox, dy = py - oy, d = Math.hypot(dx, dy);
      const seen = !cover && d < CONE.len && Math.abs(Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - a)) < CONE.half;
      if (seen && this.time.now > this.invuln) {
        this.invuln = this.time.now + 1500;
        audio.sfx("wrong");
        this.resetToCheckpoint();
        return;
      }
    }
  }
}

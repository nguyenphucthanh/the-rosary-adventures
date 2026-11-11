import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 320;
const H = 240;
const CX = 160;
const CY = 120;
const R = 70;
// six Nature Pads, one per day of work: hexagon around the Holy Hill
const PADS = [
  { name: tx("Chuông Ánh Sáng", "Bell of Light"), note: 72, x: CX, y: CY - R },
  { name: tx("Trống Gió Trời", "Drum of the Sky Wind"), note: 74, x: CX + 61, y: CY - 35 },
  { name: tx("Đàn Cây Cối", "Harp of the Trees"), note: 76, x: CX + 61, y: CY + 35 },
  { name: tx("Chuông Sao Đêm", "Bell of the Night Stars"), note: 79, x: CX, y: CY + R },
  { name: tx("Sáo Chim Biển", "Flute of the Sea Birds"), note: 81, x: CX - 61, y: CY + 35 },
  { name: tx("Tiếng Ca Con Người", "Song of Mankind"), note: 84, x: CX - 61, y: CY - 35 },
];
const ROUNDS = [4, 6, 8]; // notes per movement
const GAP = [760, 650, 470]; // ms between demo notes: movement 3 is faster

/** Stage 7: Simon-Says symphony. The dove plays a melody on the pads; the child plays it back. 3 movements: 4, 6, 8 notes. */
export class Stage07SabbathScene extends BaseGenesisScene {
  private state: "idle" | "listen" | "play" | "done" = "idle";
  private round = 0;
  private seq: number[] = [];
  private idx = 0;
  private pads: Phaser.GameObjects.Sprite[] = [];
  private glows: Phaser.GameObjects.Image[] = [];
  private dove?: Phaser.GameObjects.Sprite;
  private status?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage07SabbathScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_07_ngay_nghi_ngoi";
    this.spawn = [CX, CY + 36];
  }

  create() {
    this.state = "idle";
    this.round = 0;
    this.seq = [];
    this.idx = 0;
    this.pads = [];
    this.glows = [];
    this.intro = { illustration: "sabbath", speaker: STAGE_TEXT.s7.speaker, lines: STAGE_TEXT.s7.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, W, H, "gen_flower_floor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0xfbbf24).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    // sunrise glow ring on the hilltop, and the creatures gathered inside it
    this.add.rectangle(CX, CY, 2 * R + 44, 2 * R + 44, 0xfef08a, 0.12).setDepth(DEPTH.RUG);
    this.add.sprite(CX - 22, CY + 4, "gen_adam", 0).setOrigin(0.5, 1).setDepth(CY + 4);
    this.add.sprite(CX + 28, CY + 6, "gen_sheep", 0).setOrigin(0.5, 1).setDepth(CY + 6);
    this.add.sprite(CX + 6, CY - 12, "gen_deer", 0).setOrigin(0.5, 1).setDepth(CY - 12);

    PADS.forEach((p, i) => {
      this.pads.push(this.add.sprite(p.x, p.y + 10, `gen_pad_${i}`, 0).setOrigin(0.5, 1).setDepth(p.y + 10));
      this.glows.push(this.add.image(p.x, p.y, "gen_glow_gold").setAlpha(0).setDepth(p.y));
      this.block(p.x, p.y + 4, 18, 10);
      this.add.text(p.x, p.y + 16, p.name, { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fef3c7", resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.FX);
    });
    this.dove = this.spawnDove(CX, CY - 30);
    this.status = this.add.text(CX, 14, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);

    this.interactables = PADS.map((p, i) => ({ x: p.x, y: p.y, r: 22, label: `[A] ${p.name}`, active: () => this.state === "play", act: () => this.tap(i) }));
  }

  protected onStageStart() {
    this.startRound();
  }

  private say(s: string) {
    this.status?.setText(s);
  }

  private startRound() {
    let last = -1;
    this.seq = Array.from({ length: ROUNDS[this.round] }, () => {
      let n = Phaser.Math.Between(0, PADS.length - 1);
      if (n === last) n = (n + 1 + Phaser.Math.Between(0, PADS.length - 2)) % PADS.length; // never the same pad twice running
      return (last = n);
    });
    this.playback();
  }

  /** The dove plays the melody; the child listens. */
  private playback() {
    this.state = "listen";
    this.idx = 0;
    this.say(tx(`Chương ${this.round + 1}: ${ROUNDS[this.round]} nốt. Lắng nghe...`, `Movement ${this.round + 1}: ${ROUNDS[this.round]} notes. Listen...`));
    this.seq.forEach((pad, k) =>
      this.time.delayedCall(900 + k * GAP[this.round], () => {
        if (this.dove) this.glideTo(this.dove, PADS[pad].x, PADS[pad].y - 26, 200);
        this.light(pad);
      })
    );
    this.time.delayedCall(900 + this.seq.length * GAP[this.round] + 300, () => {
      if (this.dove) this.glideTo(this.dove, CX, CY - 30, 600);
      this.state = "play";
      this.say(tx("Đến lượt em! Gõ lại giai điệu.", "Your turn! Tap the melody back."));
    });
  }

  private light(i: number, ms = 400) {
    this.pads[i].setFrame(1);
    this.glows[i].setAlpha(0.8);
    audio.note(PADS[i].note);
    this.sparkleBurst(PADS[i].x, PADS[i].y - 4, 4);
    this.time.delayedCall(ms, () => {
      this.pads[i].setFrame(0);
      this.glows[i].setAlpha(0);
    });
  }

  private tap(i: number) {
    this.light(i, 300);
    if (i !== this.seq[this.idx]) { // wrong note: the music stops and the melody is played again
      this.state = "listen";
      audio.sfx("wrong");
      this.say(tx("Chưa đúng. Hãy lắng nghe lại nhé!", "Not quite. Listen again!"));
      this.time.delayedCall(1000, () => this.playback());
      return;
    }
    this.idx++;
    if (this.idx < this.seq.length) return;
    this.state = "idle";
    this.round++;
    if (this.round < ROUNDS.length) {
      this.say("");
      this.time.delayedCall(500, () => {
        audio.sfx("chime");
        this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), [tx(`Tuyệt vời! Chương ${this.round} đã trọn vẹn. Chương tiếp theo dài hơn, em sẵn sàng chưa?`, `Wonderful! Movement ${this.round} is complete. The next one is longer. Ready?`)], () => this.startRound());
      });
      return;
    }
    this.finale();
  }

  private finale() {
    this.state = "done";
    this.say(tx("Bản Giao Hưởng Tạ Ơn", "Symphony of Thanks"));
    PADS.forEach((_, i) => this.time.delayedCall(i * 220, () => this.light(i, 900)));
    this.time.delayedCall(PADS.length * 220 + 300, () => {
      audio.sfx("bless");
      this.cameras.main.flash(700, 255, 244, 180);
      this.sparkleBurst(CX, CY - 20, 16);
      this.time.delayedCall(1200, () => this.finishStage(STAGE_TEXT.s7));
    });
  }
}

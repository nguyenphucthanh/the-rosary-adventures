import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE9, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const START: [number, number] = [52, 128];
const ALTAR_AT: [number, number] = [556, 128];

// 3 Constellations of Gratitude, each with 3 star pads in order (1 -> 2 -> 3)
const CONSTELLATIONS: [number, number][][] = [
  // Constellation 1: Shield of Courage on Mount Gilboa
  [
    [116, 100],
    [156, 152],
    [196, 100],
  ],
  // Constellation 2: Eagle & Lion
  [
    [264, 152],
    [304, 96],
    [344, 152],
  ],
  // Constellation 3: Bow of Jonathan
  [
    [412, 100],
    [452, 128],
    [492, 156],
  ],
];

/** Stage 9 (2 Sm 1, 17-27): Light the 3 Constellations of Gratitude in order and compose the Song of the Bow on the Judean hilltop. */
export class Stage09SongOfTheBowScene extends BaseDavidScene {
  private phase = 0; // 0 = Light 3 Constellations, 1 = Play Lament at Central Altar
  private running = false;
  private finished = false;
  private curConstellation = 0;
  private curStar = 0;
  private starPads: Phaser.GameObjects.Image[][] = [];
  private starGlows: Phaser.GameObjects.Image[][] = [];
  private starLines!: Phaser.GameObjects.Graphics;
  private david!: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage09SongOfTheBowScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_09_khuc_ca_cay_cung";
    this.spawn = START;
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.curConstellation = 0;
    this.curStar = 0;
    this.starPads = [];
    this.starGlows = [];
    this.intro = { illustration: "9", speaker: STAGE9.speaker, lines: STAGE9.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Deep starry night sky over the hills of Judah
    [[0x0f172a, 0, 12], [0x1e1b4b, 12, 10], [0x312e81, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    for (const [sx, sy] of [[44, 8], [108, 16], [176, 6], [248, 14], [320, 8], [392, 18], [468, 6], [536, 14], [604, 8]]) {
      this.add.rectangle(sx, sy, 2, 2, 0xfef08a).setOrigin(0).setDepth(DEPTH.FLOOR);
    }
    this.add.tileSprite(0, 34, W, TOP - 38, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Star-reflecting stone terrace floor
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 4, W, BOTTOM - TOP + 8, 0x1e1b4b, 0.32).setOrigin(0).setDepth(DEPTH.RUG);

    // Bottom cliff border
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.55).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);

    // Olive trees & torches along the memorial terrace
    for (const x of [76, 232, 380, 524]) {
      this.add.image(x, 76, "david_olive_tree").setOrigin(0.5, 1).setDepth(76);
      this.add.image(x, 174, "david_torch").setOrigin(0.5, 1).setDepth(174);
    }

    this.starLines = this.add.graphics().setDepth(DEPTH.RUG + 1);

    // Build 3 Constellations of 3 Star Pads each
    CONSTELLATIONS.forEach((pts, cIdx) => {
      const pads: Phaser.GameObjects.Image[] = [];
      const glows: Phaser.GameObjects.Image[] = [];
      pts.forEach(([px, py], sIdx) => {
        const glow = this.add.image(px, py - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1).setAlpha(0.25);
        const pad = this.add.image(px, py, "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
        const sp = this.add.image(px, py - 10, "sparkle").setDepth(py + 1);
        this.tweens.add({ targets: sp, alpha: { from: 0.3, to: 1 }, duration: 600, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
        this.add
          .text(px, py - 18, `${sIdx + 1}`, {
            fontFamily: "Dearpix, monospace",
            fontSize: "9px",
            color: "#fde68a",
            resolution: 4,
          })
          .setOrigin(0.5, 1)
          .setDepth(py + 2);
        pads.push(pad);
        glows.push(glow);

        this.interactables.push({
          x: px,
          y: py - 4,
          r: 24,
          label: `${tr(STAGE9.starHint)} (${sIdx + 1}/3)`,
          active: () => this.phase === 0 && this.running && this.curConstellation === cIdx && !(cIdx === this.curConstellation && sIdx < this.curStar),
          act: () => this.touchStar(cIdx, sIdx),
        });
      });
      this.starPads.push(pads);
      this.starGlows.push(glows);
    });

    // Memorial Altar & Judah disciples on the east
    this.add.image(ALTAR_AT[0], ALTAR_AT[1] - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);
    this.add.image(ALTAR_AT[0], ALTAR_AT[1], "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
    this.add.image(ALTAR_AT[0], ALTAR_AT[1] - 6, "david_harp").setOrigin(0.5, 1).setDepth(ALTAR_AT[1]);
    this.add.image(ALTAR_AT[0] + 34, ALTAR_AT[1] - 22, "david_abishai").setOrigin(0.5, 1).setDepth(ALTAR_AT[1] - 22);
    this.add.image(ALTAR_AT[0] + 34, ALTAR_AT[1] + 22, "david_joab").setOrigin(0.5, 1).setDepth(ALTAR_AT[1] + 22);

    this.interactables.push({
      x: ALTAR_AT[0],
      y: ALTAR_AT[1] - 6,
      r: 28,
      label: tr(STAGE9.altarHint),
      active: () => this.phase === 1 && this.running && !this.finished,
      act: () => this.playSongOfTheBow(),
    });

    this.david = this.add.image(START[0] - 14, START[1] + 10, "david_harpist").setOrigin(0.5, 1);

    this.label = this.add
      .text(0, 0, "", {
        fontFamily: "Dearpix, monospace",
        fontSize: "10px",
        color: "#fde68a",
        backgroundColor: "#0f172acc",
        padding: { x: 3, y: 1 },
        resolution: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(DEPTH.UI);
  }

  protected onStageStart() {
    this.talk(tx("Đa-vít", "David"), STAGE9.start.map(tr), () => {
      this.running = true;
      this.saveCheckpoint("constellation0", 0, START[0], START[1]);
    });
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.curConstellation = state as number;
    this.curStar = 0;
    this.phase = this.curConstellation >= 3 ? 1 : 0;
    this.running = true;
  }

  private touchStar(cIdx: number, sIdx: number) {
    if (sIdx !== this.curStar) {
      audio.sfx("wrong");
      this.talk(STAGE9.speaker, [tr(STAGE9.wrongStarOrder)]);
      return;
    }

    audio.sfx("chime");
    this.playHarp();
    const [px, py] = CONSTELLATIONS[cIdx][sIdx];
    this.starGlows[cIdx][sIdx].setAlpha(1);
    this.starPads[cIdx][sIdx].setTint(0xfde047);
    this.sparkleBurst(px, py - 8, 8);

    // Draw stepped pixel beam connecting from previous star in constellation
    if (sIdx > 0) {
      const [prevX, prevY] = CONSTELLATIONS[cIdx][sIdx - 1];
      this.drawPixelBeam(prevX, prevY - 6, px, py - 6);
    }

    this.curStar++;
    if (this.curStar >= 3) {
      const doneIdx = this.curConstellation;
      this.curConstellation++;
      this.curStar = 0;
      audio.sfx("bless");
      this.cameras.main.flash(240, 255, 244, 180);
      if (this.curConstellation >= 3) {
        this.phase = 1;
      }
      this.saveCheckpoint(`constellation${this.curConstellation}`, this.curConstellation, this.player.x, this.player.y);
      this.talk(STAGE9.speaker, [tr(STAGE9.constellationLit[doneIdx])]);
    }
  }

  private drawPixelBeam(x1: number, y1: number, x2: number, y2: number) {
    const steps = 16;
    this.starLines.fillStyle(0xfde047, 0.9);
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(x1 + ((x2 - x1) * i) / steps);
      const y = Math.round(y1 + ((y2 - y1) * i) / steps);
      this.starLines.fillRect(x - 1, y - 1, 3, 3);
    }
  }

  private playSongOfTheBow() {
    this.finished = true;
    this.running = false;
    this.playHarp();
    audio.sfx("bless");
    this.cameras.main.flash(360, 255, 244, 180);
    this.sparkleBurst(ALTAR_AT[0], ALTAR_AT[1] - 12, 14);
    this.talk(tx("Đa-vít", "David"), STAGE9.lamentSong.map(tr), () => this.finishStage(STAGE9));
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);

    const txD = this.player.x - 14;
    const tyD = this.player.y + 10;
    const dd = Phaser.Math.Distance.Between(this.david.x, this.david.y, txD, tyD);
    if (dd > 3) {
      const step = Math.min(dd, (110 * delta) / 1000);
      const a = Math.atan2(tyD - this.david.y, txD - this.david.x);
      this.david.setPosition(Math.round(this.david.x + Math.cos(a) * step), Math.round(this.david.y + Math.sin(a) * step));
    }
    this.david.setDepth(this.david.y);

    const v = this.cameras.main.worldView;
    if (this.label) {
      const txt =
        this.phase === 0
          ? tr(STAGE9.phase[0]).replace("{c}", String(this.curConstellation)).replace("{s}", String(this.curStar))
          : tr(STAGE9.phase[1]);
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }
  }
}

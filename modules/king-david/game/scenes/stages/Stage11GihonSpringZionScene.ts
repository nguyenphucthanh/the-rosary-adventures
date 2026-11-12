import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE11, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const GATE_X = 320;
const START: [number, number][] = [[44, 128], [352, 128]];

// 3 Stone Sluice Valves inside the Gihon Water Shaft (left half x = 16..316)
const VALVES_AT: [number, number][] = [
  [104, 96],
  [192, 158],
  [276, 118],
];

// 4 Landmarks to build on Mount Zion (right half x = 324..624)
const LANDMARKS_AT: [number, number, string][] = [
  [392, 98, "david_house"],
  [468, 158, "david_banner"],
  [524, 98, "david_throne"],
  [584, 146, "david_tent"],
];

/** Stage 11 (2 Sm 5, 6-12; 1 Sb 11, 4-9): Regulate 3 Gihon Spring water-shaft sluice valves to open the Gate of Zion, then build the 4 Landmarks of the City of David. */
export class Stage11GihonSpringZionScene extends BaseDavidScene {
  private phase = 0; // 0 = Gihon Water Shaft, 1 = Building the City of David on Mount Zion
  private running = false;
  private finished = false;
  private valvesTurned = [false, false, false];
  private landmarksBuilt = [false, false, false, false];
  private valvePads: Phaser.GameObjects.Image[] = [];
  private sluiceGates: { set: (v: boolean) => void }[] = [];
  private landmarkSprites: Phaser.GameObjects.Image[] = [];
  private gate?: { set: (v: boolean) => void };
  private david!: Phaser.GameObjects.Image;
  private joab!: Phaser.GameObjects.Image;
  private waterShaftRect!: Phaser.GameObjects.Rectangle;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage11GihonSpringZionScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_11_mach_nuoc_gikhon_thanh_xion";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.valvesTurned = [false, false, false];
    this.landmarksBuilt = [false, false, false, false];
    this.valvePads = [];
    this.sluiceGates = [];
    this.landmarkSprites = [];
    this.intro = { illustration: "11", speaker: STAGE11.speaker, lines: STAGE11.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Left: Underground Gihon stone tunnel; Right: Sunlit Mount Zion citadel
    this.add.tileSprite(0, 0, GATE_X, TOP - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, GATE_X, TOP - 4, 0x0f172a, 0.45).setOrigin(0).setDepth(DEPTH.FLOOR);
    [[0x1d4ed8, 0, 12], [0x38bdf8, 12, 10], [0xfde68a, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(GATE_X, y, W - GATE_X, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(GATE_X, 34, W - GATE_X, TOP - 38, "david_wall").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Floors: Gihon subterranean stone + water channel (left) & Mount Zion stone terrace (right)
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 4, GATE_X, BOTTOM - TOP + 8, 0x0c4a6e, 0.25).setOrigin(0).setDepth(DEPTH.RUG);

    // Underground Gihon Spring water channel & Vertical Shaft basin
    this.add.rectangle(24, 124, GATE_X - 44, 14, 0x0284c7, 0.8).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.add.rectangle(26, 126, GATE_X - 48, 10, 0x38bdf8, 0.85).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.waterShaftRect = this.add.rectangle(286, 86, 24, 84, 0x38bdf8, 0.35).setOrigin(0).setDepth(DEPTH.RUG + 1);

    // Bottom wall / cliff border
    this.add.tileSprite(0, BOTTOM + 4, GATE_X, H - BOTTOM - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(GATE_X, BOTTOM + 4, W - GATE_X, H - BOTTOM - 4, "david_wall").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.gate = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true);

    // 2 internal sluice barriers inside the Gihon tunnel + 3 Sluice Valves
    this.sluiceGates.push(this.door(144, (TOP + BOTTOM) / 2, 10, BOTTOM - TOP, "david_fence", true));
    this.sluiceGates.push(this.door(236, (TOP + BOTTOM) / 2, 10, BOTTOM - TOP, "david_fence", true));

    VALVES_AT.forEach(([vx, vy], i) => {
      this.add.image(vx, vy - 4, "david_glow_sky").setDepth(DEPTH.RUG + 1);
      const pad = this.add.image(vx, vy, "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
      this.valvePads.push(pad);

      this.interactables.push({
        x: vx,
        y: vy - 4,
        r: 24,
        label: `${tr(STAGE11.valveHint)} (${i + 1}/3)`,
        active: () => this.phase === 0 && this.running && !this.valvesTurned[i] && (i === 0 || this.valvesTurned[i - 1]),
        act: () => this.turnValve(i),
      });
    });

    // 4 City of David Landmarks on Mount Zion
    LANDMARKS_AT.forEach(([lx, ly, texKey], i) => {
      this.add.image(lx, ly - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);
      this.add.image(lx, ly, "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
      const spr = this.add.image(lx, ly - 2, texKey).setOrigin(0.5, 1).setDepth(ly + 1).setAlpha(0.28);
      this.landmarkSprites.push(spr);

      this.interactables.push({
        x: lx,
        y: ly - 4,
        r: 28,
        label: `${tr(STAGE11.buildHint)}: ${tr(STAGE11.buildNames[i])}`,
        active: () => this.phase === 1 && this.running && !this.landmarksBuilt[i],
        act: () => this.buildLandmark(i),
      });
    });

    this.david = this.add.image(START[0][0] - 14, START[0][1] + 10, "david_king").setOrigin(0.5, 1);
    this.joab = this.add.image(START[0][0] - 28, START[0][1] + 14, "david_joab").setOrigin(0.5, 1);

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
    this.talk(tx("Vua Đa-vít", "King David"), STAGE11.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number);
  }

  private startPhase(n: number) {
    this.phase = n;
    this.running = true;
    this.gate?.set(n === 0);

    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, sx, sy);
    this.player.setVelocity(0, 0);
    this.player.setPosition(sx, sy);
    this.david.setPosition(sx - 14, sy + 10);
    this.joab.setPosition(sx - 28, sy + 14);
  }

  private turnValve(i: number) {
    this.valvesTurned[i] = true;
    this.valvePads[i].setTint(0x38bdf8);
    audio.sfx("splash");
    const [vx, vy] = VALVES_AT[i];
    this.sparkleBurst(vx, vy - 8, 8);

    if (i < 2) {
      this.sluiceGates[i].set(false);
      this.talk(STAGE11.speaker, [tr(STAGE11.valveDone[i])]);
    } else {
      this.waterShaftRect.setAlpha(0.85);
      audio.sfx("door");
      this.cameras.main.flash(260, 200, 240, 255);
      this.talk(STAGE11.speaker, [tr(STAGE11.valveDone[2])], () => this.startPhase(1));
    }
  }

  private buildLandmark(i: number) {
    this.landmarksBuilt[i] = true;
    this.landmarkSprites[i].setAlpha(1);
    audio.sfx("chime");
    const [lx, ly] = LANDMARKS_AT[i];
    this.sparkleBurst(lx, ly - 12, 10);

    if (this.landmarksBuilt.filter(Boolean).length >= 4 && !this.finished) {
      this.finished = true;
      this.running = false;
      audio.sfx("shofar");
      this.cameras.main.flash(360, 255, 244, 180);
      this.finishStage(STAGE11);
    }
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

    const txJ = this.david.x - 14;
    const tyJ = this.david.y + 4;
    const dJ = Phaser.Math.Distance.Between(this.joab.x, this.joab.y, txJ, tyJ);
    if (dJ > 3) {
      const step = Math.min(dJ, (105 * delta) / 1000);
      const a = Math.atan2(tyJ - this.joab.y, txJ - this.joab.x);
      this.joab.setPosition(Math.round(this.joab.x + Math.cos(a) * step), Math.round(this.joab.y + Math.sin(a) * step));
    }
    this.joab.setDepth(this.joab.y);

    const v = this.cameras.main.worldView;
    if (this.label) {
      const vCount = this.valvesTurned.filter(Boolean).length;
      const bCount = this.landmarksBuilt.filter(Boolean).length;
      const txt =
        this.phase === 0
          ? tr(STAGE11.phase[0]).replace("{v}", String(vCount))
          : tr(STAGE11.phase[1]).replace("{b}", String(bCount));
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }
  }
}

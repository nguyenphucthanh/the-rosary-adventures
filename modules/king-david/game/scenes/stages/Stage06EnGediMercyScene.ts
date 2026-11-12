import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE6, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const GATE_X = 440;
const START: [number, number][] = [[44, 128], [472, 128]];
const COMPANIONS_AT: [number, number][] = [
  [124, 98],
  [218, 158],
  [308, 102],
];
const PUDDLES_AT: [number, number, number][] = [
  [168, 128, 0],
  [264, 124, 900],
  [352, 134, 1800],
];
const SAUL_CAVE_AT: [number, number] = [404, 128];
const CRAG_PAD_AT: [number, number] = [548, 128];
const SAUL_VALLEY_AT: [number, number] = [604, 140];

interface EchoPuddle {
  x: number;
  y: number;
  ring: Phaser.GameObjects.Rectangle;
  timer: number;
  active: boolean;
}

/** Stage 6 (1 Sm 24, 1-23): Restrain 3 companions inside the Cave of En-Gedi while avoiding rippling echo puddles, cut only a corner of Saul's robe, and reconcile on the sunlit crag. */
export class Stage06EnGediMercyScene extends BaseDavidScene {
  private phase = 0; // 0 = Cave of En-Gedi, 1 = Sunlit Crag reconciliation
  private running = false;
  private finished = false;
  private calmed = [false, false, false];
  private robeCut = false;
  private puddles: EchoPuddle[] = [];
  private gate?: { set: (v: boolean) => void };
  private david!: Phaser.GameObjects.Image;
  private saulCave!: Phaser.GameObjects.Image;
  private saulValley!: Phaser.GameObjects.Image;
  private robePiece!: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage06EnGediMercyScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_06_hang_engedi_cat_vat_ao";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = this.robeCut = false;
    this.calmed = [false, false, false];
    this.puddles = [];
    this.intro = { illustration: "6", speaker: STAGE6.speaker, lines: STAGE6.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Left: dim Cave of En-Gedi; Right: bright sunlit desert crag
    this.add.tileSprite(0, 0, GATE_X, TOP - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, GATE_X, TOP - 4, 0x0f172a, 0.45).setOrigin(0).setDepth(DEPTH.FLOOR);
    [[0x0284c7, 0, 12], [0x38bdf8, 12, 10], [0xfde68a, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(GATE_X, y, W - GATE_X, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(GATE_X, 34, W - GATE_X, TOP - 38, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Floors: Cave stone (left) & sunlit sand crag (right)
    this.add.tileSprite(0, TOP - 4, GATE_X, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 4, GATE_X, BOTTOM - TOP + 8, 0x0f172a, 0.32).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(GATE_X, TOP - 4, W - GATE_X, H - TOP + 4, "david_sand").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Cave entrance light beam
    this.add.rectangle(GATE_X - 24, TOP - 4, 24, BOTTOM - TOP + 4, 0xfde68a, 0.22).setOrigin(0).setDepth(DEPTH.RUG + 1);

    // Bottom cliff border
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.gate = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true);

    // Cave rocks
    for (const [x, y] of [[80, 82], [190, 80], [296, 174], [368, 82], [500, 82], [516, 174]]) {
      this.add.image(x, y, "david_rock").setOrigin(0.5, 1).setDepth(y);
    }

    // 3 Echo Puddles in the cave
    for (const [px, py, offset] of PUDDLES_AT) {
      this.add.rectangle(px, py, 24, 14, 0x0284c7, 0.75).setDepth(DEPTH.RUG + 1);
      this.add.rectangle(px, py, 18, 10, 0x38bdf8, 0.85).setDepth(DEPTH.RUG + 1);
      const ring = this.add.rectangle(px, py, 32, 22, 0xffffff, 0.55).setDepth(DEPTH.RUG + 2).setVisible(false);
      this.puddles.push({ x: px, y: py, ring, timer: offset, active: false });
    }

    // 3 Companions (Abishai & warriors) in the cave
    COMPANIONS_AT.forEach(([x, y]) => {
      this.prop(x, y, "david_abishai", 16, 8);
      this.litGlow(x, y, 14, "david_glow_sky");
    });

    // King Saul inside the cave (Phase 1) & down on the crag (Phase 2)
    this.saulCave = this.prop(SAUL_CAVE_AT[0], SAUL_CAVE_AT[1], "david_saul", 16, 8);
    this.litGlow(SAUL_CAVE_AT[0], SAUL_CAVE_AT[1], 16, "david_glow_gold");
    this.saulValley = this.prop(SAUL_VALLEY_AT[0], SAUL_VALLEY_AT[1], "david_saul", 16, 8);

    // Sunlit Crag pad on the east
    this.add.image(CRAG_PAD_AT[0], CRAG_PAD_AT[1] - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);
    this.add.image(CRAG_PAD_AT[0], CRAG_PAD_AT[1], "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
    this.robePiece = this.add
      .image(CRAG_PAD_AT[0], CRAG_PAD_AT[1] - 20, "david_robe_piece")
      .setOrigin(0.5, 1)
      .setDepth(CRAG_PAD_AT[1] + 2)
      .setVisible(false);

    this.david = this.add.image(START[0][0] - 14, START[0][1] + 10, "david_warrior").setOrigin(0.5, 1);

    // Interactables
    this.interactables.push(
      ...COMPANIONS_AT.map(([x, y], i) => ({
        x,
        y: y - 8,
        r: 26,
        label: tr(STAGE6.calmHint),
        active: () => this.phase === 0 && this.running && !this.calmed[i],
        act: () => {
          this.calmed[i] = true;
          audio.sfx("chime");
          this.sparkleBurst(x, y - 10, 8);
          this.talk(tx("Đa-vít", "David"), STAGE6.calmTalk.map(tr));
        },
      })),
      {
        x: SAUL_CAVE_AT[0],
        y: SAUL_CAVE_AT[1] - 8,
        r: 28,
        label: tr(STAGE6.cutHint),
        active: () => this.phase === 0 && this.running && !this.robeCut,
        act: () => {
          const calmedCount = this.calmed.filter(Boolean).length;
          if (calmedCount < 3) {
            audio.sfx("wrong");
            this.talk(STAGE6.speaker, STAGE6.needCalmFirst.map(tr));
            return;
          }
          this.robeCut = true;
          audio.sfx("bless");
          this.sparkleBurst(SAUL_CAVE_AT[0], SAUL_CAVE_AT[1] - 12, 10);
          this.saulCave.setVisible(false);
          this.talk(STAGE6.speaker, STAGE6.cutDone.map(tr), () => this.startPhase(1));
        },
      },
      {
        x: CRAG_PAD_AT[0],
        y: CRAG_PAD_AT[1] - 6,
        r: 28,
        label: tr(STAGE6.cragHint),
        active: () => this.phase === 1 && this.running && !this.finished,
        act: () => this.reconcileWithSaul(),
      }
    );

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
    this.talk(tx("Đa-vít", "David"), STAGE6.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number);
  }

  private startPhase(n: number) {
    this.phase = n;
    this.running = true;
    this.gate?.set(n === 0);
    if (n === 1) {
      this.robeCut = true;
      this.saulCave.setVisible(false);
    } else {
      this.saulCave.setVisible(true);
    }
    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, sx, sy);
    this.player.setVelocity(0, 0);
    this.player.setPosition(sx, sy);
    this.david.setPosition(sx - 14, sy + 10);
  }

  private reconcileWithSaul() {
    this.finished = true;
    this.running = false;
    this.robePiece.setVisible(true);
    audio.sfx("shofar");
    this.cameras.main.flash(320, 255, 244, 180);
    this.sparkleBurst(CRAG_PAD_AT[0], CRAG_PAD_AT[1] - 16, 12);
    this.talk(tx("Đa-vít", "David"), STAGE6.reconcile.map(tr), () => {
      this.completeStage();
      audio.sfx("complete");
      this.talk(tx("Ấn Thánh Vịnh thứ 6", "Psalm Seal 6"), STAGE6.outro.map(tr), () =>
        this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE6.lesson)], () => this.goToNextStage())
      );
    });
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
      const calmedCount = this.calmed.filter(Boolean).length;
      const txt =
        this.phase === 0
          ? tr(STAGE6.phase[0]).replace("{m}", String(calmedCount))
          : tr(STAGE6.phase[1]);
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }

    if (!this.running || this.finished || this.dialogueOpen) return;

    if (this.phase === 0) {
      // Update Echo Puddles (cycle every 2400ms: active for 1000ms, quiet for 1400ms)
      for (const p of this.puddles) {
        p.timer = (p.timer + delta) % 2400;
        p.active = p.timer < 1000;
        p.ring.setVisible(p.active);

        if (p.active && Math.abs(this.player.x - p.x) < 16 && Math.abs(this.player.y - p.y) < 12) {
          audio.sfx("wrong");
          this.cameras.main.shake(100, 0.004);
          this.player.setVelocity(0, 0);
          this.player.setPosition(START[0][0], START[0][1]);
          this.david.setPosition(START[0][0] - 14, START[0][1] + 10);
          this.talk(STAGE6.speaker, STAGE6.echoAlert.map(tr));
          return;
        }
      }
    }
  }
}

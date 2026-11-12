import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE8, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const GATE_X = 464;
const START: [number, number][] = [[44, 128], [496, 128]];
const SAUL_SLEEP_AT: [number, number] = [388, 128];
const SPEAR_AT: [number, number] = [414, 114];
const JUG_AT: [number, number] = [414, 144];
const HILLTOP_PAD_AT: [number, number] = [576, 128];

interface Watchlight {
  x: number;
  y: number;
  ring: Phaser.GameObjects.Rectangle;
  timer: number;
  active: boolean;
}

/** Stage 8 (1 Sm 26, 1-25): Tiptoe into the moonlit camp on the Hill of Hachilah, take only King Saul's spear and water jug in mercy, and call out from the opposite hilltop. */
export class Stage08SpearAndJugScene extends BaseDavidScene {
  private phase = 0; // 0 = Moonlit camp infiltration, 1 = Opposite Hilltop declaration
  private running = false;
  private finished = false;
  private hasSpear = false;
  private hasJug = false;
  private spearSpr?: Phaser.GameObjects.Image | null;
  private jugSpr?: Phaser.GameObjects.Image | null;
  private watchlights: Watchlight[] = [];
  private gate?: { set: (v: boolean) => void };
  private david!: Phaser.GameObjects.Image;
  private abishai!: Phaser.GameObjects.Image;
  private heldSpear!: Phaser.GameObjects.Image;
  private heldJug!: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage08SpearAndJugScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_08_cay_giao_binh_nuoc_khachila";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = this.hasSpear = this.hasJug = false;
    this.spearSpr = null;
    this.jugSpr = null;
    this.watchlights = [];
    this.intro = { illustration: "8", speaker: STAGE8.speaker, lines: STAGE8.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Starry indigo night sky over the Hill of Hachilah
    [[0x0f172a, 0, 12], [0x1e1b4b, 12, 10], [0x312e81, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    // Moon & stars
    this.add.rectangle(540, 8, 12, 12, 0xfef3c7).setOrigin(0).setDepth(DEPTH.FLOOR);
    for (const [sx, sy] of [[48, 8], [136, 14], [244, 6], [356, 12], [448, 8], [604, 14]]) {
      this.add.rectangle(sx, sy, 2, 2, 0xffffff).setOrigin(0).setDepth(DEPTH.FLOOR);
    }
    this.add.tileSprite(0, 34, W, TOP - 38, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Floors: Sandy camp floor (left) & rocky opposite hilltop (right)
    this.add.tileSprite(0, TOP - 4, GATE_X, H - TOP + 4, "david_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X, TOP - 4, W - GATE_X, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 4, W, BOTTOM - TOP + 8, 0x1e1b4b, 0.28).setOrigin(0).setDepth(DEPTH.RUG);

    // Bottom cliff border
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.55).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.gate = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true);

    // Sleeping camp tents & guards
    for (const [tx, ty] of [[112, 78], [232, 78], [348, 78]]) {
      this.add.image(tx, ty, "david_tent").setOrigin(0.5, 1).setDepth(ty);
    }
    for (const [gx, gy] of [[126, 96], [216, 162], [312, 96]]) {
      this.add.image(gx, gy, "david_guard").setOrigin(0.5, 1).setDepth(gy).setAlpha(0.85);
    }

    // 4 Pulsing Watchlight Lanterns in the sleeping camp
    const lanternConfigs: [number, number, number][] = [
      [144, 128, 0],
      [216, 114, 700],
      [288, 142, 1400],
      [344, 126, 350],
    ];
    for (const [lx, ly, offset] of lanternConfigs) {
      this.add.image(lx, ly, "david_torch").setOrigin(0.5, 1).setDepth(ly);
      const ring = this.add.rectangle(lx, ly - 4, 34, 28, 0xf59e0b, 0.35).setDepth(DEPTH.RUG + 2).setVisible(false);
      this.watchlights.push({ x: lx, y: ly - 4, ring, timer: offset, active: false });
    }

    // King Saul asleep in the centre of the camp, with the Royal Spear & Water Jug by his head
    this.prop(SAUL_SLEEP_AT[0], SAUL_SLEEP_AT[1], "david_saul", 16, 8);
    this.spearSpr = this.pickup(SPEAR_AT[0], SPEAR_AT[1], "david_spear");
    this.jugSpr = this.pickup(JUG_AT[0], JUG_AT[1], "david_jug");

    // Opposite Hilltop pad on the east
    this.add.image(HILLTOP_PAD_AT[0], HILLTOP_PAD_AT[1] - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);
    this.add.image(HILLTOP_PAD_AT[0], HILLTOP_PAD_AT[1], "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
    this.heldSpear = this.add
      .image(HILLTOP_PAD_AT[0] - 8, HILLTOP_PAD_AT[1] - 20, "david_spear")
      .setOrigin(0.5, 1)
      .setDepth(HILLTOP_PAD_AT[1] + 2)
      .setVisible(false);
    this.heldJug = this.add
      .image(HILLTOP_PAD_AT[0] + 8, HILLTOP_PAD_AT[1] - 20, "david_jug")
      .setOrigin(0.5, 1)
      .setDepth(HILLTOP_PAD_AT[1] + 2)
      .setVisible(false);

    this.david = this.add.image(START[0][0] - 14, START[0][1] + 10, "david_warrior").setOrigin(0.5, 1);
    this.abishai = this.add.image(START[0][0] - 28, START[0][1] + 14, "david_abishai").setOrigin(0.5, 1);

    // Interactables
    this.interactables.push(
      {
        x: SPEAR_AT[0],
        y: SPEAR_AT[1] - 6,
        r: 26,
        label: tr(STAGE8.spearHint),
        active: () => this.phase === 0 && this.running && !this.hasSpear,
        act: () => this.takeSpear(),
      },
      {
        x: JUG_AT[0],
        y: JUG_AT[1] - 6,
        r: 26,
        label: tr(STAGE8.jugHint),
        active: () => this.phase === 0 && this.running && !this.hasJug,
        act: () => this.takeJug(),
      },
      {
        x: HILLTOP_PAD_AT[0],
        y: HILLTOP_PAD_AT[1] - 6,
        r: 28,
        label: tr(STAGE8.hilltopHint),
        active: () => this.phase === 1 && this.running && !this.finished,
        act: () => this.callFromHilltop(),
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
    this.talk(tx("Đa-vít", "David"), STAGE8.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = false;
    this.gate?.set(n === 0);

    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, sx, sy);
    this.player.setVelocity(0, 0);
    this.player.setPosition(sx, sy);
    this.david.setPosition(sx - 14, sy + 10);
    this.abishai.setPosition(sx - 28, sy + 14);

    if (n === 1 && intro) {
      audio.sfx("chime");
      this.cameras.main.flash(260, 255, 244, 180);
      this.talk(STAGE8.speaker, STAGE8.bothTaken.map(tr), () => {
        this.running = true;
      });
    } else {
      this.running = true;
    }
  }

  private takeSpear() {
    this.hasSpear = true;
    audio.sfx("pickup");
    if (this.spearSpr) {
      this.sparkleBurst(this.spearSpr.x, this.spearSpr.y - 6, 8);
      this.removePickup(this.spearSpr);
      this.spearSpr = null;
    }
    this.talk(tx("Đa-vít", "David"), STAGE8.abishaiRestrain.map(tr), () => this.checkBothTaken());
  }

  private takeJug() {
    this.hasJug = true;
    audio.sfx("pickup");
    if (this.jugSpr) {
      this.sparkleBurst(this.jugSpr.x, this.jugSpr.y - 6, 8);
      this.removePickup(this.jugSpr);
      this.jugSpr = null;
    }
    this.checkBothTaken();
  }

  private checkBothTaken() {
    if (this.hasSpear && this.hasJug && this.phase === 0) {
      this.startPhase(1, true);
    }
  }

  private callFromHilltop() {
    this.finished = true;
    this.running = false;
    this.heldSpear.setVisible(true);
    this.heldJug.setVisible(true);
    audio.sfx("shofar");
    this.cameras.main.flash(320, 255, 244, 180);
    this.sparkleBurst(HILLTOP_PAD_AT[0], HILLTOP_PAD_AT[1] - 16, 12);
    this.talk(tx("Đa-vít", "David"), STAGE8.hilltopCall.map(tr), () => {
      this.completeStage();
      audio.sfx("complete");
      this.talk(tx("Ấn Thánh Vịnh thứ 8", "Psalm Seal 8"), STAGE8.outro.map(tr), () =>
        this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE8.lesson)], () => this.goToNextStage())
      );
    });
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);

    // David and Abishai follow player
    const txD = this.player.x - 14;
    const tyD = this.player.y + 10;
    const dd = Phaser.Math.Distance.Between(this.david.x, this.david.y, txD, tyD);
    if (dd > 3) {
      const step = Math.min(dd, (110 * delta) / 1000);
      const a = Math.atan2(tyD - this.david.y, txD - this.david.x);
      this.david.setPosition(Math.round(this.david.x + Math.cos(a) * step), Math.round(this.david.y + Math.sin(a) * step));
    }
    this.david.setDepth(this.david.y);

    const txAb = this.david.x - 14;
    const tyAb = this.david.y + 4;
    const dAb = Phaser.Math.Distance.Between(this.abishai.x, this.abishai.y, txAb, tyAb);
    if (dAb > 3) {
      const step = Math.min(dAb, (105 * delta) / 1000);
      const a = Math.atan2(tyAb - this.abishai.y, txAb - this.abishai.x);
      this.abishai.setPosition(Math.round(this.abishai.x + Math.cos(a) * step), Math.round(this.abishai.y + Math.sin(a) * step));
    }
    this.abishai.setDepth(this.abishai.y);

    const v = this.cameras.main.worldView;
    if (this.label) {
      const txt =
        this.phase === 0
          ? tr(STAGE8.phase[0])
              .replace("{s}", this.hasSpear ? "1" : "0")
              .replace("{j}", this.hasJug ? "1" : "0")
          : tr(STAGE8.phase[1]);
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }

    if (!this.running || this.finished || this.dialogueOpen) return;

    if (this.phase === 0) {
      // Update watchlights (cycle 2600ms: active for 1100ms, dim for 1500ms)
      for (const w of this.watchlights) {
        w.timer = (w.timer + delta) % 2600;
        w.active = w.timer < 1100;
        w.ring.setVisible(w.active);

        if (w.active && Math.abs(this.player.x - w.x) < 18 && Math.abs(this.player.y - w.y) < 15) {
          audio.sfx("wrong");
          this.cameras.main.shake(100, 0.004);
          this.player.setVelocity(0, 0);
          this.player.setPosition(START[0][0], START[0][1]);
          this.david.setPosition(START[0][0] - 14, START[0][1] + 10);
          this.abishai.setPosition(START[0][0] - 28, START[0][1] + 14);
          this.talk(STAGE8.speaker, STAGE8.campAlert.map(tr));
          return;
        }
      }
    }
  }
}

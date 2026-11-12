import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE5, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const GATE_X = 188;
const START: [number, number][] = [[44, 128], [224, 128]];
const PRIEST_AT: [number, number] = [118, 108];
const FIRES_AT: [number, number][] = [
  [264, 96],
  [372, 96],
  [488, 96],
  [264, 162],
  [372, 162],
  [488, 162],
];
const FAMILIES_AT: [number, number][] = [
  [316, 106],
  [432, 156],
  [548, 114],
];
const PSALM_PAD: [number, number] = [432, 116];

/** Stage 5 (1 Sm 21, 1-7; 22, 1-5; Tv 57): Receive Sacred Bread at Nob, light 6 campfires, feed 3 poor families, and sing Psalm 57 in the Cave of Adullam. */
export class Stage05AdullamSanctuaryScene extends BaseDavidScene {
  private phase = 0; // 0 = Sanctuary at Nob, 1 = Cave of Adullam
  private running = false;
  private finished = false;
  private hasBread = false;
  private firesLit = [false, false, false, false, false, false];
  private familiesFed = [false, false, false];
  private psalmSung = false;
  private fireGlows: Phaser.GameObjects.Image[] = [];
  private fireSprites: Phaser.GameObjects.Image[] = [];
  private gate?: { set: (v: boolean) => void };
  private david!: Phaser.GameObjects.Image;
  private darkness!: Phaser.GameObjects.Rectangle;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage05AdullamSanctuaryScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_05_banh_thanh_hang_adulam";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = this.hasBread = this.psalmSung = false;
    this.firesLit = [false, false, false, false, false, false];
    this.familiesFed = [false, false, false];
    this.fireGlows = [];
    this.fireSprites = [];
    this.intro = { illustration: "5", speaker: STAGE5.speaker, lines: STAGE5.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Left: Sanctuary of Nob under warm sky; Right: rocky Cave of Adullam
    [[0x1d4ed8, 0, 12], [0x38bdf8, 12, 10], [0xfde68a, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, GATE_X, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(0, 34, GATE_X, TOP - 38, "david_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X, 0, W - GATE_X, TOP - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(GATE_X, 0, W - GATE_X, TOP - 4, 0x0f172a, 0.35).setOrigin(0).setDepth(DEPTH.FLOOR);

    // Floors: Nob stone courtyard (left) & Adullam cave floor (right)
    this.add.tileSprite(0, TOP - 4, GATE_X, H - TOP + 4, "david_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X, TOP - 4, W - GATE_X, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Nob sanctuary rug & table of Sacred Bread
    this.add.rectangle(64, 92, 92, 42, 0x1e3a8a).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(66, 94, 88, 38, 0xd97706).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.image(146, 108, "david_bread").setOrigin(0.5, 1).setDepth(108);
    this.add.image(146, 102, "david_glow_gold").setDepth(107).setAlpha(0.8);

    // Bottom wall / cliff border
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.55).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.gate = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true);

    // Priest Ahimelech at Nob
    this.prop(PRIEST_AT[0], PRIEST_AT[1], "david_ahimelech", 16, 8);
    this.litGlow(PRIEST_AT[0], PRIEST_AT[1], 16, "david_glow_gold");

    // Cave of Adullam rocks & stalagmites
    for (const [x, y] of [[228, 82], [336, 80], [452, 80], [584, 84], [312, 174], [528, 174]]) {
      this.add.image(x, y, "david_rock").setOrigin(0.5, 1).setDepth(y);
    }

    // 6 Campfires inside the cave (unlit initially -> dim alpha)
    FIRES_AT.forEach(([x, y]) => {
      const glow = this.add.image(x, y - 6, "david_glow_fire").setDepth(DEPTH.RUG + 1).setVisible(false);
      const fire = this.add.image(x, y, "david_campfire").setOrigin(0.5, 1).setDepth(y).setAlpha(0.45);
      this.fireGlows.push(glow);
      this.fireSprites.push(fire);
    });

    // 3 Family groups in the cave (David's parents Jesse, poor family, weary traveller)
    const familyKeys = ["david_jesse", "david_abigail", "david_eliab"];
    FAMILIES_AT.forEach(([x, y], idx) => {
      this.prop(x, y, familyKeys[idx], 16, 8);
      this.litGlow(x, y, 14, "david_glow_sky");
    });

    // Central Psalm 57 stone pad
    this.add.image(PSALM_PAD[0], PSALM_PAD[1] - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);
    this.add.image(PSALM_PAD[0], PSALM_PAD[1], "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
    this.add.image(PSALM_PAD[0], PSALM_PAD[1] - 6, "david_harp").setOrigin(0.5, 1).setDepth(PSALM_PAD[1]);

    // Soft darkness overlay over Cave of Adullam that warms up as fires are lit
    this.darkness = this.add
      .rectangle(GATE_X + 6, TOP - 4, W - GATE_X - 6, BOTTOM - TOP + 8, 0x0f172a, 0.48)
      .setOrigin(0)
      .setDepth(DEPTH.FX - 2);

    this.david = this.add.image(START[0][0] - 14, START[0][1] + 10, "david_warrior").setOrigin(0.5, 1);

    // Interactables
    this.interactables.push(
      {
        x: PRIEST_AT[0],
        y: PRIEST_AT[1] - 8,
        r: 28,
        label: tr(STAGE5.priestHint),
        active: () => this.phase === 0 && this.running && !this.hasBread,
        act: () => {
          this.hasBread = true;
          audio.sfx("bless");
          this.sparkleBurst(PRIEST_AT[0], PRIEST_AT[1] - 12, 10);
          this.talk(tx("Tư tế A-khi-me-léc", "Priest Ahimelech"), STAGE5.priestTalk.map(tr), () => this.startPhase(1));
        },
      },
      ...FIRES_AT.map(([x, y], i) => ({
        x,
        y: y - 4,
        r: 24,
        label: tr(STAGE5.fireHint),
        active: () => this.phase === 1 && this.running && !this.firesLit[i],
        act: () => this.lightFire(i),
      })),
      ...FAMILIES_AT.map(([x, y], i) => ({
        x,
        y: y - 8,
        r: 26,
        label: tr(STAGE5.breadHint),
        active: () => this.phase === 1 && this.running && !this.familiesFed[i],
        act: () => this.feedFamily(i),
      })),
      {
        x: PSALM_PAD[0],
        y: PSALM_PAD[1] - 6,
        r: 26,
        label: tr(STAGE5.psalmHint),
        active: () => this.phase === 1 && this.running && !this.psalmSung,
        act: () => this.singPsalm(),
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
    this.talk(tx("Đa-vít", "David"), STAGE5.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number);
  }

  private startPhase(n: number) {
    this.phase = n;
    this.running = true;
    this.gate?.set(n === 0);
    if (n === 1) {
      this.hasBread = true;
    }
    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, sx, sy);
    this.player.setVelocity(0, 0);
    this.player.setPosition(sx, sy);
    this.david.setPosition(sx - 14, sy + 10);
  }

  private lightFire(i: number) {
    this.firesLit[i] = true;
    audio.sfx("chime");
    this.fireSprites[i].setAlpha(1);
    this.fireGlows[i].setVisible(true);
    const [fx, fy] = FIRES_AT[i];
    this.sparkleBurst(fx, fy - 8, 8);
    const litCount = this.firesLit.filter(Boolean).length;
    this.darkness.setAlpha(Math.max(0.05, 0.48 - litCount * 0.07));
    this.checkAllDone();
  }

  private feedFamily(i: number) {
    this.familiesFed[i] = true;
    audio.sfx("pickup");
    const [fx, fy] = FAMILIES_AT[i];
    this.sparkleBurst(fx, fy - 12, 8);
    this.talk(STAGE5.speaker, [tr(STAGE5.familyThanks[i])], () => this.checkAllDone());
  }

  private singPsalm() {
    this.psalmSung = true;
    audio.sfx("bless");
    this.sparkleBurst(PSALM_PAD[0], PSALM_PAD[1] - 12, 14);
    this.cameras.main.flash(260, 255, 244, 180);
    this.talk(tx("Đa-vít", "David"), STAGE5.psalmSing.map(tr), () => this.checkAllDone());
  }

  private checkAllDone() {
    if (this.finished) return;
    const fCount = this.firesLit.filter(Boolean).length;
    const bCount = this.familiesFed.filter(Boolean).length;
    if (fCount >= 6 && bCount >= 3 && this.psalmSung) {
      this.finished = true;
      this.running = false;
      this.completeStage();
      audio.sfx("complete");
      this.talk(tx("Ấn Thánh Vịnh thứ 5", "Psalm Seal 5"), STAGE5.outro.map(tr), () =>
        this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE5.lesson)], () => this.goToNextStage())
      );
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

    const v = this.cameras.main.worldView;
    if (this.label) {
      const fCount = this.firesLit.filter(Boolean).length;
      const bCount = this.familiesFed.filter(Boolean).length;
      const txt =
        this.phase === 0
          ? tr(STAGE5.phase[0])
          : tr(STAGE5.phase[1])
              .replace("{f}", String(fCount))
              .replace("{b}", String(bCount))
              .replace("{h}", this.psalmSung ? "1" : "0");
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }
  }
}

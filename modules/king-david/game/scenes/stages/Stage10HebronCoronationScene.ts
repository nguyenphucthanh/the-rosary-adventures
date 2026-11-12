import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE10, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const START: [number, number] = [320, 148];
const THRONE_AT: [number, number] = [320, 120];

// 4 Tribe Delegations (East, South, West, North) at the 4 corners of Hebron plaza
const ELDERS_AT: [number, number][] = [
  [568, 96],  // 0: East Camp
  [568, 162], // 1: South Camp
  [72, 162],  // 2: West Camp
  [72, 96],   // 3: North Camp
];

// 4 Covenant Pedestals around the central Shepherd Throne
const PEDESTALS_AT: [number, number][] = [
  [416, 102], // 0: East Pedestal
  [416, 152], // 1: South Pedestal
  [224, 152], // 2: West Pedestal
  [224, 102], // 3: North Pedestal
];

/** Stage 10 (2 Sm 2, 1-4; 5, 1-5): Welcome the 4 Tribe Delegations at Hebron, place the 12 Tribe Banners onto the Covenant Pedestals, and crown King David. */
export class Stage10HebronCoronationScene extends BaseDavidScene {
  private phase = 0; // 0 = Place 4 sets of Tribe Banners, 1 = Coronation at Shepherd Throne
  private running = false;
  private finished = false;
  private holdingGroup = -1;
  private groupsTaken = [false, false, false, false];
  private pedestalsLit = [false, false, false, false];
  private pedestalBanners: Phaser.GameObjects.Image[] = [];
  private pedestalGlows: Phaser.GameObjects.Image[] = [];
  private david!: Phaser.GameObjects.Image;
  private crownSpr!: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage10HebronCoronationScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_10_dang_quang_khepron_muoi_hai_chi_toc";
    this.spawn = START;
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.holdingGroup = -1;
    this.groupsTaken = [false, false, false, false];
    this.pedestalsLit = [false, false, false, false];
    this.pedestalBanners = [];
    this.pedestalGlows = [];
    this.intro = { illustration: "10", speaker: STAGE10.speaker, lines: STAGE10.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Festive golden sky over ancient Hebron
    [[0x1d4ed8, 0, 12], [0x38bdf8, 12, 10], [0xfde68a, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(0, 34, W, TOP - 38, "david_wall").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Grand stone plaza of Hebron
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Royal crimson-and-gold plaza carpet around the central throne
    this.add.rectangle(196, 86, 248, 84, 0x991b1b).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(200, 90, 240, 76, 0xdc2626).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(204, 94, 232, 68, 0xb91c1c).setOrigin(0).setDepth(DEPTH.RUG);

    // Bottom wall border
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_wall").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);

    // Wall torches & olive trees
    for (const x of [140, 260, 380, 500]) {
      this.add.image(x, 48, "david_glow_fire").setDepth(DEPTH.RUG).setAlpha(0.75);
      this.add.image(x, 54, "david_torch").setOrigin(0.5, 1).setDepth(54);
    }

    // Central Shepherd Throne + Shepherd's Staff + Golden Crown
    this.add.image(THRONE_AT[0], THRONE_AT[1] - 8, "david_glow_gold").setDepth(DEPTH.RUG + 1);
    this.prop(THRONE_AT[0], THRONE_AT[1], "david_throne", 24, 12);
    this.add.image(THRONE_AT[0] - 18, THRONE_AT[1] - 2, "david_staff").setOrigin(0.5, 1).setDepth(THRONE_AT[1] + 1);
    this.add.image(THRONE_AT[0] + 18, THRONE_AT[1] - 2, "david_horn").setOrigin(0.5, 1).setDepth(THRONE_AT[1] + 1);
    this.crownSpr = this.add.image(THRONE_AT[0], THRONE_AT[1] - 26, "david_crown").setOrigin(0.5, 1).setDepth(THRONE_AT[1] + 2);

    // 4 Tribe Elders at the 4 gates of the plaza
    const elderTextures = ["david_jesse", "david_samuel", "david_ahimelech", "david_eliab"];
    ELDERS_AT.forEach(([ex, ey], i) => {
      this.prop(ex, ey, elderTextures[i], 16, 8);
      this.litGlow(ex, ey, 16, "david_glow_gold");
      this.add.image(ex + (ex < 320 ? 16 : -16), ey, "david_banner").setOrigin(0.5, 1).setDepth(ey);

      this.interactables.push({
        x: ex,
        y: ey - 8,
        r: 28,
        label: `${tr(STAGE10.elderHint)}: ${tr(STAGE10.groupNames[i])}`,
        active: () => this.phase === 0 && this.running && !this.groupsTaken[i] && this.holdingGroup === -1,
        act: () => this.receiveBannerSet(i),
      });
    });

    // 4 Covenant Pedestals around the throne
    PEDESTALS_AT.forEach(([px, py], i) => {
      const glow = this.add.image(px, py - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1).setAlpha(0.35);
      this.add.image(px, py, "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
      const banner = this.add.image(px, py - 2, "david_banner").setOrigin(0.5, 1).setDepth(py + 1).setVisible(false);
      this.pedestalGlows.push(glow);
      this.pedestalBanners.push(banner);

      this.interactables.push({
        x: px,
        y: py - 4,
        r: 26,
        label: `${tr(STAGE10.pedestalHint)}: ${tr(STAGE10.groupNames[i])}`,
        active: () => this.phase === 0 && this.running && !this.pedestalsLit[i],
        act: () => this.placeBannerSet(i),
      });
    });

    this.interactables.push({
      x: THRONE_AT[0],
      y: THRONE_AT[1] + 6,
      r: 32,
      label: tr(STAGE10.throneHint),
      active: () => this.phase === 1 && this.running && !this.finished,
      act: () => this.crownKingDavid(),
    });

    this.david = this.add.image(START[0] - 14, START[1] + 10, "david_warrior").setOrigin(0.5, 1);

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
    this.talk(tx("Đa-vít", "David"), STAGE10.start.map(tr), () => {
      this.running = true;
      this.saveCheckpoint("start", 0, START[0], START[1]);
    });
  }

  private receiveBannerSet(i: number) {
    this.holdingGroup = i;
    this.groupsTaken[i] = true;
    audio.sfx("pickup");
    const [ex, ey] = ELDERS_AT[i];
    this.sparkleBurst(ex, ey - 10, 8);
  }

  private placeBannerSet(i: number) {
    if (this.holdingGroup === -1) {
      audio.sfx("wrong");
      this.talk(STAGE10.speaker, [tr(STAGE10.needBannerMsg)]);
      return;
    }
    if (this.holdingGroup !== i) {
      audio.sfx("wrong");
      this.talk(STAGE10.speaker, [tr(STAGE10.wrongPedestalMsg)]);
      return;
    }

    this.holdingGroup = -1;
    this.pedestalsLit[i] = true;
    this.pedestalBanners[i].setVisible(true);
    this.pedestalGlows[i].setAlpha(1);
    audio.sfx("chime");
    const [px, py] = PEDESTALS_AT[i];
    this.sparkleBurst(px, py - 12, 10);

    if (this.pedestalsLit.filter(Boolean).length >= 4) {
      this.phase = 1;
      audio.sfx("shofar");
      this.cameras.main.flash(260, 255, 244, 180);
      this.talk(STAGE10.speaker, STAGE10.bannersReady.map(tr));
    }
  }

  private crownKingDavid() {
    this.finished = true;
    this.running = false;
    this.david.setTexture("david_king");
    this.crownSpr.setVisible(false);
    audio.sfx("shofar");
    this.cameras.main.flash(360, 255, 244, 180);
    this.sparkleBurst(THRONE_AT[0], THRONE_AT[1] - 12, 14);
    this.talk(STAGE10.speaker, STAGE10.coronation.map(tr), () => this.finishStage(STAGE10));
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
      const bCount = this.pedestalsLit.filter(Boolean).length;
      const txt =
        this.phase === 0
          ? tr(STAGE10.phase[0]).replace("{b}", String(bCount))
          : tr(STAGE10.phase[1]);
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }
  }
}

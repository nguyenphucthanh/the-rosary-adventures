import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE12, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const GATE_X = 368;
const START: [number, number][] = [[44, 128], [400, 128]];

// 3 Six-Step Procession Stations along the Jerusalem avenue
const STATIONS_AT: [number, number][] = [
  [128, 128],
  [224, 128],
  [320, 128],
];

// 3 Family Groups around the Sacred Tent courtyard on Mount Zion
const FAMILIES_AT: [number, number][] = [
  [444, 96],
  [444, 160],
  [516, 160],
];

const TENT_ARK_AT: [number, number] = [536, 108];
const NATHAN_AT: [number, number] = [592, 128];

/** Stage 12 (2 Sm 6, 12-19; 7, 1-17): Escort the Ark of the Covenant across 3 Six-Step Stations to Mount Zion, share blessing cakes with the people, and hear Prophet Nathan's Eternal Kingdom Promise. */
export class Stage12ArkToJerusalemScene extends BaseDavidScene {
  private phase = 0; // 0 = Ark Procession (3 Six-Step Stations), 1 = Sacred Tent & Nathan's Eternal Covenant
  private running = false;
  private finished = false;
  private curStation = 0;
  private familiesBlessed = [false, false, false];
  private stationPads: Phaser.GameObjects.Image[] = [];
  private gate?: { set: (v: boolean) => void };
  private david!: Phaser.GameObjects.Image;
  private arkSpr!: Phaser.GameObjects.Image;
  private arkGlow!: Phaser.GameObjects.Image;
  private priest1!: Phaser.GameObjects.Image;
  private priest2!: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage12ArkToJerusalemScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_12_ruoc_hom_bia_loi_hua_muon_doi";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.curStation = 0;
    this.familiesBlessed = [false, false, false];
    this.stationPads = [];
    this.intro = { illustration: "12", speaker: STAGE12.speaker, lines: STAGE12.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Radiant golden sky over Jerusalem & Mount Zion
    [[0x1d4ed8, 0, 12], [0x38bdf8, 12, 10], [0xfde68a, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(0, 34, W, TOP - 38, "david_wall").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Stone avenue of Jerusalem
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Royal crimson-and-gold procession carpet leading into the Sacred Tent on Mount Zion
    this.add.rectangle(24, 112, W - 48, 32, 0x991b1b).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(24, 115, W - 48, 26, 0xdc2626).setOrigin(0).setDepth(DEPTH.RUG);

    // Bottom wall border
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_wall").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.gate = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true);

    // Festive banners & torches along the procession route
    for (const x of [84, 176, 272, 412, 492, 572]) {
      this.add.image(x, 68, "david_banner").setOrigin(0.5, 1).setDepth(68);
      this.add.image(x, 174, "david_torch").setOrigin(0.5, 1).setDepth(174);
    }

    // 3 Six-Step Procession Altar Stations
    STATIONS_AT.forEach(([sx, sy], i) => {
      this.add.image(sx, sy - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);
      const pad = this.add.image(sx, sy, "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
      this.stationPads.push(pad);

      this.interactables.push({
        x: sx,
        y: sy - 4,
        r: 26,
        label: `${tr(STAGE12.stationHint)} (${i + 1}/3)`,
        active: () => this.phase === 0 && this.running && this.curStation === i,
        act: () => this.celebrateSixSteps(i),
      });
    });

    // Sacred Tent on Mount Zion
    this.add.image(TENT_ARK_AT[0], 78, "david_tent").setOrigin(0.5, 1).setDepth(78);
    this.add.image(TENT_ARK_AT[0], TENT_ARK_AT[1] - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);

    // 3 Family Groups waiting for Blessing Bread in the Sacred Tent courtyard
    const familyTextures = ["david_jesse", "david_abigail", "david_eliab"];
    FAMILIES_AT.forEach(([fx, fy], i) => {
      this.prop(fx, fy, familyTextures[i], 16, 8);
      this.litGlow(fx, fy, 14, "david_glow_sky");

      this.interactables.push({
        x: fx,
        y: fy - 8,
        r: 26,
        label: tr(STAGE12.breadHint),
        active: () => this.phase === 1 && this.running && !this.familiesBlessed[i],
        act: () => this.blessFamily(i),
      });
    });

    // Prophet Nathan beside the Sacred Tent
    this.prop(NATHAN_AT[0], NATHAN_AT[1], "david_nathan", 16, 8);
    this.litGlow(NATHAN_AT[0], NATHAN_AT[1], 16, "david_glow_gold");

    this.interactables.push({
      x: NATHAN_AT[0],
      y: NATHAN_AT[1] - 8,
      r: 28,
      label: tr(STAGE12.nathanHint),
      active: () => this.phase === 1 && this.running && !this.finished,
      act: () => this.hearNathanProphecy(),
    });

    // Ark of the Covenant + Levite Priests + King David in linen ephod
    this.arkGlow = this.add.image(68, 124, "david_glow_gold").setDepth(DEPTH.RUG + 1);
    this.arkSpr = this.add.image(68, 130, "david_ark").setOrigin(0.5, 1).setDepth(130);
    this.priest1 = this.add.image(48, 132, "david_ahimelech").setOrigin(0.5, 1).setDepth(132);
    this.priest2 = this.add.image(88, 132, "david_samuel").setOrigin(0.5, 1).setDepth(132);
    this.david = this.add.image(START[0][0] - 14, START[0][1] + 10, "david_ephod").setOrigin(0.5, 1);

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
    this.talk(tx("Vua Đa-vít", "King David"), STAGE12.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number);
  }

  private startPhase(n: number) {
    this.phase = n;
    this.running = true;
    this.gate?.set(n === 0);

    if (n === 1) {
      this.curStation = 3;
      this.arkSpr.setPosition(TENT_ARK_AT[0], TENT_ARK_AT[1]).setDepth(TENT_ARK_AT[1]);
      this.arkGlow.setPosition(TENT_ARK_AT[0], TENT_ARK_AT[1] - 6);
      this.priest1.setPosition(TENT_ARK_AT[0] - 24, TENT_ARK_AT[1] + 2).setDepth(TENT_ARK_AT[1] + 2);
      this.priest2.setPosition(TENT_ARK_AT[0] + 24, TENT_ARK_AT[1] + 2).setDepth(TENT_ARK_AT[1] + 2);
    }

    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, sx, sy);
    this.player.setVelocity(0, 0);
    this.player.setPosition(sx, sy);
    this.david.setPosition(sx - 14, sy + 10);
  }

  private celebrateSixSteps(i: number) {
    const [sx, sy] = STATIONS_AT[i];
    this.stationPads[i].setTint(0xfde047);
    this.playHarp();
    audio.sfx("shofar");
    audio.sfx("tambourine");
    this.cameras.main.flash(240, 255, 244, 180);
    this.sparkleBurst(sx, sy - 10, 12);

    // Advance the Ark and priests in stepped motion to the station
    this.tweens.add({
      targets: [this.arkSpr, this.arkGlow],
      x: sx,
      duration: 500,
      ease: "Stepped",
      easeParams: [6],
    });
    this.tweens.add({
      targets: this.priest1,
      x: sx - 20,
      duration: 500,
      ease: "Stepped",
      easeParams: [6],
    });
    this.tweens.add({
      targets: this.priest2,
      x: sx + 20,
      duration: 500,
      ease: "Stepped",
      easeParams: [6],
    });

    this.curStation++;
    this.talk(STAGE12.speaker, [tr(STAGE12.stationPraise[i])], () => {
      if (this.curStation >= 3) {
        this.startPhase(1);
      }
    });
  }

  private blessFamily(i: number) {
    this.familiesBlessed[i] = true;
    audio.sfx("pickup");
    const [fx, fy] = FAMILIES_AT[i];
    this.sparkleBurst(fx, fy - 10, 8);
    this.talk(STAGE12.speaker, [tr(STAGE12.breadThanks[i])]);
  }

  private hearNathanProphecy() {
    if (this.familiesBlessed.filter(Boolean).length < 3) {
      audio.sfx("wrong");
      this.talk(STAGE12.speaker, [tr(STAGE12.needBreadFirst)]);
      return;
    }

    this.finished = true;
    this.running = false;
    this.david.setTexture("david_king");
    audio.sfx("bless");
    this.cameras.main.flash(400, 255, 244, 180);
    this.sparkleBurst(NATHAN_AT[0], NATHAN_AT[1] - 12, 14);
    this.talk(tx("Ngôn sứ Na-than", "Prophet Nathan"), STAGE12.nathanProphecy.map(tr), () => {
      this.completeStage();
      audio.sfx("complete");
      this.talk(tx("Ấn Thánh Vịnh thứ 12", "Psalm Seal 12"), STAGE12.outro.map(tr), () =>
        this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE12.lesson)], () =>
          this.talk(tx("Từ Ngai Vàng Đa-vít Đến Ngôi Sao Bê-lem", "From David's Throne to Bethlehem's Star"), STAGE12.bridge.map(tr), () =>
            this.goToNextStage()
          )
        )
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
      const bCount = this.familiesBlessed.filter(Boolean).length;
      const txt =
        this.phase === 0
          ? tr(STAGE12.phase[0]).replace("{s}", String(this.curStation))
          : tr(STAGE12.phase[1]).replace("{b}", String(bCount));
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }
  }
}

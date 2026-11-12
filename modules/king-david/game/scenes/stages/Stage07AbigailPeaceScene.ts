import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE7, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const GATE_X = 208;
const START: [number, number][] = [[44, 128], [238, 128]];
const GIFTS_AT: [number, number][] = [
  [84, 92],
  [124, 92],
  [164, 92],
];
const DONKEYS_AT: [number, number][] = [
  [84, 156],
  [128, 156],
  [172, 156],
];
const LEVERS_AT: [number, number, number][] = [
  [300, 96, 326],
  [400, 158, 426],
  [496, 96, 522],
];
const DAVID_PASS_AT: [number, number] = [580, 128];
const PASS_TIME_MS = 45000;

/** Stage 7 (1 Sm 25, 1-35): Help wise Abigail load 3 peace gifts onto 3 donkeys and pull 3 rock levers along the Carmel mountain pass to prevent bloodshed. */
export class Stage07AbigailPeaceScene extends BaseDavidScene {
  private phase = 0; // 0 = Load 3 donkeys at Carmel farm, 1 = Clear 3 mountain pass gates in time
  private running = false;
  private finished = false;
  private holdingGift = -1;
  private giftsTaken = [false, false, false];
  private donkeysLoaded = [false, false, false];
  private leversPulled = [false, false, false];
  private giftSprites: (Phaser.GameObjects.Image | null)[] = [];
  private donkeySprites: Phaser.GameObjects.Image[] = [];
  private donkeyPacks: Phaser.GameObjects.Image[] = [];
  private passDoors: { set: (v: boolean) => void }[] = [];
  private leverPads: Phaser.GameObjects.Image[] = [];
  private gate?: { set: (v: boolean) => void };
  private abigail!: Phaser.GameObjects.Image;
  private davidWarrior!: Phaser.GameObjects.Image;
  private timeLeft = PASS_TIME_MS;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage07AbigailPeaceScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_07_ba_abigaiin_hoa_giai";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.holdingGift = -1;
    this.giftsTaken = [false, false, false];
    this.donkeysLoaded = [false, false, false];
    this.leversPulled = [false, false, false];
    this.giftSprites = [];
    this.donkeySprites = [];
    this.donkeyPacks = [];
    this.passDoors = [];
    this.leverPads = [];
    this.timeLeft = PASS_TIME_MS;
    this.intro = { illustration: "7", speaker: STAGE7.speaker, lines: STAGE7.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Golden sunset sky over Mount Carmel
    [[0x7c2d12, 0, 12], [0xea580c, 12, 10], [0xfde68a, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(0, 34, W, TOP - 38, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Floors: Carmel farm grass (left) & mountain ravine sand (right)
    this.add.tileSprite(0, TOP - 4, GATE_X, H - TOP + 4, "david_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X, TOP - 4, W - GATE_X, H - TOP + 4, "david_sand").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Mountain pass trail
    this.add.rectangle(GATE_X + 4, 114, W - GATE_X - 16, 28, 0xd97706, 0.35).setOrigin(0).setDepth(DEPTH.RUG);

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

    // Carmel farm house, olive trees, and storehouse table
    this.add.image(42, 74, "david_house").setOrigin(0.5, 1).setDepth(74);
    this.add.image(186, 76, "david_olive_tree").setOrigin(0.5, 1).setDepth(76);
    this.add.rectangle(70, 82, 112, 14, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);

    // 3 Peace Gifts on the storehouse table
    GIFTS_AT.forEach(([x, y]) => {
      this.giftSprites.push(this.pickup(x, y, "david_bread"));
    });

    // 3 Donkeys waiting to be loaded
    DONKEYS_AT.forEach(([x, y]) => {
      const d = this.add.image(x, y, "david_donkey").setOrigin(0.5, 1).setDepth(y);
      const pack = this.add.image(x, y - 14, "david_bread").setOrigin(0.5, 1).setDepth(y + 1).setVisible(false);
      this.donkeySprites.push(d);
      this.donkeyPacks.push(pack);
    });

    // 3 Levers & Rock Barriers along the Carmel mountain pass
    LEVERS_AT.forEach(([lx, ly, doorX]) => {
      this.add.image(lx, ly - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);
      const pad = this.add.image(lx, ly, "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
      this.leverPads.push(pad);
      this.passDoors.push(this.door(doorX, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true));
    });

    // David & his men waiting at the eastern end of the pass
    this.davidWarrior = this.prop(DAVID_PASS_AT[0], DAVID_PASS_AT[1], "david_warrior", 16, 8);
    this.litGlow(DAVID_PASS_AT[0], DAVID_PASS_AT[1], 16, "david_glow_gold");
    this.add.image(DAVID_PASS_AT[0] + 22, DAVID_PASS_AT[1] - 18, "david_abishai").setOrigin(0.5, 1).setDepth(DAVID_PASS_AT[1] - 18);
    this.add.image(DAVID_PASS_AT[0] + 22, DAVID_PASS_AT[1] + 18, "david_joab").setOrigin(0.5, 1).setDepth(DAVID_PASS_AT[1] + 18);

    this.abigail = this.add.image(START[0][0] - 14, START[0][1] + 10, "david_abigail").setOrigin(0.5, 1);

    // Interactables
    this.interactables.push(
      ...GIFTS_AT.map(([x, y], i) => ({
        x,
        y: y - 4,
        r: 22,
        label: `${tr(STAGE7.takeGiftHint)}: ${tr(STAGE7.giftNames[i])}`,
        active: () => this.phase === 0 && this.running && !this.giftsTaken[i] && this.holdingGift === -1,
        act: () => this.takeGift(i),
      })),
      ...DONKEYS_AT.map(([x, y], i) => ({
        x,
        y: y - 8,
        r: 26,
        label: tr(STAGE7.loadDonkeyHint),
        active: () => this.phase === 0 && this.running && !this.donkeysLoaded[i],
        act: () => this.loadDonkey(i),
      })),
      ...LEVERS_AT.map(([lx, ly], i) => ({
        x: lx,
        y: ly - 4,
        r: 24,
        label: tr(STAGE7.leverHint),
        active: () => this.phase === 1 && this.running && !this.leversPulled[i],
        act: () => this.pullLever(i),
      })),
      {
        x: DAVID_PASS_AT[0],
        y: DAVID_PASS_AT[1] - 8,
        r: 30,
        label: tr(STAGE7.meetDavidHint),
        active: () => this.phase === 1 && this.running && !this.finished,
        act: () => this.meetDavid(),
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
    this.talk(STAGE7.speaker, STAGE7.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = false;
    this.gate?.set(n === 0);

    if (n === 1) {
      this.timeLeft = PASS_TIME_MS;
      this.leversPulled = [false, false, false];
      this.passDoors.forEach((d) => d.set(true));
      this.leverPads.forEach((p) => p.clearTint());
      // Move loaded donkeys to follow behind Abigail
      this.donkeySprites.forEach((d, idx) => {
        d.setPosition(START[1][0] - 22 - idx * 14, START[1][1] + 12);
        this.donkeyPacks[idx].setVisible(true).setPosition(d.x, d.y - 14);
      });
    }

    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, sx, sy);
    this.player.setVelocity(0, 0);
    this.player.setPosition(sx, sy);
    this.abigail.setPosition(sx - 14, sy + 10);

    if (n === 1 && intro) {
      audio.sfx("chime");
      this.cameras.main.flash(260, 255, 244, 180);
      this.talk(STAGE7.speaker, STAGE7.passReady.map(tr), () => {
        this.running = true;
      });
    } else {
      this.running = true;
    }
  }

  private takeGift(i: number) {
    this.holdingGift = i;
    this.giftsTaken[i] = true;
    audio.sfx("pickup");
    const spr = this.giftSprites[i];
    if (spr) {
      this.sparkleBurst(spr.x, spr.y - 4, 6);
      this.removePickup(spr);
      this.giftSprites[i] = null;
    }
  }

  private loadDonkey(i: number) {
    if (this.holdingGift === -1) {
      audio.sfx("wrong");
      this.talk(STAGE7.speaker, [tr(STAGE7.needGiftMsg)]);
      return;
    }
    this.holdingGift = -1;
    this.donkeysLoaded[i] = true;
    this.donkeyPacks[i].setVisible(true);
    audio.sfx("chime");
    const [dx, dy] = DONKEYS_AT[i];
    this.sparkleBurst(dx, dy - 10, 8);
    if (this.donkeysLoaded.filter(Boolean).length >= 3) {
      this.startPhase(1, true);
    }
  }

  private pullLever(i: number) {
    this.leversPulled[i] = true;
    this.passDoors[i].set(false);
    this.leverPads[i].setTint(0x4ade80);
    audio.sfx("chime");
    const [lx, ly] = LEVERS_AT[i];
    this.sparkleBurst(lx, ly - 6, 8);
  }

  private meetDavid() {
    if (this.leversPulled.filter(Boolean).length < 3) {
      audio.sfx("wrong");
      this.talk(STAGE7.speaker, [tr(STAGE7.needLeversMsg)]);
      return;
    }
    this.finished = true;
    this.running = false;
    audio.sfx("bless");
    this.sparkleBurst(DAVID_PASS_AT[0], DAVID_PASS_AT[1] - 12, 12);
    this.talk(STAGE7.speaker, STAGE7.peaceTalk.map(tr), () => {
      this.completeStage();
      audio.sfx("complete");
      this.talk(tx("Ấn Thánh Vịnh thứ 7", "Psalm Seal 7"), STAGE7.outro.map(tr), () =>
        this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE7.lesson)], () => this.goToNextStage())
      );
    });
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);

    // Abigail follows player
    const txA = this.player.x - 14;
    const tyA = this.player.y + 10;
    const dd = Phaser.Math.Distance.Between(this.abigail.x, this.abigail.y, txA, tyA);
    if (dd > 3) {
      const step = Math.min(dd, (110 * delta) / 1000);
      const a = Math.atan2(tyA - this.abigail.y, txA - this.abigail.x);
      this.abigail.setPosition(Math.round(this.abigail.x + Math.cos(a) * step), Math.round(this.abigail.y + Math.sin(a) * step));
    }
    this.abigail.setDepth(this.abigail.y);

    // In Phase 2, donkeys follow behind Abigail in a caravan
    if (this.phase === 1) {
      this.donkeySprites.forEach((d, idx) => {
        const targetX = this.abigail.x - 18 - idx * 16;
        const targetY = this.abigail.y + 2;
        const dist = Phaser.Math.Distance.Between(d.x, d.y, targetX, targetY);
        if (dist > 3) {
          const step = Math.min(dist, (100 * delta) / 1000);
          const ang = Math.atan2(targetY - d.y, targetX - d.x);
          d.setPosition(Math.round(d.x + Math.cos(ang) * step), Math.round(d.y + Math.sin(ang) * step));
        }
        d.setDepth(d.y);
        this.donkeyPacks[idx].setPosition(d.x, d.y - 14).setDepth(d.y + 1);
      });
    }

    const v = this.cameras.main.worldView;
    if (this.label) {
      const dCount = this.donkeysLoaded.filter(Boolean).length;
      const gCount = this.leversPulled.filter(Boolean).length;
      const secs = Math.max(0, Math.ceil(this.timeLeft / 1000));
      const txt =
        this.phase === 0
          ? tr(STAGE7.phase[0]).replace("{d}", String(dCount))
          : tr(STAGE7.phase[1]).replace("{g}", String(gCount)).replace("{t}", String(secs));
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }

    if (this.phase === 1 && this.running && !this.finished && !this.dialogueOpen) {
      this.timeLeft -= delta;
      if (this.timeLeft <= 0) {
        audio.sfx("wrong");
        this.running = false;
        this.talk(STAGE7.speaker, STAGE7.timeUp.map(tr), () => this.startPhase(1, false));
      }
    }
  }
}

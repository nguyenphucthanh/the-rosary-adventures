import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE1, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 480;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const FIELD_X = 96; // wheat field starts here; Jacob's camp is to the left
const SHEAVES: [number, number][] = [
  [150, 92], [208, 80], [268, 92], [328, 80], [388, 92], [444, 80],
  [150, 168], [208, 180], [268, 168], [328, 180], [388, 168], [444, 180],
];
const CENTER: [number, number] = [300, 128];
// 11 slots around the centre (the brothers' sheaves), computed on integer pixels
const RING: [number, number][] = Array.from({ length: 11 }, (_, i) => {
  const a = (i / 11) * Math.PI * 2;
  return [CENTER[0] + Math.round(Math.cos(a) * 70), CENTER[1] + Math.round(Math.sin(a) * 38)];
});
const SLOTS: [number, number][] = [CENTER, ...RING];

/** Stage 1 (St 37, 1-11): reap 12 sheaves, then stand them up as in Joseph's dream (his own sheaf in the middle). */
export class Stage01DreamSheavesScene extends BaseJosephScene {
  private phase = 0;
  private running = false;
  private finished = false;
  private cut: boolean[] = [];
  private sheafImgs: Phaser.GameObjects.Image[] = [];
  private placed: boolean[] = [];
  private slotImgs: Phaser.GameObjects.Image[] = [];
  private tint?: Phaser.GameObjects.Rectangle;

  constructor() {
    super("Stage01DreamSheavesScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_01_giac_mo_bo_lua";
    this.spawn = [84, 128];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.cut = SHEAVES.map(() => false);
    this.placed = SLOTS.map(() => false);
    this.sheafImgs = [];
    this.slotImgs = [];
    this.intro = { illustration: "1", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE1.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // morning sky + far hills
    [[0x0284c7, 0, 12], [0x38bdf8, 12, 10], [0xbae6fd, 22, 14]].forEach(([c, y, h]) => this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    this.add.tileSprite(0, 32, W, TOP - 32, "joseph_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 32, W, TOP - 32, 0x0f172a, 0.35).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    // sun in the sky (a plain flat disc of rects, stepped)
    this.add.rectangle(420, 14, 12, 12, 0xfde68a).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(418, 16, 16, 8, 0xfde68a).setDepth(DEPTH.FLOOR + 1);

    // floor: camp path (stone) on the left, wheat field in the middle, grass edge below
    this.add.tileSprite(0, TOP - 4, FIELD_X, H - TOP + 4, "joseph_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(FIELD_X, TOP - 4, W - FIELD_X, BOTTOM - TOP + 8, "joseph_wheat").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(FIELD_X, BOTTOM + 4, W - FIELD_X, H - BOTTOM - 4, "joseph_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H, 0xfef08a, 0.06).setOrigin(0).setDepth(DEPTH.LIGHT);

    this.wallBelow(0, W, BOTTOM + 4);

    // colliders: top, bottom, left, right
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);

    // Jacob's camp
    this.add.image(40, 94, "joseph_tent").setOrigin(0.5, 1).setDepth(94);
    this.prop(34, 168, "joseph_rock", 14, 6);
    this.add.image(64, 72, "joseph_thorn").setOrigin(0.5, 1).setDepth(72);

    // Jacob (talks) + brothers reaping at the field edge
    this.glowNpc(46, 156, "joseph_jacob");
    [[132, 100, "joseph_brother"], [132, 176, "joseph_brother_b"], [470, 128, "joseph_brother_c"]].forEach(([x, y, k]) => this.prop(x as number, y as number, k as string, 14, 6));

    // 12 sheaves to reap
    SHEAVES.forEach(([x, y]) => this.sheafImgs.push(this.pickup(x, y, "joseph_sheaf")));
    this.interactables = [
      { x: 46, y: 146, r: 30, label: tr(STAGE1.jacobHint), active: () => this.running && !this.finished, act: () => this.talk(tx("Cha Gia-cóp", "Father Jacob"), STAGE1.jacobTalk.map(tr)) },
      { x: 132, y: 90, r: 26, label: tr(STAGE1.brotherHint), active: () => this.running && !this.finished, act: () => this.talk(tx("Các anh của Giuse", "Joseph's brothers"), STAGE1.brotherTalk.map(tr)) },
      ...SHEAVES.map(([x, y], i) => ({ x, y: y - 6, r: 26, label: tr(STAGE1.sheafHint), active: () => this.phase === 0 && this.running && !this.cut[i], act: () => this.reap(i) })),
    ];
  }

  private glowNpc(x: number, y: number, key: string) {
    this.litGlow(x, y, 26, "joseph_glow_gold");
    return this.prop(x, y, key, 14, 6);
  }

  protected onStageStart() {
    this.setCompanion("joseph_sun");
    this.talk(tx("Giuse", "Joseph"), STAGE1.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore() {
    this.player.setVelocity(0, 0);
  }

  private startPhase(n: number) {
    this.phase = n;
    this.running = true;
    this.saveCheckpoint(`phase${n}`, n);
    this.refreshBanner();
  }

  private refreshBanner() {
    const n = this.phase === 0 ? this.cut.filter(Boolean).length : this.placed.filter(Boolean).length;
    this.setBanner(tr(STAGE1.phase[this.phase]).replace("{n}", String(n)));
  }

  private reap(i: number) {
    this.cut[i] = true;
    audio.sfx("pickup");
    this.removePickup(this.sheafImgs[i]);
    this.sparkleBurst(SHEAVES[i][0], SHEAVES[i][1] - 6, 6);
    this.refreshBanner();
    if (this.cut.every(Boolean)) {
      this.running = false;
      this.talk(tx("Giuse", "Joseph"), STAGE1.dreamStart.map(tr), () => this.beginDream());
    }
  }

  private beginDream() {
    audio.sfx("bless");
    this.cameras.main.flash(400, 196, 181, 253);
    this.tint = this.add.rectangle(0, 0, W, H, 0x7c3aed, 0.18).setOrigin(0).setDepth(DEPTH.FX);
    SLOTS.forEach(([x, y], i) => {
      const slot = this.add.image(x, y, "joseph_slot").setOrigin(0.5, 1).setDepth(y - 1);
      this.slotImgs.push(slot);
      this.tweens.add({ targets: slot, alpha: 0.5, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.interactables.push({ x, y: y - 6, r: 22, label: tr(STAGE1.slotHint), active: () => this.phase === 1 && this.running && !this.placed[i], act: () => this.place(i) });
    });
    this.startPhase(1);
  }

  private place(i: number) {
    if (i !== 0 && !this.placed[0]) {
      audio.sfx("wrong");
      this.talk(tx("Giuse", "Joseph"), [tr(STAGE1.centerFirst)]);
      return;
    }
    this.placed[i] = true;
    audio.sfx("chime");
    const [x, y] = SLOTS[i];
    this.slotImgs[i].setVisible(false);
    this.tweens.killTweensOf(this.slotImgs[i]);
    this.add.image(x, y, "joseph_sheaf").setOrigin(0.5, 1).setDepth(y).setFlipX(i % 2 === 1);
    this.sparkleBurst(x, y - 8, 6);
    this.refreshBanner();
    if (this.placed.every(Boolean)) this.dreamEnds();
  }

  private dreamEnds() {
    this.running = false;
    this.finished = true;
    this.setBanner("");
    this.player.setMovementLock(true);
    // sun, moon (flat discs) and 11 twinkling stars over the sheaves
    const sun = this.add.image(CENTER[0], 28, "joseph_glow_gold").setDepth(DEPTH.FX).setAlpha(0);
    this.tweens.add({ targets: sun, alpha: 1, duration: 900, ease: "Stepped", easeParams: [4] });
    this.add.rectangle(CENTER[0] - 80, 26, 8, 8, 0xe2e8f0).setDepth(DEPTH.FX);
    for (let i = 0; i < 11; i++) {
      const s = this.add.image(CENTER[0] - 100 + i * 20, 12 + (i % 2) * 14, "sparkle").setDepth(DEPTH.FX);
      this.tweens.add({ targets: s, alpha: { from: 0.2, to: 1 }, duration: 500 + i * 40, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
    }
    audio.sfx("bless");
    this.cameras.main.flash(500, 255, 244, 180);
    this.talk(tx("Giấc mơ của Giuse", "Joseph's dream"), STAGE1.dreamDone.map(tr), () => {
      this.tint?.destroy();
      this.player.setMovementLock(false);
      this.finishStage(STAGE1);
    });
  }
}

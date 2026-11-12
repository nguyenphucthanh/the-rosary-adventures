import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE7, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 480;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const CUPBEARER: [number, number] = [96, 126];
const BAKER: [number, number] = [384, 126];

// 8 dream pieces; `who` = which official's dream they belong to
const PIECES: { x: number; y: number; key: string; who: "cup" | "baker" }[] = [
  { x: 58, y: 92, key: "joseph_vine", who: "cup" },
  { x: 130, y: 172, key: "joseph_vine", who: "cup" },
  { x: 236, y: 176, key: "joseph_vine", who: "cup" },
  { x: 48, y: 170, key: "joseph_cup", who: "cup" },
  { x: 344, y: 92, key: "joseph_basket", who: "baker" },
  { x: 432, y: 170, key: "joseph_basket", who: "baker" },
  { x: 240, y: 92, key: "joseph_basket", who: "baker" },
  { x: 438, y: 128, key: "joseph_bird", who: "baker" },
];

/** Stage 7 (St 39, 21 – 40, 23): collect dream pieces, then help Joseph interpret the cupbearer's and the baker's dreams. */
export class Stage07PrisonDreamsScene extends BaseJosephScene {
  private got: boolean[] = [];
  private imgs: (Phaser.GameObjects.Image | null)[] = [];
  private solved = { cup: false, baker: false };
  private running = false;
  private finished = false;

  constructor() {
    super("Stage07PrisonDreamsScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_07_trong_nguc";
    this.spawn = [240, 140];
  }

  create() {
    this.got = PIECES.map(() => false);
    this.imgs = [];
    this.solved = { cup: false, baker: false };
    this.running = this.finished = false;
    this.intro = { illustration: "7", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE7.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "joseph_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 8, W, TOP - 8, "joseph_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 8, 0x05060d).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.3).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0x0f172a, 0.35).setOrigin(0).setDepth(DEPTH.LIGHT); // dim prison
    this.wallBelow(0, W, BOTTOM + 4, "joseph_cliff");
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);

    // narrow window high in the wall + stepped beam of daylight on the floor
    this.add.rectangle(226, 18, 28, 20, 0x422006).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(229, 21, 22, 14, 0x7dd3fc).setOrigin(0).setDepth(DEPTH.FLOOR + 2);
    this.add.rectangle(238, 21, 4, 14, 0x422006).setOrigin(0).setDepth(DEPTH.FLOOR + 2);
    this.add.graphics().setDepth(DEPTH.LIGHT + 1).fillStyle(0xfef9c3, 0.16).fillPoints([{ x: 229, y: TOP - 4 }, { x: 251, y: TOP - 4 }, { x: 290, y: BOTTOM }, { x: 190, y: BOTTOM }], true);

    // cell walls with a doorway at y 112..152 (cupbearer left, baker right)
    for (const x of [160, 320]) {
      for (const [y0, y1] of [[TOP - 4, 112], [152, BOTTOM + 4]]) {
        this.add.tileSprite(x - 6, y0, 12, y1 - y0, "joseph_cliff").setOrigin(0).setDepth(y1);
        this.block(x, (y0 + y1) / 2, 12, y1 - y0);
      }
    }
    // straw mats, jars
    for (const [x, y] of [[40, 190], [60, 70], [420, 70], [440, 190]]) this.add.rectangle(x - 12, y - 4, 28, 10, 0xca8a04).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.image(190, 74, "joseph_jar").setOrigin(0.5, 1).setDepth(74);
    this.add.image(300, 190, "joseph_sack").setOrigin(0.5, 1).setDepth(190);

    // the two officials
    this.litGlow(CUPBEARER[0], CUPBEARER[1], 26, "joseph_glow_gold");
    this.prop(CUPBEARER[0], CUPBEARER[1], "joseph_cupbearer", 14, 6);
    this.litGlow(BAKER[0], BAKER[1], 26, "joseph_glow_gold");
    this.prop(BAKER[0], BAKER[1], "joseph_baker", 14, 6);

    // dream pieces
    this.interactables = [
      { x: CUPBEARER[0], y: CUPBEARER[1] - 10, r: 28, label: tr(STAGE7.cupHint), active: () => this.running && !this.solved.cup, act: () => this.official("cup") },
      { x: BAKER[0], y: BAKER[1] - 10, r: 28, label: tr(STAGE7.bakerHint), active: () => this.running && !this.solved.baker, act: () => this.official("baker") },
    ];
    PIECES.forEach((p, i) => {
      this.imgs[i] = this.pickup(p.x, p.y, p.key);
      this.interactables.push({ x: p.x, y: p.y - 8, r: 22, label: tr(STAGE7.pieceHint), active: () => this.running && !this.got[i], act: () => this.take(i) });
    });
  }

  protected onStageStart() {
    this.setCompanion("joseph_slave");
    this.talk(tx("Giuse", "Joseph"), STAGE7.start.map(tr), () => {
      this.running = true;
      this.saveCheckpoint("start", 0);
      this.refreshBanner();
    });
  }

  protected onCheckpointRestore() {
    this.player.setVelocity(0, 0);
  }

  private refreshBanner() {
    this.setBanner(tr(STAGE7.banner).replace("{n}", String(this.got.filter(Boolean).length)));
  }

  private take(i: number) {
    this.got[i] = true;
    audio.sfx("pickup");
    const img = this.imgs[i];
    if (img) this.removePickup(img);
    this.sparkleBurst(PIECES[i].x, PIECES[i].y - 8, 6);
    this.refreshBanner();
  }

  private official(who: "cup" | "baker") {
    const mine = PIECES.map((p, i) => (p.who === who ? i : -1)).filter((i) => i >= 0);
    if (!mine.every((i) => this.got[i])) return this.talk(tx("Giuse", "Joseph"), [tr(STAGE7.needPieces)]);
    const cup = who === "cup";
    const opts = (cup ? STAGE7.cupOptions : STAGE7.bakerOptions);
    this.talk(
      cup ? tx("Quan tửu chánh", "Chief cupbearer") : tx("Quan thượng thiện", "Chief baker"),
      [...(cup ? STAGE7.cupDream : STAGE7.bakerDream).map(tr), tr(STAGE7.ask)],
      undefined,
      opts.map((o) => ({
        label: tr(o.label),
        onSelect: () => {
          if (!o.ok) {
            audio.sfx("wrong");
            return this.talk(tx("Giuse", "Joseph"), [tr(STAGE7.wrong)]);
          }
          this.solved[who] = true;
          audio.sfx("chime");
          this.sparkleBurst(Math.round(this.player.x), Math.round(this.player.y - 8), 10);
          this.talk(tx("Giuse", "Joseph"), cup ? [tr(STAGE7.right), tr(STAGE7.remember)] : [tr(STAGE7.right)], () => {
            if (this.solved.cup && this.solved.baker) this.finish();
          });
        },
      }))
    );
  }

  private finish() {
    this.finished = true;
    this.running = false;
    this.setBanner("");
    audio.sfx("bless");
    this.cameras.main.flash(400, 255, 244, 190);
    this.finishStage(STAGE7);
  }
}

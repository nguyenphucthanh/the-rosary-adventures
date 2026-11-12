import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE11, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 480;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const CUP_SACK = 10; // Benjamin's sack
// 11 sacks in two rows
const SACKS: [number, number][] = [
  ...[80, 144, 208, 272, 336, 400].map((x): [number, number] => [x, 100]),
  ...[112, 176, 240, 304, 368].map((x): [number, number] => [x, 164]),
];

/** Stage 11 (St 43-44): search 11 sacks for the silver cup, then choose Judah's plea. */
export class Stage11SilverCupScene extends BaseJosephScene {
  private opened: boolean[] = [];
  private sackImgs: Phaser.GameObjects.Image[] = [];
  private running = false;
  private finished = false;

  constructor() {
    super("Stage11SilverCupScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_11_chen_bac_giuda";
    this.spawn = [240, 132];
  }

  create() {
    this.opened = SACKS.map(() => false);
    this.sackImgs = [];
    this.running = this.finished = false;
    this.intro = { illustration: "11", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE11.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "joseph_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 8, W, TOP - 8, "joseph_brick").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 8, 0x0f172a).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 40, W, 4, 0x2563eb).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 44, W, 2, 0xfbbf24).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0x7c2d12, 0.1).setOrigin(0).setDepth(DEPTH.LIGHT); // torch-lit banquet hall
    this.wallBelow(0, W, BOTTOM + 4, "joseph_brick");
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    for (const x of [30, 150, 330, 450]) this.add.image(x, TOP + 8, "joseph_pillar").setOrigin(0.5, 1).setDepth(TOP + 8);
    // long banquet table with the governor's seat
    this.add.rectangle(120, 64, 240, 10, 0x1d4ed8).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.image(238, 64, "joseph_table").setOrigin(0.5, 1).setDepth(64);
    this.add.image(300, 64, "joseph_table").setOrigin(0.5, 1).setDepth(64);

    // brothers waiting at the sides, Benjamin beside his sack
    [[34, 100, "joseph_brother"], [34, 140, "joseph_brother_b"], [34, 180, "joseph_brother_c"], [446, 100, "joseph_brother"], [446, 140, "joseph_brother_b"], [446, 180, "joseph_brother_c"], [60, 70, "joseph_brother_b"], [420, 70, "joseph_brother_c"]].forEach(([x, y, k]) => this.add.image(x as number, y as number, k as string).setOrigin(0.5, 1).setDepth(y as number));
    this.add.image(SACKS[CUP_SACK][0] + 22, SACKS[CUP_SACK][1] + 6, "joseph_benjamin").setOrigin(0.5, 1).setDepth(SACKS[CUP_SACK][1] + 6);

    this.interactables = [];
    SACKS.forEach(([x, y], i) => {
      const img = this.add.image(x, y, "joseph_sack").setOrigin(0.5, 1).setDepth(y);
      this.sackImgs.push(img);
      this.add.image(x, y - 6, "joseph_glow_gold").setDepth(y - 1).setAlpha(0.35);
      this.interactables.push({ x, y: y - 6, r: 22, label: tr(STAGE11.sackHint), active: () => this.running && !this.opened[i], act: () => this.open(i) });
    });
    // faint silver glint on the guilty sack (the hint)
    const [cx, cy] = SACKS[CUP_SACK];
    const glint = this.add.image(cx + 4, cy - 14, "sparkle").setDepth(cy + 1);
    this.tweens.add({ targets: glint, alpha: { from: 0.1, to: 0.9 }, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
  }

  protected onStageStart() {
    this.setCompanion("joseph_governor");
    this.talk(tx("Giuse", "Joseph"), STAGE11.start.map(tr), () => {
      this.running = true;
      this.saveCheckpoint("start", 0);
      this.refreshBanner();
    });
  }

  protected onCheckpointRestore() {
    this.player.setVelocity(0, 0);
  }

  private refreshBanner() {
    this.setBanner(tr(STAGE11.banner).replace("{n}", String(this.opened.filter(Boolean).length)));
  }

  private open(i: number) {
    this.opened[i] = true;
    this.sackImgs[i].setAlpha(0.5);
    audio.sfx("pickup");
    this.refreshBanner();
    const [x, y] = SACKS[i];
    if (i !== CUP_SACK) {
      const t = this.add.text(x, y - 20, tr(STAGE11.grain), { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 2, y: 0 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.FX);
      this.tweens.add({ targets: t, y: y - 30, alpha: 0, duration: 1200, ease: "Stepped", easeParams: [4], onComplete: () => t.destroy() });
      return;
    }
    // the cup!
    this.running = false;
    this.setBanner("");
    this.add.image(x, y - 14, "joseph_cup").setOrigin(0.5, 1).setDepth(y + 2);
    this.sparkleBurst(x, y - 10, 12);
    audio.sfx("bless");
    this.talk(tx("Lời kể", "Narrator"), STAGE11.found.map(tr), () => this.ask());
  }

  private ask() {
    this.talk(
      tx("Giu-đa", "Judah"),
      [tr(STAGE11.ask)],
      undefined,
      STAGE11.options.map((o) => ({
        label: tr(o.label),
        onSelect: () => {
          if (!o.ok) {
            audio.sfx("wrong");
            return this.talk(tx("Giuse", "Joseph"), [tr(STAGE11.wrong)], () => this.ask());
          }
          this.finished = true;
          audio.sfx("bless");
          this.cameras.main.flash(500, 255, 244, 190);
          this.talk(tx("Lời kể", "Narrator"), [tr(STAGE11.right)], () => this.finishStage(STAGE11));
        },
      }))
    );
  }
}

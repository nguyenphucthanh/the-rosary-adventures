import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE9, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 560;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const YEARS = 7;
const PER_YEAR = 3;
const GRANARY_Y = 112;
const gx = (i: number) => 52 + i * 76; // granary slot x
// deterministic field spots for every year's 3 sheaves (lower field band, never on the granary row)
const spot = (year: number, k: number): [number, number] => {
  const n = year * PER_YEAR + k;
  return [40 + ((n * 37 + year * 53) % 480), 150 + ((n * 19) % 44)];
};

/** Stage 9 (St 41, 37-52): 7 plentiful years. Each year carry 3 sheaves to the granary being built; a new granary rises after each year. */
export class Stage09GranariesScene extends BaseJosephScene {
  private year = 0;
  private filled = 0;
  private running = false;
  private finished = false;
  private carrying = false;
  private granaries: Phaser.GameObjects.Image[] = [];
  private sheaves: (Phaser.GameObjects.Image | null)[] = [];

  constructor() {
    super("Stage09GranariesScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_09_te_tuong_kho_lua";
    this.spawn = [280, 150];
  }

  create() {
    this.year = this.filled = 0;
    this.running = this.finished = this.carrying = false;
    this.granaries = [];
    this.sheaves = [];
    this.intro = { illustration: "9", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE9.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Nile at the top, green valley below
    [[0x38bdf8, 0, 14], [0xbae6fd, 14, 10]].forEach(([c, y, h]) => this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    this.add.tileSprite(0, 24, W, 36, "joseph_pool").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "joseph_field").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 140, W, 60, "joseph_wheat").setOrigin(0).setDepth(DEPTH.FLOOR + 1).setTint(0xa8c24a).setAlpha(0.9); // fresh green-gold wheat strip
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfef08a, 0.05).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.wallBelow(0, W, BOTTOM + 4, "joseph_brick");
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    for (const [x, y] of [[20, 84], [540, 90], [300, 74]]) this.add.image(x, y, "joseph_palm").setOrigin(0.5, 1).setDepth(y);

    // seven granary slots: ghost of the next one, full-colour once built
    for (let i = 0; i < YEARS; i++) {
      const g = this.add.image(gx(i), GRANARY_Y + 24, "joseph_granary").setOrigin(0.5, 1).setDepth(GRANARY_Y + 24).setAlpha(0.28);
      this.granaries.push(g);
      this.block(gx(i), GRANARY_Y + 14, 26, 10);
      this.interactables.push({ x: gx(i), y: GRANARY_Y + 32, r: 26, label: tr(STAGE9.granaryHint), active: () => this.running && this.carrying && this.year === i, act: () => this.deposit() });
    }

    this.litGlow(300, 76, 10, "joseph_glow_sky");
  }

  protected onStageStart() {
    this.setCompanion("joseph_governor");
    this.talk(tx("Giuse", "Joseph"), STAGE9.start.map(tr), () => {
      this.running = true;
      this.spawnYear(0);
    });
  }

  protected onCheckpointRestore() {
    this.player.setVelocity(0, 0);
    // drop the carried sheaf back into the field
    if (this.carrying) {
      this.carrying = false;
      this.setCarry(null);
      const k = this.sheaves.findIndex((s) => s === null);
      if (k >= 0) this.placeSheaf(k);
    }
  }

  private spawnYear(y: number) {
    this.year = y;
    this.filled = 0;
    this.sheaves.forEach((s) => s && this.removePickup(s));
    this.sheaves = [];
    for (let k = 0; k < PER_YEAR; k++) {
      this.sheaves[k] = this.placeSheaf(k);
    }
    this.granaries[y]?.setAlpha(0.5); // the granary under construction
    if (y % 2 === 0) this.saveCheckpoint(`year${y}`, y);
    this.refreshBanner();
  }

  private placeSheaf(k: number) {
    const [x, y] = spot(this.year, k);
    const img = this.pickup(x, y, "joseph_sheaf");
    this.sheaves[k] = img;
    this.interactables.push({ x, y: y - 8, r: 24, label: tr(STAGE9.sheafHint), active: () => this.running && !this.carrying && this.sheaves[k] === img, act: () => this.pickSheaf(k) });
    return img;
  }

  private pickSheaf(k: number) {
    const img = this.sheaves[k];
    if (!img) return;
    this.removePickup(img);
    this.sheaves[k] = null;
    this.carrying = true;
    this.setCarry("joseph_sheaf");
    audio.sfx("pickup");
  }

  private deposit() {
    this.carrying = false;
    this.setCarry(null);
    this.filled++;
    audio.sfx("chime");
    this.sparkleBurst(gx(this.year), GRANARY_Y + 4, 6);
    if (this.filled < PER_YEAR) return this.refreshBanner();
    // year complete: the granary stands, next year begins
    this.granaries[this.year].setAlpha(1);
    audio.sfx("bless");
    this.cameras.main.flash(200, 255, 244, 190);
    if (this.year + 1 >= YEARS) return this.finish();
    this.running = false;
    this.talk(tx("Giuse", "Joseph"), [tr(STAGE9.yearDone)], () => {
      this.running = true;
      this.spawnYear(this.year + 1);
    });
  }

  private refreshBanner() {
    this.setBanner(tr(STAGE9.banner).replace("{y}", String(this.year + 1)).replace("{k}", String(this.filled)));
  }

  private finish() {
    this.finished = true;
    this.running = false;
    this.setBanner("");
    this.talk(tx("Lời kể", "Narrator"), STAGE9.finale.map(tr), () => this.finishStage(STAGE9));
  }
}

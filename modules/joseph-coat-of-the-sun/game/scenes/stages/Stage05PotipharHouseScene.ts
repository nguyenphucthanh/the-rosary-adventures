import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE5, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 480;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const TASK_SECONDS = 40;

type Pt = [number, number];
// Places (x, y of the point the player stands near)
const POND: Pt = [398, 108];
const KITCHEN: Pt = [236, 112];
const YARD_SACKS: Pt = [356, 170];
const STORE_SPOT: Pt = [70, 152];
const STORE_STACK: Pt = [70, 106];
const SHELF: Pt = [196, 98];
const TABLE: Pt = [250, 160];
const GARDEN: Pt = [428, 172];

const TASKS: { item: string; from: Pt; to: Pt }[] = [
  { item: "joseph_jar", from: POND, to: KITCHEN },
  { item: "joseph_sack", from: YARD_SACKS, to: STORE_SPOT },
  { item: "joseph_cup", from: SHELF, to: TABLE },
  { item: "joseph_jar", from: POND, to: GARDEN },
  { item: "joseph_sack", from: STORE_STACK, to: KITCHEN },
];

/** Stage 5 (St 39, 1-6): Potiphar's house. Five delivery tickets, each with a time limit (no harsh penalty: late = redo the ticket). */
export class Stage05PotipharHouseScene extends BaseJosephScene {
  private task = 0;
  private carrying = false;
  private running = false;
  private finished = false;
  private timeLeft = TASK_SECONDS;

  constructor() {
    super("Stage05PotipharHouseScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_05_nha_putiphac";
    this.spawn = [236, 140];
  }

  create() {
    this.task = 0;
    this.carrying = this.running = this.finished = false;
    this.timeLeft = TASK_SECONDS;
    this.intro = { illustration: "5", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE5.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // floors: storeroom (brick), kitchen (stone), courtyard (grass); brick back wall
    this.add.tileSprite(0, TOP - 4, 160, H - TOP + 4, "joseph_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(160, TOP - 4, 160, H - TOP + 4, "joseph_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(320, TOP - 4, W - 320, H - TOP + 4, "joseph_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 8, W, TOP - 8, "joseph_brick").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 8, 0x0f172a).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfef08a, 0.05).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.wallBelow(0, W, BOTTOM + 4, "joseph_brick");
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    // dividers with a doorway at y 112..152
    for (const x of [160, 320]) {
      for (const [y0, y1] of [[TOP - 4, 112], [152, BOTTOM + 4]]) {
        this.add.tileSprite(x - 6, y0, 12, y1 - y0, "joseph_brick").setOrigin(0).setDepth(y1);
        this.block(x, (y0 + y1) / 2, 12, y1 - y0);
      }
    }
    // lotus pond + palms (courtyard)
    this.add.tileSprite(372, 66, 56, 30, "joseph_pool").setOrigin(0).setDepth(DEPTH.RUG);
    this.block(400, 82, 56, 26);
    this.add.image(364, 100, "joseph_palm").setOrigin(0.5, 1).setDepth(100);
    this.add.image(452, 98, "joseph_palm").setOrigin(0.5, 1).setDepth(98);
    this.add.image(GARDEN[0], GARDEN[1] + 16, "joseph_garden").setOrigin(0.5, 1).setDepth(GARDEN[1] + 16); // flower bed to water
    this.litGlow(GARDEN[0], GARDEN[1] + 4, 12, "joseph_glow_sky");
    // kitchen: oven, shelf (cups), table + Potiphar
    this.prop(236, 92, "joseph_oven", 26, 8);
    this.add.image(SHELF[0], SHELF[1] - 14, "joseph_cup").setOrigin(0.5, 1).setDepth(SHELF[1]);
    this.prop(SHELF[0], SHELF[1] - 2, "joseph_table", 38, 8);
    this.prop(TABLE[0], TABLE[1] + 8, "joseph_table", 38, 8);
    this.prop(292, 170, "joseph_potiphar", 14, 6);
    // storeroom stacks + yard sacks
    for (const [x, y] of [[STORE_STACK[0] - 10, STORE_STACK[1]], [STORE_STACK[0] + 8, STORE_STACK[1] - 2], [STORE_STACK[0], STORE_STACK[1] - 14]]) this.add.image(x, y, "joseph_sack").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[YARD_SACKS[0] - 8, YARD_SACKS[1]], [YARD_SACKS[0] + 8, YARD_SACKS[1] + 2]]) this.add.image(x, y, "joseph_sack").setOrigin(0.5, 1).setDepth(y);
    // grain storehouse: two granaries flank the stack
    for (const x of [30, 112]) this.prop(x, 100, "joseph_granary", 30, 8);
    this.litGlow(292, 170, 26, "joseph_glow_gold");

    // interactables for every ticket: pick up at `from`, drop at `to`
    this.interactables = [
      { x: 292, y: 160, r: 26, label: tr(STAGE5.potipharHint), active: () => this.running, act: () => this.talk(tx("Ông Pút-ti-phác", "Master Potiphar"), STAGE5.potipharTalk.map(tr)) },
    ];
    TASKS.forEach((t, i) => {
      this.interactables.push({ x: t.from[0], y: t.from[1], r: 28, label: () => tr(STAGE5.tasks[i].from), active: () => this.running && this.task === i && !this.carrying, act: () => this.pickUp(i) });
      this.interactables.push({ x: t.to[0], y: t.to[1], r: 28, label: () => tr(STAGE5.tasks[i].to), active: () => this.running && this.task === i && this.carrying, act: () => this.dropOff(i) });
    });
  }

  protected onStageStart() {
    this.setCompanion("joseph_slave");
    this.talk(tx("Giuse", "Joseph"), STAGE5.start.map(tr), () => {
      this.running = true;
      this.timeLeft = TASK_SECONDS;
      this.saveCheckpoint("t0", 0);
    });
  }

  protected onCheckpointRestore() {
    this.setCarry(null);
    this.carrying = false;
    this.timeLeft = TASK_SECONDS;
  }

  private pickUp(i: number) {
    this.carrying = true;
    this.setCarry(TASKS[i].item);
    audio.sfx("pickup");
  }

  private dropOff(i: number) {
    this.carrying = false;
    this.setCarry(null);
    audio.sfx("chime");
    this.sparkleBurst(TASKS[i].to[0], TASKS[i].to[1] - 8, 8);
    this.task++;
    this.timeLeft = TASK_SECONDS;
    if (this.task >= TASKS.length) return this.allDone();
    this.saveCheckpoint(`t${this.task}`, this.task);
    this.talk(tx("Ông Pút-ti-phác", "Master Potiphar"), [tr(STAGE5.taskDone)]);
  }

  private allDone() {
    this.running = false;
    this.finished = true;
    this.setBanner("");
    audio.sfx("bless");
    this.cameras.main.flash(400, 255, 244, 190);
    this.talk(tx("Ông Pút-ti-phác", "Master Potiphar"), STAGE5.done.map(tr), () => this.finishStage(STAGE5));
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (!this.running || this.finished) return;
    if (!this.dialogueOpen) {
      this.timeLeft -= delta / 1000;
      if (this.timeLeft <= 0) {
        this.carrying = false;
        this.setCarry(null);
        this.timeLeft = TASK_SECONDS;
        audio.sfx("wrong");
        this.talk(tx("Giuse", "Joseph"), [tr(STAGE5.late)]);
      }
    }
    const t = STAGE5.tasks[Math.min(this.task, TASKS.length - 1)];
    this.setBanner(`${tr(t.banner)}\n${tr(STAGE5.banner).replace("{n}", String(this.task + 1)).replace("{s}", String(Math.max(0, Math.ceil(this.timeLeft))))}`);
  }
}

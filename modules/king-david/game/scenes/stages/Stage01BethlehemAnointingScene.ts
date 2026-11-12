import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH, type Interactable } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE1, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72; // top wall (collider) ends here
const BOTTOM = 180; // bottom collider starts here: walkable band y 72..180
const GATE_X = 236; // pasture gate between Jesse's courtyard (left) and Bethlehem pasture (right)
const START: [number, number][] = [[380, 128], [210, 128]];
const PEN = { x1: 344, y1: 96, y2: 158 };
const SLOTS: [number, number][] = [
  [280, 110], [306, 110], [330, 110],
  [280, 144], [306, 144], [330, 144],
];
const LOST: [number, number][] = [
  [410, 96], [472, 116], [546, 98],
  [424, 162], [504, 156], [568, 138],
];
const SAMUEL_AT: [number, number] = [64, 132];
const JESSE_AT: [number, number] = [124, 102];
const ELIAB_AT: [number, number] = [174, 102];

interface Sheep {
  spr: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  x: number;
  y: number;
  state: "lost" | "follow" | "pen";
  slot: number;
}

interface Beast {
  spr: Phaser.GameObjects.Image;
  ring: Phaser.GameObjects.Image;
  x: number;
  y: number;
  active: boolean;
  kind: "lion" | "bear";
}

/** Stage 1 (1 Sm 16, 1-13): Herd 6 sheep into the pen & drive off 3 predators (lion/bear), then return to Jesse's house for Samuel's anointing. */
export class Stage01BethlehemAnointingScene extends BaseDavidScene {
  private phase = 0;
  private running = false;
  private finished = false;
  private sheep: Sheep[] = [];
  private beast!: Beast;
  private beastsRepelled = 0;
  private beastCooldown = 2200;
  private gate?: { set: (v: boolean) => void };
  private david!: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage01BethlehemAnointingScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_01_dong_co_belem_xuc_dau";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.sheep = [];
    this.beastsRepelled = 0;
    this.beastCooldown = 2200;
    this.intro = { illustration: "1", speaker: STAGE1.speaker, lines: STAGE1.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Morning sky over Bethlehem hills
    [[0x0284c7, 0, 12], [0x38bdf8, 12, 10], [0xbae6fd, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(0, 34, W, TOP - 38, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Left: Jesse's courtyard in Bethlehem; Right: emerald pasture + stream
    this.add.tileSprite(0, TOP - 4, GATE_X, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X, TOP - 4, W - GATE_X, H - TOP + 4, "david_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(16, 114, GATE_X - 16, 28, "david_sand").setOrigin(0).setDepth(DEPTH.RUG);

    // Sparkling stream along the east pasture edge
    this.add.rectangle(594, TOP - 4, 34, BOTTOM - TOP + 4, 0x0284c7).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(598, TOP - 4, 26, BOTTOM - TOP + 4, 0x38bdf8).setOrigin(0).setDepth(DEPTH.RUG);
    for (let y = 80; y < BOTTOM - 8; y += 18) {
      this.add.rectangle(604 + ((y / 18) % 2) * 8, y, 6, 2, 0xffffff, 0.7).setOrigin(0).setDepth(DEPTH.RUG + 1);
    }

    // Bottom cliff lip below walkable area
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x14532d).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H, 0xfef08a, 0.06).setOrigin(0).setDepth(DEPTH.LIGHT);

    // World bounds colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(608, H / 2, 32, H); // stream bank collider
    this.gate = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true);

    // Sheep pen in the pasture (open on the right side x = 344)
    for (const [x, y, w, h] of [[304, 92, 80, 6], [304, 162, 80, 6], [266, 127, 6, 76]]) {
      this.add.tileSprite(x, y, w, h, "david_fence").setDepth(y + h / 2);
      this.block(x, y, w, h);
    }

    // Jesse's house & olive trees
    this.add.image(96, 74, "david_house").setOrigin(0.5, 1).setDepth(74);
    for (const [x, y] of [[34, 82], [202, 80], [368, 78], [520, 78], [460, 178]]) {
      this.add.image(x, y, "david_olive_tree").setOrigin(0.5, 1).setDepth(y);
    }
    for (const [x, y] of [[154, 174], [254, 82], [430, 82], [580, 84], [386, 176], [548, 176]]) {
      this.add.image(x, y, "david_rock").setOrigin(0.5, 1).setDepth(y);
    }
    for (const [x, y] of [[48, 174], [216, 174], [344, 82], [490, 82], [582, 172]]) {
      this.add.image(x, y, "david_shrub").setOrigin(0.5, 1).setDepth(y);
    }

    // Jesse's courtyard characters: Prophet Samuel, Jesse, Eliab and brothers
    const samGlow = this.add.image(SAMUEL_AT[0], SAMUEL_AT[1] - 10, "david_glow_gold").setDepth(SAMUEL_AT[1] - 1).setAlpha(0.75);
    this.tweens.add({ targets: samGlow, alpha: 1, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.prop(SAMUEL_AT[0], SAMUEL_AT[1], "david_samuel", 16, 8);
    this.prop(JESSE_AT[0], JESSE_AT[1], "david_jesse", 16, 8);
    this.prop(ELIAB_AT[0], ELIAB_AT[1], "david_eliab", 16, 8);
    for (const [bx, by] of [[124, 162], [154, 162], [184, 162]]) {
      this.add.image(bx, by, "david_eliab").setOrigin(0.5, 1).setDepth(by);
    }

    // 6 lost sheep in the pasture
    LOST.forEach(([x, y], i) => {
      const glow = this.add.image(x, y - 6, "david_glow_gold").setDepth(y - 1).setAlpha(0.55);
      this.tweens.add({ targets: glow, alpha: 0.9, duration: 750 + i * 70, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      const spr = this.add.image(x, y, "david_sheep").setOrigin(0.5, 1).setDepth(y).setFlipX(i % 2 === 1);
      this.sheep.push({ spr, glow, x, y, state: "lost", slot: -1 });
    });

    // Predator sprite (lion / bear) hidden until charging
    const ring = this.add.image(0, 0, "david_glow_fire").setAlpha(0.8).setVisible(false);
    const bSpr = this.add.image(0, 0, "david_lion").setOrigin(0.5, 1).setVisible(false);
    this.beast = { spr: bSpr, ring, x: 590, y: 128, active: false, kind: "lion" };

    // Young shepherd David companion
    this.david = this.add.image(START[0][0] - 18, START[0][1] + 14, "david_shepherd").setOrigin(0.5, 1);

    // Interactables
    const sheepIts: Interactable[] = this.sheep.map((s) => ({
      get x() { return s.x; },
      get y() { return s.y - 8; },
      r: 28,
      label: tr(STAGE1.sheepHint),
      active: () => this.phase === 0 && this.running && s.state === "lost",
      act: () => this.callSheep(s),
    }));

    this.interactables.push(
      ...sheepIts,
      {
        get x() { return bSpr.x; },
        get y() { return bSpr.y - 10; },
        r: 44,
        label: tr(STAGE1.beastHint),
        active: () => this.phase === 0 && this.running && this.beast.active,
        act: () => this.repelBeast(),
      },
      {
        x: ELIAB_AT[0],
        y: ELIAB_AT[1] - 10,
        r: 28,
        label: tr(STAGE1.brotherHint),
        active: () => this.phase === 1 && this.running && !this.finished,
        act: () => this.talk(tx("Anh cả Ê-li-áp", "Brother Eliab"), STAGE1.brotherTalk.map(tr)),
      },
      {
        x: JESSE_AT[0],
        y: JESSE_AT[1] - 10,
        r: 28,
        label: tr(STAGE1.jesseHint),
        active: () => this.phase === 1 && this.running && !this.finished,
        act: () => this.talk(tx("Cha Giê-sê", "Father Jesse"), STAGE1.jesseTalk.map(tr)),
      },
      {
        x: SAMUEL_AT[0],
        y: SAMUEL_AT[1] - 10,
        r: 32,
        label: tr(STAGE1.samuelHint),
        active: () => this.phase === 1 && this.running && !this.finished,
        act: () => this.anointDavid(),
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
    this.talk(tx("Đa-vít", "David"), STAGE1.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  protected useHarpOrSling(): boolean {
    if (this.phase === 0 && this.running && this.beast.active) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.beast.x, this.beast.y);
      if (d <= 54) {
        this.repelBeast();
        return false;
      }
    }
    this.swingSlingOrStaff("david_staff");
    return false;
  }

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = false;
    this.beast.active = false;
    this.beast.spr.setVisible(false);
    this.beast.ring.setVisible(false);
    this.gate?.set(n === 0);

    if (n === 0) {
      this.beastsRepelled = 0;
      this.beastCooldown = 1800;
      this.sheep.forEach((s, i) => {
        s.state = "lost";
        s.slot = -1;
        s.x = LOST[i][0];
        s.y = LOST[i][1];
        s.glow.setVisible(true);
        s.spr.setPosition(s.x, s.y).setDepth(s.y);
      });
    } else {
      this.beastsRepelled = 3;
      this.sheep.forEach((s, i) => {
        s.state = "pen";
        s.slot = i;
        s.x = SLOTS[i][0];
        s.y = SLOTS[i][1];
        s.glow.setVisible(false);
        s.spr.setPosition(s.x, s.y).setDepth(s.y);
      });
    }

    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, intro && n > 0 ? this.player.x : sx, intro && n > 0 ? this.player.y : sy);
    if (!intro || n === 0) {
      this.player.setVelocity(0, 0);
      this.player.setPosition(sx, sy);
      this.david.setPosition(sx - 18, sy + 14);
    }

    if (n === 1 && intro) {
      audio.sfx("bless");
      this.cameras.main.flash(300, 255, 244, 190);
      this.talk(STAGE1.speaker, STAGE1.callHome.map(tr), () => {
        this.running = true;
      });
    } else {
      this.running = true;
    }
  }

  private callSheep(s: Sheep) {
    s.state = "follow";
    s.glow.setVisible(false);
    audio.sfx("pickup");
    this.sparkleBurst(s.x, s.y - 6, 6);
  }

  private spawnBeast() {
    const kind = this.beastsRepelled % 2 === 0 ? "lion" : "bear";
    this.beast.kind = kind;
    this.beast.active = true;
    this.beast.x = 584;
    this.beast.y = 104 + (this.beastsRepelled % 3) * 24;
    this.beast.spr.setTexture(kind === "lion" ? "david_lion" : "david_bear").setPosition(this.beast.x, this.beast.y).setDepth(this.beast.y).setVisible(true);
    this.beast.ring.setPosition(this.beast.x, this.beast.y - 8).setDepth(this.beast.y - 1).setVisible(true);
    audio.sfx("wrong");
  }

  private repelBeast() {
    if (!this.beast.active) return;
    this.swingSlingOrStaff("david_staff");
    this.beast.active = false;
    this.beastsRepelled = Math.min(3, this.beastsRepelled + 1);
    this.beastCooldown = 2600;
    audio.sfx("chime");
    this.sparkleBurst(this.beast.x, this.beast.y - 8, 8);
    this.beast.ring.setVisible(false);
    this.tweens.add({
      targets: this.beast.spr,
      x: 610,
      alpha: 0,
      duration: 360,
      ease: "Stepped",
      easeParams: [4],
      onComplete: () => {
        this.beast.spr.setVisible(false).setAlpha(1);
        this.checkPastureComplete();
      },
    });
  }

  private checkPastureComplete() {
    const penned = this.sheep.filter((s) => s.state === "pen").length;
    if (penned >= 6 && this.beastsRepelled >= 3 && this.phase === 0) {
      this.startPhase(1, true);
    }
  }

  private anointDavid() {
    if (this.finished) return;
    this.finished = true;
    this.running = false;
    this.player.setMovementLock(true);
    audio.sfx("shofar");
    this.sparkleBurst(SAMUEL_AT[0], SAMUEL_AT[1] - 12, 14);
    const dove = this.spawnDove(SAMUEL_AT[0], TOP + 4);
    this.glideTo(dove, this.david.x, this.david.y - 24, 1200);
    this.cameras.main.flash(500, 255, 244, 180);
    this.talk(tx("Ngôn sứ Sa-mu-en", "Prophet Samuel"), STAGE1.anointing.map(tr), () => this.finishStage(STAGE1));
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);

    // David follows beside the player
    const txDavid = this.player.x - 18;
    const tyDavid = this.player.y + 14;
    const dd = Phaser.Math.Distance.Between(this.david.x, this.david.y, txDavid, tyDavid);
    if (dd > 3) {
      const step = Math.min(dd, (110 * delta) / 1000);
      const a = Math.atan2(tyDavid - this.david.y, txDavid - this.david.x);
      this.david.setPosition(Math.round(this.david.x + Math.cos(a) * step), Math.round(this.david.y + Math.sin(a) * step));
    }
    this.david.setDepth(this.david.y);

    // Update sheep following & entering the pen
    if (this.phase === 0 && this.running && !this.dialogueOpen) {
      let followIdx = 0;
      const pennedCount = this.sheep.filter((s) => s.state === "pen").length;
      this.sheep.forEach((s, idx) => {
        if (s.state === "follow") {
          followIdx++;
          const targetX = this.player.x + followIdx * 16;
          const targetY = Phaser.Math.Clamp(this.player.y + ((followIdx % 2) * 10 - 5), TOP + 14, BOTTOM - 6);
          const d = Phaser.Math.Distance.Between(s.x, s.y, targetX, targetY);
          if (d > 4) {
            const step = Math.min(d, (96 * delta) / 1000);
            const a = Math.atan2(targetY - s.y, targetX - s.x);
            s.x = Math.round(s.x + Math.cos(a) * step);
            s.y = Math.round(s.y + Math.sin(a) * step);
            s.spr.setFlipX(Math.cos(a) < 0);
          }
          // Check if sheep walked into the pen
          if (s.x <= PEN.x1 && s.y >= PEN.y1 && s.y <= PEN.y2) {
            const slot = this.sheep.filter((o) => o.state === "pen").length;
            s.state = "pen";
            s.slot = slot;
            s.x = SLOTS[slot][0];
            s.y = SLOTS[slot][1];
            audio.sfx("chime");
            this.sparkleBurst(s.x, s.y - 6, 8);
            this.checkPastureComplete();
          }
          s.spr.setPosition(s.x, s.y).setDepth(s.y);
        } else if (s.state === "lost") {
          s.glow.setPosition(s.x, s.y - 6);
          void idx;
        }
      });

      // Spawn and move predators until 3 beasts are repelled
      if (!this.beast.active && this.beastsRepelled < 3) {
        this.beastCooldown -= delta;
        if (this.beastCooldown <= 0 && (pennedCount > 0 || followIdx > 0 || this.beastsRepelled > 0)) {
          this.spawnBeast();
        }
      } else if (this.beast.active) {
        const target = this.sheep.find((s) => s.state === "follow") ?? { x: 370, y: 128 };
        const a = Math.atan2(target.y - this.beast.y, target.x - this.beast.x);
        const step = (44 * delta) / 1000;
        this.beast.x = Math.round(this.beast.x + Math.cos(a) * step);
        this.beast.y = Math.round(this.beast.y + Math.sin(a) * step);
        this.beast.spr.setPosition(this.beast.x, this.beast.y).setDepth(this.beast.y);
        this.beast.ring.setPosition(this.beast.x, this.beast.y - 8).setDepth(this.beast.y - 1);

        // If beast reaches the pen gate or a following sheep, startle following sheep back to lost position
        if (this.beast.x <= 355 || Phaser.Math.Distance.Between(this.beast.x, this.beast.y, target.x, target.y) < 14) {
          this.beast.active = false;
          this.beast.spr.setVisible(false);
          this.beast.ring.setVisible(false);
          this.beastCooldown = 2500;
          audio.sfx("wrong");
          this.cameras.main.shake(120, 0.004);
          this.sheep.forEach((s, i) => {
            if (s.state === "follow") {
              s.state = "lost";
              s.x = LOST[i][0];
              s.y = LOST[i][1];
              s.glow.setVisible(true);
              s.spr.setPosition(s.x, s.y).setDepth(s.y);
            }
          });
          this.talk(STAGE1.speaker, STAGE1.beastScaredSheep.map(tr));
        }
      }
    }

    // Update HUD banner pinned to camera safe area
    if (this.label) {
      const v = this.cameras.main.worldView;
      const penned = this.sheep.filter((s) => s.state === "pen").length;
      const txt =
        this.phase === 0
          ? tr(STAGE1.phase[0]).replace("{s}", String(penned)).replace("{p}", String(this.beastsRepelled))
          : tr(STAGE1.phase[1]);
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }
  }
}

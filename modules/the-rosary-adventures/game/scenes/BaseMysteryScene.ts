import * as Phaser from "phaser";
import { Player } from "@/modules/shared/game/entities/Player";
import { CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";
import { MYSTERY_KEYS, MysteryProgress, SaveData } from "@/modules/the-rosary-adventures/types/game";
import { loadGame, updateSave } from "@/modules/the-rosary-adventures/utils/saveManager";
import { EPILOGUE_SCENE, nextMysteryKey, nextStageKey } from "@/modules/the-rosary-adventures/data/stages";
import EventBus from "@/modules/shared/game/EventBus";
import { t as tx } from "@/modules/shared/i18n";

/** Depth layers. World objects between RUG and WALL use their foot y (y-sorting). */
export const DEPTH = { FLOOR: 0, RUG: 1, LIGHT: 2, WALL: 2000, FX: 5000, UI: 9000 };

export class BaseMysteryScene extends Phaser.Scene {
  protected player!: Player;
  protected obstacles!: Phaser.Physics.Arcade.StaticGroup;
  protected worldWidth = 1200;
  protected worldHeight = 900;

  constructor(key = "BaseMysteryScene") {
    super({ key });
  }

  create() {
    // 1. Setup World & Physics boundaries
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // 2. Generate Atmospheric Courtyard & Ground
    this.createEnvironment();

    // 3. Initialize Player Entity
    this.createPlayerAt(this.worldWidth / 2, this.worldHeight / 2 + 60);

    // 4. Setup Camera
    this.setupCamera();

    // 5. Action Key Listener (Space / Enter / Mobile Button A)
    this.setupActionListeners();

    // Notify React UI
    EventBus.emit("scene-ready", { sceneKey: this.scene.key });
  }

  protected createPlayerAt(defaultX?: number, defaultY?: number) {
    const save = loadGame();
    const custom: CharacterCustomization =
      save?.player?.customization || DEFAULT_CHARACTER;
    const startX = defaultX ?? (save?.player?.x || this.worldWidth / 2);
    const startY = defaultY ?? (save?.player?.y || this.worldHeight / 2 + 60);

    this.player = new Player(this, startX, startY, custom);

    // Setup Collision with Obstacles if present
    if (this.obstacles) {
      this.physics.add.collider(this.player, this.obstacles);
    }
  }

  protected createEnvironment() {
    const g = this.add.graphics();

    // Warm Nazareth stone / earth ground
    const tileSize = 32;
    for (let x = 0; x < this.worldWidth; x += tileSize) {
      for (let y = 0; y < this.worldHeight; y += tileSize) {
        const isAlt = ((x + y) / tileSize) % 2 === 0;
        g.fillStyle(isAlt ? 0x222a38 : 0x1a212e, 1);
        g.fillRect(x, y, tileSize, tileSize);

        // Subtle grid line
        g.lineStyle(1, 0x151c27, 0.4);
        g.strokeRect(x, y, tileSize, tileSize);
      }
    }

    // Outer boundary walls / decorative border
    g.lineStyle(8, 0x475569, 1);
    g.strokeRect(4, 4, this.worldWidth - 8, this.worldHeight - 8);

    // Obstacles group for physics collision testing
    this.obstacles = this.physics.add.staticGroup();

    // Center Sacred Shrine / Olive Garden Fountain
    const centerX = this.worldWidth / 2;
    const centerY = this.worldHeight / 2 - 40;

    // Shrine base
    const shrineBase = this.add.rectangle(centerX, centerY, 80, 60, 0x334155);
    shrineBase.setStrokeStyle(3, 0xd97706);
    this.obstacles.add(shrineBase);

    // Shrine glowing Cross & Candle light
    this.add
      .text(centerX, centerY - 8, "✝", {
        fontFamily: "serif",
        fontSize: "64px",
        color: "#fbbf24",
      })
      .setOrigin(0.5, 0.5);

    // Gentle altar light glow
    const glow = this.add.circle(centerX, centerY, 55, 0xfbbf24, 0.12);
    this.tweens.add({
      targets: glow,
      alpha: 0.22,
      scale: 1.15,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Decorative Olive Tree pillars (4 corners around the courtyard)
    const pillarPositions = [
      { x: centerX - 180, y: centerY - 100 },
      { x: centerX + 180, y: centerY - 100 },
      { x: centerX - 180, y: centerY + 140 },
      { x: centerX + 180, y: centerY + 140 },
    ];

    for (const pos of pillarPositions) {
      const pillar = this.add.rectangle(pos.x, pos.y, 36, 48, 0x1e293b);
      pillar.setStrokeStyle(2, 0x64748b);
      this.obstacles.add(pillar);

      // Green foliage on top
      this.add.circle(pos.x, pos.y - 18, 22, 0x15803d, 0.9);
      this.add.circle(pos.x, pos.y - 18, 16, 0x22c55e, 0.6);
    }

    // Welcome banner / Scripture hint
    this.add
      .text(
        centerX,
        centerY + 180,
        tx("🌿 VƯỜN CẦU NGUYỆN NAZARETH 🌿\n(Dùng phím mũi tên / D-pad cảm ứng để di chuyển)", "🌿 NAZARETH PRAYER GARDEN 🌿\n(Use the arrow keys / touch D-pad to move)"),
        {
          fontFamily: "'Dearpix', monospace",
          fontSize: "52px",
          color: "#fbbf24",
          align: "center",
          backgroundColor: "#090d16ee",
          padding: { x: 16, y: 10 },
        }
      )
      .setOrigin(0.5, 0.5);
  }

  /** Invisible static collider (center-origin). Requires this.obstacles. */
  protected block(x: number, y: number, w: number, h: number) {
    this.obstacles.add(this.add.rectangle(x, y, w, h));
  }

  /** Foot-anchored prop with a feet-sized collider; depth = foot y for y-sorting. */
  protected prop(x: number, y: number, key: string, colW: number, colH: number) {
    const img = this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
    this.block(x, y - colH / 2, colW, colH);
    return img;
  }

  protected setupCamera() {
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Integer zoom only — fractional zoom makes pixels uneven (2 on phones, 3+ on big screens)
    const applyZoom = () => {
      const { width, height } = this.scale.gameSize;
      this.cameras.main.setZoom(Math.max(2, Math.round(Math.min(width, height) / 280)));
    };
    applyZoom();
    this.scale.on("resize", applyZoom);
    this.events.once("shutdown", () => this.scale.off("resize", applyZoom));
  }

  protected setupActionListeners() {
    // Keyboard Space / Enter
    if (this.input.keyboard) {
      const spaceKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
      const enterKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );

      spaceKey.on("down", () => this.triggerAction());
      enterKey.on("down", () => this.triggerAction());
    }

    // Mobile Virtual Controller Action Button "A"
    const handleVirtualAction = (data: { action: "A" | "B" | "MENU" }) => {
      if (data.action === "A") {
        this.triggerAction();
      }
    };

    // Track dialogue state: the same Space/A press that advances/closes a dialogue
    // must not also fire a world interaction (it would replace the next dialogue).
    this.dialogueOpen = false;
    const onOpen = () => (this.dialogueOpen = true);
    const onClose = () => {
      this.dialogueOpen = false;
      this.dialogueClosedAt = performance.now();
    };

    EventBus.on("input-action", handleVirtualAction);
    EventBus.on("dialogue-open", onOpen);
    EventBus.on("dialogue-close", onClose);
    const cleanup = () => {
      EventBus.off("input-action", handleVirtualAction);
      EventBus.off("dialogue-open", onOpen);
      EventBus.off("dialogue-close", onClose);
    };
    this.events.once("destroy", cleanup);
    this.events.once("shutdown", cleanup);
  }

  /** Mystery key of the running stage; set by beginStage(). */
  protected mysteryKey = "";

  /** Write through updateSave() and tell the UI. Never throws; save failure is reported via game-saved. */
  protected autosave(mutate: (save: SaveData) => void) {
    const ok = updateSave(mutate) !== null;
    EventBus.emit("game-saved", { success: ok, timestamp: Date.now() });
  }

  /** Call first thing in create(): remembers this stage as "where to resume". */
  protected beginStage(key: string) {
    this.mysteryKey = key;
    if (!key) return; // Prologue / Epilogue: not a stage to resume
    const idx = (MYSTERY_KEYS as readonly string[]).indexOf(key);
    this.autosave((s) => {
      if (idx >= 0 && idx >= s.currentMysteryIndex) {
        s.currentMysteryKey = key;
        s.currentMysteryIndex = idx;
      } else if (idx < 0) {
        // Interlude stage: remember its key so Continue lands right on it
        s.currentMysteryKey = key;
      }
    });
  }

  /** Mark the running stage complete, advance the resume pointer, light the bead. */
  protected saveStageComplete(questsCompleted: string[]) {
    const key = this.mysteryKey;
    const idx = (MYSTERY_KEYS as readonly string[]).indexOf(key);
    let firstTime = false;
    this.autosave((s) => {
      const p: MysteryProgress = s.mysteriesProgress[key] ?? { completed: false, beadLit: false, questsCompleted: [] };
      firstTime = !p.completed;
      s.mysteriesProgress[key] = { completed: true, beadLit: true, questsCompleted };
      const next = nextMysteryKey(key);
      if (next && s.currentMysteryIndex <= idx) {
        s.currentMysteryKey = next;
        s.currentMysteryIndex = idx + 1;
      }
    });
    EventBus.emit("mystery-completed", { mysteryKey: key, mysteryIndex: idx });
    if (firstTime) EventBus.emit("bead-lit", { mysteryIndex: idx });
  }

  /** Fade out and show the next stage's intro card. */
  protected goToNextStage() {
    const next = nextStageKey(this.mysteryKey);
    const cam = this.cameras.main;
    cam.fadeOut(600, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () =>
      next ? this.scene.start("StageTransitionScene", { toKey: next }) : this.scene.start(EPILOGUE_SCENE)
    );
  }

  private dialogueOpen = false;
  private dialogueClosedAt = 0;

  private triggerAction() {
    if (this.dialogueOpen || performance.now() - this.dialogueClosedAt < 300) return;
    this.handleActionTrigger();
  }

  protected handleActionTrigger() {
    // Check distance between player and Altar Center
    const centerX = this.worldWidth / 2;
    const centerY = this.worldHeight / 2 - 40;
    const dist = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      centerX,
      centerY
    );

    if (dist < 90) {
      // Near Altar: Trigger prayer reflection
      EventBus.emit("dialogue-open", {
        speaker: tx("Bàn Thờ Cầu Nguyện", "Prayer Altar"),
        lines: [
          tx("Bình an cho bạn, Lữ Khách nhỏ!", "Peace be with you, little Pilgrim!"),
          tx("Nơi đây lưu giữ ánh sáng của 20 Mầu Nhiệm Mân Côi.", "This place keeps the light of the 20 Mysteries of the Rosary."),
          tx("Hãy vững lòng tin và chuẩn bị bước vào Mầu Nhiệm Thứ Nhất: Thiên Thần Truyền Tin.", "Take heart and get ready to enter the First Mystery: the Annunciation."),
        ],
      });
    }
  }

  update() {
    if (this.player) {
      this.player.update();
      this.player.setDepth(this.player.y + 16); // y-sort by feet (hitbox bottom = y+16); props use their foot y
    }
  }
}

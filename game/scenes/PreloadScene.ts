import * as Phaser from "phaser";
import { EventBus } from "../EventBus";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    const { width, height } = this.scale;

    // Loading Bar Background
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x1a202c, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const progressBar = this.add.graphics();

    // Loading Text
    const loadingText = this.add.text(width / 2, height / 2 - 50, "Đang tải dữ liệu...", {
      fontFamily: "'Dearpix', monospace",
      fontSize: "52px",
      color: "#ffffff",
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(width / 2, height / 2, "0%", {
      fontFamily: "'Dearpix', monospace",
      fontSize: "48px",
      color: "#ffd700",
    });
    percentText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value: number) => {
      percentText.setText(`${Math.floor(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xd4af37, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // TODO: Assets cho maps, sprites, audio sẽ được nạp tại đây
  }

  create() {
    EventBus.emit("scene-ready", { sceneKey: "PreloadScene" });

    this.scene.start("TitleScene");
  }
}

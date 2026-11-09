import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Tải assets cần thiết cho màn hình loading (nếu có)
  }

  create() {
    this.scene.start("PreloadScene");
  }
}

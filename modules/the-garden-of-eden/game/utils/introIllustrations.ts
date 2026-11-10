import * as Phaser from "phaser";

/** Storybook pictures shown before each stage: static images in public/games/the-garden-of-eden/intro (1312x816, 16:10). */
export const INTRO_W = 1312;
export const INTRO_H = 816;

const FILE: Record<string, string> = {
  prologue: "start",
  light: "1", sky: "2", land: "3", stars: "4", seabirds: "5", adam: "6",
  sabbath: "7", rivers: "8", eve: "9", serpent: "10", hiding: "11", exodus: "12",
  epilogue: "end",
};

/** Loads the picture for `id` (cached after the first time) and calls `ready(key)` once the texture exists. */
export function loadIntroImage(scene: Phaser.Scene, id: string, ready: (key: string) => void) {
  const key = `intro_${FILE[id] ?? "start"}`;
  const done = () => {
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR); // big picture is scaled down: keep it smooth
    ready(key);
  };
  if (scene.textures.exists(key)) return done();
  scene.load.image(key, `/games/the-garden-of-eden/intro/intro-${FILE[id] ?? "start"}.jpg`);
  scene.load.once(Phaser.Loader.Events.COMPLETE, done);
  scene.load.start();
}

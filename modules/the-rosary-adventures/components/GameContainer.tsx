"use client";

import React, { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { createGameConfig } from "@/modules/the-rosary-adventures/game/config";
import EventBus from "@/modules/shared/game/EventBus";
import audio from "@/modules/shared/game/audio/AudioManager";
import { EPILOGUE_SCENE, PROLOGUE_SCENE } from "@/modules/the-rosary-adventures/data/stages";

export interface GameContainerProps {
  onSceneReady?: (sceneKey: string) => void;
}

export default function GameContainer({ onSceneReady }: GameContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const onSceneReadyRef = useRef(onSceneReady);

  useEffect(() => {
    onSceneReadyRef.current = onSceneReady;
  }, [onSceneReady]);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    audio.init();
    const config = createGameConfig(containerRef.current);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    const handleSceneReady = (data: { sceneKey: string }) => {
      onSceneReadyRef.current?.(data.sceneKey);
    };

    // HUD asks to replay a stage: hop through its intro card from whichever scene is running
    const handleSceneChange = ({ targetSceneKey, mysteryKey }: { targetSceneKey: string; mysteryKey?: string }) => {
      const running = game.scene.getScenes(true)[0];
      if (!running) return;
      if (targetSceneKey === PROLOGUE_SCENE || targetSceneKey === EPILOGUE_SCENE) running.scene.start(targetSceneKey);
      else if (mysteryKey) running.scene.start("StageTransitionScene", { toKey: mysteryKey });
    };
    const handleRestart = () => game.scene.getScenes(true)[0]?.scene.start("TitleScene");

    EventBus.on("scene-ready", handleSceneReady);
    EventBus.on("scene-change-request", handleSceneChange);
    EventBus.on("game-restart", handleRestart);

    return () => {
      EventBus.off("scene-ready", handleSceneReady);
      EventBus.off("scene-change-request", handleSceneChange);
      EventBus.off("game-restart", handleRestart);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []); // Chỉ khởi tạo Phaser một lần duy nhất khi mount!

  return (
    <div
      id="phaser-game-container"
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950"
    />
  );
}

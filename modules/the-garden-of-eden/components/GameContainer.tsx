"use client";

import React, { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { createGameConfig } from "@/modules/the-garden-of-eden/game/config";
import EventBus from "@/modules/shared/game/EventBus";
import audio from "@/modules/shared/game/audio/AudioManager";

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
    gameRef.current = new Phaser.Game(createGameConfig(containerRef.current));

    const handleSceneReady = (d: { sceneKey: string }) => onSceneReadyRef.current?.(d.sceneKey);
    EventBus.on("scene-ready", handleSceneReady);

    return () => {
      EventBus.off("scene-ready", handleSceneReady);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="phaser-game-container" ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950" />;
}

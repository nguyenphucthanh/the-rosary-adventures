"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { loadGame, saveGame } from "@/utils/saveManager";
import { createInitialSaveData, SaveData, CharacterCustomization } from "@/types/game";
import VirtualController from "@/components/game/VirtualController";
import DesktopControlHint from "@/components/game/DesktopControlHint";
import CharacterCreationModal from "@/components/game/CharacterCreationModal";
import CharacterPreview from "@/components/game/CharacterPreview";
import DialogueBox from "@/components/game/DialogueBox";
import RosaryHUD from "@/components/game/RosaryHUD";
import EndingCongrats from "@/components/game/EndingCongrats";
import EventBus from "@/game/EventBus";
import audio from "@/game/audio/AudioManager";

const GameContainer = dynamic(() => import("@/components/game/GameContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-slate-950 text-amber-400 font-mono text-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span>Đang nạp động cơ Phaser 3...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  const [currentScene, setCurrentScene] = useState<string>("Đang khởi tạo...");
  const [saveInfo, setSaveInfo] = useState<SaveData | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);
  const [hasExistingSave, setHasExistingSave] = useState<boolean>(false);
  const muted = useSyncExternalStore(audio.subscribe, () => audio.muted, () => false);

  useEffect(() => {
    // Tự động nhận diện thiết bị cảm ứng (con trỏ "thô" = ngón tay) và theo dõi khi đổi thiết bị
    const coarse = window.matchMedia("(pointer: coarse)");
    const syncTouch = () => setIsTouchDevice(coarse.matches);
    syncTouch();
    coarse.addEventListener("change", syncTouch);

    // Kiểm tra save đã lưu
    const existing = loadGame();
    if (existing) {
      setSaveInfo(existing);
      setHasExistingSave(true);
    } else {
      // Nếu là người chơi mới: tự động bật màn hình tạo nhân vật
      const initial = createInitialSaveData();
      setSaveInfo(initial);
      setHasExistingSave(false);
      setShowCharacterModal(true);
    }

    // Lắng nghe thay đổi trạng thái fullscreen
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Lắng nghe sự kiện hoàn thành mầu nhiệm để cập nhật dữ liệu save
    const handleMysteryCompleted = () => {
      const current = loadGame();
      if (current) setSaveInfo(current);
    };
    EventBus.on("mystery-completed", handleMysteryCompleted);
    EventBus.on("game-restart", handleMysteryCompleted); // same refresh: re-read the (reset) save

    return () => {
      coarse.removeEventListener("change", syncTouch);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      EventBus.off("mystery-completed", handleMysteryCompleted);
      EventBus.off("game-restart", handleMysteryCompleted);
    };
  }, []);

  const handleSaveCharacter = (customization: CharacterCustomization) => {
    const baseSave = loadGame() ?? saveInfo ?? createInitialSaveData(); // re-read: stages auto-save behind this modal
    const updatedSave: SaveData = {
      ...baseSave,
      player: {
        ...baseSave.player,
        customization,
      },
    };
    saveGame(updatedSave);
    setSaveInfo(updatedSave);
    setHasExistingSave(true);
    setShowCharacterModal(false);
    EventBus.emit("character-updated", { customization });
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen request error:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const handleSceneReady = useCallback((sceneKey: string) => {
    setCurrentScene(sceneKey);
  }, []);

  const onTitle = currentScene === "TitleScene" || currentScene === "StageTransitionScene";

  return (
    <main className="fixed inset-0 w-screen h-dvh overflow-hidden bg-slate-950 select-none">
      {/* 1. Fullscreen Phaser Game Canvas */}
      <GameContainer onSceneReady={handleSceneReady} />

      {/* 2. Top Floating HUD (Header Bar) */}
      <header hidden={onTitle} className="pointer-events-none fixed top-0 inset-x-0 z-30 flex items-center justify-between p-2 sm:p-4">
        {/* Pilgrim Profile Button */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Character Quick Profile Badge (Click to open Customizer) */}
          {saveInfo && (
            <button
              type="button"
              onClick={() => setShowCharacterModal(true)}
              title="Nhấn để đổi diện mạo hoặc tạo nhân vật mới"
              className="retro-btn-gold px-3 py-1.5 flex items-center gap-2 active:translate-y-0.5"
            >
              <span className="text-base leading-none">
                {saveInfo.player.customization.gender === "girl" ? "👧" : "👦"}
              </span>
              <span className="font-pixel text-[13px] sm:text-[14px] text-amber-100">
                {saveInfo.player.customization.name}
              </span>
              <span className="text-xs text-amber-200">✏️</span>
            </button>
          )}
        </div>

        {/* Action Controls (Fullscreen) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              audio.setMuted(!muted);
            }}
            title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="retro-btn px-3 py-1.5 text-[12px] sm:text-[13px] text-amber-300"
          >
            {muted ? "🔇" : "🔊"}
          </button>
          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            className="retro-btn px-3 py-1.5 text-[12px] sm:text-[13px] text-amber-300"
          >
            {isFullscreen ? "THOÁT" : "TOÀN MÀN HÌNH"}
          </button>
        </div>
      </header>

      {/* Rosary Beads HUD Ribbon & Modal */}
      {!onTitle && <RosaryHUD saveData={saveInfo} />}

      {/* 3. Bottom Controls Area */}
      {onTitle ? null : isTouchDevice ? (
        // Mobile / Touch: Virtual On-Screen Controller (D-Pad + A/B Buttons)
        <VirtualController />
      ) : (
        // Desktop / Keyboard: Bottom Instruction Hint
        <footer className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <DesktopControlHint />
        </footer>
      )}

      {/* 4. Dialogue Box */}
      <DialogueBox />
      <EndingCongrats />

      {/* 5. Character Customization Modal */}
      {saveInfo && (
        <CharacterCreationModal
          isOpen={showCharacterModal && !onTitle}
          initialData={saveInfo.player.customization}
          canClose={hasExistingSave}
          onClose={() => setShowCharacterModal(false)}
          onSave={handleSaveCharacter}
        />
      )}
    </main>
  );
}

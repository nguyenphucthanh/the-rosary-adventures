"use client";

import React, { useState } from "react";
import { CharacterCustomization, DEFAULT_CHARACTER } from "@/types/game";
import CharacterPreview from "./CharacterPreview";

export interface CharacterCreationModalProps {
  isOpen: boolean;
  initialData?: CharacterCustomization;
  onSave: (customization: CharacterCustomization) => void;
  onClose?: () => void;
  canClose?: boolean;
}

const NAME_SUGGESTIONS = [
  "Gioan",
  "Maria",
  "Têrêsa",
  "Phanxicô",
  "Đaminh",
  "Cecilia",
  "Giuse",
  "Anna",
  "Micae",
  "Agata",
];

const SKIN_TONES = [
  { label: "Sáng", value: "#ffd1a4" },
  { label: "Tự nhiên", value: "#f5b971" },
  { label: "Bánh mật", value: "#d08b5b" },
  { label: "Răm nắng", value: "#8c5332" },
];

const HAIR_STYLES = [
  { label: "Ngắn", value: "short" },
  { label: "Buộc cao", value: "ponytail" },
  { label: "Bồng bềnh", value: "wavy" },
  { label: "Tóc xoăn", value: "curly" },
];

const HAIR_COLORS = [
  { label: "Đen", value: "#201a15" },
  { label: "Nâu đậm", value: "#452b1f" },
  { label: "Hạt dẻ", value: "#854d0e" },
  { label: "Vàng óng", value: "#eab308" },
];

const OUTFIT_COLORS = [
  { label: "Xanh Maria", value: "#2563eb" },
  { label: "Đỏ Thánh Thần", value: "#dc2626" },
  { label: "Xanh Hy Vọng", value: "#16a34a" },
  { label: "Nâu Giuse", value: "#78350f" },
  { label: "Tím Mến Yêu", value: "#7c3aed" },
  { label: "Hoàng Kim", value: "#d97706" },
];

const ACCESSORIES = [
  { label: "Chuỗi Mân Côi", value: "rosary_beads" },
  { label: "Thánh Giá", value: "cross_pendant" },
  { label: "Áo Choàng", value: "cloak" },
  { label: "Không có", value: "none" },
];

export default function CharacterCreationModal({
  isOpen,
  initialData = DEFAULT_CHARACTER,
  onSave,
  onClose,
  canClose = false,
}: CharacterCreationModalProps) {
  const [character, setCharacter] = useState<CharacterCustomization>(initialData);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleRandomize = () => {
    const randomName =
      NAME_SUGGESTIONS[Math.floor(Math.random() * NAME_SUGGESTIONS.length)];
    const randomGender = Math.random() > 0.5 ? "boy" : "girl";
    const randomSkin =
      SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].value;
    const randomHairStyle =
      HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].value;
    const randomHairColor =
      HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value;
    const randomOutfit =
      OUTFIT_COLORS[Math.floor(Math.random() * OUTFIT_COLORS.length)].value;
    const randomAccessory =
      ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].value;

    setCharacter({
      name: randomName,
      gender: randomGender,
      skinTone: randomSkin,
      hairStyle: randomHairStyle,
      hairColor: randomHairColor,
      outfitColor: randomOutfit,
      accessory: randomAccessory,
      spriteKey: `player_${randomGender}_custom`,
    });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = character.name.trim();
    if (!trimmedName) {
      setError("Vui lòng đặt tên cho Lữ Khách!");
      return;
    }
    setError("");
    onSave({
      ...character,
      name: trimmedName,
      spriteKey: `player_${character.gender}_custom`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[94vh] flex flex-col retro-frame-gold overflow-hidden">
        {/* Retro Header Plaque */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b-4 border-black bg-slate-950">
          <div className="flex items-center gap-2.5">
            <span className="text-amber-400 font-pixel text-[32px]">✝</span>
            <div>
              <h2 className="pixel-title text-[28px] sm:text-[32px] tracking-wide">
                KHỞI TẠO LỮ KHÁCH NHỎ
              </h2>
              <p className="font-retro text-[48px] text-amber-200/90 -mt-1">
                Tùy biến ngoại hình trước khi bước vào 20 Mầu Nhiệm
              </p>
            </div>
          </div>

          {canClose && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="retro-btn w-8 h-8 flex items-center justify-center text-[28px] text-rose-300 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 bg-slate-900/95">
          {/* Top section: Preview + Name Input */}
          <div className="flex flex-col sm:flex-row items-center gap-4 retro-frame p-3.5 bg-slate-950">
            {/* Live Pixel Preview */}
            <div className="flex flex-col items-center gap-2">
              <CharacterPreview customization={character} size={120} />
              <button
                type="button"
                onClick={handleRandomize}
                className="retro-btn-gold px-3 py-1 text-[24px] flex items-center gap-1.5 active:translate-y-0.5"
              >
                <span>🎲</span>
                <span>NGẪU NHIÊN</span>
              </button>
            </div>

            {/* Name & Gender */}
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block font-pixel text-[26px] text-amber-300 mb-1">
                  TÊN LỮ KHÁCH:
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={character.name}
                  onChange={(e) => {
                    setCharacter((prev) => ({ ...prev, name: e.target.value }));
                    if (error) setError("");
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  placeholder="Ví dụ: Gioan, Maria..."
                  className="w-full px-3 py-2 bg-slate-950 border-2 border-black outline outline-2 outline-amber-600 text-amber-200 font-retro text-3xl focus:outline-amber-400"
                />
                {error && <p className="font-pixel text-[24px] text-rose-400 mt-1">{error}</p>}
              </div>

              {/* Quick Names */}
              <div>
                <span className="font-pixel text-[22px] text-slate-400 block mb-1">
                  GỢI Ý TÊN THÁNH BẢO TRỢ:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {NAME_SUGGESTIONS.slice(0, 6).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setCharacter((prev) => ({ ...prev, name }))}
                      className="retro-btn px-2.5 py-1 text-[24px] text-slate-300 hover:text-amber-300"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender / Base Model */}
              <div>
                <span className="font-pixel text-[24px] text-amber-300 block mb-1">
                  HÌNH MẪU:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({
                        ...prev,
                        gender: "boy",
                        hairStyle: prev.hairStyle === "ponytail" ? "short" : prev.hairStyle,
                      }))
                    }
                    className={`py-2 px-2 text-[26px] flex items-center justify-center gap-2 font-pixel ${
                      character.gender === "boy"
                        ? "retro-btn-gold text-amber-100"
                        : "retro-btn text-slate-400"
                    }`}
                  >
                    <span>👦</span>
                    <span>BÉ TRAI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({
                        ...prev,
                        gender: "girl",
                        hairStyle: prev.hairStyle === "short" ? "ponytail" : prev.hairStyle,
                      }))
                    }
                    className={`py-2 px-2 text-[26px] flex items-center justify-center gap-2 font-pixel ${
                      character.gender === "girl"
                        ? "retro-btn-gold text-amber-100"
                        : "retro-btn text-slate-400"
                    }`}
                  >
                    <span>👧</span>
                    <span>BÉ GÁI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Details Grid */}
          <div className="space-y-3.5">
            {/* Skin Tone */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                MÀU DA:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SKIN_TONES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, skinTone: item.value }))
                    }
                    className={`p-2 retro-btn text-center flex flex-col items-center gap-1 ${
                      character.skinTone === item.value
                        ? "border-amber-400 bg-amber-950/60 ring-2 ring-amber-400"
                        : ""
                    }`}
                  >
                    <span
                      className="w-5 h-5 border border-black"
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="font-pixel text-[22px] text-slate-300">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Style */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                KIỂU TÓC:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HAIR_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, hairStyle: style.value }))
                    }
                    className={`py-2 px-1 font-pixel text-[24px] text-center ${
                      character.hairStyle === style.value
                        ? "retro-btn-gold"
                        : "retro-btn text-slate-400"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                MÀU TÓC:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {HAIR_COLORS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, hairColor: item.value }))
                    }
                    className={`p-2 retro-btn text-center flex flex-col items-center gap-1 ${
                      character.hairColor === item.value
                        ? "border-amber-400 bg-amber-950/60 ring-2 ring-amber-400"
                        : ""
                    }`}
                  >
                    <span
                      className="w-5 h-5 border border-black"
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="font-pixel text-[22px] text-slate-300">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Outfit Color */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                MÀU ÁO CHOÀNG LỮ KHÁCH:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {OUTFIT_COLORS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, outfitColor: item.value }))
                    }
                    className={`p-2 retro-btn text-center flex flex-col items-center gap-1 ${
                      character.outfitColor === item.value
                        ? "border-amber-400 bg-amber-950/60 ring-2 ring-amber-400"
                        : ""
                    }`}
                  >
                    <span
                      className="w-5 h-5 border border-black shadow-inner"
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="font-pixel text-[20px] text-slate-300 truncate w-full">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                PHỤ KIỆN ĐỒNG HÀNH:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ACCESSORIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, accessory: item.value }))
                    }
                    className={`py-2 px-1 font-pixel text-[22px] text-center ${
                      character.accessory === item.value
                        ? "retro-btn-gold"
                        : "retro-btn text-slate-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 retro-btn-green font-pixel text-[28px] sm:text-[32px] tracking-wider flex items-center justify-center gap-2.5"
            >
              <span>🕊️</span>
              <span>BẮT ĐẦU HÀNH TRÌNH ĐỨC TIN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

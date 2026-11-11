"use client";

import React, { useState } from "react";
import { CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";
import CharacterPreview from "@/modules/shared/components/CharacterPreview";
import { LANGS, getLang, pick, setLang, type L, type Lang } from "@/modules/shared/i18n";

const l = (vi: string, en: string): L => ({ vi, en });

const DEFAULT_NAMES: Record<Lang, string> = { vi: DEFAULT_CHARACTER.name, en: "Pilgrim" };

const TEXT = {
  title: l("KHỞI TẠO LỮ KHÁCH NHỎ", "CREATE YOUR LITTLE PILGRIM"),
  subtitle: l("Tùy biến ngoại hình trước khi bước vào cuộc phiêu lưu", "Customize your look before the adventure begins"),
  random: l("NGẪU NHIÊN", "RANDOM"),
  name: l("TÊN LỮ KHÁCH:", "PILGRIM'S NAME:"),
  namePlaceholder: l("Ví dụ: Gioan, Maria...", "e.g. John, Mary..."),
  nameError: l("Vui lòng đặt tên cho Lữ Khách!", "Please give your Pilgrim a name!"),
  suggest: l("GỢI Ý TÊN THÁNH BẢO TRỢ:", "PATRON SAINT NAME IDEAS:"),
  model: l("HÌNH MẪU:", "CHARACTER:"),
  boy: l("BÉ TRAI", "BOY"),
  girl: l("BÉ GÁI", "GIRL"),
  skin: l("MÀU DA:", "SKIN TONE:"),
  hairStyle: l("KIỂU TÓC:", "HAIR STYLE:"),
  hairColor: l("MÀU TÓC:", "HAIR COLOR:"),
  outfit: l("MÀU ÁO CHOÀNG LỮ KHÁCH:", "PILGRIM CLOAK COLOR:"),
  accessory: l("PHỤ KIỆN ĐỒNG HÀNH:", "COMPANION ITEM:"),
  language: l("NGÔN NGỮ / LANGUAGE:", "LANGUAGE / NGÔN NGỮ:"),
  languageNote: l("Đổi ngôn ngữ sẽ tải lại trò chơi khi lưu.", "Changing the language reloads the game when you save."),
  start: l("BẮT ĐẦU HÀNH TRÌNH ĐỨC TIN", "START THE JOURNEY"),
  save: l("LƯU THAY ĐỔI", "SAVE CHANGES"),
};

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
  { label: l("Sáng", "Fair"), value: "#ffd1a4" },
  { label: l("Tự nhiên", "Natural"), value: "#f5b971" },
  { label: l("Bánh mật", "Honey"), value: "#d08b5b" },
  { label: l("Răm nắng", "Sun-tan"), value: "#8c5332" },
];

const HAIR_STYLES = [
  { label: l("Ngắn", "Short"), value: "short" },
  { label: l("Buộc cao", "Ponytail"), value: "ponytail" },
  { label: l("Bồng bềnh", "Wavy"), value: "wavy" },
  { label: l("Tóc xoăn", "Curly"), value: "curly" },
];

const HAIR_COLORS = [
  { label: l("Đen", "Black"), value: "#201a15" },
  { label: l("Nâu đậm", "Dark brown"), value: "#452b1f" },
  { label: l("Hạt dẻ", "Chestnut"), value: "#854d0e" },
  { label: l("Vàng óng", "Golden"), value: "#eab308" },
];

const OUTFIT_COLORS = [
  { label: l("Xanh Maria", "Mary Blue"), value: "#2563eb" },
  { label: l("Đỏ Thánh Thần", "Spirit Red"), value: "#dc2626" },
  { label: l("Xanh Hy Vọng", "Hope Green"), value: "#16a34a" },
  { label: l("Nâu Giuse", "Joseph Brown"), value: "#78350f" },
  { label: l("Tím Mến Yêu", "Love Purple"), value: "#7c3aed" },
  { label: l("Hoàng Kim", "Royal Gold"), value: "#d97706" },
];

const ACCESSORIES = [
  { label: l("Chuỗi Mân Côi", "Rosary"), value: "rosary_beads" },
  { label: l("Thánh Giá", "Cross"), value: "cross_pendant" },
  { label: l("Áo Choàng", "Cloak"), value: "cloak" },
  { label: l("Không có", "None"), value: "none" },
];

export default function CharacterCreationModal({
  isOpen,
  initialData = DEFAULT_CHARACTER,
  onSave,
  onClose,
  canClose = false,
}: CharacterCreationModalProps) {
  const [character, setCharacter] = useState<CharacterCustomization>(() =>
    initialData.name === DEFAULT_NAMES.vi && getLang() === "en" ? { ...initialData, name: DEFAULT_NAMES.en } : initialData
  );
  const [error, setError] = useState<boolean>(false);
  // Language is only committed on save: Phaser scenes build their text once, so the page reloads.
  const [lang, setPendingLang] = useState<Lang>(() => getLang());
  const T = (x: L) => pick(x, lang);

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
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = character.name.trim();
    if (!trimmedName) {
      setError(true);
      return;
    }
    setError(false);
    onSave({
      ...character,
      name: trimmedName,
      spriteKey: `player_${character.gender}_custom`,
    });
    if (lang !== getLang()) setLang(lang, { reload: true }); // after onSave so the character is stored first
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
                {T(TEXT.title)}
              </h2>
              <p className="font-retro text-[24px] text-amber-200/90 -mt-1">
                {T(TEXT.subtitle)}
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
                <span>{T(TEXT.random)}</span>
              </button>
            </div>

            {/* Name & Gender */}
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block font-pixel text-[26px] text-amber-300 mb-1">
                  {T(TEXT.name)}
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={character.name}
                  onChange={(e) => {
                    setCharacter((prev) => ({ ...prev, name: e.target.value }));
                    if (error) setError(false);
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  placeholder={T(TEXT.namePlaceholder)}
                  className="w-full px-3 py-2 bg-slate-950 border-2 border-black outline outline-2 outline-amber-600 text-amber-200 font-retro text-3xl focus:outline-amber-400"
                />
                {error && <p className="font-pixel text-[24px] text-rose-400 mt-1">{T(TEXT.nameError)}</p>}
              </div>

              {/* Quick Names */}
              <div>
                <span className="font-pixel text-[22px] text-slate-400 block mb-1">
                  {T(TEXT.suggest)}
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
                  {T(TEXT.model)}
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
                    className={`py-2 px-2 text-[26px] flex items-center justify-center gap-2 font-pixel ${character.gender === "boy"
                        ? "retro-btn-gold text-amber-100"
                        : "retro-btn text-slate-400"
                      }`}
                  >
                    <span>👦</span>
                    <span>{T(TEXT.boy)}</span>
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
                    className={`py-2 px-2 text-[26px] flex items-center justify-center gap-2 font-pixel ${character.gender === "girl"
                        ? "retro-btn-gold text-amber-100"
                        : "retro-btn text-slate-400"
                      }`}
                  >
                    <span>👧</span>
                    <span>{T(TEXT.girl)}</span>
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
                {T(TEXT.skin)}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SKIN_TONES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, skinTone: item.value }))
                    }
                    className={`p-2 retro-btn text-center flex flex-col items-center gap-1 ${character.skinTone === item.value
                        ? "border-amber-400 bg-amber-950/60 ring-2 ring-amber-400"
                        : ""
                      }`}
                  >
                    <span
                      className="w-5 h-5 border border-black"
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="font-pixel text-[22px] text-slate-300">{T(item.label)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Style */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                {T(TEXT.hairStyle)}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HAIR_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, hairStyle: style.value }))
                    }
                    className={`py-2 px-1 font-pixel text-[24px] text-center ${character.hairStyle === style.value
                        ? "retro-btn-gold"
                        : "retro-btn text-slate-400"
                      }`}
                  >
                    {T(style.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                {T(TEXT.hairColor)}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {HAIR_COLORS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, hairColor: item.value }))
                    }
                    className={`p-2 retro-btn text-center flex flex-col items-center gap-1 ${character.hairColor === item.value
                        ? "border-amber-400 bg-amber-950/60 ring-2 ring-amber-400"
                        : ""
                      }`}
                  >
                    <span
                      className="w-5 h-5 border border-black"
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="font-pixel text-[22px] text-slate-300">{T(item.label)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Outfit Color */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                {T(TEXT.outfit)}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {OUTFIT_COLORS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, outfitColor: item.value }))
                    }
                    className={`p-2 retro-btn text-center flex flex-col items-center gap-1 ${character.outfitColor === item.value
                        ? "border-amber-400 bg-amber-950/60 ring-2 ring-amber-400"
                        : ""
                      }`}
                  >
                    <span
                      className="w-5 h-5 border border-black shadow-inner"
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="font-pixel text-[20px] text-slate-300 truncate w-full">
                      {T(item.label)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div>
              <label className="block font-pixel text-[24px] text-amber-300 mb-1">
                {T(TEXT.accessory)}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ACCESSORIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCharacter((prev) => ({ ...prev, accessory: item.value }))
                    }
                    className={`py-2 px-1 font-pixel text-[22px] text-center ${character.accessory === item.value
                        ? "retro-btn-gold"
                        : "retro-btn text-slate-400"
                      }`}
                  >
                    {T(item.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block font-pixel text-[24px] text-amber-300 mb-1">
              {T(TEXT.language)}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LANGS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={lang === item.value}
                  onClick={() => {
                    setPendingLang(item.value);
                    // keep the untouched default name in the chosen language
                    setCharacter((prev) =>
                      prev.name === DEFAULT_NAMES.vi || prev.name === DEFAULT_NAMES.en
                        ? { ...prev, name: DEFAULT_NAMES[item.value] }
                        : prev
                    );
                  }}
                  className={`py-2 px-1 font-pixel text-[24px] flex items-center justify-center gap-2 ${lang === item.value ? "retro-btn-gold" : "retro-btn text-slate-400"}`}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            {lang !== getLang() && (
              <p className="font-retro text-[22px] text-slate-400 mt-1">{T(TEXT.languageNote)}</p>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 retro-btn-green font-pixel text-[28px] sm:text-[32px] tracking-wider flex items-center justify-center gap-2.5"
            >
              <span>🕊️</span>
              <span>{canClose ? T(TEXT.save) : T(TEXT.start)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

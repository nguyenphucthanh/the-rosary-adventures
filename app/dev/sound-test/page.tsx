"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import audio, { type SfxName } from "@/modules/shared/game/audio/AudioManager";
import { TRACKS, type Ambient, type Surface } from "@/modules/shared/game/audio/tracks";

interface TrackMeta {
  id: keyof typeof TRACKS;
  title: string;
  game: string;
  bpm: number;
  keySignature: string;
  mood: string;
  leadWave: string;
  bassWave: string;
  tags: string[];
}

const BGM_TRACKS: TrackMeta[] = [
  // Rosary Adventures
  {
    id: "lullaby",
    title: "Bedtime Lullaby",
    game: "Chung (All Games)",
    bpm: 70,
    keySignature: "C major",
    mood: "Dịu dàng, ấm áp, yên bình như chiếc hộp nhạc ru em bé ngủ bên khung cửa sổ.",
    leadWave: "Triangle",
    bassWave: "Sine",
    tags: ["Mở đầu / Kết thúc", "Title & Bedroom"],
  },
  {
    id: "joyful",
    title: "Joyful Mysteries",
    game: "The Rosary Adventures & Eden",
    bpm: 104,
    keySignature: "C major",
    mood: "Tươi vui, rộn ràng, bước chân hân hoan đón tin mừng và sinh sôi nảy nở.",
    leadWave: "Square",
    bassWave: "Triangle",
    tags: ["Năm Sự Vui", "Eden Ngày 3 & 6"],
  },
  {
    id: "luminous",
    title: "Luminous & Pastoral",
    game: "The Rosary Adventures & Noah",
    bpm: 100,
    keySignature: "D major",
    mood: "Thanh thoát, mênh mang đồng nội, làn gió mát lành mang ánh sáng hy vọng.",
    leadWave: "Pulse 25%",
    bassWave: "Triangle",
    tags: ["Năm Sự Sáng", "Gió Ararat & Bồ Câu"],
  },
  {
    id: "sorrowful",
    title: "Sorrowful & Contrition",
    game: "The Rosary Adventures & Noah & Eden",
    bpm: 56,
    keySignature: "A minor",
    mood: "Chậm rãi, lắng đọng, thiết tha cầu nguyện trong đêm tối và ăn năn hối lỗi.",
    leadWave: "Triangle",
    bassWave: "Sine",
    tags: ["Năm Sự Thương", "Noah Đèn Công Chính", "Eden Lẩn Trốn"],
  },
  {
    id: "glorious",
    title: "Glorious Triumphant",
    game: "The Rosary Adventures & Noah",
    bpm: 116,
    keySignature: "C major",
    mood: "Huy hoàng, khải hoàn, hợp xướng arpeggio nhanh mừng Chúa phục sinh và giao ước mới.",
    leadWave: "Pulse 25%",
    bassWave: "Square",
    tags: ["Năm Sự Mừng", "Bàn Thờ Cầu Vồng"],
  },

  // Noah's Ark
  {
    id: "crafting",
    title: "Ark Carpentry & Blueprint",
    game: "Noah's Ark",
    bpm: 108,
    keySignature: "G major",
    mood: "Cần mẫn, nhịp nhàng tiếng đục gỗ bách, xẻ ván và quét nhựa thông đóng tàu.",
    leadWave: "Pulse 25%",
    bassWave: "Triangle",
    tags: ["Noah Màn 2", "Đẩy gỗ & Chế tác"],
  },
  {
    id: "animals",
    title: "Animal March (Two by Two)",
    game: "Noah's Ark & Eden",
    bpm: 112,
    keySignature: "F major",
    mood: "Ngộ nghĩnh, nhún nhảy từng đôi muôn thú ríu rít bước lên cầu tàu Nô-ê.",
    leadWave: "Square",
    bassWave: "Triangle",
    tags: ["Noah Màn 3", "Eden Ngày 5 Cá & Chim"],
  },
  {
    id: "storm",
    title: "Deluge & 40 Nights of Rain",
    game: "Noah's Ark",
    bpm: 124,
    keySignature: "D minor",
    mood: "Dồn dập, căng thẳng, tiếng mưa bão cuồn cuộn và bịt kín các khe rò rỉ.",
    leadWave: "Pulse 25%",
    bassWave: "Square",
    tags: ["Noah Màn 4", "Bão tố & Chạy đua"],
  },
  {
    id: "voyage",
    title: "Endless Ocean Voyage",
    game: "Noah's Ark",
    bpm: 84,
    keySignature: "G major",
    mood: "Nhấp nhô êm ả, con tàu dập dềnh giữa đại dương bao la dưới vòm trời đầy sao.",
    leadWave: "Triangle",
    bassWave: "Sine",
    tags: ["Noah Màn 5", "Lênh đênh biển nước"],
  },

  // The Garden of Eden
  {
    id: "creation",
    title: "Fiat Lux & Starry Skies",
    game: "The Garden of Eden",
    bpm: 92,
    keySignature: "E minor / G major",
    mood: "Huyền nhiệm, lấp lánh như tinh tú ban sơ, ánh sáng đầu tiên bừng lên từ hư vô.",
    leadWave: "Pulse 25%",
    bassWave: "Sine",
    tags: ["Eden Ngày 1 & 4", "Ánh Sáng & Tinh Tú"],
  },
  {
    id: "eden",
    title: "Four Rivers of Eden",
    game: "The Garden of Eden",
    bpm: 96,
    keySignature: "F major",
    mood: "Êm ái, xanh mát dòng nước trong lành chảy quanh vườn và tình hiệp thông ngọt ngào.",
    leadWave: "Triangle",
    bassWave: "Triangle",
    tags: ["Eden Màn 8 & 9", "Bốn Dòng Sông & E-va"],
  },
  {
    id: "serpent",
    title: "Serpent's Deception",
    game: "The Garden of Eden",
    bpm: 88,
    keySignature: "C minor",
    mood: "Rình rập, nửa cung bí hiểm, tiếng thì thầm xảo quyệt bên Cây Biết Điều Thiện Ác.",
    leadWave: "Square",
    bassWave: "Triangle",
    tags: ["Eden Màn 10", "Con Rắn & Trái Cấm"],
  },
  {
    id: "sabbath",
    title: "The Holy Sabbath",
    game: "The Garden of Eden",
    bpm: 64,
    keySignature: "G major",
    mood: "Tĩnh lặng thánh thiêng, tiếng sáo tinh khôi tạ ơn Thiên Chúa trong ngày nghỉ ngơi.",
    leadWave: "Sine",
    bassWave: "Sine",
    tags: ["Eden Ngày 7", "Nghỉ ngơi thánh"],
  },
  {
    id: "promise",
    title: "Promise of Salvation",
    game: "The Garden of Eden",
    bpm: 80,
    keySignature: "D minor",
    mood: "Bùi ngùi rời vườn bước vào hoàng hôn, nhưng bừng sáng lời hứa Đấng Cứu Độ.",
    leadWave: "Triangle",
    bassWave: "Triangle",
    tags: ["Eden Màn 12", "Ngọn đuốc hy vọng"],
  },

  // Moses – The Exodus
  {
    id: "nile",
    title: "Papyrus Basket on the Nile",
    game: "Moses – The Exodus",
    bpm: 80,
    keySignature: "D minor / F major",
    mood: "Dòng sông Nin hiền hòa, chiếc thúng cói chở bé Mô-sê trôi về phía công chúa trong tình thương quan phòng.",
    leadWave: "Triangle",
    bassWave: "Sine",
    tags: ["Moses Màn 1", "Thúng cói sông Nin"],
  },
  {
    id: "exodus",
    title: "The Great Exodus & Red Sea",
    game: "Moses – The Exodus",
    bpm: 126,
    keySignature: "D minor",
    mood: "Hùng tráng, dồn dập bước chân vượt Biển Đỏ rẽ sóng đôi bờ và Cột Lửa đẩy lùi chiến xa Pha-ra-ô.",
    leadWave: "Pulse 25%",
    bassWave: "Square",
    tags: ["Moses Màn 7 & 10", "Biển Đỏ & Đập Đá"],
  },
  {
    id: "miriam",
    title: "Song of the Sea & Tambourine",
    game: "Moses – The Exodus",
    bpm: 116,
    keySignature: "D Dorian",
    mood: "Vui tươi, tưng bừng khúc ca tạ ơn và điệu múa trống cơm của Mi-ri-am bên bờ biển giải thoát.",
    leadWave: "Square",
    bassWave: "Triangle",
    tags: ["Moses Màn 8", "Khúc Ca & Nước Ma-ra"],
  },
  {
    id: "sinai",
    title: "Mount Sinai & The Ten Tablets",
    game: "Moses – The Exodus",
    bpm: 104,
    keySignature: "C major",
    mood: "Uy nghi, tiếng tù và vang rền trên đỉnh núi mây khói đón nhận Hai Bia Đá Mười Điều Răn.",
    leadWave: "Pulse 25%",
    bassWave: "Triangle",
    tags: ["Moses Màn 11", "Mười Điều Răn"],
  },
  {
    id: "wilderness",
    title: "Manna from Heaven",
    game: "Moses – The Exodus",
    bpm: 90,
    keySignature: "F major",
    mood: "Trong trẻo, thanh bình sương mai đọng thành bánh trời nuôi dưỡng dân trong sa mạc mỗi ngày.",
    leadWave: "Pulse 25%",
    bassWave: "Sine",
    tags: ["Moses Màn 9", "Bánh Mân-na & Chim Cút"],
  },
  {
    id: "tabernacle",
    title: "Tabernacle of the Covenant",
    game: "Moses – The Exodus",
    bpm: 96,
    keySignature: "G major",
    mood: "Trang nghiêm rực rỡ khi Đám Mây Vinh Quang Shekinah ngự xuống Nhà Tạm ở giữa muôn dân.",
    leadWave: "Triangle",
    bassWave: "Triangle",
    tags: ["Moses Màn 13", "Nhà Tạm Giao Ước"],
  },
];

interface AmbientMeta {
  id: Ambient;
  name: string;
  mood: string;
  details: string;
}

const AMBIENTS: AmbientMeta[] = [
  { id: "wind", name: "Gió Thoảng / Gió Bão (Wind)", mood: "Làn gió rì rào qua đồi cỏ hoặc cuộn gào ngoài khơi.", details: "Endless filtered noise bed với bộ dao động chậm LFO 0.12Hz." },
  { id: "birds", name: "Tiếng Chim Hót (Birds)", mood: "Tiếng chim líu lo ngẫu nhiên giữa ban mai và vườn cây xanh tươi.", details: "Random sine arpeggio 2.8kHz - 4.3kHz." },
  { id: "crickets", name: "Tiếng Dế Đêm (Crickets)", mood: "Tiếng dế gáy êm đềm khi màn đêm buông xuống đồi núi.", details: "Rhythmic high-frequency pulse bursts 4.3kHz." },
  { id: "crowd", name: "Đám Đông / Muôn Loài (Crowd)", mood: "Tiếng rì rầm náo nhiệt của phố chợ hoặc muôn thú tấp nập.", details: "Resonant bandpass noise bed 550Hz." },
  { id: "fire", name: "Lửa Thiêng / Ngọn Đuốc (Fire)", mood: "Tiếng lửa bập bùng, tí tách tàn than của ngọn đuốc hay bụi gai cháy.", details: "Rapid crackle noise impulses 2.2kHz - 3.7kHz." },
];

interface SfxMeta {
  id: SfxName;
  name: string;
  mood: string;
  category: "Praise & Win" | "Action & World" | "UI & Dialogue";
  argNote?: string;
}

const SFX_LIST: SfxMeta[] = [
  { id: "bless", name: "Phép Lành (Bless)", mood: "Hợp âm chuông tam giác vút cao báo ơn lành.", category: "Praise & Win" },
  { id: "complete", name: "Hoàn Thành Màn (Complete)", mood: "Khúc khải hoàn 8-bit ăn mừng hoàn thành chặng đường.", category: "Praise & Win" },
  { id: "angel", name: "Thiên Thần (Angel)", mood: "Làn sóng âm thanh thanh thoát rực rỡ như hào quang thiên thần.", category: "Praise & Win" },
  { id: "chime", name: "Chuông Reo (Chime)", mood: "Chuông ngân thánh thót khi giải đúng câu đố.", category: "Praise & Win" },
  { id: "shofar", name: "Tù Và Xi-nai (Shofar)", mood: "Kèn sừng cừu trầm hùng triệu tập dân Chúa lên núi thánh.", category: "Praise & Win" },
  { id: "bead", name: "Hạt Kinh (Bead)", mood: "Tiếng hạt pha lê sáng lên khi đọc kinh (cao độ tăng dần 1..5).", category: "Praise & Win", argNote: "Hỗ trợ 5 cao độ" },
  { id: "pickup", name: "Nhặt Vật Phẩm (Pickup)", mood: "Âm thanh vui tươi khi nhặt nhành ô-liu, khối gỗ hay mảnh đá.", category: "Action & World" },
  { id: "staff", name: "Gậy Mô-sê (Staff)", mood: "Gậy đập dứt khoát vang vọng tiếng chuông linh thiêng vượt qua mọi cản trở.", category: "Action & World" },
  { id: "tambourine", name: "Trống Cơm (Tambourine)", mood: "Tiếng gõ da trống nảy giòn hòa cùng vòng lắc kim loại của Mi-ri-am bên Biển Đỏ.", category: "Action & World" },
  { id: "splash", name: "Té Nước (Splash)", mood: "Tiếng sóng nước bì bõm bên sông Nin hay rẽ nước Biển Đỏ.", category: "Action & World" },
  { id: "whoosh", name: "Lướt Nhanh (Whoosh)", mood: "Tiếng gió lướt mạnh mẽ khi nhảy vọt hoặc chuyển cảnh.", category: "Action & World" },
  { id: "door", name: "Mở Cửa (Door)", mood: "Cánh cửa gỗ nặng trịch kẽo kẹt mở ra.", category: "Action & World" },
  { id: "wrong", name: "Sai / Va Chạm (Wrong)", mood: "Âm trầm cảnh báo khi đi sai bước hoặc bị bóng tối chạm trúng.", category: "Action & World" },
  { id: "step", name: "Bước Chân (Step)", mood: "Tiếng bước chân thay đổi linh hoạt theo từng mặt sàn.", category: "Action & World", argNote: "Phụ thuộc mặt sàn" },
  { id: "select", name: "Chọn Nút (Select)", mood: "Tiếng bíp nảy giòn khi nhấn phím A xác nhận.", category: "UI & Dialogue" },
  { id: "menu", name: "Mở Menu (Menu)", mood: "Tiếng chuông mở bảng điều khiển hay Hải Đồ.", category: "UI & Dialogue" },
  { id: "talk", name: "Mở Lời Thoại (Talk)", mood: "Giai điệu nhỏ mở hộp thoại nhân vật.", category: "UI & Dialogue" },
  { id: "blip", name: "Gõ Chữ (Blip)", mood: "Tiếng máy đánh chữ 8-bit thay đổi cao độ theo người nói.", category: "UI & Dialogue" },
];

const SURFACES: { id: Surface; name: string; desc: string; icon: string }[] = [
  { id: "grass", name: "Cỏ non (Grass)", desc: "Mềm mại, xào xạc lá khô", icon: "🌱" },
  { id: "sand", name: "Cát & Bụi (Sand)", desc: "Xào xạc sỏi đá sa mạc", icon: "🏜️" },
  { id: "wood", name: "Gỗ bách (Wood)", desc: "Tiếng gỗ gõ giòn cồm cộp", icon: "🪵" },
  { id: "stone", name: "Đá khối (Stone)", desc: "Đanh thép, dứt khoát", icon: "🪨" },
];

export default function SoundTestPage() {
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [activeAmbients, setActiveAmbients] = useState<Ambient[]>([]);
  const [selectedSurface, setSelectedSurface] = useState<Surface>("wood");
  const [beadIndex, setBeadIndex] = useState(0);
  const [filterGame, setFilterGame] = useState<string>("all");

  const muted = useSyncExternalStore(audio.subscribe, () => audio.muted, () => false);

  useEffect(() => {
    audio.init();
    audio.setSurface(selectedSurface);
  }, [selectedSurface]);

  const handlePlayMusic = (id: string) => {
    if (currentPlaying === id) {
      audio.stopMusic();
      setCurrentPlaying(null);
    } else {
      audio.playMusic(id);
      setCurrentPlaying(id);
    }
  };

  const handleStopAll = () => {
    audio.stopMusic();
    audio.stopAmbient();
    setCurrentPlaying(null);
    setActiveAmbients([]);
  };

  const handleToggleAmbient = (id: Ambient) => {
    const next = activeAmbients.includes(id)
      ? activeAmbients.filter((a) => a !== id)
      : [...activeAmbients, id];
    setActiveAmbients(next);
    audio.playAmbient(next);
  };

  const handlePlaySfx = (sfx: SfxName) => {
    if (sfx === "bead") {
      audio.sfx("bead", beadIndex);
      setBeadIndex((prev) => (prev + 1) % 5);
    } else {
      audio.sfx(sfx);
    }
  };

  const handleSetSurface = (s: Surface) => {
    setSelectedSurface(s);
    audio.setSurface(s);
    audio.sfx("step");
  };

  const filteredTracks = filterGame === "all"
    ? BGM_TRACKS
    : BGM_TRACKS.filter((t) => t.game.toLowerCase().includes(filterGame.toLowerCase()));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-pixel pb-20 selection:bg-amber-500 selection:text-slate-950">
      {/* Top sticky HUD Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b-4 border-amber-500 px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="retro-btn px-3 py-1 text-[16px] text-amber-300 hover:text-amber-100"
              title="Về trang chủ"
            >
              🏠
            </Link>
            <div>
              <h1 className="text-[20px] sm:text-[24px] text-amber-300 leading-none">
                🎵 Studio Âm Thanh & BGM
              </h1>
              <p className="text-[11px] text-amber-200/70 mt-0.5">
                Kiểm âm Web Audio tổng hợp trực tiếp trong mã nguồn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStopAll}
              className="retro-btn-red px-3 py-1 text-[12px] sm:text-[13px] active:translate-y-0.5"
            >
              ⏹ DỪNG TẤT CẢ
            </button>
            <button
              type="button"
              onClick={() => audio.setMuted(!muted)}
              className="retro-btn-gold px-3 py-1 text-[12px] sm:text-[13px] active:translate-y-0.5"
            >
              {muted ? "🔇 ĐANG TẮT" : "🔊 ÂM LƯỢNG BẬT"}
            </button>
          </div>
        </div>

        {/* Live Audio Status Strip */}
        <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-slate-800 text-[12px] flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">Đang phát nhạc:</span>
            {currentPlaying ? (
              <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-600 px-2 py-0.5 rounded">
                ▶ {BGM_TRACKS.find((t) => t.id === currentPlaying)?.title} ({currentPlaying})
              </span>
            ) : (
              <span className="text-slate-500 italic">Yên lặng (None)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">Âm nền (Ambient):</span>
            {activeAmbients.length > 0 ? (
              <span className="text-sky-300 bg-sky-950/60 border border-sky-600 px-2 py-0.5 rounded">
                {activeAmbients.join(", ")}
              </span>
            ) : (
              <span className="text-slate-500 italic">Không có</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">Mặt sàn bước chân:</span>
            <span className="text-amber-200 bg-slate-800 border border-amber-600 px-2 py-0.5 rounded">
              {SURFACES.find((s) => s.id === selectedSurface)?.name}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-12">
        {/* Section 1: Background Music */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-[26px] sm:text-[30px] text-amber-300 drop-shadow-[0_2px_0_#78350f]">
                1. Nhạc Nền Các Chặng (20 Tracks)
              </h2>
              <p className="text-[13px] text-slate-400">
                Mỗi màn chơi sở hữu giai điệu 8-bit riêng biệt phù hợp tâm tình và nhịp điệu câu chuyện Kinh Thánh.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 text-[12px]">
              {[
                { id: "all", label: "Tất cả (20)" },
                { id: "rosary", label: "Rosary" },
                { id: "noah", label: "Noah's Ark" },
                { id: "eden", label: "Garden of Eden" },
                { id: "moses", label: "Moses – The Exodus" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterGame(f.id)}
                  className={`px-3 py-1 rounded transition-colors ${
                    filterGame === f.id
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTracks.map((tr) => {
              const isPlaying = currentPlaying === tr.id;
              return (
                <div
                  key={tr.id}
                  className={`retro-frame p-4 transition-all duration-150 flex flex-col justify-between ${
                    isPlaying
                      ? "border-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.3)] bg-slate-900"
                      : "hover:border-amber-400/80"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[18px] sm:text-[20px] text-amber-300 font-bold">
                            {tr.title}
                          </h3>
                          {isPlaying && (
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-200/60 font-mono">
                          ID: <span className="text-amber-100">{tr.id}</span> · {tr.game}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlayMusic(tr.id)}
                        className={`px-3 py-1 text-[13px] active:translate-y-0.5 font-bold ${
                          isPlaying ? "retro-btn-red" : "retro-btn-gold"
                        }`}
                      >
                        {isPlaying ? "⏹ DỪNG" : "▶ PHÁT"}
                      </button>
                    </div>

                    <p className="text-[13px] text-slate-200 mt-3 leading-snug">
                      {tr.mood}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-200 border border-slate-700">
                        ⚡ {tr.bpm} BPM
                      </span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-sky-200 border border-slate-700">
                        🎼 {tr.keySignature}
                      </span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-purple-200 border border-slate-700">
                        🔊 {tr.leadWave}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {tr.tags.map((tag) => (
                        <span key={tag} className="border border-slate-700/80 bg-slate-950/60 px-1.5 py-0.5 rounded text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Ambient Soundscapes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[26px] sm:text-[30px] text-amber-300 drop-shadow-[0_2px_0_#78350f]">
                2. Âm Thanh Môi Trường (5 Lớp Ambient)
              </h2>
              <p className="text-[13px] text-slate-400">
                Có thể bật lồng ghép cùng lúc nhiều lớp âm nền và phát song song với nhạc nền.
              </p>
            </div>
            {activeAmbients.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveAmbients([]);
                  audio.stopAmbient();
                }}
                className="retro-btn-red px-3 py-1 text-[12px]"
              >
                TẮT ÂM NỀN
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AMBIENTS.map((amb) => {
              const active = activeAmbients.includes(amb.id);
              return (
                <div
                  key={amb.id}
                  className={`retro-frame p-4 flex flex-col justify-between ${
                    active ? "border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)] bg-slate-900" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[17px] text-amber-300 font-bold">{amb.name}</h3>
                      <button
                        type="button"
                        onClick={() => handleToggleAmbient(amb.id)}
                        className={`px-3 py-1 text-[12px] ${active ? "retro-btn-green" : "retro-btn"}`}
                      >
                        {active ? "✔ ĐANG BẬT" : "BẬT"}
                      </button>
                    </div>
                    <p className="text-[13px] text-slate-200 mt-2">{amb.mood}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-3 border-t border-slate-800 pt-2">
                    {amb.details}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Sound Effects (SFX) */}
        <section>
          <div className="mb-4">
            <h2 className="text-[26px] sm:text-[30px] text-amber-300 drop-shadow-[0_2px_0_#78350f]">
              3. Hiệu Ứng Âm Thanh Tức Thời (SFX)
            </h2>
            <p className="text-[13px] text-slate-400">
              Nhấn nút để nghe thử các hiệu ứng tương tác, chúc phúc, giải đố và âm báo hành động.
            </p>
          </div>

          {/* Grouped by category */}
          {(["Praise & Win", "Action & World", "UI & Dialogue"] as const).map((cat) => (
            <div key={cat} className="mb-6">
              <h3 className="text-[16px] text-amber-400 mb-2 border-b border-amber-900/60 pb-1">
                ▸ {cat}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SFX_LIST.filter((s) => s.category === cat).map((s) => (
                  <div
                    key={s.id}
                    className="retro-frame p-3 flex flex-col justify-between hover:border-amber-400/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] text-amber-200 font-bold">{s.name}</span>
                        <button
                          type="button"
                          onClick={() => handlePlaySfx(s.id)}
                          className="retro-btn-gold px-2.5 py-0.5 text-[11px] active:translate-y-0.5"
                        >
                          🔊 PHÁT
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">{s.mood}</p>
                    </div>

                    {s.id === "bead" && (
                      <div className="mt-2 text-[10px] text-amber-300/80 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 flex justify-between items-center">
                        <span>Hạt số: {(beadIndex % 5) + 1}/5</span>
                        <span className="text-slate-500">(Bấm lại để lên nốt)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Section 4: Footstep Surfaces */}
        <section>
          <div className="mb-4">
            <h2 className="text-[26px] sm:text-[30px] text-amber-300 drop-shadow-[0_2px_0_#78350f]">
              4. Âm Thanh Bước Chân Theo Địa Hình
            </h2>
            <p className="text-[13px] text-slate-400">
              Mỗi màn chơi có chất liệu sàn khác nhau (Cỏ, Cát, Gỗ, Đá). Nhấn chọn mặt sàn để nghe thử bước chân.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SURFACES.map((surf) => {
              const active = selectedSurface === surf.id;
              return (
                <button
                  key={surf.id}
                  type="button"
                  onClick={() => handleSetSurface(surf.id)}
                  className={`retro-frame p-4 text-left transition-all active:translate-y-0.5 ${
                    active ? "border-amber-400 bg-amber-950/30 shadow-[0_0_12px_rgba(245,158,11,0.3)]" : ""
                  }`}
                >
                  <div className="text-[28px] mb-1">{surf.icon}</div>
                  <div className="text-[16px] text-amber-300 font-bold">{surf.name}</div>
                  <div className="text-[11px] text-slate-300 mt-1">{surf.desc}</div>
                  <div className="mt-3 text-[11px] text-amber-400 font-bold flex items-center justify-between">
                    <span>{active ? "● ĐANG CHỌN" : "BẤM THỬ"}</span>
                    <span>👟</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

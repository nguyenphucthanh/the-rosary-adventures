"use client";

import Link from "next/link";
import { LANGS, pick, setLang, useLang, type L } from "@/modules/shared/i18n";

const l = (vi: string, en: string): L => ({ vi, en });

// ponytail: add objects here as games ship.
const GAMES = [
  {
    href: "/the-rosary-adventures",
    title: "The Rosary Adventures",
    blurb: l("Phiêu lưu qua 20 Mầu Nhiệm Mân Côi cùng Đức Mẹ và Chúa Giêsu.", "An adventure through the 20 Mysteries of the Rosary with Our Lady and Jesus."),
    tags: [l("20 màn chơi", "20 stages"), l("Mobile", "Mobile"), l("Thiếu nhi", "For kids")],
    image: "/games/the-rosary-adventures.png",
  },
  {
    href: "/the-garden-of-eden",
    title: "The Garden of Eden",
    blurb: l("Bảy ngày tạo dựng, Vườn Địa Đàng và Lời Hứa Cứu Độ qua 12 màn chơi giải đố.", "The seven days of creation, the Garden of Eden and the Promise of Salvation in 12 puzzle stages."),
    tags: [l("12 màn chơi", "12 stages"), l("Giải đố", "Puzzles"), l("Sáng Thế", "Genesis")],
    image: "/games/the-garden-of-eden.png",
  },
  {
    href: "/noahs-ark",
    title: "Noah's Ark",
    blurb: l("Con Tàu Nô-ê, cơn Đại Hồng Thủy và Cầu Vồng Giao Ước qua 8 màn chơi đa thể loại.", "Noah's Ark, the Great Flood and the Rainbow Covenant in 8 mixed-genre stages."),
    tags: [l("8 màn chơi", "8 stages"), l("Đa thể loại", "Mixed genres"), l("Sáng Thế", "Genesis")],
    image: "/games/noahs-ark.png",
  },
  {
    href: "/moses-the-exodus",
    title: "Moses – The Exodus",
    blurb: l("Từ chiếc thúng cói sông Nin đến Mười Điều Răn trên núi Xi-nai qua 13 màn chơi đa thể loại.", "From the basket on the Nile to the Ten Commandments on Mount Sinai in 13 mixed-genre stages."),
    tags: [l("13 màn chơi", "13 stages"), l("Đa thể loại", "Mixed genres"), l("Xuất Hành", "Exodus")],
    image: "/games/moses-the-exodus.png",
  },
];

export default function Home() {
  const lang = useLang();
  return (
    <main className="fixed inset-0 overflow-y-auto bg-slate-950 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <p className="font-pixel text-[14px] tracking-widest text-amber-200/70">✝ ✦ ✝</p>
          <h1 className="font-pixel text-[40px] leading-tight text-amber-300 sm:text-[56px] drop-shadow-[0_4px_0_#78350f]">
            Bible Adventures
          </h1>
          <p className="mt-2 font-pixel text-[16px] text-amber-100/80">{pick(l("Chọn một cuộc phiêu lưu", "Choose an adventure"), lang)}</p>
          <div className="mt-4 flex justify-center gap-2" role="group" aria-label="Language / Ngôn ngữ">
            {LANGS.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={lang === item.value}
                onClick={() => setLang(item.value)}
                className={`border-2 px-3 py-1 font-pixel text-[14px] ${lang === item.value ? "border-amber-400 bg-amber-500 text-slate-950" : "border-amber-700 text-amber-200 hover:border-amber-400"}`}
              >
                {item.flag} {item.label}
              </button>
            ))}
          </div>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2">
          {GAMES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group block overflow-hidden border-4 border-amber-500 bg-slate-900 shadow-[6px_6px_0_#78350f] transition-transform hover:-translate-y-1 active:translate-y-0.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image}
                  alt=""
                  className="aspect-[1200/630] w-full object-cover [image-rendering:pixelated]"
                />
                <div className="space-y-3 p-4">
                  <h2 className="font-pixel text-[24px] text-amber-300">{g.title}</h2>
                  <p className="font-pixel text-[15px] leading-snug text-amber-100/80">{pick(g.blurb, lang)}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.tags.map((tag) => (
                      <span key={tag.vi} className="border-2 border-amber-700 px-2 py-0.5 font-pixel text-[12px] text-amber-200">
                        {pick(tag, lang)}
                      </span>
                    ))}
                  </div>
                  <span className="inline-block bg-amber-500 px-4 py-1.5 font-pixel text-[16px] text-slate-950 group-hover:bg-amber-400">
                    ▶ {pick(l("CHƠI NGAY", "PLAY NOW"), lang)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

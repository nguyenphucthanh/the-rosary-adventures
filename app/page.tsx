import Link from "next/link";

// ponytail: one entry now; add objects here as games ship.
const GAMES = [
  {
    href: "/the-rosary-adventures",
    title: "The Rosary Adventures",
    blurb: "Phiêu lưu qua 20 Mầu Nhiệm Mân Côi cùng Đức Mẹ và Chúa Giêsu.",
    tags: ["20 màn chơi", "Mobile", "Thiếu nhi"],
    image: "/games/the-rosary-adventures.png",
  },
];

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-slate-950 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <p className="font-pixel text-[14px] tracking-widest text-amber-200/70">✝ ✦ ✝</p>
          <h1 className="font-pixel text-[40px] leading-tight text-amber-300 sm:text-[56px] drop-shadow-[0_4px_0_#78350f]">
            Bible Adventures
          </h1>
          <p className="mt-2 font-pixel text-[16px] text-amber-100/80">Chọn một cuộc phiêu lưu</p>
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
                  <p className="font-pixel text-[15px] leading-snug text-amber-100/80">{g.blurb}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.tags.map((t) => (
                      <span key={t} className="border-2 border-amber-700 px-2 py-0.5 font-pixel text-[12px] text-amber-200">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-block bg-amber-500 px-4 py-1.5 font-pixel text-[16px] text-slate-950 group-hover:bg-amber-400">
                    ▶ CHƠI NGAY
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

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dearpix = localFont({
  src: "../public/fonts/dearpix-2-01.otf.woff2",
  variable: "--font-dearpix",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "The Rosary Adventures - 20 Mầu Nhiệm Mân Côi",
  description: "Trò chơi 2D phiêu lưu học và suy niệm 20 Mầu Nhiệm Mân Côi dành cho thiếu nhi và gia đình.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${dearpix.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans select-none overflow-hidden">{children}</body>
    </html>
  );
}

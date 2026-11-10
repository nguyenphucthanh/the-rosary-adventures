import type { Metadata } from "next";
import TheGardenOfEden from "@/modules/the-garden-of-eden/TheGardenOfEden";

export const metadata: Metadata = {
  title: "The Garden of Eden - Bảy Ngày Tạo Dựng & Vườn Địa Đàng",
  description: "Trò chơi 2D giải đố phiêu lưu về Sách Sáng Thế: 7 ngày tạo dựng, Vườn Địa Đàng và Lời Hứa Cứu Độ.",
};

export default function Page() {
  return <TheGardenOfEden />;
}

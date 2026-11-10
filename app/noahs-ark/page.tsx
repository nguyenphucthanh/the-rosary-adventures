import type { Metadata } from "next";
import NoahsArk from "@/modules/noahs-ark/NoahsArk";

export const metadata: Metadata = {
  title: "Noah's Ark - Con Tàu Nô-Ê & Cầu Vồng Giao Ước",
  description: "Trò chơi 2D phiêu lưu đa thể loại về Sách Sáng Thế 6–9: Con Tàu Nô-ê, cơn Đại Hồng Thủy và Cầu Vồng Giao Ước.",
};

export default function Page() {
  return <NoahsArk />;
}

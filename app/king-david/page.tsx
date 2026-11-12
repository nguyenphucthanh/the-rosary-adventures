import type { Metadata } from "next";
import KingDavid from "@/modules/king-david/KingDavid";

export const metadata: Metadata = {
  title: "King David – Shepherd & King - Vua Đa-vít",
  description: "Trò chơi 2D phiêu lưu đa thể loại về cuộc đời Vua Đa-vít: từ cậu bé chăn chiên ở Bê-lem, tiếng đàn hạc, trận đấu Gô-li-át đến ngai vàng Giê-ru-sa-lem.",
};

export default function Page() {
  return <KingDavid />;
}

import type { Metadata } from "next";
import MosesTheExodus from "@/modules/moses-the-exodus/MosesTheExodus";

export const metadata: Metadata = {
  title: "Moses – The Exodus - Mô-sê & Hành Trình Xuất Hành",
  description: "Trò chơi 2D phiêu lưu đa thể loại về Sách Xuất Hành: từ chiếc thúng cói sông Nin, Bụi Cây Bốc Cháy, Biển Đỏ đến Mười Điều Răn trên núi Xi-nai.",
};

export default function Page() {
  return <MosesTheExodus />;
}

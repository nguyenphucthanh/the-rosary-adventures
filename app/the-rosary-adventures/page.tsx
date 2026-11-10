import type { Metadata } from "next";
import RosaryGame from "@/modules/the-rosary-adventures/RosaryGame";

export const metadata: Metadata = {
  title: "The Rosary Adventures - 20 Mầu Nhiệm Mân Côi",
  description: "Trò chơi 2D phiêu lưu học và suy niệm 20 Mầu Nhiệm Mân Côi dành cho thiếu nhi và gia đình.",
};

export default function Page() {
  return <RosaryGame />;
}

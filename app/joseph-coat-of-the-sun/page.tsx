import type { Metadata } from "next";
import JosephCoatOfTheSun from "@/modules/joseph-coat-of-the-sun/JosephCoatOfTheSun";

export const metadata: Metadata = {
  title: "Joseph – The Coat of the Sun - Giuse Chiếc Áo Mặt Trời",
  description: "Trò chơi 2D phiêu lưu đa thể loại về cuộc đời Giuse: từ giấc mơ ở Hếp-rôn, bị bán sang Ai-cập, ngục tù, đến ngôi tể tướng và lời tha thứ cho các anh.",
};

export default function Page() {
  return <JosephCoatOfTheSun />;
}

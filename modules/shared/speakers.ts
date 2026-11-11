import { getLang } from "@/modules/shared/i18n";

/**
 * English names for the speaker plates that scenes pass to the dialogue box as Vietnamese text.
 * Unknown names fall through unchanged, so adding a speaker never breaks a dialogue.
 */
const SPEAKERS_EN: Record<string, string> = {
  // narrator / generic
  "Suy niệm": "Reflection",
  "Chúa Thánh Thần": "Holy Spirit",
  "Thiên Chúa": "God",
  "Đức Chúa": "The Lord",
  // Moses
  "Sông Nin": "The Nile",
  "Hoàng tử Môi-sê": "Prince Moses",
  "Núi Khô-rép": "Mount Horeb",
  "Sân Cung Điện": "The Palace Courtyard",
  "Làng Gô-sen": "Village of Goshen",
  "Đêm Vượt Qua": "Passover Night",
  "Biển Đỏ": "The Red Sea",
  "Mi-ri-am": "Miriam",
  "Môi-sê": "Moses",
  "Hoang địa": "The Wilderness",
  "Đỉnh núi Nê-vô": "Mount Nebo",
  "Môi-sê và Giu-suê": "Moses and Joshua",
  "Sông Gio-đan": "The Jordan River",
  // Noah
  "Người Công Chính": "The Righteous Man",
  "Bản Vẽ Của Chúa": "God's Blueprint",
  "Muôn Thú Lên Tàu": "The Animals Board",
  "Bốn Mươi Đêm Mưa": "Forty Nights of Rain",
  "Biển Nước Mênh Mông": "The Endless Waters",
  "Ngọn Gió Của Chúa": "God's Wind",
  "Chim Bồ Câu": "The Dove",
  "Giao Ước Cầu Vồng": "The Rainbow Covenant",
  "Con Tàu Hội Thánh": "The Ark of the Church",
  // Genesis
  "Ngày Thứ Nhất": "Day One",
  "Ngày Thứ Hai": "Day Two",
  "Ngày Thứ Ba": "Day Three",
  "Ngày Thứ Tư": "Day Four",
  "Ngày Thứ Năm": "Day Five",
  "Ngày Thứ Sáu": "Day Six",
  "Ngày Thứ Bảy": "Day Seven",
  "Vườn Ê-đen": "The Garden of Eden",
  "Vườn Đôi": "The Two Gardens",
  "Cây Biết Lành Biết Dữ": "The Tree of Knowledge",
  "Chiều Gió Thổi": "The Evening Breeze",
  "Lời Hứa Cứu Độ": "The Promise of Salvation",
  "Khu Vườn Tâm Hồn": "The Garden of the Soul",
};

export function registerSpeakers(more: Record<string, string>): void {
  Object.assign(SPEAKERS_EN, more);
}

/** Speaker plate text for the current language. */
export function speakerName(vi: string): string {
  return getLang() === "en" ? SPEAKERS_EN[vi] ?? vi : vi;
}

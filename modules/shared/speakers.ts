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
  "Hoàng tử Mô-sê": "Prince Moses",
  "Núi Khô-rép": "Mount Horeb",
  "Sân Cung Điện": "The Palace Courtyard",
  "Làng Gô-sen": "Village of Goshen",
  "Đêm Vượt Qua": "Passover Night",
  "Biển Đỏ": "The Red Sea",
  "Mi-ri-am": "Miriam",
  "Mô-sê": "Moses",
  "Hoang địa": "The Wilderness",
  "Đỉnh núi Nê-vô": "Mount Nebo",
  "Mô-sê và Giô-suê": "Moses and Joshua",
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
  "Lờì Hứa Cứu Độ": "The Promise of Salvation",
  "Lời Hứa Cứu Độ": "The Promise of Salvation",
  "Khu Vườn Tâm Hồn": "The Garden of the Soul",
  // King David
  "Đa-vít": "David",
  "Vua Đa-vít": "King David",
  "Sa-mu-en": "Samuel",
  "Ngôn sứ Sa-mu-en": "Prophet Samuel",
  "Giê-sê": "Jesse",
  "Vua Sa-un": "King Saul",
  "Sa-un": "Saul",
  "Gô-li-át": "Goliath",
  "Giô-na-than": "Jonathan",
  "Hoàng tử Giô-na-than": "Prince Jonathan",
  "A-khi-me-léc": "Ahimelech",
  "A-bi-gai-in": "Abigail",
  "Bà A-bi-gai-in": "Abigail",
  "A-bi-sai": "Abishai",
  "Giô-áp": "Joab",
  "Na-than": "Nathan",
  "Ngôn sứ Na-than": "Prophet Nathan",
  "Đồng cỏ Bê-lem": "Pastures of Bethlehem",
  "Thung lũng Ê-la": "Valley of Elah",
  "Hang A-đu-lam": "Cave of Adullam",
  "Hang Ên Gê-đi": "Cave of En-Gedi",
  "Đồi Khắc-hi-la": "Hill of Hachilah",
  "Thành Khép-rôn": "City of Hebron",
  "Thành Đa-vít": "City of David",
  // Joseph (Catholic spellings; Pút-ti-phác / Át-xơ-nát to verify against CGKPV)
  "Giuse": "Joseph",
  "Gia-cóp": "Jacob",
  "Rúp-ben": "Reuben",
  "Giu-đa": "Judah",
  "Ben-gia-min": "Benjamin",
  "Pút-ti-phác": "Potiphar",
  "Pha-ra-ô": "Pharaoh",
  "Quan tửu chánh": "Chief Cupbearer",
  "Quan thượng thiện": "Chief Baker",
  "Lái buôn Ít-ma-en": "Ishmaelite Trader",
  "Các anh của Giuse": "Joseph's Brothers",
  "Hếp-rôn": "Hebron",
  "Giếng cạn Đô-than": "The Dry Well at Dothan",
  "Gô-sen": "Goshen",
};

export function registerSpeakers(more: Record<string, string>): void {
  Object.assign(SPEAKERS_EN, more);
}

/** Speaker plate text for the current language. */
export function speakerName(vi: string): string {
  return getLang() === "en" ? SPEAKERS_EN[vi] ?? vi : vi;
}

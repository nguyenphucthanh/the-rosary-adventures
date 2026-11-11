import { EXODUS_STAGE_KEYS, type ExodusStageKey } from "@/modules/moses-the-exodus/types/game";

export interface ExodusStageInfo {
  key: ExodusStageKey;
  index: number; // 0..12 = Ấn Dấu số (index + 1)
  titleVi: string;
  titleEn: string;
  scripture: string;
  genreVi: string;
  genreEn: string;
  fruitVi: string;
  fruitEn: string;
  intro: string; // storybook picture id -> /games/moses-the-exodus/intro/<id>.png (texture "intro-<id>")
  color: string; // seal colour on the Bia Đá
}

// ponytail: HUD metadata only; theme-verse text + dialogue land with each stage scene.
export const EXODUS_STAGES: ExodusStageInfo[] = [
  { key: "stage_01_thung_coi_song_nin", index: 0, intro: "1", color: "#dc2626", titleVi: "Chiếc Thúng Cói Trên Sông Nin", titleEn: "The Basket on the Nile", scripture: "Xh 1, 22 – 2, 10", genreVi: "Điều tiết dòng nước & lẩn trốn", genreEn: "River routing & stealth", fruitVi: "Thiên Chúa quan phòng kỳ diệu và che chở em nhỏ qua tình yêu của mẹ và chị Mi-ri-am.", fruitEn: "God's wonderful providence protects a little child through the love of a mother and sister." },
  { key: "stage_02_hoang_tu_va_gieng_nuoc_madian", index: 1, intro: "2", color: "#ea580c", titleVi: "Lựa Chọn Của Hoàng Tử & Giếng Nước Ma-đi-an", titleEn: "The Prince's Choice & the Well of Midian", scripture: "Xh 2, 11-25", genreVi: "Cứu người lén lút & giữ giếng nước", genreEn: "Stealth rescue & well defense", fruitVi: "Can đảm đứng về phía người yếu thế; sức mạnh con người không thay được đường lối của Thiên Chúa.", fruitEn: "Courage to stand with the weak; human strength cannot replace God's way." },
  { key: "stage_03_bui_cay_boc_chay", index: 2, intro: "3", color: "#f59e0b", titleVi: "Bụi Cây Bốc Cháy Trên Núi Khô-rép", titleEn: "The Burning Bush on Mount Horeb", scripture: "Xh 3, 1 – 4, 17", genreVi: "Đất thánh & ba dấu lạ", genreEn: "Sacred ground & three signs", fruitVi: "Giữ lòng tôn kính khi vào nhà Chúa, và tin rằng Chúa giao việc khó thì Chúa ban ơn giúp sức.", fruitEn: "Keep reverence in God's house, and trust that He gives strength for the tasks He asks." },
  { key: "stage_04_doi_dien_pharao", index: 3, intro: "4", color: "#eab308", titleVi: "Đối Diện Pha-ra-ô & Các Dấu Lạ", titleEn: "Before Pharaoh & the Signs", scripture: "Xh 7, 14 – 9, 35", genreVi: "Dùng gậy phá Khiên Cứng Lòng", genreEn: "Staff channelling vs. the Hardened Shield", fruitVi: "Đừng sống cứng lòng, ngoan cố hay thất hứa như Pha-ra-ô; hãy có trái tim mềm biết lắng nghe.", fruitEn: "Do not be hard-hearted or break promises like Pharaoh; keep a soft heart that listens." },
  { key: "stage_05_anh_sang_dat_gosen", index: 4, intro: "5", color: "#84cc16", titleVi: "Ba Ngày Tối Dày Đặc & Ánh Sáng Gô-sen", titleEn: "Thick Darkness & the Light of Goshen", scripture: "Xh 10, 21-29", genreVi: "Thắp nối mạng lưới đèn", genreEn: "Light-network relay", fruitVi: "Nơi nào có Chúa và gia đình cùng cầu nguyện, nơi đó tràn ngập ánh sáng bình an.", fruitEn: "Where God is and the family prays together, peace and light fill the house." },
  { key: "stage_06_dem_le_vuot_qua", index: 5, intro: "6", color: "#22c55e", titleVi: "Đêm Lễ Vượt Qua & Máu Chiên Cứu Độ", titleEn: "Passover Night & the Lamb's Blood", scripture: "Xh 12, 1-36", genreVi: "Chuẩn bị tiệc & bôi máu lên khung cửa", genreEn: "Preparation & door marking", fruitVi: "Chiên Vượt Qua là hình ảnh Chúa Giêsu, Chiên Thiên Chúa, đã đổ máu trên Thập Giá để cứu chúng ta.", fruitEn: "The Passover lamb foreshadows Jesus, the Lamb of God, who shed His blood on the Cross to save us." },
  { key: "stage_07_re_nuoc_bien_do", index: 6, intro: "7", color: "#14b8a6", titleVi: "Cột Mây Cột Lửa & Rẽ Nước Biển Đỏ", titleEn: "Pillar of Cloud & Fire, Parting the Red Sea", scripture: "Xh 13, 21 – 14, 31", genreVi: "Hộ tống dân qua biển & Cột Lửa cản chiến xa", genreEn: "Sea escort & pillar-of-fire defense", fruitVi: "Biển Đỏ là hình ảnh Bí tích Rửa Tội: nhờ nước Thánh Tẩy ta được giải thoát khỏi nô lệ tội lỗi.", fruitEn: "The Red Sea foreshadows Baptism: through holy water we are freed from slavery to sin." },
  { key: "stage_08_khuc_ca_nuoc_mara", index: 7, intro: "8", color: "#06b6d4", titleVi: "Khúc Ca Biển Đỏ & Nước Ngọt Ma-ra", titleEn: "The Song at the Sea & the Waters of Marah", scripture: "Xh 15, 1-27", genreVi: "Gõ nhịp trống cơm & thanh lọc nước đắng", genreEn: "Tambourine rhythm & water purification", fruitVi: "Khúc gỗ làm ngọt nước Ma-ra báo trước Thánh Giá: dâng nỗi buồn cho Chúa Giêsu, Người đổi vị đắng thành bình an.", fruitEn: "The wood that sweetened Marah foreshadows the Cross: give your sorrows to Jesus and He turns bitter to peace." },
  { key: "stage_09_banh_manna_tu_troi", index: 8, intro: "9", color: "#3b82f6", titleVi: "Bánh Mân-na & Chim Cút Từ Trời", titleEn: "Manna & Quail from Heaven", scripture: "Xh 16, 1-35", genreVi: "Thu Mân-na đúng khẩu phần trước khi nắng lên", genreEn: "Daily quota gathering vs. the sun", fruitVi: "Đọc kinh Lạy Cha, ta biết tin tưởng xin lương thực hằng ngày; Mân-na báo trước Bí tích Thánh Thể (Ga 6, 32-35).", fruitEn: "In the Our Father we trust for daily bread; manna foreshadows the Eucharist (Jn 6:32-35)." },
  { key: "stage_10_dap_da_va_doi_tay", index: 9, intro: "10", color: "#6366f1", titleVi: "Đập Đá Rê-phi-đim & Đôi Tay Cầu Nguyện", titleEn: "Striking the Rock & the Raised Hands", scripture: "Xh 17, 1-16", genreVi: "Căn nhịp đập đá & nâng đỡ đôi tay", genreEn: "Rock-strike timing & supporting the hands", fruitVi: "Sức mạnh của lời cầu nguyện kiên trì và sự nâng đỡ nhau: như A-ha-rôn và Khua nâng đôi tay Môi-sê.", fruitEn: "The power of persistent prayer and mutual support, as Aaron and Hur held up Moses' hands." },
  { key: "stage_11_muoi_dieu_ran_xinai", index: 10, intro: "11", color: "#8b5cf6", titleVi: "Mười Điều Răn Trên Đỉnh Xi-nai", titleEn: "The Ten Commandments on Sinai", scripture: "Xh 19, 16 – 20, 21", genreVi: "Leo núi & ghép Mười Điều Răn", genreEn: "Mountain ascent & the ten tablets", fruitVi: "Thuộc lòng và sống Mười Điều Răn, tóm lại trong hai điều: Mến Chúa hết lòng, yêu người như chính mình.", fruitEn: "Know and live the Ten Commandments, summed up in two: love God with all your heart, love your neighbour as yourself." },
  { key: "stage_12_be_vang_chuyen_cau", index: 11, intro: "12", color: "#d946ef", titleVi: "Bi Kịch Bê Vàng & Lời Chuyển Cầu", titleEn: "The Golden Calf & Moses' Intercession", scripture: "Xh 32, 1-34; 34, 1-10", genreVi: "Dẹp thần tượng & đẽo lại Bia Đá", genreEn: "Idol purge & stone carving", fruitVi: "Đừng để tiền bạc hay trò chơi chiếm chỗ của Chúa trong lòng; hãy cầu nguyện cho người khác và tin vào Lòng Thương Xót của Chúa.", fruitEn: "Never let money or games take God's place in your heart; pray for others and trust His mercy." },
  { key: "stage_13_nha_tam_giao_uoc", index: 12, intro: "13", color: "#fcd34d", titleVi: "Dựng Nhà Tạm & Vinh Quang Chúa Ngự Xuống", titleEn: "The Tabernacle & the Glory of the Lord", scripture: "Xh 35 – 40", genreVi: "Lắp ráp Nhà Tạm Giao Ước", genreEn: "Sanctuary assembly finale", fruitVi: "Thiên Chúa muốn ở gần con người: Nhà Tạm xưa báo trước Chúa Giêsu ngự trong Nhà Tạm Thánh Thể và Mẹ Maria, Hòm Bia Mới.", fruitEn: "God wants to be near us: the Tabernacle foreshadows Jesus in the Eucharist and Mary, the New Ark." },
];

export const SEAL_COUNT = EXODUS_STAGES.length;

/** Stage key -> Phaser scene key. Only built stages appear here; add one line per stage. */
export const STAGE_SCENES: Partial<Record<ExodusStageKey, string>> = {
  prologue_cay_gay_nguoi_muc_tu: "PrologueScene",
  stage_01_thung_coi_song_nin: "Stage01NileBasketScene",
  stage_02_hoang_tu_va_gieng_nuoc_madian: "Stage02PrinceChoiceScene",
  stage_03_bui_cay_boc_chay: "Stage03BurningBushScene",
  stage_04_doi_dien_pharao: "Stage04PharaohPlaguesScene",
  stage_05_anh_sang_dat_gosen: "Stage05GoshenLightScene",
  stage_06_dem_le_vuot_qua: "Stage06PassoverNightScene",
  stage_07_re_nuoc_bien_do: "Stage07RedSeaCrossingScene",
  stage_08_khuc_ca_nuoc_mara: "Stage08MiriamMaraScene",
  stage_09_banh_manna_tu_troi: "Stage09MannaQuailScene",
  stage_10_dap_da_va_doi_tay: "Stage10RephidimHandsScene",
};

/** Scene of the next built stage after `key`, or undefined when none is built yet. */
export function nextSceneAfter(key: string): string | undefined {
  const i = (EXODUS_STAGE_KEYS as readonly string[]).indexOf(key);
  return EXODUS_STAGE_KEYS.slice(i + 1).map((k) => STAGE_SCENES[k]).find(Boolean);
}

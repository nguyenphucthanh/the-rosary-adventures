import { DAVID_STAGE_KEYS, type DavidStageKey } from "@/modules/king-david/types/game";

export interface DavidStageInfo {
  key: DavidStageKey;
  index: number; // 0..11 = Ấn Thánh Vịnh số (index + 1)
  titleVi: string;
  titleEn: string;
  scripture: string;
  genreVi: string;
  genreEn: string;
  fruitVi: string;
  fruitEn: string;
  intro: string; // storybook picture id -> /games/king-david/intro/<id>.png (texture "intro-<id>")
  color: string; // seal colour on the Harp
}

// ponytail: HUD metadata only; theme-verse text + dialogue land with each stage scene.
export const DAVID_STAGES: DavidStageInfo[] = [
  { key: "stage_01_dong_co_belem_xuc_dau", index: 0, intro: "1", color: "#22c55e", titleVi: "Đồng Cỏ Bê-lem & Dầu Thánh Tuyển Chọn", titleEn: "Pastures of Bethlehem & the Anointing", scripture: "1 Sm 16, 1-13", genreVi: "Chăn chiên, xua thú dữ & nhận dầu thánh", genreEn: "Flock herding, predator defense & anointing", fruitVi: "Thiên Chúa không nhìn dáng vẻ bên ngoài nhưng nhìn tận đáy lòng khiêm nhường và trung tín.", fruitEn: "God does not look at outward appearance, but looks into a humble and faithful heart." },
  { key: "stage_02_tieng_dan_cung_dien_saun", index: 1, intro: "2", color: "#eab308", titleVi: "Tiếng Đàn Hạc Trong Cung Điện Sa-un", titleEn: "The Harp in King Saul's Palace", scripture: "1 Sm 16, 14-23", genreVi: "Gảy đàn theo nhịp xua tan bóng tối u sầu", genreEn: "Harp rhythm & shadow-cloud dispel", fruitVi: "Lời cầu nguyện, thánh ca và sự dịu dàng đem lại bình an của Chúa cho tâm hồn bất an.", fruitEn: "Prayer, sacred music and gentleness bring God's peace to troubled hearts." },
  { key: "stage_03_thung_lung_ela_goliat", index: 2, intro: "3", color: "#f97316", titleVi: "Thung Lũng Ê-la & Người Khổng Lồ Gô-li-át", titleEn: "The Valley of Elah & Giant Goliath", scripture: "1 Sm 17, 1-51", genreVi: "Chọn 5 viên đá suối & căn lực dây ná", genreEn: "Stream stone selection & precision sling boss", fruitVi: "Đứng trước thử thách lớn lao, đừng sợ hãi nhưng hãy tiến bước nhân danh Đức Chúa.", fruitEn: "Before giant challenges, do not fear, but step forward in the name of the Lord." },
  { key: "stage_04_giao_uoc_gionathan_mui_ten", index: 3, intro: "4", color: "#3b82f6", titleVi: "Giao Ước Giô-na-than & Mũi Tên Báo Hiệu", titleEn: "Jonathan's Covenant & the Signal Arrows", scripture: "1 Sm 18, 1-4; 20, 1-42", genreVi: "Ẩn nấp thoát vây & giải mã mũi tên mật hiệu", genreEn: "Stealth escape & arrow-signal code puzzle", fruitVi: "Tình bạn chân thành không ganh tị, biết hy sinh bảo vệ bạn mình và đặt ý Chúa trên hết.", fruitEn: "True friendship is free of envy, protects a friend, and puts God's will first." },
  { key: "stage_05_banh_thanh_hang_adulam", index: 4, intro: "5", color: "#f59e0b", titleVi: "Bánh Thánh Đền Nóp & Hang A-đu-lam", titleEn: "Sacred Bread of Nob & Cave of Adullam", scripture: "1 Sm 21, 1-7; 22, 1-5; Tv 57", genreVi: "Thắp lửa sưởi ấm, chia bánh & gảy đàn Thánh Vịnh", genreEn: "Campfire warmth, bread sharing & Psalm harp", fruitVi: "Giữa lúc gian truân, hãy mở lòng nâng đỡ người nghèo khổ và biến hang tối thành mái nhà cầu nguyện.", fruitEn: "In hard times, lift up the poor and turn a dark cave into a home of prayer." },
  { key: "stage_06_hang_engedi_cat_vat_ao", index: 5, intro: "6", color: "#dc2626", titleVi: "Hang Ên Gê-đi – Cắt Vạt Áo Thay Vì Trả Thù", titleEn: "Cave of En-Gedi & the Corner of Saul's Robe", scripture: "1 Sm 24, 1-23", genreVi: "Bước êm trong hang tối & cắt vạt áo hòa giải", genreEn: "Echo-stealth & mercy restraint puzzle", fruitVi: "Chiến thắng lớn nhất là thắng cơn giận của chính mình, không lấy oán báo oán mà lấy thiện thắng ác.", fruitEn: "The greatest victory is conquering anger, overcoming evil with good instead of revenge." },
  { key: "stage_07_ba_abigaiin_hoa_giai", index: 6, intro: "7", color: "#14b8a6", titleVi: "Bà A-bi-gai-in Khôn Ngoan Hòa Giải", titleEn: "Wise Abigail's Peace Caravan", scripture: "1 Sm 25, 1-35", genreVi: "Chuẩn bị đoàn lừa lễ vật & mở đường đèo Các-mên", genreEn: "Caravan logistics & mountain pass routing", fruitVi: "Lời nói dịu hiền làm nguôi cơn giận; người khôn ngoan biết lắng nghe lời khuyên lành để giữ lương tâm trong sáng.", fruitEn: "A gentle word turns away wrath; the wise listen to good counsel and keep a clean heart." },
  { key: "stage_08_cay_giao_binh_nuoc_khachila", index: 7, intro: "8", color: "#6366f1", titleVi: "Cây Giáo & Bình Nước Đồi Khắc-hi-la", titleEn: "The Spear & Water Jug at Hachilah", scripture: "1 Sm 26, 1-25", genreVi: "Đột nhập doanh trại đêm lấy cây giáo & bình nước", genreEn: "Moonlit camp infiltration puzzle", fruitVi: "Kiên trì tha thứ đến cùng và giao phó mọi sự công bình cho Thiên Chúa.", fruitEn: "Persevere in forgiveness to the end and entrust all justice to God." },
  { key: "stage_09_khuc_ca_cay_cung", index: 8, intro: "9", color: "#8b5cf6", titleVi: "Khúc Ca Cây Cung & Nước Mắt Tình Bạn", titleEn: "The Song of the Bow", scripture: "2 Sm 1, 17-27", genreVi: "Nối chòm sao kỷ niệm & hòa tấu Khúc Ca Cây Cung", genreEn: "Star-constellation linking & lament composition", fruitVi: "Trái tim cao thượng không vui mừng khi người khác gặp nạn, luôn ghi nhớ điều tốt đẹp và trọn nghĩa tình.", fruitEn: "A noble heart never rejoices at another's fall, remembering the good with faithful love." },
  { key: "stage_10_dang_quang_khepron_muoi_hai_chi_toc", index: 9, intro: "10", color: "#ec4899", titleVi: "Đăng Quang Tại Khép-rôn & 12 Chi Tộc", titleEn: "Coronation at Hebron & the Twelve Tribes", scripture: "2 Sm 2, 1-4; 5, 1-5", genreVi: "Quy tụ và sắp xếp 12 Cờ Hiệu Chi Tộc Ít-ra-en", genreEn: "Twelve-tribe banner alignment puzzle", fruitVi: "Luôn cầu nguyện hỏi ý Chúa trước mỗi việc; người lãnh đạo đích thực là người mục tử quy tụ và phục vụ.", fruitEn: "Seek the Lord in prayer before every step; a true leader is a shepherd who unites and serves." },
  { key: "stage_11_mach_nuoc_gikhon_thanh_xion", index: 10, intro: "11", color: "#06b6d4", titleVi: "Mạch Nước Gi-khôn & Thành Đô Xi-on", titleEn: "The Gihon Spring & Citadel of Zion", scripture: "2 Sm 5, 6-12", genreVi: "Điều tiết van nước ngầm Gi-khôn & dựng Thành Đa-vít", genreEn: "Water-shaft sluice puzzle & citadel building", fruitVi: "Sự khôn ngoan Chúa ban giúp vượt qua trở ngại khó khăn để xây dựng cộng đoàn hòa bình.", fruitEn: "God-given wisdom overcomes hard obstacles to build a community of peace." },
  { key: "stage_12_ruoc_hom_bia_loi_hua_muon_doi", index: 11, intro: "12", color: "#fcd34d", titleVi: "Rước Hòm Bia & Lời Hứa Vương Quốc Vĩnh Cửu", titleEn: "Procession of the Ark & the Eternal Covenant", scripture: "2 Sm 6, 12-19; 7, 1-17", genreVi: "Rước Hòm Bia theo nhịp 6 bước & nhận Lời Hứa Na-than", genreEn: "Grand procession rhythm & Eternal Covenant finale", fruitVi: "Đặt Chúa ở trung tâm cuộc đời; lời hứa với Vua Đa-vít viên mãn nơi Chúa Giêsu – Con Vua Đa-vít trị vì muôn đời.", fruitEn: "Place God at the centre of life; the promise to David is fulfilled in Jesus, Son of David and King forever." },
];

export const SEAL_COUNT = DAVID_STAGES.length;

/** Stage key -> Phaser scene key. Only built stages appear here; add one line per stage. */
export const STAGE_SCENES: Partial<Record<DavidStageKey, string>> = {
  prologue_dan_hac_nguoi_muc_tu: "PrologueScene",
  stage_01_dong_co_belem_xuc_dau: "Stage01BethlehemAnointingScene",
  stage_02_tieng_dan_cung_dien_saun: "Stage02RoyalHarpSoothingScene",
  stage_03_thung_lung_ela_goliat: "Stage03ValleyOfElahGoliathScene",
  stage_04_giao_uoc_gionathan_mui_ten: "Stage04JonathanArrowsScene",
  stage_05_banh_thanh_hang_adulam: "Stage05AdullamSanctuaryScene",
  stage_06_hang_engedi_cat_vat_ao: "Stage06EnGediMercyScene",
  stage_07_ba_abigaiin_hoa_giai: "Stage07AbigailPeaceScene",
  stage_08_cay_giao_binh_nuoc_khachila: "Stage08SpearAndJugScene",
  stage_09_khuc_ca_cay_cung: "Stage09SongOfTheBowScene",
  stage_10_dang_quang_khepron_muoi_hai_chi_toc: "Stage10HebronCoronationScene",
  stage_11_mach_nuoc_gikhon_thanh_xion: "Stage11GihonSpringZionScene",
  stage_12_ruoc_hom_bia_loi_hua_muon_doi: "Stage12ArkToJerusalemScene",
  epilogue_con_vua_davit: "EpilogueScene",
};

/** Scene of the next built stage after `key`, or undefined when none is built yet. */
export function nextSceneAfter(key: string): string | undefined {
  const i = (DAVID_STAGE_KEYS as readonly string[]).indexOf(key);
  return DAVID_STAGE_KEYS.slice(i + 1).map((k) => STAGE_SCENES[k]).find(Boolean);
}

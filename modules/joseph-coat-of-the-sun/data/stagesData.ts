import { JOSEPH_STAGE_KEYS, type JosephStageKey } from "@/modules/joseph-coat-of-the-sun/types/game";

export interface JosephStageInfo {
  key: JosephStageKey;
  index: number; // 0..11 = tia nắng số (index + 1)
  titleVi: string;
  titleEn: string;
  scripture: string; // Catholic style: "St 37, 1-11"
  genreVi: string;
  genreEn: string;
  fruitVi: string;
  fruitEn: string;
  intro: string; // storybook picture id -> /games/joseph-coat-of-the-sun/intro/<id>.png (texture "intro-<id>")
  color: string; // ray colour on the Sun Coat
}

// ponytail: HUD metadata only; theme-verse text + dialogue land with each stage scene.
// Names/quotes follow the Catholic text (AGENTS.md); verses marked [kiểm lại CGKPV] in scripts.md still need checking.
export const JOSEPH_STAGES: JosephStageInfo[] = [
  { key: "stage_01_giac_mo_bo_lua", index: 0, intro: "1", color: "#fbbf24", titleVi: "Giấc Mơ Bó Lúa Trên Đồng Hếp-rôn", titleEn: "The Dream of the Sheaves", scripture: "St 37, 1-11", genreVi: "Gặt lúa & dựng bó lúa theo giấc mơ", genreEn: "Harvest & sheaf dream puzzle", fruitVi: "Biết ơn tình yêu của cha và không khoe ơn mình được nhận.", fruitEn: "Be thankful for a parent's love and never boast of the gifts you receive." },
  { key: "stage_02_duong_den_dothan", index: 1, intro: "2", color: "#f59e0b", titleVi: "Cha Sai Đi Thăm Các Anh", titleEn: "Sent to Find His Brothers", scripture: "St 37, 12-17", genreVi: "Tìm đường qua đồi đá", genreEn: "Orienteering through the hills", fruitVi: "Vâng lời cha mẹ với lòng tin, dù đường xa.", fruitEn: "Obey your parents with trust, even when the road is long." },
  { key: "stage_03_gieng_can_dothan", index: 2, intro: "3", color: "#f97316", titleVi: "Giếng Cạn Đô-than", titleEn: "The Dry Well at Dothan", scripture: "St 37, 18-28", genreVi: "Giữ bình an, cầu nguyện & thoát giếng", genreEn: "Stay calm, pray & escape the well", fruitVi: "Khi bị đối xử bất công, hãy cầu nguyện và đừng trả đũa.", fruitEn: "When treated unfairly, pray and do not strike back." },
  { key: "stage_04_doan_lai_buon_sa_mac", index: 3, intro: "4", color: "#ef4444", titleVi: "Đoàn Lái Buôn Trên Sa Mạc", titleEn: "The Caravan in the Desert", scripture: "St 37, 25-36", genreVi: "Chạy theo đoàn lạc đà qua sa mạc", genreEn: "Desert caravan runner", fruitVi: "Hy vọng khi xa nhà: Thiên Chúa không bỏ rơi ai.", fruitEn: "Hope when far from home: God never abandons anyone." },
  { key: "stage_05_nha_putiphac", index: 4, intro: "5", color: "#ec4899", titleVi: "Nhà Ông Pút-ti-phác", titleEn: "Potiphar's House", scripture: "St 39, 1-6", genreVi: "Quản gia nhỏ: làm việc đúng giờ", genreEn: "Little steward: tasks on time", fruitVi: "Trung tín trong việc nhỏ, dù không ai khen, vì Chúa vẫn thấy.", fruitEn: "Be faithful in small things, even unpraised, for God sees." },
  { key: "stage_06_hanh_lang_cua_mo", index: 5, intro: "6", color: "#a855f7", titleVi: "Hành Lang Cánh Cửa Mở", titleEn: "The Corridor of the Open Door", scripture: "St 39, 7-20", genreVi: "Chạy hành lang & chọn đúng lối", genreEn: "Corridor chase & choose the right door", fruitVi: "Dám nói \"không\" với điều sai, dù phải chịu thiệt.", fruitEn: "Dare to say \"no\" to what is wrong, even at a cost." },
  { key: "stage_07_trong_nguc", index: 6, intro: "7", color: "#6366f1", titleVi: "Trong Ngục – Hai Giấc Mơ", titleEn: "In Prison – Two Dreams", scripture: "St 39, 21 – 40, 23", genreVi: "Ghép biểu tượng giấc mơ", genreEn: "Dream-symbol matching", fruitVi: "Phục vụ người khác ngay khi mình đau khổ, và kiên nhẫn chờ giờ của Chúa.", fruitEn: "Serve others even while suffering, and wait patiently for God's hour." },
  { key: "stage_08_cung_pharao_bay_bo", index: 7, intro: "8", color: "#3b82f6", titleVi: "Cung Pha-ra-ô – Bảy Bò, Bảy Bông Lúa", titleEn: "Pharaoh's Dream", scripture: "St 41, 1-36", genreVi: "Trí nhớ & sắp lịch 7 + 7 năm", genreEn: "Memory & the 7 + 7 year calendar", fruitVi: "Khiêm nhường: tài năng là quà của Thiên Chúa.", fruitEn: "Be humble: every talent is a gift from God." },
  { key: "stage_09_te_tuong_kho_lua", index: 8, intro: "9", color: "#06b6d4", titleVi: "Từ Ngục Tù Đến Tể Tướng", titleEn: "From Prison to Governor", scripture: "St 41, 37-52", genreVi: "Xây kho lúa & thu lúa 7 năm", genreEn: "Build granaries & gather 7 years of grain", fruitVi: "Khôn ngoan chuẩn bị, dùng quyền để phục vụ.", fruitEn: "Prepare wisely and use power to serve." },
  { key: "stage_10_nan_doi_cac_anh_tro_lai", index: 9, intro: "10", color: "#14b8a6", titleVi: "Nạn Đói & Các Anh Trở Lại", titleEn: "The Famine & the Brothers' Return", scripture: "St 41, 53 – 42, 38", genreVi: "Phát lúa công bằng", genreEn: "Fair grain distribution", fruitVi: "Chia sẻ với người nghèo. \"Hãy đến với ông Giuse\" nhắc ta đến với Chúa Giê-su, Bánh Hằng Sống.", fruitEn: "Share with the poor. \"Go to Joseph\" reminds us to go to Jesus, the Bread of Life." },
  { key: "stage_11_chen_bac_giuda", index: 10, intro: "11", color: "#22c55e", titleVi: "Chén Bạc & Lời Xin Của Giu-đa", titleEn: "The Silver Cup & Judah's Plea", scripture: "St 43 – 44", genreVi: "Tìm chén bạc & chọn theo lương tâm", genreEn: "Find the cup & choose by conscience", fruitVi: "Hối cải là dám nhận lỗi và hy sinh vì anh em.", fruitEn: "Repentance means owning your fault and sacrificing for your brothers." },
  { key: "stage_12_gosen_tha_thu", index: 11, intro: "12", color: "#fcd34d", titleVi: "Gô-sen – Tôi Là Giuse, Em Các Anh", titleEn: "Goshen – \"I Am Joseph, Your Brother\"", scripture: "St 45; 46; 50, 15-21", genreVi: "Rước đoàn xe & trao quà đoàn tụ", genreEn: "Lead the wagons & give gifts at the reunion", fruitVi: "Tha thứ là cách giống Chúa nhất: Thiên Chúa biến điều ác thành điều tốt.", fruitEn: "Forgiveness is the most God-like act: God turns evil into good." },
];

export const RAY_COUNT = JOSEPH_STAGES.length;

/** Stage key -> Phaser scene key. Only built stages appear here; add one line per stage. */
export const STAGE_SCENES: Partial<Record<JosephStageKey, string>> = {
  prologue_chiec_ao_ban_do: "PrologueScene",
  stage_01_giac_mo_bo_lua: "Stage01DreamSheavesScene",
  stage_02_duong_den_dothan: "Stage02RoadToDothanScene",
  stage_03_gieng_can_dothan: "Stage03DryWellScene",
  stage_04_doan_lai_buon_sa_mac: "Stage04DesertCaravanScene",
  stage_05_nha_putiphac: "Stage05PotipharHouseScene",
  stage_06_hanh_lang_cua_mo: "Stage06OpenDoorScene",
  stage_07_trong_nguc: "Stage07PrisonDreamsScene",
  stage_08_cung_pharao_bay_bo: "Stage08PharaohDreamScene",
  stage_09_te_tuong_kho_lua: "Stage09GranariesScene",
  stage_10_nan_doi_cac_anh_tro_lai: "Stage10FamineScene",
  stage_11_chen_bac_giuda: "Stage11SilverCupScene",
  stage_12_gosen_tha_thu: "Stage12GoshenScene",
  epilogue_giuse_va_chua_gie_su: "EpilogueScene",
};

/** Scene of the next built stage after `key`, or undefined when none is built yet. */
export function nextSceneAfter(key: string): string | undefined {
  const i = (JOSEPH_STAGE_KEYS as readonly string[]).indexOf(key);
  return JOSEPH_STAGE_KEYS.slice(i + 1).map((k) => STAGE_SCENES[k]).find(Boolean);
}

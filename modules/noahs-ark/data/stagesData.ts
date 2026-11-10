import { NOAH_STAGE_KEYS, type NoahStageKey } from "@/modules/noahs-ark/types/game";

export interface NoahStageInfo {
  key: NoahStageKey;
  index: number; // 0..7 = Ấn Dấu số (index + 1)
  titleVi: string;
  titleEn: string;
  scripture: string;
  genreVi: string;
  genreEn: string;
  fruitVi: string;
  fruitEn: string;
  color: string; // seal colour on the Hải Đồ (7 rainbow colours + gold)
}

// ponytail: HUD metadata only; theme-verse text + intro art ids land with each stage scene.
export const NOAH_STAGES: NoahStageInfo[] = [
  { key: "stage_01_nguoi_cong_chinh", index: 0, color: "#dc2626", titleVi: "Người Công Chính Giữa Thế Gian", titleEn: "The Righteous Man", scripture: "St 6, 5-13", genreVi: "Giữ đèn công chính vượt bóng tối", genreEn: "Lantern purity & stealth", fruitVi: "Dù người khác làm điều xấu, người con ngoan của Chúa vẫn kiên tâm chọn điều tốt và sống ngay thật.", fruitEn: "Even when others do wrong, God's children keep choosing good and live honestly." },
  { key: "stage_02_ban_ve_go_bach", index: 1, color: "#f97316", titleVi: "Bản Vẽ Gỗ Bách & Nhựa Thông", titleEn: "Cypress Blueprint & Pitch", scripture: "St 6, 14-16", genreVi: "Đẩy kiện gỗ & ghép khung tàu", genreEn: "Blueprint Sokoban & crafting", fruitVi: "Vâng lời và kiên trì: ông Nô-ê làm đúng lời Chúa dạy suốt nhiều năm, dù trời chưa có một giọt mưa.", fruitEn: "Obedience and perseverance: Noah followed God's word for years, before a single drop fell." },
  { key: "stage_03_muon_thu_len_tau", index: 2, color: "#fbbf24", titleVi: "Muôn Thú Từng Đôi Lên Tàu", titleEn: "The Animals Board in Pairs", scripture: "St 6, 19-22; 7, 1-9", genreVi: "Ghép đôi & phân luồng muôn thú", genreEn: "Pair matching & routing", fruitVi: "Thiên Chúa thương yêu và lo liệu cho từng sinh vật nhỏ bé; trong nhà Chúa, mọi loài đều có chỗ.", fruitEn: "God cares for every little creature; in His house all have a place." },
  { key: "stage_04_dong_cua_mua_lu", index: 3, color: "#22c55e", titleVi: "Cánh Cửa Đóng Lại & Bốn Mươi Đêm Mưa", titleEn: "The Door Closes & Forty Nights of Rain", scripture: "St 7, 10-16", genreVi: "Chạy bịt khe rò theo thời gian", genreEn: "Hull sealing under time pressure", fruitVi: "Khi đã làm hết sức theo lời Chúa dạy, chính Chúa sẽ che chở ta trước mọi bão giông.", fruitEn: "When we have done our best by God's word, He Himself shelters us from every storm." },
  { key: "stage_05_lenh_denh_bien_nuoc", index: 4, color: "#3b82f6", titleVi: "Lênh Đênh Trên Biển Nước Mênh Mông", titleEn: "Adrift on the Endless Waters", scripture: "St 7, 17-24", genreVi: "Giữ thăng bằng tàu & chăm sóc thú", genreEn: "Ark balance & caretaking", fruitVi: "Kiên nhẫn, yêu thương chăm sóc nhau và giữ bình an trong lòng khi hoàn cảnh khó khăn.", fruitEn: "Patience, caring for one another and inner peace when times are hard." },
  { key: "stage_06_dinh_nui_ararat", index: 5, color: "#4338ca", titleVi: "Ngọn Gió Của Chúa & Đỉnh Núi A-ra-rát", titleEn: "God's Wind & Mount Ararat", scripture: "St 8, 1-5", genreVi: "Đón gió lái tàu tránh đá ngầm", genreEn: "Current sailing & reef avoidance", fruitVi: "“Thiên Chúa nhớ đến ông Nô-ê”: Chúa không bao giờ quên ta; sau cơn mưa trời lại sáng.", fruitEn: "“God remembered Noah”: He never forgets us; after the rain the sky clears." },
  { key: "stage_07_nhanh_la_oliu", index: 6, color: "#7c3aed", titleVi: "Cánh Quạ & Chim Bồ Câu Ngậm Nhành Ô-liu", titleEn: "The Raven & the Dove with the Olive Branch", scripture: "St 8, 6-12", genreVi: "Điều khiển chim bay tìm nhành ô-liu", genreEn: "3-phase flight scouting", fruitVi: "Bồ câu ngậm nhành ô-liu là biểu tượng Chúa Thánh Thần và Bình An; hãy là sứ giả của lời nói hiền hòa.", fruitEn: "The dove with the olive branch is the sign of the Holy Spirit and peace; be a messenger of gentle words." },
  { key: "stage_08_cau_vong_giao_uoc", index: 7, color: "#fcd34d", titleVi: "Bàn Thờ Tạ Ơn & Cầu Vồng Giao Ước", titleEn: "Altar of Thanks & the Rainbow Covenant", scripture: "St 8, 15 – 9, 17", genreVi: "Dựng bàn thờ & hội tụ 7 sắc cầu vồng", genreEn: "Altar building & 7-colour prism finale", fruitVi: "Biết ơn: được Chúa giúp thì thưa “Con cảm ơn Chúa!”; thấy cầu vồng hãy nhớ tình yêu trung tín của Chúa.", fruitEn: "Gratitude: when God helps, say “Thank You, Lord!”; seeing a rainbow, remember His faithful love." },
];

export const SEAL_COUNT = NOAH_STAGES.length;

/** Stage key -> Phaser scene key. Only built stages appear here; add one line per stage. */
export const STAGE_SCENES: Partial<Record<NoahStageKey, string>> = {
  prologue_canh_chim_va_con_tau: "PrologueScene",
  stage_01_nguoi_cong_chinh: "Stage01RighteousScene",
  stage_02_ban_ve_go_bach: "Stage02BlueprintScene",
  stage_03_muon_thu_len_tau: "Stage03AnimalPairsScene",
  stage_04_dong_cua_mua_lu: "Stage04FloodScene",
  stage_05_lenh_denh_bien_nuoc: "Stage05ArkVoyageScene",
  stage_06_dinh_nui_ararat: "Stage06AraratWindScene",
  stage_07_nhanh_la_oliu: "Stage07OliveDoveScene",
  stage_08_cau_vong_giao_uoc: "Stage08RainbowCovenantScene",
  epilogue_con_tau_hoi_thanh: "EpilogueScene",
};

/** Scene of the next built stage after `key`, or undefined when none is built yet. */
export function nextSceneAfter(key: string): string | undefined {
  const i = (NOAH_STAGE_KEYS as readonly string[]).indexOf(key);
  return NOAH_STAGE_KEYS.slice(i + 1).map((k) => STAGE_SCENES[k]).find(Boolean);
}

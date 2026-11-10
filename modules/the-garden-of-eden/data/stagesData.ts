import { GENESIS_STAGE_KEYS, type GenesisStageKey } from "@/modules/the-garden-of-eden/types/game";

export interface GenesisStageInfo {
  key: GenesisStageKey;
  index: number; // 0..11 = Ấn Dấu số (index + 1)
  titleVi: string;
  titleEn: string;
  scripture: string;
  genreVi: string;
  genreEn: string;
  fruitVi: string;
  fruitEn: string;
}

// ponytail: Phase 1 holds HUD metadata only; theme-verse text + intro art ids land with each stage scene.
export const GENESIS_STAGES: GenesisStageInfo[] = [
  { key: "stage_01_anh_sang", index: 0, titleVi: "Ngày Thứ Nhất – Ánh Sáng & Bóng Tối", titleEn: "Day One – Light & Darkness", scripture: "St 1, 3-5", genreVi: "Giải đố lăng kính ánh sáng", genreEn: "Light-beam prism puzzle", fruitVi: "Chúa là Ánh Sáng thật; đi trong ánh sáng của Chúa để tránh xa bóng tối tội lỗi.", fruitEn: "God is the true Light; walk in His light and keep away from the darkness of sin." },
  { key: "stage_02_vom_troi", index: 1, titleVi: "Ngày Thứ Hai – Vòm Trời & Làn Nước", titleEn: "Day Two – Sky & Waters", scripture: "St 1, 6-8", genreVi: "Né sóng & đẩy mây bằng gió", genreEn: "Wave dodge & wind push", fruitVi: "Cảm tạ Chúa đã ban không khí cho muôn loài hít thở mỗi giây phút.", fruitEn: "Thank God for the air every creature breathes at every moment." },
  { key: "stage_03_dat_lien_thao_moc", index: 2, titleVi: "Ngày Thứ Ba – Đất Liền, Biển Cả & Thảo Mộc", titleEn: "Day Three – Land, Sea & Plants", scripture: "St 1, 9-13", genreVi: "Giải đố lộ trình một nét", genreEn: "One-stroke terraforming puzzle", fruitVi: "Yêu quý thiên nhiên, bảo vệ cây cối và biết ơn Chúa qua từng hạt gạo, trái cây.", fruitEn: "Love nature, protect plants and thank God for every grain and fruit." },
  { key: "stage_04_mat_troi_tinh_tu", index: 3, titleVi: "Ngày Thứ Tư – Mặt Trời, Mặt Trăng & Tinh Tú", titleEn: "Day Four – Sun, Moon & Stars", scripture: "St 1, 14-19", genreVi: "Đối xứng sao & căn nhịp quỹ đạo", genreEn: "Star symmetry & orbit timing", fruitVi: "Biết quý trọng thời gian Chúa ban; sống có giờ giấc, kỷ luật.", fruitEn: "Treasure the time God gives; live with order and discipline." },
  { key: "stage_05_ca_bien_chim_troi", index: 4, titleVi: "Ngày Thứ Năm – Cá Biển & Chim Trời", titleEn: "Day Five – Fish & Birds", scripture: "St 1, 20-23", genreVi: "Dẫn đàn & định hướng gió", genreEn: "Flock herding & wind routing", fruitVi: "Ngợi khen sự phong phú của muôn vật; không hành hạ hay phá tổ chim, sinh vật nhỏ bé.", fruitEn: "Praise the richness of life; never harm birds' nests or small creatures." },
  { key: "stage_06_muon_thu_con_nguoi", index: 5, titleVi: "Ngày Thứ Sáu – Muôn Thú & Hình Ảnh Thiên Chúa", titleEn: "Day Six – Animals & God's Image", scripture: "St 1, 24-31; 2, 7", genreVi: "Trí nhớ & căn nhịp chế tác", genreEn: "Memory recipe & timing craft", fruitVi: "Mỗi người đều quý giá vì được dựng nên theo hình ảnh Thiên Chúa.", fruitEn: "Every person is precious, made in the image of God." },
  { key: "stage_07_ngay_nghi_ngoi", index: 6, titleVi: "Ngày Thứ Bảy – Ngày Nghỉ Ngơi Thánh Thiêng", titleEn: "Day Seven – The Holy Rest", scripture: "St 2, 1-3", genreVi: "Âm nhạc Simon-Says", genreEn: "Musical Simon-Says", fruitVi: "Giữ ngày Chúa Nhật thánh thiện; đi lễ, nghỉ ngơi bên gia đình và tạ ơn Chúa.", fruitEn: "Keep Sunday holy: attend Mass, rest with family and give thanks." },
  { key: "stage_08_bon_dong_song", index: 7, titleVi: "Bốn Dòng Sông Ê-đen & Đặt Tên Muôn Loài", titleEn: "Four Rivers of Eden & Naming the Animals", scripture: "St 2, 8-20", genreVi: "Điều tiết đập nước & quan sát thú", genreEn: "Water-sluice logic & observation", fruitVi: "Con người được trao quyền quản lý và chăm sóc công trình tạo dựng, không phải tàn phá.", fruitEn: "We are entrusted to care for creation, not destroy it." },
  { key: "stage_09_tao_dung_eva", index: 8, titleVi: "Tạo Dựng E-va & Sự Hiệp Thông", titleEn: "Eve's Creation & Communion", scripture: "St 2, 18.21-25", genreVi: "Giải đố hai nhân vật phối hợp", genreEn: "Dual-character co-op puzzle", fruitVi: "Yêu thương, đoàn kết và nâng đỡ lẫn nhau trong gia đình và tình bạn.", fruitEn: "Love, unity and mutual support in family and friendship." },
  { key: "stage_10_con_ran_trai_cam", index: 9, titleVi: "Con Rắn Xảo Quyệt & Trái Cấm", titleEn: "The Cunning Serpent & the Forbidden Fruit", scripture: "St 2, 16-17; 3, 1-7", genreVi: "Chắn khói & phản biện Lời Chúa", genreEn: "Shield defense & Scripture debate", fruitVi: "Cám dỗ bắt đầu bằng nghi ngờ tình yêu của Chúa; hãy tỉnh thức và vâng giữ Lời Chúa.", fruitEn: "Temptation begins with doubting God's love; stay watchful and obey His Word." },
  { key: "stage_11_tron_chay_trong_vuon", index: 10, titleVi: "Trốn Chạy Trong Vườn & Tiếng Chúa Gọi", titleEn: "Hiding in the Garden & God's Call", scripture: "St 3, 8-13", genreVi: "Mê cung tầm nhìn Stealth", genreEn: "Stealth line-of-sight maze", fruitVi: "Khi lỡ phạm lỗi, đừng trốn tránh hay đổ thừa; hãy can đảm thưa thật với Chúa.", fruitEn: "When you fail, don't hide or blame; bravely tell the truth to God." },
  { key: "stage_12_loi_hua_cuu_do", index: 11, titleVi: "Rời Vườn Địa Đàng & Lời Hứa Cứu Độ", titleEn: "Leaving Eden & the Promise of Salvation", scripture: "St 3, 14-24", genreVi: "Hộ tống bằng ngọn đuốc", genreEn: "Torch-bearer escort", fruitVi: "Lòng thương xót của Thiên Chúa lớn hơn tội lỗi; Chúa đã hứa và sai Chúa Giêsu cùng Mẹ Maria đến cứu chuộc.", fruitEn: "God's mercy is greater than sin; He promised and sent Jesus and Mary to save us." },
];

export const SEAL_COUNT = GENESIS_STAGES.length;

/** Stage key -> Phaser scene key. Only built stages appear here; add one line per stage. */
export const STAGE_SCENES: Partial<Record<GenesisStageKey, string>> = {
  prologue_trang_sach_dau: "PrologueScene",
  stage_01_anh_sang: "Stage01LightScene",
  stage_02_vom_troi: "Stage02SkyScene",
  stage_03_dat_lien_thao_moc: "Stage03LandScene",
  stage_04_mat_troi_tinh_tu: "Stage04StarsScene",
  stage_05_ca_bien_chim_troi: "Stage05SeaBirdsScene",
  stage_06_muon_thu_con_nguoi: "Stage06AnimalsManScene",
  stage_07_ngay_nghi_ngoi: "Stage07SabbathScene",
  stage_08_bon_dong_song: "Stage08EdenRiversScene",
  stage_09_tao_dung_eva: "Stage09EveCoopScene",
  stage_10_con_ran_trai_cam: "Stage10SerpentScene",
  stage_11_tron_chay_trong_vuon: "Stage11HidingScene",
  stage_12_loi_hua_cuu_do: "Stage12PromiseScene",
  epilogue_khu_vuon_tam_hon: "EpilogueScene",
};

/** Scene of the next built stage after `key`, or undefined when none is built yet. */
export function nextSceneAfter(key: string): string | undefined {
  const i = (GENESIS_STAGE_KEYS as readonly string[]).indexOf(key);
  return GENESIS_STAGE_KEYS.slice(i + 1).map((k) => STAGE_SCENES[k]).find(Boolean);
}

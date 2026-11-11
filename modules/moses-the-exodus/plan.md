# KẾ HOẠCH DỰ ÁN: MOSES – THE EXODUS (MÔI-SÊ & HÀNH TRÌNH XUẤT HÀNH)

## 1. TỔNG QUAN DỰ ÁN
* **Tên Module:** `modules/moses-the-exodus` (Route: `/moses-the-exodus`).
* **Thể loại:** 2D Top-Down Retro Multi-Genre Puzzle & Action RPG (Pixel Art 8-bit vẽ bằng code theo chuẩn lưới `pixelArt.ts`).
* **Mục tiêu:** Giúp thiếu nhi và người chơi tìm hiểu Sách Xuất Hành (`Xh 1–20; 32–40`) – từ chiếc thúng cói trên sông Nin, lựa chọn của hoàng tử bên công trường nô lệ, giếng nước Ma-đi-an, Bụi Cây Bốc Cháy trên núi Khô-rép, Mười Tai Ương Ai Cập, Đêm Lễ Vượt Qua, phép lạ Rẽ Nước Biển Đỏ, Bánh Mân-na trong hoang địa đến Mười Điều Răn trên đỉnh Xi-nai và Nhà Tạm Giao Ước – qua **13 màn chơi chính** (+ Prologue & Epilogue) với **13 thể loại gameplay khác nhau**.
* **Điểm nhấn thiết kế:**
  1. **🖼️ Màn Hình Minh Họa Tĩnh Mở Màn (`StageIntroIllustration`):** Khi bắt đầu mỗi màn chơi và mở hộp thoại dẫn nhập (Intro Dialogue), vùng màn hình hiển thị một **bức tranh minh họa tĩnh toàn cảnh (Storybook Illustration)** được nạp trực tiếp từ thư mục ảnh dựng sẵn `modules/moses-the-exodus/images/intro-*.png`. Sau khi kết thúc hội thoại mở màn, màn hình chuyển cảnh mượt mà (Fade / Pixel Wipe) vào bản đồ Top-down.
  2. **🎮 Đa thể loại (Multi-Genre) & Cơ chế Checkpoint (Soft Reset):** Mỗi Stage sở hữu một luật chơi riêng (điều tiết dòng chảy sông Nin đưa thúng cói, lén lút giải cứu công trường nô lệ & bảo vệ giếng nước Ma-đi-an, bước trên đất thánh & thực hành 3 dấu lạ, đấu phép quyền năng trước Pha-ra-ô, giữ đèn sáng đất Gô-sen giữa bóng tối dày đặc, chuẩn bị Lễ Vượt Qua & bôi máu chiên lên khung cửa, giương gậy rẽ nước Biển Đỏ & chặn chiến xa, gõ trống cơm theo nhịp & làm ngọt nước Ma-ra, thu hoạch Mân-na theo khẩu phần ngày thường/Sa-bát, đập đá Khô-rép & nâng tay Môi-sê cầu nguyện trên đồi, vượt sấm chớp lên đỉnh Xi-nai đón Hai Bia Đá Mười Điều Răn, đập tan tượng bê vàng & chuyển cầu, lắp ráp Nhà Tạm Giao Ước). Đi sai bước hoặc chạm chướng ngại sẽ lùi về Checkpoint gần nhất.
  3. **🎬 Chuỗi Hoạt Cảnh Kể Chuyện Liền Mạch (Narrative Storyline Bridges):** Giữa các giai đoạn lịch sử luôn có các đoạn cutscene kể chuyện sâu sắc, giải thích tâm lý nhân vật, nguồn gốc mâu thuẫn hoàng gia và sự chuyển biến đức tin của Môi-sê từ một hoàng tử kiêu hãnh sang người mục tử khiêm nhu nhất trần gian.
* **Kịch bản chi tiết:** Đồng bộ tuyệt đối theo tài liệu [`scripts.md`](./scripts.md).

---

## 2. KIẾN TRÚC KỸ THUẬT & TÁI SỬ DỤNG (`modules/shared`)
* **Tái sử dụng từ `modules/shared/`:**
  * `CharacterCreationModal`, `CharacterPreview`, `DialogueBox`, `VirtualController`, `DesktopControlHint`.
  * `EventBus`, `AudioManager`, `Player`, `pixelArt` (`PAL`, `drawMap`, `rect`, `glowCanvas`, `addSpriteSheet`), `playerTextureGenerator`.
* **Thành phần riêng trong `modules/moses-the-exodus/`:**
  ```text
  modules/moses-the-exodus/
    MosesTheExodus.tsx              # Client root component được mount bởi app/moses-the-exodus/page.tsx
    scripts.md                      # Kịch bản chi tiết & thiết kế gameplay 13 stages + Prologue/Epilogue
    plan.md                         # Lộ trình phát triển (file này)
    image-prompts.md                # Danh sách prompt ảnh minh họa mở màn
    images/                         # Thư mục ảnh tĩnh minh họa mở màn (intro-start.png, intro-1..13.png, intro-end.png)
    components/
      GameContainer.tsx             # Wrapper mount Phaser canvas
      ExodusHUD.tsx                 # HUD Hai Bia Đá Giao Ước (13 Ấn Dấu Xuất Hành & Mười Điều Răn + Nút Reset Checkpoint)
      SaveLoadModal.tsx             # Lưu/Tải tiến trình & Export/Import JSON
    data/
      stagesData.ts                 # Dữ liệu 13 Stages + Prologue/Epilogue (Lời Chúa, Hoa trái, Nhiệm vụ, Đường dẫn ảnh intro)
      dialogues.ts                  # Lời thoại song ngữ VI / EN
    types/
      game.ts                       # SaveData, StageKey, StageProgress, GenreState
    utils/
      saveManager.ts                # Quản lý localStorage (key riêng: "moses_the_exodus_save_v1")
    game/
      config.ts                     # Phaser Game Config (`pixelArt: true`, `roundPixels: true`)
      scenes/
        BootScene.ts
        PreloadScene.ts             # Preload tất cả ảnh minh họa tĩnh từ thư mục images/
        BaseExodusScene.ts          # Base scene: hiển thị ảnh tĩnh mở màn overlay, Checkpoint reset, Co-op/Stamina hooks
        stages/                     # PrologueScene + Stage01..Stage13 + EpilogueScene
      utils/
        exodusTextures.ts           # NPC (Môi-sê, A-ha-rôn, Mi-ri-am, Giu-suê, Pha-ra-ô), Bụi Cây Cháy, Cột Mây/Lửa, Hòm Bia, Chân Đèn 7 Ngọn
  ```

---

## 3. SCHEMA DỮ LIỆU LƯU GAME (`SaveData`)
```typescript
import type { CharacterCustomization } from "@/modules/shared/types";

export type ExodusStageKey =
  | "prologue_cay_gay_nguoi_muc_tu"
  | "stage_01_thung_coi_song_nin"
  | "stage_02_hoang_tu_va_gieng_nuoc_madian"
  | "stage_03_bui_cay_boc_chay"
  | "stage_04_doi_dien_pharao"
  | "stage_05_anh_sang_dat_gosen"
  | "stage_06_dem_le_vuot_qua"
  | "stage_07_re_nuoc_bien_do"
  | "stage_08_khuc_ca_nuoc_mara"
  | "stage_09_banh_manna_tu_troi"
  | "stage_10_dap_da_va_doi_tay"
  | "stage_11_muoi_dieu_ran_xinai"
  | "stage_12_be_vang_chuyen_cau"
  | "stage_13_nha_tam_giao_uoc"
  | "epilogue_vuot_qua_moi";

export interface ExodusSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: ExodusStageKey;
  currentStageIndex: number; // 0 đến 12 (13 Ấn Dấu Xuất Hành chính)
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: {
    [key in ExodusStageKey]?: {
      completed: boolean;
      tabletLit: boolean;       // Ấn Dấu Xuất Hành / Bia Đá đã khắc sáng
      bestAttempts?: number;    // Số lần thử / hoàn thành
    };
  };
}
```

---

## 4. LỘ TRÌNH THỰC HIỆN TỪNG BƯỚC (ROADMAP)

### Giai đoạn 1: Khởi tạo Module, Route & Hệ thống Lưu trữ (Foundation)
* [x] Tạo route `app/moses-the-exodus/page.tsx` và thêm thẻ game **Moses – The Exodus** (kèm ảnh bìa pixel `/games/moses-the-exodus.png`) vào trang chủ `app/page.tsx`.
* [x] Xây dựng `types/game.ts`, `data/stagesData.ts` (song ngữ VI/EN, nạp đường dẫn ảnh tĩnh mở màn) và `utils/saveManager.ts` (lưu độc lập tại key `moses_the_exodus_save_v1`).
* [x] Dựng `MosesTheExodus.tsx`, `GameContainer.tsx`, `ExodusHUD.tsx` (hiển thị **Hai Bia Đá Giao Ước & 13 Ấn Dấu Xuất Hành**, nút xem Suy Niệm Xuất Hành & Mười Điều Răn, và nút **Thử lại Checkpoint** nhanh).
  * Ghi chú: `SaveLoadModal.tsx` (export/import JSON) chưa làm — các game khác cũng chưa có; lưu tự động qua `saveManager.ts`.
  * Ghi chú: ảnh mở màn được phục vụ từ `public/games/moses-the-exodus/intro/<id>.png` (`start`, `1`–`13`, `end`), sao chép từ `images/`; ảnh bìa trang chủ tạm dùng `intro-start.png`.

### Giai đoạn 2: Base Scene & Cơ chế Lõi
* [x] Xây dựng `BaseExodusScene.ts`:
  * [x] Chế độ **Intro Storybook Illustration Overlay**: Khi vào màn, hiển thị ảnh minh họa tĩnh toàn cảnh nạp từ `images/intro-*.png` có viền khung trang trọng trong suốt lúc hộp thoại dẫn nhập đang mở; khi đóng hộp thoại dẫn nhập thì thực hiện hiệu ứng chuyển cảnh (Fade / Pixel Wipe) mở ra bản đồ Top-down.
  * [x] Hệ thống **Checkpoint / Soft Reset**: API `this.saveCheckpoint(id, state)` và `this.resetToCheckpoint()` kèm hiệu ứng lóe sáng nhẹ + âm báo khích lệ khi người chơi cần thử lại.
  * [x] Hỗ trợ **Grace Pips (3 Giọt Bình An)** và cơ chế **Cây Gậy Môi-sê (`[A]`)** đa năng theo từng màn chơi (hook `useStaff()` + hiệu ứng `swingStaff()`).
* [x] Xây dựng `exodusTextures.ts`: Sprite Môi-sê (lúc bé trong thúng cói, lúc hoàng tử Ai Cập, lúc chăn chiên ở Ma-đi-an, và lúc cầm gậy lãnh đạo dân), chị Mi-ri-am cầm trống cơm, anh A-ha-rôn, dũng tướng Giu-suê, Công chúa Ai Cập, vua Pha-ra-ô, chiến xa Ai Cập, Bụi Cây Bốc Cháy, Cột Mây – Cột Lửa, Chiên Vượt Qua, Bánh Mân-na, Hai Bia Đá, Hòm Bia Giao Ước và Chân Đèn 7 Ngọn đúng chuẩn lưới chibi 32×32 / 16px tile grid.

### Giai đoạn 3: Khúc Dạo Đầu (Prologue)
* [x] **Màn Mở Đầu (`PrologueScene`):** *Bản Đồ Sa Mạc & Cây Gậy Người Mục Tử (`Xh 3, 10-12`)* ([Chi tiết](./scripts.md#màn-mở-đầu-bản-đồ-sa-mạc--cây-gậy-người-mục-tử-xh-3-10-12))
  * [x] 🖼️ Ảnh mở màn: `intro-start.png` (Đôi bàn tay mở sách Xuất Hành bên ngọn đèn bàn, hiện lên bóng hình Cột Lửa dẫn đường giữa sa mạc đêm và Cây Gậy Môi-sê rực sáng).
  * [x] Bản đồ & Gameplay: Phòng nhỏ buổi tối ấm áp, thắp ngọn đèn bàn học, ghép 3 mảnh bản đồ cổ (*Ai Cập $\rightarrow$ Biển Đỏ $\rightarrow$ Núi Xi-nai*) và nhận **Hai Bia Đá Hành Trình (0/13 Ấn Dấu)**.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `lullaby` (Music-box lullaby 70 BPM, C major) — không khí ấm áp, tĩnh lặng bên bàn học.
    * **Âm nền (Ambience):** `["wind", "crickets"]` — gió đêm sa mạc & tiếng dế êm đềm ngoài hiên.
    * **Mặt sàn (Surface):** `wood` (sàn gỗ căn phòng).
    * **Hiệu ứng (SFX):** `pickup` (nhặt mảnh bản đồ), `chime` (ghép đúng mảnh), `bless` (thắp sáng đèn học & nhận Hai Bia Đá).

### Giai đoạn 4: Phần 1 – Tiếng Kêu Thấu Trời & Cuộc Giải Thoát Khỏi Ai Cập (`Stages 1–7`)
* [x] **Stage 1 (`Stage01NileBasketScene`):** *Chiếc Thúng Cói Trên Sông Nin (`Xh 1, 22 – 2, 10`)* ([Chi tiết](./scripts.md#stage-1-chiếc-thúng-cói-trên-sông-nin-xh-1-22--2-10))
  * [x] 🖼️ Ảnh mở màn: `intro-1.png` (Bờ sông Nin rợp bóng sậy xanh; chiếc thúng cói chở bé Môi-sê trôi về phía Công chúa Pha-ra-ô).
  * [x] Gameplay (**River Current Routing & Stealth Escort**): Cùng chị Mi-ri-am chạy dọc bờ sậy gạt lá sen/cửa nước điều hướng thúng cói tránh cá sấu, xoáy nước và lính tuần tra.
  * [x] 🎬 Cutscene chuyển tiếp: Môi-sê lớn lên trong hoàng cung Ai Cập bên cạnh thái tử.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `nile` (Papyrus Basket on the Nile 80 BPM, D minor / F major) — giai điệu sông Nin hiền hòa, êm dịu che chở chiếc thúng cói.
    * **Âm nền (Ambience):** `["wind", "birds"]` — gió bờ sông & tiếng chim nước ríu rít bên rặng sậy.
    * **Mặt sàn (Surface):** `grass` (đường mòn cỏ mềm ven sông).
    * **Hiệu ứng (SFX):** `splash` (nước vỗ nhẹ & rẽ nhánh sậy), `pickup` (gạt lá sen/cửa nước), `chime` (thúng trôi đúng luồng), `wrong` (gặp chướng ngại/xoáy nước).
* [x] **Stage 2 (`Stage02PrinceChoiceScene`):** *Lựa Chọn Của Hoàng Tử & Giếng Nước Ma-đi-an (`Xh 2, 11-25`)* ([Chi tiết](./scripts.md#stage-2-lựa-chọn-của-hoàng-tử--giếng-nước-ma-đi-an-xh-2-11-25-cv-7-22-29-dt-11-24-27))
  * [x] 🖼️ Ảnh mở màn: `intro-2.png` (Hoàng tử Môi-sê can thiệp cứu người nô lệ bên công trường Ai Cập & giếng nước Ma-đi-an thanh bình).
  * [x] Gameplay (**Stealth Rescue & Well Defense**): Lén tiếp tế nước cho nô lệ, can thiệp cứu đồng bào; trốn thoát lệnh truy nã hoàng gia; và đẩy lùi đám mục đồng giúp 7 người con gái ông Giê-trô.
  * [x] 🎬 Cutscene chuyển tiếp then chốt (**40 Năm Trong Thung Lũng Khiêm Nhường**): Môi-sê sống 40 năm bình dị làm mục tử chăn chiên chốn hoang vu; tiếng rên xiết của dân nô lệ thấu tới trời cao.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `crafting` (Ark Carpentry & Midian Well Defense 108 BPM, G major) — nhịp điệu cần mẫn, quả cảm, dứt khoát giải cứu đồng bào.
    * **Âm nền (Ambience):** `["wind"]` — gió sa mạc khô rát thổi qua công trường gạch đá.
    * **Mặt sàn (Surface):** `sand` (bãi cát hoang địa & công trường).
    * **Hiệu ứng (SFX):** `staff` (dùng gậy xua đuổi đám mục đồng quấy rối), `pickup` (tiếp tế bình nước), `chime` (cứu người thành công), `door` (cổng thành trốn thoát).
* [x] **Stage 3 (`Stage03BurningBushScene`):** *Bụi Cây Bốc Cháy Trên Núi Khô-rép (`Xh 3, 1 – 4, 17`)* ([Chi tiết](./scripts.md#stage-3-bụi-cây-bốc-cháy-trên-núi-khô-rép-xh-3-1--4-17))
  * [x] 🖼️ Ảnh mở màn: `intro-3.png` (Bụi gai rực lửa thánh thiêng trên sườn núi Khô-rép; Môi-sê cởi dép quỳ trước Đấng *"TA LÀ ĐẤNG HẰNG HỮU"*).
  * [x] Gameplay (**Sacred Ground Puzzle & 3 Staff Signs**): Cởi dép bước trên đất thánh và thực hành 3 dấu lạ Chúa trao.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sabbath` (Holy Ground & Sacred Rest 64 BPM, G major) — thánh thiêng, tĩnh lặng sâu thẳm trước nhan Thiên Chúa.
    * **Âm nền (Ambience):** `["fire", "wind"]` — ngọn lửa thánh bập bùng cháy mãi không tàn & gió núi Khô-rép.
    * **Mặt sàn (Surface):** `sand` (đất thánh sườn núi).
    * **Hiệu ứng (SFX):** `bless` (cởi dép bước trên đất thánh), `staff` (3 dấu lạ gậy hóa rắn, tay phong hủi), `chime` (đón nhận thánh danh Ta Là Đấng Hằng Hữu).
* [x] **Stage 4 (`Stage04PharaohPlaguesScene`):** *Đối Diện Pha-ra-ô & Các Dấu Lạ Cảnh Báo (`Xh 7, 14 – 9, 35`)* ([Chi tiết](./scripts.md#stage-4-đối-diện-pha-ra-ô--các-dấu-lạ-cảnh-báo-xh-7-14--9-35))
  * [x] 🖼️ Ảnh mở màn: `intro-4.png` (Đại điện cung điện Ai Cập; Môi-sê và A-ha-rôn đối diện Pha-ra-ô cứng lòng).
  * [x] Gameplay (**Tactical Staff Channelling & Barrier Break**): Né bẫy ảo thuật và kích hoạt 3 đợt Dấu Lạ phá vỡ Khiên Kiêu Ngạo của Pha-ra-ô.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `serpent` (Serpent & Confrontation at Court 88 BPM, C minor) — căng thẳng, nửa cung bí hiểm, quyền năng Thiên Chúa đối đầu sự cứng lòng của vua Ai Cập.
    * **Âm nền (Ambience):** `["wind", "crowd"]` — đại điện hoàng gia xôn xao trước các dấu lạ.
    * **Mặt sàn (Surface):** `stone` (đá hoa cương cung điện Ai Cập).
    * **Hiệu ứng (SFX):** `staff` (giương gậy quyền năng phá khiên kiêu ngạo), `wrong` (bẫy ảo thuật), `chime` / `bless` (dấu lạ cảnh cáo giáng xuống).
* [x] **Stage 5 (`Stage05GoshenLightScene`):** *Ba Ngày Tối Dày Đặc & Ánh Sáng Đất Gô-sen (`Xh 10, 21-29`)* ([Chi tiết](./scripts.md#stage-5-ba-ngày-tối-dày-đặc--ánh-sáng-đất-gô-sen-xh-10-21-29))
  * [x] 🖼️ Ảnh mở màn: `intro-5.png` (Kinh thành Ai Cập chìm trong bóng tối dày đặc, làng Gô-sen bừng sáng ấm áp).
  * [x] Gameplay (**Light-Network Relay & Darkness Defense**): Mang Lửa Thánh Gô-sen thắp sáng và kết nối mạng lưới 8 Trụ Đèn Gia Đình.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `creation` (Fiat Lux & Light Network Relay 92 BPM, E minor / G major) — lấp lánh, ấm áp, ánh sáng đức tin xua tan màn đêm dày đặc.
    * **Âm nền (Ambience):** `["wind"]` — gió lạnh lùng bóng tối bao trùm Ai Cập.
    * **Mặt sàn (Surface):** `sand` (đường làng đất Gô-sen).
    * **Hiệu ứng (SFX):** `pickup` (lấy Lửa Thánh Gô-sen), `chime` (thắp sáng trụ đèn gia đình), `bless` (8 trụ đèn kết nối mạng lưới ánh sáng), `wrong` (bóng tối chạm trúng / tắt đèn).
* [x] **Stage 6 (`Stage06PassoverNightScene`):** *Đêm Lễ Vượt Qua & Máu Chiên Cứu Độ (`Xh 12, 1-36`)* ([Chi tiết](./scripts.md#stage-6-đêm-lễ-vượt-qua--máu-chiên-cứu-độ-xh-12-1-36))
  * [x] 🖼️ Ảnh mở màn: `intro-6.png` (Đêm trăng tròn; gia đình quây quần bên bàn tiệc Chiên Vượt Qua; máu chiên trên khung cửa tỏa hào quang).
  * [x] Gameplay (**Preparation Crafting & Doorpost Marking**): Chuẩn bị bàn tiệc Vượt Qua và cầm chùm kinh giới bôi máu chiên lên 10 khung cửa nhà dân trước nửa đêm.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sorrowful` (Passover Vigil & Sacrificial Lamb 56 BPM, A minor) — chậm rãi, trang nghiêm, canh thức thánh trong đêm thiên sứ lướt qua.
    * **Âm nền (Ambience):** `["crickets"]` — tiếng dế đêm tĩnh mịch trước giờ Xuất Hành.
    * **Mặt sàn (Surface):** `wood` (sàn gỗ trong nhà gia đình).
    * **Hiệu ứng (SFX):** `pickup` (chuẩn bị bánh không men & nhành kinh giới), `chime` (bôi máu chiên lên khung cửa), `bless` (khung cửa tỏa hào quang che chở), `wrong` (bánh bị ủ men).
* [x] **Stage 7 (`Stage07RedSeaCrossingScene`):** *Cột Mây Cột Lửa & Rẽ Nước Biển Đỏ (`Xh 13, 21 – 14, 31`)* ([Chi tiết](./scripts.md#stage-7-cột-mây-cột-lửa--rẽ-nước-biển-đỏ-xh-13-21--14-31))
  * [x] 🖼️ Ảnh mở màn: `intro-7.png` (Biển Đỏ tách đôi thành hai bức tường nước khổng lồ; Cột Lửa chặn đoàn chiến xa Ai Cập).
  * [x] Gameplay (**Sea-Parting Escort & Pillar-of-Fire Defense**): Kích hoạt gió đông giữ tường nước và điều phối Cột Lửa chặn chiến xa Pha-ra-ô.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `exodus` (The Great Exodus & Parting the Sea 126 BPM, D minor) — dồn dập, hào hùng, bức tường sóng biển rẽ đôi và cuộc giải thoát vĩ đại.
    * **Âm nền (Ambience):** `["wind"]` — ngọn gió đông dữ dội thổi suốt đêm rẽ nước biển.
    * **Mặt sàn (Surface):** `sand` (lòng Biển Đỏ khô cạn).
    * **Hiệu ứng (SFX):** `staff` (giương gậy rẽ sóng biển), `splash` (nước rẽ hai bên), `whoosh` (Cột Mây Cột Lửa ngăn chiến xa), `wrong` (tường nước sụt giảm).

### Giai đoạn 5: Phần 2 – Hành Trình Hoang Địa & Giao Ước Núi Xi-nai (`Stages 8–13`)
* [x] **Stage 8 (`Stage08MiriamMaraScene`):** *Khúc Ca Biển Đỏ & Nước Ngọt Ma-ra (`Xh 15, 1-27`)* ([Chi tiết](./scripts.md#stage-8-khúc-ca-biển-đỏ--nước-ngọt-ma-ra-xh-15-1-27))
  * [x] 🖼️ Ảnh mở màn: `intro-8.png` (Mi-ri-am múa trống cơm bên Biển Đỏ; suối nước Ma-ra hóa ngọt dẫn lối tới ốc đảo Ê-lim).
  * [x] Gameplay (**Tambourine Rhythm & Sweet-Wood Alchemy Puzzle**): Gõ nhịp trống cơm tạ ơn và đặt gỗ thánh thanh lọc hồ nước đắng Ma-ra.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `miriam` (Song of the Sea & Tambourine Dance 116 BPM, D Dorian) — rộn rã, tưng bừng điệu múa trống cơm của Mi-ri-am tạ ơn Chúa.
    * **Âm nền (Ambience):** `["crowd", "birds"]` — tiếng reo hò của toàn dân bên bờ biển & chim chóc ốc đảo.
    * **Mặt sàn (Surface):** `sand` (bãi cát bờ biển & hồ nước Ma-ra).
    * **Hiệu ứng (SFX):** `tambourine` (gõ trống cơm đúng nốt beat), `splash` (thả khúc gỗ làm ngọt nước), `bless` (nước đắng Ma-ra hóa ngọt lành), `wrong` (lỗi nhịp trống / nước bùn ô nhiễm).
* [x] **Stage 9 (`Stage09MannaQuailScene`):** *Bánh Mân-na & Chim Cút Từ Trời (`Xh 16, 1-35`)* ([Chi tiết](./scripts.md#stage-9-bánh-mân-na--chim-cút-từ-trời-xh-16-1-35))
  * [x] 🖼️ Ảnh mở màn: `intro-9.png` (Hạt Mân-na trắng ngần phủ cát hoang địa Xin; các gia đình thu lượm theo định lượng Chúa ban).
  * [x] Gameplay (**Daily Quota Gathering & Sun-Melt Race**): Thu hoạch Mân-na đúng định lượng ô-me từng lều trước khi ánh nắng làm tan chảy.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `wilderness` (Manna from Heaven 90 BPM, F major) — trong trẻo, êm ả như sương mai ban mai, niềm tin tưởng xin lương thực hằng ngày.
    * **Âm nền (Ambience):** `["birds", "wind"]` — gió thoảng sa mạc Xin & tiếng đàn chim cút rợp trời.
    * **Mặt sàn (Surface):** `sand` (cát hoang địa phủ Mân-na).
    * **Hiệu ứng (SFX):** `pickup` (nhặt hạt Mân-na vào thùng), `chime` (đầy khẩu phần ô-me một lều), `wrong` (tham lam thu quá mức hoặc nắng gắt làm tan).
* [x] **Stage 10 (`Stage10RephidimHandsScene`):** *Đập Đá Rê-phi-đim & Đôi Tay Cầu Nguyện Trên Đồi (`Xh 17, 1-16`)* ([Chi tiết](./scripts.md#stage-10-đập-đá-rê-phi-đim--đôi-tay-cầu-nguyện-trên-đồi-xh-17-1-16))
  * [x] 🖼️ Ảnh mở màn: `intro-10.png` (Nước tuôn từ tảng đá Khô-rép; A-ha-rôn và Khua nâng đỡ đôi tay Môi-sê cầu nguyện).
  * [x] Gameplay (**Rock-Strike Timing & Prayer-Hands Support Co-op**): Căn nhịp đập đá mở suối nước và phối hợp đỡ đôi tay Môi-sê giơ cao.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `exodus` (Battle of Rephidim & Striking the Rock 126 BPM, D minor) — kiên cường, dồn dập, sức mạnh của lời cầu nguyện kiên trì và hiệp thông nâng đỡ.
    * **Âm nền (Ambience):** `["wind"]` — gió lộng trên đỉnh đồi Rê-phi-đim.
    * **Mặt sàn (Surface):** `stone` (đỉnh đồi đá Khô-rép).
    * **Hiệu ứng (SFX):** `staff` (gậy đập vào tảng đá Khô-rép), `splash` (dòng suối tuôn trào mát lành), `bless` (A-ha-rôn & Khua nâng đôi tay Môi-sê), `wrong` (đôi tay mỏi hạ xuống).
* [x] **Stage 11 (`Stage11SinaiCommandmentsScene`):** *Mười Điều Răn Trên Đỉnh Xi-nai (`Xh 19, 16 – 20, 21`)* ([Chi tiết](./scripts.md#stage-11-mười-điều-răn-trên-đỉnh-xi-nai-xh-19-16--20-21))
  * [x] 🖼️ Ảnh mở màn: `intro-11.png` (Đỉnh Xi-nai rực lửa thánh; Môi-sê đón nhận Hai Bia Đá Mười Điều Răn).
  * [x] Gameplay (**Mountain Ascent & Ten Commandments Tablet Matching**): Leo núi Xi-nai và sắp xếp đúng thứ tự 10 Điều Răn vào Hai Bia Đá.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sinai` (Mount Sinai & The Ten Tablets 104 BPM, C major) — uy nghi, tráng lệ, kèn tù và vang rền trên đỉnh núi sương khói đón nhận Lời Giao Ước.
    * **Âm nền (Ambience):** `["wind"]` — gió sấm chớp cuồn cuộn trên đỉnh núi thánh.
    * **Mặt sàn (Surface):** `stone` (vách đá dốc đứng núi Xi-nai).
    * **Hiệu ứng (SFX):** `shofar` (kèn sừng cừu trầm hùng triệu tập toàn dân), `pickup` (đón nhận từng giới răn), `chime` (khắc xong một điều răn), `bless` (Hai Bia Đá Mười Điều Răn hoàn tất rực sáng).
* [ ] **Stage 12 (`Stage12GoldenCalfMercyScene`):** *Bi Kịch Bê Vàng & Lời Chuyển Cầu Của Môi-sê (`Xh 32, 1-34`; `34, 1-10`)* ([Chi tiết](./scripts.md#stage-12-bi-kịch-bê-vàng--lời-chuyển-cầu-của-môi-sê-xh-32-1-34-34-1-10))
  * [ ] 🖼️ Ảnh mở màn: `intro-12.png` (Mảnh vỡ tượng bê vàng tan tành; Môi-sê đẽo lại hai bia đá mới và tha thiết cầu bầu).
  * [ ] Gameplay (**Idol Purge & Intercession Path Puzzle**): Dẹp lò khói mê muội bê vàng, đẽo lại 2 Bia Đá mới và cầu bầu xin Chúa thứ tha.
  * [ ] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sorrowful` (Contrition & Intercession for Mercy 56 BPM, A minor) — xót xa trước lỗi lầm, nhưng tha thiết lời cầu bầu tin tưởng vào Lòng Thương Xót vô biên.
    * **Âm nền (Ambience):** `["fire", "wind"]` — tàn tro tượng bê vàng bị tiêu hủy & gió sa mạc ai oán.
    * **Mặt sàn (Surface):** `sand` (chân núi Xi-nai & nơi đóng trại).
    * **Hiệu ứng (SFX):** `staff` (đập tan tượng bê vàng & dẹp lò khói mê muội), `chime` (đẽo lại 2 Bia Đá mới), `bless` (Chúa mạc khải Ta Là Đấng Từ Bi Nhân Hậu).
* [ ] **Stage 13 (`Stage13TabernacleGloryScene`):** *Dựng Nhà Tạm & Vinh Quang Chúa Ngự Xuống (`Xh 35 – 40`)* ([Chi tiết](./scripts.md#stage-13-dựng-nhà-tạm--vinh-quang-chúa-ngự-xuống-xh-35--40))
  * [ ] 🖼️ Ảnh mở màn: `intro-13.png` (Nhà Tạm hoàn thành uy nghiêm; Đám Mây Vinh Quang Shekinah ngự xuống bao phủ).
  * [ ] Gameplay (**Sanctuary Blueprint Assembly Finale**): Lắp đặt 3 không gian Nhà Tạm (Sân Ngoài, Nơi Thánh, Nơi Cực Thánh) đón vinh quang Chúa.
  * [ ] 🎬 Cutscene chuyển tiếp then chốt (**Hành Trình Về Đất Hứa & Lời Chúc Lành Của Môi-sê** – `Đnl 34; Gs 1–3`):
    * Kể ngắn gọn hành trình 40 năm hoang địa hoàn tất: Đám Mây, Cột Lửa và Hòm Bia Giao Ước đồng hành che chở dân Chúa qua bao thử thách gian nan.
    * Trên đỉnh núi Nê-vô (`Nebo`), ông Môi-sê dù tuổi cao mắt vẫn tinh tường, được Chúa đưa lên ngắm nhìn toàn cảnh Đất Hứa Ca-na-an chan hòa sữa và mật. Môi-sê đặt tay chúc lành, trao gậy và trao phó sứ mạng cho dũng tướng Giu-suê kế nhiệm.
    * Giu-suê cùng các tư tế khiêng Hòm Bia Giao Ước dẫn toàn dân rẽ nước sông Gio-đan, hân hoan đặt chân vào Đất Hứa – hoàn tất trọn vẹn lời đoan thệ Thiên Chúa đã hứa với các tổ phụ Áp-ra-ham, I-xa-ác và Gia-cóp trước khi bước vào Màn Kết Epilogue.
  * [ ] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `tabernacle` (Tabernacle of the Covenant 96 BPM, G major) — rạng rỡ, trang trọng, thánh ca phụng vụ tạ ơn Chúa đến ở giữa con người.
    * **Âm nền (Ambience):** `["crowd", "wind"]` — toàn dân kính cẩn vây quanh Nhà Tạm đón mừng vinh quang Chúa.
    * **Mặt sàn (Surface):** `stone` (sân Nơi Thánh & Nơi Cực Thánh).
    * **Hiệu ứng (SFX):** `shofar` (khai mạc đại lễ cung hiến Nhà Tạm), `pickup` (lắp ráp Chân Đèn 7 Ngọn, Bàn Thờ Hương, Hòm Bia Giao Ước), `chime` (hoàn tất một gian phòng), `bless` / `complete` (Đám Mây Vinh Quang Shekinah ngự xuống bao phủ).

### Giai đoạn 6: Khúc Vĩ Thanh (Epilogue) & Kiểm định Chất lượng
* [ ] **Màn Kết (`EpilogueScene`):** *Cuộc Vượt Qua Mới Của Chúa Giêsu (`Xh 12; Ga 6, 32-35; 1 Cr 10, 1-4`)* ([Chi tiết](./scripts.md#màn-kết-cuộc-vượt-qua-mới-của-chúa-giêsu-xh-12-ga-6-32-35-1-cr-10-1-4))
  * [ ] 🖼️ Ảnh mở màn: `intro-end.png` (Căn phòng bình minh; Kinh Thánh Xuất Hành mở bên Hai Bia Đá, Hòm Bia, Tàu Nô-ê, Cuộn Sáng Thế và Chuỗi Mân Côi).
  * [ ] Gameplay: 3 kết nối đức tin của Người Lữ Hành Tự Do (Chiên Vượt Qua & Biển Đỏ $\rightarrow$ Chúa Giêsu & Bí tích Rửa Tội; Mân-na $\rightarrow$ Thánh Thể; Mười Điều Răn $\rightarrow$ Giới răn Yêu Thương).
  * [ ] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `lullaby` (The New Passover in Christ 70 BPM, C major) — trọn vẹn, bình an, khúc kết thúc hành trình lữ hành đức tin.
    * **Âm nền (Ambience):** `["crickets"]` — căn phòng bình yên buổi sớm.
    * **Mặt sàn (Surface):** `wood` (sàn phòng ngủ).
    * **Hiệu ứng (SFX):** `chime` (nối kết mầu nhiệm Tân Ước), `bless` (bình an phục sinh), `complete` (khải hoàn hoàn thành trọn vẹn hành trình Xuất Hành).
* [ ] Kiểm tra hiển thị thực tế tất cả 15 ảnh minh họa mở màn và 15 bản đồ Top-down ở độ phóng đại game (`npm run dev`), đảm bảo `npx tsc --noEmit` và `npm run build` đều pass sạch.

# KẾ HOẠCH DỰ ÁN: THE GARDEN OF EDEN (CÔNG TRÌNH TẠO DỰNG & VƯỜN ĐỊA ĐÀNG)

## 1. TỔNG QUAN DỰ ÁN
* **Tên Module:** `modules/the-garden-of-eden` (Route: `/the-garden-of-eden`).
* **Thể loại:** 2D Top-Down Retro Multi-Genre Puzzle & Action RPG (Pixel Art 8-bit vẽ bằng code theo chuẩn lưới `pixelArt.ts`).
* **Mục tiêu:** Giúp thiếu nhi và người chơi tìm hiểu Sách Sáng Thế Chương 1–3 (7 Ngày Tạo Dựng, Vườn Địa Đàng, Tội Nguyên Tổ của ông bà A-đam – E-va và Lời Hứa Cứu Độ Tiên Khởi `St 3, 15`) qua 12 màn chơi với **12 thể loại gameplay khác nhau** và độ thử thách nâng cao hơn so với *The Rosary Adventures*.
* **Điểm nhấn thiết kế mới:**
  1. **🎨 Màn Hình Minh Họa Pixel Art Mở Màn (`StageIntroIllustration`):** Khi bắt đầu mỗi màn chơi và chạy hộp thoại dẫn nhập (Intro Dialogue), vùng màn hình phía trên hiển thị một **bức tranh minh họa Pixel Art toàn cảnh giàu chi tiết** (có bố cục tiền cảnh – trung cảnh – hậu cảnh và animation 2–4 frames) thay vì cảnh bản đồ Top-down nhân vật đứng chờ. Sau khi kết thúc hội thoại mở màn, màn hình chuyển cảnh mượt mà (Pixel Wipe / Fade) vào bản đồ Top-down.
  2. **🎮 Đa thể loại (Multi-Genre) & Cơ chế Checkpoint (Soft Reset):** Mỗi Stage sở hữu một luật chơi riêng (phản chiếu tia sáng, né xoáy nước, giải đố 1 nét, căn nhịp quỹ đạo, dẫn đàn, trí nhớ âm nhạc, điều tiết đập nước, điều khiển 2 nhân vật phối hợp, chắn khói cám dỗ & phản biện Lời Chúa, mê cung tầm nhìn Stealth, hộ tống bằng đuốc sáng). Đi sai bước hoặc chạm chướng ngại sẽ lùi về Checkpoint gần nhất.
* **Kịch bản chi tiết:** Đồng bộ tuyệt đối theo tài liệu [`scripts.md`](./scripts.md).

---

## 2. KIẾN TRÚC KỸ THUẬT & TÁI SỬ DỤNG (`modules/shared`)
* **Tái sử dụng từ `modules/shared/`:**
  * `CharacterCreationModal`, `CharacterPreview`, `DialogueBox`, `VirtualController`, `DesktopControlHint`.
  * `EventBus`, `AudioManager`, `Player`, `pixelArt` (`PAL`, `drawMap`, `rect`, `glowCanvas`, `addSpriteSheet`), `playerTextureGenerator`.
* **Thành phần riêng trong `modules/the-garden-of-eden/`:**
  ```text
  modules/the-garden-of-eden/
    TheGardenOfEden.tsx             # Client root component được mount bởi app/the-garden-of-eden/page.tsx
    scripts.md                      # Kịch bản chi tiết & thiết kế gameplay 12 stages + Prologue/Epilogue
    plan.md                         # Lộ trình phát triển (file này)
    components/
      GameContainer.tsx             # Wrapper mount Phaser canvas
      GenesisHUD.tsx                # HUD Cuộn Sách Sáng Thế (12 Ấn Dấu Tạo Dựng & Giao Ước + Nút Reset Checkpoint)
      SaveLoadModal.tsx             # Lưu/Tải tiến trình & Export/Import JSON
    data/
      stagesData.ts                 # Dữ liệu 12 Stages + Prologue/Epilogue (Lời Chúa, Hoa trái, Nhiệm vụ, Tranh mở màn)
      dialogues.ts                  # Lời thoại song ngữ VI / EN
    types/
      game.ts                       # SaveData, StageKey, StageProgress, GenreState
    utils/
      saveManager.ts                # Quản lý localStorage (key riêng: "garden_of_eden_save_v1")
    game/
      config.ts                     # Phaser Game Config (`pixelArt: true`, `roundPixels: true`)
      scenes/
        BootScene.ts
        PreloadScene.ts
        BaseGenesisScene.ts         # Base scene: hỗ trợ Intro Pixel Illustration overlay, Checkpoint reset, Dual-character switch
        stages/                     # PrologueScene + Stage01..Stage12 + EpilogueScene
      utils/
        introIllustrations.ts       # Bộ generator vẽ tranh Pixel Art toàn cảnh + animation cho 14 màn (Prologue + 12 Stages + Epilogue)
        genesisTextures.ts          # NPC (A-đam, E-va, Con Rắn, Cherubim), thú vật, cây cối, lăng kính, đập nước
  ```

---

## 3. SCHEMA DỮ LIỆU LƯU GAME (`SaveData`)
```typescript
import type { CharacterCustomization } from "@/modules/shared/types";

export type GenesisStageKey =
  | "prologue_trang_sach_dau"
  | "stage_01_anh_sang"
  | "stage_02_vom_troi"
  | "stage_03_dat_lien_thao_moc"
  | "stage_04_mat_troi_tinh_tu"
  | "stage_05_ca_bien_chim_troi"
  | "stage_06_muon_thu_con_nguoi"
  | "stage_07_ngay_nghi_ngoi"
  | "stage_08_bon_dong_song"
  | "stage_09_tao_dung_eva"
  | "stage_10_con_ran_trai_cam"
  | "stage_11_tron_chay_trong_vuon"
  | "stage_12_loi_hua_cuu_do"
  | "epilogue_khu_vuon_tam_hon";

export interface GenesisSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: GenesisStageKey;
  currentStageIndex: number; // 0 đến 11 (12 Ấn Dấu chính)
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: {
    [key in GenesisStageKey]?: {
      completed: boolean;
      sealLit: boolean;         // Ấn Dấu Sáng Thế đã khắc sáng
      bestAttempts?: number;    // Số lần thử / hoàn thành
    };
  };
}
```

---

## 4. LỘ TRÌNH THỰC HIỆN TỪNG BƯỚC (ROADMAP)

### Giai đoạn 1: Khởi tạo Module, Route & Hệ thống Lưu trữ (Foundation)
* [x] Tạo route `app/the-garden-of-eden/page.tsx` và thêm thẻ game **The Garden of Eden** (kèm ảnh bìa pixel `/games/the-garden-of-eden.png`) vào trang chủ `app/page.tsx`.
* [x] Xây dựng `types/game.ts`, `data/stagesData.ts` (song ngữ VI/EN) và `utils/saveManager.ts` (lưu độc lập tại key `garden_of_eden_save_v1`).
* [x] Dựng `TheGardenOfEden.tsx`, `GameContainer.tsx`, `GenesisHUD.tsx` (hiển thị **Cuộn Sách Sáng Thế 12 Ấn Dấu**, nút xem Bảng Chiêm Ngắm Sáng Thế, và nút **Thử lại Checkpoint** nhanh).

### Giai đoạn 2: Base Scene, Hệ thống Tranh Minh Họa Mở Màn & Cơ chế Lõi
* [x] Xây dựng `BaseGenesisScene.ts`:
  * [x] Chế độ **Intro Pixel Illustration Mode**: Khi vào màn, hiển thị khung tranh minh họa toàn cảnh (`introIllustrations.ts`) có viền khung tranh cổ điển, hiệu ứng chuyển động pixel (2–4 frames + particles) trong suốt lúc hộp thoại dẫn nhập đang mở; khi đóng hộp thoại dẫn nhập thì thực hiện hiệu ứng chuyển cảnh (Pixel Wipe / Fade) mở ra bản đồ Top-down.
  * [x] Hệ thống **Checkpoint / Soft Reset**: API `this.saveCheckpoint(id, state)` và `this.resetToCheckpoint()` kèm hiệu ứng lóe sáng nhẹ + âm báo khích lệ khi người chơi cần thử lại.
  * [x] Hỗ trợ **Dual-Character Switch** (dùng cho Stage 9) và **Health/Grace Pips** (dùng cho các màn hành động Stage 2, 10, 12).
* [x] Xây dựng `genesisTextures.ts`: Sprite A-đam, E-va, Chim Bồ Câu Chúa Thánh Thần, Con Rắn Xảo Quyệt, Thần Hộ Vệ Cherubim, các loài thú (chiên, sư tử, hươu, voi, cá, chim), Cây Sự Sống và Cây Biết Lành Biết Dữ đúng chuẩn lưới chibi 32×32 / 16px tile grid.

### Giai đoạn 3: Khúc Dạo Đầu (Prologue)
* [x] **Màn Mở Đầu (`PrologueScene`):** *Trang Sách Đầu Tiên & Ngọn Gió Trên Mặt Nước (`St 1, 1-2`)* ([Chi tiết](./scripts.md#màn-mở-đầu-cuộn-sách-cựu-ước--ngọn-gió-trên-mặt-nước-st-1-1-2-tv-104-24))
  * [x] 🎨 Tranh mở màn: Đôi bàn tay mở trang đầu sách Sáng Thế, dải ngân hà pixel và Chim Bồ Câu Thánh Thần bay lên.
  * [x] Bản đồ & Gameplay: Phòng nhỏ buổi sáng, tưới chậu cây non, giải đố ghép 3 mảnh dấu trang (*Khởi Đầu – Tình Yêu – Sáng Tạo*) mở sách Kinh Thánh và nhận Cuộn Sách 12 Ấn Dấu.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `lullaby` (Music-box lullaby 70 BPM, C major) — lắng đọng, mở ra trang Kinh Thánh đầu tiên.
    * **Âm nền (Ambience):** `["crickets"]` — căn phòng tĩnh mịch ban mai.
    * **Mặt sàn (Surface):** `wood` (sàn gỗ trong phòng).
    * **Hiệu ứng (SFX):** `bless` (tưới cây non), `pickup` (nhặt mảnh dấu trang), `chime` (ghép đúng 3 mảnh dấu trang).

### Giai đoạn 4: Phần 1 – Bảy Ngày Tạo Dựng (`Stages 1–7`)
* [x] **Stage 1 (`Stage01LightScene`):** *Ngày Thứ Nhất – Ánh Sáng & Bóng Tối (`St 1, 3-5`)* ([Chi tiết](./scripts.md#stage-1-ngày-thứ-nhất--ánh-sáng--bóng-tối-st-1-3-5))
  * [x] 🎨 Tranh mở màn: Cột sáng vàng trắng xé toạc vực thẳm đêm đen, chia hai nửa Ngày – Đêm.
  * [x] Gameplay (**Prism / Light-Beam Puzzle**): Đẩy và xoay $90^\circ$ 6 Trụ Tinh Thể dẫn tia sáng qua 3 khu vực xua tan sương đen, kích hoạt 3 Đài Nhật Quang.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `creation` (Genesis 7 Days of Creation 96 BPM, C major) — kỳ diệu, mầu nhiệm công trình tạo dựng thuở ban đầu.
    * **Âm nền (Ambience):** `[]` — tĩnh lặng trước khi vạn vật thành hình.
    * **Mặt sàn (Surface):** `stone` (thềm đá khởi nguyên).
    * **Hiệu ứng (SFX):** `pickup` (đẩy trụ tinh thể), `chime` (tia sáng phản chiếu chuẩn xác), `bless` (đài nhật quang bừng sáng xua tan sương đen).
* [x] **Stage 2 (`Stage02SkyScene`):** *Ngày Thứ Hai – Vòm Trời & Làn Nước (`St 1, 6-8`)* ([Chi tiết](./scripts.md#stage-2-ngày-thứ-hai--vòm-trời--làn-nước-st-1-6-8))
  * [x] 🎨 Tranh mở màn: Đại dương tách đôi, tầng mây trắng nâng lên mở ra bầu trời xanh thiên thanh.
  * [x] Gameplay (**Wind-Push & Wave Dodge Action**): Né Xoáy Nước Hỗn Mang & Sóng Dâng (3 Giọt Bình An), dùng Còi Gió đẩy 8 Khối Mây Nước vào 4 Cột Gió Vòm Trời.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `luminous` (Luminous Mystery 100 BPM, D major) — bay bổng, thanh thoát nâng cao vòm trời xanh thẳm.
    * **Âm nền (Ambience):** `["wind"]` — gió lộng phân rẽ làn nước trên và làn nước dưới.
    * **Mặt sàn (Surface):** `grass` (đảo nổi nâng lên).
    * **Hiệu ứng (SFX):** `whoosh` (thổi còi gió đẩy mây nước), `chime` (mây nước vào cột gió), `wrong` (chạm xoáy nước hỗn mang).
* [x] **Stage 3 (`Stage03LandScene`):** *Ngày Thứ Ba – Đất Liền, Biển Cả & Thảo Mộc (`St 1, 9-13`)* ([Chi tiết](./scripts.md#stage-3-ngày-thứ-ba--đất-liền-biển-cả--thảo-mộc-st-1-9-13))
  * [x] 🎨 Tranh mở màn: Núi đồi trồi lên từ mặt biển, thảm cỏ hoa và cây ăn quả đâm chồi nảy lộc.
  * [x] Gameplay (**One-Stroke Tile Terraforming Puzzle**): Giải đố lộ trình 1 nét qua 3 hòn đảo ($5\times5$, $6\times7$, $8\times8$ có rãnh trượt nước) để gieo mầm cỏ hoa phủ kín đất trống mà không dẫm lặp lại.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `joyful` (Joyful Pastoral Mystery 104 BPM, F major) — rộn rã, tràn đầy sức sống hoa cỏ đâm chồi.
    * **Âm nền (Ambience):** `["birds", "wind"]` — chim muông reo vui & gió xuân lay cành.
    * **Mặt sàn (Surface):** `grass` (thảm cỏ tươi non).
    * **Hiệu ứng (SFX):** `bless` (gieo mầm hoa cỏ), `chime` (hoàn tất một nét phủ xanh đảo), `wrong` (bước lặp ô đất).
* [x] **Stage 4 (`Stage04StarsScene`):** *Ngày Thứ Tư – Mặt Trời, Mặt Trăng & Tinh Tú (`St 1, 14-19`)* ([Chi tiết](./scripts.md#stage-4-ngày-thứ-tư--mặt-trời-mặt-trăng--tinh-tú-st-1-14-19))
  * [x] 🎨 Tranh mở màn: Vòng cung bầu trời với Mặt Trời, Mặt Trăng lưỡi liềm, muôn sao và 4 mùa bên dưới.
  * [x] Gameplay (**Star Symmetry & Orbit Timing Puzzle**): Pha 1 ghép đối xứng 6 Mảnh Tinh Tú; Pha 2 căn nhịp khóa 3 vòng quỹ đạo đồng tâm tại 4 Bệ Thời Gian (Xuân – Hạ – Thu – Đông).
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `creation` (Cosmic Stars & Spheres 96 BPM, C major) — huyền ảo, trật tự vũ trụ tinh tú xoay vần.
    * **Âm nền (Ambience):** `["crickets"]` — bầu trời đêm bao la tĩnh mịch.
    * **Mặt sàn (Surface):** `grass` (đài thiên văn cỏ mềm).
    * **Hiệu ứng (SFX):** `pickup` (ghép mảnh tinh tú đối xứng), `chime` (khóa đúng vòng quỹ đạo mùa màng), `bless` (nhật nguyệt tinh tú chiếu soi).
* [x] **Stage 5 (`Stage05SeaBirdsScene`):** *Ngày Thứ Năm – Cá Biển & Chim Trời (`St 1, 20-23`)* ([Chi tiết](./scripts.md#stage-5-ngày-thứ-năm--cá-biển--chim-trời-st-1-20-23))
  * [x] 🎨 Tranh mở màn: Khung cảnh cắt ngang mặt biển (dưới đáy biển cá voi và san hô, trên trời đàn chim sải cánh).
  * [x] Gameplay (**Flock Herding & Wind Routing**): Nửa đầu dẫn đàn 6 chú cá bơi nối đuôi vượt mê cung san hô và dòng nước xoáy; nửa sau xoay 5 Quạt Gió nâng đàn chim non bay qua vách đá.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `animals` (Creatures of Sea & Sky 112 BPM, F major) — vui tươi, tung tăng cá bơi dưới nước và chim lượn trên trời.
    * **Âm nền (Ambience):** `["birds", "wind"]` — tiếng bầy chim ríu rít & sóng nước dạt dào.
    * **Mặt sàn (Surface):** `grass` (bờ biển & mỏm đá dẫn đàn).
    * **Hiệu ứng (SFX):** `splash` (đàn cá bơi lội), `whoosh` (quạt gió nâng cánh chim), `chime` (dẫn đàn qua eo biển an toàn).
* [x] **Stage 6 (`Stage06AnimalsManScene`):** *Ngày Thứ Sáu – Muôn Thú & Hình Ảnh Thiên Chúa (`St 1, 24-31; 2, 7`)* ([Chi tiết](./scripts.md#stage-6-ngày-thứ-sáu--muôn-thú--hình-ảnh-thiên-chúa-st-1-24-31-st-2-7))
  * [x] 🎨 Tranh mở màn: Luồng Sinh Khí vàng trắng từ trời đáp xuống hình hài A-đam giữa thảo nguyên muôn thú hiền hòa.
  * [x] Gameplay (**Memory Recipe & Timing Craft**): Ghi nhớ vị trí 4 Tinh Hoa Đất Đỏ (`Adamah`) sau 5 giây mở bản đồ, lách qua các bầy thú đang chạy để thu thập đúng thứ tự và căn nhịp hội tụ Hơi Thở Sự Sống.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `joyful` (Breath of Life & Man Creation 104 BPM, F major) — ấm áp, thánh thiêng trao ban hơi thở sự sống.
    * **Âm nền (Ambience):** `["birds"]` — muôn thú thảo nguyên reo mừng con người.
    * **Mặt sàn (Surface):** `grass` (thảo nguyên xanh tươi).
    * **Hiệu ứng (SFX):** `pickup` (thu thập tinh hoa đất đỏ Adamah), `bless` (hơi thở sự sống truyền vào hình hài A-đam), `wrong` (va vào thú đang chạy).
* [x] **Stage 7 (`Stage07SabbathScene`):** *Ngày Thứ Bảy – Ngày Nghỉ Ngơi Thánh Thiêng (`St 2, 1-3`)* ([Chi tiết](./scripts.md#stage-7-ngày-thứ-bảy--ngày-nghỉ-ngơi-thánh-thiêng-st-2-1-3))
  * [x] 🎨 Tranh mở màn: Vũ trụ hoàn mỹ trên Đồi Thánh Hóa, muôn loài cùng dâng những nốt nhạc ánh sáng lên Thiên Chúa.
  * [x] Gameplay (**Musical Simon-Says Harmony**): Lắng nghe và gõ lại đúng chuỗi giai điệu trên 6 Bệ Đàn Thiên Nhiên qua 3 vòng (4 nốt $\rightarrow$ 6 nốt $\rightarrow$ 8 nốt).
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sabbath` (Holy Rest & Sanctuary Hymn 80 BPM, D major) — trang nghiêm, an bình, chúc lành cho ngày thứ bảy.
    * **Âm nền (Ambience):** `["birds"]` — tiếng chim líu lo trong ngày nghỉ thánh thiện.
    * **Mặt sàn (Surface):** `grass` (đồi Thánh Hóa).
    * **Hiệu ứng (SFX):** `chime` (gõ bệ đàn thiên nhiên đúng cao độ), `bless` (ánh sáng chúc phúc ngập tràn vũ trụ), `wrong` (gõ sai giai điệu).

### Giai đoạn 5: Phần 2 – Vườn Địa Đàng & Tội Nguyên Tổ (`Stages 8–12`)
* [x] **Stage 8 (`Stage08EdenRiversScene`):** *Bốn Dòng Sông Ê-đen & Đặt Tên Muôn Loài (`St 2, 8-20`)* ([Chi tiết](./scripts.md#stage-8-bốn-dòng-sông-ê-đen--đặt-tên-muôn-loài-st-2-8-20))
  * [x] 🎨 Tranh mở màn: Toàn cảnh vườn Ê-đen với 4 nhánh sông chảy từ Cây Sự Sống và A-đam đang gọi tên muôn thú.
  * [x] Gameplay (**Water-Sluice Logic & Animal Observation**): Pha 1 điều tiết các cửa đập nước để nước chảy cùng lúc vào cả 4 nhánh sông (Pi-sôn, Ghi-khôn, Hít-đê-ken, Êu-phơ-rát); Pha 2 lần theo dấu chân và tập tính để cùng A-đam đặt đúng tên 6 loài vật.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `eden` (Paradise Eden & River of Life 92 BPM, G major) — tươi mát, êm dịu, dòng suối ngọt ngào nuôi dưỡng địa đàng.
    * **Âm nền (Ambience):** `["birds", "wind"]` — tiếng nước suối róc rách, chim ca & gió nhẹ qua tàng cây.
    * **Mặt sàn (Surface):** `grass` (bờ suối vườn địa đàng).
    * **Hiệu ứng (SFX):** `door` (mở/đóng cửa đập nước), `splash` (nước tràn vào 4 nhánh sông), `chime` (đặt đúng tên loài thú).
* [x] **Stage 9 (`Stage09EveCoopScene`):** *Tạo Dựng E-va & Sự Hiệp Thông (`St 2, 18.21-25`)* ([Chi tiết](./scripts.md#stage-9-tạo-dựng-e-va--sự-hiệp-thông-st-2-1821-25))
  * [x] 🎨 Tranh mở màn: A-đam và E-va nắm tay nhau dưới bóng Cây Sự Sống, đôi chim câu trắng bay song đôi.
  * [x] Gameplay (**Dual-Character Co-op Switch Puzzle**): Bấm phím `[B]` chuyển đổi điều khiển giữa hai bên bờ suối, phối hợp giữ bàn đạp, chuyển Bình Nước qua ròng rọc và cùng bước lên 2 Bệ Ánh Sáng Đối Xứng trong vòng 3 giây.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `eden` (Bone of my Bones & Communion 92 BPM, G major) — hòa hợp, yêu thương chan hòa giữa hai tâm hồn.
    * **Âm nền (Ambience):** `["birds"]` — tiếng chim bồ câu rù rì đôi lứa.
    * **Mặt sàn (Surface):** `grass` (thảm cỏ Cây Sự Sống).
    * **Hiệu ứng (SFX):** `pickup` (chuyển bình nước qua ròng rọc), `chime` (bước lên bệ ánh sáng đồng thời), `bless` (A-đam & E-va hiệp thông).
* [x] **Stage 10 (`Stage10SerpentScene`):** *Con Rắn Xảo Quyệt & Trái Cấm (`St 3, 1-7`)* ([Chi tiết](./scripts.md#stage-10-con-rắn-xảo-quyệt--trái-cấm-st-2-16-17-st-3-1-7))
  * [x] 🎨 Tranh mở màn: Tán Cây Biết Lành Biết Dữ u tối, Trái Cấm đỏ rực tỏa khói tím và đôi mắt vàng sắc lạnh của Con Rắn đang thì thầm với E-va.
  * [x] Gameplay (**Shield Defense & Scripture Truth Debate**): Qua 3 đợt cám dỗ, cầm Khiên Ánh Sáng đánh bật các luồng khói độc nghi ngờ và chọn đúng Lời Chúa để vạch trần ngụy biện của Con Rắn, trước khi chứng kiến cutscene bi kịch sa ngã.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `serpent` (Cunning Temptation & Shadow 108 BPM, C minor) — mờ ám, xảo quyệt, tiếng trườn ranh mãnh và cám dỗ ngấm ngầm.
    * **Âm nền (Ambience):** `["crickets", "wind"]` — đêm lạnh âm u & tiếng gió rít qua cành lá khô.
    * **Mặt sàn (Surface):** `grass` (đất u tối quanh Cây Biết Lành Biết Dữ).
    * **Hiệu ứng (SFX):** `whoosh` (vung khiên ánh sáng chắn khói độc), `wrong` (trúng khói cám dỗ / phản biện sai), `chime` (vạch trần ngụy biện con rắn).
* [x] **Stage 11 (`Stage11HidingScene`):** *Trốn Chạy Trong Vườn & Tiếng Chúa Gọi (`St 3, 8-13`)* ([Chi tiết](./scripts.md#stage-11-trốn-chạy-trong-vườn--tiếng-chúa-gọi-st-3-8-13))
  * [x] 🎨 Tranh mở màn: Vườn Ê-đen chiều gió thổi đầy bụi gai, A-đam và E-va co ro nấp sau gốc cây khi Luồng Sáng của Chúa chiếu tới gọi *"Ngươi ở đâu?"*.
  * [x] Gameplay (**Stealth Line-of-Sight Maze & Reconciliation**): Di chuyển ẩn nấp qua mê cung bụi gai, tránh nón tầm nhìn (Vision Cones) của các Bóng Tối Hoảng Loạn, tìm đến A-đam và E-va rồi giải câu đố tháo gỡ tâm lý đổ lỗi để bước ra ánh sáng thú nhận.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sorrowful` (Sorrowful Hiding & Calling 56 BPM, A minor) — xót xa, tiếc nuối, tiếng chân run rẩy lẩn tránh Ánh Sáng.
    * **Âm nền (Ambience):** `["wind", "crickets"]` — gió chiều buốt giá & tiếng dế than khóc.
    * **Mặt sàn (Surface):** `grass` (bụi gai góc rậm rạp).
    * **Hiệu ứng (SFX):** `wrong` (bóng tối hoảng loạn phát hiện), `chime` (tháo gỡ tâm lý đổ lỗi), `bless` (bước ra ánh sáng thú nhận tội lỗi).
* [x] **Stage 12 (`Stage12PromiseScene`):** *Rời Vườn Địa Đàng & Lời Hứa Cứu Độ Tiên Khởi (`St 3, 14-24`)* ([Chi tiết](./scripts.md#stage-12-rời-vườn-địa-đàng--lời-hứa-cứu-độ-tiên-khởi-st-3-14-24))
  * [x] 🎨 Tranh mở màn: Thần Hộ Vệ Cherubim và lưỡi gươm lửa nơi cổng vườn; A-đam và E-va mặc áo da bước đi dưới ánh Sao Mai (Đức Maria) và Thánh Giá Ánh Sáng (Chúa Giêsu).
  * [x] Gameplay (**Torch-Bearer Escort Finale**): Cầm Ngọn Đuốc Lời Hứa (`St 3, 15`) giữ vòng sáng dẫn đường cho A-đam và E-va, thu thập Dầu Ân Sủng, đẩy lùi Bóng Rắn Đen và thắp sáng 5 Cột Mốc Tiên Báo Cứu Độ.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `promise` (Protoevangelium Hope 104 BPM, D major) — thắp lên tia sáng hy vọng, lời hứa cứu độ tiên khởi qua đêm tối.
    * **Âm nền (Ambience):** `["fire", "wind"]` — ánh lửa đuốc bập bùng & gió sa mạc lưu đày.
    * **Mặt sàn (Surface):** `sand` (bãi cát sỏi ngoài cổng địa đàng).
    * **Hiệu ứng (SFX):** `pickup` (dầu ân sủng thắp sáng đuốc), `bless` (thắp sáng cột mốc tiên báo cứu độ), `whoosh` (xua tan bóng rắn đen), `complete` (hoàn tất sứ mạng).

### Giai đoạn 6: Khúc Vĩ Thanh (Epilogue) & Kiểm định Chất lượng
* [x] **Màn Kết (`EpilogueScene`):** *Trở Về Phòng Nhỏ – Gìn Giữ Khu Vườn Chúa Trao (`St 2, 15; Rm 5, 19`)* ([Chi tiết](./scripts.md#màn-kết-trở-về-phòng-nhỏ--gìn-giữ-khu-vườn-chúa-trao-st-2-15-rm-5-19))
  * [x] 🎨 Tranh mở màn: Căn phòng nhỏ ngập nắng trưa, cuốn Kinh Thánh mở cạnh Chuỗi Mân Côi và chậu hoa trắng nở rộ bên Chim Bồ Câu Thánh Thần.
  * [x] Gameplay: Thực hiện 3 cam kết của Người Quản Gia Nhỏ (bảo vệ thiên nhiên, nhận lỗi chân thành, kết nối Sáng Thế với Chúa Giêsu – A-đam Mới & Đức Maria – E-va Mới).
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `lullaby` (Music-box lullaby 70 BPM, C major) — an bình, ấm cúng bên cuốn Kinh Thánh đã đọc xong.
    * **Âm nền (Ambience):** `["crickets"]` — căn phòng tĩnh lặng ấm áp.
    * **Mặt sàn (Surface):** `wood` (sàn gỗ trong phòng).
    * **Hiệu ứng (SFX):** `chime` (nối kết A-đam Mới và E-va Mới), `bless` (chúc lành cam kết quản gia nhỏ), `complete` (kết thúc trọn vẹn hành trình Sáng Thế).
* [ ] Kiểm tra hiển thị thực tế tất cả 14 bức tranh Intro Pixel Illustration và 14 bản đồ Top-down ở độ phóng đại game (`npm run dev`), đảm bảo `npx tsc --noEmit`, `npx eslint modules app` và `npx next build` đều pass sạch.

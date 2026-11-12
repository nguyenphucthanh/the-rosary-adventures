# KẾ HOẠCH DỰ ÁN: KING DAVID – SHEPHERD & KING (VUA ĐA-VÍT – NGƯỜI CHĂN CHIÊN & VỊ VUA GIAO ƯỚC)

## 1. TỔNG QUAN DỰ ÁN
* **Tên Module:** `modules/king-david` (Route: `/king-david`).
* **Thể loại:** 2D Top-Down Retro Multi-Genre Puzzle & Action RPG (Pixel Art 8-bit vẽ bằng code theo chuẩn lưới `pixelArt.ts`).
* **Mục tiêu:** Giúp thiếu nhi và người chơi tìm hiểu Sách Sa-mu-en Quyển I & II cùng các Thánh Vịnh (`1 Sm 16 – 2 Sm 7; Tv 23; 57`) – từ đồng cỏ Bê-lem nơi cậu út Đa-vít chăn chiên và được ngôn sứ Sa-mu-en xức dầu tuyển chọn, tiếng đàn hạc xoa dịu cung điện vua Sa-un, trận quyết đấu với người khổng lồ Gô-li-át tại thung lũng Ê-la, tình bạn thánh thiêng với hoàng tử Giô-na-than, những năm tháng thử thách lòng khoan dung nơi hoang địa (hang A-đu-lam, hang Ên Gê-đi, bà A-bi-gai-in, đồi Khắc-hi-la), khúc ca thương tiếc trên núi Ghin-bô-a, cho đến ngày chính thức đăng quang tại Khép-rôn, xây dựng thành đô Giê-ru-sa-lem và rước Hòm Bia Giao Ước đón nhận Lời Hứa Vương Quốc Vĩnh Cửu – qua **12 màn chơi chính** (+ Prologue & Epilogue) với **12 thể loại gameplay khác nhau**.
* **Điểm nhấn thiết kế:**
  1. **🖼️ Màn Hình Minh Họa Tĩnh Mở Màn (`StageIntroIllustration`):** Khi bắt đầu mỗi màn chơi và mở hộp thoại dẫn nhập (Intro Dialogue), vùng màn hình hiển thị một **bức tranh minh họa tĩnh toàn cảnh (Storybook Illustration)** được nạp trực tiếp từ thư mục ảnh dựng sẵn `modules/king-david/images/intro-*.png` (và phục vụ tại `/games/king-david/intro/*.png`). Sau khi kết thúc hội thoại mở màn, màn hình chuyển cảnh mượt mà (Fade / Pixel Wipe) vào bản đồ Top-down.
  2. **🎮 Đa thể loại (Multi-Genre) & Cơ chế Checkpoint (Soft Reset):** Mỗi Stage sở hữu một luật chơi riêng (dẫn đàn chiên & xua thú dữ ở Bê-lem, gảy đàn hạc theo nhịp xua tan bóng tối u sầu trong cung điện Sa-un, chọn 5 viên đá suối & căn lực dây ná hạ Gô-li-át, giải mã mũi tên mật hiệu của Giô-na-than, thắp lửa & gảy đàn khích lệ người nghèo khổ trong hang A-đu-lam, bước êm trong hang tối Ên Gê-đi cắt vạt áo Sa-un thay vì trả thù, điều phối đoàn lừa lễ vật của bà A-bi-gai-in hòa giải, đột nhập doanh trại đêm lấy cây giáo & bình nước của Sa-un, nối chòm sao âm nhạc sáng tác Khúc Ca Cây Cung, quy tụ 12 cờ hiệu chi tộc Ít-ra-en tại Khép-rôn, điều tiết mạch nước Gi-khôn mở cổng thành Xi-on, và dẫn đoàn rước Hòm Bia Giao Ước vào Lều Thánh Giê-ru-sa-lem). Đi sai bước hoặc chạm chướng ngại sẽ lùi về Checkpoint gần nhất.
  3. **🎬 Chuỗi Hoạt Cảnh Kể Chuyện Liền Mạch (Narrative Storyline Bridges):** Giữa các giai đoạn lịch sử luôn có các đoạn cutscene kể chuyện sâu sắc, giải thích sự chuyển biến nội tâm của Đa-vít từ cậu bé chăn chiên khiêm nhường sang người chiến binh bị truy đuổi oan ức nhưng quyết không lấy oán báo oán, và cuối cùng trở thành vị Vua Mục Tử theo lòng Chúa ước mong.
* **Kịch bản chi tiết:** Đồng bộ tuyệt đối theo tài liệu [`scripts.md`](./scripts.md).

---

## 2. KIẾN TRÚC KỸ THUẬT & TÁI SỬ DỤNG (`modules/shared`)
* **Tái sử dụng từ `modules/shared/`:**
  * `CharacterCreationModal`, `CharacterPreview`, `DialogueBox`, `VirtualController`, `DesktopControlHint`.
  * `EventBus`, `AudioManager`, `Player`, `pixelArt` (`PAL`, `drawMap`, `rect`, `glowCanvas`, `addSpriteSheet`), `playerTextureGenerator`.
* **Thành phần riêng trong `modules/king-david/`:**
  ```text
  modules/king-david/
    KingDavid.tsx                   # Client root component được mount bởi app/king-david/page.tsx
    scripts.md                      # Kịch bản chi tiết & thiết kế gameplay 12 stages + Prologue/Epilogue
    plan.md                         # Lộ trình phát triển (file này)
    image-prompts.md                # Danh sách 15 prompts ảnh minh họa mở màn & ảnh bìa
    images/                         # Thư mục ảnh tĩnh minh họa mở màn (intro-start.png, intro-1..12.png, intro-end.png)
    components/
      GameContainer.tsx             # Wrapper mount Phaser canvas
      DavidHUD.tsx                  # HUD Cây Đàn Hạc & Vương Miện Đa-vít (12 Ấn Thánh Vịnh + Nút Reset Checkpoint)
    data/
      stagesData.ts                 # Dữ liệu 12 Stages + Prologue/Epilogue (Lời Chúa, Hoa trái, Nhiệm vụ, Đường dẫn ảnh intro)
      dialogues.ts                  # Lời thoại song ngữ VI / EN
    types/
      game.ts                       # DavidSaveData, DavidStageKey, StageProgress
    utils/
      saveManager.ts                # Quản lý localStorage (key riêng: "king_david_save_v1")
    game/
      config.ts                     # Phaser Game Config (`pixelArt: true`, `roundPixels: true`)
      scenes/
        BootScene.ts
        PreloadScene.ts             # Preload tất cả ảnh minh họa tĩnh từ thư mục images/
        BaseDavidScene.ts           # Base scene: hiển thị ảnh tĩnh mở màn overlay, Checkpoint reset, Harp/Sling hooks
        stages/                     # PrologueScene + Stage01..Stage12 + EpilogueScene
      utils/
        davidTextures.ts            # NPC (Đa-vít 3 giai đoạn, Sa-mu-en, Giê-sê, Sa-un, Gô-li-át, Giô-na-than, A-bi-gai-in, Na-than), Chiên, Đàn Hạc, Dây Ná, Hòm Bia
  ```

---

## 3. SCHEMA DỮ LIỆU LƯU GAME (`SaveData`)
```typescript
import type { CharacterCustomization } from "@/modules/shared/types";

export type DavidStageKey =
  | "prologue_dan_hac_nguoi_muc_tu"
  | "stage_01_dong_co_belem_xuc_dau"
  | "stage_02_tieng_dan_cung_dien_saun"
  | "stage_03_thung_lung_ela_goliat"
  | "stage_04_giao_uoc_gionathan_mui_ten"
  | "stage_05_banh_thanh_hang_adulam"
  | "stage_06_hang_engedi_cat_vat_ao"
  | "stage_07_ba_abigaiin_hoa_giai"
  | "stage_08_cay_giao_binh_nuoc_khachila"
  | "stage_09_khuc_ca_cay_cung"
  | "stage_10_dang_quang_khepron_muoi_hai_chi_toc"
  | "stage_11_mach_nuoc_gikhon_thanh_xion"
  | "stage_12_ruoc_hom_bia_loi_hua_muon_doi"
  | "epilogue_con_vua_davit";

export interface DavidSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: DavidStageKey;
  currentStageIndex: number; // 0 đến 11 (12 Ấn Thánh Vịnh & Vương Quyền chính)
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: {
    [key in DavidStageKey]?: {
      completed: boolean;
      psalmSealLit: boolean;    // Ấn Thánh Vịnh trên Cây Đàn Hạc đã thắp sáng
      bestAttempts?: number;    // Số lần thử / hoàn thành
    };
  };
}
```

---

## 4. LỘ TRÌNH THỰC HIỆN TỪNG BƯỚC (ROADMAP)

### Giai đoạn 1: Khởi tạo Module, Route & Hệ thống Lưu trữ (Foundation)
* [x] Tạo route `app/king-david/page.tsx` và thêm thẻ game **King David – Shepherd & King** (kèm ảnh bìa pixel `/games/king-david.png`) vào trang chủ `app/page.tsx`.
* [x] Xây dựng `types/game.ts`, `data/stagesData.ts` (song ngữ VI/EN, nạp đường dẫn ảnh tĩnh mở màn) và `utils/saveManager.ts` (lưu độc lập tại key `king_david_save_v1`).
* [x] Dựng `KingDavid.tsx`, `GameContainer.tsx`, `DavidHUD.tsx` (hiển thị **Cây Đàn Hạc Vàng & 12 Ấn Thánh Vịnh**, nút xem Suy Niệm Thánh Vịnh & Hành Trình Vương Quyền, và nút **Thử lại Checkpoint** nhanh).

### Giai đoạn 2: Base Scene & Cơ chế Lõi
* [x] Xây dựng `BaseDavidScene.ts`:
  * [x] Chế độ **Intro Storybook Illustration Overlay**: Khi vào màn, hiển thị ảnh minh họa tĩnh toàn cảnh nạp từ `/games/king-david/intro/<id>.png` có viền khung trang trọng trong suốt lúc hộp thoại dẫn nhập đang mở; khi đóng hộp thoại dẫn nhập thì thực hiện hiệu ứng chuyển cảnh (Fade / Pixel Wipe) mở ra bản đồ Top-down.
  * [x] Hệ thống **Checkpoint / Soft Reset**: API `this.saveCheckpoint(id, state)` và `this.resetToCheckpoint()` kèm hiệu ứng lóe sáng nhẹ + âm báo khích lệ khi người chơi cần thử lại.
  * [x] Hỗ trợ **Grace Pips (3 Giọt Bình An)** và cơ chế nút `[A]` đa năng theo từng màn chơi: **Gảy Đàn Hạc (`playHarp()`)** tạo vòng sóng âm ánh sáng hoặc **Quay Dây Ná / Gậy Chăn Chiên (`useSlingOrStaff()`)**.
* [x] Xây dựng `davidTextures.ts`: Sprite Đa-vít (lúc cậu bé chăn chiên áo vải cầm đàn hạc/dây ná, lúc dũng sĩ trong hoang địa, và lúc mặc phẩm phục Vua Ít-ra-en / áo vải gai rước Hòm Bia), ngôn sứ Sa-mu-en cầm sừng dầu thánh, ông Giê-sê, vua Sa-un đội vương miện cầm giáo, người khổng lồ Gô-li-át (khung 48×40 mặc giáp đồng), hoàng tử Giô-na-than mang cung tên, tư tế A-khi-me-léc, bà A-bi-gai-in cùng đoàn lừa lễ vật, dũng tướng A-bi-sai & Giô-áp, ngôn sứ Na-than, đàn chiên Bê-lem, sư tử/gấu, Cây Đàn Hạc, 5 viên đá suối, Cờ Hiệu 12 Chi Tộc và Hòm Bia Giao Ước đúng chuẩn lưới chibi 32×32 / 16px tile grid.

### Giai đoạn 3: Khúc Dạo Đầu (Prologue)
* [x] **Màn Mở Đầu (`PrologueScene`):** *Cây Đàn Hạc & Bản Đồ Bê-lem – Xi-on (`Tv 23, 1-6`)* ([Chi tiết](./scripts.md#màn-mở-đầu-cây-đàn-hạc--bản-đồ-bê-lem--xi-on-tv-23-1-6))
  * [x] 🖼️ Ảnh mở màn: `intro-start.png` (Đôi bàn tay mở Sách Sa-mu-en và Thánh Vịnh bên ngọn đèn bàn, hiện lên khải tượng đồng cỏ Bê-lem xanh mướt, Cây Đàn Hạc vàng, dây ná chăn chiên và thành đô Xi-on rực sáng).
  * [x] Bản đồ & Gameplay: Phòng nhỏ buổi tối ấm áp, thắp ngọn đèn bàn học, ghép 3 mảnh bản đồ cổ (*Đồng Cỏ Bê-lem $\rightarrow$ Hoang Địa Giu-đa $\rightarrow$ Đồi Xi-on Giê-ru-sa-lem*) và nhận **Cây Đàn Hạc Hành Trình (0/12 Ấn Thánh Vịnh)**.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `lullaby` (Music-box lullaby 70 BPM, C major) — không khí ấm áp, tĩnh lặng bên bàn học.
    * **Âm nền (Ambience):** `["wind", "crickets"]` — gió đêm êm đềm ngoài hiên.
    * **Mặt sàn (Surface):** `wood` (sàn gỗ căn phòng).
    * **Hiệu ứng (SFX):** `pickup` (nhặt mảnh bản đồ), `chime` (ghép đúng mảnh), `bless` (thắp sáng đèn học & nhận Cây Đàn Hạc).

### Giai đoạn 4: Hồi 1 – Cậu Bé Chăn Chiên Bê-lem (`Stages 1–3`)
* [x] **Stage 1 (`Stage01BethlehemAnointingScene`):** *Đồng Cỏ Bê-lem & Dầu Thánh Tuyển Chọn (`1 Sm 16, 1-13`)* ([Chi tiết](./scripts.md#stage-1-đồng-cỏ-bê-lem--dầu-thánh-tuyển-chọn-1-sm-16-1-13))
  * [x] 🖼️ Ảnh mở màn: `intro-1.png` (Đồng cỏ Bê-lem xanh mướt; cậu bé Đa-vít chăn chiên, nối tiếp cảnh ngôn sứ Sa-mu-en nghiêng sừng dầu thánh xức đầu Đa-vít giữa ông Giê-sê và các anh).
  * [x] Gameplay (**Flock Herding & Predator Defense**): Dẫn đàn chiên qua đồng cỏ về rào, dùng gậy/ná xua đuổi sư tử và gấu bảo vệ chiên non (`1 Sm 17, 34-35`), rồi về nhà đón nhận dầu thánh từ ngôn sứ Sa-mu-en.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `pastoral` / `wilderness` (Bethlehem Pastures 90 BPM, F major) — trong trẻo, bình yên trên cánh đồng chăn chiên.
    * **Âm nền (Ambience):** `["birds", "wind"]` — gió đồng nội & tiếng chim hót buổi sớm.
    * **Mặt sàn (Surface):** `grass` (đồng cỏ xanh Bê-lem).
    * **Hiệu ứng (SFX):** `staff` (dùng gậy/ná xua thú dữ), `pickup` (gom chiên lạc), `bless` (Sa-mu-en xức dầu thánh, Thần Khí Chúa ngự xuống).
* [x] **Stage 2 (`Stage02RoyalHarpSoothingScene`):** *Tiếng Đàn Hạc Trong Cung Điện Vua Sa-un (`1 Sm 16, 14-23`)* ([Chi tiết](./scripts.md#stage-2-tiếng-đàn-hạc-trong-cung-điện-vua-sa-un-1-sm-16-14-23))
  * [x] 🖼️ Ảnh mở màn: `intro-2.png` (Cung điện Ghi-bơ-a nửa tối nửa sáng; cậu bé Đa-vít gảy đàn hạc tỏa sóng ánh sáng vàng xua tan bóng đen u sầu quanh ngai vua Sa-un).
  * [x] Gameplay (**Harp Rhythm & Shadow Dispel**): Di chuyển giữa các cột đá cung điện, gảy đàn hạc (`[A]`) theo nhịp các nốt nhạc ánh sáng để đẩy lùi 3 đợt bóng tối u sầu và thắp sáng lại tâm hồn vua Sa-un.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `miriam` / `creation` (David's Harp Melody 96 BPM, G major) — tiếng đàn hạc du dương, thanh thoát, chữa lành tâm hồn.
    * **Âm nền (Ambience):** `["wind"]` — gió lùa qua hành lang đá cung điện.
    * **Mặt sàn (Surface):** `stone` (sàn đá cung điện vua Sa-un).
    * **Hiệu ứng (SFX):** `chime` (gảy đúng nhịp đàn hạc), `bless` (ánh sáng âm nhạc xua tan mây đen), `wrong` (lệch nhịp / chạm bóng u sầu).
* [x] **Stage 3 (`Stage03ValleyOfElahGoliathScene`):** *Thung Lũng Ê-la & Người Khổng Lồ Gô-li-át (`1 Sm 17, 1-51`)* ([Chi tiết](./scripts.md#stage-3-thung-lũng-ê-la--người-khổng-lồ-gô-li-át-1-sm-17-1-51))
  * [x] 🖼️ Ảnh mở màn: `intro-3.png` (Thung lũng Ê-la hùng vĩ; cậu bé Đa-vít nhỏ bé cầm dây ná và túi 5 viên đá cuội đứng đối diện người khổng lồ Gô-li-át mặc giáp đồng).
  * [x] Gameplay (**Stream Stone Hunt & Precision Sling Boss**): Đưa lương thực cho 3 người anh, lọc chọn 5 viên đá cuội nhẵn dưới suối, né sóng chấn động giáo đồng của Gô-li-át và căn lực quay ná bắn trúng điểm hở.
  * [x] 🎬 Cutscene chuyển tiếp: Chiến thắng vang dội và mầm mống đố kỵ trong lòng vua Sa-un (`1 Sm 18, 6-9`).
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `exodus` (Battle of Elah Valley 126 BPM, D minor) — hào hùng, quả cảm, sức mạnh đức tin đối đầu gã khổng lồ.
    * **Âm nền (Ambience):** `["wind", "crowd"]` — tiếng hò reo của hai đạo quân trên sườn đồi.
    * **Mặt sàn (Surface):** `sand` (lòng suối đá cuội và bãi đất thung lũng Ê-la).
    * **Hiệu ứng (SFX):** `pickup` (nhặt đá cuội dưới suối), `whoosh` (quay dây ná bắn đá), `chime` (đá trúng đích), `wrong` (chấn động giáo của Gô-li-át).

### Giai đoạn 5: Hồi 2 – Tình Bạn Thánh & Thử Thách Trong Hoang Địa (`Stages 4–8`)
* [x] **Stage 4 (`Stage04JonathanArrowsScene`):** *Giao Ước Tình Bạn Giô-na-than & Mũi Tên Báo Hiệu (`1 Sm 18, 1-4; 20, 1-42`)* ([Chi tiết](./scripts.md#stage-4-giao-ước-tình-bạn-giô-na-than--mũi-tên-báo-hiệu-1-sm-18-1-4-20-1-42))
  * [x] 🖼️ Ảnh mở màn: `intro-4.png` (Hoàng tử Giô-na-than trao áo choàng và cung tên cho Đa-vít; ngoài cánh đồng đá Ê-den, Giô-na-than bắn mũi tên mật hiệu báo tin bình an).
  * [x] Gameplay (**Arrow-Code Puzzle & Stealth Escape**): Nhận kỷ vật giao ước của Giô-na-than, ẩn nấp qua lính tuần tra hoàng cung và giải mã vị trí 3 mũi tên mật hiệu ngoài cánh đồng để biết đường trốn thoát.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `nile` (Covenant of Friendship 84 BPM, D minor / F major) — sâu lắng, trung tín, cảm động tình bạn gắn bó như chính mạng sống.
    * **Âm nền (Ambience):** `["wind", "birds"]` — gió thảo nguyên thổi qua tảng đá Ê-den.
    * **Mặt sàn (Surface):** `grass` (cánh đồng cỏ ngoài thành).
    * **Hiệu ứng (SFX):** `whoosh` (tiếng tên bắn báo hiệu), `pickup` (nhận áo choàng & giải mã mũi tên), `bless` (lời thề tình bạn muôn đời).
* [x] **Stage 5 (`Stage05AdullamSanctuaryScene`):** *Bánh Thánh Đền Nóp & Hang A-đu-lam (`1 Sm 21, 1-7; 22, 1-5; Tv 57`)* ([Chi tiết](./scripts.md#stage-5-bánh-thánh-đền-nóp--hang-a-đu-lam-1-sm-21-1-7-22-1-5-tv-57))
  * [x] 🖼️ Ảnh mở màn: `intro-5.png` (Bên trong hang đá A-đu-lam ấm áp ánh lửa trại; Đa-vít chia sẻ bánh và gảy đàn hát Thánh Vịnh khích lệ những người nghèo khổ, cùng cực tìm đến).
  * [x] Gameplay (**Camp Sanctuary & Torch/Harp Morale**): Nhận Bánh Tiến từ tư tế A-khi-me-léc, sau đó trong hang A-đu-lam thắp 6 đốm lửa trại, chia lương thực và gảy đàn giữ vững tinh thần cho các gia đình đang sợ hãi.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `creation` (Refuge in the Cave & Psalm 57 92 BPM, E minor / G major) — ấm áp, hy vọng bừng sáng giữa hang tối.
    * **Âm nền (Ambience):** `["fire", "wind"]` — tiếng củi lửa tí tách trong hang đá & gió đêm hoang địa.
    * **Mặt sàn (Surface):** `stone` (nền đá hang A-đu-lam).
    * **Hiệu ứng (SFX):** `pickup` (nhận và chia bánh), `chime` (thắp lửa trại & gảy đàn khích lệ), `bless` (hoàn thành Thánh Vịnh 57).
* [x] **Stage 6 (`Stage06EnGediMercyScene`):** *Hang Ên Gê-đi – Cắt Vạt Áo Thay Vì Trả Thù (`1 Sm 24, 1-23`)* ([Chi tiết](./scripts.md#stage-6-hang-ên-gê-đi--cắt-vạt-áo-thay-vì-trả-thù-1-sm-24-1-23))
  * [x] 🖼️ Ảnh mở màn: `intro-6.png` (Trong hang đá Ên Gê-đi mờ tối, Đa-vít nhẹ nhàng cắt một góc vạt áo choàng đỏ của vua Sa-un thay vì làm hại vua; phía ngoài cửa hang đầy nắng, Đa-vít giơ mảnh vạt áo lên).
  * [x] Gameplay (**Echo-Stealth & Mercy Restraint**): Bước êm qua các vũng nước và sỏi đá trong hang tối để không phát tiếng động, khuyên ngăn đồng đội đang muốn trả thù, tiếp cận cắt nhẹ góc vạt áo Sa-un rồi bước ra sườn núi đối thoại hòa bình.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sabbath` (Mercy in the Dark Cave 64 BPM, G major) — tĩnh lặng, hồi hộp nhưng thấm đẫm lòng kính sợ Thiên Chúa.
    * **Âm nền (Ambience):** `["wind"]` — tiếng giọt nước nhỏ trong hang đá vôi Ên Gê-đi.
    * **Mặt sàn (Surface):** `stone` (hang đá Ên Gê-đi).
    * **Hiệu ứng (SFX):** `pickup` (cắt mảnh vạt áo choàng), `bless` (Sa-un xúc động bật khóc nhận ra lòng nhân hậu của Đa-vít), `wrong` (dẫm phải đá gây tiếng vang).
* [x] **Stage 7 (`Stage07AbigailPeaceScene`):** *Bà A-bi-gai-in Khôn Ngoan Hòa Giải (`1 Sm 25, 1-35`)* ([Chi tiết](./scripts.md#stage-7-bà-a-bi-gai-in-khôn-ngoan-hòa-giải-1-sm-25-1-35))
  * [x] 🖼️ Ảnh mở màn: `intro-7.png` (Trên đường đèo núi Các-mên rợp bóng cây ô-liu, bà A-bi-gai-in hiền hậu dẫn đoàn lừa chở bánh và trái cây cúi chào, làm dịu cơn nóng giận của Đa-vít).
  * [x] Gameplay (**Caravan Logistics & Peace Diplomacy**): Thu thập đủ các phần lễ vật hòa bình (bánh mì, nho khô, bánh trái vả) và điều hướng đoàn lừa vượt qua hẻm núi sạt lở kịp đến gặp Đa-vít trước khi xung đột nổ ra.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `crafting` (Caravan of Peace 108 BPM, G major) — nhịp nhàng, khẩn trương nhưng tươi sáng, ca ngợi sự khôn ngoan hiền hòa.
    * **Âm nền (Ambience):** `["birds", "wind"]` — gió đồi núi Các-mên.
    * **Mặt sàn (Surface):** `sand` (đường mòn sườn núi).
    * **Hiệu ứng (SFX):** `pickup` (chất lễ vật lên lưng lừa), `chime` (vượt qua một khúc đèo), `bless` (Đa-vít chúc tụng Chúa vì sự khôn ngoan của bà A-bi-gai-in).
* [x] **Stage 8 (`Stage08SpearAndJugScene`):** *Cây Giáo & Bình Nước Trên Đồi Khắc-hi-la (`1 Sm 26, 1-25`)* ([Chi tiết](./scripts.md#stage-8-cây-giáo--bình-nước-trên-đồi-khắc-hi-la-1-sm-26-1-25))
  * [x] 🖼️ Ảnh mở màn: `intro-8.png` (Đêm trăng xanh trên đồi Khắc-hi-la; Đa-vít và A-bi-sai đứng bên vua Sa-un đang ngủ say giữa vòng chiến xa, nhẹ nhàng lấy cây giáo và bình nước bên đầu vua).
  * [x] Gameplay (**Night Camp Infiltration Puzzle**): Vượt qua mê cung 3 vòng doanh trại đang ngủ say của tướng Áp-ne và 3.000 quân dưới ánh trăng, lấy **Cây Giáo và Bình Nước** cắm ở đầu vua Sa-un và rút lên đỉnh đồi bên kia an toàn.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `serpent` (Moonlit Camp of Hachilah 88 BPM, C minor) — lén lút, tĩnh mịch giữa đêm khuya hoang địa.
    * **Âm nền (Ambience):** `["crickets", "wind"]` — tiếng dế đêm và gió sa mạc Zi-phơ.
    * **Mặt sàn (Surface):** `sand` (bãi đóng trại trên đồi Khắc-hi-la).
    * **Hiệu ứng (SFX):** `pickup` (rút cây giáo & lấy bình nước), `bless` (lời từ biệt và chúc lành cuối cùng giữa Sa-un và Đa-vít), `wrong` (chạm vào chiến xa/lính canh đang ngủ).

### Giai đoạn 6: Hồi 3 – Vương Triều Đa-vít & Giao Ước Vĩnh Cửu (`Stages 9–12`) + Epilogue
* [x] **Stage 9 (`Stage09SongOfTheBowScene`):** *Khúc Ca Cây Cung & Nước Mắt Tình Bạn (`2 Sm 1, 17-27`)* ([Chi tiết](./scripts.md#stage-9-khúc-ca-cây-cung--nước-mắt-tình-bạn-2-sm-1-17-27))
  * [x] 🖼️ Ảnh mở màn: `intro-9.png` (Dưới bầu trời đêm đầy sao trên đồi Giu-đa, Đa-vít ôm đàn hạc ngước nhìn chòm sao hiện lên hình ảnh chiếc vương miện của Sa-un và cây cung của người bạn tri kỷ Giô-na-than).
  * [x] Gameplay (**Musical Constellation & Memorial Composition**): Kết nối các vì sao kỷ niệm trên bầu trời đêm và gảy đàn hạc sáng tác *"Khúc Ca Cây Cung"* dạy cho con cái Giu-đa, biến nỗi đau thành lời cầu nguyện cao thượng không chút hận thù.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sorrowful` (Lament of the Bow 56 BPM, A minor) — sâu lắng, trang nghiêm, tưởng nhớ nghĩa tình cao đẹp.
    * **Âm nền (Ambience):** `["wind", "crickets"]` — đêm thanh vắng đầy sao.
    * **Mặt sàn (Surface):** `stone` (đài tưởng niệm trên đồi).
    * **Hiệu ứng (SFX):** `chime` (nối sao kỷ niệm & gảy cung đàn), `bless` (hoàn tất Khúc Ca Cây Cung tỏa sáng bầu trời).
* [x] **Stage 10 (`Stage10HebronCoronationScene`):** *Đăng Quang Tại Khép-rôn & Hiệp Nhất 12 Chi Tộc (`2 Sm 2, 1-4; 5, 1-5`)* ([Chi tiết](./scripts.md#stage-10-đăng-quang-tại-khép-rôn--hiệp-nhất-12-chi-tộc-2-sm-2-1-4-5-1-5))
  * [x] 🖼️ Ảnh mở màn: `intro-10.png` (Quảng trường thành Khép-rôn rực rỡ cờ hiệu của 12 Chi Tộc Ít-ra-en; các kỳ mục xức dầu và đội vương miện tôn Đa-vít làm Vua Mục Tử chăn dắt toàn dân).
  * [x] Gameplay (**Twelve-Tribe Banner Alignment Puzzle**): Đón các đoàn đại biểu từ khắp cõi Ít-ra-en, giải đố sắp xếp đúng **12 Cờ Hiệu Chi Tộc** vào các đài đá quanh Bàn Giao Ước tại Khép-rôn và thực hiện nghi thức xức dầu đăng quang.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `sinai` (Coronation at Hebron 104 BPM, C major) — uy nghi, rạng rỡ niềm vui hiệp nhất toàn dân.
    * **Âm nền (Ambience):** `["crowd", "wind"]` — tiếng reo mừng của đại hội 12 chi tộc.
    * **Mặt sàn (Surface):** `stone` (quảng trường đá thành Khép-rôn).
    * **Hiệu ứng (SFX):** `shofar` (kèn sừng cừu vang rền), `pickup` (nhận cờ hiệu chi tộc), `chime` (đặt đúng đài chi tộc), `bless` (xức dầu tôn phong Vua Ít-ra-en).
* [x] **Stage 11 (`Stage11GihonSpringZionScene`):** *Mạch Nước Gi-khôn & Thành Đô Xi-on (`2 Sm 5, 6-12; 1 Sb 11, 4-9`)* ([Chi tiết](./scripts.md#stage-11-mạch-nước-gi-khôn--thành-đô-xi-on-2-sm-5-6-12-1-sb-11-4-9))
  * [x] 🖼️ Ảnh mở màn: `intro-11.png` (Hai tầng cảnh: bên dưới là đường hầm mạch nước ngầm Gi-khôn xanh biếc dẫn lên thành; bên trên là Thành Đa-vít trên núi Xi-on nguy nga dưới ánh mặt trời).
  * [x] Gameplay (**Water-Shaft Flow Puzzle & Citadel Building**): Điều tiết các van đá của suối ngầm Gi-khôn để mở lối đi qua đường ống nước cổ (`Tsinnor`) vào mở cổng thành từ bên trong mà không đổ máu, sau đó xây dựng vòng tường thành Xi-on.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `crafting` (Building the City of David 108 BPM, G major) — nhịp điệu thông minh, khỏe khoắn dựng xây Kinh Đô Hòa Bình.
    * **Âm nền (Ambience):** `["wind"]` — tiếng nước chảy ngầm & gió trên đỉnh đồi Xi-on.
    * **Mặt sàn (Surface):** `stone` (đường hầm đá Gi-khôn & tường thành Xi-on).
    * **Hiệu ứng (SFX):** `splash` (điều tiết mực nước suối Gi-khôn), `door` (mở cổng thành Xi-on), `chime` / `bless` (hoàn thành Thành Đa-vít).
* [x] **Stage 12 (`Stage12ArkToJerusalemScene`):** *Rước Hòm Bia Giao Ước & Lời Hứa Vương Quốc Vĩnh Cửu (`2 Sm 6, 12-19; 7, 1-17`)* ([Chi tiết](./scripts.md#stage-12-rước-hòm-bia-giao-ước--lời-hứa-vương-quốc-vĩnh-cửu-2-sm-6-12-19-7-1-17))
  * [x] 🖼️ Ảnh mở màn: `intro-12.png` (Đại lễ rước Hòm Bia Giao Ước bằng vàng tiến vào Giê-ru-sa-lem; Vua Đa-vít mặc áo vải gai khiêm nhường nhảy múa gảy đàn trước Hòm Bia giữa tiếng kèn sừng cừu; bên trong Lều Thánh, ngôn sứ Na-than công bố Lời Hứa Vương Quốc Vĩnh Cửu).
  * [x] Gameplay (**Grand Procession Rhythm & Sacred Tent Finale**): Dẫn đoàn tư tế khiêng Hòm Bia qua đại lộ Giê-ru-sa-lem (cứ mỗi 6 bước dừng lại dâng lễ tạ ơn, hòa nhịp tiếng kèn tù và và điệu nhảy tạ ơn của Đa-vít), đặt Hòm Bia vào Lều Thánh, chia bánh cho toàn dân và lắng nghe ngôn sứ Na-than trao Lời Hứa Giao Ước.
  * [x] 🎬 Cutscene chuyển tiếp kết màn (**Từ Ngai Vàng Đa-vít Đến Ngôi Sao Bê-lem** – `2 Sm 7, 12-16; Lc 1, 32-33`): Kết nối lời hứa của Thiên Chúa với Đa-vít tới ngày Sứ thần Gáp-ri-en truyền tin cho Đức Trinh Nữ Maria về **Đức Giêsu – Con Vua Đa-vít, Vua Muôn Đời**.
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `tabernacle` (Procession of the Ark to Zion 96 BPM, G major) — tưng bừng, thánh thiêng, đại lễ phụng vụ tạ ơn Chúa ngự giữa thành thánh.
    * **Âm nền (Ambience):** `["crowd", "wind"]` — toàn dân Giê-ru-sa-lem reo hò mừng rỡ.
    * **Mặt sàn (Surface):** `stone` (đại lộ đá Giê-ru-sa-lem & Lều Thánh Xi-on).
    * **Hiệu ứng (SFX):** `shofar` (tiếng kèn sừng cừu vang dội), `tambourine` (nhịp múa tạ ơn), `bless` / `complete` (Hòm Bia an vị trong Lều Thánh & Lời Hứa Vương Quốc Vĩnh Cửu).
* [x] **Màn Kết (`EpilogueScene`):** *Con Vua Đa-vít – Vị Vua Tình Yêu Muôn Đời (`Lc 1, 32-33; Ga 10, 11; Kh 22, 16`)* ([Chi tiết](./scripts.md#màn-kết-con-vua-đa-vít--vị-vua-tình-yêu-muôn-đời-lc-1-32-33-ga-10-11))
  * [x] 🖼️ Ảnh mở màn: `intro-end.png` (Căn phòng bình minh; Kinh Thánh mở bên Cây Đàn Hạc & Vương Miện Đa-vít, Hai Bia Đá Môi-sê, Tàu Nô-ê, Cuộn Sáng Thế và Chuỗi Mân Côi).
  * [x] Gameplay: 3 kết nối đức tin của Người Mục Tử & Vị Vua Tình Yêu (Mục tử chăn chiên Bê-lem $\rightarrow$ Chúa Giêsu Mục Tử Nhân Lành; Đàn hạc Thánh Vịnh & Lòng khoan dung $\rightarrow$ Đời sống cầu nguyện và tha thứ; Ngai vàng Đa-vít $\rightarrow$ Chúa Giêsu Con Vua Đa-vít trị vì muôn đời).
  * [x] 🎵 Âm thanh & Nhạc nền:
    * **Nhạc nền (BGM):** `lullaby` (Son of David, King Forever 70 BPM, C major) — trọn vẹn, bình an, khúc kết thúc hành trình đức tin.
    * **Âm nền (Ambience):** `["crickets"]` — căn phòng bình yên buổi sớm.
    * **Mặt sàn (Surface):** `wood` (sàn phòng ngủ).
    * **Hiệu ứng (SFX):** `chime` (nối kết mầu nhiệm Tân Ước), `bless` (bình an cứu độ), `complete` (khải hoàn hoàn thành trọn vẹn hành trình Vua Đa-vít).
* [x] Kiểm tra hiển thị thực tế tất cả 14 ảnh minh họa mở màn (cùng ảnh bìa) và 14 bản đồ Top-down ở độ phóng đại game (`npm run dev`), đảm bảo `npx tsc --noEmit` và `npm run build` đều pass sạch.

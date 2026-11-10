# KẾ HOẠCH DỰ ÁN: NOAH'S ARK (CON TÀU NÔ-Ê & CẦU VỒNG GIAO ƯỚC)

## 1. TỔNG QUAN DỰ ÁN
* **Tên Module:** `modules/noahs-ark` (Route: `/noahs-ark`).
* **Thể loại:** 2D Top-Down Retro Multi-Genre Puzzle & Action RPG (Pixel Art 8-bit vẽ bằng code theo chuẩn lưới `pixelArt.ts`).
* **Mục tiêu:** Giúp thiếu nhi và người chơi tìm hiểu Sách Sáng Thế Chương 6–9 (Sự công chính của ông Nô-ê, việc đóng Con Tàu Cứu Độ, tập hợp muôn loài, vượt qua cơn Đại Hồng Thủy và Cầu Vồng Giao Ước Vĩnh Cửu `St 9, 13`) qua **8 màn chơi chính** (+ Prologue & Epilogue) với **8 thể loại gameplay khác nhau**.
* **Điểm nhấn thiết kế:**
  1. **🎨 Màn Hình Minh Họa Pixel Art Mở Màn (`StageIntroIllustration`):** Khi bắt đầu mỗi màn chơi và chạy hộp thoại dẫn nhập (Intro Dialogue), vùng màn hình phía trên hiển thị một **bức tranh minh họa Pixel Art toàn cảnh giàu chi tiết** (có bố cục tiền cảnh – trung cảnh – hậu cảnh và animation 2–4 frames). Sau khi kết thúc hội thoại mở màn, màn hình chuyển cảnh mượt mà (Pixel Wipe / Fade) vào bản đồ Top-down.
  2. **🎮 Đa thể loại (Multi-Genre) & Cơ chế Checkpoint (Soft Reset):** Mỗi Stage sở hữu một luật chơi riêng (giữ ngọn đèn công chính giữa bóng tối, thu thập gỗ bách & ghép khung tàu, phân loại & dẫn từng cặp thú lên khoang, gia cố chống thấm theo thời gian, giữ thăng bằng trọng tâm tàu & chăm sóc thú vật, điều hướng dòng hải lưu về núi A-ra-rát, điều khiển chim quạ & bồ câu bay tìm nhành ô-liu, hội tụ lăng kính 7 sắc cầu vồng). Đi sai bước hoặc chạm chướng ngại sẽ lùi về Checkpoint gần nhất.
* **Kịch bản chi tiết:** Đồng bộ tuyệt đối theo tài liệu [`scripts.md`](./scripts.md).

---

## 2. KIẾN TRÚC KỸ THUẬT & TÁI SỬ DỤNG (`modules/shared`)
* **Tái sử dụng từ `modules/shared/`:**
  * `CharacterCreationModal`, `CharacterPreview`, `DialogueBox`, `VirtualController`, `DesktopControlHint`.
  * `EventBus`, `AudioManager`, `Player`, `pixelArt` (`PAL`, `drawMap`, `rect`, `glowCanvas`, `addSpriteSheet`), `playerTextureGenerator`.
* **Thành phần riêng trong `modules/noahs-ark/`:**
  ```text
  modules/noahs-ark/
    NoahsArk.tsx                    # Client root component được mount bởi app/noahs-ark/page.tsx
    scripts.md                      # Kịch bản chi tiết & thiết kế gameplay 8 stages + Prologue/Epilogue
    plan.md                         # Lộ trình phát triển (file này)
    components/
      GameContainer.tsx             # Wrapper mount Phaser canvas
      NoahHUD.tsx                   # HUD Mô Hình Tàu Nô-ê & 8 Ấn Dấu Cầu Vồng Giao Ước + Nút Reset Checkpoint
      SaveLoadModal.tsx             # Lưu/Tải tiến trình & Export/Import JSON
    data/
      stagesData.ts                 # Dữ liệu 8 Stages + Prologue/Epilogue (Lời Chúa, Hoa trái, Nhiệm vụ, Tranh mở màn)
      dialogues.ts                  # Lời thoại song ngữ VI / EN
    types/
      game.ts                       # SaveData, StageKey, StageProgress, GenreState
    utils/
      saveManager.ts                # Quản lý localStorage (key riêng: "noahs_ark_save_v1")
    game/
      config.ts                     # Phaser Game Config (`pixelArt: true`, `roundPixels: true`)
      scenes/
        BootScene.ts
        PreloadScene.ts
        BaseNoahScene.ts            # Base scene: hỗ trợ Intro Pixel Illustration overlay, Checkpoint reset, Grace Pips
        stages/                     # PrologueScene + Stage01..Stage08 + EpilogueScene
      utils/
        introIllustrations.ts       # Bộ generator vẽ tranh Pixel Art toàn cảnh + animation cho 10 màn (Prologue + 8 Stages + Epilogue)
        noahTextures.ts             # NPC (Nô-ê, Vợ & 3 con trai Sem, Kham, Gia-phét), các cặp thú, gỗ bách, nhựa thông, chim quạ, bồ câu, cầu vồng
  ```

---

## 3. SCHEMA DỮ LIỆU LƯU GAME (`SaveData`)
```typescript
import type { CharacterCustomization } from "@/modules/shared/types";

export type NoahStageKey =
  | "prologue_canh_chim_va_con_tau"
  | "stage_01_nguoi_cong_chinh"
  | "stage_02_ban_ve_go_bach"
  | "stage_03_muon_thu_len_tau"
  | "stage_04_dong_cua_mua_lu"
  | "stage_05_lenh_denh_bien_nuoc"
  | "stage_06_dinh_nui_ararat"
  | "stage_07_nhanh_la_oliu"
  | "stage_08_cau_vong_giao_uoc"
  | "epilogue_con_tau_hoi_thanh";

export interface NoahSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: NoahStageKey;
  currentStageIndex: number; // 0 đến 7 (8 Ấn Dấu Cầu Vồng chính)
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  stagesProgress: {
    [key in NoahStageKey]?: {
      completed: boolean;
      tokenLit: boolean;        // Ấn Dấu Cầu Vồng Giao Ước đã thắp sáng
      bestAttempts?: number;    // Số lần thử / hoàn thành
    };
  };
}
```

---

## 4. LỘ TRÌNH THỰC HIỆN TỪNG BƯỚC (ROADMAP)

### Giai đoạn 1: Khởi tạo Module, Route & Hệ thống Lưu trữ (Foundation)
* [x] Tạo route `app/noahs-ark/page.tsx` và thêm thẻ game **Noah's Ark** (kèm ảnh bìa pixel `/games/noahs-ark.png`) vào trang chủ `app/page.tsx`.
* [x] Xây dựng `types/game.ts`, `data/stagesData.ts` (song ngữ VI/EN) và `utils/saveManager.ts` (lưu độc lập tại key `noahs_ark_save_v1`).
* [x] Dựng `NoahsArk.tsx`, `GameContainer.tsx`, `NoahHUD.tsx` (hiển thị **Bản Đồ Con Tàu & 8 Sắc Ấn Cầu Vồng Giao Ước**, nút xem Suy Niệm và nút **Thử lại Checkpoint** nhanh).

### Giai đoạn 2: Base Scene, Hệ thống Tranh Minh Họa Mở Màn & Cơ chế Lõi
* [x] Xây dựng `BaseNoahScene.ts`:
  * [x] Chế độ **Intro Pixel Illustration Mode**: Khi vào màn, hiển thị khung tranh minh họa toàn cảnh (`introIllustrations.ts`) có viền khung tranh cổ điển, hiệu ứng chuyển động pixel (2–4 frames + particles) trong suốt lúc hộp thoại dẫn nhập đang mở; khi đóng hộp thoại dẫn nhập thì thực hiện hiệu ứng chuyển cảnh (Pixel Wipe / Fade) mở ra bản đồ Top-down.
  * [x] Hệ thống **Checkpoint / Soft Reset**: API `this.saveCheckpoint(id, state)` và `this.resetToCheckpoint()` kèm hiệu ứng lóe sáng nhẹ + âm báo khích lệ khi người chơi cần thử lại.
  * [x] Hỗ trợ **Grace Pips (3 Giọt Bình An)** cho các màn hành động/thời gian thực.
* [x] Xây dựng `noahTextures.ts`: Sprite Tổ phụ Nô-ê, Gia đình Nô-ê (Vợ và 3 người con Sem, Kham, Gia-phét), Chim Bồ Câu, Chim Quạ, các cặp thú (sư tử, chiên, voi, hươu, ngựa vằn, thỏ, rùa, chim bồ câu), gỗ bách, thùng nhựa thông, bàn thờ đá và dải cầu vồng đúng chuẩn lưới chibi 32×32 / 16px tile grid.

### Giai đoạn 3: Khúc Dạo Đầu (Prologue)
* [x] **Màn Mở Đầu (`PrologueScene`):** *Cơn Mưa Chiều & Mô Hình Con Tàu Gỗ (`St 6, 8-9`; `1 Pr 3, 20`)* ([Chi tiết](./scripts.md#màn-mở-đầu-cơn-mưa-chiều--mô-hình-con-tàu-gỗ-st-6-8-9-1-pr-3-20))
  * [x] 🎨 Tranh mở màn: Bên khung cửa sổ mưa rơi lất phất, Lữ khách nhìn chiếc cầu vồng ló dạng sau mưa và mở trang sách Sáng Thế chương 6 cạnh mô hình con tàu gỗ nhỏ.
  * [x] Bản đồ & Gameplay: Phòng nhỏ ngày mưa, đóng cửa sổ chắn mưa tạt, ghép 3 mảnh ghép gỗ bách của mô hình tàu (*Đức Tin – Vâng Phục – Cứu Độ*) và nhận **Hải Đồ Giao Ước (0/8 Ấn Dấu)**.

### Giai đoạn 4: Phần 1 – Đóng Tàu & Tập Hợp Muôn Loài (`Stages 1–4`)
* [x] **Stage 1 (`Stage01RighteousNoahScene`):** *Người Công Chính Giữa Thế Gian (`St 6, 5-13`)* ([Chi tiết](./scripts.md#stage-1-người-công-chính-giữa-thế-gian-st-6-5-13))
  * [x] 🎨 Tranh mở màn: Giữa vùng đất tối tăm ồn ào đầy khói đen bất chính, ông Nô-ê quỳ cầu nguyện dưới cột sáng vàng ấm áp từ trời cao.
  * [x] Gameplay (**Lantern Purity & Shadow Stealth**): Cầm Đèn Công Chính đi qua 3 khu vực làng mạc đang chìm trong Sương Đen Bạo Lực, tránh vùng quét của Bóng Tối Xấu Xa, thắp sáng 4 Bàn Thờ Gia Đình để đến nơi lắng nghe Lời Chúa phán dạy ông Nô-ê.
* [x] **Stage 2 (`Stage02GopherArkScene`):** *Bản Vẽ Gỗ Bách & Nhựa Thông (`St 6, 14-16`)* ([Chi tiết](./scripts.md#stage-2-bản-vẽ-gỗ-bách--nhựa-thông-st-6-14-16))
  * [x] 🎨 Tranh mở màn: Đại công trường đóng tàu khổng lồ với khung sườn gỗ bách 3 tầng (dài 300 thước, rộng 50 thước, cao 30 thước), ông Nô-ê và 3 người con đang phết nhựa thông chống thấm.
  * [x] Gameplay (**Blueprint Sokoban & Crafting Puzzle**): Thu thập và đẩy các Kiện Gỗ Bách và Thùng Nhựa Thông trên hệ thống ròng rọc/đường trượt để lắp khít **3 Tầng Khung Tàu** (Tầng Đáy – Tầng Giữa – Tầng Thượng có cửa sổ) đúng theo bản vẽ Chúa truyền.
* [x] **Stage 3 (`Stage03AnimalPairsScene`):** *Muôn Thú Từng Đôi Lên Tàu (`St 6, 19-22; 7, 1-9`)* ([Chi tiết](./scripts.md#stage-3-muôn-thú-từng-đôi-lên-tàu-st-6-19-22-7-1-9))
  * [x] 🎨 Tranh mở màn: Cầu dẫn lớn lên cửa tàu Nô-ê với từng cặp voi, hươu cao cổ, sư tử, chiên con và đàn chim nối đuôi nhau tiến vào trong ánh hoàng hôn trước cơn bão.
  * [x] Gameplay (**Pair Matching & Herding Routing Puzzle**): Tìm các cặp thú bị lạc quanh thung lũng, mở/đóng các cổng rào gỗ để dẫn từng đôi thú vào đúng khoang tàu quy định (Khoang Thú Ăn Cỏ, Khoang Thú Lớn, Khoang Chim Trời) mà không để thú dữ cắt ngang đường thú hiền (nguyên tắc *Sông Nước – Cừu – Sói*).
* [x] **Stage 4 (`Stage04FloodDoorsScene`):** *Cánh Cửa Đóng Lại & Bốn Mươi Đêm Mưa (`St 7, 10-16`)* ([Chi tiết](./scripts.md#stage-4-cánh-cửa-đóng-lại--bốn-mươi-đêm-mưa-st-7-10-16))
  * [x] 🎨 Tranh mở màn: Mưa thác đổ từ bầu trời đen kịt và các mạch nước vực thẳm phun trào; một bàn tay ánh sáng của Thiên Chúa từ bên ngoài khép chặt cánh cửa lớn của con tàu.
  * [x] Gameplay (**Time-Management Hull Sealing Defense**): Mưa lớn bắt đầu dội xuống! Trong thời gian đếm ngược 3 đợt sóng dâng, chạy khắp boong tàu mang Nhựa Thông và Chốt Gỗ bịt kín các điểm rò nước, khóa chặt 6 cửa thông gió trước khi mực nước chạm đỉnh và Chúa đóng cửa tàu.

### Giai đoạn 5: Phần 2 – Vượt Đại Hồng Thủy & Cầu Vồng Giao Ước (`Stages 5–8`)
* [x] **Stage 5 (`Stage05ArkVoyageScene`):** *Lênh Đênh Trên Biển Nước Mênh Mông (`St 7, 17-24`)* ([Chi tiết](./scripts.md#stage-5-lênh-đênh-trên-biển-nước-mênh-mông-st-7-17-24))
  * [x] 🎨 Tranh mở màn: Con tàu Nô-ê đơn độc nhưng vững chãi nổi trên biển nước bao la che phủ mọi đỉnh núi cao; bên trong khoang tàu ấm áp ánh đèn dầu, gia đình Nô-ê đang chăm sóc muôn loài.
  * [x] Gameplay (**Ark Balance & Caretaking Multitask**): Khi sóng lớn đánh nghiêng mạn tàu (thanh cân bằng nghiêng Trái/Phải), người chơi phải dịch chuyển các Kiện Lương Thực đối trọng để giữ tàu cân bằng, đồng thời mang cỏ khô/hạt giống và thắp đèn trấn an 6 khoang thú đang hoảng sợ.
* [x] **Stage 6 (`Stage06AraratWindScene`):** *Ngọn Gió Của Chúa & Đỉnh Núi A-ra-rát (`St 8, 1-5`)* ([Chi tiết](./scripts.md#stage-6-ngọn-gió-của-chúa--đỉnh-núi-a-ra-rát-st-8-1-5))
  * [x] 🎨 Tranh mở màn: Thiên Chúa nhớ đến ông Nô-ê; một làn gió lớn thổi tan mây đen, mực nước rút dần để lộ chỏm núi A-ra-rát hùng vĩ nơi con tàu đang từ từ neo đậu.
  * [x] Gameplay (**Current Navigation & Reef Avoidance**): Điều khiển bánh lái và giương buồm đón **Luồng Gió Của Chúa**, dẫn con tàu vượt qua mê cung các mỏm đá ngầm mới nhô lên và xoáy nước rút để cập bến an toàn tại đỉnh núi A-ra-rát.
* [x] **Stage 7 (`Stage07OliveDoveScene`):** *Cánh Quạ & Chim Bồ Câu Ngậm Nhành Ô-liu (`St 8, 6-12`)* ([Chi tiết](./scripts.md#stage-7-cánh-quạ--chim-bồ-câu-ngậm-nhành-ô-liu-st-8-6-12))
  * [x] 🎨 Tranh mở màn: Khung cửa sổ tầng thượng mở ra bầu trời bình minh trong trẻo; chú chim bồ câu trắng đang bay về phía bàn tay ông Nô-ê, mỏ ngậm một nhành lá ô-liu xanh tươi lấp lánh sương sớm.
  * [x] Gameplay (**3-Phase Flight Scouting Action**): Điều khiển hành trình bay qua 3 đợt thả chim: Đợt 1 (Chim Quạ & Bồ Câu lần 1 bay khảo sát tìm chỗ đậu giữa mặt nước), Đợt 2 (Chim Bồ Câu lần 2 vượt các luồng gió lốc tìm cây ô-liu vừa nhú trên sườn đồi và mang nhành lá xanh về tàu), Đợt 3 (Bay mở đường báo hiệu mặt đất đã khô ráo).
* [x] **Stage 8 (`Stage08RainbowCovenantScene`):** *Bàn Thờ Tạ Ơn & Cầu Vồng Giao Ước (`St 8, 15 – 9, 17`)* ([Chi tiết](./scripts.md#stage-8-bàn-thờ-tạ-ơn--cầu-vồng-giao-ước-st-8-15--9-17))
  * [x] 🎨 Tranh mở màn: Trên sườn núi A-ra-rát xanh tươi, gia đình Nô-ê quỳ quanh bàn thờ đá dâng lễ tạ ơn, muôn thú tỏa đi khắp mặt đất, và trên bầu trời mây trắng hiện lên **Cầu Vồng Bảy Sắc** rực rỡ nối liền trời đất.
  * [x] Gameplay (**Altar Building & 7-Color Prism Harmony Finale**): Pha 1 thu thập 12 viên đá tinh tuyền dựng Bàn Thờ Tạ Ơn; Pha 2 xoay các Trụ Tinh Thể Giọt Mưa để tách tia nắng mặt trời thành đúng **7 Sắc Cầu Vồng (Đỏ – Cam – Vàng – Lục – Lam – Chàm – Tím)** chiếu vào Vòm Cung Giao Ước.

### Giai đoạn 6: Khúc Vĩ Thanh (Epilogue) & Kiểm định Chất lượng
* [x] **Màn Kết (`EpilogueScene`):** *Con Tàu Hội Thánh & Nhành Ô-liu Bình An (`St 9, 13; 1 Pr 3, 20-21`)* ([Chi tiết](./scripts.md#màn-kết-con-tàu-hội-thánh--nhành-ô-liu-bình-an-st-9-13-1-pr-3-20-21))
  * [x] 🎨 Tranh mở màn: Căn phòng nhỏ sau cơn mưa ngập tràn ánh nắng cầu vồng, mô hình tàu Nô-ê đặt cạnh cuốn Kinh Thánh và Chuỗi Mân Côi.
  * [x] Gameplay: Thực hiện 3 cam kết của **Người Thủy Thủ Đức Tin** (kiên vững làm điều lành dù xung quanh chạy theo điều xấu, kết nối Nước Hồng Thủy với Bí tích Rửa Tội & Con Tàu Hội Thánh, mang nhành ô-liu hòa bình đến cho mọi người).
* [ ] Kiểm tra hiển thị thực tế tất cả 10 bức tranh Intro Pixel Illustration và 10 bản đồ Top-down ở độ phóng đại game (`npm run dev`), đảm bảo `npx tsc --noEmit`, `npx eslint modules app` và `npx next build` đều pass sạch.

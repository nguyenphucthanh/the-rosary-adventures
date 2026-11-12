# KẾ HOẠCH DỰ ÁN: JOSEPH – THE COAT OF THE SUN (GIUSE – CHIẾC ÁO MẶT TRỜI)

## 1. TỔNG QUAN DỰ ÁN
* **Tên Module:** `modules/joseph-coat-of-the-sun` (Route: `/joseph-coat-of-the-sun`).
* **Thể loại:** 2D Top-Down Retro Multi-Genre Puzzle & Action RPG (Pixel Art 8-bit vẽ bằng code theo chuẩn lưới `pixelArt.ts`), mobile-first.
* **Mục tiêu:** Giúp thiếu nhi tìm hiểu Sách Sáng Thế chương 37 – 50 (`St 37 – 50`): cậu út Giuse được cha yêu thương và có những giấc mơ, bị các anh ghen ghét bán sang Ai-cập, trung tín trong nhà ông Pút-ti-phác, bị vu oan phải vào ngục, giải mộng cho Pha-ra-ô, được tôn làm tể tướng, cứu dân Ai-cập và gia đình mình khỏi nạn đói, rồi tha thứ cho các anh. Qua **12 màn chơi** (+ Prologue & Epilogue), mỗi màn một thể loại gameplay.
* **Chủ đề xuyên suốt:** *"Anh em đã toan tính điều ác cho tôi, nhưng Thiên Chúa lại toan tính cho nó thành điều tốt"* (`St 50, 20`) → **Thiên Chúa viết thẳng trên đường cong**; tha thứ thay cho trả thù; trung tín khi bị bỏ rơi.
* **Chiếc Áo Mặt Trời (vật phẩm xuyên suốt):** áo choàng dài tay của Giuse (`St 37, 3`), vẽ vàng – cam như mặt trời với **12 tia nắng = 12 người con của Gia-cóp**. Bị xé & nhuộm máu dê ở Stage 3, bị bỏ lại trong tay bà chủ ở Stage 6, và được vá lành – khoác lên vai Ben-gia-min/các anh trong Epilogue. Mỗi Stage hoàn thành thắp sáng **1 tia nắng** trên HUD.
* **Điểm nhấn thiết kế** (kế thừa King David / Moses): Ảnh minh họa mở màn (`StageIntroIllustration`), Checkpoint + 3 Giọt Bình An (Grace Pips), cutscene nối cầu, mỗi màn một luật chơi.
* **Ngôn ngữ & dịch thuật:** song ngữ VI/EN; **bản dịch Công Giáo** (Bản Việt ngữ 2011 / CGKPV), xem mục *Catholic Bible vocabulary* trong `AGENTS.md`. Đã chốt bảng tên riêng ở `scripts.md` (mục *Bảng thuật ngữ*).
* **Kịch bản chi tiết:** [`scripts.md`](./scripts.md). **Prompt ảnh:** [`image-prompts.md`](./image-prompts.md).

---

## 2. BẢNG 12 MÀN (TỔNG QUAN)

| # | Địa điểm | Sự kiện (`St`) | Thể loại gameplay | Tia nắng / Đức tính |
|---|---|---|---|---|
| P | Phòng học | Mở sách, nhận áo & bản đồ | Ghép 3 mảnh bản đồ | – |
| 1 | Hếp-rôn – ruộng lúa | Giấc mơ bó lúa, mặt trời – mặt trăng – 11 vì sao (37, 1-11) | Gặt & dựng bó lúa theo mẫu giấc mơ | Biết ơn |
| 2 | Hếp-rôn → Sê-khem → Đô-than | Cha sai đi thăm anh, người lạ chỉ đường (37, 12-17) | Tìm đường (hỏi đường, mê lộ đồi) | Vâng lời |
| 3 | Giếng cạn Đô-than | Bị lột áo, thả xuống giếng; Rúp-ben, Giu-đa (37, 18-28) | Né & giải cứu: giữ bình tĩnh, cầu nguyện (thang dây) | Can đảm |
| 4 | Đường lái buôn sa mạc | Bán 20 đồng bạc, đi Ai-cập; cha khóc áo (37, 25-36) | Runner sa mạc: nước, ốc đảo, lạc đà | Hy vọng |
| 5 | Nhà ông Pút-ti-phác | Được tin cậy, "Đức Chúa ở với ông Giuse" (39, 1-6) | Quản gia: sắp xếp việc nhà theo giờ | Trung tín |
| 6 | Hành lang dinh thự | Từ chối điều xấu, bỏ áo chạy (39, 7-20) | Chạy hành lang: đóng cửa, chọn đúng lối | Liêm khiết |
| 7 | Ngục Pha-ra-ô | Giải mộng quan tửu chánh & quan thượng thiện (39, 21 – 40, 23) | Ghép biểu tượng giấc mơ | Phục vụ |
| 8 | Cung Pha-ra-ô | Giấc mơ 7 bò, 7 bông lúa; giải mộng (41, 1-36) | Trí nhớ: dãy 7 béo / 7 gầy, sắp lịch 7+7 năm | Khiêm nhường |
| 9 | Khắp Ai-cập | Làm tể tướng, xây kho lúa 7 năm no (41, 37-52) | Xây & thu gom lúa (quản lý tài nguyên nhẹ) | Khôn ngoan |
| 10 | Kho lúa Ai-cập | Nạn đói, "Hãy đến với ông Giuse", các anh tới (41, 53 – 42, 38) | Phát lúa công bằng (hàng người, khẩu phần) | Chia sẻ |
| 11 | Phòng yến tiệc | Chén bạc & Ben-gia-min; Giu-đa xin thế mạng (43 – 44) | Tìm chén bạc trong bao lúa + lựa chọn lương tâm | Hối cải |
| 12 | Gô-sen | "Tôi là Giuse em các anh", cha con đoàn tụ (45; 46; 50, 15-21) | Rước xe & ôm nhau: nối các đường, trao quà | Tha thứ |
| E | Phòng học | Chiếc áo được vá; Giuse ↔ Chúa Giê-su | Cutscene | – |

---

## 3. KIẾN TRÚC KỸ THUẬT (theo `modules/king-david`)
```text
modules/joseph-coat-of-the-sun/
  JosephCoatOfTheSun.tsx          # root, mount bởi app/joseph-coat-of-the-sun/page.tsx
  plan.md  scripts.md  image-prompts.md
  images/                         # cover.png, intro-start.png, intro-1..12.png, intro-end.png
  components/
    GameContainer.tsx
    JosephHUD.tsx                 # Chiếc Áo Mặt Trời 12 tia + nút Thử lại Checkpoint
  data/
    stagesData.ts                 # 12 stage + prologue/epilogue, cặp { vi, en }
    dialogues.ts
  types/game.ts                   # JosephSaveData, JosephStageKey
  utils/saveManager.ts            # key "joseph_coat_sun_save_v1"
  game/
    config.ts                     # pixelArt:true, roundPixels:true
    scenes/ BootScene, PreloadScene, BaseJosephScene, stages/ (Prologue, Stage01..12, Epilogue)
    utils/josephTextures.ts       # NPC + props (xem mục 5)
```
* Tái sử dụng `modules/shared/` (EventBus, AudioManager, Player, pixelArt, DialogueBox, VirtualController, i18n). Người chơi = **lữ khách nhỏ** đồng hành cùng Giuse (như các game trước); Giuse là NPC có 3 trạng thái trang phục: *áo mặt trời* (St 37), *áo nô lệ / tù nhân* (St 39–40), *phẩm phục tể tướng* (St 41+).
* Thêm `speakers.ts` các tên: Giuse, Gia-cóp, Rúp-ben, Giu-đa, Ben-gia-min, Pút-ti-phác, Pha-ra-ô, quan tửu chánh, quan thượng thiện, lái buôn Ít-ma-en.
* Schema save: `currentStageKey` (`prologue`, `stage_01_giac_mo_bo_lua` … `stage_12_goshen_tha_thu`, `epilogue`), `raysLit: number` (0–12), `player {customization,x,y,direction}`, `stageProgress`.

---

## 4. TÀI NGUYÊN ĐỒ HỌA (pixel trong code, quy tắc `AGENTS.md`)
* **Chibi grid 32×32**; Gia-cóp & Pha-ra-ô khung rộng; **lạc đà 48×32** (khung 2 frame); Pha-ra-ô có khăn nemes vàng-xanh, tể tướng Giuse có vòng cổ vàng + nhẫn.
* Tile: đồng lúa Hếp-rôn, đồi đá Đô-than, cát sa mạc, gạch cung điện Ai-cập, đá ngục, kho lúa bùn-gạch, đồng bằng Gô-sen.
* Props: bó lúa, giếng cạn + dây, bao lúa, chén bạc, bình rượu, giỏ bánh, lạc đà, thuyền buồm sông Nin, cột hoa sen, tượng Ai-cập *(trang trí trung tính, không thờ phượng – xem ghi chú ở scripts)*.
* Ánh sáng: cửa sổ ngục (tia nắng bậc thang), đuốc cung điện, mặt trời sa mạc; áo mặt trời có halo pixel.

---

## 5. LỘ TRÌNH THỰC HIỆN (ROADMAP)

### Giai đoạn 0: Tài liệu (tài liệu này)
* [x] `plan.md`, `scripts.md`, `image-prompts.md`; cập nhật `AGENTS.md` mục *Catholic Bible vocabulary*.
* [ ] Duyệt bảng thuật ngữ & câu trích với bản CGKPV 2011 (các mục đánh dấu `[kiểm lại CGKPV]`).

### Giai đoạn 1: Foundation
* [x] Route `app/joseph-coat-of-the-sun/page.tsx`; thẻ game ở `app/page.tsx`; cover `/public/games/joseph-coat-of-the-sun.png`.
* [x] `types/game.ts`, `data/stagesData.ts` (VI/EN), `utils/saveManager.ts`, `JosephCoatOfTheSun.tsx`, `GameContainer.tsx`, `JosephHUD.tsx` (Áo Mặt Trời 12 tia).
* [x] Thêm nhạc/âm (Stage 1–4) vào `modules/shared/game/audio/tracks.ts` nếu cần (gợi ý mỗi stage ở scripts.md).
* [x] Thêm speakers vào `modules/shared/speakers.ts`.

### Giai đoạn 2: Base Scene & Cơ chế lõi
* [x] `BaseJosephScene`: intro illustration overlay → fade vào map; `saveCheckpoint/resetToCheckpoint`; 3 Giọt Bình An; nút A/B theo màn; `safeInsetTop/Bottom` cho HUD.
* [x] `josephTextures.ts`: nhân vật & props mục 4, đăng ký idempotent.

### Giai đoạn 3: Prologue + Hồi 1 – Quê nhà & bị bán (`Prologue, Stages 1–4`)
* [x] Prologue · [x] Stage 1 · [x] Stage 2 · [x] Stage 3 · [x] Stage 4 (code done, intro images + music pass still pending)

### Giai đoạn 4: Hồi 2 – Ai-cập: Nô lệ & Tù nhân (`Stages 5–8`)
* [x] Stage 5 · [x] Stage 6 · [x] Stage 7 · [x] Stage 8 (code done; intro images pending)

### Giai đoạn 5: Hồi 3 – Tể tướng & Tha thứ (`Stages 9–12`) + Epilogue
* [x] Stage 9 · [x] Stage 10 · [x] Stage 11 · [x] Stage 12 · [x] Epilogue (code done; intro images pending; kết thúc dùng hộp thoại "Ở lại / Về trang chủ" như King David, không dùng `EndingCongrats`)

### Giai đoạn 6: Hoàn thiện
* [ ] Ảnh minh họa (14 ảnh) đưa vào `images/` + `public/games/joseph-coat-of-the-sun/intro/`.
* [ ] Kiểm tra song ngữ toàn bộ chuỗi; kiểm tra thuật ngữ Công Giáo bằng grep (bảng "Never" trong `AGENTS.md`).
* [ ] `npx tsc --noEmit`, `npx eslint`, chơi thử mobile + desktop ở zoom nguyên.

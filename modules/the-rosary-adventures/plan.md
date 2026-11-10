# KẾ HOẠCH DỰ ÁN: GAME 20 MẦU NHIỆM MÂN CÔI (WEB 2D RPG)

## 1. TỔNG QUAN DỰ ÁN
* **Thể loại:** 2D Top-Down Retro RPG (Pixel Art 8-bit phong cách Pokémon cổ điển).
* **Mục tiêu:** Giúp các bạn nhỏ và người chơi học, nhớ và suy niệm 20 Mầu Nhiệm Mân Côi qua cơ chế du hành, tương tác NPC và giải đố nhẹ nhàng.
* **Đối tượng & Thiết bị mục tiêu:** **Ưu tiên Mobile & Tablet** (phù hợp với thói quen của trẻ em), đồng thời hỗ trợ đầy đủ Desktop.
* **Trải nghiệm Mobile & Desktop linh hoạt:** 
  * Game Canvas luôn tràn toàn màn hình (`w-screen h-dvh`, auto-resize / fullscreen).
  * **Trên thiết bị cảm ứng (Mobile/Tablet):** Tự động hiển thị cụm tay cầm ảo On-Screen Controller (D-pad nổi ở góc trái dưới, cụm phím hành động A/B ở góc phải dưới) với hiệu ứng rung nhẹ (haptics) và phím bấm lớn cho thiếu nhi.
  * **Trên máy tính (Desktop/Laptop):** Tự động ẩn tay cầm ảo, hiển thị thanh hướng dẫn phím bấm retro tinh gọn ở đáy màn hình (`W/A/S/D / Phím mũi tên`, `Space / Enter`, `Esc`).
  * Có nút chuyển đổi nhanh chế độ điều khiển và nút bật/tắt toàn màn hình (Fullscreen).
* **Phân kỳ nội dung & Đồng bộ kịch bản:** Toàn bộ nội dung, địa điểm, nhân vật, sự hiện diện của Chúa Giêsu / Chúa Thánh Thần, câu đố và hoa trái suy niệm của Màn Mở Đầu (Prologue), 20 chặng Mầu Nhiệm cùng Màn Kết (Epilogue) được quy định chi tiết và đồng bộ tuyệt đối theo tài liệu: [`stage-scripts.md`](./stage-scripts.md).

### Cấu trúc chuẩn của mỗi chặng (theo stage-scripts.md):
1. **Dẫn nhập (Intro Cutscene):** Câu Lời Chúa chủ đề và bối cảnh lịch sử cứu độ.
2. **Bản đồ & Nhân vật xuất hiện:** Không gian địa lý, NPC đồng hành, cách Chúa Giêsu hiện diện (thể lý, huyền nhiệm, luồng sáng, Thánh Thể...).
3. **Mục tiêu & Cơ chế giải đố (Quest / Puzzle):** Thử thách tương tác nhẹ nhàng để trẻ em ghi nhớ bài học Tin Mừng.
4. **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):** Lời nguyện, thắp sáng 1 hạt Mân Côi và đúc kết hoa trái thiêng liêng.

---

## 2. KIẾN TRÚC KỸ THUẬT (TECH STACK)
* **Framework:** Next.js (App Router, TypeScript).
* **Core Game Engine:** Phaser 3 (Arcade Physics, Tilemap, WebGL/Canvas).
* **UI Lớp Ngoài (HUD, Đối thoại, Menu):** React Components + Tailwind CSS.
* Ngôn ngữ giao diện: VI và EN. Cho phép chuyển đổi. 
* **Cầu nối giao tiếp:** EventBus pattern (sử dụng `mitt` hoặc custom EventEmitter) để tách rời Game Canvas và React State.
* **Map Editor:** Tiled Map Editor (xuất file `.json` và tileset `.png`).
* **Chiến lược Lưu dữ liệu (Save/Load):**
  * *Giai đoạn 1 (Hiện tại):* `localStorage` + Xuất/Nhập file `.json` dự phòng.
  * *Giai đoạn 2 (Tương lai):* Tích hợp Auth + Cloud Database (Convex / Supabase).

---

## 3. CẤU TRÚC THƯ MỤC DỰ KIẾN (NEXT.JS)

```text
├── public/
│   ├── assets/
│   │   ├── audio/              # Nhạc nền 8-bit, SFX chimes/click
│   │   ├── maps/               # JSON maps từ Tiled (vui_01.json, ...)
│   │   ├── sprites/            # Nhân vật (chua_giesu.png, mary.png, ...)
│   │   └── tilesets/           # Tileset cảnh quan, nhà cửa
├── src/ (hoặc root)
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main game view container
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameContainer.tsx           # Wrapper mount canvas Phaser (Responsive Scale)
│   │   │   ├── CharacterCreationModal.tsx   # Màn hình tạo & tùy biến nhân vật (Mobile-friendly UI)
│   │   │   ├── VirtualController.tsx       # Tay cầm ảo trên màn hình (D-pad + Nút A/B cho Mobile/Tablet)
│   │   │   ├── DialogueBox.tsx             # Hộp thoại NPC/Chúa Giêsu (Chạm màn hình để tiếp tục)
│   │   │   ├── HUD.tsx                     # Tiến trình chuỗi hạt Mân Côi
│   │   │   └── SaveLoadModal.tsx           # Quản lý lưu/tải slot & export JSON
│   ├── game/
│   │   ├── EventBus.ts         # Kênh liên lạc giữa React và Phaser
│   │   ├── config.ts           # Phaser Game Config (Arcade, Scale, Scenes)
│   │   ├── scenes/
│   │   │   ├── BootScene.ts    # Load tài nguyên cơ bản
│   │   │   ├── PreloadScene.ts # Load assets đồ họa, âm thanh
│   │   │   ├── BaseMysteryScene.ts # Scene mẫu chứa logic chung (di chuyển, va chạm)
│   │   │   └── mysteries/      # Prologue Scene + 20 Scenes mầu nhiệm + Epilogue Scene (phòng ngủ)
│   │   └── entities/
│   │       ├── Player.ts       # Nhân vật chính điều khiển bằng phím mũi tên / D-pad
│   │       └── NPC.ts          # Nhân vật tương tác (hội thoại, hint)
│   ├── types/
│   │   ├── game.d.ts           # Type definitions cho SaveData, Quest, Dialogue, CharacterCustomization
│   │   └── phaser.d.ts
│   └── utils/
│       ├── saveManager.ts      # Đọc/ghi LocalStorage và Export/Import JSON file
│       └── questManager.ts     # Quản lý trạng thái hoàn thành mầu nhiệm

## 4. Schema dữ liệu lưu game (SaveData)
```typescript
export interface CharacterCustomization {
  name: string;                  // Tên lữ khách (vd: Gioan, Maria, Têrêsa...)
  gender: "boy" | "girl";        // Kiểu nhân vật cơ bản
  skinTone: string;              // Màu da (palette index hoặc mã màu)
  hairStyle: string;             // Kiểu tóc (ngắn, dài, xoăn...)
  hairColor: string;             // Màu tóc (đen, nâu, vàng...)
  outfitColor: string;           // Màu áo choàng / y phục lữ khách
  accessory?: string;            // Phụ kiện (khăn choàng, chuỗi Mân Côi đeo cổ...)
  spriteKey: string;             // Khóa sprite tương ứng được tạo ra hoặc chọn
}

export interface SaveData {
  version: "1.0.0";
  timestamp: number;
  currentMysteryKey: string;     // vd: "vui_01_truyen_tin"
  currentMysteryIndex: number;   // 0 đến 19
  player: {
    customization: CharacterCustomization;
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  mysteriesProgress: {
    [mysteryKey: string]: {
      completed: boolean;
      beadLit: boolean;          // Hạt Mân Côi đã sáng hay chưa
      questsCompleted: string[]; // Danh sách ID nhiệm vụ phụ đã xong
    };
  };
  inventory: string[];           // Vật phẩm mang theo phục vụ giải đố
}
```

## 5. Lộ trình thực hiện từng bước (Roadmap)

### Giai đoạn 1: Thiết lập nền tảng & Tích hợp (Foundation)
• [x] Khởi tạo dự án Next.js (TypeScript, Tailwind CSS).
• [x] Cài đặt các thư viện lõi (`phaser` 3.90.0, `mitt`).
• [x] Cấu hình load dynamic (`ssr: false`) cho component bọc canvas Phaser 3.
• [x] Thiết lập `EventBus.ts` mẫu để kích hoạt giao tiếp 2 chiều (Game $\leftrightarrow$ React UI).
• [x] Dựng `SaveManager`:
  ◦ [x] Đọc/Ghi dữ liệu vào localStorage (hỗ trợ tạo slot mới hoặc ghi đè).
  ◦ [x] Tải về file `.json` (Export Save).
  ◦ [x] Đọc file `.json` tải lên để khôi phục tiến trình (Import Save).

### Giai đoạn 2: Màn hình tạo & Tùy biến nhân vật (Character Creation Screen)
*(Xuất hiện trước khi vào gameplay khi bắt đầu cuộc phiêu lưu mới)*
• [x] Thiết kế UI Màn hình Khởi tạo Nhân vật (Retro Pixel style với React + Tailwind):
  ◦ [x] Đặt tên Lữ Khách (Player Name kèm gợi ý tên Thánh quan thầy thiếu nhi & nút ngẫu nhiên 🎲).
  ◦ [x] Chọn giới tính / vóc dáng cơ bản (Bé Trai / Bé Gái).
  ◦ [x] Tùy chọn kiểu tóc, màu tóc, màu da, màu áo choàng và phụ kiện (Chuỗi Mân Côi, Thánh Giá, Áo choàng).
  ◦ [x] Xem trước trực quan (Live Pixel Avatar Preview) tự động đổi màu theo thời gian thực.
• [x] Lưu thông tin nhân vật vào `SaveData`:
  ◦ [x] Kiểm tra tính hợp lệ (tên không rỗng, chọn đầy đủ ngoại hình).
  ◦ [x] Khởi tạo hồ sơ lữ khách và lưu vào `localStorage`.
• [x] Tự động kích hoạt khi người chơi mới bắt đầu và cho phép nhấn vào huy hiệu Lữ Khách trên HUD để đổi lại bất kỳ lúc nào.

### Giai đoạn 3: Khung vận hành Mầu Nhiệm mẫu & Bộ điều khiển Mobile (Core Gameplay & Mobile Controls)
• [x] Dựng `BaseMysteryScene` với Arcade Physics:
  ◦ [x] Khởi tạo sprite nhân vật chính dựa trên dữ liệu tùy biến từ Giai đoạn 2 (`playerTextureGenerator.ts`).
  ◦ [x] Nhân vật di chuyển 4 hướng (animation walk/idle 4 hướng, căn chỉnh vận tốc đường chéo).
  ◦ [x] Camera bám theo nhân vật (`startFollow`, auto-zoom 2.2x - 2.4x responsive).
  ◦ [x] Va chạm (Arcade Physics collision với chướng ngại vật & biên giới thế giới).
• [x] **Xây dựng VirtualController (Tay cầm ảo trên màn hình cho Trẻ em):**
  ◦ [x] D-pad 4 hướng độ nhạy cao, kích thước nút lớn phù hợp ngón tay trẻ, hỗ trợ haptic feedback.
  ◦ [x] Nút hành động A (Tương tác / Nói chuyện / Xác nhận) và B (Hủy / Mở Menu / Chuỗi hạt).
  ◦ [x] Tự động ẩn/hiện hoặc toggle linh hoạt khi chơi trên Mobile/Tablet hoặc Desktop.
  ◦ [x] Bắn tín hiệu qua `EventBus` song song với phím mũi tên / WASD trên bàn phím.
• [x] Hệ thống tương tác & Hộp thoại:
  ◦ [x] Đến gần Bàn Thờ / NPC, bấm phím tương tác (Space / Enter / Chạm nút A ảo).
  ◦ [x] Bắn event qua React để hiển thị `DialogueBox` với hiệu ứng đánh máy chữ (hỗ trợ chạm màn hình bất kỳ điểm nào để tua/tiếp tục lời thoại).
  ◦ [x] Tạm dừng di chuyển nhân vật khi đang nói chuyện, tự động mở lại khi đóng hộp thoại.
• [x] **Xây dựng Mầu Nhiệm số 1 (Năm Sự Vui 1: Thiên Thần Truyền Tin cho Đức Bà)** - *Chi tiết: [`stage-scripts.md#Chặng-1`](./stage-scripts.md#chặng-1-thiên-thần-truyền-tin-cho-đức-bà-lc-1-26-38)*:
  ◦ [x] Map nhà Đức Mẹ ở Nazareth (responsive hiển thị tốt cả trên điện thoại và máy tính).
  ◦ [x] NPC: Đức Mẹ Maria và Sứ Thần Gabriel tỏa sáng.
  ◦ [x] Sự hiện diện của Chúa: Luồng sáng Thánh Linh bao phủ tâm hồn Mẹ khi Mẹ thưa lời "Xin Vâng".
  ◦ [x] Thử thách "Dọn lòng đón nhận": Thu thập 3 cuộn sách Lời Chúa Cựu Ước bị gió thổi rơi đặt lại bàn cầu nguyện.
  ◦ [x] Tương tác đối thoại: Chọn đúng lời chào mở đầu *"Kính mừng Maria đầy ơn phúc..."*.
  ◦ [x] Hoa trái suy niệm: Lòng khiêm nhường và vâng phục thánh ý Chúa $\rightarrow$ Thắp sáng Hạt Mân Côi số 1.

### Giai đoạn 4: Hệ thống HUD & Chuyển màn (Progression & UI)
• [x] Xây dựng HUD chuỗi Hạt Mân Côi (`RosaryHUD`):
  ◦ [x] Dải ruy băng mini hiển thị hạt trên góc phải màn hình, tự động cập nhật số hạt đã sáng / 20 hạt.
  ◦ [x] Bảng Chiêm Ngắm 20 Mầu Nhiệm retro mở ra khi nhấn vào HUD, phân theo 4 mùa (Vui, Sáng, Thương, Mừng).
  ◦ [x] Hiển thị chi tiết Lời Chúa trích dẫn và Hoa Trái Suy Niệm cho từng chặng.
  ◦ [x] Hạt sáng vàng lấp lánh (pulsing gold glow) khi chặng đã hoàn thành.
• [x] Auto-save mỗi khi qua một mầu nhiệm mới và cập nhật trạng thái hạt thời gian thực.
• [x] Hiệu ứng chuyển màn sang chặng tiếp theo (Fade in/Fade out và Intro card).

### Giai đoạn 5: Mở rộng 20 Mầu Nhiệm & Khung Truyện Prologue/Epilogue (Đồng bộ theo stage-scripts.md)

#### 🕯️ Khúc Dạo Đầu (Prologue - Giờ Kinh Tối & Lời Mời Gọi Của Thần Khí)
* [x] **Màn Mở Đầu (Prologue):** Chuỗi Hạt Nhỏ & Ngọn Gió Thần Khí (Rm 8, 26; Mt 18, 20) – *Phòng ngủ của bé trước giờ kinh tối (Tutorial điều khiển), tìm lại Chuỗi Mân Côi (0/20 hạt), thắp nến góc bàn thờ nhỏ, Chúa Thánh Thần (Chim Bồ Câu trắng) hiện ra mở cổng sáng đưa bé vào hành trình* ([Chi tiết](./stage-scripts.md#màn-mở-đầu-chuỗi-hạt-nhỏ--ngọn-gió-thần-khí-rm-8-26-mt-18-20)).

#### 🕊️ Mùa Vui (Năm Sự Vui - Cùng Chúa Đến Trần Gian)
* [x] **Chặng 1:** Thiên Thần Truyền Tin (Lc 1, 26-38) – *Nhà Nazareth, 3 cuộn kinh thánh, lời chào Gabriel* ([Chi tiết](./stage-scripts.md#chặng-1-thiên-thần-truyền-tin-cho-đức-bà-lc-1-26-38)).
* [x] **Chặng 2:** Đi Viếng Bà Thánh Isave (Lc 1, 39-56) – *Đường đồi Giu-đê, suối nước, kinh Magnificat* ([Chi tiết](./stage-scripts.md#chặng-2-đức-bà-đi-viếng-bà-thánh-isave-lc-1-39-56)).
* [x] **Chặng 3:** Sinh Chúa Nơi Hang Đá (Lc 2, 1-20) – *Hang đá Bethlehem, đá lửa, hướng dẫn mục đồng* ([Chi tiết](./stage-scripts.md#chặng-3-đức-bà-sinh-đức-chúa-giêsu-nơi-hang-đá-lc-2-1-20)).
* [x] ⚡ **Chặng Đệm B1 (Sau Chặng 3):** Hành Trình Ba Vua Theo Ánh Sao (Mt 2, 1-12) – *Action hứng ánh sao & lễ vật Ba Vua trên sa mạc Bethlehem*.
* [x] **Chặng 4:** Dâng Chúa Vào Đền Thánh (Lc 2, 22-40) – *Đền Thờ Giê-ru-sa-lem, đôi bồ câu non, cụ Simêon & tiên tri Anna* ([Chi tiết](./stage-scripts.md#chặng-4-đức-bà-dâng-đức-chúa-giêsu-vào-đền-thánh-lc-2-22-40)).
* [x] **Chặng 5:** Tìm Thấy Chúa Trong Đền Thờ (Lc 2, 41-52) – *Phố xá Giê-ru-sa-lem, câu hỏi luật học, đàm đạo với các kinh sư* ([Chi tiết](./stage-scripts.md#chặng-5-đức-bà-tìm-được-đức-chúa-giêsu-trong-đền-thờ-lc-2-41-52)).
* [x] 🌟 **Chặng Cầu Nối A1 (Vui $\rightarrow$ Sáng):** Xưởng Mộc Nazareth (Lc 2, 51-52) – *Action canh nhịp bấm A đóng đồ mộc cùng Chúa Giêsu & Thánh Giuse*.

#### 💡 Mùa Sáng (Năm Sự Sáng - Rao Truyền Nước Thiên Chúa)
* [x] **Chặng 6:** Chịu Phép Rửa Tại Sông Gio-đan (Mt 3, 13-17) – *Sông Gio-đan, Sokoban đẩy đá qua sông, chim bồ câu Thần Khí* ([Chi tiết](./stage-scripts.md#chặng-6-đức-chúa-giêsu-chịu-phép-rửa-tại-sông-gio-đan-mt-3-13-17)).
* [x] ⚡ **Chặng Đệm B2 (Sau Chặng 6):** Mẻ Cá Lạ Trên Hồ Galilê (Lc 5, 1-11) – *Action quăng lưới bắt cá trên thuyền Simon Phêrô*.
* [x] **Chặng 7:** Dự Tiệc Cưới Cana (Ga 2, 1-11) – *Tiệc làng Cana, múc nước đổ đầy 6 chum đá, nước hóa rượu* ([Chi tiết](./stage-scripts.md#chặng-7-đức-chúa-giêsu-dự-tiệc-cưới-cana-ga-2-1-11)).
* [x] **Chặng 8:** Rao Giảng Nước Trời & Kêu Gọi Sám Hối (Mc 1, 14-15; Mt 5–7) – *Đồi Bát Phúc, trao biểu tượng an ủi người sầu khổ* ([Chi tiết](./stage-scripts.md#chặng-8-đức-chúa-giêsu-rao-giảng-nước-trời-và-kêu-gọi-sám-hối-mc-1-14-15-mt-57)).
* [x] ⚡ **Chặng Đệm B3 (Sau Chặng 8):** Chúa Dẹp Yên Bão Tố (Mc 4, 35-41) – *Action vượt sóng thu thập mỏ neo đức tin trên biển hồ*.
* [x] **Chặng 9:** Biến Hình Trên Núi Tabor (Mt 17, 1-8) – *Đỉnh Tabor, đuốc xua sương mù, 3 lều tạm Môsê & Êlia* ([Chi tiết](./stage-scripts.md#chặng-9-đức-chúa-giêsu-biến-hình-trên-núi-tabor-mt-17-1-8)).
* [x] **Chặng 10:** Lập Bí Tích Thánh Thể (Lc 22, 14-20) – *Phòng Tiệc Ly, thau nước rửa chân, sắp xếp lúa miến & chùm nho* ([Chi tiết](./stage-scripts.md#chặng-10-đức-chúa-giêsu-lập-bí-tích-thánh-thể-lc-22-14-20)).
* [x] 🌟 **Chặng Cầu Nối A2 (Sáng $\rightarrow$ Thương):** Đêm Vượt Suối Kidron (Ga 18, 1) – *Action giữ sáng đèn dầu bằng đom đóm & dọn bụi gai đêm*.

#### ✝️ Mùa Thương (Năm Sự Thương - Cùng Chúa Đi Con Đường Thập Giá)
* [x] **Chặng 11:** Cầu Nguyện Trong Vườn Cây Dầu (Lc 22, 39-46) – *Vườn Giếtsêmani, rung chuông tỉnh thức 3 môn đệ, chén vâng phục* ([Chi tiết](./stage-scripts.md#chặng-11-đức-chúa-giêsu-cầu-nguyện-trong-vườn-cây-dầu-lc-22-39-46)).
* [x] **Chặng 12:** Chịu Đánh Đòn (Ga 19, 1) – *Dinh Philatô, lén tránh tầm nhìn lính La Mã lấy vải sạch, cầu nguyện đồng cảm* ([Chi tiết](./stage-scripts.md#chặng-12-đức-chúa-giêsu-chịu-đánh-đòn-ga-19-1)).
* [x] **Chặng 13:** Chịu Đội Mão Gai (Mt 27, 27-31) – *Trại lính, thu dọn bẫy gai nhọn, gấp lại áo choàng tím tôn vinh Vua Tình Yêu* ([Chi tiết](./stage-scripts.md#chặng-13-đức-chúa-giêsu-chịu-đội-mão-gai-mt-27-27-31)).
* [x] ⚡ **Chặng Đệm B4 (Sau Chặng 13):** Vác Thập Giá Nhỏ Theo Chúa (Lc 9, 23) – *Action vác thập giá nhỏ bước theo 6 dấu chân vàng & hóa 4 bụi gai thành hoa hy sinh*.
* [x] **Chặng 14:** Vác Thập Giá Lên Đồi Can-vê (Lc 23, 26-32) – *Đường Via Dolorosa, tìm Simon Kyrênê vác đỡ, khăn lau Veronica* ([Chi tiết](./stage-scripts.md#chặng-14-đức-chúa-giêsu-vác-thập-giá-lên-đồi-can-vê-lc-23-26-32)).
* [x] **Chặng 15:** Chịu Chết Trên Cây Thập Tự (Lc 23, 33-46) – *Đồi Can-vê nhật thực, thắp 3 ngọn nến tha thứ/phó thác/Mẹ Maria* ([Chi tiết](./stage-scripts.md#chặng-15-đức-chúa-giêsu-chịu-chết-trên-cây-thập-tự-lc-23-33-46)).
* [x] 🌟 **Chặng Cầu Nối A3 (Thương $\rightarrow$ Mừng):** Ánh Bình Minh Phục Sinh (Mt 28, 2) – *Action hứng tia sáng rạng đông lăn tảng đá cửa mộ*.

#### 👑 Mùa Mừng (Năm Sự Mừng - Vinh Hiển Nước Trời Đời Đời)
* [x] **Chặng 16:** Sống Lại Từ Cõi Chết (Mt 28, 1-10) – *Vườn mộ đá trống, xếp khăn liệm gọn gàng, gặp Chúa Phục Sinh* ([Chi tiết](./stage-scripts.md#chặng-16-đức-chúa-giêsu-sống-lại-từ-cõi-chết-mt-28-1-10)).
* [x] ⚡ **Chặng Đệm B5 (Sau Chặng 16):** Hành Trình Emmau — Trái Tim Bừng Cháy (Lc 24, 13-35) – *Action hứng 6 ngọn lửa Lời Chúa & 3 tấm bánh Emmau trên đường hoàng hôn*.
* [x] **Chặng 17:** Lên Trời Vinh Hiển (Cv 1, 6-11) – *Núi Cây Dầu, trao 4 biểu tượng sứ mạng cho các Tông đồ đi 4 phương trời* ([Chi tiết](./stage-scripts.md#chặng-17-đức-chúa-giêsu-lên-trời-vinh-hiển-cv-1-6-11)).
* [x] **Chặng 18:** Thánh Thần Hiện Xuống (Cv 2, 1-13) – *Phòng Tiệc Ly, thắp 7 ngọn nến 7 ơn Thần Khí, lưỡi lửa bừng sáng* ([Chi tiết](./stage-scripts.md#chặng-18-đức-chúa-thánh-thần-hiện-xuống-trên-các-tông-đồ-cv-2-1-13)).
* [x] ⚡ **Chặng Đệm B6 (Sau Chặng 18):** Phép Lạ Cửa Đẹp & Chứng Nhân Tin Mừng (Cv 3, 1-10) – *Action thu thập 6 ơn Thánh Thần & chữa lành 3 chứng nhân tại Cửa Đẹp*.
* [x] **Chặng 19:** Đức Mẹ Lên Trời (Kh 12, 1) – *Thu nhặt hoa huệ trắng, cầu vồng ánh sáng thiên quốc, Chúa đón Mẹ lên ngai* ([Chi tiết](./stage-scripts.md#chặng-19-đức-đức-chúa-trời-cho-đức-bà-lên-trời-kh-12-1)).
* [x] **Chặng 20:** Đức Mẹ Đội Triều Thiên (Kh 12, 1-2) – *Thiên quốc uy nghi, đặt hạt thứ 20 hoàn tất Chuỗi Mân Côi Cứu Độ, lời Chúa dặn dò chuyển tiếp* ([Chi tiết](./stage-scripts.md#chặng-20-đức-chúa-trời-thưởng-đức-mẹ-trên-trời-kh-12-1-2)).

#### 🏡 Khúc Vĩ Thanh (Epilogue - Trở Về Đời Thường)
* [x] **Màn Kết (Epilogue):** Căn Phòng Nhỏ & Cuộc Trò Chuyện Với Chúa Thánh Thần (Ga 14, 26; Gl 5, 22-23) – *Trở về phòng ngủ của người chơi sau giờ lần hạt, trò chuyện với Chúa Thánh Thần (Chim Bồ Câu trắng tỏa sáng) và thực hành 3 bài học: Bàn học (Vâng phục), Cặp sách (Tha thứ & Yêu thương), Góc cầu nguyện (Hy vọng & Chứng nhân)* ([Chi tiết](./stage-scripts.md#màn-kết-căn-phòng-nhỏ--cuộc-trò-chuyện-với-chúa-thánh-thần-ga-14-26-gl-5-22-23)).

### Giai đoạn 6: Tinh chỉnh & Sẵn sàng nâng cấp Cloud
• [ ] Tối ưu hóa hiệu năng di động (Assets compression, WebGL canvas caching, Pin tiêu thụ thấp).
• [ ] Hỗ trợ chế độ Fullscreen & PWA (Install to Homescreen trên iOS/Android để chơi như app native không bị dính thanh địa chỉ trình duyệt).
• [ ] Đóng gói `SaveManager` thành Interface mở để sẵn sàng cắm module Convex/Supabase khi cần mở rộng.

# KẾ HOẠCH DỰ ÁN: MOSES – THE EXODUS (MÔI-SÊ & HÀNH TRÌNH XUẤT HÀNH)

## 1. TỔNG QUAN DỰ ÁN
* **Tên Module:** `modules/moses-the-exodus` (Route: `/moses-the-exodus`).
* **Thể loại:** 2D Top-Down Retro Multi-Genre Puzzle & Action RPG (Pixel Art 8-bit vẽ bằng code theo chuẩn lưới `pixelArt.ts`).
* **Mục tiêu:** Giúp thiếu nhi và người chơi tìm hiểu Sách Xuất Hành (`Xh 1–20; 32–40`) – từ chiếc thúng cói trên sông Nin, Bụi Cây Bốc Cháy trên núi Khô-rép, Mười Tai Ương Ai Cập, Đêm Lễ Vượt Qua, phép lạ Rẽ Nước Biển Đỏ, Bánh Mân-na trong hoang địa đến Mười Điều Răn trên đỉnh Xi-nai và Nhà Tạm Giao Ước – qua **12 màn chơi chính** (+ Prologue & Epilogue) với **12 thể loại gameplay khác nhau**.
* **Điểm nhấn thiết kế:**
  1. **🎨 Màn Hình Minh Họa Pixel Art Mở Màn (`StageIntroIllustration`):** Khi bắt đầu mỗi màn chơi và chạy hộp thoại dẫn nhập (Intro Dialogue), vùng màn hình phía trên hiển thị một **bức tranh minh họa Pixel Art toàn cảnh giàu chi tiết** (có bố cục tiền cảnh – trung cảnh – hậu cảnh và animation 2–4 frames). Sau khi kết thúc hội thoại mở màn, màn hình chuyển cảnh mượt mà (Pixel Wipe / Fade) vào bản đồ Top-down.
  2. **🎮 Đa thể loại (Multi-Genre) & Cơ chế Checkpoint (Soft Reset):** Mỗi Stage sở hữu một luật chơi riêng (điều tiết dòng chảy sông Nin đưa thúng cói, bước trên đất thánh & thực hành 3 dấu lạ, đấu phép quyền năng trước Pha-ra-ô, giữ đèn sáng đất Gô-sen giữa bóng tối dày đặc, chuẩn bị Lễ Vượt Qua & bôi máu chiên lên khung cửa, giương gậy rẽ nước Biển Đỏ & chặn chiến xa, gõ trống cơm theo nhịp & làm ngọt nước Ma-ra, thu hoạch Mân-na theo khẩu phần ngày thường/Sa-bát, đập đá Khô-rép & nâng tay Môi-sê cầu nguyện trên đồi, vượt sấm chớp lên đỉnh Xi-nai đón Hai Bia Đá Mười Điều Răn, đập tan tượng bê vàng & chuyển cầu, lắp ráp Nhà Tạm Giao Ước). Đi sai bước hoặc chạm chướng ngại sẽ lùi về Checkpoint gần nhất.
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
    scripts.md                      # Kịch bản chi tiết & thiết kế gameplay 12 stages + Prologue/Epilogue
    plan.md                         # Lộ trình phát triển (file này)
    components/
      GameContainer.tsx             # Wrapper mount Phaser canvas
      ExodusHUD.tsx                 # HUD Hai Bia Đá Giao Ước (12 Ấn Dấu Xuất Hành & Mười Điều Răn + Nút Reset Checkpoint)
      SaveLoadModal.tsx             # Lưu/Tải tiến trình & Export/Import JSON
    data/
      stagesData.ts                 # Dữ liệu 12 Stages + Prologue/Epilogue (Lời Chúa, Hoa trái, Nhiệm vụ, Tranh mở màn)
      dialogues.ts                  # Lời thoại song ngữ VI / EN
    types/
      game.ts                       # SaveData, StageKey, StageProgress, GenreState
    utils/
      saveManager.ts                # Quản lý localStorage (key riêng: "moses_the_exodus_save_v1")
    game/
      config.ts                     # Phaser Game Config (`pixelArt: true`, `roundPixels: true`)
      scenes/
        BootScene.ts
        PreloadScene.ts
        BaseExodusScene.ts          # Base scene: hỗ trợ Intro Pixel Illustration overlay, Checkpoint reset, Co-op/Stamina hooks
        stages/                     # PrologueScene + Stage01..Stage12 + EpilogueScene
      utils/
        introIllustrations.ts       # Bộ generator vẽ tranh Pixel Art toàn cảnh + animation cho 14 màn (Prologue + 12 Stages + Epilogue)
        exodusTextures.ts           # NPC (Môi-sê, A-ha-rôn, Mi-ri-am, Giu-suê, Pha-ra-ô), Bụi Cây Cháy, Cột Mây/Lửa, Hòm Bia, Chân Đèn 7 Ngọn
  ```

---

## 3. SCHEMA DỮ LIỆU LƯU GAME (`SaveData`)
```typescript
import type { CharacterCustomization } from "@/modules/shared/types";

export type ExodusStageKey =
  | "prologue_cay_gay_nguoi_muc_tu"
  | "stage_01_thung_coi_song_nin"
  | "stage_02_bui_cay_boc_chay"
  | "stage_03_doi_dien_pharao"
  | "stage_04_anh_sang_dat_gosen"
  | "stage_05_dem_le_vuot_qua"
  | "stage_06_re_nuoc_bien_do"
  | "stage_07_khuc_ca_nuoc_mara"
  | "stage_08_banh_manna_tu_troi"
  | "stage_09_dap_da_va_doi_tay"
  | "stage_10_muoi_dieu_ran_xinai"
  | "stage_11_be_vang_chuyen_cau"
  | "stage_12_nha_tam_giao_uoc"
  | "epilogue_vuot_qua_moi";

export interface ExodusSaveData {
  version: "1.0.0";
  timestamp: number;
  currentStageKey: ExodusStageKey;
  currentStageIndex: number; // 0 đến 11 (12 Ấn Dấu Xuất Hành chính)
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
* [ ] Tạo route `app/moses-the-exodus/page.tsx` và thêm thẻ game **Moses – The Exodus** (kèm ảnh bìa pixel `/games/moses-the-exodus.png`) vào trang chủ `app/page.tsx`.
* [ ] Xây dựng `types/game.ts`, `data/stagesData.ts` (song ngữ VI/EN) và `utils/saveManager.ts` (lưu độc lập tại key `moses_the_exodus_save_v1`).
* [ ] Dựng `MosesTheExodus.tsx`, `GameContainer.tsx`, `ExodusHUD.tsx` (hiển thị **Hai Bia Đá Giao Ước & 12 Ấn Dấu Xuất Hành**, nút xem Suy Niệm Xuất Hành & Mười Điều Răn, và nút **Thử lại Checkpoint** nhanh).

### Giai đoạn 2: Base Scene, Hệ thống Tranh Minh Họa Mở Màn & Cơ chế Lõi
* [ ] Xây dựng `BaseExodusScene.ts`:
  * [ ] Chế độ **Intro Pixel Illustration Mode**: Khi vào màn, hiển thị khung tranh minh họa toàn cảnh (`introIllustrations.ts`) có viền khung tranh cổ điển, hiệu ứng chuyển động pixel (2–4 frames + particles) trong suốt lúc hộp thoại dẫn nhập đang mở; khi đóng hộp thoại dẫn nhập thì thực hiện hiệu ứng chuyển cảnh (Pixel Wipe / Fade) mở ra bản đồ Top-down.
  * [ ] Hệ thống **Checkpoint / Soft Reset**: API `this.saveCheckpoint(id, state)` và `this.resetToCheckpoint()` kèm hiệu ứng lóe sáng nhẹ + âm báo khích lệ khi người chơi cần thử lại.
  * [ ] Hỗ trợ **Grace Pips (3 Giọt Bình An)** và cơ chế **Cây Gậy Môi-sê (`[A]`)** đa năng theo từng màn chơi.
* [ ] Xây dựng `exodusTextures.ts`: Sprite Môi-sê (lúc bé trong thúng cói, lúc chăn chiên ở Ma-đi-an, và lúc cầm gậy lãnh đạo dân), chị Mi-ri-am cầm trống cơm, anh A-ha-rôn, dũng tướng Giu-suê, Công chúa Ai Cập, vua Pha-ra-ô, chiến xa Ai Cập, Bụi Cây Bốc Cháy, Cột Mây – Cột Lửa, Chiên Vượt Qua, Bánh Mân-na, Hai Bia Đá, Hòm Bia Giao Ước và Chân Đèn 7 Ngọn đúng chuẩn lưới chibi 32×32 / 16px tile grid.

### Giai đoạn 3: Khúc Dạo Đầu (Prologue)
* [ ] **Màn Mở Đầu (`PrologueScene`):** *Bản Đồ Sa Mạc & Cây Gậy Người Mục Tử (`Xh 3, 10-12`)* ([Chi tiết](./scripts.md#màn-mở-đầu-bản-đồ-sa-mạc--cây-gậy-người-mục-tử-xh-3-10-12))
  * [ ] 🎨 Tranh mở màn: Đôi bàn tay mở sách Xuất Hành bên ngọn đèn bàn, hiện lên bóng hình Cột Lửa dẫn đường giữa sa mạc đêm và Cây Gậy Môi-sê rực sáng.
  * [ ] Bản đồ & Gameplay: Phòng nhỏ buổi tối ấm áp, thắp ngọn đèn bàn học, ghép 3 mảnh bản đồ cổ (*Ai Cập $\rightarrow$ Biển Đỏ $\rightarrow$ Núi Xi-nai*) và nhận **Hai Bia Đá Hành Trình (0/12 Ấn Dấu)**.

### Giai đoạn 4: Phần 1 – Tiếng Kêu Thấu Trời & Cuộc Giải Thoát Khỏi Ai Cập (`Stages 1–6`)
* [ ] **Stage 1 (`Stage01NileBasketScene`):** *Chiếc Thúng Cói Trên Sông Nin (`Xh 1, 22 – 2, 10`)* ([Chi tiết](./scripts.md#stage-1-chiếc-thúng-cói-trên-sông-nin-xh-1-22--2-10))
  * [ ] 🎨 Tranh mở màn: Bờ sông Nin rợp bóng sậy xanh và hoa súng; chiếc thúng cói trét nhựa đen chở bé Môi-sê trôi êm đềm dưới ánh mắt dõi theo của chị Mi-ri-am nấp sau bụi sậy, hướng về phía Công chúa Pha-ra-ô.
  * [ ] Gameplay (**River Current Routing & Stealth Escort**): Cùng chị Mi-ri-am chạy dọc bờ sậy gạt các cụm lá sen/cửa nước để điều hướng dòng chảy đưa chiếc thúng cói tránh cá sấu sông Nin, xoáy nước và tầm nhìn của lính tuần tra Ai Cập, dẫn thúng cập bến tắm của Công chúa.
* [ ] **Stage 2 (`Stage02BurningBushScene`):** *Bụi Cây Bốc Cháy Trên Núi Khô-rép (`Xh 3, 1 – 4, 17`)* ([Chi tiết](./scripts.md#stage-2-bụi-cây-bốc-cháy-trên-núi-khô-rép-xh-3-1--4-17))
  * [ ] 🎨 Tranh mở màn: Trên sườn núi đá Khô-rép hùng vĩ, một bụi gai rực lửa vàng – cam – trắng nhưng cành lá vẫn xanh tươi không hề cháy rụi; ông Môi-sê đã cởi đôi dép đặt bên cạnh, quỳ gối che mặt trước vinh quang của Đấng *"TA LÀ ĐẤNG HẰNG HỮU"*.
  * [ ] Gameplay (**Sacred Ground Puzzle & 3 Staff Signs**): Pha 1 dẫn đàn chiên vượt sườn núi đá và giải đố **Cởi Dép Bước Trên Đất Thánh**; Pha 2 thực hành **3 Dấu Lạ Chúa Trao** (`Xh 4, 1-9`: ném gậy hóa rắn rồi nắm đuôi thu lại đúng nhịp, đặt tay vào ngực chữa lành, múc nước sông đổ lên đất khô).
* [ ] **Stage 3 (`Stage03PharaohPlaguesScene`):** *Đối Diện Pha-ra-ô & Các Dấu Lạ Cảnh Báo (`Xh 7, 14 – 9, 35`)* ([Chi tiết](./scripts.md#stage-3-đối-diện-pha-ra-ô--các-dấu-lạ-cảnh-báo-xh-7-14--9-35))
  * [ ] 🎨 Tranh mở màn: Đại điện cột đá Ai Cập đồ sộ; Môi-sê và A-ha-rôn đứng hiên ngang giương cao cây gậy trước ngai vàng của Pha-ra-ô đang cứng lòng, phía ngoài cửa cung điện là dòng sông Nin đỏ rực và mưa đá kèm lửa chớp.
  * [ ] Gameplay (**Tactical Staff Channelling & Barrier Break**): Qua 3 vòng đối đầu với sự cứng lòng của Pha-ra-ô, người chơi điều khiển Môi-sê và A-ha-rôn tránh các bẫy ảo thuật của phù thủy Ai Cập và kích hoạt đúng **Các Đài Dấu Lạ** (*Nước Hóa Máu, Đàn Ếch Nhái, Mưa Đá & Lửa*) để làm tan vỡ Khiên Kiêu Ngạo của Pha-ra-ô.
* [ ] **Stage 4 (`Stage04GoshenLightScene`):** *Ba Ngày Tối Dày Đặc & Ánh Sáng Đất Gô-sen (`Xh 10, 21-29`)* ([Chi tiết](./scripts.md#stage-4-ba-ngày-tối-dày-đặc--ánh-sáng-đất-gô-sen-xh-10-21-29))
  * [ ] 🎨 Tranh mở màn: Bầu trời Ai Cập chìm trong màn đêm đen đặc đến mức *"sờ thấy được"*, nhưng riêng khu định cư **Gô-sen** của con cái Ít-ra-en ở phía Đông vẫn tràn ngập ánh sáng ấm áp trong lành.
  * [ ] Gameplay (**Light-Network Relay & Darkness Defense**): Màn đêm dày đặc tràn vào từ bốn phía làm tắt dần các ngọn đèn đường. Người chơi phải mang **Lửa Thánh Gô-sen** chạy nối mạng lưới **8 Trụ Đèn Gia Đình Ít-ra-en** sao cho tất cả cùng sáng một lúc trước khi bóng tối nuốt chửng lối đi.
* [ ] **Stage 5 (`Stage05PassoverNightScene`):** *Đêm Lễ Vượt Qua & Máu Chiên Cứu Độ (`Xh 12, 1-36`)* ([Chi tiết](./scripts.md#stage-5-đêm-lễ-vượt-qua--máu-chiên-cứu-độ-xh-12-1-36))
  * [ ] 🎨 Tranh mở màn: Đêm trăng tròn tháng A-bíp tại Gô-sen; các gia đình Ít-ra-en lưng thắt gọn, chân mang dép, tay cầm gậy quây quần bên bàn tiệc Chiên Vượt Qua và bánh không men, trong khi bên ngoài khung cửa gỗ đã được ghi dấu máu chiên đỏ thắm tỏa hào quang bảo vệ.
  * [ ] Gameplay (**Preparation Crafting & Doorpost Marking**): Trước khi đồng hồ đêm điểm nửa đêm, người chơi phải hoàn thành 2 pha: Pha 1 chuẩn bị đúng **Bàn Tiệc Vượt Qua** (*Chiên tinh tuyền + Bánh không men + Rau đắng*) và trang phục sẵn sàng lên đường; Pha 2 cầm **Chùm Kinh Giới (`Xh 12, 22`)** chạy khắp khu phố Gô-sen ghi dấu máu chiên lên **10 Khung Cửa Nhà Dân** để Sứ Thần hủy diệt "vượt qua" an toàn.
* [ ] **Stage 6 (`Stage06RedSeaCrossingScene`):** *Cột Mây Cột Lửa & Rẽ Nước Biển Đỏ (`Xh 13, 21 – 14, 31`)* ([Chi tiết](./scripts.md#stage-6-cột-mây-cột-lửa--rẽ-nước-biển-đỏ-xh-13-21--14-31))
  * [ ] 🎨 Tranh mở màn: Cảnh tượng vĩ đại nhất Cựu Ước: Ông Môi-sê đứng trên mỏm đá giương cao cây gậy, gió Đông thổi mạnh suốt đêm làm **Biển Đỏ (Biển Sậy)** tách đôi dựng thành hai bức tường nước khổng lồ hai bên. Ở giữa lòng biển khô ráo, đoàn dân Ít-ra-en tiến bước dưới sự bảo vệ của **Cột Mây và Cột Lửa** ngăn chặn đoàn chiến xa Pha-ra-ô phía sau.
  * [ ] Gameplay (**Sea-Parting Escort & Pillar-of-Fire Defense**): Người chơi vừa dẫn đoàn dân đi qua lòng biển khô ráo bằng cách kích hoạt các **Trụ Gió Đông** giữ hai bức tường nước không sập xuống sớm, vừa điều khiển **Cột Mây / Cột Lửa** ở phía sau chắn ngang làm chậm các mũi Chiến Xa Ai Cập cho đến khi người dân cuối cùng lên bờ bên kia!

### Giai đoạn 5: Phần 2 – Hành Trình Hoang Địa & Giao Ước Núi Xi-nai (`Stages 7–12`)
* [ ] **Stage 7 (`Stage07MiriamMaraScene`):** *Khúc Ca Biển Đỏ & Nước Ngọt Ma-ra (`Xh 15, 1-27`)* ([Chi tiết](./scripts.md#stage-7-khúc-ca-biển-đỏ--nước-ngọt-ma-ra-xh-15-1-27))
  * [ ] 🎨 Tranh mở màn: Nửa trái bức tranh là ngôn sứ **Mi-ri-am** cùng các phụ nữ cầm trống cơm múa hát mừng chiến thắng bên bờ Biển Đỏ; nửa phải là ốc đảo **Ma-ra** và **Ê-lim** (với 12 suối nước và 70 cây chà là) nơi ông Môi-sê ném khúc gỗ Chúa chỉ vào dòng nước đắng làm nước hóa ngọt lành.
  * [ ] Gameplay (**Tambourine Rhythm & Sweet-Wood Alchemy Puzzle**): Pha 1 bấm nhịp trống cơm theo giai điệu **Bài Ca Của Môi-sê & Mi-ri-am (`Xh 15, 1.21`)**; Pha 2 tại Ma-ra, tìm các mảnh **Gỗ Cây Sự Sống** đặt vào đầu nguồn để thanh lọc toàn bộ các vũng nước đắng màu tím thành dòng nước xanh mát dẫn tới ốc đảo Ê-lim.
* [ ] **Stage 8 (`Stage08MannaQuailScene`):** *Bánh Mân-na & Chim Cút Từ Trời (`Xh 16, 1-35`)* ([Chi tiết](./scripts.md#stage-8-bánh-mân-na--chim-cút-từ-trời-xh-16-1-35))
  * [ ] 🎨 Tranh mở màn: Bình minh trên hoang địa Xin; khi lớp sương mai tan đi, mặt đất phủ đầy những hạt **Mân-na** trắng mịn như sương muối, ngọt như bánh mật ong. Các gia đình Ít-ra-en đang vui vẻ cầm giỏ thu lượm từng khẩu phần Chúa ban từ trời.
  * [ ] Gameplay (**Daily Quota Gathering & Sun-Melt Race**): Qua 3 buổi sáng liên tiếp (Ngày thường $\rightarrow$ Ngày thứ Sáu trước Sa-bát $\rightarrow$ Ngày Sa-bát nghỉ ngơi), người chơi phải thu hoạch Mân-na vào giỏ theo **đúng định lượng Chúa truyền** (1 ô-me cho mỗi người ngày thường, **gấp đôi = 2 ô-me** vào ngày thứ Sáu, và không lấy thừa vì lấy tham lam sẽ bị hỏng) trước khi **Ánh Nắng Mặt Trời** quét qua làm Mân-na tan chảy!
* [ ] **Stage 9 (`Stage09RephidimHandsScene`):** *Đập Đá Rê-phi-đim & Đôi Tay Cầu Nguyện Trên Đồi (`Xh 17, 1-16`)* ([Chi tiết](./scripts.md#stage-9-đập-đá-rê-phi-đim--đôi-tay-cầu-nguyện-trên-đồi-xh-17-1-16))
  * [ ] 🎨 Tranh mở màn: Dưới chân đồi Rê-phi-đim là dòng nước mát tuôn trào từ tảng đá Khô-rép và đạo quân của dũng tướng **Giu-suê** đang bảo vệ dân; trên đỉnh đồi cao, ông **Môi-sê** ngồi trên tảng đá giơ cao hai tay cầm gậy của Thiên Chúa, hai bên là **A-ha-rôn** và **Khua** đang đỡ lấy đôi tay ông hướng lên trời.
  * [ ] Gameplay (**Rock-Strike Timing & Prayer-Hands Support Co-op**): Pha 1 dùng gậy đập trúng mạch đá Khô-rép giải khát cho dân; Pha 2 là cơ chế **Nâng Đỡ Đôi Tay Cầu Nguyện**: khi cánh tay trái hoặc phải của Môi-sê mỏi và hạ xuống vì gió tạt, người chơi phải nhanh chóng điều khiển A-ha-rôn (bên trái) và Khua (bên phải) kê đá và hứng các **Hạt Ân Sủng** giữ cho đôi tay Môi-sê luôn giơ cao để Giu-suê đẩy lùi quân A-ma-lếch!
* [ ] **Stage 10 (`Stage10SinaiCommandmentsScene`):** *Mười Điều Răn Trên Đỉnh Xi-nai (`Xh 19, 16 – 20, 21`)* ([Chi tiết](./scripts.md#stage-10-mười-điều-răn-trên-đỉnh-xi-nai-xh-19-16--20-21))
  * [ ] 🎨 Tranh mở màn: Đỉnh núi **Xi-nai** uy nghiêm rực lửa, khói bốc lên nghi ngút kèm tiếng tù và vang dội; trên đỉnh núi cao giữa đám mây sáng chói, ông Môi-sê cung kính đón nhận **Hai Bia Đá Giao Ước** khắc **Mười Điều Răn** bằng ngón tay Thiên Chúa.
  * [ ] Gameplay (**Mountain Ascent & Ten Commandments Tablet Matching**): Pha 1 vượt đường mòn dốc đá Xi-nai (tránh bước qua ranh giới chân núi dành cho dân và căn nhịp vượt qua các đợt Chớp Lửa Thánh); Pha 2 trên đỉnh núi, ghép và sắp xếp đúng thứ tự **10 Khối Chữ Ánh Sáng** vào **Bia Đá Thứ Nhất (Điều răn 1–3: Lòng Mến Chúa)** và **Bia Đá Thứ Hai (Điều răn 4–10: Tình Yêu Người)**.
* [ ] **Stage 11 (`Stage11GoldenCalfMercyScene`):** *Bi Kịch Bê Vàng & Lời Chuyển Cầu Của Môi-sê (`Xh 32, 1-34`; `34, 1-10`)* ([Chi tiết](./scripts.md#stage-11-bi-kịch-bê-vàng--lời-chuyển-cầu-của-môi-sê-xh-32-1-34-34-1-10))
  * [ ] 🎨 Tranh mở màn: Hai cảnh tương phản: phía dưới chân núi là sự hỗn loạn quanh tượng bê vàng lầm lạc đã bị Môi-sê đập tan; phía trên sườn núi đá, ông Môi-sê đang phủ phục tha thiết cầu bầu cho dân trước mặt Chúa và đẽo lại hai bia đá mới để đón nhận lời mặc khải: *"Đức Chúa, Thiên Chúa nhân hậu và từ bi, hay nén giận, giàu nhân nghĩa và thành tín!"* (`Xh 34, 6`).
  * [ ] Gameplay (**Idol Purge & Intercession Path Puzzle**): Pha 1 cầm Ngọn Đuốc Sự Thật cùng những người trung tín dẹp tan các **Cột Khói Mê Muội** quanh bệ bê vàng để thức tỉnh dân; Pha 2 đẽo lại **Hai Bia Đá Mới** và dẫn lời cầu nguyện vượt qua các khe vực hối cải để nối lại Giao Ước.
* [ ] **Stage 12 (`Stage12TabernacleGloryScene`):** *Dựng Nhà Tạm & Vinh Quang Chúa Ngự Xuống (`Xh 35 – 40`)* ([Chi tiết](./scripts.md#stage-12-dựng-nhà-tạm--vinh-quang-chúa-ngự-xuống-xh-35--40))
  * [ ] 🎨 Tranh mở màn: Giữa trung tâm doanh trại 12 chi tộc Ít-ra-en, **Nhà Tạm (Đền Tạm)** bằng vải gai mịn sắc xanh – tím – đỏ thắm và gỗ keo bọc vàng đã được dựng lên hoàn chỉnh. Từ trời cao, **Đám Mây Vinh Quang Của Đức Chúa (Shekinah)** rực rỡ ánh vàng kim ngự xuống bao phủ Nhà Tạm.
  * [ ] Gameplay (**Sanctuary Blueprint Assembly Finale**): Phối hợp cùng hai nghệ nhân Bơ-xan-ên và Ô-hô-li-áp lắp đặt chính xác các thánh vật vào đúng 3 khu vực của Nhà Tạm theo chỉ dẫn của Chúa (`Xh 40, 1-33`): *Sân Ngoài* (Bàn Thờ Lễ Toàn Thiêu, Chậu Đồng Rửa Tay), *Nơi Thánh* (Chân Đèn Vàng 7 Ngọn, Bàn Bánh Tiến, Bàn Thờ Hương Vàng), và *Nơi Cực Thánh* (đặt Hai Bia Đá vào trong **Hòm Bia Giao Ước** có hai Thần Hộ Vệ Cherubim che cánh).

### Giai đoạn 6: Khúc Vĩ Thanh (Epilogue) & Kiểm định Chất lượng
* [ ] **Màn Kết (`EpilogueScene`):** *Cuộc Vượt Qua Mới Của Chúa Giêsu (`Xh 12; Ga 6, 32-35; 1 Cr 10, 1-4`)* ([Chi tiết](./scripts.md#màn-kết-cuộc-vượt-qua-mới-của-chúa-giêsu-xh-12-ga-6-32-35-1-cr-10-1-4))
  * [ ] 🎨 Tranh mở màn: Căn phòng nhỏ của Lữ khách ngập ánh sáng bình minh, cuốn Kinh Thánh mở ở sách Xuất Hành nằm cạnh Hai Bia Đá thu nhỏ, Hải Đồ Nô-ê, Cuộn Sách Sáng Thế và Chuỗi Mân Côi.
  * [ ] Gameplay: Thực hiện 3 kết nối đức tin của **Người Lữ Hành Tự Do** (kết nối Chiên Vượt Qua & Biển Đỏ với Chúa Giêsu – Chiên Thiên Chúa, kết nối Bánh Mân-na với Bí tích Thánh Thể, và sống Mười Điều Răn bằng luật Yêu Thương mỗi ngày).
* [ ] Kiểm tra hiển thị thực tế tất cả 14 bức tranh Intro Pixel Illustration và 14 bản đồ Top-down ở độ phóng đại game (`npm run dev`), đảm bảo `npx tsc --noEmit`, `npx eslint modules app` và `npx next build` đều pass sạch.

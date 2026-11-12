# KỊCH BẢN & GAMEPLAY: JOSEPH – THE COAT OF THE SUN (GIUSE – CHIẾC ÁO MẶT TRỜI)

* **Kinh Thánh nền tảng:** Sách Sáng Thế, chương 37 – 50 (`St 37 – 50`). Gợi ý đọc thêm: `Tv 105, 16-22`.
* **Vai trò người chơi:** lữ khách nhỏ, tiếp nối *Garden of Eden → Noah's Ark → Moses → King David*. Mở Sách Sáng Thế ở những trang cuối, em được Thánh Thần dẫn vào câu chuyện của cậu út **Giuse** và đồng hành bên cậu từ cánh đồng Hếp-rôn đến ngai tể tướng Ai-cập.
* **Vật phẩm tiến trình:** **Chiếc Áo Mặt Trời – 12 tia nắng** (12 người con của Gia-cóp). Hoàn thành mỗi màn thắp 1 tia.
* **Giọng văn:** tiếng Việt trước, ấm áp, từ ngữ đơn giản cho thiếu nhi; không dọa, không bạo lực hình ảnh (anh em ghen ghét, không máu me; "áo nhuộm máu dê" chỉ là vết đỏ sẫm trên áo).

## BẢNG THUẬT NGỮ CÔNG GIÁO (dùng thống nhất, xem `AGENTS.md`)

| Nội dung | VI (Công Giáo) | EN (Catholic) |
|---|---|---|
| Nhân vật | **Giuse**, **Gia-cóp** (cha), **Ra-khen** (mẹ, đã mất), **Rúp-ben**, **Si-mê-ôn**, **Lê-vi**, **Giu-đa**, **Dan**, **Náp-ta-li**, **Gát**, **A-se**, **Ít-xa-kha**, **Dơ-bu-lun**, **Ben-gia-min** | Joseph, Jacob, Rachel, Reuben, Simeon, Levi, Judah, Dan, Naphtali, Gad, Asher, Issachar, Zebulun, Benjamin |
| Ai-cập | **Pha-ra-ô**, **ông Pút-ti-phác** *[kiểm lại CGKPV]*, **quan tửu chánh**, **quan thượng thiện**, **Át-xơ-nát** *[kiểm lại CGKPV]* | Pharaoh, Potiphar, chief cupbearer, chief baker, Asenath |
| Nơi chốn | **Hếp-rôn**, **Sê-khem**, **Đô-than**, **Ai-cập**, **sông Nin**, **Gô-sen**, **Ca-na-an** | Hebron, Shechem, Dothan, Egypt, the Nile, Goshen, Canaan |
| Dân | **dân Ít-ra-en**, **lái buôn Ít-ma-en** *[kiểm lại: có bản "Ít-mác-en"]* | Israelites, Ishmaelite traders |
| Từ chung | **Thiên Chúa**, **Đức Chúa**, **giấc mơ**, **ngôn sứ**, **tể tướng**, **nạn đói**, **lễ vật**, **tha thứ**, **ơn Chúa** | God, the Lord, dream, prophet, vizier/governor, famine, gift, forgiveness |
| Trích dẫn | `St 37, 3` | `Genesis 37:3` |
* **Tên "Giuse"** trùng tên Thánh Giuse bạn trăm năm Đức Mẹ. Trong game luôn gọi **"Giuse con ông Gia-cóp"** ở lần xuất hiện đầu và cho 1 câu giải thích ở Prologue để trẻ không nhầm.
* **Tránh dùng:** Giô-sép, Gia-cốp, Ru-bên, Xi-mê-ôn, Bên-gia-min, Ra-chên, Ê-díp-tô, Pha-ra-ôn, Y-sơ-ra-ên, Đức Chúa Trời, Giê-hô-va, Thi Thiên.
* **Lưu ý trích dẫn:** các câu *in nghiêng* dưới đây là **gần sát** văn bản Công Giáo; đánh dấu `[kiểm lại CGKPV]` = phải đối chiếu từng chữ trước khi đưa vào `data/`.
* **Hình ảnh Ai-cập:** trang trí trung tính (cột hoa sen, bích họa hình học, thuyền sông Nin). Không vẽ nghi lễ thờ thần; tượng chỉ là đồ trang trí nhỏ, không có hành động thờ.

## Cấu trúc chuẩn mỗi Stage
1. Dẫn nhập + Lời Chúa chủ đề → 2. 🖼️ Ảnh mở màn → 3. Bản đồ & nhân vật → 4. Gameplay (luật, độ khó, checkpoint) → 5. Outro mầu nhiệm & Hoa trái → 6. 🎬 Cầu nối (nếu có) → 7. 🎵 Âm thanh gợi ý (id có sẵn trong `shared/game/audio/tracks.ts`, sẽ kiểm tra lúc code).

---

# PHẦN 0: KHÚC DẠO ĐẦU – CHIẾC ÁO & BẢN ĐỒ (`St 37, 1-4`)
* **Ảnh:** `intro-start.png`. **Bối cảnh:** phòng học buổi tối, đèn bàn, Sách Thánh mở ra, một chiếc áo choàng dài vàng – cam xếp trên ghế, bản đồ cổ rách thành 3 mảnh.
* **Thoại:** Giuse (hình bóng nhỏ hiện trong ánh đèn): *"Chào em. Anh là Giuse, con ông Gia-cóp, con thứ mười một trong mười hai anh em. Chiếc áo này cha tặng anh. Nhưng nó đã đi một chặng đường rất dài... Em giúp anh ghép lại bản đồ nhé?"* / *"Hello! I'm Joseph, son of Jacob. Dad gave me this coat. It has travelled a long, long way... Will you help me mend the map?"*
* **Gameplay:** tìm & ghép 3 mảnh bản đồ (*Hếp-rôn → Ai-cập → Gô-sen*), thắp đèn bàn → nhận **Chiếc Áo Mặt Trời (0/12 tia)**.
* **Khoảnh khắc:** Giuse mỉm cười: *"Điều quan trọng không phải là chiếc áo đẹp, mà là Ai luôn ở bên anh."*
* 🎵 `lullaby`; ambience `crickets`; surface `wood`; SFX `pickup`, `chime`, `bless`.

---

# HỒI 1: QUÊ NHÀ & BỊ BÁN (`St 37`)

### Stage 1: Giấc Mơ Bó Lúa Trên Đồng Hếp-rôn (`St 37, 1-11`)
* **Lời Chúa chủ đề:** *"Ông Ít-ra-en thương ông Giuse hơn tất cả các con khác, vì ông Giuse là đứa con lúc tuổi già của ông; và ông may cho cậu một chiếc áo dài có tay."* (`St 37, 3`) *[kiểm lại CGKPV]*
* **Ảnh:** `intro-1.png` – đồng lúa vàng, Giuse mặc áo mặt trời đứng giữa 11 bó lúa cúi về phía bó của mình trong giấc mơ; trời có mặt trời, mặt trăng, 11 vì sao.
* **Bản đồ:** đồng lúa Hếp-rôn (~20×14 ô) + lều Gia-cóp phía tây. NPC: **Gia-cóp**, các anh (Rúp-ben, Giu-đa… vẽ 3 kiểu chung), **Ben-gia-min** bé (khung nhỏ).
* **Gameplay – Gặt & dựng bó lúa:** Pha 1 – cùng các anh gặt lúa, nhặt **12 bó** (A = cắt, bó lúa bob + sparkle). Pha 2 – cảnh giấc mơ (tông màu tím nhạt): dựng bó lúa theo **mẫu hình ngôi sao 11 + 1** do mặt trời chiếu xuống. Độ khó: thấp (làm quen điều khiển). Checkpoint sau Pha 1.
* **Outro:** Giuse kể giấc mơ ngây thơ; các anh nhăn mặt; Gia-cóp *"suy nghĩ về lời ấy"* (`St 37, 11`). Tia #1 sáng.
* **Hoa trái:** Biết **cảm ơn tình yêu của cha** và **không khoe** ơn mình được nhận; lời nói có thể làm người khác buồn.
* 🎵 `pastoral`; `["birds","wind"]`; `grass`; SFX `pickup`, `bless`.

### Stage 2: Cha Sai Đi Thăm Các Anh – Người Lạ Chỉ Đường (`St 37, 12-17`)
* **Lời Chúa:** *"Cha sai con đi xem các anh con và đàn chiên có được bình an không."* (diễn ý `St 37, 14`) *[kiểm lại CGKPV]*
* **Ảnh:** `intro-2.png` – Giuse với bao bánh & bình nước trên con đường đồi đá từ Hếp-rôn đến Sê-khem, một người lạ chỉ tay về phía chân trời.
* **Bản đồ:** đồi đá hình ngã ba, nhiều ngã rẽ (3 khu: Hếp-rôn / Sê-khem / Đô-than). NPC: **người lạ chỉ đường**, đàn chiên xa.
* **Gameplay – Tìm đường (orienteering):** hỏi dân/cây cột mốc để biết hướng; sai hướng thì gặp ngõ cụt (lùi Checkpoint nhẹ). Thu **3 mốc đá** (đường đi) để mở lối. Có la bàn bằng bóng nắng (thay thế mũi tên cố định).
* **Outro:** người lạ: *"Họ đã đi Đô-than rồi."* Giuse vẫn đi tiếp, không bỏ cuộc vì vâng lời cha. Tia #2.
* **Hoa trái:** **Vâng lời với lòng tin**, hoàn thành việc cha mẹ giao dù đường xa.
* 🎵 `wilderness`; `wind`; `rock`/`grass`; SFX `pickup`, `chime`.

### Stage 3: Giếng Cạn Đô-than (`St 37, 18-28`)
* **Lời Chúa:** *"Chúng nói với nhau: 'Kìa, tay chuyên mơ mộng đến rồi!'"* (`St 37, 19`) *[kiểm lại CGKPV]* và *"Ông Rúp-ben nghe vậy liền tìm cách cứu ông Giuse khỏi tay họ."* (`St 37, 21`) *[kiểm lại]*
* **Ảnh:** `intro-3.png` – Giuse dưới đáy giếng cạn nhìn lên vòng trời tròn, áo mặt trời được các anh cầm phía trên; Rúp-ben nhìn xuống đầy lo lắng.
* **Bản đồ:** đồng cỏ Đô-than + **giếng cạn** (khu cắt xuống, nhìn từ trên – 1 màn có "đáy giếng" 10×10).
* **Gameplay – Giữ bình tĩnh & thoát giếng:** Pha 1 – bị các anh vây, người chơi *không đánh trả*: bấm B (cầu nguyện) để giữ **vòng Bình An** không tắt. Pha 2 – trong giếng: tìm **3 đoạn dây** (do Rúp-ben thả trộm) nối lại → **leo lên** khi đoàn lái buôn tới (Giu-đa đề nghị: "*đừng hại em, hãy bán cho lái buôn*"). Không có đòn đánh; người chơi chỉ **chạy tránh – leo – cầu nguyện**. Checkpoint: trước giếng.
* **Outro (🎬):** các anh nhúng áo vào máu dê (chỉ cho thấy tấm áo đỏ sẫm, không cảnh giết dê). Giuse nói trong lòng: *"Lạy Chúa, con ở đây. Xin ở cùng con."* Tia #3.
* **Hoa trái:** Ghen ghét làm anh em xa nhau; khi bị đối xử bất công, hãy **cầu nguyện và đừng trả đũa**.
* 🎵 `wilderness` trầm; `wind`; `dirt`; SFX `hit` (nhẹ), `chime`, `bless`.

### Stage 4: Đoàn Lái Buôn Trên Sa Mạc (`St 37, 25-36`)
* **Lời Chúa:** *"Họ bán ông Giuse cho người Ít-ma-en với giá hai mươi đồng bạc; những người ấy đem ông Giuse đi Ai-cập."* (`St 37, 28`) *[kiểm lại]*
* **Ảnh:** `intro-4.png` – đoàn lạc đà, Giuse ngồi sau lạc đà nhìn lại quê nhà xa dần; phía quê, Gia-cóp ôm chiếc áo.
* **Bản đồ:** sa mạc dọc dài (đi ngang → dọc), ốc đảo giữa đường.
* **Gameplay – Runner sa mạc:** điều khiển Giuse theo đoàn lạc đà qua cát; né bụi gai/đá, **gom bình nước** để cả đoàn không khát; qua **2 ốc đảo** (checkpoint). Có tốc độ nhẹ – không quá khó.
* **Outro (🎬 cầu nối):** Cảnh Gia-cóp ở quê ôm áo khóc, *"Con ơi, ta sẽ xuống âm phủ mà khóc con"* (`St 37, 35` – diễn ý, *[kiểm lại]*). Giuse hát nhỏ khi nhìn sao: Chúa vẫn ở cùng. Tia #4.
* **Hoa trái:** **Hy vọng** khi xa gia đình; Thiên Chúa không bỏ rơi ai.
* 🎵 `wilderness`/`desert`; `wind`; `sand`; SFX `staff`, `pickup`.

---

# HỒI 2: AI-CẬP – NÔ LỆ & TÙ NHÂN (`St 39 – 41`)

### Stage 5: Nhà Ông Pút-ti-phác – "Đức Chúa Ở Với Giuse" (`St 39, 1-6`)
* **Lời Chúa:** *"Đức Chúa ở với ông Giuse, nên mọi việc ông làm đều thành công."* (`St 39, 2-3`) *[kiểm lại]*
* **Ảnh:** `intro-5.png` – sân nhà ông Pút-ti-phác với hồ sen; Giuse (áo nô lệ giản dị, nhưng ánh sáng vàng nhỏ quanh vai) sắp xếp bình và rương, chủ nhà mỉm cười.
* **Bản đồ:** dinh thự (3 phòng: kho, bếp, sân vườn) 20×14.
* **Gameplay – Quản gia nhỏ:** nhận **phiếu việc** (bưng bình, xếp lúa, tưới vườn, dọn sổ); hoàn thành theo thứ tự/time-window; càng đúng giờ, "Ánh Tin Cậy" càng đầy. Không có phạt nặng; hết giờ → làm lại phiếu.
* **Outro:** chủ nhà giao hết mọi việc cho Giuse. Tia #5.
* **Hoa trái:** Làm việc nhỏ **trung tín**, dù không ai khen; Chúa vẫn thấy.
* 🎵 `lullaby`/`pastoral` ấm; `["birds"]`; `stone`/`wood`; SFX `pickup`, `chime`.

### Stage 6: Hành Lang Dinh Thự – "Làm Sao Tôi Dám Phạm Tội Với Thiên Chúa?" (`St 39, 7-20`)
* **Lời Chúa:** *"Làm sao tôi dám làm điều ác này mà phạm tội với Thiên Chúa?"* (`St 39, 9`) *[kiểm lại]*
* **Ảnh:** `intro-6.png` – hành lang cột đá, Giuse chạy khỏi bóng đen của một lời mời xấu; chiếc áo (áo ngoài) bị giữ lại bên tay kẻ khác, một tia sáng trắng đưa Giuse ra cửa.
* **Cách thể hiện cho thiếu nhi:** không có cảnh quyến rũ. Bà chủ hiện như **bóng đen thúc ép làm điều sai** (ví dụ "hãy làm điều không đúng với ông chủ"), phù hợp lứa tuổi; Giuse nói rõ "không". Phần vu oan được kể ngắn qua cutscene.
* **Bản đồ:** hành lang dài có **nhiều cánh cửa** (cửa Sáng / cửa Tối), 4 phòng.
* **Gameplay – Chạy hành lang & chọn đúng lối:** bóng đen rượt chậm; người chơi **đóng cửa sau lưng** (A), chọn cửa có **ánh sáng trắng** thay vì cửa đỏ cám dỗ (sai → mất 1 Giọt Bình An, về Checkpoint). Cuối hành lang, Giuse bỏ lại áo choàng (cảnh quan trọng) và ra cửa lớn.
* **Outro (🎬):** Giuse bị dẫn đi ngục; tựa cửa ngục anh vẫn nói *"Con thà chịu thiệt chứ không làm điều ác."* Tia #6.
* **Hoa trái:** Nói **"không" với điều sai**, dù phải chịu thiệt; giữ **lòng trong sạch** là làm đẹp lòng Chúa.
* 🎵 `wilderness` căng nhẹ; `["torch"]`; `stone`; SFX `door`, `chime`, `bless`.

### Stage 7: Trong Ngục – Quan Tửu Chánh & Quan Thượng Thiện (`St 39, 21 – 40, 23`)
* **Lời Chúa:** *"Việc giải mộng chẳng phải của Thiên Chúa sao? Xin các ông cứ kể cho tôi nghe."* (`St 40, 8`) *[kiểm lại]*
* **Ảnh:** `intro-7.png` – ngục đá có một cửa sổ hẹp, tia nắng rọi như bậc thang; Giuse với hai quan tù ngồi nghe kể mơ (bên trái nho ép ra chén, bên phải ba giỏ bánh có chim sà xuống).
* **Bản đồ:** ngục 3 buồng + sân hẹp.
* **Gameplay – Ghép biểu tượng giấc mơ:** hai giấc mơ (nho / giỏ bánh). Người chơi nhặt **các mảnh biểu tượng** (3 cành nho, 3 giỏ bánh, chim, chén) và **ghép đúng chuỗi** để giúp Giuse giải; giải thích: *"Không phải con giải, nhưng Thiên Chúa."* Độ khó trung bình.
* **Outro:** quan tửu chánh được trả chức, quên Giuse hai năm (`St 40, 23`). Giuse vẫn kiên nhẫn. Tia #7.
* **Hoa trái:** Phục vụ người khác ngay cả khi **mình đang đau khổ**; **kiên nhẫn chờ giờ của Chúa**.
* 🎵 `lullaby` chậm; `["drip"]`; `stone`; SFX `chime`, `pickup`.

### Stage 8: Cung Pha-ra-ô – Bảy Bò & Bảy Bông Lúa (`St 41, 1-36`)
* **Lời Chúa:** *"Không phải con, nhưng chính Thiên Chúa sẽ cho Pha-ra-ô một câu trả lời bình an."* (`St 41, 16`) *[kiểm lại]*
* **Ảnh:** `intro-8.png` – Pha-ra-ô (khăn nemes) ngồi trên ngai, phía sau hiện giấc mơ: 7 bò béo bước lên từ sông Nin, 7 bò gầy nuốt chúng; 7 bông lúa đầy, 7 bông lép.
* **Bản đồ:** đại điện cung điện (chọn vừa phải 18×14).
* **Gameplay – Trí nhớ & sắp lịch:** Pha 1 – xem lại **dãy 7 béo / 7 gầy** rồi **xếp thẻ theo thứ tự** (memory). Pha 2 – dựng "lịch 14 năm": kéo 7 ô **năm no** rồi 7 ô **năm đói** vào dòng thời gian, để lúa của năm no được **cất vào kho**. Độ khó: trung bình.
* **Outro:** Giuse khuyên Pha-ra-ô chọn người khôn ngoan lo kho lúa. Tia #8.
* **Hoa trái:** **Khiêm nhường**: biết rằng tài năng là **quà của Thiên Chúa**; chuẩn bị chu đáo cho tương lai.
* 🎵 `lullaby` + `bless`; `torch`; `stone`; SFX `chime`.

---

# HỒI 3: TỂ TƯỚNG & THA THỨ (`St 41, 37 – 50, 21`)

### Stage 9: Từ Ngục Tù Đến Tể Tướng – Xây Kho Lúa (`St 41, 37-52`)
* **Lời Chúa:** *"Pha-ra-ô nói với ông Giuse: 'Thiên Chúa đã cho ông biết mọi điều ấy… không có ai khôn ngoan sáng suốt bằng ông.'"* (`St 41, 39`) *[kiểm lại]*
* **Ảnh:** `intro-9.png` – Giuse được khoác áo gai mịn, đeo vòng cổ vàng, nhận nhẫn từ Pha-ra-ô; ngoài sân đoàn người đang xây kho lúa gạch bùn dưới nắng.
* **Bản đồ:** thung lũng sông Nin 24×16 (nhiều làng); điểm thu lúa & điểm xây.
* **Gameplay – Xây & thu:** trong **7 năm** (mỗi năm = 1 vòng ngắn): gom lúa từ ruộng (A) về **kho lúa**; mỗi vòng thêm 1 kho; chống thất thoát (chuột/mưa) bằng cách che bao. Mục tiêu: **7 kho đầy**. Checkpoint mỗi 2 năm.
* **Outro:** Giuse đặt tên con **Ma-na-xê** & **Ép-ra-gim** (`St 41, 51-52`) *[kiểm lại tên CGKPV]* – một câu nói biết ơn: Thiên Chúa cho anh *"quên"* nỗi khổ và *"nở rộ"* nơi xứ khổ. Tia #9.
* **Hoa trái:** **Khôn ngoan chuẩn bị**, dùng quyền để **phục vụ** chứ không để khoe.
* 🎵 `pastoral` hào hùng; `["birds","crowd"]`; `sand`/`stone`; SFX `pickup`, `bless`.

### Stage 10: Nạn Đói & Những Người Anh Trở Lại (`St 41, 53 – 42, 38`)
* **Lời Chúa:** *"Cả thế giới kéo đến Ai-cập để mua lúa nơi ông Giuse."* (`St 41, 57`) – tiếng Ai-cập: *"Hãy đến với ông Giuse"* (`St 41, 55`) *[kiểm lại]*
* **Ảnh:** `intro-10.png` – dòng người xếp hàng trước kho lúa; giữa đám đông 10 người anh quỳ xuống, Giuse nhận ra nhưng đứng im.
* **Bản đồ:** sân phát lúa; hàng người nhiều đoạn.
* **Gameplay – Phát lúa công bằng:** quản lý hàng người, mỗi người **một phần vừa đủ**, ưu tiên **người già & trẻ em**; sai khẩu phần → người phàn nàn (mất điểm). Khi các anh đến: *"Ta thử xem lòng họ có đổi không."* Cutscene ngắn: Giuse nói bằng phiên dịch, giữ Si-mê-ôn, yêu cầu mang **Ben-gia-min** đến.
* **Outro:** Giuse quay đi khóc (`St 42, 24`). Tia #10.
* **Hoa trái:** **Chia sẻ** thực phẩm với người nghèo là việc của Chúa; Chúa Giê-su là *Bánh Hằng Sống* (`Ga 6, 35`) – **"Hãy đến với Giuse"** nhắc ta *"Hãy đến với Chúa Giê-su"* trong Thánh Thể.
* 🎵 `lullaby` hơi buồn; `["crowd"]`; `sand`; SFX `pickup`, `chime`.

### Stage 11: Chén Bạc & Lời Xin Của Giu-đa (`St 43 – 44`)
* **Lời Chúa:** *"Xin cho con, tôi tớ ngài, ở lại thay cậu bé làm nô lệ của ngài, và để cậu ấy trở về với các anh."* (`St 44, 33`) *[kiểm lại]*
* **Ảnh:** `intro-11.png` – bàn tiệc Ai-cập, một chén bạc lấp lánh trong bao lúa của Ben-gia-min; Giu-đa quỳ xin thay em.
* **Bản đồ:** phòng yến tiệc + sân bao lúa.
* **Gameplay – Tìm chén & chọn lương tâm:** Pha 1 – kiểm tra **11 bao lúa** (A = mở) để tìm chén bạc (hint ánh bạc). Pha 2 – **màn lựa chọn**: Giu-đa có thể bỏ mặc em hay thay em? Người chơi chọn lời Giu-đa nói (3 câu; chỉ 1 câu đúng tinh thần). Không thất bại – chọn sai thì Giuse "chờ một lát" để người chơi chọn lại.
* **Outro:** Giuse xúc động không nén nổi. Tia #11.
* **Hoa trái:** Người **biết hối cải** là người **dám nhận lỗi và hy sinh vì anh em**; lòng yêu thương làm lành mọi vết thương.
* 🎵 `lullaby` chậm → `bless`; `["torch"]`; `stone`; SFX `chime`, `bless`.

### Stage 12: Gô-sen – "Tôi Là Giuse, Em Các Anh" (`St 45; 46; 50, 15-21`)
* **Lời Chúa chủ đề:** *"Anh em đã toan tính điều ác cho tôi, nhưng Thiên Chúa lại toan tính cho nó thành điều tốt, để thực hiện như hôm nay: cứu sống một dân đông đảo."* (`St 50, 20`) *[kiểm lại CGKPV]*; *"Chính Thiên Chúa đã sai tôi đi trước anh em để cứu sống anh em."* (diễn ý `St 45, 5`)
* **Ảnh:** `intro-12.png` – cánh đồng Gô-sen ấm áp; Gia-cóp bước xuống xe, Giuse chạy tới ôm cha; các anh ôm nhau, một chiếc áo mặt trời được vá lành giơ giữa họ.
* **Bản đồ:** đường từ biên giới đến Gô-sen (dài – lạc đà & xe); khu lều đoàn tụ.
* **Gameplay – Rước xe & trao quà:** dẫn **đoàn xe của Giuse** (đường nối các ô) đón Gia-cóp; đặt **11 phần quà** vào tay các anh ở khu lều; cuối cùng bấm A để **ôm** (cutscene). Độ khó: thấp, cảm xúc.
* **Outro:** Giuse tha thứ trọn vẹn; các anh sợ hãi sau khi cha mất, Giuse nói *"Đừng sợ… tôi sẽ nuôi anh em"* (`St 50, 19-21`) *[kiểm lại]*. Tia #12 – **Chiếc Áo Mặt Trời tròn 12 tia**.
* **Hoa trái:** **Tha thứ** là cách giống Chúa nhất; Thiên Chúa viết điều tốt qua cả những điều khổ đau.
* 🎵 `lullaby` → `bless`; `["birds","wind"]`; `grass`; SFX `bless`, `chime`.

---

# EPILOGUE: GIUSE VÀ CHÚA GIÊ-SU (`St 37 – 50`; `Ga 6, 35`)
* **Ảnh:** `intro-end.png` – phòng học, chiếc áo mặt trời đã vá, Sách Thánh mở; hình bóng Giuse nhỏ dần cạnh hình Chúa Giê-su chăn chiên nhân hậu.
* **Thoại:** Giuse: *"Anh bị bán, bị ruồng bỏ, rồi thành người cứu anh em. Có một Người khác cũng đã bị bán với giá bạc, chịu khổ vì chúng ta, và tha thứ cho tất cả: Chúa Giê-su."* / *"I was sold and left behind, yet became my family's rescuer. Another One was also sold for silver, suffered for us, and forgave all: Jesus."*
* **Gameplay:** nhẹ – người chơi đặt 12 tia lên áo, mặc áo cho Giuse, và nhận Huy hiệu **"Người Tha Thứ"** (ghi nhận vào màn tổng kết chung `EndingCongrats`).
* **Suy niệm tổng kết (3 ý):** ① Thiên Chúa không bỏ rơi người trung tín. ② Điều ác của người khác không thắng được kế hoạch của Chúa. ③ Tha thứ làm lành cả gia đình.
* 🎵 `lullaby`; `bless`.

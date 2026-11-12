# KỊCH BẢN NỘI DUNG & GAMEPLAY DESIGN: KING DAVID – SHEPHERD & KING (VUA ĐA-VÍT – NGƯỜI CHĂN CHIÊN & VỊ VUA GIAO ƯỚC)

* **Tên game:** *King David – Shepherd & King* (`modules/king-david`)
* **Kinh Thánh nền tảng:** Sách Sa-mu-en Quyển I & II và Sách Thánh Vịnh (`1 Sm 16, 1 – 2 Sm 7, 29; Tv 23; 57`).
* **Vai trò người chơi:** **Lữ khách nhỏ tuổi (Người Tìm Kiếm Đức Tin)** – tiếp nối hành trình sau *The Garden of Eden*, *Noah's Ark* và *Moses – The Exodus*. Khi mở đến **Sách Sa-mu-en** và **Sách Thánh Vịnh**, em được **Đức Chúa Thánh Thần** dẫn vào câu chuyện tuyệt đẹp về **Đa-vít** – cậu bé út chăn chiên trên cánh đồng Bê-lem được Thiên Chúa nhìn thấu tận đáy lòng và xức dầu tuyển chọn. Đồng hành cùng Đa-vít qua tiếng đàn hạc xoa dịu cung điện vua Sa-un, trận quyết đấu quả cảm với người khổng lồ Gô-li-át tại thung lũng Ê-la, tình bạn thánh thiêng với hoàng tử Giô-na-than, những năm tháng ẩn mình nơi hang đá hoang địa nhưng luôn giữ trọn lòng nhân hậu không trả thù, cho đến ngày chính thức đăng quang tại Khép-rôn, xây dựng thành đô Giê-ru-sa-lem và rước **Hòm Bia Giao Ước** trong niềm vui khôn tả.
* **Vật phẩm tiến trình (Progression Item):** **Cây Đàn Hạc Vàng & Vương Miện Đa-vít (12 Ấn Thánh Vịnh & Vương Quyền)**. Hoàn thành mỗi Stage sẽ thắp sáng 1 Dây Đàn / Ấn Thánh Vịnh bằng ánh sáng vàng kim trên Cây Đàn Hạc.
* **Điểm nhấn Trình bày & Độ khó:**
  1. **🖼️ Màn Hình Ảnh Minh Họa Mở Màn (Stage Intro Illustration Screen):**
     * Khi bắt đầu mỗi màn chơi, vùng màn hình phía trên hiển thị một **Bức tranh Minh Họa tĩnh toàn cảnh dạng tranh truyện (Storybook Illustration)** được nạp trực tiếp từ thư mục `modules/king-david/images/intro-*.png` (phục vụ qua `/games/king-david/intro/*.png`).
     * Sau khi người chơi đọc xong lời dẫn nhập, bức tranh chuyển cảnh mượt mà (Fade / Pixel Wipe) vào bản đồ Top-down để bắt đầu thử thách.
  2. **🎮 Đa dạng Thể loại Gameplay & Cơ chế Checkpoint (Soft Reset):**
     * 12 Stage chính là 12 cơ chế gameplay khác nhau: dẫn đàn chiên & xua thú dữ ở Bê-lem, gảy đàn hạc theo nhịp đẩy lùi bóng tối u sầu trong cung điện Sa-un, lọc chọn 5 viên đá suối & căn lực dây ná hạ Gô-li-át, giải mã mũi tên mật hiệu của Giô-na-than, thắp lửa & gảy đàn khích lệ người nghèo khổ trong hang A-đu-lam, bước êm trong hang tối Ên Gê-đi cắt vạt áo Sa-un thay vì trả thù, điều phối đoàn lừa lễ vật của bà A-bi-gai-in hòa giải, đột nhập doanh trại đêm lấy cây giáo & bình nước trên đồi Khắc-hi-la, nối chòm sao âm nhạc sáng tác Khúc Ca Cây Cung, quy tụ 12 cờ hiệu chi tộc Ít-ra-en tại Khép-rôn, điều tiết mạch nước Gi-khôn mở cổng thành Xi-on, và dẫn đoàn rước Hòm Bia Giao Ước vào Lều Thánh Giê-ru-sa-lem.
     * Đi sai bước hoặc chạm chướng ngại sẽ lùi về **Checkpoint** gần nhất để người chơi thử lại.
  3. **🎬 Chuỗi Cutscene Kể Chuyện Chặt Chẽ (Narrative Storyline Bridges):**
     * Giữa các giai đoạn lịch sử luôn có các đoạn hoạt cảnh kể chuyện (Storyline Cutscenes) sâu sắc, giải thích vì sao vua Sa-un đánh mất ơn Chúa, nguồn gốc lòng ganh tị của Sa-un đối với Đa-vít, và làm nổi bật trái tim khiêm nhường, tín thác trọn vẹn vào Chúa của Đa-vít.

* **Cấu trúc chuẩn của mỗi Stage:**
  1. **Dẫn nhập & Câu Lời Chúa chủ đề (Intro Cutscene)**
  2. **🖼️ Ảnh Minh Họa Mở Màn (`modules/king-david/images/intro-*.png`)**
  3. **Bản đồ Top-Down & Nhân vật xuất hiện**
  4. **Thể loại & Cơ chế Gameplay chi tiết (Genre, Luật chơi, Độ khó / Checkpoint)**
  5. **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro)**
  6. **🎬 Hoạt cảnh Kể Chuyện Chuyển Tiếp (Storyline Bridge Cutscene - nếu có)**

---

# PHẦN 0: KHÚC DẠO ĐẦU (PROLOGUE) – CÂY ĐÀN HẠC & BẢN ĐỒ BÊ-LEM – XI-ON

---

### Màn Mở Đầu: Cây Đàn Hạc & Bản Đồ Bê-lem – Xi-on (`Tv 23, 1-6`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa là Mục Tử chăn dắt tôi, tôi chẳng thiếu thốn gì. Trong đồng cỏ xanh tươi, Người cho tôi nằm nghỉ; Người đưa tôi tới dòng nước trong lành và bổ sức cho tâm hồn tôi."* (`Tv 23, 1-3`).
  * *Bối cảnh mở màn:* Buổi tối yên bình trong căn phòng nhỏ của Lữ khách. Trên bàn học, cuốn Kinh Thánh đang mở ở **Sách Sa-mu-en** và **Thánh Vịnh 23** bên cạnh tấm bản đồ cổ vẽ vùng đồi Bê-lem, hoang địa Giu-đa và kinh thành Giê-ru-sa-lem.
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-start.png`
  * *Bối cảnh:* Trang sách Sa-mu-en và Thánh Vịnh mở trên bàn học dưới ánh đèn dầu ấm áp, hiện lên khải tượng về đồng cỏ Bê-lem xanh mướt, cây đàn hạc gỗ nhỏ, chiếc dây ná với 5 viên đá cuội, vương miện vàng trên đồi Xi-on và chim bồ câu Chúa Thánh Thần.
* **Bản đồ Top-Down & Nhân vật:**
  * Căn phòng nhỏ buổi tối của Lữ khách.
  * Nhân vật: Lữ khách nhỏ tuổi, Đức Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay (Warm-up):**
  * *Thể loại:* Tương tác khám phá & Ghép bản đồ hành trình.
  * *Nhiệm vụ:*
    1. *Bước 1 – Thắp sáng ngọn đèn bàn học:* Bật ngọn đèn để soi sáng góc bàn nơi đặt tấm bản đồ vùng đất Giu-đa.
    2. *Bước 2 – Nối Lộ Trình Người Mục Tử Đến Ngai Vàng:* Ghép đúng 3 mảnh địa danh trên bản đồ theo thứ tự cuộc đời Đa-vít: **Đồng Cỏ Chăn Chiên Bê-lem $\rightarrow$ Hang Đá Hoang Địa Giu-đa $\rightarrow$ Thành Đô Xi-on Giê-ru-sa-lem**.
    3. *Bước 3 – Nhận Cây Đàn Hạc Hành Trình:* Chúa Thánh Thần hiện ra trao cho em **Cây Đàn Hạc Hành Trình (0/12 Ấn Thánh Vịnh)** và mời gọi: *"Con yêu dấu, sau khi dân Ít-ra-en định cư tại Đất Hứa và có vị vua đầu tiên là Sa-un, vua Sa-un đã kiêu ngạo bất tuân lệnh Chúa. Thiên Chúa bèn sai ngôn sứ Sa-mu-en đến làng nhỏ Bê-lem để tìm một người có tấm lòng ngay thẳng theo ý Chúa. Hãy cùng Ta lên đường gặp cậu bé chăn chiên Đa-vít nhé!"*.
* **Bài học suy niệm:** Thiên Chúa là Người Mục Tử nhân lành luôn yêu thương, dẫn dắt và nhìn thấu tấm lòng chân thật của mỗi chúng ta.

---

# HỒI 1: CẬU BÉ CHĂN CHIÊN BÊ-LEM (`1 Sm 16, 1 – 17, 58`)

---

### Stage 1: Đồng Cỏ Bê-lem & Dầu Thánh Tuyển Chọn (`1 Sm 16, 1-13`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa phán với ông Sa-mu-en: 'Đừng nhìn dáng vẻ bên ngoài cũng như vóc dáng cao lớn của nó... Vì Thiên Chúa không nhìn theo kiểu người phàm: người phàm chỉ thấy điều mắt nhìn thấy, còn Đức Chúa thì nhìn tận đáy lòng!'"* (`1 Sm 16, 7`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-1.png`
  * *Bối cảnh:* Cảnh đôi tại Bê-lem: bên trái là đồi cỏ xanh mướt nơi cậu út Đa-vít chăn đàn chiên trắng bên dòng suối; bên phải là sân nhà ông Giê-sê nơi ngôn sứ Sa-mu-en nghiêng sừng dầu thánh xức đầu Đa-vít trước sự ngỡ ngàng của người cha và 7 người anh cao lớn.
* **Bản đồ Top-Down & Nhân vật:**
  * Bản đồ gồm 2 khu vực nối tiếp: Phía Đông là **Đồng Cỏ & Bờ Suối Bê-lem** (có rào chiên, các bụi rậm nơi sư tử và gấu rình rập); phía Tây là **Ngôi Nhà Đá Của Ông Giê-sê** tại làng Bê-lem.
  * Nhân vật: Lữ khách nhỏ tuổi, cậu bé **Đa-vít**, đàn chiên Bê-lem, ông **Giê-sê**, 7 người anh (Ê-li-áp, A-bi-na-đáp, Sam-ma...), và ngôn sứ **Sa-mu-en**.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Flock Herding & Predator Defense (Dẫn đàn chiên qua đồng cỏ, xua thú dữ bảo vệ chiên non & Nghi thức xức dầu tuyển chọn).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Chăm Sóc & Bảo Vệ Đàn Chiên Ngoài Đồng (`1 Sm 16, 11; 17, 34-35`):** Trong lúc cả làng đang dự tiệc tế lễ cùng ngôn sứ Sa-mu-en, cậu út Đa-vít vẫn trung tín giữ đàn chiên ngoài đồng. Người chơi cùng Đa-vít thực hiện 2 việc:
       * **Dẫn Chiên Về Đồng Cỏ Xanh:** Dùng tiếng đàn hạc êm dịu (`[B]`) gọi **6 chú chiên con** đi lạc quanh bờ suối đi theo mình về chuồng đá an toàn.
       * **Xua Đuổi Sư Tử & Gấu Bảo Vệ Chiên:** Từ các bụi rậm ven rừng, **Sư Tử và Gấu** bất ngờ lao ra định tha chiên con! Người chơi phải nhanh chân chạy tới chắn trước mặt đàn chiên và bấm `[A]` dùng **Gậy Chăn Chiên / Dây Ná** đánh đuổi thú dữ tổng cộng 3 đợt để giải cứu chiên non an toàn.
    2. **Pha 2 – Cuộc Tuyển Chọn Tại Nhà Ông Giê-sê (`1 Sm 16, 6-13`):** Một gia nhân chạy ra đồng gọi Đa-vít về gấp vì ngôn sứ Sa-mu-en đã nhìn qua cả 7 người anh cao lớn nhưng Chúa đều báo *"Đức Chúa không chọn người này"*. Người chơi dẫn Đa-vít về sân nhà ông Giê-sê, bước qua hàng anh em đang đứng hai bên để tiến đến quỳ trước ngôn sứ Sa-mu-en và đón nhận **Dầu Thánh Từ Chiếc Sừng**.
    3. **Độ khó & Checkpoint:** Hoàn thành Pha 1 (đưa đủ 6 chiên vào chuồng và xua xong 3 đợt thú dữ) lưu Checkpoint trước khi về nhà ông Giê-sê.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Ông Sa-mu-en cầm sừng dầu xức cho Đa-vít giữa các anh của cậu. *"Từ ngày đó trở đi, Thần Khí Đức Chúa ngự trên Đa-vít mãnh liệt"* (`1 Sm 16, 13`). Ấn Thánh Vịnh thứ 1 thắp sáng trên Cây Đàn Hạc.
  * *Hoa trái suy niệm:* Thiên Chúa không đánh giá chúng ta qua vẻ bề ngoài, quần áo đẹp hay sức mạnh khoe khoang, nhưng Người nhìn vào **trái tim khiêm nhường, ngay thẳng và trung tín trong những bổn phận nhỏ bé hằng ngày**.

---

### Stage 2: Tiếng Đàn Hạc Trong Cung Điện Vua Sa-un (`1 Sm 16, 14-23`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Mỗi khi thần dữ của Thiên Chúa nhập vào vua Sa-un, thì Đa-vít lấy đàn mà gảy; vua Sa-un được nhẹ nhàng thoải mái, và thần dữ rời khỏi vua."* (`1 Sm 16, 23`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-2.png`
  * *Bối cảnh:* Đại điện cung điện Ghi-bơ-a: một bên là vua Sa-un ngồi ủ rũ trên ngai vàng giữa những đám mây tím đen u sầu; một bên là cậu bé Đa-vít đứng trong vầng sáng ấm áp gảy cây đàn hạc gỗ, lan tỏa những vòng sóng âm nhạc vàng kim xua tan bóng tối.
* **Bản đồ Top-Down & Nhân vật:**
  * Đại điện đá của vua Sa-un tại Ghi-bơ-a gồm ngai vàng ở phía Bắc, 6 cột đuốc đá hai bên hành lang và **3 Điểm Cộng Hưởng Âm Thanh** trên sàn khảm đá.
  * Nhân vật: Lữ khách nhỏ tuổi, cậu bé Đa-vít cầm đàn hạc, vua Sa-un và các cận thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Harp Rhythm & Shadow-Cloud Dispel (Di chuyển căn nhịp đàn hạc phát sóng ánh sáng xua tan bóng tối u sầu).**
  * **Cơ chế & Luật chơi:**
    1. Tâm hồn vua Sa-un đang bị bao vây bởi **3 Tầng Mây Đen Bất An**, đồng thời các **Luồng Khói U Sầu** liên tục trôi từ phía ngai vàng xuống khắp đại điện (chạm vào luồng khói sẽ làm giảm 1 Giọt Bình An).
    2. Người chơi phải điều khiển Đa-vít di chuyển khéo léo qua các luồng khói để đến đứng tại các **Điểm Cộng Hưởng Ánh Sáng** và thực hiện **Bản Nhạc Chữa Lành (3 Khúc Nhạc)**:
       * Tại mỗi Điểm Cộng Hưởng, các **Vòng Nốt Nhạc Vàng** thu nhỏ dần về tâm đàn hạc. Người chơi bấm phím `[A]` đúng thời điểm nốt nhạc chạm vào vòng chuẩn để phát ra **Sóng Âm Bình An** đẩy lùi đám mây đen và thắp sáng lại các cột đuốc trong cung điện!
       * Giữa các khúc nhạc, khi vua Sa-un bất ngờ nổi cơn bồn chồn làm tắt bớt đuốc, người chơi phải nhanh chóng chạy sang Điểm Cộng Hưởng kế tiếp để nối liền giai điệu không bị đứt quãng.
    3. **Độ khó & Checkpoint:** Mỗi Khúc Nhạc hoàn thành (tương ứng phá vỡ 1 tầng mây đen quanh ngai vàng) là 1 Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Tiếng đàn cầu nguyện trong trẻo của Đa-vít xua tan hoàn toàn bóng tối u ám; gương mặt vua Sa-un giãn ra nhẹ nhõm, bình an. Vua Sa-un rất thương mến Đa-vít và cho cậu làm người hầu cận (`1 Sm 16, 21`). Ấn Thánh Vịnh thứ 2 thắp sáng.
  * *Hoa trái suy niệm:* Lời cầu nguyện, thánh ca và thái độ dịu dàng của chúng ta có sức mạnh đem lại sự bình an của Chúa cho những người đang buồn phiền, lo âu quanh mình.

---

### Stage 3: Thung Lũng Ê-la & Người Khổng Lồ Gô-li-át (`1 Sm 17, 1-51`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đa-vít nói với người Phi-li-tinh: 'Ngươi đến với ta bằng gươm, bằng giáo, bằng lao; còn ta, ta đến với ngươi nhân danh Đức Chúa các đạo binh, Thiên Chúa của các hàng quân Ít-ra-en mà ngươi đã thách thức... để toàn thể đại hội này biết rằng không phải bằng gươm bằng giáo mà Đức Chúa ban chiến thắng!'"* (`1 Sm 17, 45.47`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-3.png`
  * *Bối cảnh:* Thung lũng Ê-la rộng lớn nằm giữa hai sườn núi đóng quân; cậu bé Đa-vít mặc áo vải chăn chiên đứng bên dòng suối đá cuội, tay quay dây ná phát sáng niềm tin đối diện với gã khổng lồ Gô-li-át cao lớn mặc giáp đồng lấp lánh cầm cây giáo khổng lồ.
* **Bản đồ Top-Down & Nhân vật:**
  * Bản đồ gồm 3 khu vực từ Bắc xuống Nam: **Trại Quân Ít-ra-en** trên sườn đồi $\rightarrow$ **Dòng Suối Thung Lũng Ê-la** ở giữa $\rightarrow$ **Đấu Trường Thung Lũng** nơi Gô-li-át đứng thách thức.
  * Nhân vật: Lữ khách nhỏ tuổi, Đa-vít, 3 người anh (Ê-li-áp, A-bi-na-đáp, Sam-ma), vua Sa-un, và gã khổng lồ **Gô-li-át** xứ Gát.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Stream Stone Selection & Precision Sling Boss Battle (Tiếp tế mặt trận, lọc chọn 5 viên đá cuội nhẵn & Đấu trùm căn lực dây ná).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Tiếp Tế Cho Các Anh & Chọn 5 Viên Đá Suối (`1 Sm 17, 17-40`):**
       * Vâng lời cha Giê-sê, người chơi dẫn Đa-vít mang **Giỏ Bánh Mì và Lúa Rang** giao tận tay cho 3 người anh ở chiến hào, rồi đến gặp vua Sa-un. Khi thử mặc bộ giáp đồng nặng nề của vua Sa-un (làm tốc độ di chuyển chậm đi một nửa!), người chơi bấm `[B]` cởi bỏ bộ giáp để giữ lấy sự nhanh nhẹn của người chăn chiên.
       * Tiếp theo, người chơi bước xuống **Dòng Suối Ê-la**: dưới làn nước chảy có nhiều hòn đá sần sùi và những **Viên Đá Cuội Nhẵn Phát Sáng**. Người chơi phải chọn nhặt đúng **5 Viên Đá Cuội Nhẵn (`5 Smooth Stones`)** bỏ vào túi chăn chiên.
    2. **Pha 2 – Quyết Đấu Người Khổng Lồ Gô-li-át (`1 Sm 17, 41-50`):**
       * Bước vào đấu trường thung lũng, Gô-li-át có thanh giáp kiên cố và liên tục tung ra **2 Đòn Tấn Công**: (a) *Đập Giáo Chấn Động* tạo sóng đất lan theo hình quạt và (b) *Lao Khiên Càn Quét*.
       * Người chơi phải di chuyển nhanh nhẹn né các vệt chấn động đỏ trên mặt đất. Ngay sau khi Gô-li-át vừa đập giáo xuống đất và phải hạ tấm khiên đồng để lấy đà (lộ ra **Điểm Hở Trên Trán** trong 3 giây), người chơi bấm giữ nút `[A]` để **Quay Dây Ná Tích Lực** và thả ra đúng vạch vàng để bắn viên đá cuội trúng đích!
       * Bắn trúng **3 lần chính xác** bằng sức mạnh đức tin sẽ hạ gục gã khổng lồ Gô-li-át!
    3. **Độ khó & Checkpoint:** Hoàn thành Pha 1 (có đủ 5 viên đá cuội nhẵn bên bờ suối) là Checkpoint ngay trước khi bước vào trận đấu với Gô-li-át.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Viên đá cuội bay vút trúng trán làm Gô-li-át ngã sấp xuống đất; toàn quân Ít-ra-en reo hò vang dậy! Ấn Thánh Vịnh thứ 3 (khép lại Hồi 1) bừng sáng.
  * *Hoa trái suy niệm:* Khi gặp những thử thách hay nỗi sợ hãi to lớn như "người khổng lồ Gô-li-át" trong học tập và cuộc sống, đừng cậy vào sức riêng hay sợ hãi, nhưng hãy **cầu nguyện và tiến bước nhân danh Chúa**.
* **🎬 Cutscene Chuyển Tiếp Cốt Truyện – Khúc Ca Chiến Thắng & Bóng Tối Đố Kỵ (`1 Sm 18, 5-16`):**
  * Khi đoàn quân khải hoàn trở về, phụ nữ từ các thành Ít-ra-en vừa múa hát vừa gõ trống cơm tung hô: *"Sa-un hạ được hàng ngàn, Đa-vít hạ được hàng vạn!"* (`1 Sm 18, 7`).
  * Câu hát ấy khiến vua Sa-un tức giận và sinh lòng đố kỵ sâu sắc: *"Họ gán cho Đa-vít hàng vạn, còn ta thì họ chỉ gán cho hàng ngàn; nó chỉ còn thiếu ngôi vua nữa thôi!"* (`1 Sm 18, 8`).
  * Từ hôm đó, Sa-un luôn nhìn Đa-vít với ánh mắt nghi kỵ và nhiều lần tìm cách phóng giáo sát hại cậu. Nhưng giữa cơn bão ganh ghét của hoàng cung, Thiên Chúa đã ban cho Đa-vít một người bạn tri kỷ tuyệt vời – chính là Hoàng tử Giô-na-than, con trai cả của vua Sa-un...

---

# HỒI 2: TÌNH BẠN THÁNH & THỬ THÁCH TRONG HOANG ĐỊA (`1 Sm 18, 1 – 26, 25`)

---

### Stage 4: Giao Ước Tình Bạn Giô-na-than & Mũi Tên Báo Hiệu (`1 Sm 18, 1-4; 20, 1-42`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Tâm hồn ông Giô-na-than gắn bó với tâm hồn Đa-vít, và ông Giô-na-than yêu mến Đa-vít như chính mạng sống mình... Hai người hôn nhau và khóc với nhau. Ông Giô-na-than nói với Đa-vít: 'Bạn hãy đi bình an, vì chúng ta đã nhân danh Đức Chúa mà thề rằng: Đức Chúa sẽ ở giữa tôi và bạn, giữa dòng dõi tôi và dòng dõi bạn đến muôn đời!'"* (`1 Sm 18, 1; 20, 41-42`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-4.png`
  * *Bối cảnh:* Hai khung cảnh tình bạn cao đẹp: bên trái là Hoàng tử Giô-na-than cởi áo choàng hoàng gia và trao cung tên kết nghĩa cho Đa-vít; bên phải là cánh đồng lúc bình minh nơi Đa-vít nấp sau tảng đá Ê-den còn Giô-na-than bắn 3 mũi tên mật hiệu lên bầu trời để báo tin.
* **Bản đồ Top-Down & Nhân vật:**
  * Nửa đầu là Hành Lang Cung Điện Ghi-bơ-a vào ban đêm; nửa sau là Cánh Đồng Đá Ê-den (`Ezel`) lúc rạng đông với các bụi cây, chòi canh lính của Sa-un và các bia tập bắn.
  * Nhân vật: Lữ khách nhỏ tuổi, Đa-vít, Hoàng tử **Giô-na-than**, công chúa Mi-khan (vợ Đa-vít hỗ trợ mở lối cửa sổ – `1 Sm 19, 12`), cậu bé hầu tên và lính tuần tra của vua Sa-un.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Stealth Escape & Arrow-Signal Code Puzzle (Ẩn nấp thoát khỏi vòng vây cung điện & Giải mã mật hiệu 3 mũi tên của Giô-na-than).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Kỷ Vật Kết Nghĩa & Thoát Khỏi Cung Điện (`1 Sm 18, 3-4; 19, 11-12`):** Tại sân trong, Giô-na-than trao cho Đa-vít **Áo Choàng, Chiến Bào, Gươm và Cây Cung** làm giao ước tình bạn. Khi lính của Sa-un kéo đến bao vây nhà, người chơi cùng Đa-vít leo qua dây cửa sổ do Mi-khan thả xuống và di chuyển ẩn nấp qua tầm nhìn (Vision Cone) của **4 Toán Lính Canh Đêm** để chạy ra cánh đồng ngoài thành.
    2. **Pha 2 – Giải Mã Mật Hiệu Ba Mũi Tên Bên Tảng Đá Ê-den (`1 Sm 20, 18-42`):** Sáng hôm sau, sau khi dò biết vua cha Sa-un quyết tâm hại Đa-vít, Giô-na-than ra cánh đồng bắn **3 Mũi Tên Báo Hiệu** kèm lời hô cho cậu bé nhặt tên:
       * Nếu mũi tên rơi **vượt xa phía trước** (*"Mũi tên ở đằng trước con kìa!"* – `1 Sm 20, 22`): Báo hiệu nguy hiểm tại chỗ đó, người chơi phải đổi sang lối đi phía xa để tránh toán lính tuần tra ngầm!
       * Người chơi quan sát điểm rơi phát sáng của **3 Đợt Bắn Tên** từ Giô-na-than để chọn đúng hành lang an toàn vượt qua cánh đồng đến điểm hẹn bí mật bên Tảng Đá Ê-den.
    3. **Độ khó & Checkpoint:** Hoàn thành Pha 1 (ra tới cánh đồng Ê-den) là 1 Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Khi cậu bé hầu đã về thành, Đa-vít bước ra khỏi chỗ nấp, cúi lạy ba lần rồi hai người bạn ôm nhau khóc nói lời từ biệt trong lời thề trước mặt Chúa (`1 Sm 20, 41-42`). Ấn Thánh Vịnh thứ 4 thắp sáng.
  * *Hoa trái suy niệm:* Một người bạn tốt lành và chân thành là món quà quý giá Chúa ban: Giô-na-than dù là thái tử nhưng không hề ganh tị với Đa-vít, trái lại luôn bảo vệ và đặt thánh ý Chúa lên trên quyền lợi riêng của mình.

---

### Stage 5: Bánh Thánh Đền Nóp & Hang A-đu-lam (`1 Sm 21, 1-7; 22, 1-5; Tv 57`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đa-vít rời khỏi đó và trốn vào hang A-đu-lam... Mọi người lâm cảnh túng cực, mọi người mắc nợ và mọi người bất mãn đều tụ họp quanh ông, và ông trở thành thủ lãnh của họ... Lạy Thiên Chúa, xin thương xót con, xin thương xót con, vì linh hồn con ẩn náu nơi Ngài; con ẩn náu dưới bóng cánh Ngài cho tới khi tai họa qua đi!"* (`1 Sm 22, 1-2; Tv 57, 2`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-5.png`
  * *Bối cảnh:* Bên trong hang đá A-đu-lam rộng lớn lúc hoàng hôn; ánh lửa trại bập bùng sưởi ấm những gia đình nghèo khổ và cha mẹ già của Đa-vít; ở trung tâm, Đa-vít vừa chia sẻ những ổ bánh ấm áp vừa gảy đàn hạc hát Thánh Vịnh hướng về bầu trời sao ngoài cửa hang.
* **Bản đồ Top-Down & Nhân vật:**
  * Khu vực Đền Thánh tại **Nóp (`Nob`)** ở góc trên và quần thể **Hang Đá A-đu-lam (`Adullam`)** rộng lớn với 6 ngách hang tối, các đống củi lửa và nơi nghỉ của các gia đình tị nạn.
  * Nhân vật: Lữ khách nhỏ tuổi, Đa-vít, tư tế **A-khi-me-léc**, cha mẹ của Đa-vít, ngôn sứ **Gát (`Gad`)**, và những người nghèo khổ tìm đến ẩn náu.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Sanctuary Camp Management & Torch/Harp Morale Puzzle (Thắp lửa sưởi ấm, phân phát Bánh Tiến & Gảy đàn Thánh Vịnh nâng đỡ tinh thần trong hang tối).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Lòng Nhân Từ Tại Đền Thờ Nóp (`1 Sm 21, 1-7`):** Trên đường trốn chạy đói lả, Đa-vít ghé vào Đền Thờ tại thành Nóp. Tư tế A-khi-me-léc đặt lòng thương người lên trên hết, trao cho Đa-vít **5 Chiếc Bánh Tiến Thánh (`Showbread`)** để cứu đói cho các bạn đồng hành (biến cố sau này được chính Chúa Giêsu nhắc lại trong `Mc 2, 25-26`!).
    2. **Pha 2 – Thắp Sáng & Sưởi Ấm Hang A-đu-lam (`1 Sm 22, 1-5`):** Bên trong hang A-đu-lam lạnh giá, có **6 Nhóm Người Túng Cực** (bao gồm cả cha mẹ già của Đa-vít) đang co ro vì đói lạnh và sợ hãi khi màn đêm buông xuống.
    3. Người chơi phải điều phối Đa-vít thực hiện chu trình chăm sóc mục tử trước khi thanh **Tinh Thần Trại** giảm xuống 0:
       * **Thắp Sáng 6 Đống Lửa Trại:** Mang lửa từ bếp chính đi thắp sáng đủ 6 ngách hang để đẩy lùi hơi lạnh đêm hoang địa.
       * **Chia Sẻ Lương Thực & Gảy Đàn Khích Lệ (`[A]`):** Đưa bánh đến các nhóm đang đói và đứng tại bệ đá trung tâm gảy đàn hạc hát **Thánh Vịnh 57 & Thánh Vịnh 34** để lan tỏa vòng sóng bình an khắp hang động.
    4. **Độ khó & Checkpoint:** Hoàn thành Pha 1 và thắp sáng được 3 ngách hang đầu tiên là Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Từ những con người nghèo khổ, sợ hãi và rời rạc ban đầu, nhờ tình thương và lời cầu nguyện của Đa-vít, họ đã trở thành một cộng đoàn yêu thương, gắn bó và dũng cảm bảo vệ nhau. Ấn Thánh Vịnh thứ 5 thắp sáng.
  * *Hoa trái suy niệm:* Khi chính mình gặp khó khăn, đừng khép kín trong nỗi buồn riêng, nhưng hãy mở lòng nâng đỡ, chia sẻ với những người nghèo khổ hơn mình và luôn ca tụng Chúa trong mọi hoàn cảnh.

---

### Stage 6: Hang Ên Gê-đi – Cắt Vạt Áo Thay Vì Trả Thù (`1 Sm 24, 1-23`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Các thuộc hạ của Đa-vít nói với ông: 'Đây là ngày Đức Chúa đã phán với ông: Này Ta nộp kẻ thù của ngươi vào tay ngươi!' Đa-vít đứng dậy và lén cắt vạt áo choàng của vua Sa-un... Ông nói với người của mình: 'Xin Đức Chúa đừng để tôi làm điều ấy cho chúa của tôi, cho Đấng đã được Đức Chúa xức dầu, là giơ tay hại người!'"* (`1 Sm 24, 5-7`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-6.png`
  * *Bối cảnh:* Tương phản ánh sáng tại ốc đảo núi đá Ên Gê-đi: bên trong hang tối, Đa-vít giơ tay ngăn các thuộc hạ và chỉ nhẹ nhàng cắt một mảnh nhỏ nơi gấu áo choàng đỏ của vua Sa-un; bên ngoài vách núi ngập nắng, Đa-vít cúi mình giơ mảnh vạt áo lên khiến vua Sa-un xúc động rơi nước mắt.
* **Bản đồ Top-Down & Nhân vật:**
  * Lòng hang đá vôi **Ên Gê-đi (`En-Gedi`)** nhiều ngách tối, các vũng nước tĩnh, sỏi đá dễ gây tiếng vang và lối thông ra **Vách Đá Nắng Ngoài Hang**.
  * Nhân vật: Lữ khách nhỏ tuổi, Đa-vít, các chiến hữu của Đa-vít đang ẩn trong bóng tối, và vua **Sa-un**.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Echo-Stealth & Mercy Restraint Puzzle (Bước êm trong hang tối tránh gây tiếng vang, khuyên ngăn đồng đội & Cắt vạt áo hòa giải).**
  * **Cơ chế & Luật chơi:**
    1. Vua Sa-un dẫn 3.000 quân tinh nhuệ đi lùng bắt Đa-vít nơi ghềnh đá Sơn Dương, rồi tình cờ một mình bước vào đúng hang đá nơi Đa-vít và đồng đội đang ẩn nấp sâu bên trong!
    2. **Pha 1 – Khuyên Ngăn Đồng Đội & Bước Êm Trong Hang Tối (`1 Sm 24, 4-8`):**
       * Trong bóng tối, **3 Người Thuộc Hạ Nóng Nảy** đang định rút gươm tiến ra hại vua Sa-un. Người chơi phải nhanh chóng di chuyển đến chạm vào từng người và bấm `[B]` ra hiệu **"Xin đừng hại Đấng được Chúa xức dầu!"** để trấn tĩnh họ.
       * Sàn hang có các **Vũng Nước Nhỏ và Đá Vụn**: nếu chạy nhanh qua sẽ tạo ra **Vòng Sóng Âm Tiếng Vang (Echo Ring)** làm vua Sa-un giật mình phát hiện! Người chơi phải đi chậm qua các phiến đá phẳng êm để tiếp cận phía sau tấm áo choàng dài của Sa-un và bấm `[A]` **Cắt Một Góc Vạt Áo Choàng**.
    3. **Pha 2 – Lời Đối Thoại Hòa Giải Trên Vách Đá (`1 Sm 24, 9-23`):** Khi Sa-un vừa bước ra khỏi cửa hang, người chơi dẫn Đa-vít đi theo lối ngách lên mỏm đá cao an toàn và giơ mảnh vạt áo choàng đỏ lên làm bằng chứng của lòng ngay thẳng và tha thứ.
    4. **Độ khó & Checkpoint:** Trấn tĩnh xong 3 thuộc hạ lưu Checkpoint 1; lấy được mảnh vạt áo lưu Checkpoint 2.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Nhìn thấy mảnh vạt áo trong tay Đa-vít, vua Sa-un nghẹn ngào bật khóc lớn tiếng: *"Đa-vít con ơi, có phải tiếng con đó không?... Con công chính hơn ta, vì con đã lấy ơn đáp oán, còn ta thì lấy oán báo ơn!"* (`1 Sm 24, 17-18`). Ấn Thánh Vịnh thứ 6 thắp sáng.
  * *Hoa trái suy niệm:* Chiến thắng vĩ đại nhất không phải là đánh bại kẻ thù bằng bạo lực, mà là **chiến thắng cơn giận trong lòng mình**, biết tha thứ và **lấy thiện thắng ác** (`Rm 12, 21`).

---

### Stage 7: Bà A-bi-gai-in Khôn Ngoan Hòa Giải (`1 Sm 25, 1-35`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đa-vít nói với bà A-bi-gai-in: 'Chúc tụng Đức Chúa, Thiên Chúa của Ít-ra-en, Đấng đã sai bà đến gặp tôi hôm nay! Chúc tụng sự khôn ngoan của bà, và chúc phúc cho bà, người đã ngăn cản tôi hôm nay khỏi phải đổ máu và tự tay báo oán!'"* (`1 Sm 25, 32-33`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-7.png`
  * *Bối cảnh:* Khúc đèo núi Các-mên xanh mát bóng cây ô-liu và cây vả; bà A-bi-gai-in hiền hậu dẫn đoàn lừa thồ những giỏ bánh mì, chùm nho khô và bánh trái vả cúi mình chào đón, làm tan biến cơn nóng giận của Đa-vít và đoàn quân.
* **Bản đồ Top-Down & Nhân vật:**
  * Vùng đồi núi **Ma-ôn – Các-mên (`Carmel`)**: phía Tây là trang trại xén lông chiên của ông Na-ban, ở giữa là **Đường Đèo Hẻm Núi Quanh Co** có các tảng đá chắn lối, phía Đông là đoàn quân của Đa-vít đang tiến lên.
  * Nhân vật: Lữ khách nhỏ tuổi đồng hành cùng bà **A-bi-gai-in**, người gia nhân báo tin, đoàn lừa chở lễ vật và Đa-vít.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Caravan Preparation & Mountain Pass Routing Puzzle (Chuẩn bị đoàn lừa lễ vật & Mở đường đèo kịp thời ngăn chặn xung đột).**
  * **Cơ chế & Luật chơi:**
    1. Suốt thời gian ở hoang địa, người của Đa-vít đã thức đêm bảo vệ đàn chiên hàng ngàn con của phú hộ **Na-ban** không mất một con nào. Thế nhưng trong ngày hội xén lông chiên, ông Na-ban ích kỷ lại buông lời sỉ nhục và đuổi người của Đa-vít về tay không. Trong cơn tức giận nhất thời, Đa-vít đã dẫn 400 người tiến lên núi định trừng phạt nhà Na-ban!
    2. **Pha 1 – Chuẩn Bị Lễ Vật Hòa Bình (`1 Sm 25, 18`):** Nhận tin từ người gia nhân trung tín, người chơi giúp bà A-bi-gai-in nhanh tay thu thập đủ **3 Loại Lễ Vật Tiếp Tế** tại kho trang trại chất lên lưng **3 Chú Lừa**: (1) **Giỏ Bánh Mì Thơm**, (2) **Chùm Nho Khô**, và (3) **Bánh Trái Vả Ép**.
    3. **Pha 2 – Điều Hướng Đoàn Lừa Qua Hẻm Núi Các-mên (`1 Sm 25, 19-20`):** Thanh thời gian hiển thị đoàn quân của Đa-vít đang tiến gần đến ngã ba hẻm núi. Người chơi dẫn bà A-bi-gai-in và đoàn 3 chú lừa đi qua đường đèo tắt: gạt các **Đòn Bẩy Gỗ Mở Cầu** và đẩy các **Tảng Đá Nhỏ** dọn thông 3 khúc cua hẹp để đoàn lừa kịp đến điểm giao lộ trước khi Đa-vít đi qua!
    4. **Độ khó & Checkpoint:** Chất đủ lễ vật lên 3 chú lừa ở Pha 1 là Checkpoint 1; qua mỗi khúc đèo được lưu vị trí an toàn.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Vừa gặp Đa-vít nơi hẻm núi, bà A-bi-gai-in khiêm tốn bước xuống lạy chào và thưa những lời khôn ngoan nhắc Đa-vít nhớ tới sứ mạng cao cả Chúa trao, đừng để lương tâm phải vướng bận vì một cơn nóng giận. Đa-vít bừng tỉnh, tạ ơn Chúa và đón nhận lễ vật trong hòa bình! Ấn Thánh Vịnh thứ 7 thắp sáng.
  * *Hoa trái suy niệm:* *"Một câu trả lời dịu dàng làm nguôi cơn giận"* (`Cn 15, 1`) — người khôn ngoan biết dùng lời nói hiền hòa để đem lại bình an, và người cao thượng như Đa-vít là người **biết lắng nghe lời khuyên đúng đắn để kịp thời dừng lại khi mình đang nóng giận**.

---

### Stage 8: Cây Giáo & Bình Nước Trên Đồi Khắc-hi-la (`1 Sm 26, 1-25`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đa-vít nói với ông A-bi-sai: 'Đừng giết vua! Vì có ai giơ tay hại Đấng đã được Đức Chúa xức dầu mà lại vô tội bao giờ?... Bây giờ, anh hãy lấy cây giáo ở đầu vua và cái bình nước, rồi chúng ta đi!'"* (`1 Sm 26, 9.11`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-8.png`
  * *Bối cảnh:* Đêm trăng lưỡi liềm xanh bạc trên đồi Khắc-hi-la; giữa vòng chiến xa và doanh trại đang ngủ say của vua Sa-un và tướng Áp-ne, Đa-vít cùng A-bi-sai nhẹ bước đến lấy cây giáo và bình nước đặt ngay đầu vua mà không làm hại một ai.
* **Bản đồ Top-Down & Nhân vật:**
  * Doanh trại hình tròn 3 lớp trên **Đồi Khắc-hi-la (`Hachilah`)** trong hoang địa Zi-phơ vào ban đêm: vòng ngoài là hàng rào xe chiến xa và lính gác ngủ, vòng giữa là khu lều tướng **Áp-ne**, tâm điểm là nơi vua **Sa-un** đang nằm ngủ có cắm cây giáo ở đầu, và phía Bắc là **Đỉnh Đồi Đối Diện**.
  * Nhân vật: Lữ khách nhỏ tuổi, Đa-vít, dũng sĩ **A-bi-sai**, vua Sa-un và tướng Áp-ne.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Moonlit Camp Infiltration & Pathfinding Puzzle (Giải đố tìm đường đột nhập doanh trại đêm lần thứ hai tha mạng cho Sa-un).**
  * **Cơ chế & Luật chơi:**
    1. Dù đã từng hối hận ở Ên Gê-đi, vua Sa-un lại một lần nữa nghe lời xúi giục kéo 3.000 quân đến đồi Khắc-hi-la truy bắt Đa-vít. Ban đêm, Thiên Chúa làm cho một giấc ngủ mê ập xuống toàn bộ doanh trại của Sa-un (`1 Sm 26, 12`).
    2. **Pha 1 – Lối Đi Giữa Vòng Chiến Xa (`1 Sm 26, 5-11`):** Người chơi dẫn Đa-vít và A-bi-sai vượt qua **3 Vòng Đai Doanh Trại**:
       * Trong trại có những đống lửa sắp tàn, những chiếc khiên đồng để ngổn ngang và những toán lính trở mình theo nhịp thở. Nếu đi vào ô có khiên đồng hoặc cành khô sẽ phát tiếng động làm lính gác thức giấc!
       * Người chơi dùng ánh trăng soi đường để mở các chốt dây lều, tìm lộ trình êm ái nhất tiến vào tận trung tâm trại nơi vua Sa-un đang ngủ.
    3. **Pha 2 – Lấy Cây Giáo & Bình Nước Rồi Rút Lên Đỉnh Đồi (`1 Sm 26, 12-16`):** Khi A-bi-sai xin phép đâm cây giáo xuống đất một nhát thôi, người chơi bấm `[B]` ngăn A-bi-sai lại, rồi bấm `[A]` thu nhận **Cây Giáo Hoàng Gia** và **Chiếc Bình Nước Đất Nung** đặt sát đầu vua Sa-un. Sau đó, dẫn cả hai rút ra ngoài qua lối hẻm núi phía Bắc lên đứng trên đỉnh đồi xa.
    4. **Độ khó & Checkpoint:** Tới được tâm doanh trại lấy Cây Giáo & Bình Nước là Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Từ đỉnh đồi bên kia, Đa-vít gọi lớn tiếng đánh thức tướng Áp-ne và giơ cao Cây Giáo cùng Bình Nước của nhà vua. Vua Sa-un nhận ra tấm lòng trung nghĩa tuyệt đối của Đa-vít lần thứ hai, chúc lành cho Đa-vít: *"Con sẽ làm những việc lớn lao và chắc chắn con sẽ thắng!"* (`1 Sm 26, 25`) rồi rút quân về và không bao giờ còn truy đuổi Đa-vít nữa. Ấn Thánh Vịnh thứ 8 (khép lại Hồi 2) thắp sáng.
  * *Hoa trái suy niệm:* Tha thứ một lần đã quý, nhưng **kiên trì tha thứ nhiều lần** như Đa-vít (tới hai lần có cơ hội trả thù mà vẫn giữ lòng nhân hậu) chính là hình ảnh của lòng khoan dung trọn hảo mà Chúa dạy chúng ta (*"tha đến bảy mươi lần bảy"* – `Mt 18, 22`).

---

# HỒI 3: VƯƠNG TRIỀU ĐA-VÍT & GIAO ƯỚC VĨNH CỬU (`2 Sm 1, 1 – 7, 29`)

---

### Stage 9: Khúc Ca Cây Cung & Nước Mắt Tình Bạn (`2 Sm 1, 17-27`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đa-vít hát bài ai ca này thương tiếc vua Sa-un và ông Giô-na-than, con vua, và truyền dạy cho con cái Giu-đa bài 'Cây Cung'... 'Sa-un và Giô-na-than, những người đáng yêu và khả ái, sống chẳng rời nhau, chết cũng chẳng lìa nhau... Giô-na-than anh ơi, lòng em đau thắt vì anh; tình anh đối với em thật là kỳ diệu!'"* (`2 Sm 1, 17-18.23.26`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-9.png`
  * *Bối cảnh:* Đỉnh đồi Giu-đa thanh vắng dưới bầu trời đêm tím thẫm ngàn sao; Đa-vít quỳ bên đài đá kỷ niệm gảy cây đàn hạc trong niềm xúc động sâu xa; trên bầu trời đêm, những vì sao vàng nối kết thành hình ảnh chiếc Vương Miện của Sa-un và Cây Cung của người bạn tri kỷ Giô-na-than.
* **Bản đồ Top-Down & Nhân vật:**
  * Đỉnh đồi tưởng niệm tại Giu-đa vào ban đêm với **Đài Đá Kỷ Niệm**, **5 Trụ Đàn Cộng Hưởng Sao Trời** và các môn đệ trẻ của chi tộc Giu-đa đang lắng nghe.
  * Nhân vật: Lữ khách nhỏ tuổi, Đa-vít và những người bạn đồng hành.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Star-Constellation Linking & Musical Lament Composition (Giải đố nối chòm sao kỷ niệm & Hòa tấu đàn hạc sáng tác Khúc Ca Cây Cung).**
  * **Cơ chế & Luật chơi:**
    1. Trong trận chiến bảo vệ đất nước trên núi Ghin-bô-a (`Gilboa`), vua Sa-un và hoàng tử Giô-na-than đã anh dũng hy sinh. Khi nghe tin báo, thay vì vui mừng vì đối thủ truy đuổi mình đã khuất, Đa-vít đã khóc thương chân thành và sáng tác **"Khúc Ca Cây Cung"** ca ngợi những phẩm tính tốt đẹp nhất của cả Sa-un lẫn người bạn hiền Giô-na-than.
    2. **Pha 1 – Thắp Sáng Ba Chòm Sao Tri Ân (`2 Sm 1, 19-26`):** Trên mặt sàn đá phản chiếu bầu trời đêm có 3 cụm sao chưa nối kết. Người chơi điều khiển Đa-vít cầm đàn hạc đi qua các **Đài Sao Ánh Sáng** theo đúng một nét liền (One-Stroke Path Puzzle) để vẽ sáng 3 biểu tượng tri ân:
       * **Chòm Sao 1 – Chiếc Khiên Dũng Cảm Trên Núi Ghin-bô-a (`2 Sm 1, 21`).**
       * **Chòm Sao 2 – Cánh Đại Bàng & Sư Tử Oai Hùng (`2 Sm 1, 23`):** *"Nhanh hơn đại bàng, mạnh hơn sư tử"*.
       * **Chòm Sao 3 – Cây Cung Của Giô-na-than (`2 Sm 1, 22.26`):** Biểu tượng tình bạn trung tín muôn đời.
    3. **Pha 2 – Truyền Dạy Khúc Ca Cây Cung Cho Con Cái Giu-đa (`2 Sm 1, 18`):** Đứng tại Đài Tưởng Niệm trung tâm, người chơi bấm `[A]` hòa nhịp đàn hạc cùng 5 học trò để hoàn tất bản trường ca bất hủ ghi vào *"Sách Người Ngay Chính"*.
    4. **Độ khó & Checkpoint:** Mỗi Chòm Sao được nối sáng hoàn chỉnh là 1 Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Bản nhạc ngân vang lên tới trời cao, khép lại mọi chia rẽ quá khứ trong sự tha thứ và lòng biết ơn trọn vẹn. Ấn Thánh Vịnh thứ 9 thắp sáng.
  * *Hoa trái suy niệm:* Một trái tim cao thượng theo gương Đa-vít là trái tim **không bao giờ vui mừng khi người khác gặp nạn**, luôn nhớ đến những điều tốt đẹp nơi tha nhân và giữ trọn nghĩa tình với bạn bè.

---

### Stage 10: Đăng Quang Tại Khép-rôn & Hiệp Nhất 12 Chi Tộc (`2 Sm 2, 1-4; 5, 1-5`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Tất cả các chi tộc Ít-ra-en đến gặp vua Đa-vít tại Khép-rôn và thưa rằng: 'Này chúng tôi là cốt nhục của ngài... Đức Chúa đã phán với ngài: Chính ngươi sẽ chăn dắt dân Ta là Ít-ra-en, và chính ngươi sẽ làm người lãnh đạo Ít-ra-en!'... Họ xức dầu tấn phong Đa-vít làm vua trên Ít-ra-en."* (`2 Sm 5, 1-3`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-10.png`
  * *Bối cảnh:* Quảng trường đá thành cổ Khép-rôn ngập tràn ánh nắng vàng và 12 lá cờ hiệu rực rỡ sắc màu của 12 Chi Tộc Ít-ra-en; ở trung tâm, Đa-vít quỳ gối khiêm cung nhận dầu thánh và vương miện vàng từ các bậc kỳ mục, bên cạnh ngai vàng vẫn đặt cây gậy mục tử năm xưa.
* **Bản đồ Top-Down & Nhân vật:**
  * Quảng trường Đại Hội tại thành **Khép-rôn (`Hebron`)** với **Vòng Tròn 12 Bệ Đá Giao Ước** bao quanh **Bàn Thờ & Ngai Mục Tử** ở chính giữa, và 4 cổng thành đón các đoàn đại biểu.
  * Nhân vật: Lữ khách nhỏ tuổi, Vua Đa-vít (30 tuổi – `2 Sm 5, 4`), các bậc kỳ mục đại diện **12 Chi Tộc Ít-ra-en**.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Twelve-Tribe Banner Alignment & Unity Puzzle (Đón tiếp các chi tộc & Giải đố sắp xếp 12 Cờ Hiệu Hiệp Nhất quanh Bàn Giao Ước).**
  * **Cơ chế & Luật chơi:**
    1. Sau khi cầu nguyện hỏi ý Chúa (`"Tôi có nên đi lên một trong các thành của Giu-đa không?"` – `2 Sm 2, 1`), Đa-vít lên thành Khép-rôn. Giờ đây, toàn thể 12 chi tộc từ Bắc chí Nam đều kéo về Khép-rôn để lập giao ước hiệp nhất dưới quyền vị Vua Mục Tử!
    2. **Pha 1 – Đón Tiếp & Hòa Giải Các Đoàn Đại Biểu:** Từ 4 cổng thành Khép-rôn, các trưởng lão của các chi tộc tiến vào. Người chơi cùng Đa-vít đến chào đón từng đoàn và nhận **Cờ Hiệu Biểu Trưng** của các nhóm chi tộc.
    3. **Pha 2 – Sắp Xếp Vòng Tròn Hiệp Nhất 12 Chi Tộc (`2 Sm 5, 1-3`):** Quanh Bàn Giao Ước có **12 Bệ Đá** chia theo 4 hướng Đông – Tây – Nam – Bắc (mỗi hướng 3 bệ đá khắc biểu tượng chi tộc như *Sư tử Giu-đa, Con tàu Giơ-vu-lun, Nhành nho Giô-xép, Ngọn đèn Lê-vi...*). Người chơi phải mang và đặt đúng từng **Cờ Hiệu Chi Tộc** vào đúng bệ đá biểu tượng tương ứng để kết nối mạch ánh sáng hiệp nhất toàn bộ 12 chi tộc thành một gia đình duy nhất!
    4. **Độ khó & Checkpoint:** Mỗi hướng (Đông, Nam, Tây, Bắc – 3 cờ hiệu mỗi hướng) hoàn tất sẽ khóa sáng và lưu Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Tiếng kèn sừng cừu vang rền khắp núi đồi Khép-rôn; các kỳ mục xức dầu tấn phong Đa-vít làm Vua toàn cõi Ít-ra-en. Đa-vít lên ngôi không phải để cai trị độc đoán, nhưng để **"chăn dắt dân Chúa"** như một người mục tử hiền lành (`2 Sm 5, 2`). Ấn Thánh Vịnh thứ 10 thắp sáng.
  * *Hoa trái suy niệm:* Trước khi làm bất cứ việc lớn nào, hãy biết **cầu nguyện hỏi ý Chúa** như Đa-vít; và hiểu rằng người lãnh đạo đích thực là người biết quy tụ, đoàn kết và phục vụ mọi người trong yêu thương.

---

### Stage 11: Mạch Nước Gi-khôn & Thành Đô Xi-on (`2 Sm 5, 6-12; 1 Sb 11, 4-9`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Tuy nhiên, Đa-vít đã chiếm được đồn lũy Xi-on, tức là Thành Đa-vít... Đa-vít ở trong đồn lũy và gọi đó là Thành Đa-vít; ông xây dựng thành chung quanh... Đa-vít ngày càng trở nên hùng mạnh, và Đức Chúa, Thiên Chúa các đạo binh, ở cùng ông."* (`2 Sm 5, 7.9-10`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-11.png`
  * *Bối cảnh:* Mặt cắt hai tầng của núi Xi-on: bên dưới là đường ống đá ngầm của suối Gi-khôn xanh biếc nơi Giô-áp và các dũng sĩ cầm đuốc leo lên; bên trên là Thành Đa-vít (Giê-ru-sa-lem) uy nghiêm với tường đá trắng và gỗ bá hương dưới bầu trời nắng vàng.
* **Bản đồ Top-Down & Nhân vật:**
  * Bản đồ gồm 2 tầng: **Hệ Thống Đường Nước Ngầm Suối Gi-khôn (`Tsinnor / Warren's Shaft`)** với các cửa đập nước đá ở nửa dưới, và **Đỉnh Đồi Đồn Lũy Xi-on (Giê-ru-sa-lem)** ở nửa trên.
  * Nhân vật: Lữ khách nhỏ tuổi, Vua Đa-vít, dũng tướng **Giô-áp (`Joab`)**, và các thợ xây dựng/thợ mộc gỗ bá hương của vua Khi-ram thành Tia (`2 Sm 5, 11`).
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Water-Shaft Sluice Puzzle & Citadel Construction (Giải đố điều tiết mực nước đường ngầm Gi-khôn mở cổng thành & Xây dựng Thành Đa-vít).**
  * **Cơ chế & Luật chơi:**
    1. Thành Giê-vu (Giê-ru-sa-lem) nằm trên đỉnh núi đá hiểm trở đến mức những người giữ thành tự phụ nghĩ rằng không ai có thể vào được. Nhưng Đa-vít đã phát hiện ra **Đường Ống Dẫn Nước Ngầm (`Tsinnor`)** nối từ suối Gi-khôn bên ngoài vào thẳng bên trong thành (`2 Sm 5, 8`)!
    2. **Pha 1 – Giải Đố Đường Nước Ngầm Suối Gi-khôn:**
       * Đường hầm đá có **4 Cửa Van Nước (`Sluice Gates`)** và các bậc thang đá bị ngập nước hoặc nước chảy xiết chắn lối.
       * Người chơi phải phối hợp cùng tướng Giô-áp xoay các **Bánh Xe Đá Điều Tiết Dòng Nước** theo đúng trình tự logic: hạ mực nước ở hành lang thấp để đi qua lấy chìa khóa đồng, sau đó nâng mực nước ở **Giếng Đứng (`Vertical Water Shaft`)** để bè gỗ nổi lên đưa Giô-áp và người chơi leo thẳng lên mở chốt **Cổng Thành Xi-on** từ bên trong một cách hòa bình, nhanh gọn!
    3. **Pha 2 – Kiến Thiết Thành Đa-vít Trên Đồi Xi-on (`2 Sm 5, 9-12`):** Khi cổng thành mở ra, người chơi điều phối việc vận chuyển **Đá Trắng Đẽo** và **Gỗ Bá Hương** đến 4 vị trí trọng yếu (Vòng Tường Thành Đông, Tháp Canh Mi-lô, Cung Điện Gỗ Bá Hương và Khu Đất Dựng Lều Thánh) để hoàn thiện kinh đô Giê-ru-sa-lem.
    4. **Độ khó & Checkpoint:** Vượt qua đường nước ngầm mở được Cổng Thành Xi-on ở Pha 1 là Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Thành Giê-ru-sa-lem ("Thành Đô Hòa Bình") vươn lên rạng rỡ trên núi Xi-on, trở thành thủ đô hợp nhất cả miền Bắc lẫn miền Nam. Đa-vít nhận biết rằng chính Đức Chúa đã lập ông làm vua không phải vì vinh hoa của riêng ông, nhưng **"vì dân Người là Ít-ra-en"** (`2 Sm 5, 12`). Ấn Thánh Vịnh thứ 11 thắp sáng.
  * *Hoa trái suy niệm:* Sự khôn ngoan, sáng tạo Chúa ban giúp chúng ta vượt qua những trở ngại tưởng chừng bất khả thi; và mọi thành công chúng ta đạt được đều nhằm phục vụ ích chung và làm sáng danh Chúa.

---

### Stage 12: Rước Hòm Bia Giao Ước & Lời Hứa Vương Quốc Vĩnh Cửu (`2 Sm 6, 12-19; 7, 1-17`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Vua Đa-vít đi và rước Hòm Bia Thiên Chúa từ nhà ông Ô-bết Ê-đôm lên Thành Đa-vít trong niềm hân hoan... Khi những người khiêng Hòm Bia của Đức Chúa đi được sáu bước, vua liền tế một con bò và một con bê béo. Vua Đa-vít nhảy múa hết sức trước mặt Đức Chúa, mình thắt tấm ê-phốt bằng vải gai... Ngôn sứ Na-than thưa với vua lời Đức Chúa phán: 'Nhà của ngươi và vương quốc của ngươi sẽ bền vững muôn đời trước mặt Ta, ngai vàng của ngươi sẽ được củng cố đến muôn đời!'"* (`2 Sm 6, 12-14; 7, 16`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-12.png`
  * *Bối cảnh:* Đại kết cục huy hoàng tại Giê-ru-sa-lem: các tư tế mặc áo trắng khiêng Hòm Bia Giao Ước bằng vàng ròng tiến lên đồi Xi-on; Vua Đa-vít mặc áo vải gai trắng khiêm nhường nhảy múa gảy đàn hạc đi trước Hòm Bia giữa tiếng kèn sừng cừu và toàn dân hân hoan; nơi Lều Thánh phía trên, ngôn sứ Na-than chỉ lên Ngôi Sao và Vương Miện Vĩnh Cửu của Giao Ước Đa-vít.
* **Bản đồ Top-Down & Nhân vật:**
  * Đại lộ đá dẫn từ cổng thành Giê-ru-sa-lem qua **3 Quảng Trường Lễ Tạ Ơn** lên tới **Lều Thánh Đồi Xi-on** và **Đài Cầu Nguyện** của Vua Đa-vít.
  * Nhân vật: Lữ khách nhỏ tuổi, Vua Đa-vít (mặc áo ê-phốt vải gai trắng cầm đàn hạc), các tư tế Lê-vi khiêng **Hòm Bia Giao Ước**, đội kèn sừng cừu, ngôn sứ **Na-than**, và toàn dân Ít-ra-en.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Grand Sacred Procession Rhythm & Sanctuary Blessing Finale (Dẫn đoàn rước Hòm Bia theo nhịp 6 bước tạ ơn, chia bánh cho toàn dân & Đón nhận Lời Hứa Vương Quốc Vĩnh Cửu).**
  * **Cơ chế & Luật chơi:**
    1. Sau khi đã xây xong kinh đô Giê-ru-sa-lem, điều đầu tiên Vua Đa-vít khao khát là rước **Hòm Bia Giao Ước của Thiên Chúa** về ngự ngay tại trung tâm thành thánh để Thiên Chúa làm Vua đích thực của toàn dân!
    2. **Pha 1 – Đại Lễ Rước Hòm Bia Lên Đồi Xi-on (`2 Sm 6, 12-15`):**
       * Đoàn tư tế Lê-vi cung kính dùng đòn gỗ khiêng Hòm Bia trên vai tiến dọc đại lộ đá lên Đồi Xi-on qua **3 Chặng (mỗi chặng tượng trưng cho 6 Bước Thánh)**.
       * Ở mỗi chặng, người chơi cùng Vua Đa-vít đi trước mở đường: dọn sạch các thảm hoa trên đại lộ và khi đoàn rước dừng lại ở mỗi mốc **6 Bước**, thực hiện **Nhịp Múa & Đàn Hạc Tạ Ơn (`[A]`)** hòa cùng tiếng kèn sừng cừu (`Shofar`) để thắp sáng **3 Bàn Thờ Lễ Tạ Ơn** dọc đường rước!
    3. **Pha 2 – An Vị Hòm Bia Trong Lều Thánh & Chia Bánh Cho Muôn Dân (`2 Sm 6, 17-19`):**
       * Đưa Hòm Bia vào đặt trang trọng giữa **Lều Thánh** mà Đa-vít đã căng sẵn trên núi Xi-on.
       * Tiếp theo, giúp nhà vua trao **Phần Lộc Chúc Phúc** (mỗi phần gồm *1 chiếc bánh mì vòng, 1 bánh chà là và 1 bánh nho khô* – `2 Sm 6, 19`) cho đại diện các gia đình đang đứng mừng rỡ quanh sân Lều Thánh.
    4. **Pha 3 – Lời Hứa Vương Quốc Vĩnh Cửu Qua Ngôn Sứ Na-than (`2 Sm 7, 1-17`):** Bước đến gặp ngôn sứ Na-than bên Lều Thánh để lắng nghe lời Sấm Truyền trọng đại nhất của Cựu Ước về Đấng Cứu Thế.
    5. **Độ khó & Checkpoint:** Mỗi chặng rước Hòm Bia (3 chặng) và khi Hòm Bia vào tới Lều Thánh đều lưu Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Khi Đa-vít khiêm nhường ước ao xây một Đền Thờ bằng gỗ bá hương cho Chúa, Thiên Chúa đã qua ngôn sứ Na-than ban cho ông một lời hứa còn vĩ đại gấp bội: chính Thiên Chúa sẽ xây cho Đa-vít một **"Nhà" (một triều đại)** mà ngai vàng sẽ tồn tại đến muôn đời! Đa-vít bước vào trước nhan Chúa, ngồi xuống cầu nguyện tạ ơn: *"Lạy Đức Chúa là Chúa Thượng, con là ai và nhà của con là gì mà Ngài đã dẫn con tới bậc này?"* (`2 Sm 7, 18`). Ấn Thánh Vịnh thứ 12 hoàn tất trọn vẹn **Cây Đàn Hạc & Vương Miện Đa-vít (12/12 Ấn Thánh Vịnh)**!
  * *Hoa trái suy niệm:* Niềm vui lớn nhất của cuộc đời là **rước Chúa vào ngự trị ở trung tâm trái tim và gia đình mình**; đừng bao giờ ngại ngùng khi bày tỏ lòng yêu mến, ca ngợi và tạ ơn Chúa hết mình như Vua Đa-vít.
* **🎬 Hoạt cảnh chuyển tiếp kết màn (Narrative Bridge): Từ Ngai Vàng Đa-vít Đến Ngôi Sao Bê-lem (`2 Sm 7, 12-16; Tv 89; Lc 1, 32-33; Mt 1, 1`)**
  * *Bối cảnh:* Màn đêm đầy sao trên đỉnh đồi Xi-on chuyển dần qua dòng chảy ngàn năm lịch sử cứu độ.
  * *Hoạt cảnh & Lời dẫn ngắn gọn:*
    1. **Vua Sa-lô-môn & Đền Thờ Giê-ru-sa-lem:** Con trai của Đa-vít là vua **Sa-lô-môn** tràn đầy khôn ngoan đã xây dựng Đền Thờ Giê-ru-sa-lem nguy nga lộng lẫy trên núi Xi-on để đặt Hòm Bia Giao Ước.
    2. **Lời Hứa Không Bao Giờ Phai Nhạt:** Trải qua hàng trăm năm thăng trầm, dù vương quốc trần thế có lúc suy tàn, lời thề của Thiên Chúa với Vua Đa-vít vẫn rực sáng như ngôi sao đêm: một Đấng Cứu Thế từ dòng dõi Đa-vít sẽ sinh ra tại chính quê hương Bê-lem.
    3. **Ngôi Sao Bê-lem & Con Vua Đa-vít:** Ánh sáng hội tụ về lại cánh đồng chiên Bê-lem năm xưa – nơi Sứ thần Gáp-ri-en truyền tin cho Đức Trinh Nữ Maria (cùng dòng tộc Đa-vít với Thánh Giuse): *"Người sẽ nên cao cả, và sẽ được gọi là Con Đấng Tối Cao. Đức Chúa là Thiên Chúa sẽ ban cho Người ngai vàng vua Đa-vít, tổ phụ Người... và triều đại của Người sẽ vô cùng vô tận!"* (`Lc 1, 32-33`).

---

# PHẦN 4: KHÚC VĨ THANH (EPILOGUE) – CON VUA ĐA-VÍT – VỊ VUA TÌNH YÊU MUÔN ĐỜI

---

### Màn Kết: Con Vua Đa-vít – Vị Vua Tình Yêu Muôn Đời (`Lc 1, 32-33; Ga 10, 11; Kh 22, 16`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Chính Tôi là Mục Tử nhân lành. Mục Tử nhân lành hy sinh mạng sống mình cho đoàn chiên... Ta là Chồi Lộc và là Dòng Dõi của Đa-vít, là Sao Mai sáng ngời!"* (`Ga 10, 11; Kh 22, 16`).
* **🖼️ Ảnh Minh Họa Mở Màn:**
  * *File ảnh:* `modules/king-david/images/intro-end.png`
  * *Bối cảnh:* Căn phòng nhỏ lúc bình minh rạng rỡ; cuốn Kinh Thánh mở cạnh Cây Đàn Hạc & Vương Miện Đa-vít, Hai Bia Đá Môi-sê, Tàu Nô-ê, Cuộn Sáng Thế và Chuỗi Mân Côi, kết nối trọn vẹn cậu bé chăn chiên Bê-lem với Chúa Giêsu – Mục Tử Nhân Lành và Vua Vũ Trụ.
* **Bản đồ Top-Down & Nhân vật:**
  * Căn phòng nhỏ ấm cúng của Lữ khách.
  * Nhân vật: Lữ khách nhỏ tuổi, Đức Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * *Thể loại:* Tương tác tổng kết & Thực hành đời sống (Interactive Reflection).
  * *Nhiệm vụ "Ba Nhịp Cầu Nối Từ Vua Đa-vít Đến Chúa Giêsu":* Chúa Thánh Thần giúp em nhìn lại toàn bộ 12 chặng hành trình của Vua Đa-vít để nhận ra hình ảnh tiên trưng tuyệt đẹp về **Đức Chúa Giêsu Kitô**:
    1. *Bên Bản Đồ Bê-lem (Người Chăn Chiên Dũng Cảm):* Chúa Thánh Thần hỏi: *"Hình ảnh cậu bé Đa-vít chăn chiên ở Bê-lem, dám liều mình cứu chiên con khỏi sư tử và chiến thắng Gô-li-át báo trước về Đấng nào?"* $\rightarrow$ Chọn: *"Báo trước về **Chúa Giêsu – Mục Tử Nhân Lành** sinh ra tại Bê-lem, Đấng đã hiến mạng sống trên Thập Giá để giải thoát chúng ta khỏi quyền lực tội lỗi (`Ga 10, 11`)"*.
    2. *Bên Cây Đàn Hạc (Thánh Vịnh & Trái Tim Khoan Dung):* Chúa Thánh Thần hỏi: *"Tiếng đàn Thánh Vịnh của Đa-vít và việc ông hai lần tha mạng cho vua Sa-un nơi hang đá dạy con bài học gì mỗi ngày?"* $\rightarrow$ Chọn: *"Dạy con biết **cầu nguyện bằng lời ca tiếng hát** trong mọi hoàn cảnh và luôn có **trái tim nhân hậu, biết tha thứ**, lấy thiện thắng ác"*.
    3. *Tại Góc Cầu Nguyện (Hòm Bia & Vương Quốc Vĩnh Cửu):* Đặt **Cây Đàn Hạc & Vương Miện Đa-vít (12/12 Ấn Thánh Vịnh)** cạnh **Hai Bia Đá Xuất Hành**, **Hải Đồ Nô-ê**, **Cuộn Sách Sáng Thế** và **Chuỗi Mân Côi**, quyết tâm tôn nhận **Chúa Giêsu – Con Vua Đa-vít** làm Vua trị vì trong tâm hồn và gia đình mình mãi mãi.
* **Hoa trái suy niệm:** Yêu mến đọc các **Thánh Vịnh**, sống khiêm nhường trung tín từ những việc nhỏ bé, biết tha thứ như Vua Đa-vít và luôn gắn bó với **Chúa Giêsu – Mục Tử Nhân Lành và Vua Tình Yêu**.

---

# BẢNG TỔNG HỢP 12 STAGES & THỂ LOẠI GAMEPLAY (QUICK REFERENCE)

| Màn | Tên Stage | Kinh Thánh | Ảnh Mở Màn | Thể Loại Gameplay (Genre) | Cơ Chế Trọng Tâm |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Prologue** | Cây Đàn Hạc & Bản Đồ Bê-lem – Xi-on | `Tv 23, 1-6` | `intro-start.png` | Exploration & Map Puzzle | Ghép 3 mốc lộ trình Bê-lem – Hoang Địa – Xi-on & nhận Cây Đàn Hạc Hành Trình |
| **Stage 1** | Đồng Cỏ Bê-lem & Dầu Thánh | `1 Sm 16, 1-13` | `intro-1.png` | **Flock Herding & Predator Defense** | Gọi 6 chiên con về chuồng, xua sư tử/gấu & nhận dầu thánh từ ngôn sứ Sa-mu-en |
| **Stage 2** | Tiếng Đàn Hạc Cung Điện Sa-un | `1 Sm 16, 14-23` | `intro-2.png` | **Harp Rhythm & Shadow Dispel** | Né luồng khói u sầu & gảy đàn hạc đúng nhịp tại 3 điểm sáng xua tan mây đen |
| **Stage 3** | Thung Lũng Ê-la & Gô-li-át | `1 Sm 17, 1-51` | `intro-3.png` | **Stream Stone Hunt & Sling Boss** | Chọn 5 viên đá cuội nhẵn dưới suối, né giáo đồng & căn lực quay ná hạ Gô-li-át |
| **Stage 4** | Giao Ước Giô-na-than & Mũi Tên | `1 Sm 18, 1-4; 20` | `intro-4.png` | **Stealth Escape & Arrow Code** | Nhận áo choàng kết nghĩa, vượt lính gác & giải mã vị trí 3 mũi tên báo hiệu |
| **Stage 5** | Bánh Thánh & Hang A-đu-lam | `1 Sm 21–22; Tv 57` | `intro-5.png` | **Camp Sanctuary & Morale Puzzle** | Nhận Bánh Tiến tại Nóp, thắp 6 lửa trại & gảy đàn Thánh Vịnh giữ ấm lòng dân |
| **Stage 6** | Hang Ên Gê-đi – Cắt Vạt Áo | `1 Sm 24, 1-23` | `intro-6.png` | **Echo-Stealth & Mercy Restraint** | Đi êm tránh vũng nước vang tiếng, ngăn đồng đội & cắt nhẹ góc vạt áo Sa-un |
| **Stage 7** | Bà A-bi-gai-in Hòa Giải | `1 Sm 25, 1-35` | `intro-7.png` | **Caravan Prep & Pass Routing** | Chất 3 loại lễ vật lên đoàn lừa & mở đường đèo Các-mên kịp chặn cơn giận |
| **Stage 8** | Cây Giáo & Bình Nước Khắc-hi-la | `1 Sm 26, 1-25` | `intro-8.png` | **Night Camp Infiltration Puzzle** | Vượt mê cung 3 vòng trại đang ngủ dưới ánh trăng lấy Cây Giáo & Bình Nước |
| **Stage 9** | Khúc Ca Cây Cung | `2 Sm 1, 17-27` | `intro-9.png` | **Star-Constellation & Lament** | Nối một nét 3 chòm sao tri ân & hòa tấu đàn hạc sáng tác Khúc Ca Cây Cung |
| **Stage 10** | Đăng Quang Tại Khép-rôn | `2 Sm 2, 1-4; 5, 1-5` | `intro-10.png` | **Twelve-Tribe Banner Alignment** | Đón các trưởng lão & sắp xếp đúng 12 Cờ Hiệu Chi Tộc quanh Bàn Giao Ước |
| **Stage 11** | Mạch Nước Gi-khôn & Thành Xi-on | `2 Sm 5, 6-12` | `intro-11.png` | **Water-Shaft Flow & Construction** | Điều tiết van nước ngầm Gi-khôn mở cổng thành từ bên trong & xây tường Xi-on |
| **Stage 12** | Rước Hòm Bia & Lời Hứa Muôn Đời | `2 Sm 6–7` | `intro-12.png` | **Procession Rhythm & Sacred Tent** | Dẫn đoàn rước Hòm Bia (mỗi 6 bước múa tạ ơn), chia bánh & nhận Lời Hứa Na-than |
| **Epilogue** | Con Vua Đa-vít – Vua Tình Yêu | `Lc 1; Ga 10; Kh 22` | `intro-end.png` | Interactive Reflection | 3 nhịp cầu nối Mục Tử Bê-lem – Thánh Vịnh – Ngai Vàng Đa-vít với Chúa Giêsu |

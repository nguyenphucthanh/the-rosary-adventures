# KỊCH BẢN NỘI DUNG & GAMEPLAY DESIGN: NOAH'S ARK (CON TÀU NÔ-Ê & CẦU VỒNG GIAO ƯỚC)

* **Tên game:** *Noah's Ark* (`modules/noahs-ark`)
* **Kinh Thánh nền tảng:** Sách Sáng Thế, Chương 6 đến Chương 9 (`St 6, 5 – 9, 17`).
* **Vai trò người chơi:** **Lữ khách nhỏ tuổi (Người Tìm Kiếm Đức Tin)** – tiếp nối hành trình sau *The Garden of Eden*. Một buổi chiều mưa lớn ngoài hiên nhà, khi nhìn chiếc cầu vồng bảy sắc hiện lên sau cơn mưa, em mở tiếp sách Sáng Thế chương 6 và được **Đức Chúa Thánh Thần** dẫn đưa về thời Tổ phụ **Nô-ê** – người công chính đã vâng lời Thiên Chúa đóng con tàu gỗ bách khổng lồ, bảo toàn sự sống cho gia đình cùng muôn loài qua cơn Đại Hồng Thủy, và đón nhận **Cầu Vồng Giao Ước Vĩnh Cửu (`St 9, 13`)**.
* **Vật phẩm tiến trình (Progression Item):** **Hải Đồ Giao Ước (8 Sắc Ấn Cầu Vồng & Con Tàu)**. Hoàn thành mỗi Stage sẽ thắp sáng 1 Ấn Dấu lấp lánh trên Hải Đồ.
* **Điểm nhấn Trình bày & Độ khó:**
  1. **🎨 Màn Hình Minh Họa Pixel Art Mở Màn (Stage Intro Pixel Illustration Screen):**
     * Khi bắt đầu mỗi màn chơi, vùng màn hình phía trên hiển thị một **Bức tranh Minh Họa Pixel Art toàn cảnh (Full-frame Storybook Pixel Illustration)** giàu chi tiết, bố cục tiền cảnh – trung cảnh – hậu cảnh rõ nét, kèm hiệu ứng chuyển động pixel nhẹ (2–4 frames hoặc hạt mưa/sóng nước/cánh chim).
     * Sau khi người chơi đọc xong lời dẫn nhập, bức tranh chuyển cảnh mượt mà (Pixel Wipe / Fade) vào bản đồ Top-down để bắt đầu thử thách.
  2. **🎮 Đa dạng Thể loại Gameplay & Cơ chế Checkpoint (Soft Reset):**
     * 8 Stage chính là 8 cơ chế gameplay khác nhau: giữ đèn công chính vượt sương đen, đẩy & ghép bản vẽ gỗ bách, phân luồng dẫn từng cặp thú lên khoang, phản xạ bịt khe rò nước theo thời gian, giữ thăng bằng trọng tâm tàu & chăm sóc thú vật, lái tàu vượt đá ngầm theo luồng gió, điều khiển chim bay tìm nhành ô-liu, và giải đố khúc xạ 7 sắc cầu vồng.
     * Đi sai bước, để thú dữ chạm thú hiền hoặc để tàu nghiêng quá giới hạn sẽ lùi về **Checkpoint** gần nhất để người chơi thử lại.

* **Cấu trúc chuẩn của mỗi Stage:**
  1. **Dẫn nhập & Câu Lời Chúa chủ đề (Intro Cutscene)**
  2. **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration Screen)** *(Bố cục, Bảng màu, Hiệu ứng chuyển động)*
  3. **Bản đồ Top-Down & Nhân vật xuất hiện**
  4. **Thể loại & Cơ chế Gameplay chi tiết (Genre, Luật chơi, Độ khó / Checkpoint)**
  5. **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro)**

---

# PHẦN 0: KHÚC DẠO ĐẦU (PROLOGUE) – CƠN MƯA CHIỀU & MÔ HÌNH CON TÀU GỖ

---

### Màn Mở Đầu: Cơn Mưa Chiều & Mô Hình Con Tàu Gỗ (`St 6, 8-9`; `1 Pr 3, 20`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Nhưng ông Nô-ê được đẹp lòng Đức Chúa... Ông Nô-ê là một người công chính, hoàn hảo giữa những người đồng thời, và ông đi với Thiên Chúa."* (`St 6, 8-9`).
  * *Bối cảnh mở màn:* Căn phòng nhỏ của Lữ khách trong một buổi chiều mưa rào vừa tạnh. Bên ngoài khung cửa sổ, những giọt mưa còn đọng trên lá và một vệt cầu vồng mờ ảo bắt đầu hiện lên phía chân trời. Trên bàn học có đặt một mô hình con tàu gỗ nhỏ chưa lắp xong nằm cạnh cuốn Kinh Thánh Cựu Ước.
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Cận cảnh bàn học bên cửa sổ kính lấm tấm giọt nước mưa; phía ngoài bầu trời xám xanh đang hửng nắng với một nhịp cầu vồng bảy sắc vắt ngang qua tán cây. Trên mặt bàn gỗ, trang sách Sáng Thế chương 6 tỏa ánh sáng vàng dịu bao quanh mô hình con tàu gỗ và bóng hình **Chim Bồ Câu Chúa Thánh Thần** ngậm nhành ô-liu nhỏ.
  * *Bảng màu:* Xanh xám mưa chiều chuyển sang vàng nắng ấm, nâu gỗ thông và 7 sắc cầu vồng dịu nhẹ.
  * *Hiệu ứng chuyển động:* Giọt mưa trượt nhẹ trên khung kính cửa sổ, ánh cầu vồng lấp lánh 2 frames.
* **Bản đồ Top-Down & Nhân vật:**
  * Căn phòng nhỏ ấm cúng của Lữ khách.
  * Nhân vật: Lữ khách nhỏ tuổi, Đức Chúa Thánh Thần (Chim Bồ Câu trắng).
* **Thể loại & Cơ chế Gameplay (Warm-up):**
  * *Thể loại:* Tương tác khám phá & Ghép mảnh mô hình.
  * *Nhiệm vụ:*
    1. *Bước 1 – Lau khô bệ cửa sổ sau cơn mưa:* Tương tác với cửa sổ và ngắm nhìn cầu vồng, tự hỏi: *"Tại sao sau cơn mưa lớn lại có cầu vồng đẹp thế nhỉ?"*.
    2. *Bước 2 – Hoàn thiện Mô Hình Tàu Gỗ:* Tìm và ghép đúng 3 mảnh gỗ của mô hình tàu trên bàn học theo thứ tự: **Thân Tàu Đức Tin $\rightarrow$ Mái Tàu Vâng Phục $\rightarrow$ Cửa Tàu Cứu Độ**.
    3. *Bước 3 – Lên đường cùng Chúa Thánh Thần:* Chúa Thánh Thần hiện ra trao cho em **Hải Đồ Giao Ước (0/8 Ấn Dấu)** và mời gọi: *"Con yêu dấu, sau khi rời Vườn Địa Đàng, loài người ngày càng đông nhưng nhiều người lại quên Chúa và làm điều xấu. Chỉ có gia đình ông Nô-ê vẫn giữ lòng trong sạch. Hãy đi cùng Ta về thời ông Nô-ê để xem Thiên Chúa cứu độ người công chính và lập Giao Ước Cầu Vồng như thế nào nhé!"*.
* **Bài học suy niệm:** Giữa một thế giới nhiều cám dỗ, Thiên Chúa luôn nhìn thấu và gìn giữ những ai có tấm lòng ngay thẳng, yêu mến Người.

---

# PHẦN 1: ĐÓNG TÀU & TẬP HỢP MUÔN LOÀI (`St 6, 5 – 7, 16`)

---

### Stage 1: Người Công Chính Giữa Thế Gian (`St 6, 5-13`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa thấy sự gian ác của con người quá lớn trên mặt đất... Nhưng ông Nô-ê được đẹp lòng Đức Chúa."* (`St 6, 5.8`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bức tranh chia làm hai vùng tương phản mạnh: xung quanh là cảnh làng mạc cổ đại chìm trong bóng tối tím xám của sự ích kỷ, cãi vã và khói bụi; nhưng ngay trên ngọn đồi nhỏ ở trung tâm, tổ phụ **Nô-ê** (râu bạc hiền từ, mặc áo choàng vải thô) cùng vợ và 3 người con đang quỳ bên bàn thờ đá nhỏ, được bao bọc bởi một **Vòm Sáng Vàng Ấm Áp** từ trời chiếu xuống.
  * *Bảng màu:* Tím than, xám khói u tối ở xung quanh đối lập với sắc vàng kim và trắng tinh khiết nơi ngọn đồi của gia đình Nô-ê.
  * *Hiệu ứng chuyển động:* Ngọn lửa trên bàn thờ của Nô-ê bập bùng, đẩy lùi những đám khói xám đang chực chờ tràn tới.
* **Bản đồ Top-Down & Nhân vật:**
  * Thung lũng cổ đại bị bao phủ bởi các vùng **Sương Đen Bất Chính** và những **Bóng Xoáy Giận Dữ** đi tuần tra; ở cuối bản đồ trên đồi cao là nhà của ông Nô-ê.
  * Nhân vật: Lữ khách nhỏ tuổi cầm **Đèn Công Chính**, ông Nô-ê, gia đình Nô-ê (Vợ và 3 người con Sem, Kham, Gia-phét), Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Lantern Purity & Line-of-Sight Stealth (Giữ ngọn đèn công chính vượt qua bóng tối thế gian).**
  * **Cơ chế & Luật chơi:**
    1. Người chơi cầm **Đèn Công Chính** đi cùng ông Nô-ê qua 3 khu vực làng mạc đang bị các **Bóng Xoáy Bất Hòa** (có vùng quét hình nón – Vision Cone) làm ô nhiễm.
    2. Để mở cổng lên Ngọn Đồi Cầu Nguyện, người chơi phải tìm và thắp sáng **4 Bệ Đá Lương Tâm** (*Ngay Thẳng – Hiền Hòa – Trung Tín – Cầu Nguyện*) bằng cách dẫn tia sáng từ Đèn Công Chính đến từng bệ mà không để Bóng Xoáy chạm vào.
    3. Dọc đường có các **Gió Ngược Cám Dỗ** thổi theo chu kỳ 3 giây: khi gió thổi tới, người chơi phải đứng nép sau các **Bức Tường Đá Đức Tin** để ngọn đèn không bị thổi tắt.
    4. **Độ khó & Checkpoint:** Mỗi Bệ Đá được thắp sáng là 1 Checkpoint. Nếu bị Bóng Xoáy quét trúng hoặc bị Gió Ngược thổi tắt đèn, nhân vật quay lại Bệ Đá vừa thắp sáng gần nhất.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Trên đỉnh đồi bình an, Thiên Chúa phán với ông Nô-ê về cơn Hồng Thủy sắp tới và trao cho ông sứ mạng đóng một con tàu lớn để cứu gia đình cùng muôn loài. Ấn Dấu thứ 1 bừng sáng.
  * *Hoa trái suy niệm:* Dù người khác xung quanh có làm điều xấu (nói tục, gian lận, bắt nạt), người con ngoan của Chúa vẫn kiên tâm chọn làm điều tốt và sống ngay thật.

---

### Stage 2: Bản Vẽ Gỗ Bách & Nhựa Thông (`St 6, 14-16`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Ngươi hãy dùng gỗ bách mà làm cho mình một con tàu; ngươi sẽ làm con tàu có nhiều ngăn, và lấy nhựa thông mà trét cả trong lẫn ngoài... Ngươi sẽ làm tàu có tầng dưới, tầng thứ hai rồi tầng thứ ba."* (`St 6, 14.16`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Đại công trường đóng tàu giữa thung lũng rừng bách xanh rì. Bộ khung sườn khổng lồ bằng gỗ bách đỏ nâu của Con Tàu đang dần thành hình với 3 tầng rõ rệt. Ở tiền cảnh, ông Nô-ê đang cầm cuộn bản vẽ chỉ dẫn, còn Sem, Kham và Gia-phét đang cưa gỗ, kéo ròng rọc và đun nồi nhựa thông đen bóng để trét kín các ván tàu.
  * *Bảng màu:* Nâu đỏ gỗ bách, vàng nắng công trường, xanh lá thông và đen ánh tím của nhựa thông nóng.
  * *Hiệu ứng chuyển động:* Ròng rọc kéo thanh gỗ nâng lên từng nấc, khói từ nồi đun nhựa thông bay lên (3-frame loop).
* **Bản đồ Top-Down & Nhân vật:**
  * Công trường đóng tàu chia làm 3 phân khu tương ứng với **3 Tầng Khung Tàu** (Tầng 1: Đáy tàu vững chắc; Tầng 2: Khoang chứa nhiều ngăn; Tầng 3: Mái tàu và Cửa Sổ Ánh Sáng cao 1 thước).
  * Nhân vật: Lữ khách nhỏ tuổi, ông Nô-ê, Sem, Kham, Gia-phét.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Blueprint Sokoban & Resource Assembly Puzzle (Giải đố đẩy kiện gỗ & Trét nhựa thông theo bản vẽ).**
  * **Cơ chế & Luật chơi:**
    1. Mỗi tầng tàu là một bàn giải đố logic không gian: trên công trường có các **Khối Gỗ Bách** (hình chữ I, chữ L, khối vuông) và các **Thùng Nhựa Thông**.
    2. Người chơi phải đẩy các Khối Gỗ Bách trượt trên **Đường Ray Con Lăn** vào đúng các ô trống trên khung tàu theo bản vẽ của Chúa, sau đó lấy **Chổi Nhựa Thông (`[A]`)** quét liên kết tất cả các mối nối trong một lượt trước khi nhựa thông nguội.
    3. Ở Tầng 2 và Tầng 3 có thêm **Bàn Xoay Gỗ** (bấm công tắc để xoay hướng thanh gỗ $90^\circ$) và sự trợ giúp của 3 người con ông Nô-ê đứng ở các chốt chặn để giữ thanh gỗ không trượt quá đà.
    4. **Độ khó & Checkpoint:** Hoàn thành mỗi tầng sẽ lưu Checkpoint. Người chơi có thể bấm `[B]` để xếp lại tầng hiện tại nếu đẩy gỗ vào góc chết.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Con tàu gỗ bách 3 tầng đồ sộ hoàn tất, sừng sững giữa đất khô như một chứng tích của lòng vâng phục tuyệt đối: *"Ông Nô-ê đã làm như vậy; mọi điều Thiên Chúa truyền cho ông, ông đều làm đúng hết"* (`St 6, 22`). Ấn Dấu thứ 2 khắc sáng.
  * *Hoa trái suy niệm:* Lòng vâng lời và sự kiên trì: ông Nô-ê không ngại vất vả suốt nhiều năm để làm đúng lời Chúa dạy, dù lúc đó trời chưa hề có một giọt mưa.

---

### Stage 3: Muôn Thú Từng Đôi Lên Tàu (`St 6, 19-22`; `St 7, 1-9`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Trong mọi sinh vật, mọi xác phàm, ngươi sẽ đưa vào tàu mỗi thứ một đôi, một đực một cái, để giữ cho chúng sống với ngươi... Từng đôi một đến với ông Nô-ê mà vào tàu, như Thiên Chúa đã truyền."* (`St 6, 19; 7, 9`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bầu trời phía xa bắt đầu kéo mây tím sẫm báo hiệu cơn bão lớn. Một chiếc cầu gỗ rộng bắc lên cánh cửa bên hông Con Tàu Nô-ê; trên cầu là cảnh tượng kỳ diệu: từng đôi voi, hươu cao cổ, sư tử, chiên trắng, thỏ rừng, rùa nhỏ và từng đôi chim câu đang trật tự nối đuôi nhau bước lên tàu dưới sự hướng dẫn ân cần của gia đình Nô-ê.
  * *Bảng màu:* Cam rực hoàng hôn trước bão, tím mây xa, nâu ấm của con tàu và đa sắc màu sinh động của muôn thú.
  * *Hiệu ứng chuyển động:* Từng đôi thú nhấp nhô bước đi trên cầu gỗ, đàn chim vỗ cánh bay lượn quanh mái tàu.
* **Bản đồ Top-Down & Nhân vật:**
  * Thung lũng trước cửa tàu với hệ thống **Đường Mòn Phân Luồng & Cổng Rào Gỗ** dẫn vào 3 cửa khoang tàu: *Khoang Thú Hiền (Chiên, Thỏ, Hươu)*, *Khoang Thú Lớn & Mạnh (Sư Tử, Voi, Gấu)*, và *Khoang Chim Trời*.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Nô-ê, và 6 cặp thú + chim.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Pair Matching & Traffic-Routing Herding Puzzle (Ghép đôi muôn thú & Điều phối luồng đi không xung đột).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Tìm & Ghép Đôi:** Quanh thung lũng có các con vật bị lạc bạn đời vì tiếng sấm rền. Người chơi phải lắng nghe tiếng kêu và tìm đưa từng con vật về đúng cặp (*1 đực + 1 cái*) tại điểm tập kết.
    2. **Pha 2 – Phân Luồng Lên Tàu (Bài toán Sói – Cừu – Cỏ):** Khi các cặp thú bắt đầu di chuyển lên tàu theo đường mòn, người chơi phải chạy đóng/mở **5 Cổng Chuyển Hướng (Switch Gates)** sao cho:
       * Cặp **Thú Hiền (Chiên, Thỏ)** không đi chung một làn đường cùng lúc với cặp **Thú Săn Mồi (Sư Tử, Báo)** (nếu chạm nhau, thú hiền sẽ hoảng sợ chạy ngược về đầu đường!).
       * Mỗi cặp thú phải đi vào đúng biểu tượng Khoang Tàu dành cho loài của mình trước khi cơn mưa lất phất bắt đầu rơi.
    3. **Độ khó & Checkpoint:** Chia làm 3 đợt dẫn thú (Đợt 1: 2 cặp; Đợt 2: 3 cặp; Đợt 3: 4 cặp di chuyển đồng thời). Mỗi đợt qua tàu thành công là 1 Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Tất cả muôn loài và lương thực đã yên vị trong các ngăn tàu; gia đình 8 người của ông Nô-ê bước lên tàu sau cùng. Ấn Dấu thứ 3 khắc sáng.
  * *Hoa trái suy niệm:* Thiên Chúa yêu thương và quan phòng cho từng sinh vật nhỏ bé; trong ngôi nhà của Chúa, mọi loài đều có chỗ đứng và được chở che.

---

### Stage 4: Cánh Cửa Đóng Lại & Bốn Mươi Đêm Mưa (`St 7, 10-16`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Vào ngày đó, tất cả các nguồn của vực thẳm bao la nổ tung ra, và các cống trời mở toang. Mưa đổ xuống đất suốt bốn mươi ngày và bốn mươi đêm... Rồi Đức Chúa đóng cửa lại sau lưng ông."* (`St 7, 11-12.16`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Khung cảnh đầy kịch tính: bầu trời đêm đen kịt bị xé toạc bởi những tia chớp trắng xóa, mưa như thác đổ và những cột nước từ lòng đất phun trào. Ngay bên hông con tàu, cánh cửa gỗ khổng lồ đang khép lại, được ấn chặt bởi một **Luồng Ánh Sáng Vàng Quyền Năng** tượng trưng cho bàn tay bảo vệ của Thiên Chúa đóng kín con tàu từ bên ngoài.
  * *Bảng màu:* Xanh đen bão tố, trắng bạc của chớp và màn mưa, vàng kim ấm áp nơi niêm phong cánh cửa tàu.
  * *Hiệu ứng chuyển động:* Những vệt mưa chéo rơi dày đặc (3 frames), tia chớp lóe sáng và mực nước bên dưới dâng cao dần.
* **Bản đồ Top-Down & Nhân vật:**
  * Bên trong hành lang 3 tầng của Con Tàu ngay lúc cơn Đại Hồng Thủy ập tới, với các cửa thông gió, mối ghép ván tàu và kho chứa Nhựa Thông / Chốt Gỗ.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Nô-ê, Sem, Kham, Gia-phét.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Time-Management Hull Sealing Defense (Hành động quản lý thời gian – Gia cố tàu trước cơn hồng thủy).**
  * **Cơ chế & Luật chơi:**
    1. Cơn bão ập đến theo **3 Đợt Sóng Dâng (40 giây mỗi đợt)**. Áp lực nước bên ngoài làm một số cửa sổ thông gió bị bung chốt và các khe ván rỉ nước.
    2. Người chơi phải nhanh chân phối hợp lấy đúng dụng cụ tại bàn chế tác ở giữa tàu:
       * Lấy **Gầu Nhựa Thông Nóng** để bịt các **Khe Ván Rỉ Nước** (màu xanh lam).
       * Lấy **Thanh Chốt Gỗ Bách** để đóng chặt các **Cửa Sổ Bị Gió Quật** (màu trắng xám).
       * Kéo **Cần Gạt Đòn Bẩy** cùng ông Nô-ê tại Cửa Chính ở cuối Đợt 3.
    3. Trên sàn tàu có những vũng nước trơn trượt làm nhân vật bị trượt đi nếu chạy không khéo.
    4. **Độ khó & Checkpoint:** Có một thanh **Độ An Toàn Của Tàu (Hull Integrity)**. Nếu để quá nhiều khe rò nước mở cùng lúc khiến thanh này tụt về 0, người chơi sẽ chơi lại Đợt Sóng hiện tại (mỗi đợt hoàn thành là 1 Checkpoint).
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Khi chốt khóa cuối cùng được cài xong, một luồng ánh sáng vàng từ bên ngoài bao phủ lấy cánh cửa chính: chính Thiên Chúa đã đóng cửa tàu lại để bảo vệ gia đình Nô-ê tuyệt đối an toàn trước dòng nước lũ! Ấn Dấu thứ 4 hoàn tất.
  * *Hoa trái suy niệm:* Khi chúng ta đã làm hết sức mình theo lời Chúa dạy, chính Thiên Chúa sẽ là Đấng bảo vệ và che chở chúng ta trước mọi bão giông cuộc đời.

---

# PHẦN 2: VƯỢT ĐẠI HỒNG THỦY & CẦU VỒNG GIAO ƯỚC (`St 7, 17 – 9, 17`)

---

### Stage 5: Lênh Đênh Trên Biển Nước Mênh Mông (`St 7, 17-24`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Nước dâng lên và tăng thêm thật nhiều trên mặt đất, còn tàu thì trôi đi trên mặt nước. Nước càng ngày càng mạnh trên mặt đất, khiến mọi núi cao dưới gầm trời đều bị phủ ngập."* (`St 7, 18-19`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Góc nhìn cắt ngang (Cross-section) Con Tàu Nô-ê đang nổi bồng bềnh giữa đại dương mênh mông không một bóng đất liền. Bên ngoài là biển nước xám xanh cuộn sóng dưới bầu trời mây dày; nhưng bên trong 3 tầng tàu lại rực sáng ánh đèn dầu ấm cúng: gia đình Nô-ê đang chia cỏ thơm cho chiên và hươu, đàn chim đậu yên bình trên xà gỗ.
  * *Bảng màu:* Xanh thẳm đại dương bên ngoài đối lập hoàn toàn với sắc cam vàng ấm áp của ánh đèn dầu và gỗ bách bên trong tàu.
  * *Hiệu ứng chuyển động:* Thân tàu khẽ nghiêng qua lại nhịp nhàng theo sóng nước, ánh đèn dầu đung đưa.
* **Bản đồ Top-Down & Nhân vật:**
  * Không gian bên trong khoang chính của Con Tàu với hành lang giữa, 6 chuồng thú ở hai bên mạn trái – mạn phải, kho lương thực và các giá treo đèn dầu.
  * Nhân vật: Lữ khách nhỏ tuổi, bà Nô-ê, Sem, Kham, Gia-phét và các loài thú.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Ark Balance & Caretaking Multitask (Giữ thăng bằng trọng tâm tàu & Chăm sóc muôn loài).**
  * **Cơ chế & Luật chơi:**
    1. Trên đầu màn hình có **Thanh Thăng Bằng Mạn Tàu (Tilt Meter: Trái $\leftrightarrow$ Phải)**. Cứ mỗi 12 giây, một cơn **Sóng Ngầm Lớn** đánh vào mạn tàu làm tàu nghiêng hẳn về một bên (cảnh báo trước bằng mũi tên sóng 3 giây).
    2. **Nhiệm vụ kép trong suốt hải trình:**
       * **Giữ thăng bằng:** Khi sóng đánh nghiêng về bên Trái, người chơi phải nhanh chóng đẩy các **Thùng Lương Thực Đối Trọng** trên đường ray giữa tàu sang bên Phải (và ngược lại) để giữ kim thăng bằng luôn ở vùng Xanh an toàn.
       * **Chăm sóc 6 Khoang Thú:** Trong lúc giữ thăng bằng, các khoang thú ở hai bên sẽ lần lượt hiện biểu tượng cần giúp đỡ: **Đói bụng** (mang Bó Cỏ / Hạt Ngũ Cốc tới), **Tối & Sợ hãi** (mang Lửa Đèn Dầu tới thắp sáng), hoặc **Lạnh** (đem Chăn Rơm tới lót ổ).
    3. **Độ khó & Checkpoint:** Hoàn thành đủ 12 lượt chăm sóc qua 2 chặng hải trình (Chặng 1: 6 lượt sóng vừa; Chặng 2: 6 lượt sóng kép) để qua màn. Nếu để tàu nghiêng chạm vạch Đỏ hoặc để thú vật hoảng loạn quá lâu, người chơi thử lại từ đầu chặng đó.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Trong khoang tàu ấm áp, gia đình Nô-ê cùng quây quần cầu nguyện dưới ánh đèn, kiên nhẫn chờ đợi ngày Chúa cho nước rút. Ấn Dấu thứ 5 khắc sáng.
  * *Hoa trái suy niệm:* Sự kiên nhẫn, yêu thương chăm sóc nhau trong gia đình và giữ bình an trong tâm hồn ngay cả khi hoàn cảnh bên ngoài đang khó khăn.

---

### Stage 6: Ngọn Gió Của Chúa & Đỉnh Núi A-ra-rát (`St 8, 1-5`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Thiên Chúa nhớ đến ông Nô-ê, mọi dã thú và mọi gia súc ở với ông trong tàu; Thiên Chúa cho một cơn gió thổi qua mặt đất, và nước bắt đầu rút xuống... Vào tháng thứ bảy, ngày mười bảy trong tháng, tàu đậu lại trên núi A-ra-rát."* (`St 8, 1.4`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Những tầng mây đen dày đặc đang bị một **Luồng Gió Ánh Sáng** thổi dạt sang hai bên, để lộ bầu trời xanh ngọc và những tia nắng đầu tiên chiếu xuống mặt biển. Phía trước mũi tàu Nô-ê, hai đỉnh núi đá hùng vĩ của dãy **A-ra-rát** vừa nhô lên khỏi mặt nước như một bến đỗ bình an.
  * *Bảng màu:* Xanh ngọc lam của biển đang lặng dần, vàng trắng của nắng xuyên mây và xám nâu vững chãi của đỉnh núi A-ra-rát.
  * *Hiệu ứng chuyển động:* Luồng gió bạc lượn qua bầu trời đẩy mây trôi, sóng nước rút xuống để lộ dần sườn núi đá.
* **Bản đồ Top-Down & Nhân vật:**
  * Bản đồ hải trình nhìn từ trên cao (Top-Down Sea Chart) nơi Con Tàu Nô-ê đang trôi qua vùng biển có nhiều **Chỏm Đá Ngầm** vừa nhô lên, các **Dòng Nước Rút Xoáy Ngược** và các **Luồng Gió Thần Khí** dẫn về Bến Đỗ Núi A-ra-rát ở phía Bắc.
  * Nhân vật: Lữ khách nhỏ tuổi và ông Nô-ê trên đài quan sát mũi tàu (người chơi điều khiển trực tiếp hướng di chuyển của Con Tàu).
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Momentum Sailing & Current Navigation Puzzle (Điều hướng tàu theo luồng gió & Tránh đá ngầm).**
  * **Cơ chế & Luật chơi:**
    1. Con Tàu Nô-ê không có động cơ mà trôi theo quán tính của dòng nước và sức gió. Người chơi điều khiển hướng mũi tàu và bấm phím `[A]` để **Mở / Thu Cửa Đón Gió**:
       * Khi **Mở Cửa Đón Gió** đi vào vùng **Gió Của Chúa (Luồng sáng vàng)**, tàu được đẩy tiến về phía trước và vượt qua được các dòng nước chảy ngược.
       * Khi đi qua các vùng **Gió Xoáy Ngang**, người chơi phải kịp thời **Thu Cửa Gió** để tàu không bị thổi dạt vào các **Rạn Đá Ngầm Nhọn**.
    2. Dọc hải trình có **3 Hải Đăng Cột Mốc Nước Rút** (tương ứng 150 ngày nước rút dần). Chạm vào mỗi cột mốc sẽ làm mực nước hạ xuống một nấc, mở ra luồng lạch mới dẫn tới đỉnh núi A-ra-rát.
    3. **Độ khó & Checkpoint:** Mỗi Cột Mốc Nước Rút là 1 Checkpoint. Tàu có 3 nấc bền vững; va vào đá ngầm hoặc bị cuốn vào hố nước xoáy sẽ lùi về Cột Mốc trước đó.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Con tàu từ từ đáp xuống yên vị vững vàng trên sườn đỉnh núi A-ra-rát giữa tiếng reo vui tạ ơn của cả gia đình Nô-ê. Ấn Dấu thứ 6 bừng sáng.
  * *Hoa trái suy niệm:* *"Thiên Chúa nhớ đến ông Nô-ê"* (`St 8, 1`) – Chúa không bao giờ quên chúng ta; sau cơn mưa trời lại sáng, mọi thử thách rồi sẽ qua đi trong bàn tay quan phòng của Chúa.

---

### Stage 7: Cánh Quạ & Chim Bồ Câu Ngậm Nhành Ô-liu (`St 8, 6-12`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Ông Nô-ê mở cửa sổ tàu ông đã làm, và thả con quạ ra... Rồi ông thả chim bồ câu ra để xem nước đã giảm bớt trên mặt đất chưa... Đến chiều, chim bồ câu trở về với ông, và kìa, trong mỏ nó có một cành lá ô-liu tươi!"* (`St 8, 6-8.11`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Từ khung cửa sổ gỗ trên tầng thượng của Con Tàu, đôi bàn tay già nua ấm áp của ông Nô-ê đang vươn ra đón chú **Chim Bồ Câu Trắng** vừa bay về. Trong mỏ chú chim là một **nhành lá ô-liu xanh biếc** còn đọng giọt sương lấp lánh dưới ánh nắng mai; phía xa dưới chân núi, những thung lũng xanh tươi đã bắt đầu lộ diện.
  * *Bảng màu:* Trắng tinh khôi của cánh chim bồ câu, xanh lá ô-liu tươi sáng, nền trời bình minh hồng cam dịu ngọt.
  * *Hiệu ứng chuyển động:* Chim bồ câu vỗ cánh nhịp nhàng đáp xuống tay ông Nô-ê, chiếc lá ô-liu khẽ rung rinh.
* **Bản đồ Top-Down & Nhân vật:**
  * Bản đồ bầu trời và thung lũng quanh núi A-ra-rát nhìn từ trên cao, nơi mặt nước đang rút dần qua 3 giai đoạn thời gian (cách nhau 7 ngày).
  * Nhân vật: Lữ khách nhỏ tuổi điều khiển đường bay của **Chim Quạ** và **Chim Bồ Câu** xuất phát từ cửa sổ tàu Nô-ê.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **3-Phase Flight Scouting & Wind-Gliding Action (Hành động điều khiển chim bay khảo sát & Tìm nhành ô-liu).**
  * **Cơ chế & Luật chơi:**
    1. Người chơi trải nghiệm đúng **3 lần thả chim** trong Kinh Thánh với độ thử thách tăng dần:
       * **Chặng 1 – Lần thả thứ nhất (Chim Quạ & Bồ Câu lần 1 - `St 8, 7-9`):** Mặt đất còn ngập nước. Điều khiển chim bồ câu bay khảo sát 3 điểm mốc trên mặt nước trong khi giữ **Thanh Thể Lực Đôi Cánh (Stamina)** bằng cách lượn qua các **Vòng Khí Ấm**, rồi quay về đáp xuống bàn tay ông Nô-ê trước khi mỏi cánh.
       * **Chặng 2 – Bảy ngày sau (Chim Bồ Câu tìm nhành Ô-liu - `St 8, 10-11`):** Nước đã rút bớt nhưng còn nhiều **Luồng Gió Lốc Ngang** và **Đám Mây Mù**. Người chơi phải điều khiển chim bồ câu lách qua các luồng gió lốc, bay tới **Đồi Cây Ô-liu** ở góc xa bản đồ để hái **Nhành Lá Ô-liu Tươi**, rồi bay ngược chiều gió mang về cửa sổ tàu!
       * **Chặng 3 – Bảy ngày sau nữa (Bình minh đất khô - `St 8, 12`):** Bay dẫn đường mở toàn bộ sương mù trên 4 cánh đồng mới khô ráo để báo hiệu cho gia đình Nô-ê chuẩn bị rời tàu.
    2. **Độ khó & Checkpoint:** Mỗi chặng bay là 1 Checkpoint. Nếu chạm vào Gió Lốc Đen hoặc hết Thể Lực Đôi Cánh khi đang bay trên nước, chú chim sẽ quay về cửa sổ tàu để bắt đầu lại chặng đó.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Nhìn nhành lá ô-liu tươi xanh trong mỏ chim bồ câu, ông Nô-ê biết chắc mặt đất đã hồi sinh và bình an của Chúa đã trở lại. Ấn Dấu thứ 7 khắc sáng.
  * *Hoa trái suy niệm:* Chim bồ câu ngậm nhành ô-liu là biểu tượng của **Chúa Thánh Thần** và sự **Bình An, Hòa Giải**; mỗi người chúng ta hãy là sứ giả mang lời nói hiền hòa và niềm vui đến cho mọi người.

---

### Stage 8: Bàn Thờ Tạ Ơn & Cầu Vồng Giao Ước (`St 8, 15 – 9, 17`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Ông Nô-ê dựng một bàn thờ kính Đức Chúa... Thiên Chúa phán: 'Ta đặt cây cung (cầu vồng) của Ta trong mây, và nó sẽ là dấu chỉ giao ước giữa Ta với mặt đất... Nước sẽ không bao giờ trở thành hồng thủy để hủy diệt mọi xác phàm nữa.'"* (`St 8, 20; 9, 13.15`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Khung cảnh đại kết cục rực rỡ và trang nghiêm trên sườn núi A-ra-rát tràn ngập cỏ hoa. Ở trung tâm, ông Nô-ê cùng gia đình đang quỳ tạ ơn bên **Bàn Thờ Đá** tỏa làn hương thơm bay thẳng lên trời; xung quanh họ, các đôi thú vui vẻ tỏa đi khắp núi đồi. Trên bầu trời xanh thẳm điểm mây trắng, một **Chiếc Cầu Vồng Bảy Sắc Khổng Lồ** hiện lên rực rỡ bắc nhịp cầu nối liền trời cao với mặt đất mới.
  * *Bảng màu:* Đủ 7 sắc cầu vồng pixel (Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím) tỏa sáng trên nền trời xanh thiên thanh và đồng cỏ xanh mướt.
  * *Hiệu ứng chuyển động:* Làn khói hương thơm từ bàn thờ bay lên, dải cầu vồng 7 sắc lấp lánh ánh sao từng nhịp từ trái sang phải.
* **Bản đồ Top-Down & Nhân vật:**
  * Đỉnh đồi Giao Ước dưới chân núi A-ra-rát, ở giữa là nền **Bàn Thờ Tạ Ơn**, xung quanh là **7 Đài Lăng Kính Giọt Sương** đại diện cho 7 sắc cầu vồng.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Nô-ê và gia đình, Chúa Thánh Thần, cùng muôn thú.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Altar Construction & 7-Color Spectral Prism Finale (Xây bàn thờ tạ ơn & Giải đố hội tụ 7 sắc Cầu Vồng Giao Ước).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Dựng Bàn Thờ Tạ Ơn (`St 8, 20`):** Việc đầu tiên ông Nô-ê làm khi bước ra khỏi tàu không phải là xây nhà cho mình, mà là **dựng bàn thờ tạ ơn Chúa**! Người chơi phải thu thập **12 Viên Đá Tinh Tuyền** rải rác trên sườn đồi (vượt qua các khe suối nước rút bằng cách bắc ván gỗ) để xây hoàn chỉnh Bàn Thờ Đá và thắp lửa lễ vật.
    2. **Pha 2 – Hội Tụ Bảy Sắc Cầu Vồng Giao Ước (`St 9, 12-17`):** Khi làn hương lễ vật bay lên, một **Luồng Ánh Sáng Trắng** từ trời chiếu xuống Bàn Thờ và tách thành các tia màu. Người chơi phải đẩy và xoay góc các **Trụ Tinh Thể Giọt Mưa** để dẫn tia sáng đi qua đúng thứ tự phổ quang học **7 Đài Cầu Vồng**:
       * `1. Đỏ (Tình Yêu)` $\rightarrow$ `2. Cam (Hy Vọng)` $\rightarrow$ `3. Vàng (Tín Trung)` $\rightarrow$ `4. Lục (Sự Sống)` $\rightarrow$ `5. Lam (Bình An)` $\rightarrow$ `6. Chàm (Trông Cậy)` $\rightarrow$ `7. Tím (Thánh Ân)`.
    3. **Độ khó & Checkpoint:** Nếu nối sai thứ tự màu hoặc để tia sáng bị cắt ngang bởi các tảng đá bóng râm, mạch cầu vồng sẽ ngắt tại màu đó để người chơi chỉnh lại góc xoay lăng kính.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Khi cả 7 Đài Cầu Vồng nối liền một mạch, một chiếc Cầu Vồng Bảy Sắc tuyệt đẹp vươn cao bao trùm toàn bộ bản đồ. Thiên Chúa chúc lành cho gia đình Nô-ê và lập Giao Ước Vĩnh Cửu với toàn thể thụ tạo. Ấn Dấu thứ 8 hoàn tất trọn vẹn **Hải Đồ Giao Ước (8/8 Ấn Dấu)**!
  * *Hoa trái suy niệm:* Lòng biết ơn: mỗi khi được Chúa giúp vượt qua khó khăn hay đạt kết quả tốt, việc đầu tiên là biết chắp tay thưa *"Con cảm ơn Chúa!"*; và mỗi khi nhìn thấy cầu vồng, hãy nhớ đến tình yêu trung thành muôn đời của Thiên Chúa.

---

# PHẦN 3: KHÚC VĨ THANH (EPILOGUE) – CON TÀU HỘI THÁNH & NHÀNH Ô-LIU BÌNH AN

---

### Màn Kết: Con Tàu Hội Thánh & Nhành Ô-liu Bình An (`St 9, 13`; `1 Pr 3, 20-21`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Trong tàu có một số ít, tức là tám người, được cứu thoát nhờ nước. Nước đó là hình ảnh phép rửa nay cứu thoát anh em."* (`1 Pr 3, 20-21`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Căn phòng nhỏ của Lữ khách lúc này rực rỡ ánh nắng chiều sau cơn mưa. Qua khung cửa sổ mở rộng, chiếc cầu vồng bảy sắc hiện lên rõ nét trên bầu trời trong xanh. Trên bàn học, mô hình Con Tàu Nô-ê đã hoàn thiện đặt trang trọng bên cạnh Cuộn Sách Sáng Thế và Chuỗi Mân Côi, cùng Chim Bồ Câu Chúa Thánh Thần đang mỉm cười nhìn em.
  * *Bảng màu:* Nắng vàng tươi sáng, xanh da trời trong vắt và 7 sắc cầu vồng rực rỡ.
  * *Hiệu ứng chuyển động:* Hạt nắng lấp lánh quanh mô hình con tàu, chiếc cầu vồng ngoài cửa sổ tỏa sáng dịu dàng.
* **Bản đồ Top-Down & Nhân vật:**
  * Căn phòng nhỏ của Lữ khách.
  * Nhân vật: Lữ khách nhỏ tuổi, Đức Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * *Thể loại:* Tương tác tổng kết & Thực hành đời sống (Interactive Reflection).
  * *Nhiệm vụ "Ba Cam Kết Của Người Thủy Thủ Đức Tin":* Người chơi tương tác với 3 góc trong phòng để đúc kết ý nghĩa câu chuyện Nô-ê đối với người Kitô hữu hôm nay:
    1. *Bên Mô Hình Con Tàu Gỗ (Sống công chính như ông Nô-ê):* Chúa Thánh Thần hỏi: *"Khi bạn bè rủ làm điều sai trái hoặc chê cười việc tốt, con học được gì nơi ông Nô-ê?"* $\rightarrow$ Chọn: *"Can đảm sống ngay thẳng và kiên trì vâng lời Chúa dạy dù phải đi ngược dòng"*.
    2. *Bên Cửa Sổ Cầu Vồng (Ý nghĩa Bí tích Rửa Tội & Hội Thánh):* Chúa Thánh Thần giải thích lời Thánh Phêrô (`1 Pr 3, 20-21`): *"Con Tàu Nô-ê xưa chính là hình ảnh tiên báo về **Hội Thánh**, và nước Hồng Thủy tẩy sạch mặt đất là hình ảnh của **Bí tích Rửa Tội** tái sinh chúng ta làm con cái Chúa!"*.
    3. *Tại Góc Cầu Nguyện (Sứ giả Nhành Ô-liu Bình An):* Đặt **Hải Đồ Giao Ước (8/8 Ấn Dấu)** cạnh **Cuộn Sách Sáng Thế** và **Chuỗi Mân Côi**, quyết tâm luôn là chú chim bồ câu mang nhành ô-liu hòa thuận, tha thứ đến cho gia đình và lớp học.
* **Hoa trái suy niệm:** Yêu mến Hội Thánh như Con Tàu Cứu Độ của Chúa, trân trọng ơn Bí tích Rửa Tội và luôn sống tâm tình tạ ơn, hòa bình.

---

# BẢNG TỔNG HỢP 8 STAGES & THỂ LOẠI GAMEPLAY (QUICK REFERENCE)

| Màn | Tên Stage | Kinh Thánh | Thể Loại Gameplay (Genre) | Cơ Chế Trọng Tâm |
| :--- | :--- | :--- | :--- | :--- |
| **Prologue** | Cơn Mưa Chiều & Con Tàu Gỗ | `St 6, 8-9` | Exploration & Model Assembly | Ghép 3 mảnh mô hình tàu gỗ & nhận Hải Đồ Giao Ước |
| **Stage 1** | Người Công Chính Giữa Thế Gian | `St 6, 5-13` | **Lantern Purity & Stealth** | Cầm Đèn Công Chính tránh Bóng Xoáy Bất Hòa & nép gió thắp sáng 4 bệ đá |
| **Stage 2** | Bản Vẽ Gỗ Bách & Nhựa Thông | `St 6, 14-16` | **Blueprint Sokoban & Crafting** | Đẩy kiện gỗ bách trên ray con lăn & quét nhựa thông lắp khít 3 tầng tàu |
| **Stage 3** | Muôn Thú Từng Đôi Lên Tàu | `St 6, 19 – 7, 9` | **Pair Matching & Routing** | Ghép đôi muôn thú & đóng/mở cổng phân luồng để thú dữ không chạm thú hiền |
| **Stage 4** | Cánh Cửa Đóng Lại & Mưa Lũ | `St 7, 10-16` | **Time-Management Hull Defense** | Chạy bịt khe rò bằng nhựa thông & đóng chốt cửa sổ qua 3 đợt sóng dâng |
| **Stage 5** | Lênh Đênh Trên Biển Nước | `St 7, 17-24` | **Ark Balance & Caretaking** | Dịch chuyển kiện hàng đối trọng giữ tàu cân bằng & chăm sóc 6 khoang thú |
| **Stage 6** | Ngọn Gió Chúa & Núi A-ra-rát | `St 8, 1-5` | **Momentum Current Sailing** | Đón luồng gió Chúa, thu buồm tránh gió xoáy & đá ngầm để cập đỉnh A-ra-rát |
| **Stage 7** | Chim Bồ Câu & Nhành Ô-liu | `St 8, 6-12` | **3-Phase Flight Scouting** | Điều khiển chim vượt gió lốc, giữ thể lực cánh & hái nhành ô-liu tươi mang về |
| **Stage 8** | Bàn Thờ Tạ Ơn & Cầu Vồng | `St 8, 15 – 9, 17` | **Altar Build & 7-Prism Finale** | Dựng bàn thờ 12 viên đá & xoay lăng kính giọt mưa hội tụ 7 sắc Cầu Vồng |
| **Epilogue** | Con Tàu Hội Thánh | `1 Pr 3, 20-21` | Interactive Reflection | 3 cam kết của Người Thủy Thủ Đức Tin kết nối Tàu Nô-ê với Bí tích Rửa Tội |

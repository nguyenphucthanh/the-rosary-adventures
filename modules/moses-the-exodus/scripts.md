# KỊCH BẢN NỘI DUNG & GAMEPLAY DESIGN: MOSES – THE EXODUS (MÔI-SÊ & HÀNH TRÌNH XUẤT HÀNH)

* **Tên game:** *Moses – The Exodus* (`modules/moses-the-exodus`)
* **Kinh Thánh nền tảng:** Sách Xuất Hành (`Xh 1, 1 – 20, 21; 32, 1 – 40, 38`).
* **Vai trò người chơi:** **Lữ khách nhỏ tuổi (Người Tìm Kiếm Đức Tin)** – tiếp nối hành trình sau *The Garden of Eden* và *Noah's Ark*. Khi mở sang cuốn sách thứ hai của bộ Ngũ Kinh là **Sách Xuất Hành (Exodus)**, em được **Đức Chúa Thánh Thần** dẫn đưa vào cuộc hành trình giải phóng vĩ đại nhất Cựu Ước: đồng hành cùng ngôn sứ **Môi-sê** từ khi còn là em bé trong chiếc thúng cói trên sông Nin, gặp gỡ Thiên Chúa nơi Bụi Cây Bốc Cháy, chứng kiến Mười Dấu Lạ tại Ai Cập, Đêm Lễ Vượt Qua, bước qua lòng Biển Đỏ rẽ đôi, đón nhận Bánh Mân-na giữa sa mạc và lãnh nhận **Mười Điều Răn Giao Ước** trên đỉnh núi Xi-nai.
* **Vật phẩm tiến trình (Progression Item):** **Hai Bia Đá Hành Trình (12 Ấn Dấu Xuất Hành & Giao Ước)**. Hoàn thành mỗi Stage sẽ khắc sáng 1 Ấn Dấu bằng chữ lửa vàng kim lên Bia Đá.
* **Điểm nhấn Trình bày & Độ khó:**
  1. **🎨 Màn Hình Minh Họa Pixel Art Mở Màn (Stage Intro Pixel Illustration Screen):**
     * Khi bắt đầu mỗi màn chơi, vùng màn hình phía trên hiển thị một **Bức tranh Minh Họa Pixel Art toàn cảnh (Full-frame Storybook Pixel Illustration)** giàu chi tiết, bố cục tiền cảnh – trung cảnh – hậu cảnh rõ nét, kèm hiệu ứng chuyển động pixel nhẹ (2–4 frames hoặc lửa cháy, nước rẽ, sương Mân-na rơi).
     * Sau khi người chơi đọc xong lời dẫn nhập, bức tranh chuyển cảnh mượt mà (Pixel Wipe / Fade) vào bản đồ Top-down để bắt đầu thử thách.
  2. **🎮 Đa dạng Thể loại Gameplay & Cơ chế Checkpoint (Soft Reset):**
     * 12 Stage chính là 12 cơ chế gameplay khác nhau: điều tiết dòng nước đưa thúng cói, bước trên đất thánh & thực hành 3 dấu lạ, đấu phép phá khiên Pha-ra-ô, thắp sáng mạng lưới đèn đất Gô-sen, chuẩn bị Lễ Vượt Qua & bôi máu chiên lên khung cửa, hộ tống dân qua lòng Biển Đỏ rẽ đôi, gõ nhịp trống cơm & thanh lọc nước đắng Ma-ra, thu hoạch Mân-na theo khẩu phần trước khi nắng lên, đập đá Khô-rép & nâng đỡ đôi tay Môi-sê cầu nguyện, vượt núi Xi-nai ghép Mười Điều Răn, phá tượng bê vàng & chuyển cầu, và lắp ráp Nhà Tạm Giao Ước.
     * Đi sai bước hoặc chạm chướng ngại sẽ lùi về **Checkpoint** gần nhất để người chơi thử lại.

* **Cấu trúc chuẩn của mỗi Stage:**
  1. **Dẫn nhập & Câu Lời Chúa chủ đề (Intro Cutscene)**
  2. **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration Screen)** *(Bố cục, Bảng màu, Hiệu ứng chuyển động)*
  3. **Bản đồ Top-Down & Nhân vật xuất hiện**
  4. **Thể loại & Cơ chế Gameplay chi tiết (Genre, Luật chơi, Độ khó / Checkpoint)**
  5. **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro)**

---

# PHẦN 0: KHÚC DẠO ĐẦU (PROLOGUE) – BẢN ĐỒ SA MẠC & CÂY GẬY NGƯỜI MỤC TỬ

---

### Màn Mở Đầu: Bản Đồ Sa Mạc & Cây Gậy Người Mục Tử (`Xh 3, 10-12`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Bây giờ, ngươi hãy đi! Ta sai ngươi đến với Pha-ra-ô để đưa dân Ta là con cái Ít-ra-en ra khỏi Ai Cập... Thiên Chúa phán: 'Ta sẽ ở với ngươi!'"* (`Xh 3, 10.12`).
  * *Bối cảnh mở màn:* Buổi tối yên tĩnh trong căn phòng nhỏ của Lữ khách. Trên bàn học, cuốn Kinh Thánh đang mở ở đầu **Sách Xuất Hành** bên cạnh một tấm bản đồ cổ vẽ vùng châu thổ sông Nin, Biển Đỏ và bán đảo Xi-nai.
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Cận cảnh trang sách *"EXODUS – XUẤT HÀNH"* dưới ánh đèn bàn ấm áp. Từ giữa trang giấy, một **Cột Lửa Rực Sáng** và hình ảnh chiếc **Gậy Gỗ Mục Tử** vươn lên giữa những đụn cát vàng sa mạc lấp lánh dưới bầu trời sao, cùng bóng **Chim Bồ Câu Chúa Thánh Thần** đang dẫn lối.
  * *Bảng màu:* Vàng cát sa mạc, cam đỏ rực rỡ của Cột Lửa và xanh tím bầu trời đêm.
  * *Hiệu ứng chuyển động:* Ngọn lửa của Cột Lửa bập bùng 3 frames, hạt cát vàng bay nhẹ quanh trang sách.
* **Bản đồ Top-Down & Nhân vật:**
  * Căn phòng nhỏ buổi tối của Lữ khách.
  * Nhân vật: Lữ khách nhỏ tuổi, Đức Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay (Warm-up):**
  * *Thể loại:* Tương tác khám phá & Ghép bản đồ hành trình.
  * *Nhiệm vụ:*
    1. *Bước 1 – Thắp sáng ngọn đèn bàn học:* Bật ngọn đèn để soi sáng góc bàn nơi đặt tấm bản đồ cổ.
    2. *Bước 2 – Nối Lộ Trình Xuất Hành:* Ghép đúng 3 mảnh địa danh trên bản đồ theo thứ tự lịch sử cứu độ: **Đất Nô Lệ Ai Cập $\rightarrow$ Lòng Biển Đỏ Cứu Độ $\rightarrow$ Đỉnh Núi Giao Ước Xi-nai**.
    3. *Bước 3 – Nhận Hai Bia Đá Hành Trình:* Chúa Thánh Thần hiện ra trao cho em **Hai Bia Đá Hành Trình (0/12 Ấn Dấu)** và mời gọi: *"Con yêu dấu, khi con cháu tổ phụ Gia-cóp sinh sôi đông đúc tại Ai Cập, một vua Pha-ra-ô mới lên ngôi đã bắt họ làm nô lệ cực nhọc. Nhưng Thiên Chúa đã nghe tiếng kêu than của dân Người và chọn ông Môi-sê để dẫn họ bước ra tự do. Hãy lên đường cùng Ta nhé!"*.
* **Bài học suy niệm:** Thiên Chúa luôn lắng nghe lời cầu nguyện của những người đau khổ và không bao giờ bỏ rơi dân của Người.

---

# PHẦN 1: TIẾNG KÊU THẤU TRỜI & CUỘC GIẢI THOÁT KHỎI AI CẬP (`Xh 1, 1 – 14, 31`)

---

### Stage 1: Chiếc Thúng Cói Trên Sông Nin (`Xh 1, 22 – 2, 10`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Khi không thể giấu con được nữa, bà lấy cho con một cái thúng sậy, trét hắc ín và nhựa thông, đặt đứa trẻ vào trong, rồi để giữa đám sậy gần bờ sông Nin. Chị đứa trẻ đứng đằng xa để xem cái gì sẽ xảy ra cho nó."* (`Xh 2, 3-4`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Khung cảnh bờ sông Nin buổi bình minh dịu mát với những khóm sậy cao xanh rì và hoa súng trắng – hồng. Trên mặt nước xanh biếc, một **chiếc thúng cói** nhỏ nhắn trét nhựa đen đang trôi êm đềm; bên trong là **em bé Môi-sê** đang ngủ ngoan. Nấp sau bụi sậy gần bờ là cô chị **Mi-ri-am** đang chăm chú dõi theo, còn phía hạ lưu là bến đá cẩm thạch nơi **Công chúa Pha-ra-ô** cùng các thị nữ đang bước xuống bờ sông.
  * *Bảng màu:* Xanh lam ngọc của sông Nin, xanh lá sậy non, vàng cát bờ sông và trắng – vàng hoàng gia Ai Cập.
  * *Hiệu ứng chuyển động:* Sóng nước gợn nhẹ đẩy chiếc thúng cói nhấp nhô (2 frames), lá sậy đung đưa trong gió sớm.
* **Bản đồ Top-Down & Nhân vật:**
  * Khúc sông Nin uốn lượn với hai bên bờ đầy bụi sậy, các cửa rạch nước, những con cá sấu sông Nin đang bơi ngang, lính canh Ai Cập trên cầu gỗ và bến nước của Công chúa ở cuối dòng.
  * Nhân vật: Lữ khách nhỏ tuổi đồng hành cùng chị **Mi-ri-am** chạy dọc bờ sông, bảo vệ **Chiếc Thúng Cói chở bé Môi-sê** đang trôi dưới nước.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **River Current Routing & Stealth Escort Puzzle (Điều tiết dòng nước dẫn đường & Ẩn nấp hộ tống chiếc thúng cói).**
  * **Cơ chế & Luật chơi:**
    1. Chiếc thúng cói chở bé Môi-sê trôi tự động theo dòng nước sông Nin từ Tây sang Đông.
    2. Người chơi và chị Mi-ri-am chạy dọc theo các lối mòn bờ sậy và cầu gỗ để mở đường cho chiếc thúng qua 3 khúc sông:
       * **Xoay Lá Sen Lớn & Gạt Đập Sậy (`[A]`):** Chuyển hướng dòng nước để chiếc thúng không trôi vào các **Xoáy Nước Sâu** hoặc vùng có **Cá Sấu Sông Nin** đang rình.
       * **Nấp Sau Bụi Sậy:** Khi **Lính Tuần Tra Ai Cập** trên bờ quay tầm nhìn (Vision Cone) về phía dòng sông, người chơi phải bấm giữ chốt dây sậy để giữ chiếc thúng nấp yên trong bóng râm bụi sậy cho tới khi lính canh quay đi!
    3. Cuối màn, khi chiếc thúng cập bến của Công chúa Pha-ra-ô, người chơi giúp chị Mi-ri-am bước ra thưa chuyện khéo léo để đưa bé Môi-sê về cho chính người mẹ ruột chăm sóc (`Xh 2, 7-9`).
    4. **Độ khó & Checkpoint:** Mỗi khúc sông (3 khúc) là 1 Checkpoint. Nếu chiếc thúng chạm xoáy nước, cá sấu hoặc bị lính tuần tra phát hiện, màn chơi lùi về đầu khúc sông đó.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Công chúa Pha-ra-ô mở thúng, thương xót đứa bé đang khóc và đặt tên cho em là **Môi-sê** (*"Vì ta đã kéo nó ra khỏi nước"* – `Xh 2, 10`). Ấn Dấu thứ 1 khắc sáng lên Bia Đá.
  * *Hoa trái suy niệm:* Sự quan phòng kỳ diệu của Thiên Chúa và tình yêu thương bảo vệ em nhỏ trong gia đình (như tấm lòng của mẹ và chị Mi-ri-am).

---

### Stage 2: Bụi Cây Bốc Cháy Trên Núi Khô-rép (`Xh 3, 1 – 4, 17`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *" Ông nhìn, và kìa, bụi cây cứ cháy bừng bừng mà không bị thiêu rụi... Thiên Chúa gọi ông từ giữa bụi cây: 'Môi-sê! Môi-sê!' Ông thưa: 'Dạ, tôi đây!' Người phán: 'Chớ lại gần đây! Cởi dép ở chân ngươi ra, vì nơi ngươi đang đứng là đất thánh!'"* (`Xh 3, 2.4-5`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Trên sườn núi đá **Khô-rép (Núi của Thiên Chúa)** giữa thảo nguyên Ma-đi-an hoang sơ, một **Bụi Cây Gai** đang bốc cháy rực rỡ sắc vàng – cam – trắng thánh thiêng nhưng từng chiếc lá xanh vẫn nguyên vẹn không hề héo úa. Trước bụi cây, ông **Môi-sê** (trong trang phục người mục tử chăn chiên, đôi dép đã cởi đặt ngay ngắn bên tảng đá) đang quỳ gối cung kính lắng nghe tiếng Chúa phán dạy.
  * *Bảng màu:* Đỏ cam và vàng trắng rực sáng của Ngọn Lửa Thánh, xanh lục tươi của bụi cây và nâu đỏ của núi đá Khô-rép.
  * *Hiệu ứng chuyển động:* Ngọn lửa thần linh bập bùng quanh bụi cây mà không sinh khói đen, các hạt sáng vàng bay lên trời (3-frame loop).
* **Bản đồ Top-Down & Nhân vật:**
  * Sườn núi đá Khô-rép với đồng cỏ chăn chiên ở chân núi và khu vực **Đất Thánh Bụi Cây Cháy** ở trên đỉnh.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê (cầm gậy chăn chiên), đàn chiên của ông Giê-trô, và Bụi Cây Bốc Cháy.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Sacred Ground Path Puzzle & 3 Miraculous Signs Mastery (Giải đố bước trên Đất Thánh & Thực hành 3 Dấu Lạ Chúa trao).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Lên Núi Khô-rép & Cởi Dép Trên Đất Thánh (`Xh 3, 1-5`):** Người chơi phụ giúp Môi-sê gom 4 chú chiên đi lạc về rào an toàn, sau đó bước vào khu vực **Vòng Đá Đất Thánh**. Tại đây, người chơi phải thực hiện nghi thức **Cởi Dép** tại Bệ Đá Khiêm Nhường và đi theo đúng **Lộ Trình Các Phiến Đá Phát Sáng** (dựa theo gợi ý ánh lửa từ Bụi Cây) để tiến đến trước mặt Chúa với lòng tôn kính.
    2. **Pha 2 – Thực Hành Ba Dấu Lạ Quyền Năng (`Xh 4, 1-9`):** Khi Môi-sê còn rụt rè lo lắng dân không tin mình, Thiên Chúa dạy ông thực hiện **3 Dấu Lạ** (người chơi thực hiện qua 3 mini-challenges căn nhịp & phản xạ):
       * *Dấu lạ 1 (Cây gậy hóa rắn):* Ném cây gậy xuống đất và khi con rắn lao đi, căn đúng nhịp bấm `[A]` khi vòng sáng chạm vào **đuôi rắn** để nắm lấy đuôi cho rắn hóa lại thành cây gậy quyền năng!
       * *Dấu lạ 2 (Bàn tay đặt vào ngực):* Chữa lành bàn tay trắng bệnh phong hủi trở lại hồng hào khỏe mạnh.
       * *Dấu lạ 3 (Nước sông Nin):* Múc nước đổ lên phiến đá khô cạn theo đúng thứ tự 3 rãnh đá.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Thiên Chúa mặc khải Danh Thánh của Người là **"TA LÀ ĐẤNG HẰNG HỮU" (`YHWH` – `Xh 3, 14`)**, hứa ở cùng Môi-sê và cử anh **A-ha-rôn** cùng đi với ông trở về Ai Cập. Ấn Dấu thứ 2 khắc sáng.
  * *Hoa trái suy niệm:* Giữ lòng tôn kính, trang nghiêm khi bước vào Nhà Thờ (Đất Thánh của Chúa) và tin tưởng rằng khi Chúa giao việc khó, Chúa sẽ ban ơn giúp sức cho chúng ta hoàn thành.

---

### Stage 3: Đối Diện Pha-ra-ô & Các Dấu Lạ Cảnh Báo (`Xh 7, 14 – 9, 35`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa, Thiên Chúa của người Híp-ri, đã sai tôi đến nói với ngài rằng: 'Hãy thả dân Ta ra để chúng đi thờ phượng Ta trong sa mạc!' Nhưng cho đến nay ngài đã không nghe."* (`Xh 7, 16`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Đại sảnh cung điện Ai Cập với những hàng cột đá khắc chữ tượng hình khổng lồ. Một bên là **Pha-ra-ô** ngồi trên ngai vàng với vẻ mặt kiêu ngạo, cứng cỏi cùng các thuật sĩ Ai Cập; đối diện là hai anh em **Môi-sê và A-ha-rôn** đứng hiên ngang giương cao cây gậy của Thiên Chúa. Qua khung cửa vòm phía sau, dòng sông Nin đã hóa đỏ rực và những tia chớp lửa kèm mưa đá đang giáng xuống bầu trời Ai Cập.
  * *Bảng màu:* Vàng kim – xanh lam của cung điện Ai Cập đối lập với sắc đỏ thẫm của dòng nước hóa máu và ánh chớp trắng cam của quyền năng Thiên Chúa.
  * *Hiệu ứng chuyển động:* Cây gậy trên tay Môi-sê và A-ha-rôn tỏa hào quang, mưa đá và tia lửa chớp giật phía ngoài cửa sổ cung điện.
* **Bản đồ Top-Down & Nhân vật:**
  * Sân lớn trước cung điện Pha-ra-ô nối ra bờ sông Nin, có **Khiên Đá Cứng Lòng** bao quanh ngai Pha-ra-ô và **3 Đài Quyền Năng** ở ba hướng.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê, ông A-ha-rôn, vua Pha-ra-ô và các Thuật Sĩ Ai Cập.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Tactical Staff Channelling & Boss-Shield Breaker (Hành động né bẫy ảo thuật & Kích hoạt 3 đợt Dấu Lạ phá vỡ sự cứng lòng).**
  * **Cơ chế & Luật chơi:**
    1. Pha-ra-ô ngoan cố dựng lên **3 Lớp Khiên Cứng Lòng** và sai các Thuật Sĩ tung ra những **Vòng Khói Ảo Thuật** chạy dọc sân cung điện để cản đường.
    2. Qua **3 Vòng Đấu**, người chơi phải phối hợp cùng Môi-sê và A-ha-rôn di chuyển né các Vòng Khói Ảo Thuật và dùng **Cây Gậy Quyền Năng (`[A]`)** kích hoạt các Đài Dấu Lạ tương ứng với các nhóm tai ương cảnh báo trong Kinh Thánh:
       * **Vòng 1 – Dấu lạ Nước Hóa Máu & Ếch Nhái (`Xh 7, 19 – 8, 11`):** Chạm gậy vào 3 Cột Nước bờ sông Nin để biến dòng kênh cung điện thành màu đỏ và dẫn đàn ếch nhái跳 (nhảy) vào làm rối loạn hàng ngũ thuật sĩ, buộc các thuật sĩ phải thốt lên: *"Đây là ngón tay của Thiên Chúa!"* (`Xh 8, 15`).
       * **Vòng 2 – Dấu lạ Ruồi Nhặng & Dịch Bệnh Gia Súc (`Xh 8, 16 – 9, 7`):** Dựng hàng rào phân định rõ rệt giữa vùng Ai Cập và vùng đất Gô-sen của dân Chúa.
       * **Vòng 3 – Dấu lạ Mưa Đá Lẫn Lửa & Châu Chấu (`Xh 9, 13 – 10, 20`):** Giương gậy lên trời dẫn các luồng sáng cảnh báo đánh vỡ lớp Khiên Cứng Lòng cuối cùng, đồng thời kịp thời gọi những người Ai Cập biết kính sợ Lời Chúa đưa gia súc vào mái che an toàn (`Xh 9, 20`).
    3. **Độ khó & Checkpoint:** Mỗi Vòng Đấu là 1 Checkpoint. Nhân vật có 3 Giọt Bình An trong mỗi vòng.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Dù chứng kiến quyền năng Thiên Chúa nhãn tiền và nhiều lần hứa thả dân ra rồi lại nuốt lời, lòng Pha-ra-ô vẫn chai đá. Ấn Dấu thứ 3 khắc sáng.
  * *Hoa trái suy niệm:* Đừng bao giờ sống cứng lòng, ngoan cố hay thất hứa như Pha-ra-ô; hãy có trái tim mềm mại, biết lắng nghe lời khuyên dạy tốt lành.

---

### Stage 4: Ba Ngày Tối Dày Đặc & Ánh Sáng Đất Gô-sen (`Xh 10, 21-29`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Ông Môi-sê giơ tay lên trời, và có bóng tối dày đặc trên khắp đất Ai Cập suốt ba ngày. Người ta không nhìn thấy nhau, và không ai rời khỏi chỗ mình suốt ba ngày; nhưng tất cả con cái Ít-ra-en đều có ánh sáng trong nơi mình ở."* (`Xh 10, 22-23`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bức tranh chia đôi đầy ấn tượng từ trên cao: bên trái là kinh thành Ai Cập với các kim tự tháp và đền đài đang chìm nghỉm trong một khối **Bóng Tối Đen Kịt** như mực đặc; bên phải là làng mạc **Đất Gô-sen** của người Ít-ra-en, nơi mọi ngôi nhà đều tỏa ánh đèn dầu vàng ấm áp và bầu trời vẫn sáng dịu hiền hòa.
  * *Bảng màu:* Đen tuyền và tím sẫm bên phía Ai Cập tương phản rực rỡ với sắc vàng cam ấm cúng bên phía đất Gô-sen.
  * *Hiệu ứng chuyển động:* Bức màn sương đêm đen đặc cuộn sóng ở ranh giới nhưng bị đẩy lùi mỗi khi chạm vào vòng sáng của các ngọn đèn Gô-sen.
* **Bản đồ Top-Down & Nhân vật:**
  * Khu định cư Đất Gô-sen nằm sát ranh giới bóng tối Ai Cập, gồm các con hẻm nhỏ, **8 Trụ Đèn Dầu Gia Đình** và các **Gương Phản Chiếu Đồng**.
  * Nhân vật: Lữ khách nhỏ tuổi cầm **Ngọn Đuốc Gô-sen**, ông Môi-sê và các gia đình Ít-ra-en.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Light-Network Relay & Encroaching Darkness Puzzle (Giải đố nối mạng lưới ánh sáng chống lại bóng tối dày đặc).**
  * **Cơ chế & Luật chơi:**
    1. Tai ương thứ chín – **Bóng Tối Dày Đặc** đang tràn qua ranh giới và làm các Trụ Đèn Dầu ở rìa làng Gô-sen lụi dần sau mỗi 15 giây nếu không được kết nối thành mạng lưới.
    2. Người chơi phải vừa chạy tiếp dầu thắp sáng **8 Trụ Đèn Dầu Gia Đình**, vừa đẩy các **Gương Đồng Phản Chiếu** vào đúng giao lộ để các tia sáng nối liền nhau tạo thành một **Vòng Đai Ánh Sáng Khép Kín** bao bọc toàn bộ khu dân cư Gô-sen!
    3. Khi một đoạn tia sáng được nối liền giữa 2 trụ đèn, bóng tối ở khu vực đó sẽ bị đẩy lùi vĩnh viễn và các trụ đèn đó không còn bị tắt nữa.
    4. **Độ khó & Checkpoint:** Nếu người chơi đi vào vùng Bóng Tối Dày Đặc khi ngọn đuốc trên tay hết dầu (chưa kịp chạm vào Trụ Đèn để nạp lại lửa), nhân vật sẽ bị lạc hướng và quay lại Trụ Đèn sáng gần nhất.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Toàn bộ khu đất Gô-sen bừng sáng rực rỡ giữa màn đêm ba ngày của Ai Cập, chuẩn bị cho các gia đình Ít-ra-en sẵn sàng đón đêm trọng đại nhất lịch sử. Ấn Dấu thứ 4 khắc sáng.
  * *Hoa trái suy niệm:* Nơi nào có Chúa hiện diện và gia đình biết cầu nguyện chung với nhau, nơi đó luôn tràn ngập ánh sáng bình an dù thế giới bên ngoài có tối tăm.

---

### Stage 5: Đêm Lễ Vượt Qua & Máu Chiên Cứu Độ (`Xh 12, 1-36`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Chúng sẽ lấy máu chiên mà bôi lên hai thành cửa và thanh ngang của những nhà trong đó chúng ăn thịt chiên... Còn các ngươi sẽ ăn thế này: lưng thắt gọn, chân mang dép, tay cầm gậy; các ngươi sẽ ăn vội vã: đó là Lễ Vượt Qua mừng Đức Chúa... Nhờ thấy máu, Ta sẽ vượt qua, không giáng tai ương tiêu diệt các ngươi."* (`Xh 12, 7.11.13`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Khung cảnh đêm trăng tròn thiêng liêng tại một ngôi nhà ở Gô-sen. Ở tiền cảnh bên ngoài, người cha đang dùng **chùm cỏ kinh giới** nhúng máu chiên bôi lên hai khung cửa dọc và thanh ngang phía trên, tạo thành một dấu ấn ánh sáng đỏ vàng bảo vệ ngôi nhà. Qua khung cửa mở hé nhìn vào bên trong, cả gia đình (từ ông bà đến các em nhỏ) đều đã mặc áo gọn gàng, chân đi dép, tay cầm gậy hành trình, đứng quây quần trang nghiêm quanh bàn tiệc có thịt chiên nướng, bánh không men và rau đắng.
  * *Bảng màu:* Xanh đêm trăng bạc bên ngoài, đỏ thắm – vàng kim nơi dấu máu trên khung cửa và cam ấm áp bên bàn tiệc gia đình.
  * *Hiệu ứng chuyển động:* Dấu máu trên khung cửa lấp lánh hào quang bảo vệ, ánh nến trên bàn tiệc Vượt Qua lung linh.
* **Bản đồ Top-Down & Nhân vật:**
  * Khu phố của 10 hộ gia đình Ít-ra-en tại Gô-sen trong đêm 14 tháng Giêng, với khu bếp chuẩn bị bánh không men ở trung tâm và 10 ngôi nhà xung quanh.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê, các bậc gia trưởng Ít-ra-en.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Passover Preparation & Doorpost Marking Race (Phối hợp chuẩn bị bàn tiệc Vượt Qua & Ghi dấu máu chiên lên khung cửa trước nửa đêm).**
  * **Cơ chế & Luật chơi:**
    1. Đồng hồ trăng tròn trên bầu trời đang tiến dần về mốc **Nửa Đêm (`Xh 12, 29`)**. Người chơi phải hoàn thành 2 nhiệm vụ liên tiếp đúng theo nghi thức Chúa truyền:
    2. **Pha 1 – Chuẩn Bị Tiệc Vượt Qua & Trang Bị Lên Đường:** Tại khu nhà chung, giúp các gia đình chuẩn bị đúng 3 phần thực phẩm thánh: **Chiên Tinh Tuyền Nướng Lửa**, **Bánh Không Men** (nhào bột nhanh trước khi bột dậy men!) và **Rau Đắng**, đồng thời nhắc các thành viên trang bị đủ 3 dấu hiệu sẵn sàng: *Thắt lưng gọn – Mang dép – Cầm gậy*.
    3. **Pha 2 – Ghi Dấu Máu Chiên Lên 10 Khung Cửa (`Xh 12, 22-23`):** Cầm **Chùm Kinh Giới** đi qua mê cung các con phố đêm (tránh các cơn Gió Đêm Lạnh làm chậm bước chân) để bôi dấu máu chiên lên đủ **2 thành cửa và thanh ngang** của cả **10 ngôi nhà Ít-ra-en**, rồi nhanh chóng bước vào trong nhà đóng cửa lại trước khi đồng hồ điểm Nửa Đêm!
    4. **Độ khó & Checkpoint:** Hoàn thành Pha 1 sẽ lưu Checkpoint. Ở Pha 2, nếu hết giờ trước khi ghi dấu đủ 10 ngôi nhà hoặc còn đứng ngoài đường khi điểm nửa đêm, người chơi sẽ thử lại Pha 2 với lộ trình tối ưu hơn.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Đúng nửa đêm, Sứ Thần của Chúa đi qua đất Ai Cập nhưng nhìn thấy dấu máu chiên trên khung cửa nên đã **"Vượt Qua"** (`Pesach / Passover`), gìn giữ mọi gia đình Ít-ra-en bình an vô sự. Pha-ra-ô kinh hoàng vội vã giục Môi-sê và toàn dân Ít-ra-en rời khỏi Ai Cập ngay trong đêm! Ấn Dấu thứ 5 khắc sáng.
  * *Hoa trái suy niệm:* Chiên Vượt Qua ngày xưa chính là hình ảnh tiên báo về **Chúa Giêsu Kitô – Chiên Thiên Chúa**, Đấng đã đổ máu đào trên Thập Giá để cứu chuộc chúng ta khỏi cái chết muôn đời.

---

### Stage 6: Cột Mây Cột Lửa & Rẽ Nước Biển Đỏ (`Xh 13, 21 – 14, 31`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa đi trước họ, ban ngày trong cột mây để dẫn đường cho họ, ban đêm trong cột lửa để soi sáng cho họ... Ông Môi-sê giơ tay lên trên biển; Đức Chúa dùng một trận gió đông mạnh mẽ thổi suốt đêm làm cho biển lùi lại, khiến biển thành đất khô cạn. Nước rẽ ra, và con cái Ít-ra-en đi vào giữa biển trên đất khô cạn, nước làm thành bức tường cho họ ở bên phải và bên trái."* (`Xh 13, 21; 14, 21-22`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Một bức tranh đại cảnh hùng tráng nghẹt thở: Trên mỏm đá bờ biển, ông **Môi-sê** giơ cao cây gậy hướng ra **Biển Đỏ**. Mặt biển sâu thẳm đang tách làm đôi, dựng đứng thành **hai bức tường nước xanh biếc khổng lồ** sủi bọt trắng xóa ở hai bên, để lộ con đường đất khô ráo ở giữa cho hàng ngàn người dân Ít-ra-en (cả người già, trẻ em và đàn gia súc) hối hả tiến qua. Ngay phía sau lưng đoàn dân là một **Cột Lửa & Cột Mây Cao Ngất Trời** đang tỏa sáng rực rỡ cho phía Ít-ra-en nhưng lại phủ bóng tối ngăn chặn đoàn **Chiến Xa Ai Cập** của Pha-ra-ô đang rượt đuổi.
  * *Bảng màu:* Xanh ngọc lam dựng đứng của hai bức tường nước, vàng nâu của lòng biển khô, cam đỏ rực cháy của Cột Lửa và ánh kim loại của đoàn chiến xa phía xa.
  * *Hiệu ứng chuyển động:* Hai bức tường nước cuộn sóng dựng đứng (3 frames), Cột Lửa bùng cháy dữ dội giữa hai doanh trại.
* **Bản đồ Top-Down & Nhân vật:**
  * Hành lang dài xuyên qua lòng Biển Đỏ vừa rẽ nước: hai bên rìa trên và dưới là hai bức tường nước dựng đứng, phía Tây (bên trái) là đoàn chiến xa Ai Cập đang đuổi theo và Cột Mây/Cột Lửa bảo vệ, phía Đông (bên phải) là Bờ Tự Do.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê, đoàn dân Ít-ra-en, Cột Mây – Cột Lửa, và đoàn chiến xa Pha-ra-ô.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Sea-Parting Escort & Pillar-of-Fire Tactical Defense (Hành động hộ tống dân qua lòng biển khô & Điều khiển Cột Lửa cản chiến xa).**
  * **Cơ chế & Luật chơi:**
    1. Đoàn dân Ít-ra-en (gồm 3 nhóm nối tiếp nhau) đang di chuyển từ bờ Tây sang bờ Đông qua lòng Biển Đỏ.
    2. Người chơi phải thực hiện song song **2 nhiệm vụ chiến thuật căng thẳng**:
       * **Mở Đường & Giữ Tường Nước (Phía Trước):** Dọc lòng biển có các tảng đá san hô chắn lối và các điểm **Tường Nước Chực Đổ** (báo hiệu bằng bọt nước sủi mạnh). Người chơi phải chạy lên trước dùng gậy kích hoạt các **Điểm Gió Đông (`[A]`)** để đẩy lùi tường nước giữ cho con đường luôn khô ráo, rộng rãi.
       * **Điều Phối Cột Lửa Chắn Chiến Xa (Phía Sau):** Từ phía Tây, các mũi **Chiến Xa Ai Cập** lao tới trên 3 làn đường. Người chơi bấm phím `[B]` để dịch chuyển vị trí **Cột Mây – Cột Lửa** sang đúng làn đường có chiến xa đang lao tới: ánh lửa thần linh sẽ làm bánh xe chiến xa bị lún cát và tuột ra (`Xh 14, 25`), không thể chạm vào đoàn dân!
    3. Khi nhóm dân cuối cùng vừa bước lên bờ Đông an toàn, người chơi chạy đến đứng cạnh ông Môi-sê trên mỏm đá và bấm `[A]` giơ tay lên trên biển để nước khép lại nhấn chìm toàn bộ chiến xa đang đuổi theo.
    4. **Độ khó & Checkpoint:** Mỗi nhóm dân (3 nhóm) qua biển an toàn là 1 Checkpoint.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Mặt biển khép lại êm đềm dưới ánh bình minh rực rỡ. *"Ngày hôm đó, Đức Chúa đã cứu Ít-ra-en khỏi tay người Ai Cập... Dân kính sợ Đức Chúa, và tin vào Đức Chúa cùng ông Môi-sê, tôi tớ của Người"* (`Xh 14, 30-31`). Ấn Dấu thứ 6 (khép lại Phần 1) bừng sáng.
  * *Hoa trái suy niệm:* Phép lạ Biển Đỏ là hình ảnh tiên trưng tuyệt vời của **Bí tích Rửa Tội**: nhờ nước Thánh Tẩy và quyền năng Chúa Thánh Thần, chúng ta được giải thoát khỏi nô lệ tội lỗi để bước vào đời sống mới tự do của con cái Chúa.

---

# PHẦN 2: HÀNH TRÌNH HOANG ĐỊA & GIAO ƯỚC NÚI XI-NAI (`Xh 15, 1 – 20, 21; 32 – 40`)

---

### Stage 7: Khúc Ca Biển Đỏ & Nước Ngọt Ma-ra (`Xh 15, 1-27`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Bấy giờ ông Môi-sê cùng với con cái Ít-ra-en hát bài ca này kính Đức Chúa: 'Tôi xin hát mừng Đức Chúa, vì Người đã chiến thắng oai hùng!'... Nữ ngôn sứ Mi-ri-am, chị ông A-ha-rôn, tay cầm trống cơm, và tất cả các phụ nữ đều cầm trống cơm theo sau bà mà múa... Đến Ma-ra, họ không uống được nước ở Ma-ra vì nước đắng... Đức Chúa chỉ cho ông một cây gỗ; ông ném nó xuống nước, và nước liền hóa ngọt."* (`Xh 15, 1.20.23.25`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bức tranh nối tiếp từ bờ Biển Đỏ sang ốc đảo xanh: ở tiền cảnh bên trái, ngôn sứ **Mi-ri-am** cùng các phụ nữ đang vui tươi gõ **trống cơm (Tambourine)** ca hát tạ ơn Chúa dưới ánh nắng ban mai; ở phía bên phải là dòng suối **Ma-ra** đang chuyển từ màu tím đắng chát sang màu xanh ngọc trong vắt khi ông Môi-sê thả **khúc gỗ Chúa chỉ** xuống nước, dẫn lối tới ốc đảo **Ê-lim** rợp bóng 70 cây chà là và 12 mạch nước mát.
  * *Bảng màu:* Vàng nắng sa mạc, sắc áo lễ hội tươi vui của đoàn ca múa, tím sẫm của nước đắng chuyển sang xanh ngọc bích mát lành của ốc đảo Ê-lim.
  * *Hiệu ứng chuyển động:* Chị Mi-ri-am lắc trống cơm phát ra các nốt nhạc pixel vàng, dòng nước Ma-ra đổi màu lan tỏa từ khúc gỗ.
* **Bản đồ Top-Down & Nhân vật:**
  * Nửa đầu bản đồ là Bờ Biển Chiến Thắng nơi đoàn dân đang ca hát; nửa sau là vùng sa mạc Xu-rơ với hồ nước đắng **Ma-ra** và con đường dẫn tới ốc đảo **Ê-lim**.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê, ngôn sứ Mi-ri-am và dân Ít-ra-en.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Tambourine Rhythm Minigame & Water-Purification Logic Puzzle (Căn nhịp trống cơm tạ ơn & Giải đố dùng gỗ thánh làm ngọt mạch nước Ma-ra).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Khúc Ca Chiến Thắng Bên Biển Đỏ (`Xh 15, 1-21`):** Cùng ngôn sứ Mi-ri-am hòa nhịp **Trống Cơm Tạ Ơn**: các nốt nhạc ánh sáng chạy dọc theo vòng tròn giai điệu (3 đoạn nhạc vui tươi tăng tốc độ dần). Người chơi phải bấm phím `[A]` và các phím hướng đúng nhịp trống để khích lệ tinh thần toàn dân bước vào sa mạc.
    2. **Pha 2 – Biến Nước Đắng Ma-ra Thành Nước Ngọt (`Xh 15, 22-27`):** Sau 3 ngày đi trong sa mạc không có nước, dân đến **Ma-ra** nhưng toàn bộ hệ thống hồ nước đều bị nhiễm vị đắng (màu tím sẫm). Thiên Chúa chỉ cho Môi-sê những **Khúc Gỗ Chữa Lành** mọc trên các mỏm đá quanh hồ.
    3. Người chơi phải giải bài toán phân luồng: thu thập **3 Khúc Gỗ Chữa Lành** và đặt vào đúng **Các Ngã Ba Đầu Nguồn** kết hợp xoay các phiến đá dẫn dòng sao cho dòng nước ngọt (màu xanh lam) chảy lan tỏa thanh lọc sạch 100% các vũng nước đắng mà không bị dòng bùn đục làm tái nhiễm, mở cổng bước vào ốc đảo **Ê-lim (12 suối nước & 70 cây chà là)**.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Dân chúng uống nước ngọt lành và nghỉ ngơi dưới bóng cây chà là tại Ê-lim, nơi Thiên Chúa phán: *"Chính Ta là Đức Chúa, Đấng chữa lành ngươi"* (`Xh 15, 26`). Ấn Dấu thứ 7 khắc sáng.
  * *Hoa trái suy niệm:* Khúc gỗ ông Môi-sê ném xuống làm ngọt dòng nước đắng Ma-ra chính là hình ảnh tiên báo về **Cây Thánh Giá Chúa Giêsu**: khi biết dâng những nỗi buồn hay khó khăn cho Chúa Giêsu, Người sẽ biến đổi vị đắng cuộc đời thành niềm vui và sự bình an.

---

### Stage 8: Bánh Mân-na & Chim Cút Từ Trời (`Xh 16, 1-35`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa phán với ông Môi-sê: 'Này Ta sẽ làm cho bánh từ trời mưa xuống cho các ngươi; dân sẽ ra lượm khẩu phần mỗi ngày ngày nào cho ngày đó'... Nhà Ít-ra-en đặt tên cho vật ấy là Mân-na; nó giống như hạt ngò, màu trắng, và có vị như bánh làm bằng mật ong."* (`Xh 16, 4.31`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Buổi bình minh trong trẻo trên hoang địa **Xin** nằm giữa Ê-lim và Xi-nai. Khi làn sương mai vừa bốc lên, khắp mặt cát sa mạc quanh các lều trại Ít-ra-en phủ kín những hạt **Mân-na** trắng ngần lấp lánh như ngọc trai và sương muối. Các gia đình (cha mẹ và các em nhỏ) đang vui vẻ cầm giỏ đan thu lượm từng khẩu phần vừa đủ, trong khi ông Môi-sê và A-ha-rôn đứng hướng dẫn với nụ cười hiền từ.
  * *Bảng màu:* Hồng vàng của bình minh sa mạc, trắng bạc lấp lánh của hạt Mân-na và nâu ấm của các lều vải.
  * *Hiệu ứng chuyển động:* Những hạt Mân-na phát sáng dịu dàng trên mặt đất, tia nắng mặt trời từ chân trời phía Đông từ từ dâng cao.
* **Bản đồ Top-Down & Nhân vật:**
  * Cánh đồng hoang địa Xin rộng lớn quanh khu lều trại của 6 gia đình Ít-ra-en (mỗi gia đình có số nhân khẩu khác nhau: nhà 2 người, nhà 3 người, nhà 4 người...).
  * Nhân vật: Lữ khách nhỏ tuổi cầm **Bình Đo Ô-me (`Omer`)**, ông Môi-sê, ông A-ha-rôn và các gia đình.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Daily Quota Math Gathering & Sun-Melt Race (Giải đố thu hoạch đúng định lượng khẩu phần trước khi nắng lên làm tan chảy).**
  * **Cơ chế & Luật chơi:**
    1. Thiên Chúa ban Mân-na không chỉ để nuôi sống dân mà còn để dạy họ **lòng tín thác mỗi ngày và biết chia sẻ công bằng** (`Xh 16, 4.18`): *"Người lượm nhiều cũng không dư, người lượm ít cũng không thiếu"*.
    2. Màn chơi diễn ra qua **3 Buổi Sáng Liên Tiếp**, mỗi buổi sáng có một **Vệt Nắng Mặt Trời Nóng** quét dần từ Đông sang Tây làm tan chảy các hạt Mân-na chưa kịp nhặt (`Xh 16, 21`):
       * **Vòng 1 – Ngày Thường (Đủ cho từng ngày):** Mỗi lều gia đình hiện số người (ví dụ: Lều A có 3 người $\rightarrow$ cần đúng **3 Ô-me**, Lều B có 4 người $\rightarrow$ cần đúng **4 Ô-me**). Người chơi phải nhanh chân nhặt các cụm Mân-na (cụm 1, cụm 2, cụm 3 hạt) và phân phát vào đúng giỏ của từng lều sao cho **vừa khít số Ô-me yêu cầu** trước khi nắng lên! (Nếu bỏ thừa quá số Ô-me, phần giữ lại qua đêm vì tham lam/thiếu lòng tin sẽ bị hỏng và phải chia lại).
       * **Vòng 2 – Ngày Thứ Sáu (Chuẩn bị cho Ngày Sa-bát - `Xh 16, 22-26`):** Hôm nay Chúa truyền thu lượm **gấp đôi khẩu phần ($2\times$)** để dành cho ngày thứ Bảy nghỉ ngơi! Người chơi phải tính nhẩm nhân đôi số Ô-me cho từng lều và lấy thêm **1 Ô-me đặc biệt** đưa cho ông A-ha-rôn đặt vào chiếc bình vàng lưu giữ trước mặt Chúa (`Xh 16, 33`).
       * **Vòng 3 – Ngày Thứ Bảy Sa-bát:** Giữ trại thanh tịnh, ngăn những người thiếu kiên nhẫn định tự ý chạy ra đồng tìm kiếm trong ngày nghỉ thánh.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Con cái Ít-ra-en được nuôi dưỡng bằng Bánh bởi trời suốt 40 năm hành trình cho tới ngày đặt chân vào Đất Hứa. Ấn Dấu thứ 8 khắc sáng.
  * *Hoa trái suy niệm:* Mỗi ngày khi đọc kinh Lạy Cha (*"Xin Cha cho chúng con hôm nay lương thực hằng ngày"*), chúng ta học biết sống tín thác vào Chúa, không tham lam ích kỷ; đồng thời nhận ra Mân-na xưa là hình ảnh báo trước về **Bí tích Thánh Thể – Bánh Trường Sinh** mà Chúa Giêsu ban tặng (`Ga 6, 32-35`).

---

### Stage 9: Đập Đá Rê-phi-đim & Đôi Tay Cầu Nguyện Trên Đồi (`Xh 17, 1-16`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa phán với ông Môi-sê: 'Này Ta sẽ đứng trước mặt ngươi ở đó, trên tảng đá tại Khô-rép; ngươi sẽ đập vào tảng đá, từ đó nước sẽ chảy ra cho dân uống.'... Khi nào ông Môi-sê giơ tay lên thì Ít-ra-en thắng thế; còn khi ông hạ tay xuống thì A-ma-lếch thắng thế. Nhưng tay ông Môi-sê đâm mỏi; các ông A-ha-rôn và Khua lấy một hòn đá kê cho ông ngồi, rồi hai ông đỡ tay ông, mỗi người một bên; thế là tay ông cứ giơ vững cho đến lúc mặt trời lặn."* (`Xh 17, 6.11-12`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bức tranh chia làm hai tầng cao – thấp tại thung lũng **Rê-phi-đim**: ở tầng dưới là **Tảng Đá Khô-rép (Ma-xa & Mơ-ri-ba)** đang tuôn trào một dòng suối nước mát lành trắng xóa và cánh quân của người thanh niên dũng cảm **Giu-suê** đang cầm khiên bảo vệ dân chúng; ở tầng trên đỉnh đồi cao lộng gió, ông **Môi-sê** ngồi trên tảng đá, hai tay cầm cây gậy của Thiên Chúa giơ cao lên trời, được ông **A-ha-rôn** và ông **Khua** đứng hai bên thành tâm nâng đỡ dưới ánh hoàng hôn rực rỡ.
  * *Bảng màu:* Xanh lam trắng xóa của dòng suối tuôn ra từ đá, vàng đồng của thung lũng Rê-phi-đim và cam vàng rực sáng trên đỉnh đồi cầu nguyện.
  * *Hiệu ứng chuyển động:* Dòng suối từ tảng đá tuôn chảy liên tục, hào quang từ đôi tay giơ cao của Môi-sê truyền sức mạnh xuống thung lũng bên dưới.
* **Bản đồ Top-Down & Nhân vật:**
  * Khu vực Rê-phi-đim gồm Vách Đá Khô-rép ở phía Bắc và Đồi Cầu Nguyện nhìn xuống Thung Lũng Bảo Vệ ở phía Nam.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê, ông A-ha-rôn, ông Khua, và dũng tướng Giu-suê.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Rock-Strike Timing & Prayer-Hands Support Multitask (Căn nhịp đập đá mở nguồn nước & Phối hợp nâng đỡ đôi tay cầu nguyện).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Đập Tảng Đá Khô-rép Mở Suối Nguồn (`Xh 17, 1-7`):** Trước sự khát nước của dân, người chơi cùng Môi-sê và các kỳ mục tiến đến **Tảng Đá Lớn**. Trên tảng đá có 3 mạch ngầm phát sáng luân phiên. Người chơi phải căn đúng nhịp giáng **Cây Gậy Đã Đập Sông Nin (`[A]`)** vào đúng tâm mạch đá 3 lần liên tiếp để làm nứt tảng đá, cho dòng nước mát tuôn trào giải khát cho toàn trại!
    2. **Pha 2 – Đỡ Tay Môi-sê Trên Đồi Cầu Nguyện (`Xh 17, 8-13`):** Quân A-ma-lếch bất ngờ kéo đến tấn công những người yếu sức ở cuối đoàn. Giu-suê dẫn quân ra giữ thung lũng, còn Môi-sê, A-ha-rôn và Khua lên đỉnh đồi.
    3. Trên đỉnh đồi có **Hai Thanh Sức Bền Đôi Tay (Tay Trái – bên A-ha-rôn & Tay Phải – bên Khua)**. Những cơn gió lốc sa mạc liên tục thổi tạt làm hai cánh tay của Môi-sê mỏi dần và hạ xuống (nếu tay hạ xuống dưới mức 50%, hàng phòng thủ của Giu-suê ở dưới thung lũng sẽ bị đẩy lùi!).
    4. Người chơi phải chạy qua lại trên đỉnh đồi để:
       * Đẩy **Hòn Đá Điểm Tựa** kê dưới chỗ ngồi của Môi-sê.
       * Thu thập các **Ngọn Lửa Cầu Nguyện** xuất hiện quanh đồi để tiếp sức cho **A-ha-rôn (bên trái)** và **Khua (bên phải)** giữ cho cả hai cánh tay của Môi-sê luôn giơ cao vững vàng suốt 60 giây cho đến khi Mặt Trời lặn và Giu-suê toàn thắng!
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Ông Môi-sê dựng một bàn thờ và đặt tên là *"Đức Chúa là Ngọn Cờ của tôi" (`YHWH-Nissi` – `Xh 17, 15`)*. Ấn Dấu thứ 9 khắc sáng.
  * *Hoa trái suy niệm:* Sức mạnh của **lời cầu nguyện kiên trì** và **sự hiệp thông nâng đỡ nhau**: khi cha mẹ, thầy cô, các linh mục hay bạn bè mệt mỏi, lời cầu nguyện và sự giúp đỡ nhỏ bé của chúng ta cũng giống như A-ha-rôn và Khua nâng đỡ đôi tay ông Môi-sê vậy.

---

### Stage 10: Mười Điều Răn Trên Đỉnh Xi-nai (`Xh 19, 16 – 20, 21`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Núi Xi-nai toàn khối bốc khói, vì Đức Chúa ngự xuống trên đó trong lửa... Bấy giờ Thiên Chúa phán tất cả những lời sau đây: 'Ta là Đức Chúa, Thiên Chúa của ngươi, Đấng đã đưa ngươi ra khỏi đất Ai Cập, khỏi cảnh nô lệ. Ngươi không được có thần nào khác đối nghịch với Ta...'"* (`Xh 19, 18; 20, 1-3`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Đỉnh núi **Xi-nai** hùng vĩ chìm trong mây dày, chớp lửa rực sáng và tiếng tù và vang dội đất trời. Dưới chân núi là hàng rào giới hạn nơi toàn dân Ít-ra-en đã thanh tẩy trang phục đứng chiêm ngưỡng trong lòng kính sợ; còn trên đỉnh núi cao nhất giữa vầng hào quang lửa thánh, ông **Môi-sê** đang nâng niu đón nhận **Hai Bia Đá Giao Ước** khắc **Mười Điều Răn** tỏa chữ vàng lấp lánh.
  * *Bảng màu:* Tím sẫm của mây sấm, cam đỏ của lửa núi Xi-nai, xanh đá hoa cương của Hai Bia Đá và vàng kim của chữ khắc Thiên Chúa.
  * *Hiệu ứng chuyển động:* Tia chớp lóe sáng quanh đỉnh núi, những dòng chữ vàng trên Hai Bia Đá lần lượt khắc sáng từ I đến X.
* **Bản đồ Top-Down & Nhân vật:**
  * Con đường bậc đá dốc đứng leo lên đỉnh núi Xi-nai qua 3 tầng mây, với ranh giới thánh dưới chân núi và **Đài Giao Ước Mười Điều Răn** trên đỉnh.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê (và Giu-suê đứng đợi ở lưng chừng núi).
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Mountain Ascent Hazard Timing & Ten Commandments Tablet Puzzle (Vượt đường núi Xi-nai & Ghép đúng Hai Bia Đá Mười Điều Răn).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Thiết Lập Ranh Giới Thánh & Leo Đỉnh Xi-nai (`Xh 19, 12-24`):** Đầu tiên, người chơi phụ giúp đặt **4 Cột Mốc Ranh Giới** quanh chân núi để bảo vệ dân chúng giữ khoảng cách tôn kính. Sau đó, người chơi cùng Môi-sê leo lên các bậc đá dốc đứng trên sườn núi, căn nhịp bước qua các **Luồng Mây Sấm & Lửa Thánh** (di chuyển khi tiếng tù và ngân lên mở lối).
    2. **Pha 2 – Khắc Ghi Mười Điều Răn Vào Hai Bia Đá (`Xh 20, 1-17`):** Trên đỉnh núi Xi-nai, trước mặt người chơi là **Bia Đá Thứ Nhất (3 Điều Răn về Lòng Mến Chúa)** và **Bia Đá Thứ Hai (7 Điều Răn về Tình Yêu Thương Con Người)**.
    3. Xung quanh đỉnh núi xuất hiện **10 Phiến Chữ Ánh Sáng**. Người chơi phải thu thập và đặt từng Phiến Chữ vào đúng Bia Đá và đúng thứ tự từ **Điều Răn Thứ Nhất đến Điều Răn Thứ Mười**:
       * **Bia I (Đối với Thiên Chúa):** (1) Thờ phượng một Thiên Chúa và kính mến Người trên hết mọi sự $\rightarrow$ (2) Chớ kêu tên Đức Chúa vô cớ $\rightarrow$ (3) Giữ ngày Chúa Nhật (Sa-bát) thánh thiện.
       * **Bia II (Đối với Tha Nhân):** (4) Thảo kính cha mẹ $\rightarrow$ (5) Chớ giết người (tôn trọng sự sống, không đánh đập/thù ghét) $\rightarrow$ (6) Giữ trong sạch $\rightarrow$ (7) Chớ lấy của người $\rightarrow$ (8) Chớ làm chứng dối (sống thành thật) $\rightarrow$ (9) & (10) Giữ tâm hồn trong sáng, không tham lam của người khác.
    4. **Độ khó & Checkpoint:** Nếu đặt nhầm Bia Đá hoặc sai thứ tự Điều Răn, phiến chữ sẽ bay trở lại vị trí cũ kèm gợi ý ngắn gọn từ Lời Chúa để người chơi suy nghĩ và đặt lại cho đúng.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Hai Bia Đá Giao Ước tỏa sáng rực rỡ – đây không phải là những xiềng xích cấm đoán, mà là **Con Đường Tự Do và Hạnh Phúc** mà Thiên Chúa Cha trao ban để bảo vệ dân Người khỏi rơi lại vào cảnh nô lệ tội lỗi. Ấn Dấu thứ 10 khắc sáng.
  * *Hoa trái suy niệm:* Thuộc lòng và thực hành **Mười Điều Răn Chúa** trong đời sống hằng ngày, tóm gọn trong hai giới răn trọng nhất: **Mến Chúa hết lòng và Yêu người thân cận như chính mình**.

---

### Stage 11: Bi Kịch Bê Vàng & Lời Chuyển Cầu Của Môi-sê (`Xh 32, 1-34`; `34, 1-10`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Dân thấy ông Môi-sê cứ ở mãi trên núi chưa xuống, liền tụ họp quanh ông A-ha-rôn... làm thành một con bê đúc... Ông Môi-sê khẩn khoản nài xin Đức Chúa, Thiên Chúa của ông... Đức Chúa đi qua trước mặt ông và xướng lên: 'Đức Chúa! Đức Chúa! Thiên Chúa nhân hậu và từ bi, hay nén giận, giàu nhân nghĩa và thành tín!'"* (`Xh 32, 1.4.11; 34, 6`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bức tranh giàu chiều sâu cảm xúc: ở nửa dưới tối tăm là cảnh tượng đáng buồn dưới chân núi khi dân mất kiên nhẫn đúc tượng bê vàng, và hai tấm bia đá bị vỡ dưới chân núi khi Môi-sê đau lòng ném xuống; nhưng ở nửa trên rực sáng nơi hốc đá núi Xi-nai, ông **Môi-sê** đang quỳ phủ phục giơ hai tay khóc thương cầu bầu cho dân, cạnh bên là **Hai Bia Đá Mới** vừa được ông đẽo lại đang đón nhận luồng ánh sáng **Lòng Thương Xót của Thiên Chúa** chiếu xuống.
  * *Bảng màu:* Xám khói u tối nơi bệ tượng bê vàng đã vỡ dưới chân núi, chuyển dần lên sắc vàng hồng từ bi và trắng tinh khiết nơi đỉnh núi cầu bầu.
  * *Hiệu ứng chuyển động:* Đám khói mê muội dưới chân núi tan dần khi ánh sáng từ lời cầu bầu của Môi-sê trên đỉnh núi lan tỏa xuống.
* **Bản đồ Top-Down & Nhân vật:**
  * Bản đồ kết nối giữa Doanh Trại Chân Núi (đang bị bao phủ bởi những đám **Khói Mê Muội Bê Vàng**) và Con Đường Hối Cải dẫn ngược lên Hốc Đá Núi Xi-nai.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê, Giu-suê, những người con chi tộc Lê-vi trung tín.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Idol Purge Action & Tablet Restoration Puzzle (Hành động xua tan khói mê muội ngẫu tượng & Đẽo lại Hai Bia Đá Giao Ước).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Phá Hủy Ngẫu Tượng & Thức Tỉnh Dân Chúng (`Xh 32, 19-26`):** Dưới chân núi, tượng bê vàng phát ra các **Vòng Sóng Mê Muội** làm dân chúng mất phương hướng. Người chơi cầm **Ngọn Đuốc Trung Tín** cùng ông Môi-sê vượt qua các vòng sóng, gạt đổ **4 Lò Đúc Vàng Giả Tạo** ở bốn góc trại để làm tắt nguồn khói mê muội, rồi đập tan bệ tượng bê vàng ở trung tâm, giúp dân nhận ra lỗi lầm và ăn năn.
    2. **Pha 2 – Đẽo Hai Bia Đá Mới & Lời Chuyển Cầu (`Xh 34, 1-10`):** Để xin Chúa tha thứ và nối lại Giao Ước đã vỡ, người chơi phải giúp ông Môi-sê đẽo **2 Phiến Đá Nguyên Khối Mới** (bằng cơ chế gọt các cạnh đá thừa trên lưới $4\times4$ sao cho khớp đúng hình dáng Bia Đá gốc) và mang hai bia đá đó vượt qua con đường gió lốc lên lại đỉnh núi Xi-nai ngay lúc rạng đông.
    3. **Độ khó & Checkpoint:** Hoàn thành Pha 1 dưới chân núi sẽ lưu Checkpoint. Ở Pha 2, nếu đẽo phạm vào phần lõi Bia Đá, người chơi có thể bấm `[B]` để lấy khối đá mới đẽo lại.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Trên đỉnh núi, Thiên Chúa lắng nghe lời cầu bầu đầy yêu thương của Môi-sê (người mục tử sẵn sàng chịu phạt thay cho dân mình), tha thứ tội lỗi cho dân và viết lại Mười Điều Răn lên hai bia đá mới. Khi ông Môi-sê xuống núi, da mặt ông tỏa ánh hào quang rực rỡ vì đã được diện kiến và trò chuyện với Chúa (`Xh 34, 29`)! Ấn Dấu thứ 11 khắc sáng.
  * *Hoa trái suy niệm:* Đừng bao giờ để tiền bạc, trò chơi hay bất cứ "thần tượng" nào chiếm mất vị trí của Chúa trong lòng chúng ta; đồng thời học nơi ông Môi-sê tấm lòng biết **cầu nguyện cho người khác** và tin tưởng vào **Lòng Thương Xót vô biên của Thiên Chúa**.

---

### Stage 12: Dựng Nhà Tạm & Vinh Quang Chúa Ngự Xuống (`Xh 35 – 40`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Họ sẽ làm cho Ta một Nơi Thánh, và Ta sẽ ở giữa họ... Ông Môi-sê hoàn tất công việc. Bấy giờ đám mây bao phủ Lều Hội Ngộ, và vinh quang Đức Chúa tràn ngập Nhà Tạm."* (`Xh 25, 8; 40, 33-34`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Toàn cảnh đại kết cục huy hoàng giữa thung lũng Xi-nai: ở trung tâm doanh trại 12 chi tộc Ít-ra-en là **Nhà Tạm (Đền Tạm / Lều Hội Ngộ)** uy nghiêm với hàng rào vải gai trắng bao quanh, màn cửa thêu chỉ xanh – tím – đỏ thắm và các cột gỗ keo bọc vàng lấp lánh. Bên trong Nơi Cực Thánh là **Hòm Bia Giao Ước** với hai Thần Hộ Vệ (Cherubim) bằng vàng ròng xoè cánh che Nắp Xá Tội. Từ bầu trời cao xanh, **Đám Mây Vinh Quang Của Đức Chúa** rực sáng ánh hào quang vàng kim ngự xuống tràn ngập toàn bộ Nhà Tạm.
  * *Bảng màu:* Vàng ròng lấp lánh, trắng tinh khôi của vải gai, cùng ba sắc chỉ thánh xanh tím – đỏ tía – đỏ thắm trên nền cát vàng.
  * *Hiệu ứng chuyển động:* Khói hương trầm từ bàn thờ bay lên, Chân Đèn Vàng 7 Ngọn tỏa sáng và Đám Mây Vinh Quang lấp lánh bao phủ Nhà Tạm (4-frame loop).
* **Bản đồ Top-Down & Nhân vật:**
  * Khuôn viên **Nhà Tạm Giao Ước** chia làm 3 không gian thánh thiêng theo đúng thiết kế Kinh Thánh (`Xh 40, 1-33`): **Tiền Đình (Sân Ngoài)** $\rightarrow$ **Nơi Thánh (Holy Place)** $\rightarrow$ **Nơi Cực Thánh (Holy of Holies)**.
  * Nhân vật: Lữ khách nhỏ tuổi, ông Môi-sê, thượng tế A-ha-rôn, hai nghệ nhân tài hoa **Bơ-xan-ên** và **Ô-hô-li-áp**, cùng toàn dân Ít-ra-en quảng đại dâng lễ vật.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Sanctuary Blueprint Assembly & Sacred Lighting Finale (Giải đố lắp đặt kiến trúc Nhà Tạm & Thắp sáng Nơi Thánh đón Vinh Quang Chúa).**
  * **Cơ chế & Luật chơi:**
    1. Toàn dân Ít-ra-en đã tự nguyện dâng vàng, bạc, đồng, gỗ keo và vải quý dư đầy đến mức ông Môi-sê phải truyền ngừng mang thêm (`Xh 36, 5-6`). Giờ đây, vào ngày mồng một tháng Giêng, người chơi cùng ông Môi-sê và hai nghệ nhân Bơ-xan-ên – Ô-hô-li-áp thực hiện nghi thức **Dựng Nhà Tạm và Sắp Đặt Các Thánh Vật** theo đúng bản mẫu Chúa đã chỉ trên núi:
    2. **Thử thách 3 Không Gian Thánh:**
       * **Bước 1 – Khu Sân Ngoài (Tiền Đình):** Điều khiển ròng rọc dựng hàng rào vải gai trắng, đặt **Bàn Thờ Lễ Toàn Thiêu** ngay trước cửa lều và đặt **Chậu Đồng Đựng Nước Thanh Tẩy** ở giữa Lều Hội Ngộ và Bàn Thờ (dẫn mạch nước suối trong vào đầy chậu để A-ha-rôn và các tư tế rửa tay chân trước khi vào Lều).
       * **Bước 2 – Khu Nơi Thánh:** Đẩy và đặt chính xác 3 vật thánh bọc vàng vào đúng phương vị quy định trong Kinh Thánh (`Xh 40, 22-27`):
         1. **Bàn Bánh Tiến (12 chiếc bánh trưng bày):** Đặt ở **phía Bắc** Nơi Thánh.
         2. **Chân Đèn Vàng Bảy Ngọn (`Menorah`):** Đặt ở **phía Nam** đối diện với Bàn Bánh, rồi giải mini-puzzle thắp sáng cả **7 ngọn đèn dầu ô-liu** theo thứ tự đối xứng từ ngọn giữa ra hai bên!
         3. **Bàn Thờ Hương Vàng:** Đặt ở **chính giữa** ngay trước bức màn che Nơi Cực Thánh và đốt hương thơm ngát.
       * **Bước 3 – Khu Nơi Cực Thánh & Hòm Bia Giao Ước:** Cung kính rước **Hai Bia Đá Chứng Ước** đặt vào lòng **Hòm Bia Giao Ước**, đặt **Nắp Xá Tội có hai Thần Hộ Vệ Cherubim bằng vàng** lên trên Hòm Bia và căng Bức Màn Thánh che chắn.
    3. **Độ khó & Checkpoint:** Mỗi không gian hoàn tất (Sân Ngoài $\rightarrow$ Nơi Thánh $\rightarrow$ Nơi Cực Thánh) là 1 Checkpoint. Nếu đặt nhầm phương vị Bắc/Nam hoặc chưa thanh tẩy tay tại Chậu Đồng trước khi bước vào Nơi Thánh, ông Môi-sê sẽ nhẹ nhàng nhắc lại chỉ dẫn trong `Xh 40` để người chơi thực hiện đúng chuẩn phụng vụ.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Ngay khi bức màn cổng sân được treo lên hoàn tất công trình, **Đám Mây Vinh Quang Của Đức Chúa** từ trời ngự xuống bao phủ Lều Hội Ngộ và ánh sáng vinh quang của Chúa tràn ngập Nhà Tạm! Ban ngày Đám Mây của Chúa ở trên Nhà Tạm, ban đêm có Lửa ở trong mây trước mắt toàn nhà Ít-ra-en trên mọi chặng đường họ đi (`Xh 40, 38`). Ấn Dấu thứ 12 hoàn tất trọn vẹn **Hai Bia Đá Hành Trình (12/12 Ấn Dấu)**!
  * *Hoa trái suy niệm:* Thiên Chúa cao cả trên trời nhưng lại yêu thương muốn **ở gần bên cạnh con người** ("Emmanuel – Thiên Chúa ở cùng chúng ta"); Nhà Tạm và Hòm Bia Giao Ước xưa chính là hình ảnh báo trước về **Chúa Giêsu ngự thật trong Nhà Tạm Bí tích Thánh Thể** tại mỗi nhà thờ hôm nay, và về **Đức Trinh Nữ Maria – Hòm Bia Giao Ước Mới**.

---

# PHẦN 3: KHÚC VĨ THANH (EPILOGUE) – CUỘC VƯỢT QUA MỚI CỦA CHÚA GIÊSU

---

### Màn Kết: Cuộc Vượt Qua Mới Của Chúa Giêsu (`Xh 12`; `Ga 6, 32-35`; `1 Cr 10, 1-4`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Lề Luật đã được Thiên Chúa ban qua ông Môi-sê, còn ân sủng và sự thật thì nhờ Đức Giê-su Ki-tô mà có."* (`Ga 1, 17`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Căn phòng nhỏ của Lữ khách lúc bình minh rạng rỡ. Trên bàn học, cuốn Kinh Thánh mở ở chương cuối sách Xuất Hành nằm cạnh **Hai Bia Đá Mười Điều Răn**, **Hải Đồ Tàu Nô-ê**, **Cuộn Sách Sáng Thế** và **Chuỗi Mân Côi 20 Hạt**. Ánh nắng sớm chiếu qua khung cửa tạo thành hình bóng Thánh Giá dịu dàng nối liền từ Cựu Ước sang Tân Ước, bên cạnh Chim Bồ Câu Chúa Thánh Thần.
  * *Bảng màu:* Vàng bình minh rạng ngời, trắng tinh khôi, xanh thiên thanh và đỏ thắm tình yêu.
  * *Hiệu ứng chuyển động:* Hạt sáng vàng bay nối liền giữa Hai Bia Đá Xuất Hành và Chuỗi Mân Côi, trang sách khẽ lật nhẹ.
* **Bản đồ Top-Down & Nhân vật:**
  * Căn phòng nhỏ ấm cúng của Lữ khách.
  * Nhân vật: Lữ khách nhỏ tuổi, Đức Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * *Thể loại:* Tương tác tổng kết & Thực hành đời sống (Interactive Reflection).
  * *Nhiệm vụ "Ba Nhịp Cầu Nối Cựu Ước & Tân Ước":* Chúa Thánh Thần giúp em nhìn lại toàn bộ hành trình Xuất Hành để thấy rõ mọi biến cố đời ông Môi-sê đều dẫn tới **Đức Chúa Giêsu**:
    1. *Bên Bản Đồ Biển Đỏ (Chiên Vượt Qua & Nước Cứu Độ):* Chúa Thánh Thần hỏi: *"Máu chiên bôi trên khung cửa cứu dân khỏi chết và cuộc vượt qua Biển Đỏ báo trước về mầu nhiệm nào?"* $\rightarrow$ Chọn: *"Báo trước về **Chúa Giêsu – Chiên Thiên Chúa** chịu chết trên Thập Giá và **Bí tích Rửa Tội** đưa chúng ta từ nô lệ tội lỗi sang tự do của con cái Chúa"*.
    2. *Bên Bàn Học (Mân-na & Nước Từ Tảng Đá):* Chúa Thánh Thần hỏi: *"Bánh Mân-na từ trời nuôi dân suốt 40 năm và nước chảy ra từ tảng đá Khô-rép giúp con nhớ đến ơn lành nào mỗi khi đi lễ?"* $\rightarrow$ Chọn: *"Nhớ đến **Bí tích Thánh Thể** – chính Mình và Máu Chúa Giêsu là Bánh Hằng Sống nuôi dưỡng linh hồn chúng ta trên đường về Quê Trời (`Ga 6, 35`)"*.
    3. *Tại Góc Cầu Nguyện (Mười Điều Răn & Nhà Tạm Tình Yêu):* Đặt **Hai Bia Đá Hành Trình (12/12 Ấn Dấu)** cạnh **Cuộn Sách Sáng Thế**, **Hải Đồ Nô-ê** và **Chuỗi Mân Côi**, quyết tâm vâng giữ Mười Điều Răn và năng viếng Chúa Giêsu Thánh Thể đang ngự trong Nhà Tạm nơi nhà thờ.
* **Hoa trái suy niệm:** Tri ân công trình cứu độ kỳ diệu của Thiên Chúa trải dài từ Sáng Thế – Xuất Hành đến Chúa Giêsu Kitô; sống tự do khỏi thói hư tật xấu, vâng giữ Mười Điều Răn và yêu mến Bí tích Thánh Thể.

---

# BẢNG TỔNG HỢP 12 STAGES & THỂ LOẠI GAMEPLAY (QUICK REFERENCE)

| Màn | Tên Stage | Kinh Thánh | Thể Loại Gameplay (Genre) | Cơ Chế Trọng Tâm |
| :--- | :--- | :--- | :--- | :--- |
| **Prologue** | Bản Đồ Sa Mạc & Cây Gậy | `Xh 3, 10-12` | Exploration & Map Puzzle | Ghép 3 chặng lộ trình Xuất Hành & nhận Hai Bia Đá Hành Trình |
| **Stage 1** | Chiếc Thúng Cói Sông Nin | `Xh 1, 22 – 2, 10` | **River Routing & Stealth** | Xoay lá sen đổi dòng nước tránh cá sấu & nấp sậy đưa thúng tới Công chúa |
| **Stage 2** | Bụi Cây Cháy Núi Khô-rép | `Xh 3, 1 – 4, 17` | **Sacred Ground & 3 Signs** | Gom chiên, cởi dép bước trên đất thánh & căn nhịp thực hành 3 dấu lạ |
| **Stage 3** | Đối Diện Pha-ra-ô | `Xh 7, 14 – 9, 35` | **Tactical Staff Channelling** | Né vòng khói ảo thuật & kích hoạt 3 đợt Dấu Lạ phá vỡ Khiên Cứng Lòng |
| **Stage 4** | Ánh Sáng Đất Gô-sen | `Xh 10, 21-29` | **Light-Network Relay** | Đẩy gương đồng & thắp nối 8 Trụ Đèn Dầu đẩy lùi bóng tối dày đặc |
| **Stage 5** | Đêm Lễ Vượt Qua | `Xh 12, 1-36` | **Preparation & Door Marking** | Chuẩn bị bánh không men, cầm gậy & dùng kinh giới bôi máu chiên lên 10 cửa |
| **Stage 6** | Rẽ Nước Biển Đỏ | `Xh 13, 21 – 14, 31` | **Sea Escort & Pillar Defense** | Kích hoạt Gió Đông giữ tường nước cho dân qua & điều khiển Cột Lửa cản chiến xa |
| **Stage 7** | Khúc Ca & Nước Ma-ra | `Xh 15, 1-27` | **Rhythm & Water Purification** | Gõ nhịp trống cơm cùng Mi-ri-am & đặt gỗ thánh thanh lọc hồ nước đắng Ma-ra |
| **Stage 8** | Bánh Mân-na Từ Trời | `Xh 16, 1-35` | **Daily Quota Math & Sun Race** | Tính đúng khẩu phần Ô-me từng lều (ngày thứ 6 gấp đôi) trước khi nắng làm tan |
| **Stage 9** | Đập Đá & Đôi Tay Trên Đồi | `Xh 17, 1-16` | **Rock Strike & Hands Support** | Căn nhịp đập đá mở suối nước & giúp A-ha-rôn – Khua đỡ hai tay Môi-sê giơ cao |
| **Stage 10** | Mười Điều Răn Núi Xi-nai | `Xh 19, 16 – 20, 21` | **Mountain Ascent & 10 Tablets** | Vượt chớp lửa lên đỉnh Xi-nai & ghép đúng thứ tự 10 Điều Răn vào 2 Bia Đá |
| **Stage 11** | Bê Vàng & Lời Chuyển Cầu | `Xh 32; 34, 1-10` | **Idol Purge & Stone Carving** | Dẹp 4 lò khói mê muội bê vàng, đẽo lại 2 Bia Đá mới & cầu bầu nối lại Giao Ước |
| **Stage 12** | Dựng Nhà Tạm Giao Ước | `Xh 35 – 40` | **Sanctuary Assembly Finale** | Lắp đặt 3 khu Nhà Tạm (Chậu Đồng, Đèn 7 Ngọn, Bàn Bánh, Hòm Bia) đón Mây Chúa |
| **Epilogue** | Cuộc Vượt Qua Mới | `Ga 6; 1 Cr 10` | Interactive Reflection | 3 nhịp cầu nối Chiên Vượt Qua – Biển Đỏ – Mân-na – Nhà Tạm với Chúa Giêsu |

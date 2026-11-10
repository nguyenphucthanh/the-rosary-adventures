# KỊCH BẢN NỘI DUNG & GAMEPLAY DESIGN: THE GARDEN OF EDEN (CÔNG TRÌNH TẠO DỰNG & VƯỜN ĐỊA ĐÀNG)

* **Tên game:** *The Garden of Eden* (`modules/the-garden-of-eden`)
* **Kinh Thánh nền tảng:** Sách Sáng Thế, Chương 1 đến Chương 3 (`St 1, 1 – 3, 24`).
* **Vai trò người chơi:** **Lữ khách nhỏ tuổi (Người Tìm Kiếm Đức Tin)** – tiếp nối hành trình sau *The Rosary Adventures*. Một buổi sáng cuối tuần, em mở trang đầu tiên của cuốn Kinh Thánh Cựu Ước và được **Đức Chúa Thánh Thần** (Đấng *"bay lượn trên mặt nước"* từ thuở ban đầu – `St 1, 2`) dẫn đưa ngược dòng thời gian về thuở tạo thiên lập địa để chứng kiến công trình tạo dựng kỳ diệu của Thiên Chúa, niềm hạnh phúc nguyên thủy tại Vườn Địa Đàng, bi kịch Tội Nguyên Tổ của ông bà A-đam – E-va, và ánh sáng hy vọng từ **Tin Mừng Tiên Khởi (`St 3, 15`)**.
* **Vật phẩm tiến trình (Progression Item):** **Cuộn Sách Sáng Thế (12 Ấn Dấu Tạo Dựng & Giao Ước)** – thay cho chuỗi 20 hạt Mân Côi ở phần trước. Hoàn thành mỗi Stage sẽ khắc sáng 1 Ấn Dấu bằng pixel vàng lấp lánh lên Cuộn Sách.
* **Điểm mới nổi bật về Trình bày & Độ khó:**
  1. **🎨 Màn Hình Minh Họa Pixel Art Mở Màn (Stage Intro Pixel Illustration Screen):**
     * Khi bắt đầu mỗi màn chơi, trong lúc hộp thoại dẫn nhập (Intro Dialogue) và câu Lời Chúa chủ đề xuất hiện, vùng màn hình phía trên **không** hiển thị cảnh bản đồ Top-down nhân vật đứng chờ, mà hiển thị một **Bức tranh Minh Họa Pixel Art toàn cảnh (Full-frame Storybook Pixel Illustration)** giàu chi tiết, bố cục tiền cảnh – trung cảnh – hậu cảnh rõ nét, kèm hiệu ứng chuyển động pixel nhẹ (2–4 frames hoặc hạt sáng/nước gợn/mây trôi).
     * Sau khi người chơi đọc xong lời dẫn nhập, bức tranh chuyển cảnh mượt mà (Pixel Wipe / Fade) vào bản đồ Top-down để bắt đầu thử thách.
  2. **🎮 Đa dạng Thể loại Gameplay & Độ thử thách nâng cao:**
     * Mỗi Stage mang một cơ chế (genre) riêng biệt: phản chiếu ánh sáng, né xoáy nước, giải đố lộ trình 1 nét, căn nhịp quỹ đạo, dẫn đàn theo nhịp, chế tác theo trí nhớ, âm nhạc Simon-Says, điều tiết đập nước & quan sát muôn thú, điều khiển 2 nhân vật phối hợp (Co-op Switch), đấu trí phản biện Lời Chúa, mê cung tầm nhìn (Stealth/Line-of-Sight), và hộ tống thắp sáng.
     * Có cơ chế **Thử lại tại Checkpoint (Soft Reset)**: đi sai lộ trình, chạm gai độc, chọn sai lý lẽ hoặc lệch nhịp sẽ lùi về nhịp/checkpoint gần nhất thay vì tự động qua màn, giúp người chơi rèn sự khéo léo và tư duy sau khi đã quen tay ở *The Rosary Adventures*.

* **Cấu trúc chuẩn của mỗi Stage:**
  1. **Dẫn nhập & Câu Lời Chúa chủ đề (Intro Cutscene)**
  2. **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration Screen)** *(Bố cục, Bảng màu, Hiệu ứng chuyển động)*
  3. **Bản đồ Top-Down & Nhân vật xuất hiện**
  4. **Thể loại & Cơ chế Gameplay chi tiết (Genre, Luật chơi, Độ khó / Checkpoint)**
  5. **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro)**

---

# PHẦN 0: KHÚC DẠO ĐẦU (PROLOGUE) – TRANG SÁCH ĐẦU TIÊN & LÀN GIÓ THUỞ BAN ĐẦU

---

### Màn Mở Đầu: Cuộn Sách Cựu Ước & Ngọn Gió Trên Mặt Nước (`St 1, 1-2`; `Tv 104, 24`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Lúc khởi đầu, Thiên Chúa sáng tạo trời đất. Đất còn trống rỗng, chưa có hình dạng, bóng tối bao trùm vực thẳm, và Thần Khí Thiên Chúa bay lượn trên mặt nước."* (`St 1, 1-2`).
  * *Bối cảnh mở màn:* Buổi sáng nắng ấm trong căn phòng nhỏ quen thuộc của Lữ khách. Trên bàn học có đặt chuỗi Mân Côi từ cuộc phiêu lưu trước và một cuốn **Kinh Thánh Trọn Bộ** bìa đỏ viền vàng.
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Cận cảnh đôi bàn tay nhỏ nhắn của Lữ khách đang mở trang đầu tiên của cuốn Kinh Thánh đặt trên bàn gỗ cạnh cửa sổ. Từ trang sách in dòng chữ cổ *"GENESIS – SÁNG THẾ"*, một dải ngân hà pixel xanh thẳm và ánh sáng vàng kim tuôn trào lên, kết thành hình bóng **Chim Bồ Câu Chúa Thánh Thần** đang sải cánh.
  * *Bảng màu:* Gỗ nâu ấm, nắng mai vàng nhạt (`PAL.gold`), tương phản với sắc tím – xanh vũ trụ huyền ảo bay lên từ trang sách.
  * *Hiệu ứng chuyển động:* Các hạt bụi sáng bay lên từ trang giấy, trang sách khẽ rung rinh theo làn gió nhẹ (2-frame loop).
* **Bản đồ Top-Down & Nhân vật:**
  * Căn phòng nhỏ buổi sáng (cửa sổ ngập nắng, chậu cây nhỏ trên bệ cửa, kệ sách, bàn học và góc cầu nguyện).
  * Nhân vật: Lữ khách nhỏ tuổi, Đức Chúa Thánh Thần (Chim Bồ Câu trắng tỏa sáng).
* **Thể loại & Cơ chế Gameplay (Warm-up & Mechanics Refresher):**
  * *Thể loại:* Tương tác khám phá kết hợp mini-puzzle mở khóa.
  * *Nhiệm vụ:*
    1. *Bước 1 – Tưới nước cho chậu cây nhỏ:* Em lấy bình nước tưới cho chậu cây non bên cửa sổ, tự hỏi: *"Ai đã làm nên nắng ấm, nước mát và muôn loài kỳ diệu thế này nhỉ?"*.
    2. *Bước 2 – Mở cuốn Kinh Thánh tại Bàn Học:* Ghép đúng 3 mảnh dấu trang (Bookmark) bị rơi quanh phòng theo thứ tự: **Khởi Đầu $\rightarrow$ Tình Yêu $\rightarrow$ Sáng Tạo** để mở khóa bìa sách Sáng Thế.
    3. *Bước 3 – Bước vào Vực Thẳm Khởi Nguyên:* Chúa Thánh Thần hiện ra bên bàn thờ nhỏ, trao cho em **Cuộn Sách Sáng Thế (0/12 Ấn Dấu)** và mời gọi: *"Con yêu dấu, hôm trước Ta đã dẫn con đi cùng Chúa Giêsu và Mẹ Maria. Hôm nay, hãy đi cùng Ta về thuở ban đầu – nơi Thiên Chúa Cha dựng nên muôn vật bằng Lời quyền năng và Tình yêu của Người!"*.
* **Bài học suy niệm:** Mọi sự trong vũ trụ không tự nhiên ngẫu nhiên mà có, nhưng khởi đi từ tình yêu và sự khôn ngoan của Thiên Chúa.

---

# PHẦN 1: BẢY NGÀY TẠO DỰNG – BẢN GIAO HƯỞNG VŨ TRỤ (`St 1, 1 – 2, 3`)

---

### Stage 1: Ngày Thứ Nhất – Ánh Sáng & Bóng Tối (`St 1, 3-5`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Thiên Chúa phán: 'Hãy có ánh sáng!' Liền có ánh sáng. Thiên Chúa thấy rằng ánh sáng tốt đẹp. Thiên Chúa phân rẽ ánh sáng và bóng tối."* (`St 1, 3-4`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Không gian vũ trụ nguyên thủy bao la đen thẳm; phía dưới là mặt nước vực thẳm tối sẫm gợn sóng. Ngay chính giữa khung hình, một cột sáng vàng trắng chói lọi từ trời cao xé toạc màn đêm chiếu thẳng xuống mặt nước, chia bức tranh thành hai nửa đối lập: bên trái là Bóng Đêm tím than sâu thẳm, bên phải là Ban Ngày rực rỡ sắc vàng – cam – trắng. Chim Bồ Câu Thánh Thần bay lượn ngay điểm giao thoa.
  * *Bảng màu:* Đen tuyền, tím than, xanh đêm, chuyển bậc (stepped bands) sang vàng kim và trắng tinh khiết.
  * *Hiệu ứng chuyển động:* Tia sáng trung tâm nhấp nháy mở rộng 2px theo nhịp, sóng nước bên dưới phản chiếu những vệt pixel vàng lấp lánh.
* **Bản đồ Top-Down & Nhân vật:**
  * Mặt phẳng không gian nguyên thủy lát đá cổ và mặt nước tối, bị bao phủ bởi các vùng **Bóng Tối Đậm Đặc** (sương đen). Ở rìa bắc có **Nguồn Sáng Khởi Nguyên** phát ra tia sáng vàng.
  * Nhân vật: Lữ khách nhỏ tuổi, Chim Bồ Câu Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Prism / Light-Beam Reflection Puzzle (Giải đố xoay và đẩy lăng kính dẫn truyền ánh sáng).**
  * **Cơ chế & Luật chơi:**
    1. Bản đồ được chia làm 3 khu vực nhỏ nối tiếp nhau, mỗi khu vực có các **Trụ Tinh Thể Ánh Sáng** (có thể đẩy trên đường ray đá bằng cơ chế Sokoban và bấm phím `[A]` để xoay hướng phản chiếu $90^\circ$: Bắc – Đông – Nam – Tây).
    2. Tia sáng từ Nguồn Sáng Khởi Nguyên chiếu theo đường thẳng. Khi gặp Trụ Tinh Thể, tia sáng bẻ góc $90^\circ$ và xua tan vùng bóng tối dọc theo đường đi của nó, đồng thời làm hiện ra các bậc đá ẩn dưới nước.
    3. **Thử thách:** Người chơi phải tính toán vị trí đẩy và góc xoay của 6 Trụ Tinh Thể để luồng sáng nối liền một mạch chiếu trúng **3 Đài Nhật Quang (Cột mốc Ban Ngày)** ở cuối bản đồ.
    4. **Độ khó & Checkpoint:** Nếu người chơi bước vào ô Bóng Tối chưa được chiếu sáng hoặc đẩy trụ tinh thể kẹt vào góc tường, màn hình lóe nhẹ và đưa nhân vật + trụ tinh thể của khu vực đó về vị trí Checkpoint đầu khu vực để thử lại.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Khi cả 3 Đài Nhật Quang bừng sáng, màn đêm lùi về một phía tạo thành ranh giới Ngày và Đêm (*"Qua một buổi chiều và một buổi sáng: đó là ngày thứ nhất"*). Ấn Dấu thứ 1 khắc lên Cuộn Sách.
  * *Hoa trái suy niệm:* Chúa là Ánh Sáng thật; đi trong ánh sáng của Chúa giúp chúng ta phân định điều tốt lành và tránh xa bóng tối tội lỗi.

---

### Stage 2: Ngày Thứ Hai – Vòm Trời & Làn Nước (`St 1, 6-8`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Thiên Chúa làm ra cái vòm để phân rẽ nước phía dưới vòm với nước phía trên vòm. Thiên Chúa gọi cái vòm đó là 'trời'."* (`St 1, 7-8`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Khung cảnh đại hồng thủy nguyên sơ đang tách làm đôi theo chiều dọc: phía dưới là biển nước xanh thẳm cuộn sóng bạc đầu; phía trên là những tầng mây trắng khổng lồ đang được nâng bổng lên cao, để lộ ở giữa một **Vòm Trời (Bầu khí quyển)** màu xanh thiên thanh trong vắt với những luồng gió xoáy pixel mềm mại.
  * *Bảng màu:* Xanh đại dương đậm, xanh ngọc bích, xanh da trời sáng và trắng mây.
  * *Hiệu ứng chuyển động:* Những tầng mây phía trên từ từ dâng cao 1–2px, trong khi sóng nước phía dưới vỗ nhịp nhàng sang hai bên.
* **Bản đồ Top-Down & Nhân vật:**
  * Con đường gió lơ lửng giữa hai tầng nước (nước thượng tầng là các đám mây hơi nước nặng trĩu và nước hạ tầng là mặt biển đang dâng trào).
  * Nhân vật: Lữ khách nhỏ tuổi cầm **Còi Gió Khí Quyển**, Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Action-Survival / Wind-Push & Wave Dodge (Hành động né xoáy nước & Điều khiển luồng gió mở vòm trời).**
  * **Cơ chế & Luật chơi:**
    1. Sàn đấu có các **Xoáy Nước Hỗn Mang** di chuyển theo quỹ đạo chéo và các đợt **Sóng Dâng** báo hiệu trước bằng vệt bọt trắng 1.5 giây trước khi ập qua.
    2. Trên bản đồ xuất hiện **8 Khối Mây Nước Nặng** đang chìm xuống làm hẹp không gian. Người chơi phải di chuyển khéo léo tiếp cận từng Khối Mây và nhấn giữ/nhấp phím `[A]` để thổi luồng gió đẩy chúng bay vào **4 Cột Gió Vòm Trời** ở bốn góc bản đồ.
    3. **Độ khó & Checkpoint:** Người chơi có **3 Giọt Bình An (Tương đương 3 tim/lượt chạm)** trong mỗi pha. Nếu bị Xoáy Nước hoặc Sóng Dâng cuốn trúng sẽ mất 1 giọt và bị đẩy lùi; mất hết 3 giọt sẽ bắt đầu lại pha hiện tại (chia làm 2 pha: Pha 1 nâng 4 đám mây nhỏ, Pha 2 nâng 4 đám mây lớn có dòng nước chảy ngược).
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Bốn Cột Gió kích hoạt tạo thành vòm trời xanh biếc bao la và bầu khí quyển trong lành. Ấn Dấu thứ 2 bừng sáng.
  * *Hoa trái suy niệm:* Ngước nhìn bầu trời cao rộng để cảm tạ Chúa đã ban không khí cho muôn loài hít thở mỗi giây phút.

---

### Stage 3: Ngày Thứ Ba – Đất Liền, Biển Cả & Thảo Mộc (`St 1, 9-13`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Thiên Chúa phán: 'Nước phía dưới trời phải tụ lại một nơi, để chỗ khô cạn lộ ra!'... 'Đất phải sinh thảo mộc xanh tươi, cỏ mang hạt giống, và cây trên mặt đất có trái sinh quả tùy theo loại.'"* (`St 1, 9.11`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Từ biển nước mênh mông, những dãy núi đá hùng vĩ và đồng bằng đất nâu trồi lên mạnh mẽ. Ngay trên mặt đất vừa khô ráo, những thảm cỏ xanh mướt, hoa dại đủ màu và những cây ăn quả trĩu trái đỏ mọng đang đâm chồi nảy lộc lan tỏa như một làn sóng sự sống.
  * *Bảng màu:* Nâu đất ấm, xanh lá mạ, xanh lục rừng già, điểm xuyết sắc đỏ và vàng của hoa trái.
  * *Hiệu ứng chuyển động:* Những mầm cây ở tiền cảnh nhú lên từng nấc pixel và nở bung thành bông hoa nhỏ (3-frame animation).
* **Bản đồ Top-Down & Nhân vật:**
  * Quần đảo đất nâu vừa nhô lên khỏi mặt biển xanh, gồm 3 hòn đảo lớn nối với nhau bằng các cầu đá, mặt đất còn trơ trụi chia thành các ô lưới (Tile Grid $16\times16$).
  * Nhân vật: Lữ khách nhỏ tuổi mang **Túi Hạt Giống Khởi Nguyên**, Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **One-Stroke Tile-Stepping / Terraforming Puzzle (Giải đố lộ trình một nét – phủ xanh mặt đất).**
  * **Cơ chế & Luật chơi:**
    1. Trên mỗi hòn đảo là một ma trận các **Ô Đất Trống** xen lẫn các tảng đá cản đường và vũng nước suối.
    2. Mỗi khi người chơi bước qua một Ô Đất Trống, ô đó lập tức mọc lên **Cỏ Hoa & Cây Trái** xanh tốt. Tuy nhiên, người chơi **không được dẫm lên các cây non vừa mọc** (nếu bước đè lên ô đã nở hoa, cây non sẽ bị dập và đảo đó phải giải lại từ đầu!).
    3. Ở Đảo 2 và Đảo 3 xuất hiện thêm cơ chế **Ô Suối Nước (Cầu trượt nước)** đẩy nhân vật trượt thẳng tới khi chạm đá, và **Hạt Giống Đại Thụ** phải được kích hoạt ở đúng ô trung tâm cuối cùng của lộ trình.
    4. **Độ khó & Checkpoint:** Gồm 3 bàn đố tăng dần độ phức tạp (Đảo 1: $5\times5$ cơ bản; Đảo 2: $6\times7$ có đá chặn; Đảo 3: $8\times8$ kết hợp rãnh nước tưới tiêu). Có nút **"Gieo lại đảo này" (`[B]`)** để người chơi chủ động reset đảo nếu đi vào ngõ cụt.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Cả ba hòn đảo bừng nở thành cánh đồng hoa trái ngát hương giữa biển xanh rì rào. Ấn Dấu thứ 3 khắc sáng.
  * *Hoa trái suy niệm:* Yêu quý thiên nhiên, bảo vệ cây cối và biết ơn Chúa qua từng hạt gạo, trái cây nuôi sống chúng ta mỗi ngày.

---

### Stage 4: Ngày Thứ Tư – Mặt Trời, Mặt Trăng & Tinh Tú (`St 1, 14-19`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Thiên Chúa làm ra hai vầng sáng lớn: vầng sáng lớn hơn để điều khiển ngày, vầng sáng nhỏ hơn để điều khiển đêm; Người cũng làm ra các ngôi sao."* (`St 1, 16`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bầu trời vũ trụ chia thành vòng cung hoàng đạo và bốn mùa: một bên là **Mặt Trời** rực lửa vàng cam chiếu nắng ấm xuống cánh đồng mùa hạ; bên kia là **Mặt Trăng lưỡi liềm** bạc dịu dàng cùng hàng ngàn **Ngôi Sao** lấp lánh kết thành các chòm sao chiếu xuống rừng cây mùa thu – đông.
  * *Bảng màu:* Xanh tím vũ trụ, vàng rực rỡ của Mặt Trời, trắng bạc của Mặt Trăng và bốn gam màu Xuân – Hạ – Thu – Đông nơi mặt đất phía dưới.
  * *Hiệu ứng chuyển động:* Các ngôi sao nhấp nháy luân phiên, vành nhật hoa của Mặt Trời và ánh trăng xoay nhẹ.
* **Bản đồ Top-Down & Nhân vật:**
  * Đài Thiên Văn Khởi Nguyên nằm trên đỉnh núi cao chạm tầng mây, ở giữa có **3 Vòng Quỹ Đạo Đồng Tâm** khắc trên mặt đá tinh vân (Vòng trong: Mặt Trời, Vòng giữa: Mặt Trăng, Vòng ngoài: Các Chòm Sao Bốn Mùa).
  * Nhân vật: Lữ khách nhỏ tuổi, Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Orbit Alignment & Rhythm Timing Puzzle (Căn nhịp khóa quỹ đạo thiên thể & Ghép chòm sao).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Ghép Chòm Sao Dẫn Đường:** Người chơi chạy quanh Đài Thiên Văn thu thập **6 Mảnh Tinh Tú** đang rơi xuống (có đếm ngược thời gian tồn tại 8 giây mỗi mảnh) và đặt vào đúng vị trí đối xứng (Mirror Pattern) trên bản đồ sao để thắp sáng bầu trời đêm.
    2. **Pha 2 – Đồng Bộ Quỹ Đạo Ngày – Đêm – Bốn Mùa:** Ba vòng tròn thiên thể (Mặt Trời, Mặt Trăng, Tinh Tú) quay quanh tâm đài với tốc độ và chiều ngược nhau. Người chơi đứng tại **4 Bệ Khóa Thời Gian (Xuân – Hạ – Thu – Đông)** và phải bấm phím `[A]` đúng khoảnh khắc cả 3 thiên thể đi vào **Khung Giao Thoa Vàng** (Timing Window hẹp dần ở mùa thứ 3 và thứ 4).
    3. **Độ khó & Checkpoint:** Nếu bấm lệch nhịp, quỹ đạo bị rung nhẹ và tốc độ xoay đổi chiều, người chơi phải chờ vòng quay tiếp theo để căn lại.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Mặt Trời, Mặt Trăng và muôn sao vào đúng quỹ đạo, ban phát ánh sáng nhịp nhàng cho bốn mùa trên trái đất. Ấn Dấu thứ 4 hoàn tất.
  * *Hoa trái suy niệm:* Biết quý trọng thời gian Chúa ban; sống có giờ giấc, kỷ luật (giờ học tập, giờ nghỉ ngơi, giờ cầu nguyện).

---

### Stage 5: Ngày Thứ Năm – Cá Biển & Chim Trời (`St 1, 20-23`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Thiên Chúa phán: 'Nước phải sinh ra thật nhiều sinh vật lúc nhúc, và chim chóc phải bay lượn trên mặt đất, dưới vòm trời!'"* (`St 1, 20`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bức tranh cắt ngang mặt biển (Split Waterline): nửa dưới là lòng đại dương rực rỡ san hô với chú cá voi xanh khổng lồ, đàn cá heo và từng đàn cá nhỏ đủ sắc màu đang tung tăng bơi lội; nửa trên là vách đá ven biển và bầu trời rộng lớn nơi đại bàng, bồ câu, chim én đang vỗ cánh bay vút lên mây.
  * *Bảng màu:* Xanh ngọc lam (turquoise), san hô hồng – cam, xanh da trời và trắng cánh chim.
  * *Hiệu ứng chuyển động:* Bong bóng nước nổi lên từ dưới đáy biển, đàn chim trên trời vỗ cánh theo nhịp 2 frames.
* **Bản đồ Top-Down & Nhân vật:**
  * Bản đồ kép gồm **Vịnh San Hô Xanh** (nửa dưới) và **Đỉnh Đồi Gió Lộng** (nửa trên).
  * Nhân vật: Lữ khách nhỏ tuổi, Chúa Thánh Thần, cùng các đàn cá và đàn chim non.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Flock Herding & Obstacle Navigation (Điều hướng dẫn đàn vượt chướng ngại vật).**
  * **Cơ chế & Luật chơi:**
    1. **Nửa đầu (Dưới Vịnh San Hô):** Người chơi điều khiển nhân vật bơi dẫn đầu một **Đàn Cá Nhỏ (6 chú cá bơi nối đuôi theo sau nhân vật giống cơ chế Snake/Follow)**. Người chơi phải dẫn đàn cá đi qua mê cung rạn san hô có các **Luồng Nước Xoáy Đẩy Ngược** và **Rặng San Hô Gai** để đưa cả đàn về vùng Biển Rộng. Nếu đi quá sát gai hoặc rẽ gắt vào dòng nước xiết, những chú cá ở cuối hàng sẽ bị tách đàn và người chơi phải quay lại đón.
    2. **Nửa sau (Trên Đỉnh Đồi Gió):** Đàn chim non cần bay qua thung lũng sương mù để lên bầu trời. Người chơi phải chạy dọc các mỏm đá và bật **5 Quạt Gió Thần Khí** theo đúng thứ tự hướng mũi tên để tạo luồng gió nối tiếp nhau đưa đàn chim bay qua vách đá an toàn trước khi gió đổi chiều.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Chúa chúc lành cho muôn loài dưới biển và chim trời: *"Hãy sinh sôi nảy nở cho đầy mặt biển và mặt đất!"*. Ấn Dấu thứ 5 khắc sáng.
  * *Hoa trái suy niệm:* Ngợi khen sự phong phú đầy sức sống của muôn vật và rèn luyện lòng nhân ái, không hành hạ hay phá tổ chim, sinh vật nhỏ bé.

---

### Stage 6: Ngày Thứ Sáu – Muôn Thú & Hình Ảnh Thiên Chúa (`St 1, 24-31`; `St 2, 7`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Thiên Chúa phán: 'Chúng ta hãy làm ra con người theo hình ảnh chúng ta, giống như chúng ta'... Đức Chúa là Thiên Chúa lấy bụi từ đất nặn ra con người, thổi sinh khí vào lỗ mũi, và con người trở nên một sinh vật sống động."* (`St 1, 26; 2, 7`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Giữa thảo nguyên xanh tươi nơi sư tử, chiên con, hươu cao cổ và voi đang chung sống hòa bình, một luồng **Sinh Khí Vàng Trắng** từ trời cao đáp xuống hình hài **A-đam** vừa được nặn từ đất sét đỏ (`Adamah`). Khoảnh khắc sinh khí chạm vào, đôi mắt A-đam mở ra lấp lánh sự sống và trí khôn.
  * *Bảng màu:* Đỏ đất sét ấm, vàng hoàng kim của Sinh Khí Chúa, xanh thảo nguyên và đa sắc màu muôn thú.
  * *Hiệu ứng chuyển động:* Luồng Sinh Khí xoắn ốc lấp lánh bay xuống, ngực của A-đam khẽ nâng lên nhịp thở đầu tiên.
* **Bản đồ Top-Down & Nhân vật:**
  * Thảo Nguyên Sáng Tạo rộng lớn với 4 vùng địa hình (Đồi Đá, Rừng Cây, Đồng Cỏ, Bờ Suối) nơi các loài thú đang chạy nhảy, và ở trung tâm là **Bệ Đất Thánh** nơi hình hài con người đang được tạo tác.
  * Nhân vật: Lữ khách nhỏ tuổi, Chúa Thánh Thần, Muôn thú (Sư tử, Chiên, Hươu, Voi), và **A-đam**.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Memory Recipe & Stealth-Gathering Puzzle (Ghi nhớ công thức & Khéo léo thu thập giữa bầy thú).**
  * **Cơ chế & Luật chơi:**
    1. Để chuẩn bị cho khoảnh khắc trọng đại tạo dựng Con Người – đỉnh cao của muôn loài hữu hình, Chúa Thánh Thần cho người chơi xem một **Bản Đồ Ký Ức (Memory Flash trong 5 giây)** chỉ vị trí ẩn của **4 Tinh Hoa Đất Đỏ (`Adamah`)** tương ứng với 4 phẩm tính: *Trí Khôn, Trái Tim Yêu Thương, Đôi Tay Lao Động, Ý Chí Tự Do*.
    2. Sau 5 giây, các dấu chỉ biến mất. Người chơi phải nhớ đúng vị trí trong 4 vùng địa hình để đi lấy, đồng thời phải **canh nhịp di chuyển của các bầy thú lớn** đang chạy tuần tra (nếu va vào voi hoặc hươu đang chạy nhanh sẽ bị hất lùi về cổng vùng đó).
    3. Sau khi đặt đủ 4 Tinh Hoa Đất Đỏ vào trung tâm theo đúng thứ tự đã hiện ở đầu màn, người chơi thực hiện mini-game **Hội Tụ Hơi Thở Sự Sống**: bấm giữ và nhả phím `[A]` chuẩn xác khi vòng sáng co lại trùng khớp với trái tim để đón Sinh Khí Thiên Chúa thổi vào A-đam!
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * A-đam đứng dậy mỉm cười hiền hậu giữa muôn thú. Thiên Chúa nhìn mọi sự Người đã làm ra: *"Thật là rất tốt đẹp!"* (`St 1, 31`). Ấn Dấu thứ 6 bừng sáng rực rỡ.
  * *Hoa trái suy niệm:* Mỗi người chúng ta đều vô cùng quý giá vì được dựng nên theo **hình ảnh Thiên Chúa**; phải biết tôn trọng phẩm giá bản thân và yêu thương mọi người.

---

### Stage 7: Ngày Thứ Bảy – Ngày Nghỉ Ngơi Thánh Thiêng (`St 2, 1-3`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Ngày thứ bảy, Thiên Chúa đã hoàn thành công việc Người làm... Thiên Chúa ban phúc lành cho ngày thứ bảy và thánh hóa ngày đó."* (`St 2, 2-3`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Toàn cảnh vũ trụ hoàn mỹ trong ánh bình minh vàng dịu của Ngày Thứ Bảy: núi đồi, biển cả, chim trời, cá nước, muôn thú và con người cùng quây quần trên Đồi Thánh Hóa, ngước nhìn lên vòm trời nơi ánh hào quang Ba Ngôi Thiên Chúa tỏa xuống như một mái nhà bình an. Những nốt nhạc ánh sáng bay lên từ khắp muôn loài.
  * *Bảng màu:* Vàng kim thánh thiện, tím pastel bình minh, xanh lục bảo và trắng tinh khôi.
  * *Hiệu ứng chuyển động:* Những nốt nhạc pixel và hạt sáng bay lên nhẹ nhàng từ mặt đất hướng về bầu trời.
* **Bản đồ Top-Down & Nhân vật:**
  * Đồi Thánh Hóa (Sanctuary Hill) tràn ngập hoa nở, xung quanh có **6 Bệ Đàn Thiên Nhiên** đại diện cho công trình của 6 ngày trước: *Chuông Ánh Sáng, Trống Gió Trời, Đàn Cây Cối, Chuông Sao Đêm, Sáo Chim Biển, và Tiếng Ca Con Người (A-đam)*.
  * Nhân vật: Lữ khách nhỏ tuổi, A-đam, Chúa Thánh Thần và muôn loài.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Musical Memory / Simon-Says Harmony Puzzle (Giải đố trí nhớ âm nhạc – Bản giao hưởng Sabát).**
  * **Cơ chế & Luật chơi:**
    1. Để dâng lời tạ ơn Thiên Chúa trong Ngày Thứ Bảy, cả vũ trụ cùng hòa tấu **Bản Giao Hưởng Tạ Ơn** gồm 3 chương (3 vòng thử thách tăng dần độ dài: Vòng 1 = 4 nốt, Vòng 2 = 6 nốt, Vòng 3 = 8 nốt).
    2. Chúa Thánh Thần bay qua đánh sáng và phát âm thanh mẫu lần lượt trên các Bệ Đàn Thiên Nhiên. Người chơi phải ghi nhớ cả **âm thanh lẫn vị trí màu sắc** và điều khiển nhân vật chạy đến gõ lại đúng thứ tự các Bệ Đàn đó trong thời gian quy định.
    3. **Độ khó & Checkpoint:** Ở Vòng 3 (8 nốt), tốc độ phát mẫu nhanh hơn. Nếu gõ sai 1 nốt, bản nhạc dừng lại và phát lại chuỗi mẫu của vòng đó để người chơi lắng nghe kỹ hơn và thử lại.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Khi nốt nhạc thứ 8 vang lên trọn vẹn, toàn bộ bản đồ ngân vang giai điệu thánh ca bình an, hào quang vàng bao phủ muôn vật. Ấn Dấu thứ 7 (khép lại Phần 1) khắc sáng.
  * *Hoa trái suy niệm:* Giữ ngày Chúa Nhật (Ngày của Chúa) thánh thiện; dành thời gian đi lễ, nghỉ ngơi bên gia đình và tạ ơn Chúa sau một tuần học tập, làm việc.

---

# PHẦN 2: VƯỜN ĐỊA ĐÀNG & TỘI NGUYÊN TỔ (`St 2, 4 – 3, 24`)

---

### Stage 8: Bốn Dòng Sông Ê-đen & Đặt Tên Muôn Loài (`St 2, 8-20`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa là Thiên Chúa đem con người đặt vào vườn Ê-đen, để cày cấy và canh giữ đất đai... Đức Chúa là Thiên Chúa dẫn chúng đến với con người xem con người gọi chúng là gì."* (`St 2, 15.19`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Khu vườn Địa Đàng (Ê-đen) tuyệt đẹp nhìn từ trên cao: ở trung tâm là **Cây Sự Sống** tỏa sáng và dòng suối trong vắt tách thành **4 Nhánh Sông Lớn** (Pi-sôn, Ghi-khôn, Hít-đê-ken, Êu-phơ-rát) chảy về bốn phương. Ở tiền cảnh, A-đam đang ngồi bên tảng đá mỉm cười vuốt ve một chú chiên trắng và gọi tên chú chim nhỏ đậu trên tay.
  * *Bảng màu:* Xanh ngọc bích của dòng sông, vàng óng của đá quý Khơ-vi-la, xanh lá tươi mát và sắc hoa rực rỡ.
  * *Hiệu ứng chuyển động:* Bốn dòng sông lấp lánh chảy tỏa ra bốn góc tranh, chú chim nhỏ vỗ cánh hót líu lo.
* **Bản đồ Top-Down & Nhân vật:**
  * Khu vườn Ê-đen rộng lớn với hệ thống kênh đào dẫn nước từ Suối Nguồn Trung Tâm đi bốn hướng và các lùm cây nơi muôn thú đang ẩn mình.
  * Nhân vật: Lữ khách nhỏ tuổi, A-đam, Chúa Thánh Thần, và 6 loài thú trong vườn.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Water-Sluice Logic Puzzle & Animal Observation Matching (Giải đố điều tiết cửa đập nước & Quan sát đặt tên muôn thú).**
  * **Cơ chế & Luật chơi:**
    1. **Pha 1 – Khơi thông 4 Dòng Sông Ê-đen (Cày cấy & Chăm sóc vườn):** Một số rãnh nước bị đá cuội và cành cây khô làm tắc nghẽn khiến các luống cây bị héo. Người chơi phải gạt các **Cần Gạt Đập Nước (Water Gates)** và đẩy các máng gỗ nối dòng để nước từ Suối Nguồn chảy cùng lúc vào đủ cả **4 Nhánh Sông (Pi-sôn, Ghi-khôn, Hít-đê-ken, Êu-phơ-rát)**. (Gạt sai một cửa sẽ làm cạn nhánh bên kia, đòi hỏi tính toán logic phân luồng nước).
    2. **Pha 2 – Cùng A-đam Đặt Tên Muôn Thú:** Khi nước chảy tràn, 6 loài vật xuất hiện nhưng còn rụt rè ẩn sau các bụi cây/hốc đá, chỉ để lộ **dấu chân, tiếng kêu và tập tính di chuyển**. Người chơi phải lần theo dấu chân, quan sát manh mối của từng con vật rồi quay về báo cho A-đam chọn đúng tên gọi và đặc tính của cả 6 loài (không được đoán mò: chọn sai sẽ phải đi quan sát lại dấu vết mới).
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Muôn thú thân thiện quây quần bên A-đam, nhưng A-đam vẫn thoáng chút trầm tư vì giữa muôn vật chưa có một người bạn đồng hành tương xứng. Ấn Dấu thứ 8 khắc sáng.
  * *Hoa trái suy niệm:* Con người được Chúa trao quyền **quản lý và chăm sóc** công trình tạo dựng bằng sự khôn ngoan và trách nhiệm, chứ không phải tàn phá.

---

### Stage 9: Tạo Dựng E-va & Sự Hiệp Thông (`St 2, 18.21-25`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Đức Chúa là Thiên Chúa phán: 'Con người ở một mình thì không tốt; Ta sẽ làm cho nó một trợ tá tương xứng với nó.'... Từ chiếc xương sườn đã lấy nơi con người, Đức Chúa là Thiên Chúa xây dựng thành một người nữ và dẫn đến với con người."* (`St 2, 18.22`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Dưới bóng Cây Sự Sống lung linh hoa trắng, A-đam và **E-va** đứng đối diện nhau, hai bàn tay nắm lấy nhau trong niềm vui vỡ òa. Xung quanh họ là vòng cung ánh sáng vàng ấm áp và đôi chim câu trắng bay song đôi, biểu tượng cho tình gia đình, sự hiệp thông và bình đẳng trong phẩm giá.
  * *Bảng màu:* Hồng phấn ấm áp, vàng ánh nắng, xanh lục dịu và trắng tinh khôi.
  * *Hiệu ứng chuyển động:* Cánh hoa trắng từ Cây Sự Sống rơi chầm chậm qua khung hình, hào quang quanh đôi bàn tay nắm chặt tỏa sáng nhịp nhàng.
* **Bản đồ Top-Down & Nhân vật:**
  * Khu Vườn Đôi (Twin Garden Sanctuaries) được ngăn cách ở giữa bởi một dòng suối pha lê trong vắt, hai bên bờ có các bàn đạp đá đối xứng, cầu rút và các giỏ hoa quả.
  * Nhân vật: Lữ khách nhỏ tuổi (điều khiển cùng A-đam ở bờ Tây và E-va ở bờ Đông), Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Dual-Character Co-op Switch Puzzle (Giải đố phối hợp chuyển đổi 2 nhân vật).**
  * **Cơ chế & Luật chơi:**
    1. Để minh họa chân lý *"Con người ở một mình thì không tốt – cần có người đồng hành trợ giúp"*, màn chơi này **không thể giải nếu chỉ đi một mình**!
    2. Người chơi sử dụng nút **Đổi Nhân Vật (`[B]` hoặc nút Switch trên màn hình)** để luân phiên điều khiển **Nhóm A-đam (Bờ Trái)** và **Nhóm E-va (Bờ Phải)**.
    3. **Thử thách phối hợp 3 bước:**
       * *Bước 1:* Bên A-đam đứng giữ Bàn Đạp Đỏ để hạ chiếc cầu gỗ cho E-va đi qua lấy **Bình Nước Suối Nguồn**.
       * *Bước 2:* E-va đặt Bình Nước lên Ròng Rọc Giữa Suối để chuyển sang bờ bên kia cho A-đam tưới nở **Cầu Hoa Leo**, đồng thời E-va đứng lên Bàn Đạp Xanh mở cổng đá cho A-đam.
       * *Bước 3 – Đồng Tâm Hiệp Lực:* Cả hai bên phải di chuyển qua mê cung hàng rào cây cảnh để cùng bước lên **2 Bệ Ánh Sáng Đối Xứng** trước Cây Sự Sống trong cùng một khoảng thời gian 3 giây (người chơi phải mở đường thông thoáng cho cả hai trước rồi bấm Switch chạy liên tục).
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Cây cầu ánh sáng nối liền hai bờ suối. A-đam reo lên hạnh phúc: *"Phen này, đây là xương bởi xương tôi, thịt bởi thịt tôi!"* (`St 2, 23`). Ấn Dấu thứ 9 khắc sáng.
  * *Hoa trái suy niệm:* Tình yêu thương, sự đoàn kết và nâng đỡ lẫn nhau trong gia đình (giữa cha mẹ, anh chị em) và tình bạn trong sáng.

---

### Stage 10: Con Rắn Xảo Quyệt & Trái Cấm (`St 2, 16-17`; `St 3, 1-7`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Rắn là loài xảo quyệt nhất trong mọi giống vật ngoài đồng... Rắn hỏi người nữ: 'Có thật Thiên Chúa bảo: Các ngươi không được ăn hết mọi cây trong vườn không?'"* (`St 3, 1`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Bầu không khí chuyển sang sắc thái căng thẳng và huyền bí. Ở trung tâm là thân **Cây Biết Lành Biết Dữ** cao lớn; trên cành cây rủ xuống một **Trái Cấm** đỏ thẫm tỏa ánh tím mê hoặc. Quấn quanh thân cây là **Con Rắn** với lớp vảy xanh lục sẫm và đôi mắt vàng sắc lạnh đang thì thầm về phía E-va đang đứng ngập ngừng bên dưới, phía xa là A-đam đang nhìn lại.
  * *Bảng màu:* Tím sẫm ma mị, xanh rêu tối, đỏ thẫm của Trái Cấm đối lập với sắc vàng cảnh báo của Lữ khách và Chim Bồ Câu phía xa.
  * *Hiệu ứng chuyển động:* Lưỡi rắn thè ra thụt vào (2 frames), làn khói tím nghi ngờ lượn lờ quanh Trái Cấm.
* **Bản đồ Top-Down & Nhân vật:**
  * Khoảng sân tròn giữa vườn nơi có **Cây Biết Lành Biết Dữ**. Ánh sáng quanh khu vực này bắt đầu chập chờn vì những làn khói xám của sự dối trá.
  * Nhân vật: Lữ khách nhỏ tuổi, E-va, A-đam, Con Rắn Xảo Quyệt, Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Shield Defense Action & Scripture Truth Debate (Hành động chắn khói độc cám dỗ + Đấu trí vạch trần ngụy biện).**
  * **Cơ chế & Luật chơi:**
    1. Con Rắn tung ra **3 Đợt Cám Dỗ (3 Waves)** nhằm làm lung lạc lòng tin của E-va và A-đam đối với Thiên Chúa.
    2. **Cơ chế Hành Động (Chắn Khói Nghi Ngờ):** Trong mỗi đợt, Con Rắn phóng ra các **Luồng Khói Độc Dối Trá** bay từ nhiều hướng về phía E-va và A-đam. Người chơi cầm **Khiên Ánh Sáng Sự Thật** chạy vòng quanh để hứng và đánh bật các luồng khói đen (đồng thời tránh chạm vào các **Bẫy Hào Nhoáng Giả Tạo** màu tím nổ trên mặt đất).
    3. **Cơ chế Đấu Trí (Phản Biện Lời Chúa):** Sau khi chặn đủ số luồng khói của mỗi đợt, Con Rắn sẽ tung ra một câu ngụy biện xoắn não. Người chơi phải chọn đúng **Sự Thật Lời Chúa** trong 3 lựa chọn gần giống nhau để cảnh tỉnh:
       * *Đợt 1 (Bóp méo lệnh truyền):* Rắn hỏi *"Chúa cấm các ngươi ăn MỌI cây trong vườn phải không?"* $\rightarrow$ Chọn: *"Không! Chúa cho ăn mọi cây, chỉ trừ một cây ở giữa vườn để chúng ta nhớ Chúa là Đấng Tạo Hóa"*.
       * *Đợt 2 (Gieo nghi ngờ lòng tốt của Chúa):* Rắn nói *"Chẳng chết đâu! Chúa sợ các ngươi ăn vào sẽ mở mắt bằng Thiên Chúa đấy!"* $\rightarrow$ Chọn: *"Đó là lời nói dối kiêu ngạo! Mọi ơn lành Chúa đều đã ban vì yêu thương con người"*.
       * *Đợt 3 (Sự hấp dẫn bề ngoài):* Trái cây trông *"ngon lành, đẹp mắt và đáng quý"*.
    4. **Độ khó & Diễn biến Bi Kịch Kinh Thánh:** Nếu người chơi để lọt quá 3 luồng khói độc hoặc chọn sai câu phản biện, đợt đó phải chơi lại. Khi người chơi vượt qua cả 3 đợt để làm tròn bổn phận tiếng nói lương tâm nhắc nhở, một đoạn **Cutscene lịch sử cứu độ** diễn ra: Dù đã nghe lời cảnh báo, nhưng vì sử dụng sai **Tự Do Ý Chí**, E-va và A-đam vẫn đưa tay hái Trái Cấm ăn!
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Ngay khi họ ăn trái cấm, bầu trời Ê-đen tối sầm lại, tiếng sấm rền vang, hoa lá quanh Cây Biết Lành Biết Dữ rụng xuống và mọc lên những bụi gai nhọn. Ấn Dấu thứ 10 (mang vết nứt sám hối) hiện lên trên Cuộn Sách.
  * *Hoa trái suy niệm:* Cám dỗ luôn bắt đầu bằng việc nghi ngờ tình yêu của Chúa và muốn tự làm chủ mà không cần Chúa; hãy tỉnh thức và vâng giữ Lời Chúa.

---

### Stage 11: Trốn Chạy Trong Vườn & Tiếng Chúa Gọi (`St 3, 8-13`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Họ nghe thấy tiếng Đức Chúa là Thiên Chúa đi dạo trong vườn lúc chiều gió thổi, thì con người và vợ mình trốn vào giữa cây cối trong vườn, để khỏi giáp mặt Đức Chúa là Thiên Chúa. Đức Chúa là Thiên Chúa gọi con người và hỏi: 'Ngươi ở đâu?'"* (`St 3, 8-9`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Khu vườn Địa Đàng lúc chiều tà u ám, gió thổi nghiêng ngả những tán cây rậm rạp. Ở tiền cảnh tối tăm đầy bụi gai, A-đam và E-va (đã kết lá vả che thân) đang co ro ngồi nấp sau những gốc cây cổ thụ với vẻ mặt sợ hãi, xấu hổ. Từ phía xa nơi cuối con đường vườn, một **Luồng Sáng Dịu Dàng nhưng Uy Nghiêm** của Thiên Chúa đang chiếu xuyên qua kẽ lá cùng tiếng gọi vang vọng: *"Ngươi ở đâu?"*.
  * *Bảng màu:* Chiều tà tím xám, xanh rêu tối, nâu sẫm của bóng cây, tương phản với tia sáng vàng ấm tìm kiếm của Chúa.
  * *Hiệu ứng chuyển động:* Tán lá cây rung chuyển theo gió chiều, bóng tối đung đưa và tia sáng từ xa quét nhẹ qua khu rừng.
* **Bản đồ Top-Down & Nhân vật:**
  * Mê cung Rừng Chiều Ê-đen chằng chịt bụi gai nhọn, những vùng **Bóng Ma Sợ Hãi / Đổ Lỗi** (Shadow Phantasms) tuần tra dọc các lối đi hẹp, và A-đam – E-va đang ẩn nấp ở hai góc khuất sâu nhất của khu vườn.
  * Nhân vật: Lữ khách nhỏ tuổi cầm **Đèn Lương Tâm**, Chúa Thánh Thần, A-đam và E-va.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Stealth / Line-of-Sight Maze & Dialogue Reconciliation (Mê cung lén lút tránh vùng bóng tối sợ hãi & Tháo gỡ nút thắt đổ lỗi).**
  * **Cơ chế & Luật chơi:**
    1. Sau khi phạm tội, nỗi sợ hãi và xu hướng tự vệ/đổ lỗi tạo thành những **Bóng Tối Hoảng Loạn (có vùng tầm nhìn hình nón màu đỏ/tím – Vision Cones)** đi tuần tra trong mê cung bụi gai, cùng các **Cổng Gai Khép Mở Theo Nhịp**.
    2. Người chơi phải khéo léo căn thời điểm di chuyển ẩn nấp sau các bụi cây, tránh bước vào vùng tầm nhìn (Line-of-Sight) của Bóng Tối Hoảng Loạn và dùng **Đèn Lương Tâm (`[A]`)** mở các chốt khóa ánh sáng để tiếp cận nơi ẩn trốn của A-đam (Góc Bắc) và E-va (Góc Đông).
    3. **Thử thách Mở Lòng Thú Nhận:** Khi tìm thấy A-đam và E-va, họ đang sợ hãi và đổ lỗi (*A-đam đổ tại người nữ, E-va đổ tại con rắn*). Người chơi phải giải một mini-puzzle **Nối Mạch Chân Thành** (sắp xếp lại 4 mảnh suy nghĩ bị rối từ *"Trốn tránh & Đổ lỗi"* $\rightarrow$ *"Can đảm bước ra nhận lỗi trước mặt Chúa"*) để đưa cả hai bước ra khỏi lùm cây rậm rạp đến vùng Ánh Sáng Chúa Gọi.
    4. **Độ khó & Checkpoint:** Nếu bị vùng tầm nhìn của Bóng Tối Hoảng Loạn quét trúng hoặc chạm vào bụi gai đang nhô lên, người chơi bị đưa về Checkpoint khu vực mê cung gần nhất.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * A-đam và E-va cúi đầu bước ra khỏi bóng tối rậm rạp, đứng trước Ánh Sáng của Chúa để nhìn nhận lỗi lầm của mình. Ấn Dấu thứ 11 khắc sáng.
  * *Hoa trái suy niệm:* Khi lỡ phạm lỗi, đừng trốn tránh hay đổ thừa cho người khác; hãy can đảm thưa thật với Chúa (nơi Bí tích Hòa Giải) và xin lỗi cha mẹ, bạn bè.

---

### Stage 12: Rời Vườn Địa Đàng & Lời Hứa Cứu Độ Tiên Khởi (`St 3, 14-24`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Ta sẽ đặt mối thù giữa mi (con rắn) và người nữ, giữa dòng dõi mi và dòng dõi người nữ; dòng dõi đó sẽ đánh vào đầu mi, và mi sẽ rình cắn vào gót chân người."* (`St 3, 15` – **Tin Mừng Tiên Khởi / Protoevangelium**).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Một bức tranh đầy cảm xúc bi tráng nhưng chan chứa hy vọng: Phía bên trái là cổng Vườn Địa Đàng với vị **Thần Hộ Vệ (Cherubim)** cánh vàng uy nghiêm và **Lưỡi Gươm Rực Lửa** xoay bốn phía canh giữ lối vào Cây Sự Sống. Ở trung tâm, A-đam và E-va (đã được chính Thiên Chúa thương tình mặc cho **tấm áo bằng da thú** che chở) đang nắm tay nhau bước ra vùng đất bên ngoài. Nhưng ngay trên bầu trời đêm phía trước mặt họ, hình ảnh tiên báo về **Ngôi Sao Mai (Đức Maria – E-va Mới)** và **Thánh Giá Ánh Sáng (Chúa Giêsu – A-đam Mới)** đã hiện lên dẫn lối.
  * *Bảng màu:* Đỏ cam rực lửa nơi cổng vườn, nâu trầm của vùng đất mới, và vàng kim – xanh thiên thanh hy vọng nơi bầu trời phía Đông.
  * *Hiệu ứng chuyển động:* Lưỡi gươm lửa nơi cổng vườn bập bùng, Ngôi Sao Lời Hứa phía xa tỏa tia sáng dẫn đường.
* **Bản đồ Top-Down & Nhân vật:**
  * Con đường rời cổng phía Đông Vườn Ê-đen dẫn ra vùng đất trần gian nhiều sỏi đá, gai góc và bóng đêm, nơi cuối con đường là **Bàn Thờ Hy Vọng & Cổng Lịch Sử Cứu Độ**.
  * Nhân vật: Lữ khách nhỏ tuổi cầm **Ngọn Đuốc Lời Hứa Cứu Độ (`St 3, 15`)**, A-đam và E-va (mặc áo da), Thần Hộ Vệ Cherubim nơi cổng vườn, Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * **Thể loại:** **Torch-Bearer Escort & Darkness Purge Finale (Hộ tống bằng ánh sáng & Thắp sáng các cột mốc Cứu Độ).**
  * **Cơ chế & Luật chơi:**
    1. Tội lỗi để lại hệ quả là con người phải rời Vườn Địa Đàng và lao động vất vả giữa vùng đất mọc đầy gai góc, nhưng Thiên Chúa **không bỏ rơi con người**: Người mặc áo da cho họ và ban **Lời Hứa Cứu Độ (`St 3, 15`)**.
    2. Người chơi cầm **Ngọn Đuốc Lời Hứa** tạo ra một **Vòng Tròn Ánh Sáng Ấm Áp** xung quanh mình. A-đam và E-va sẽ đi theo sau khi người chơi đứng trong phạm vi gần họ.
    3. **Thử thách Hộ Tống & Giữ Lửa:**
       * Vùng đất bên ngoài tối tăm và lạnh giá; nếu Ngọn Đuốc bị gió đêm thổi yếu đi, vòng sáng sẽ thu hẹp lại. Người chơi phải vừa dẫn A-đam và E-va đi qua các lối mòn an toàn, vừa nhanh chân chạy đi thu thập **Dầu Ân Sủng** và kích hoạt **5 Cột Mốc Tiên Báo Cứu Độ** dọc đường (mỗi cột mốc cần giải một khóa ký hiệu nhanh để bừng sáng và đẩy lùi các **Bóng Rắn Đen** đang rình rập cắn gót chân).
       * **5 Cột Mốc Tiên Báo** kết nối Sáng Thế với bộ game *The Rosary Adventures* trước đó:
         1. *Áo Da Tình Thương:* Dù con người phạm tội, Chúa vẫn chăm sóc và che chở.
         2. *Lời Hứa Người Nữ (`St 3, 15`):* Tiên báo về Đức Trinh Nữ Maria – E-va Mới vâng phục.
         3. *Dòng Dõi Đạp Đầu Con Rắn:* Tiên báo về Đức Chúa Giêsu – Đấng Cứu Thế chiến thắng tội lỗi.
         4. *Lao Động & Sám Hối:* Biến giọt mồ hôi vất vả thành lời cầu nguyện.
         5. *Cây Sự Sống Mới:* Thập Giá Chúa Giêsu sẽ mở lại cửa Thiên Đàng cho nhân loại!
    4. **Độ khó & Checkpoint:** Mỗi Cột Mốc được thắp sáng chính là 1 Checkpoint cố định. Nếu để Bóng Rắn Đen chạm vào A-đam/E-va hoặc để Ngọn Đuốc tắt hẳn trước khi tới cột mốc tiếp theo, nhóm sẽ quay lại Cột Mốc vừa thắp sáng gần nhất.
* **Khoảnh khắc Mầu nhiệm & Bài học suy niệm (Outro):**
  * Khi Cột Mốc thứ 5 bừng sáng tại Bàn Thờ Hy Vọng, bình minh mới ló dạng trên mặt đất. Một chiếc cầu vồng ánh sáng nối từ cổng Ê-đen xưa hướng thẳng tới thành Nazareth (nơi Mẹ Maria sẽ thưa lời *"Xin Vâng"* ở Chặng 1 của *The Rosary Adventures*). Ấn Dấu thứ 12 hoàn tất trọn vẹn **Cuộn Sách Sáng Thế (12/12 Ấn Dấu)**!
  * *Hoa trái suy niệm:* Tội lỗi làm tổn thương con người, nhưng lòng thương xót của Thiên Chúa còn lớn hơn bội phần; Chúa đã hứa và đã sai Chúa Giêsu cùng Mẹ Maria đến cứu chuộc chúng ta.

---

# PHẦN 3: KHÚC VĨ THANH (EPILOGUE) – KHU VƯỜN TÂM HỒN & NGƯỜI QUẢN GIA NHỎ

---

### Màn Kết: Trở Về Phòng Nhỏ – Gìn Giữ Khu Vườn Chúa Trao (`St 2, 15`; `Rm 5, 19`)
* **Dẫn nhập (Intro Cutscene):**
  * *Câu Lời Chúa chủ đề:* *"Vì như bởi sự không vâng phục của một người mà muôn người đã trở thành tội nhân, thì cũng một thể ấy, bởi sự vâng phục của Một Người mà muôn người sẽ trở nên công chính."* (`Rm 5, 19`).
* **🎨 Tranh Minh Họa Pixel Mở Màn (Intro Pixel Illustration):**
  * *Bố cục:* Căn phòng nhỏ của Lữ khách lúc nắng trưa dịu nhẹ. Trên bàn học, cuốn Kinh Thánh mở ở chương Sáng Thế nằm cạnh Chuỗi Mân Côi 20 hạt sáng lấp lánh. Ngoài bệ cửa sổ, chậu cây nhỏ đã nở một bông hoa trắng tinh khôi, và Chim Bồ Câu Chúa Thánh Thần đang đậu trên khung cửa nhìn em âu yếm.
  * *Bảng màu:* Vàng nắng ấm, xanh lá non, nâu gỗ và trắng tinh khiết.
  * *Hiệu ứng chuyển động:* Bông hoa bên cửa sổ khẽ đung đưa trong nắng, hạt sáng vàng bay quanh cuốn Kinh Thánh và Chuỗi Mân Côi.
* **Bản đồ Top-Down & Nhân vật:**
  * Căn phòng nhỏ ấm cúng của Lữ khách.
  * Nhân vật: Lữ khách nhỏ tuổi, Đức Chúa Thánh Thần.
* **Thể loại & Cơ chế Gameplay:**
  * *Thể loại:* Tương tác tổng kết & Thực hành đời sống (Interactive Reflection).
  * *Nhiệm vụ "Ba Cam Kết Của Người Quản Gia Nhỏ":* Chúa Thánh Thần giúp em nhận ra mỗi người hôm nay cũng được Chúa trao cho hai khu vườn để chăm sóc: **Ngôi Nhà Chung Trái Đất** và **Khu Vườn Tâm Hồn**. Người chơi tương tác với 3 góc trong phòng:
    1. *Bên Cửa Sổ & Chậu Cây (Chăm sóc Công trình Tạo Dựng – Phần 1):* Chúa Thánh Thần hỏi: *"Khi nhìn thấy bầu trời, cây cối và muôn loài Chúa dựng nên trong 6 ngày, con sẽ sống thế nào?"* $\rightarrow$ Chọn: *"Tạ ơn Chúa, giữ gìn vệ sinh, tiết kiệm nước – ánh sáng và yêu thương thiên nhiên"*.
    2. *Bên Bàn Học (Thắng vượt cám dỗ & Nhận lỗi chân thành – Phần 2):* Chúa Thánh Thần hỏi: *"Nếu có lúc con bị cám dỗ nói dối, làm biếng hoặc lỡ làm điều sai như ông bà nguyên tổ, con sẽ làm gì?"* $\rightarrow$ Chọn: *"Không trốn tránh hay đổ lỗi, nhưng can đảm xin lỗi Chúa và sửa sai ngay"*.
    3. *Tại Góc Cầu Nguyện (Kết nối Sáng Thế & Mân Côi):* Đặt **Cuộn Sách Sáng Thế (12/12 Ấn Dấu)** cạnh **Chuỗi Mân Côi**. Chúa Thánh Thần mỉm cười: *"Con thấy không? Lời hứa ở cuối Vườn Địa Đàng (`St 3, 15`) đã được thực hiện nơi Chúa Giêsu – A-đam Mới và Mẹ Maria – E-va Mới! Hãy giữ Khu Vườn Tâm Hồn con luôn xanh tươi bằng Lời Chúa mỗi ngày nhé!"*.
* **Hoa trái suy niệm:** Trân trọng công trình tạo dựng của Thiên Chúa, giữ gìn tâm hồn sạch tội và sống vâng phục, cậy trông vào ơn cứu độ của Chúa Giêsu.

---

# BẢNG TỔNG HỢP 12 STAGES & THỂ LOẠI GAMEPLAY (QUICK REFERENCE)

| Màn | Tên Stage | Kinh Thánh | Thể Loại Gameplay (Genre) | Cơ Chế Trọng Tâm |
| :--- | :--- | :--- | :--- | :--- |
| **Prologue** | Trang Sách Đầu Tiên | `St 1, 1-2` | Exploration & Bookmark Puzzle | Ghép dấu trang mở sách Sáng Thế & nhận Cuộn Sách 12 Ấn Dấu |
| **Stage 1** | Ngày 1: Ánh Sáng & Bóng Tối | `St 1, 3-5` | **Prism / Light-Beam Puzzle** | Đẩy & xoay trụ tinh thể $90^\circ$ phản chiếu tia sáng xua tan sương đen |
| **Stage 2** | Ngày 2: Vòm Trời & Làn Nước | `St 1, 6-8` | **Wind-Push & Wave Dodge Action** | Né xoáy nước, dùng còi gió đẩy 8 khối mây nước lên 4 cột vòm trời |
| **Stage 3** | Ngày 3: Đất Liền, Biển & Thảo Mộc | `St 1, 9-13` | **One-Stroke Tile Terraforming** | Giải đố lộ trình 1 nét gieo cỏ hoa phủ kín 3 đảo mà không dẫm lặp lại |
| **Stage 4** | Ngày 4: Mặt Trời, Mặt Trăng & Sao | `St 1, 14-19` | **Orbit Timing & Star Symmetry** | Ghép chòm sao đối xứng & căn nhịp khóa 3 vòng quỹ đạo đồng tâm |
| **Stage 5** | Ngày 5: Cá Biển & Chim Trời | `St 1, 20-23` | **Flock Herding & Wind Routing** | Dẫn đàn cá nối đuôi vượt san hô & chỉnh quạt gió nâng đàn chim bay |
| **Stage 6** | Ngày 6: Muôn Thú & Con Người | `St 1, 24-31; 2, 7` | **Memory Recipe & Timing Craft** | Nhớ vị trí 4 Tinh Hoa Đất Đỏ giữa bầy thú & căn nhịp thổi Sinh Khí |
| **Stage 7** | Ngày 7: Ngày Nghỉ Ngơi Thánh | `St 2, 1-3` | **Musical Simon-Says Harmony** | Nghe và gõ lại chuỗi 4–8 nốt nhạc trên 6 Bệ Đàn Thiên Nhiên |
| **Stage 8** | Bốn Dòng Sông & Đặt Tên Thú | `St 2, 8-20` | **Water-Sluice Logic & Detective** | Gạt đập nước phân luồng 4 nhánh sông & lần dấu chân đặt tên 6 loài thú |
| **Stage 9** | Tạo Dựng E-va & Sự Hiệp Thông | `St 2, 18-25` | **Dual-Character Co-op Switch** | Đổi qua lại giữa 2 bên bờ suối, giữ bàn đạp & chuyền vật phẩm đồng bộ |
| **Stage 10** | Con Rắn Xảo Quyệt & Trái Cấm | `St 3, 1-7` | **Shield Defense & Truth Debate** | Cầm khiên chắn khói độc cám dỗ & chọn đúng Lời Chúa vạch trần ngụy biện |
| **Stage 11** | Trốn Chạy & Tiếng Chúa Gọi | `St 3, 8-13` | **Stealth Line-of-Sight Maze** | Tránh tầm nhìn Bóng Tối Hoảng Loạn trong mê cung gai & gỡ nút đổ lỗi |
| **Stage 12** | Rời Vườn & Lời Hứa Cứu Độ | `St 3, 14-24` | **Torch-Bearer Escort Finale** | Cầm Đuốc Lời Hứa dẫn đường cho A-đam & E-va, thắp sáng 5 cột mốc cứu độ |
| **Epilogue** | Khu Vườn Tâm Hồn | `Rm 5, 19` | Interactive Reflection | 3 cam kết của Người Quản Gia Nhỏ kết nối Sáng Thế & Mân Côi |

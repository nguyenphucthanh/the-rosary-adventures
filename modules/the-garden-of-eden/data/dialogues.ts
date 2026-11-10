/** Bilingual line. The game reads `.vi`; `.en` is kept ready for a language toggle. */
export interface L {
  vi: string;
  en: string;
}
export const tr = (l: L) => l.vi;

export const PROLOGUE = {
  intro: [
    { vi: "“Lúc khởi đầu, Thiên Chúa sáng tạo trời đất. Đất còn trống rỗng, chưa có hình dạng, bóng tối bao trùm vực thẳm, và Thần Khí Thiên Chúa bay lượn trên mặt nước.” (St 1, 1-2)", en: "“In the beginning God created the heavens and the earth. The earth was without form and void, darkness was over the deep, and the Spirit of God was hovering over the waters.” (Gen 1:1-2)" },
    { vi: "Một buổi sáng cuối tuần nắng ấm. Trên bàn học có chuỗi Mân Côi từ cuộc phiêu lưu trước và một cuốn Kinh Thánh bìa đỏ viền vàng.", en: "A warm weekend morning. On the desk lie the Rosary from the last adventure and a red Bible with gold edges." },
    { vi: "Dùng mũi tên / D-pad để đi, nhấn Space hoặc nút A để xem xét.", en: "Use the arrows / D-pad to move, press Space or A to interact." },
  ] as L[],
  canHint: { vi: "[A] Nhặt bình tưới", en: "[A] Pick up the watering can" },
  canPicked: [{ vi: "Bình nước tưới đây rồi! Hãy tưới cho chậu cây non bên cửa sổ nhé.", en: "The watering can! Water the little plant by the window." }] as L[],
  plantNoCan: [{ vi: "Chậu cây non đang khát nước. Em cần một bình tưới!", en: "The little plant is thirsty. You need a watering can!" }] as L[],
  plantWater: [
    { vi: "Em tưới nước, chậu cây vươn lên xanh tươi trong nắng mai.", en: "You water it and the plant stretches up green in the morning sun." },
    { vi: "“Ai đã làm nên nắng ấm, nước mát và muôn loài kỳ diệu thế này nhỉ?”", en: "“Who made the warm sun, the cool water and all these wonderful creatures?”" },
    { vi: "Có ba mảnh dấu trang vừa rơi quanh phòng. Hãy tìm chúng nhé!", en: "Three bookmark pieces have fallen around the room. Find them!" },
  ] as L[],
  deskNotYet: [{ vi: "Cuốn Kinh Thánh bị khóa. Có ba mảnh dấu trang quanh phòng sẽ mở được nó.", en: "The Bible is locked. Three bookmark pieces around the room will open it." }] as L[],
  deskPartial: { vi: "Em có {n}/3 mảnh dấu trang. Hãy tìm nốt nhé!", en: "You have {n}/3 bookmark pieces. Keep looking!" } as L,
  deskStart: { vi: "Ghép ba mảnh dấu trang theo thứ tự. Mảnh nào đứng đầu tiên?", en: "Place the three pieces in order. Which comes first?" } as L,
  deskNext: { vi: "Đúng rồi! Mảnh nào đứng tiếp theo?", en: "Right! Which comes next?" } as L,
  deskWrong: [{ vi: "Mảnh này chưa khớp. Hãy đọc kỹ lời trên mỗi mảnh rồi thử lại từ đầu nhé!", en: "That piece doesn't fit. Read each piece carefully and start again!" }] as L[],
  pieces: [
    { vi: "KHỞI ĐẦU — “Lúc khởi đầu, Thiên Chúa…”", en: "BEGINNING — “In the beginning, God…”" },
    { vi: "TÌNH YÊU — “Thiên Chúa là Tình Yêu.” (1 Ga 4, 8)", en: "LOVE — “God is Love.” (1 Jn 4:8)" },
    { vi: "SÁNG TẠO — “Người dựng nên muôn vật.” (Tv 104, 24)", en: "CREATION — “You made them all.” (Ps 104:24)" },
  ] as L[],
  pieceFound: { vi: "Em nhặt được mảnh dấu trang: ", en: "You found a bookmark piece: " } as L,
  bookOpens: [
    { vi: "Ba mảnh dấu trang ghép lại, tỏa sáng! Bìa sách mở ra, ánh sáng và dải ngân hà tuôn trào từ trang đầu tiên: SÁNG THẾ.", en: "The three pieces join and shine! The cover opens and light and a galaxy pour from the first page: GENESIS." },
  ] as L[],
  spirit: [
    { vi: "Một làn gió nhẹ thổi qua. Chim Bồ Câu trắng tỏa sáng bay ra từ trang sách, đậu bên bàn thờ nhỏ.", en: "A soft breeze. A shining white dove flies from the page and lands by the little altar." },
    { vi: "“Con yêu dấu, hôm trước Ta đã dẫn con đi cùng Chúa Giêsu và Mẹ Maria. Hôm nay, hãy đi cùng Ta về thuở ban đầu – nơi Thiên Chúa Cha dựng nên muôn vật bằng Lời quyền năng và Tình yêu của Người!”", en: "“Dear child, before I led you with Jesus and Mary. Today, come with Me to the very beginning, where God the Father made all things by His mighty Word and Love!”" },
    { vi: "Em nhận được Cuộn Sách Sáng Thế (0/12 Ấn Dấu).", en: "You receive the Genesis Scroll (0/12 Seals)." },
  ] as L[],
  lesson: { vi: "Mọi sự trong vũ trụ không tự nhiên ngẫu nhiên mà có, nhưng khởi đi từ tình yêu và sự khôn ngoan của Thiên Chúa.", en: "Nothing in the universe is by chance; it all begins in God's love and wisdom." } as L,
};

/** Bilingual line. The game reads `.vi`; `.en` is kept ready for a language toggle. */
export interface L {
  vi: string;
  en: string;
}
export const tr = (l: L) => l.vi;

export const PROLOGUE = {
  intro: [
    { vi: "“Nhưng ông Nô-ê được đẹp lòng Đức Chúa... Ông Nô-ê là một người công chính, hoàn hảo giữa những người đồng thời, và ông đi với Thiên Chúa.” (St 6, 8-9)", en: "“But Noah found favor in the Lord's eyes... Noah was a righteous man, blameless among the people of his time, and he walked with God.” (Gen 6:8-9)" },
    { vi: "Một buổi chiều mưa rào vừa tạnh. Trên bàn học có cuốn Kinh Thánh đang mở và một mô hình con tàu gỗ nhỏ chưa lắp xong.", en: "An afternoon shower has just ended. On the desk lie an open Bible and a small wooden ark model, not yet finished." },
    { vi: "Dùng mũi tên / D-pad để đi, nhấn Space hoặc nút A để xem xét.", en: "Use the arrows / D-pad to move, press Space or A to interact." },
  ] as L[],
  windowHint: { vi: "[A] Cửa sổ ướt mưa", en: "[A] Rainy window" } as L,
  windowWipe: [
    { vi: "Em lau khô bệ cửa sổ còn đọng nước mưa. Ngoài trời, mây tan dần và một vệt cầu vồng bảy sắc hiện lên.", en: "You wipe the rain from the sill. Outside the clouds part and a seven-colour rainbow appears." },
    { vi: "“Tại sao sau cơn mưa lớn lại có cầu vồng đẹp thế nhỉ?”", en: "“Why is there such a beautiful rainbow after a big rain?”" },
    { vi: "Ba mảnh gỗ của mô hình tàu vừa rơi quanh phòng. Hãy tìm chúng nhé!", en: "Three pieces of the ark model have fallen around the room. Find them!" },
  ] as L[],
  pieces: [
    { vi: "THÂN TÀU ĐỨC TIN — “Ông Nô-ê đi với Thiên Chúa.”", en: "HULL OF FAITH — “Noah walked with God.”" },
    { vi: "MÁI TÀU VÂNG PHỤC — “Ông làm đúng mọi điều Chúa truyền.”", en: "ROOF OF OBEDIENCE — “He did all that God commanded.”" },
    { vi: "CỬA TÀU CỨU ĐỘ — “Chúa đóng cửa lại sau lưng ông.”", en: "DOOR OF SALVATION — “The Lord shut him in.”" },
  ] as L[],
  pieceFound: { vi: "Em nhặt được mảnh gỗ: ", en: "You found a model piece: " } as L,
  deskNotYet: [{ vi: "Mô hình tàu còn trống. Hãy lau cửa sổ ngắm cầu vồng, rồi tìm ba mảnh gỗ nhé.", en: "The model is empty. Wipe the window and see the rainbow, then find the three pieces." }] as L[],
  deskPartial: { vi: "Em có {n}/3 mảnh gỗ. Hãy tìm nốt nhé!", en: "You have {n}/3 pieces. Keep looking!" } as L,
  deskStart: { vi: "Lắp mô hình từ dưới lên. Mảnh nào đặt đầu tiên?", en: "Build the model from the bottom up. Which piece goes first?" } as L,
  deskNext: { vi: "Đúng rồi! Mảnh nào đặt tiếp theo?", en: "Right! Which piece next?" } as L,
  deskWrong: [{ vi: "Mảnh này chưa khớp. Hãy nghĩ: nền móng, rồi mái, rồi cửa. Thử lại nhé!", en: "That doesn't fit. Think: foundation, then roof, then door. Try again!" }] as L[],
  modelDone: [
    { vi: "Ba mảnh khớp lại! Mô hình Con Tàu Nô-ê sáng lên, và trang Sáng Thế chương 6 tỏa ánh vàng ấm áp.", en: "The three pieces fit! Noah's Ark model glows and the page of Genesis 6 shines warm gold." },
  ] as L[],
  spirit: [
    { vi: "Chim Bồ Câu trắng ngậm nhành ô-liu bay ra từ trang sách, đậu bên mô hình con tàu.", en: "A white dove with an olive branch flies from the page and lands by the ark model." },
    { vi: "“Con yêu dấu, sau khi rời Vườn Địa Đàng, loài người ngày càng đông nhưng nhiều người lại quên Chúa và làm điều xấu. Chỉ có gia đình ông Nô-ê vẫn giữ lòng trong sạch. Hãy đi cùng Ta về thời ông Nô-ê để xem Thiên Chúa cứu độ người công chính và lập Giao Ước Cầu Vồng nhé!”", en: "“Dear child, after leaving Eden, people multiplied, but many forgot God and did evil. Only Noah's family kept hearts pure. Come with Me to Noah's time and see how God saved the righteous and made the Rainbow Covenant!”" },
    { vi: "Em nhận được Hải Đồ Giao Ước (0/8 Ấn Dấu).", en: "You receive the Covenant Sea Chart (0/8 Seals)." },
  ] as L[],
  lesson: { vi: "Giữa một thế giới nhiều cám dỗ, Thiên Chúa luôn nhìn thấu và gìn giữ những ai có tấm lòng ngay thẳng, yêu mến Người.", en: "In a world full of temptation, God sees and keeps those with an upright heart who love Him." } as L,
};

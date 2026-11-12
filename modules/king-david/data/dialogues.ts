/** Bilingual line. `tr` picks the player's current language (shared language toggle). */
import type { L } from "@/modules/shared/i18n";
export type { L };
export { tr } from "@/modules/shared/i18n";

/** Prologue (Tv 23, 1-6): the little room at night, the lamp, the three map pieces, the Holy Spirit. */
export const PROLOGUE = {
  intro: [
    {
      vi: "“Đức Chúa là Mục Tử chăn dắt tôi, tôi chẳng thiếu thốn gì. Trong đồng cỏ xanh tươi, Người cho tôi nằm nghỉ; Người đưa tôi tới dòng nước trong lành và bổ sức cho tâm hồn tôi.” (Tv 23, 1-3)",
      en: "“The Lord is my shepherd; I shall not want. In green pastures he makes me lie down; he leads me beside still waters and restores my soul.” (Ps 23:1-3)",
    },
    {
      vi: "Một buổi tối yên bình trong căn phòng nhỏ của em. Trên bàn học, cuốn Kinh Thánh đang mở ở Sách Sa-mu-en và Thánh Vịnh, bên cạnh một tấm bản đồ cổ vẽ vùng đất Giu-đa đã bị rời thành ba mảnh.",
      en: "A peaceful evening in your little room. On the desk the Bible lies open at Samuel and the Psalms, beside an old map of Judah torn into three pieces.",
    },
    {
      vi: "Dùng mũi tên / D-pad để đi, nhấn Space hoặc nút A để xem xét.",
      en: "Use the arrows / D-pad to move, press Space or A to interact.",
    },
  ] as L[],
  lampHint: { vi: "[A] Ngọn đèn bàn học", en: "[A] Desk lamp" } as L,
  mapHint: { vi: "[A] Bản đồ Bê-lem – Xi-on", en: "[A] Bethlehem – Zion map" } as L,
  lampLit: [
    {
      vi: "Em bật ngọn đèn bàn học. Ánh sáng vàng ấm áp soi rõ tấm bản đồ cổ: từ cánh đồng Bê-lem, qua hoang địa Giu-đa, đến đồi Xi-on Giê-ru-sa-lem.",
      en: "You switch on the desk lamp. Warm golden light shows the old map: from the fields of Bethlehem, through the wilderness of Judah, to Mount Zion in Jerusalem.",
    },
    {
      vi: "Ba mảnh bản đồ đang lấp lánh quanh phòng. Hãy tìm chúng nhé!",
      en: "Three pieces of the map are sparkling around the room. Find them!",
    },
  ] as L[],
  pieces: [
    {
      vi: "ĐỒNG CỎ CHĂN CHIÊN BÊ-LEM — “Đức Chúa nhìn tận đáy lòng.”",
      en: "SHEPHERD PASTURES OF BETHLEHEM — “The Lord looks into the heart.”",
    },
    {
      vi: "HANG ĐÁ HOANG ĐỊA GIU-ĐA — “Linh hồn con ẩn náu nơi Ngài.”",
      en: "WILDERNESS CAVES OF JUDAH — “In you my soul takes refuge.”",
    },
    {
      vi: "THÀNH ĐÔ XI-ON GIÊ-RU-SA-LEM — “Ngai vàng bền vững muôn đời.”",
      en: "CITADEL OF ZION, JERUSALEM — “A throne established forever.”",
    },
  ] as L[],
  pieceFound: { vi: "Em nhặt được mảnh bản đồ: ", en: "You found a map piece: " } as L,
  mapPartial: {
    vi: "Em có {n}/3 mảnh bản đồ. Hãy tìm nốt nhé!",
    en: "You have {n}/3 map pieces. Keep looking!",
  } as L,
  mapStart: {
    vi: "Nối lộ trình cuộc đời Vua Đa-vít theo thứ tự. Hành trình bắt đầu từ nơi nào?",
    en: "Join King David's journey in order. Where did his story begin?",
  } as L,
  mapNext: {
    vi: "Đúng rồi! Chặng tiếp theo Đa-vít đi qua là nơi nào?",
    en: "Right! Where did David's journey lead next?",
  } as L,
  mapWrong: [
    {
      vi: "Chưa đúng thứ tự. Hãy nhớ: khởi đầu từ đồng cỏ Bê-lem, qua thử thách nơi hang đá hoang địa, rồi lên thành đô Xi-on. Thử lại nhé!",
      en: "Not the right order. Remember: start in the pastures of Bethlehem, pass through the wilderness caves, then reach Mount Zion. Try again!",
    },
  ] as L[],
  mapDone: [
    {
      vi: "Ba mảnh bản đồ khớp lại! Con đường từ đồng cỏ Bê-lem qua hoang địa Giu-đa tới đỉnh núi Xi-on bừng sáng, và trang Thánh Vịnh ngân lên giai điệu dịu êm.",
      en: "The three pieces fit! The path from Bethlehem through the Judean wilderness to Mount Zion glows, and the page of Psalms hums a gentle melody.",
    },
  ] as L[],
  spirit: [
    {
      vi: "Chim Bồ Câu trắng bay ra từ trang sách, đậu bên tấm bản đồ. Đó là Chúa Thánh Thần.",
      en: "A white dove flies from the page and lands by the map. It is the Holy Spirit.",
    },
    {
      vi: "“Con yêu dấu, sau khi dân Ít-ra-en có vị vua đầu tiên là Sa-un, vua Sa-un đã kiêu ngạo bất tuân lệnh Chúa. Thiên Chúa bèn sai ngôn sứ Sa-mu-en đến làng nhỏ Bê-lem để tìm một người có tấm lòng ngay thẳng theo ý Chúa. Hãy cùng Ta lên đường gặp cậu bé chăn chiên Đa-vít nhé!”",
      en: "“Dear child, after Israel's first king Saul grew proud and disobeyed God, the Lord sent prophet Samuel to little Bethlehem to find a man after his own heart. Come with Me to meet the shepherd boy David!”",
    },
    {
      vi: "Em nhận được Cây Đàn Hạc Hành Trình (0/12 Ấn Thánh Vịnh).",
      en: "You receive the Journey Harp (0/12 Psalm Seals).",
    },
  ] as L[],
  lesson: {
    vi: "Thiên Chúa là Người Mục Tử nhân lành luôn yêu thương, dẫn dắt và nhìn thấu tấm lòng chân thật của mỗi chúng ta.",
    en: "God is the Good Shepherd who always loves, guides, and sees the true heart of each one of us.",
  } as L,
};

/** Stage 1 (1 Sm 16, 1-13): Pastures of Bethlehem, defending the flock, and the secret anointing by Samuel. */
export const STAGE1 = {
  speaker: "Đồng cỏ Bê-lem",
  intro: [
    {
      vi: "“Đức Chúa phán với ông Sa-mu-en: ‘Đừng nhìn dáng vẻ bên ngoài cũng như vóc dáng cao lớn của nó... Vì Thiên Chúa không nhìn theo kiểu người phàm: người phàm chỉ thấy điều mắt nhìn thấy, còn Đức Chúa thì nhìn tận đáy lòng!’” (1 Sm 16, 7)",
      en: "“The Lord said to Samuel: ‘Do not look on his appearance or on the height of his stature... For the Lord sees not as man sees: man looks on the outward appearance, but the Lord looks on the heart!’” (1 Sam 16:7)",
    },
    {
      vi: "Buổi sáng thanh bình trên cánh đồng Bê-lem. Trong khi cả làng đang dự lễ cùng ngôn sứ Sa-mu-en, cậu út Đa-vít vẫn trung tín chăn giữ đàn chiên của cha ngoài đồng cỏ.",
      en: "A peaceful morning on the fields of Bethlehem. While the village gathers with prophet Samuel, young David faithfully tends his father's flock in the pasture.",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Chào bạn! Sáu chú chiên con đang đi lạc quanh bờ suối, và thú dữ đang rình rập ở bìa rừng. Hãy giúp mình gọi đủ 6 chú chiên về chuồng đá và nhấn [A] dùng gậy/dây ná xua đuổi sư tử, gấu khi chúng lao ra nhé!”",
      en: "David: “Hello friend! Six little lambs have wandered near the stream, and wild beasts are lurking by the woods. Help me call all 6 sheep into the stone pen and press [A] to drive away the lion and bear when they charge!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Chăn chiên ({s}/6) & Xua thú dữ ({p}/3)",
      en: "Part 1/2: Herd sheep ({s}/6) & Drive off beasts ({p}/3)",
    },
    {
      vi: "Pha 2/2: Về nhà ông Giê-sê gặp ngôn sứ Sa-mu-en",
      en: "Part 2/2: Return to Jesse's house to meet Prophet Samuel",
    },
  ] as L[],
  sheepHint: { vi: "[A] Gọi chiên con đi theo", en: "[A] Call the lamb to follow" } as L,
  beastHint: { vi: "[A] Dùng gậy/ná xua thú dữ!", en: "[A] Drive away the beast!" } as L,
  beastRepelled: {
    vi: "Đa-vít dũng cảm xua đuổi thú dữ bảo vệ bầy chiên! (“Đức Chúa đã giải thoát tôi khỏi vuốt sư tử và gấu!” — 1 Sm 17, 37)",
    en: "David bravely drives off the beast to protect the flock! (“The Lord delivered me from the paw of the lion and the bear!” — 1 Sam 17:37)",
  } as L,
  beastScaredSheep: [
    {
      vi: "Ôi, thú dữ làm chiên con hoảng sợ chạy tán loạn! Đừng nản lòng, hãy đứng chắn trước đàn chiên và nhấn [A] khi thú dữ tới gần nhé.",
      en: "Oh, the beast frightened the lambs away! Don't worry—stand in front of the flock and press [A] when the beast comes near.",
    },
  ] as L[],
  callHome: [
    {
      vi: "Đàn chiên đã vào chuồng an toàn! Một gia nhân từ làng Bê-lem vội vã chạy ra gọi: “Đa-vít ơi! Ngôn sứ Sa-mu-en đã nhìn qua cả bảy anh của cậu nhưng Chúa đều không chọn. Ông ấy đang đợi cậu về ngay!” (1 Sm 16, 11)",
      en: "The flock is safe in the pen! A servant from Bethlehem runs out calling: “David! Prophet Samuel has seen all seven of your brothers, yet the Lord chose none of them. He is waiting for you right now!” (1 Sam 16:11)",
    },
    {
      vi: "Cổng đồng cỏ phía Tây đã mở. Hãy cùng Đa-vít về sân nhà ông Giê-sê để gặp ngôn sứ Sa-mu-en nhé!",
      en: "The west pasture gate is open. Walk with David to Jesse's courtyard to meet Prophet Samuel!",
    },
  ] as L[],
  brotherHint: { vi: "[A] Chào anh cả Ê-li-áp", en: "[A] Greet brother Eliab" } as L,
  brotherTalk: [
    {
      vi: "Anh Ê-li-áp và các anh đứng hai bên ngỡ ngàng: “Cậu út Đa-vít vừa từ ngoài đồng chiên về đây sao?”",
      en: "Eliab and the older brothers stand in wonder: “Little David has just come in from tending the sheep!”",
    },
  ] as L[],
  jesseHint: { vi: "[A] Thưa chuyện với cha Giê-sê", en: "[A] Speak with father Jesse" } as L,
  jesseTalk: [
    {
      vi: "Ông Giê-sê hiền từ nói: “Con út yêu quý của cha, hãy tiến lên quỳ trước ngôn sứ Sa-mu-en đi con.”",
      en: "Father Jesse says kindly: “My youngest son, step forward and kneel before Prophet Samuel.”",
    },
  ] as L[],
  samuelHint: { vi: "[A] Đón nhận Dầu Thánh từ ngôn sứ Sa-mu-en", en: "[A] Receive the Holy Anointing from Samuel" } as L,
  anointing: [
    {
      vi: "Đức Chúa phán với ông Sa-mu-en: “Đứng dậy, xức dầu cho nó, vì chính nó đó!” (1 Sm 16, 12)",
      en: "The Lord said to Samuel: “Arise, anoint him, for this is he!” (1 Sam 16:12)",
    },
  ] as L[],
  outro: [
    {
      vi: "Ông Sa-mu-en cầm sừng dầu và xức cho Đa-vít giữa các anh của cậu. Từ ngày đó trở đi, Thần Khí Đức Chúa ngự trên Đa-vít mãnh liệt! (1 Sm 16, 13) Ấn Thánh Vịnh thứ 1 bừng sáng trên Cây Đàn Hạc.",
      en: "Samuel took the horn of oil and anointed David in the midst of his brothers. And the Spirit of the Lord rushed upon David from that day forward! (1 Sam 16:13) The 1st Psalm Seal shines on the Harp.",
    },
  ] as L[],
  lesson: {
    vi: "Thiên Chúa không đánh giá chúng ta qua vẻ bề ngoài hay sự khoe khoang, nhưng Người nhìn vào trái tim khiêm nhường, ngay thẳng và trung tín trong những việc nhỏ bé hằng ngày.",
    en: "God does not judge us by outward appearance or boasting; He looks into a humble, upright heart that is faithful in small daily duties.",
  } as L,
};

/** Stage 2 (1 Sm 16, 14-23): Playing the harp in King Saul's palace to dispel the dark clouds of sorrow. */
export const STAGE2 = {
  speaker: "Vua Sa-un",
  intro: [
    {
      vi: "“Mỗi khi thần dữ của Thiên Chúa nhập vào vua Sa-un, thì Đa-vít lấy đàn mà gảy; vua Sa-un được nhẹ nhàng thoải mái, và thần dữ rời khỏi vua.” (1 Sm 16, 23)",
      en: "“Whenever the harmful spirit from God was upon Saul, David took the lyre and played it with his hand. So Saul was refreshed and was well, and the harmful spirit departed from him.” (1 Sam 16:23)",
    },
    {
      vi: "Tại cung điện Ghi-bơ-a, vua Sa-un đang bị những đám mây u sầu và bất an giày vò. Các cận thần đã mời cậu bé Đa-vít từ Bê-lem vào cung để gảy đàn hạc.",
      en: "In the palace of Gibeah, King Saul is tormented by dark clouds of sorrow and unrest. His servants have summoned young David from Bethlehem to play the harp.",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Ba tầng mây đen u sầu đang vây quanh ngai vua Sa-un! Bạn hãy giúp mình né các luồng khói tím, đi tới từng Điểm Cộng Hưởng Vàng trên sàn đá và nhấn [A] đúng lúc vạch sáng chạm tâm xanh để gảy 3 khúc nhạc bình an nhé!”",
      en: "David: “Three layers of dark sorrow surround King Saul's throne! Help me dodge the purple smoke, step onto each Golden Resonance Pad, and press [A] right as the marker hits the green zone to play 3 melodies of peace!”",
    },
  ] as L[],
  songLabel: {
    vi: "Khúc nhạc bình an {n}/3 — Đứng lên Điểm Vàng & nhấn [A]",
    en: "Melody of Peace {n}/3 — Stand on the Gold Pad & press [A]",
  } as L,
  padHint: { vi: "[A] Gảy Đàn Hạc Bình An", en: "[A] Play the Harp of Peace" } as L,
  barHint: {
    vi: "Nhấn [A] khi vạch sáng vào vùng xanh! ({h}/{need})",
    en: "Press [A] in the green zone! ({h}/{need})",
  } as L,
  songCleared: [
    {
      vi: "Tiếng đàn ngân vang thánh thót! Tầng mây đen thứ nhất tan biến và hai cột đuốc đầu tiên trong đại điện bừng sáng.",
      en: "The harp rings clear and sweet! The first dark cloud dissolves and the first two palace torches blaze with warm light.",
    },
    {
      vi: "Giai điệu Thánh Vịnh lan tỏa! Tầng mây đen thứ hai lùi xa, ánh sáng ấm áp tràn ngập gian giữa cung điện.",
      en: "The Psalm melody spreads! The second dark cloud retreats and warm light fills the middle of the hall.",
    },
    {
      vi: "Khúc nhạc cuối cùng hoàn tất! Toàn bộ bóng tối u sầu tan biến khỏi ngai vàng!",
      en: "The final melody is complete! All the dark clouds of sorrow vanish from the throne!",
    },
  ] as L[],
  hitSmoke: [
    {
      vi: "Luồng khói u sầu quá dày đặc! Hãy giữ bình tĩnh và thử lại khúc nhạc này nhé.",
      en: "The smoke of sorrow was too thick! Stay calm and try this melody again.",
    },
  ] as L[],
  outro: [
    {
      vi: "Tiếng đàn cầu nguyện trong trẻo của Đa-vít xua tan hoàn toàn bóng tối u ám; gương mặt vua Sa-un giãn ra nhẹ nhõm, bình an. Vua Sa-un rất thương mến Đa-vít và cho cậu làm người hầu cận. (1 Sm 16, 21-23) Ấn Thánh Vịnh thứ 2 thắp sáng.",
      en: "David's prayerful harp melody completely dispels the gloom; King Saul's face relaxes in peace and relief. Saul loved David greatly and made him his armour-bearer. (1 Sam 16:21-23) The 2nd Psalm Seal lights up.",
    },
  ] as L[],
  lesson: {
    vi: "Lời cầu nguyện, thánh ca và thái độ dịu dàng của chúng ta có sức mạnh đem lại sự bình an của Chúa cho những người đang buồn phiền, lo âu quanh mình.",
    en: "Our prayers, sacred songs, and gentle kindness have the power to bring God's peace to those around us who are sad or anxious.",
  } as L,
};

/** Stage 3 (1 Sm 17, 1-51): The Valley of Elah, picking 5 smooth river pebbles, and defeating Giant Goliath. */
export const STAGE3 = {
  speaker: "Thung lũng Ê-la",
  intro: [
    {
      vi: "“Đa-vít nói với người Phi-li-tinh: ‘Ngươi đến với ta bằng gươm, bằng giáo, bằng lao; còn ta, ta đến với ngươi nhân danh Đức Chúa các đạo binh... để toàn thể đại hội này biết rằng không phải bằng gươm bằng giáo mà Đức Chúa ban chiến thắng!’” (1 Sm 17, 45.47)",
      en: "“David said to the Philistine: ‘You come to me with a sword and with a spear and with a javelin, but I come to you in the name of the Lord of hosts... that all this assembly may know that the Lord saves not with sword and spear!’” (1 Sam 17:45.47)",
    },
    {
      vi: "Tại thung lũng Ê-la, người khổng lồ Gô-li-át mặc giáp đồng suốt bốn mươi ngày đứng thách thức đạo quân Ít-ra-en. Vâng lời cha Giê-sê, cậu bé Đa-vít mang bánh đến thăm các anh ngoài mặt trận.",
      en: "In the Valley of Elah, the bronze-armoured giant Goliath has defied the ranks of Israel for forty days. Obeying his father Jesse, young David brings bread to his brothers at the camp.",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Trước khi ra trận, mình cần giao giỏ bánh của cha cho anh cả Ê-li-áp ở lều trại, thưa chuyện với vua Sa-un, rồi xuống dòng suối nhặt đúng 5 Viên Đá Cuội Nhẵn Phát Sáng (đừng nhặt đá xám sần sùi nhé)!”",
      en: "David: “Before stepping onto the field, let's bring father's bread basket to brother Eliab at the camp, speak with King Saul, and then go down to the brook to pick 5 Glowing Smooth Pebbles (avoid the rough grey stones)!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Giao bánh cho anh, gặp vua Sa-un & nhặt {s}/5 viên đá cuội nhẵn",
      en: "Part 1/2: Deliver bread, speak to Saul & pick {s}/5 smooth pebbles",
    },
    {
      vi: "Pha 2/2: Quyết đấu Gô-li-át ({h}/3 viên đá trúng đích)",
      en: "Part 2/2: Face Giant Goliath ({h}/3 sling hits)",
    },
  ] as L[],
  eliabHint: { vi: "[A] Giao giỏ bánh cho anh Ê-li-áp", en: "[A] Deliver bread to brother Eliab" } as L,
  eliabTalk: [
    {
      vi: "Đa-vít trao giỏ bánh mì và lúa rang cho anh cả Ê-li-áp và hỏi thăm các anh ngoài chiến tuyến. (1 Sm 17, 22)",
      en: "David hands the loaves and parched grain to his brother Eliab and greets his brothers at the battle line. (1 Sam 17:22)",
    },
  ] as L[],
  saulHint: { vi: "[A] Thưa chuyện với vua Sa-un", en: "[A] Speak with King Saul" } as L,
  saulTalk: [
    {
      vi: "Đa-vít thưa với vua Sa-un: “Xin đừng ai vì tên Phi-li-tinh ấy mà mất can đảm! Tôi tớ ngài sẽ đi giao chiến với hắn.” Vua Sa-un cho Đa-vít mặc thử bộ giáp đồng nặng nề, nhưng Đa-vít xin cởi ra vì không quen, chỉ cầm cây gậy và chiếc dây ná chăn chiên! (1 Sm 17, 32.38-40)",
      en: "David said to Saul: “Let no man's heart fail because of him! Your servant will go and fight with this Philistine.” Saul clothed David with heavy bronze armour, but David took it off, taking only his staff and shepherd's sling! (1 Sam 17:32.38-40)",
    },
    {
      vi: "Giờ hãy bước xuống dòng suối Ê-la và chọn đủ 5 Viên Đá Cuội Nhẵn lấp lánh nhé!",
      en: "Now step down to the brook of Elah and pick 5 sparkling Smooth Pebbles!",
    },
  ] as L[],
  pebbleHint: { vi: "[A] Nhặt viên đá cuội nhẵn", en: "[A] Pick smooth pebble" } as L,
  roughHint: { vi: "[A] Xem hòn đá", en: "[A] Check stone" } as L,
  roughMsg: {
    vi: "Hòn đá này góc cạnh sần sùi quá, không bay chuẩn trên dây ná được. Hãy tìm những viên đá cuội trắng nhẵn lấp lánh dưới suối nhé!",
    en: "This stone is too jagged and rough for a sling. Look for the sparkling smooth white pebbles in the stream!",
  } as L,
  pebblesReady: [
    {
      vi: "Đã chọn đủ 5 viên đá cuội nhẵn bỏ vào túi chăn chiên! Rào chắn xuống đấu trường thung lũng Ê-la đã mở.",
      en: "All 5 smooth pebbles are in the shepherd's pouch! The gate to the Valley of Elah arena is open.",
    },
    {
      vi: "Hãy né các làn sóng chấn động đỏ khi Gô-li-át đập giáo xuống đất. Ngay khi hắn vừa đập giáo xong và hạ khiên nghỉ lấy đà (vòng sáng vàng hiện trên trán hắn), hãy nhấn [A] để quay dây ná và nhấn [A] lần nữa đúng vạch xanh để bắn đá trúng đích!",
      en: "Dodge the red shockwaves when Goliath slams his spear. Right after his slam, when he lowers his shield to recover (a gold ring glows on his forehead), press [A] to spin your sling and press [A] again in the green zone!",
    },
  ] as L[],
  slingHint: { vi: "[A] Quay dây ná bắn đá!", en: "[A] Spin the sling and fire!" } as L,
  slingBarHint: {
    vi: "Nhấn [A] đúng vạch xanh để bắn viên đá đức tin!",
    en: "Press [A] in the green zone to fire the stone of faith!",
  } as L,
  goliathHit: [
    {
      vi: "Viên đá thứ nhất bay vút làm khiên đồng của Gô-li-át rung chuyển! “Không phải bằng gươm bằng giáo mà Đức Chúa ban chiến thắng!”",
      en: "The first stone flies true, rattling Goliath's bronze shield! “The Lord saves not with sword and spear!”",
    },
    {
      vi: "Viên đá thứ hai trúng mũ đồng làm Gô-li-át loạng choạng! Chỉ còn một cú bắn quyết định nữa thôi!",
      en: "The second stone strikes the bronze helmet, staggering Goliath! Only one decisive shot left!",
    },
    {
      vi: "Viên đá cuội bay thẳng trúng trán khiến người khổng lồ Gô-li-át ngã sấp xuống đất! (1 Sm 17, 49)",
      en: "The smooth pebble strikes squarely into his forehead, and Giant Goliath falls face down to the ground! (1 Sam 17:49)",
    },
  ] as L[],
  bossRetry: [
    {
      vi: "Đòn giáo chấn động của Gô-li-át mạnh quá! Đừng sợ, Đức Chúa ở cùng chúng ta. Hãy thử lại Pha 2 nhé!",
      en: "Goliath's spear shockwave was fierce! Do not fear, the Lord is with us. Let's try Part 2 again!",
    },
  ] as L[],
  outro: [
    {
      vi: "Đa-vít đã thắng người Phi-li-tinh bằng một cái dây ná và một hòn đá, nhân danh Đức Chúa các đạo binh! Toàn quân Ít-ra-en reo hò vang dậy khắp thung lũng Ê-la. (1 Sm 17, 50-52) Ấn Thánh Vịnh thứ 3 (khép lại Hồi 1) bừng sáng!",
      en: "So David prevailed over the Philistine with a sling and with a stone, in the name of the Lord of hosts! All Israel shouted with joy across the Valley of Elah. (1 Sam 17:50-52) The 3rd Psalm Seal shines bright!",
    },
  ] as L[],
  lesson: {
    vi: "Khi gặp những thử thách hay nỗi sợ hãi to lớn như người khổng lồ Gô-li-át trong cuộc sống, đừng cậy vào sức riêng hay nản lòng, nhưng hãy cầu nguyện và tiến bước nhân danh Chúa.",
    en: "When facing giant challenges or fears in life like Goliath, do not rely on your own strength or lose heart, but pray and step forward in the name of the Lord.",
  } as L,
  cutscene: [
    {
      vi: "Khúc Ca Chiến Thắng & Bóng Tối Đố Kỵ: Khi đoàn quân khải hoàn trở về, phụ nữ các thành Ít-ra-en múa hát tung hô: “Sa-un hạ được hàng ngàn, Đa-vít hạ được hàng vạn!” (1 Sm 18, 7)",
      en: "Song of Victory & Shadow of Envy: As the army returned in triumph, the women of Israel sang and danced: “Saul has struck down his thousands, and David his ten thousands!” (1 Sam 18:7)",
    },
    {
      vi: "Câu hát ấy khiến vua Sa-un nổi giận và sinh lòng đố kỵ sâu sắc với Đa-vít. Nhưng giữa cơn bão ganh ghét nơi hoàng cung, Thiên Chúa đã ban cho Đa-vít một người bạn tri kỷ tuyệt vời — chính là Hoàng tử Giô-na-than...",
      en: "Those words made King Saul angry and deeply envious of David. Yet amid the storm of jealousy in the palace, God gave David a wonderful true friend — Prince Jonathan...",
    },
  ] as L[],
};

/** Stage 4 (1 Sm 18, 1-4; 20, 1-42): Jonathan's covenant of friendship, escaping palace guards, and reading the 3 signal arrows at the stone Ezel. */
export const STAGE4 = {
  speaker: "Hoàng tử Giô-na-than",
  intro: [
    {
      vi: "“Tâm hồn ông Giô-na-than gắn bó với tâm hồn Đa-vít, và ông Giô-na-than yêu mến Đa-vít như chính mạng sống mình... Ông Giô-na-than nói với Đa-vít: ‘Bạn hãy đi bình an, vì chúng ta đã nhân danh Đức Chúa mà thề rằng: Đức Chúa sẽ ở giữa tôi và bạn đến muôn đời!’” (1 Sm 18, 1; 20, 42)",
      en: "“The soul of Jonathan was knit to the soul of David, and Jonathan loved him as his own soul... Jonathan said to David: ‘Go in peace, because we have sworn both of us in the name of the Lord, saying: The Lord shall be between me and you forever!’” (1 Sam 18:1; 20:42)",
    },
    {
      vi: "Vì lòng đố kỵ, vua Sa-un sai lính canh gác tìm bắt Đa-vít. Nhưng Hoàng tử Giô-na-than đã kết ước tình bạn thánh với Đa-vít và hẹn bắn ba mũi tên báo hiệu ngoài cánh đồng đá Ê-den.",
      en: "Out of envy, King Saul posts guards to seize David. But Prince Jonathan makes a sacred covenant of friendship with David and promises to shoot three signal arrows in the field by the stone Ezel.",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Ở Pha 1, bạn hãy giúp mình nhận Áo Choàng & Cung Tên kết nghĩa từ Hoàng tử Giô-na-than, rồi khéo léo vượt qua các toán lính tuần tra (tránh vùng đèn đỏ) để ra cổng thành. Sang Pha 2 ngoài cánh đồng Ê-den, hãy đi qua đúng lối có Mũi Tên Vàng của Giô-na-than nhé!”",
      en: "David: “In Part 1, help me receive the Robe & Bow of friendship from Prince Jonathan, then slip past the patrolling guards (avoid red zones) to the city gate. In Part 2 out on the field of Ezel, pass through the lane marked by Jonathan's Golden Arrow!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Nhận kỷ vật của Giô-na-than & vượt lính canh ra cổng thành",
      en: "Part 1/2: Receive Jonathan's gifts & slip past the guards to the gate",
    },
    {
      vi: "Pha 2/2: Đi theo Mũi Tên Vàng báo hiệu ({a}/3) đến Tảng Đá Ê-den",
      en: "Part 2/2: Follow the Golden Signal Arrows ({a}/3) to the Stone Ezel",
    },
  ] as L[],
  covenantHint: { vi: "[A] Nhận Áo Choàng & Cung Tên kết nghĩa", en: "[A] Receive the Robe & Bow of friendship" } as L,
  covenantTalk: [
    {
      vi: "Hoàng tử Giô-na-than cởi chiếc áo choàng đang mặc trao cho Đa-vít, cùng với chiến bào, gươm, cây cung và đai lưng của mình. (1 Sm 18, 4)",
      en: "Prince Jonathan stripped himself of the robe that was on him and gave it to David, and his armour, and even his sword and his bow and his belt. (1 Sam 18:4)",
    },
    {
      vi: "Giô-na-than dặn: “Hãy cẩn thận vượt qua lính canh của vua cha để ra cánh đồng. Sáng mai tôi sẽ bắn 3 mũi tên mật hiệu chỉ lối an toàn cho bạn!”",
      en: "Jonathan whispers: “Slip past my father's guards to the open field. At dawn I will shoot 3 signal arrows to show you the safe path!”",
    },
  ] as L[],
  spotted: [
    {
      vi: "Lính tuần tra của vua Sa-un đã phát hiện! Hãy chờ lính canh đi qua rồi mới băng qua hành lang nhé.",
      en: "King Saul's patrol spotted you! Wait for the guard to move away before crossing the corridor.",
    },
  ] as L[],
  fieldIntro: [
    {
      vi: "Đã thoát ra tới cánh đồng đá Ê-den! Phía trước có 3 dải bụi gai, mỗi dải có 3 lối đi (Trên, Giữa, Dưới). Hãy nhìn xem Mũi Tên Vàng của Giô-na-than cắm ở lối nào thì đi qua lối đó; đừng đi vào lối có dấu đỏ phục kích!",
      en: "You reached the field of Ezel! Ahead lie 3 hedgerows, each with 3 passages (Top, Middle, Bottom). Watch where Jonathan's Golden Arrow lands and walk through that passage; avoid the red ambush lanes!",
    },
  ] as L[],
  wrongLane: [
    {
      vi: "Lối đó có lính phục kích của Sa-un! Hãy quan sát vị trí Mũi Tên Vàng lấp lánh của Giô-na-than để đi đúng lối an toàn nhé.",
      en: "Saul's ambush is in that lane! Look for Jonathan's sparkling Golden Arrow to pick the safe passage.",
    },
  ] as L[],
  ezelHint: { vi: "[A] Từ biệt Hoàng tử Giô-na-than bên Tảng Đá Ê-den", en: "[A] Bid farewell to Prince Jonathan by the Stone Ezel" } as L,
  farewell: [
    {
      vi: "Đa-vít bước ra khỏi chỗ nấp bên Tảng Đá Ê-den, cúi lạy ba lần. Hai người bạn ôm nhau khóc nói lời từ biệt trong lời thề trung tín trước mặt Đức Chúa. (1 Sm 20, 41-42)",
      en: "David rose from beside the stone mound Ezel and bowed three times. The two friends kissed one another and wept together, bound by their oath before the Lord. (1 Sam 20:41-42)",
    },
  ] as L[],
  outro: [
    {
      vi: "Ông Giô-na-than nói với Đa-vít: “Bạn hãy đi bình an, vì chúng ta đã nhân danh Đức Chúa mà thề rằng: Đức Chúa sẽ ở giữa tôi và bạn, giữa dòng dõi tôi và dòng dõi bạn đến muôn đời!” (1 Sm 20, 42) Ấn Thánh Vịnh thứ 4 thắp sáng.",
      en: "Jonathan said to David: “Go in peace, because we have sworn both of us in the name of the Lord: The Lord shall be between me and you, and between my offspring and your offspring, forever!” (1 Sam 20:42) The 4th Psalm Seal lights up.",
    },
  ] as L[],
  lesson: {
    vi: "Một người bạn tốt lành và chân thành là món quà quý giá Chúa ban: Giô-na-than dù là thái tử nhưng không hề ganh tị với Đa-vít, luôn bảo vệ bạn và đặt thánh ý Chúa lên trên hết.",
    en: "A true and faithful friend is a precious gift from God: though a crown prince, Jonathan never envied David, protecting his friend and putting God's will first.",
  } as L,
};

/** Stage 5 (1 Sm 21, 1-7; 22, 1-5; Tv 57): Sacred Bread at Nob and caring for the poor in the Cave of Adullam. */
export const STAGE5 = {
  speaker: "Hang A-đu-lam",
  intro: [
    {
      vi: "“Đa-vít rời khỏi đó và trốn vào hang A-đu-lam... Mọi người lâm cảnh túng cực, mọi người mắc nợ và mọi người bất mãn đều tụ họp quanh ông, và ông trở thành thủ lãnh của họ... Lạy Thiên Chúa, xin thương xót con, vì linh hồn con ẩn náu nơi Ngài!” (1 Sm 22, 1-2; Tv 57, 2)",
      en: "“David departed from there and escaped to the cave of Adullam... And everyone who was in distress, and everyone who was in debt, and everyone who was bitter in soul gathered to him... Be merciful to me, O God, for in you my soul takes refuge!” (1 Sam 22:1-2; Ps 57:1)",
    },
    {
      vi: "Trên đường trốn chạy vào hoang địa, Đa-vít ghé Đền Thánh tại thành Nóp nhận Bánh Tiến từ tư tế A-khi-me-léc, rồi đón cha mẹ già và những người nghèo khổ vào ẩn náu trong hang đá A-đu-lam.",
      en: "Fleeing into the wilderness, David stops at the sanctuary of Nob to receive consecrated bread from priest Ahimelech, then shelters his elderly parents and the poor inside the Cave of Adullam.",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Trước hết, mình hãy xin Bánh Tiến Thánh từ tư tế A-khi-me-léc ở Đền Nóp. Sau đó vào trong hang A-đu-lam, hãy thắp sáng đủ 6 Đống Lửa Trại, chia bánh cho 3 Nhóm Gia Đình đang đói lạnh và gảy đàn hát Thánh Vịnh 57 ở Bệ Đá Trung Tâm nhé!”",
      en: "David: “First, let's receive the Sacred Bread from priest Ahimelech at Nob. Then inside the Cave of Adullam, light all 6 Campfires, share bread with the 3 hungry Family Groups, and play Psalm 57 on the central stone!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Nhận Bánh Tiến Thánh từ tư tế A-khi-me-léc tại Đền Nóp",
      en: "Part 1/2: Receive the Sacred Bread from Priest Ahimelech at Nob",
    },
    {
      vi: "Pha 2/2: Lửa trại ({f}/6) • Chia bánh ({b}/3) • Đàn Thánh Vịnh ({h}/1)",
      en: "Part 2/2: Campfires ({f}/6) • Share bread ({b}/3) • Psalm Harp ({h}/1)",
    },
  ] as L[],
  priestHint: { vi: "[A] Xin Bánh Tiến Thánh từ tư tế A-khi-me-léc", en: "[A] Receive Sacred Bread from Priest Ahimelech" } as L,
  priestTalk: [
    {
      vi: "Tư tế A-khi-me-léc cảm thương Đa-vít và những người đi cùng đang đói lả, bèn trao cho ông 5 chiếc Bánh Tiến Thánh vừa dọn khỏi bàn thờ Đức Chúa. (1 Sm 21, 7; Mc 2, 25-26)",
      en: "Moved with compassion for David and his hungry men, priest Ahimelech gave him the consecrated bread of the Presence just taken from the table of the Lord. (1 Sam 21:6; Mk 2:25-26)",
    },
    {
      vi: "Cửa hang đá A-đu-lam đã mở! Hãy vào sưởi ấm và chăm sóc cho cha mẹ cùng những người nghèo khổ đang đợi bên trong nhé.",
      en: "The entrance to the Cave of Adullam is open! Go inside to warm and care for David's parents and the distressed families waiting within.",
    },
  ] as L[],
  fireHint: { vi: "[A] Thắp sáng đống lửa trại", en: "[A] Light the campfire" } as L,
  breadHint: { vi: "[A] Chia sẻ Bánh Thánh cho gia đình", en: "[A] Share bread with the family" } as L,
  familyThanks: [
    {
      vi: "Cha mẹ Đa-vít: “Cảm ơn con! Có ánh lửa ấm và bánh ăn, cha mẹ yên lòng lắm.”",
      en: "David's parents: “Thank you, my son! With warm fire and bread, our hearts are at peace.”",
    },
    {
      vi: "Người nghèo khổ: “Cảm ơn thủ lãnh Đa-vít! Trong hang tối này chúng tôi đã tìm thấy một mái nhà yêu thương.”",
      en: "Poor family: “Thank you, David! In this dark cave we have found a loving home.”",
    },
    {
      vi: "Người lữ khách: “Bánh này giúp chúng tôi hồi sức. Xin Đức Chúa chúc lành cho ông!”",
      en: "Weary traveller: “This bread restores our strength. May the Lord bless you!”",
    },
  ] as L[],
  psalmHint: { vi: "[A] Gảy đàn hát Thánh Vịnh 57 khích lệ toàn trại", en: "[A] Play Psalm 57 on the harp to encourage the camp" } as L,
  psalmSing: [
    {
      vi: "Đa-vít gảy cây đàn hạc, cất tiếng hát vang giữa hang đá: “Lạy Thiên Chúa, lòng con kiên vững, lòng con kiên vững; con nguyện đàn hát xướng ca! Hỡi hồn tôi, thức dậy đi! Hỡi đàn sắt đàn cầm, thức dậy đi! Tôi muốn đánh thức cả bình minh!” (Tv 57, 8-9)",
      en: "David plucks his harp and sings aloud in the cave: “My heart is steadfast, O God, my heart is steadfast! I will sing and make melody! Awake, my glory! Awake, O harp and lyre! I will awake the dawn!” (Ps 57:7-8)",
    },
  ] as L[],
  outro: [
    {
      vi: "Từ những con người nghèo khổ, sợ hãi ban đầu, nhờ tình thương và lời cầu nguyện Thánh Vịnh của Đa-vít, hang A-đu-lam đã bừng sáng ấm áp thành cộng đoàn gắn bó trung kiên. Ấn Thánh Vịnh thứ 5 thắp sáng.",
      en: "From frightened, distressed people at the start, through David's compassion and Psalm prayers, the Cave of Adullam glows warm as a united community of faith. The 5th Psalm Seal lights up.",
    },
  ] as L[],
  lesson: {
    vi: "Khi chính mình gặp khó khăn, đừng khép kín trong nỗi buồn riêng, nhưng hãy mở lòng nâng đỡ, chia sẻ với những người nghèo khổ hơn mình và luôn ca tụng Chúa trong mọi hoàn cảnh.",
    en: "When facing hardship yourself, do not close in on your own sorrow; open your heart to share with those in greater need and praise God in every circumstance.",
  } as L,
};

/** Stage 6 (1 Sm 24, 1-23): Cave of En-Gedi — restraining companions, stepping quietly past echo puddles, and cutting only a corner of Saul's robe. */
export const STAGE6 = {
  speaker: "Hang Ên Gê-đi",
  intro: [
    {
      vi: "“Các thuộc hạ của Đa-vít nói với ông: ‘Đây là ngày Đức Chúa đã phán: Này Ta nộp kẻ thù của ngươi vào tay ngươi!’ Đa-vít đứng dậy và lén cắt vạt áo choàng của vua Sa-un... Ông nói: ‘Xin Đức Chúa đừng để tôi giơ tay hại Đấng đã được Đức Chúa xức dầu!’” (1 Sm 24, 5-7)",
      en: "“The men of David said to him: ‘Here is the day of which the Lord said: Behold, I give your enemy into your hand!’ And David arose and stealthily cut off a corner of Saul's robe... He said: ‘The Lord forbid that I should put out my hand against the Lord's anointed!’” (1 Sam 24:4-6)",
    },
    {
      vi: "Tại vùng núi đá Ên Gê-đi, vua Sa-un một mình bước vào đúng hang đá nơi Đa-vít và đồng đội đang ẩn nấp sâu bên trong bóng tối.",
      en: "Among the crags of En-Gedi, King Saul enters alone into the very cave where David and his men are sitting deep in the shadows.",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Ba người đồng đội đang nóng lòng muốn xông ra hại vua Sa-un! Bạn hãy đi nhẹ bước (đừng dẫm vào các Vũng Nước Vang Âm khi chúng đang gợn vòng sáng trắng!) đến khuyên ngăn cả 3 đồng đội, rồi tiến tới sau lưng vua Sa-un cắt nhẹ một góc vạt áo choàng nhé!”",
      en: "David: “Three of our men are eager to strike King Saul! Walk softly (do not step on the Echo Puddles while they ripple bright white!) to calm all 3 companions, then approach behind King Saul to gently cut a corner of his robe!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Khuyên ngăn đồng đội ({m}/3) & cắt nhẹ góc vạt áo vua Sa-un",
      en: "Part 1/2: Calm companions ({m}/3) & cut the corner of Saul's robe",
    },
    {
      vi: "Pha 2/2: Bước ra Mỏm Đá Nắng giơ mảnh vạt áo hòa giải với vua Sa-un",
      en: "Part 2/2: Step out to the Sunlit Crag and hold up the robe corner in peace",
    },
  ] as L[],
  calmHint: { vi: "[A] Khuyên đồng đội đừng hại vua", en: "[A] Restrain companion in peace" } as L,
  calmTalk: [
    {
      vi: "Đa-vít thì thầm khuyên ngăn: “Xin Đức Chúa đừng để chúng ta giơ tay hại Đấng đã được Đức Chúa xức dầu!” Người đồng đội lắng nghe và hạ vũ khí xuống.",
      en: "David whispers gently: “The Lord forbid that we should raise a hand against the Lord's anointed!” His companion listens and lowers his weapon.",
    },
  ] as L[],
  echoAlert: [
    {
      vi: "Tiếng bước chân dẫm lên vũng nước vang vọng trong hang làm vua Sa-un suýt quay lại! Hãy chờ vũng nước lặng sóng rồi bước qua nhé.",
      en: "Your splash echoed through the cave and nearly alerted King Saul! Wait until the puddle is still before stepping past.",
    },
  ] as L[],
  cutHint: { vi: "[A] Cắt nhẹ một góc vạt áo choàng của vua Sa-un", en: "[A] Gently cut a corner of Saul's robe" } as L,
  needCalmFirst: [
    {
      vi: "Hãy khuyên ngăn đủ cả 3 người đồng đội trong hang trước để không ai manh động làm hại vua Sa-un nhé!",
      en: "Calm all 3 companions in the cave first so that no one strikes King Saul!",
    },
  ] as L[],
  cutDone: [
    {
      vi: "Đa-vít chỉ cắt nhẹ một góc vạt áo choàng đỏ mà không hề làm hại vua Sa-un. Vua Sa-un đứng dậy rời khỏi hang. Hãy bước ra Mỏm Đá Nắng phía Đông để lên tiếng hòa giải với nhà vua!",
      en: "David gently cuts only a corner of the crimson robe without harming King Saul. Saul rises and leaves the cave. Step out to the Sunlit Crag on the east to call out to the king in peace!",
    },
  ] as L[],
  cragHint: { vi: "[A] Giơ mảnh vạt áo choàng gọi vua Sa-un hòa giải", en: "[A] Hold up the robe corner and call to King Saul" } as L,
  reconcile: [
    {
      vi: "Đa-vít bước ra khỏi hang, cúi mình xuống đất và giơ mảnh vạt áo lên: “Thưa đức vua, xin nhìn xem vạt áo choàng của ngài trong tay con! Hôm nay Đức Chúa đã trao ngài vào tay con trong hang, nhưng con đã tha cho ngài và không giết ngài!” (1 Sm 24, 11-12)",
      en: "David went out of the cave, bowed to the earth, and held up the corner of the robe: “My lord the king, see the corner of your robe in my hand! Today the Lord gave you into my hand in the cave, yet I spared you!” (1 Sam 24:8-11)",
    },
  ] as L[],
  outro: [
    {
      vi: "Vua Sa-un xúc động bật khóc lớn tiếng: “Đa-vít con ơi, có phải tiếng con đó không? Con công chính hơn ta, vì con đã lấy ơn đáp oán, còn ta thì lấy oán báo ơn!” (1 Sm 24, 17-18) Ấn Thánh Vịnh thứ 6 thắp sáng.",
      en: "King Saul lifted up his voice and wept: “Is this your voice, my son David? You are more righteous than I, for you have repaid me good, whereas I have repaid you evil!” (1 Sam 24:16-17) The 6th Psalm Seal lights up.",
    },
  ] as L[],
  lesson: {
    vi: "Chiến thắng vĩ đại nhất không phải là đánh bại kẻ thù bằng bạo lực, mà là chiến thắng cơn giận trong lòng mình, biết tha thứ và lấy thiện thắng ác (Rm 12, 21).",
    en: "The greatest victory is not defeating an enemy by force, but conquering anger in our own heart, forgiving, and overcoming evil with good (Rom 12:21).",
  } as L,
};

/** Stage 7 (1 Sm 25, 1-35): Wise Abigail prepares the peace caravan and clears the Carmel mountain pass to prevent conflict. */
export const STAGE7 = {
  speaker: "Bà A-bi-gai-in",
  intro: [
    {
      vi: "“Đa-vít nói với bà A-bi-gai-in: ‘Chúc tụng Đức Chúa, Thiên Chúa của Ít-ra-en, Đấng đã sai bà đến gặp tôi hôm nay! Chúc tụng sự khôn ngoan của bà, người đã ngăn cản tôi hôm nay khỏi phải đổ máu và tự tay báo oán!’” (1 Sm 25, 32-33)",
      en: "“David said to Abigail: ‘Blessed be the Lord, the God of Israel, who sent you this day to meet me! Blessed be your discretion, and blessed be you, who have kept me this day from bloodguilt and from working salvation with my own hand!’” (1 Sam 25:32-33)",
    },
    {
      vi: "Ông Na-ban giàu có nhưng ích kỷ đã sỉ nhục những người chăn chiên tốt bụng của Đa-vít khiến Đa-vít nổi giận kéo quân lên núi. Vợ ông là bà A-bi-gai-in khôn ngoan liền chuẩn bị lễ vật hòa bình đi đón gặp Đa-vít.",
      en: "Wealthy but selfish Nabal insulted David's kind messengers, provoking David to march up the mountain in anger. Nabal's wise wife Abigail quickly prepares peace gifts to meet David on the pass.",
    },
  ] as L[],
  start: [
    {
      vi: "A-bi-gai-in: “Ở Pha 1, em hãy giúp cô lấy đủ 3 Phần Lễ Vật Hòa Bình (Bánh Mì, Nho Khô, Bánh Trái Vả) chất lên lưng 3 chú lừa. Sang Pha 2, hãy gạt 3 Đòn Bẩy dọn đá mở đường đèo Các-mên để đoàn lừa kịp đến gặp Đa-vít trước khi cơn giận bùng lên nhé!”",
      en: "Abigail: “In Part 1, help me gather all 3 Peace Gifts (Loaves of Bread, Raisins, Fig Cakes) and load the 3 donkeys. In Part 2, pull the 3 Levers to clear the Carmel mountain pass and reach David in time!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Chất lễ vật hòa bình lên 3 chú lừa ({d}/3)",
      en: "Part 1/2: Load peace gifts onto the 3 donkeys ({d}/3)",
    },
    {
      vi: "Pha 2/2: Mở 3 chốt đường đèo ({g}/3) & đến gặp Đa-vít kịp thời ({t}s)",
      en: "Part 2/2: Clear 3 pass gates ({g}/3) & reach David in time ({t}s)",
    },
  ] as L[],
  giftNames: [
    { vi: "Giỏ Bánh Mì Thơm", en: "Two Hundred Loaves of Bread" },
    { vi: "Chùm Nho Khô Ngọt", en: "Clusters of Raisins" },
    { vi: "Bánh Trái Vả Ép", en: "Pressed Fig Cakes" },
  ] as L[],
  takeGiftHint: { vi: "[A] Lấy lễ vật hòa bình", en: "[A] Take peace gift" } as L,
  loadDonkeyHint: { vi: "[A] Chất lễ vật lên lưng lừa", en: "[A] Load gift onto donkey" } as L,
  needGiftMsg: {
    vi: "Hãy lấy một phần lễ vật trên bàn kho trước rồi mang lại chất lên lưng chú lừa nhé!",
    en: "Pick up a peace gift from the storehouse table first, then load it onto the donkey!",
  } as L,
  passReady: [
    {
      vi: "Ba chú lừa đã chở đầy lễ vật hòa bình! Cổng đèo núi Các-mên đã mở. Hãy nhanh chân gạt 3 Đòn Bẩy Mở Đá dọc hẻm núi để dẫn đoàn lừa đến gặp Đa-vít trước khi hết giờ nhé!",
      en: "All three donkeys are loaded with peace gifts! The Carmel mountain pass gate is open. Quickly pull the 3 Rock Levers along the ravine to lead the caravan to David before time runs out!",
    },
  ] as L[],
  leverHint: { vi: "[A] Gạt đòn bẩy dọn đá mở đường đèo", en: "[A] Pull lever to clear the pass" } as L,
  meetDavidHint: { vi: "[A] Dâng lễ vật và lời hòa giải với Đa-vít", en: "[A] Offer peace gifts and wise counsel to David" } as L,
  needLeversMsg: {
    vi: "Hãy mở hết cả 3 chốt đá trên đường đèo để đoàn lừa chở lễ vật đi tới cùng bà A-bi-gai-in nhé!",
    en: "Clear all 3 rock gates along the pass so the donkey caravan can come through with Abigail!",
  } as L,
  timeUp: [
    {
      vi: "Đoàn lừa chưa kịp vượt đèo! Hãy thử lại Pha 2 và nhanh chân gạt 3 đòn bẩy mở đường nhé.",
      en: "The caravan didn't cross the pass in time! Let's retry Part 2 and quickly pull the 3 levers.",
    },
  ] as L[],
  peaceTalk: [
    {
      vi: "Bà A-bi-gai-in cúi mình thưa: “Xin ngài nhận lễ vật chúc phúc này và tha thứ lỗi lầm. Khi Đức Chúa làm cho nhà của ngài được bền vững, xin đừng để lương tâm ngài phải vướng bận hay hối hận vì đã vô cớ đổ máu và tự tay báo oán!” (1 Sm 25, 28.31)",
      en: "Abigail bowed low and said: “Please accept this blessing and forgive the offense. When the Lord builds my lord a sure house, let there be no grief or pangs of conscience for having shed blood without cause!” (1 Sam 25:28.31)",
    },
  ] as L[],
  outro: [
    {
      vi: "Cơn nóng giận của Đa-vít tan biến hoàn toàn. Ông chúc tụng Chúa và nói với bà A-bi-gai-in: “Bà hãy trở về nhà bình an; này tôi đã nghe lời bà!” (1 Sm 25, 35) Ấn Thánh Vịnh thứ 7 thắp sáng.",
      en: "David's anger melted away completely. He blessed the Lord and said to Abigail: “Go up in peace to your house; see, I have obeyed your voice!” (1 Sam 25:35) The 7th Psalm Seal lights up.",
    },
  ] as L[],
  lesson: {
    vi: "“Một câu trả lời dịu dàng làm nguôi cơn giận” (Cn 15, 1) — người khôn ngoan biết dùng lời nói hiền hòa để đem lại bình an, và người cao thượng biết lắng nghe lời khuyên lành để kịp dừng lại khi nóng giận.",
    en: "“A soft answer turns away wrath” (Prov 15:1) — the wise use gentle words to bring peace, and a noble heart listens to good counsel to stop when angry.",
  } as L,
};

/** Stage 8 (1 Sm 26, 1-25): Moonlit camp infiltration on the Hill of Hachilah — taking Saul's spear and water jug in mercy. */
export const STAGE8 = {
  speaker: "Đồi Khắc-hi-la",
  intro: [
    {
      vi: "“Đa-vít nói với ông A-bi-sai: ‘Đừng giết vua! Vì có ai giơ tay hại Đấng đã được Đức Chúa xức dầu mà lại vô tội bao giờ?... Bây giờ, anh hãy lấy cây giáo ở đầu vua và cái bình nước, rồi chúng ta đi!’” (1 Sm 26, 9.11)",
      en: "“David said to Abishai: ‘Do not destroy him! For who can put out his hand against the Lord's anointed and be guiltless?... Now take the spear that is by his head and the jar of water, and let us go!’” (1 Sam 26:9.11)",
    },
    {
      vi: "Đêm khuya trên đồi Khắc-hi-la, vua Sa-un và tướng Áp-ne cùng ba ngàn quân đang ngủ say giữa vòng chiến xa vì Đức Chúa đã cho một giấc ngủ mê ập xuống trên họ.",
      en: "Deep in the night on the Hill of Hachilah, King Saul, general Abner, and three thousand soldiers lie fast asleep within the ring of chariots, for a deep sleep from the Lord has fallen upon them.",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Ở Pha 1, bạn hãy cùng mình và A-bi-sai bước êm qua 3 vòng doanh trại đang ngủ dưới ánh trăng (tránh các vòng sáng đèn canh đổi hướng) để lấy Cây Giáo và Bình Nước đặt ngay đầu vua Sa-un. Sang Pha 2, hãy rút lên Đỉnh Đồi Đối Diện phía Đông để gọi nhà vua nhé!”",
      en: "David: “In Part 1, tiptoe with Abishai and me through the 3 sleeping camp rings under the moonlight (avoid the shifting watchlight zones) to take the Spear and Water Jug by King Saul's head. In Part 2, climb the Opposite Hilltop on the east to call out to the king!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Lẻn vào tâm doanh trại lấy Cây Giáo ({s}/1) & Bình Nước ({j}/1)",
      en: "Part 1/2: Infiltrate the camp centre to take the Spear ({s}/1) & Water Jug ({j}/1)",
    },
    {
      vi: "Pha 2/2: Lên Đỉnh Đồi Đối Diện giơ Cây Giáo & Bình Nước hòa giải",
      en: "Part 2/2: Climb the Opposite Hilltop and raise the Spear & Water Jug in peace",
    },
  ] as L[],
  spearHint: { vi: "[A] Rút nhẹ Cây Giáo ở đầu vua Sa-un", en: "[A] Quietly take the Spear by Saul's head" } as L,
  jugHint: { vi: "[A] Lấy Chiếc Bình Nước của vua Sa-un", en: "[A] Take King Saul's Water Jug" } as L,
  abishaiRestrain: [
    {
      vi: "A-bi-sai thì thầm xin đâm cây giáo xuống đất, nhưng Đa-vít ngăn lại: “Đừng giết vua! Hãy chỉ lấy cây giáo ở đầu vua và cái bình nước rồi chúng ta đi!” (1 Sm 26, 8-11)",
      en: "Abishai whispers asking to strike with the spear, but David restrains him: “Do not destroy him! Take only the spear by his head and the jar of water, and let us go!” (1 Sam 26:8-11)",
    },
  ] as L[],
  campAlert: [
    {
      vi: "Ánh đèn tuần đêm rọi trúng làm lính gác suýt thức giấc! Hãy quan sát nhịp tắt/sáng của vòng đèn canh rồi bước qua nhé.",
      en: "A night watchlight caught you and nearly woke the guards! Watch the rhythm of the lantern rings and slip through when clear.",
    },
  ] as L[],
  bothTaken: [
    {
      vi: "Đã lấy được cả Cây Giáo và Bình Nước mà không làm hại một ai! Lối hẻm núi phía Đông đã mở — hãy rút lên Đỉnh Đồi Đối Diện nhé!",
      en: "You have both the Royal Spear and the Water Jug without harming anyone! The eastern ravine path is open — climb to the Opposite Hilltop!",
    },
  ] as L[],
  hilltopHint: { vi: "[A] Giơ Cây Giáo & Bình Nước gọi tướng Áp-ne và vua Sa-un", en: "[A] Raise the Spear & Water Jug and call to Abner and King Saul" } as L,
  hilltopCall: [
    {
      vi: "Từ đỉnh đồi bên kia, Đa-vít giơ cao Cây Giáo và Bình Nước gọi lớn: “Ông Áp-ne ơi! Sao ông không canh giữ đức vua là chúa của ông? Hãy nhìn xem cây giáo của vua và bình nước ở đầu vua giờ đang ở đâu!” (1 Sm 26, 14-16)",
      en: "From the hilltop afar, David held up the Spear and Water Jug and called out: “Abner! Why have you not kept watch over your lord the king? Look where the king's spear is and the jar of water that was by his head!” (1 Sam 26:14-16)",
    },
  ] as L[],
  outro: [
    {
      vi: "Vua Sa-un nhận ra tấm lòng trung nghĩa tuyệt đối của Đa-vít lần thứ hai và chúc lành cho ông: “Đa-vít con ơi, xin chúc lành cho con! Con sẽ làm những việc lớn lao và chắc chắn con sẽ thắng!” Rồi vua Sa-un trở về và không bao giờ còn truy đuổi Đa-vít nữa. (1 Sm 26, 25) Ấn Thánh Vịnh thứ 8 (khép lại Hồi 2) thắp sáng!",
      en: "King Saul recognized David's unwavering faithfulness a second time and blessed him: “Blessed be you, my son David! You will do many things and will succeed in them!” Then Saul returned home and never pursued David again. (1 Sam 26:25) The 8th Psalm Seal lights up!",
    },
  ] as L[],
  lesson: {
    vi: "Tha thứ một lần đã quý, nhưng kiên trì tha thứ nhiều lần đến cùng như Đa-vít chính là hình ảnh của lòng khoan dung trọn hảo mà Chúa dạy chúng ta.",
    en: "Forgiving once is noble, but persevering in forgiveness again and again like David reflects the merciful heart God calls us to have.",
  } as L,
};

/** Stage 9 (2 Sm 1, 17-27): Song of the Bow — linking the 3 memorial constellations and teaching the lament to the children of Judah. */
export const STAGE9 = {
  speaker: "Khúc Ca Cây Cung",
  intro: [
    {
      vi: "“Đa-vít hát bài ai ca này thương tiếc vua Sa-un và ông Giô-na-than, con vua, và truyền dạy cho con cái Giu-đa bài ‘Cây Cung’... ‘Sa-un và Giô-na-than, những người đáng yêu và khả ái, sống chẳng rời nhau, chết cũng chẳng lìa nhau... Giô-na-than anh ơi, lòng em đau thắt vì anh; tình anh đối với em thật là kỳ diệu!’” (2 Sm 1, 17-18.23.26)",
      en: "“David lamented with this lamentation over Saul and Jonathan his son, and he said that the Song of the Bow should be taught to the people of Judah... ‘Saul and Jonathan, beloved and lovely! In life and in death they were not divided... I am distressed for you, my brother Jonathan; very pleasant have you been to me!’” (2 Sam 1:17-18.23.26)",
    },
    {
      vi: "Khi nghe tin vua Sa-un và hoàng tử Giô-na-than hy sinh trên núi Ghin-bô-a, Đa-vít không hề vui mừng vì người truy đuổi mình đã khuất, nhưng khóc thương chân thành và sáng tác Khúc Ca Cây Cung ca ngợi những điều tốt đẹp nhất của họ.",
      en: "Hearing that King Saul and Prince Jonathan fell on Mount Gilboa, David never rejoiced over his pursuer's fall, but wept sincerely and composed the Song of the Bow to honour their noblest deeds.",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Ở Pha 1, bạn hãy giúp mình thắp sáng 3 Chòm Sao Tri Ân (Chiếc Khiên Dũng Cảm, Cánh Đại Bàng & Sư Tử, Cây Cung Giô-na-than) bằng cách nhấn [A] tại 3 Đài Sao của mỗi chòm theo thứ tự 1 -> 2 -> 3. Sang Pha 2, hãy đến Đài Đá Trung Tâm hòa tấu đàn hạc truyền dạy Khúc Ca Cây Cung nhé!”",
      en: "David: “In Part 1, help me light the 3 Constellations of Gratitude (Shield of Courage, Eagle & Lion, Bow of Jonathan) by pressing [A] on the 3 Star Pads of each constellation in order 1 -> 2 -> 3. In Part 2, step onto the Central Memorial Altar to play the Song of the Bow!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Thắp sáng 3 Chòm Sao Tri Ân ({c}/3 chòm • sao {s}/3)",
      en: "Part 1/2: Light the 3 Constellations of Gratitude ({c}/3 • star {s}/3)",
    },
    {
      vi: "Pha 2/2: Hòa tấu đàn hạc tại Đài Tưởng Niệm dạy Khúc Ca Cây Cung",
      en: "Part 2/2: Play the harp at the Memorial Altar to teach the Song of the Bow",
    },
  ] as L[],
  starHint: { vi: "[A] Thắp sáng Đài Sao Kỷ Niệm", en: "[A] Light the Memorial Star Pad" } as L,
  wrongStarOrder: {
    vi: "Hãy thắp sáng các Đài Sao của chòm sao hiện tại theo đúng thứ tự từ Trái sang Phải (1 -> 2 -> 3) nhé!",
    en: "Light the Star Pads of the current constellation in order from Left to Right (1 -> 2 -> 3)!",
  } as L,
  constellationLit: [
    {
      vi: "Chòm Sao 1 – Chiếc Khiên Dũng Cảm trên núi Ghin-bô-a đã bừng sáng! “Trên các đồi Ghin-bô-a, nguyện sương mưa đừng rơi xuống, nơi khiên của những anh hùng đã nằm lại!” (2 Sm 1, 21)",
      en: "Constellation 1 – The Shield of Courage on Mount Gilboa shines! “You mountains of Gilboa, let there be no dew or rain upon you, where the shield of the mighty was defiled!” (2 Sam 1:21)",
    },
    {
      vi: "Chòm Sao 2 – Cánh Đại Bàng & Sư Tử Oai Hùng đã bừng sáng! “Sa-un và Giô-na-than nhanh hơn đại bàng, mạnh hơn sư tử!” (2 Sm 1, 23)",
      en: "Constellation 2 – The Eagle & Lion shines! “Saul and Jonathan were swifter than eagles, they were stronger than lions!” (2 Sam 1:23)",
    },
    {
      vi: "Chòm Sao 3 – Cây Cung Của Giô-na-than đã bừng sáng! “Cây cung của Giô-na-than chẳng hề lùi bước... Tình anh đối với em thật là kỳ diệu!” (2 Sm 1, 22.26) Hãy tiến tới Đài Đá Trung Tâm nhé!",
      en: "Constellation 3 – The Bow of Jonathan shines! “The bow of Jonathan turned not back... Very pleasant have you been to me!” (2 Sam 1:22.26) Step up to the Central Altar!",
    },
  ] as L[],
  altarHint: { vi: "[A] Hòa tấu Đàn Hạc truyền dạy Khúc Ca Cây Cung", en: "[A] Play the Harp to teach the Song of the Bow" } as L,
  lamentSong: [
    {
      vi: "Đa-vít gảy đàn hạc cùng các môn đệ Giu-đa ngân vang Khúc Ca Cây Cung dưới bầu trời đầy sao, ghi khắc tình bạn thánh thiện và lòng vị tha cao thượng vào Sách Người Ngay Chính. (2 Sm 1, 18)",
      en: "David plucks his harp as the disciples of Judah sing the Song of the Bow beneath the starry sky, inscribing sacred friendship and noble forgiveness in the Book of Jashar. (2 Sam 1:18)",
    },
  ] as L[],
  outro: [
    {
      vi: "Tiếng đàn tưởng niệm ngân vang lên tới trời cao, khép lại mọi chia rẽ quá khứ trong sự tha thứ và lòng biết ơn trọn vẹn. Ấn Thánh Vịnh thứ 9 (mở đầu Hồi 3) thắp sáng!",
      en: "The memorial harp echoes to the heavens, healing every past division in forgiveness and gratitude. The 9th Psalm Seal (opening Act 3) lights up!",
    },
  ] as L[],
  lesson: {
    vi: "Một trái tim cao thượng theo gương Đa-vít không bao giờ vui mừng khi người khác gặp nạn, nhưng luôn ghi nhớ những điều tốt đẹp nơi tha nhân và giữ trọn nghĩa tình với bạn bè.",
    en: "A noble heart like David's never rejoices at another's misfortune, always remembering the good in others and keeping faithful love for friends.",
  } as L,
};

/** Stage 10 (2 Sm 2, 1-4; 5, 1-5): Coronation at Hebron — welcoming the elders and placing the banners of the Twelve Tribes around the Covenant Altar. */
export const STAGE10 = {
  speaker: "Thành Khép-rôn",
  intro: [
    {
      vi: "“Tất cả các chi tộc Ít-ra-en đến gặp vua Đa-vít tại Khép-rôn và thưa rằng: ‘Này chúng tôi là cốt nhục của ngài... Đức Chúa đã phán với ngài: Chính ngươi sẽ chăn dắt dân Ta là Ít-ra-en, và chính ngươi sẽ làm người lãnh đạo Ít-ra-en!’... Họ xức dầu tấn phong Đa-vít làm vua trên Ít-ra-en.” (2 Sm 5, 1-3)",
      en: "“All the tribes of Israel came to David at Hebron and said: ‘Behold, we are your bone and flesh... The Lord said to you: You shall be shepherd of my people Israel, and you shall be prince over Israel!’... And they anointed David king over Israel.” (2 Sam 5:1-3)",
    },
    {
      vi: "Sau khi cầu nguyện hỏi ý Chúa, Đa-vít lên thành Khép-rôn. Giờ đây đại biểu của cả 12 Chi Tộc từ Bắc chí Nam đều quy tụ về Khép-rôn để lập giao ước hiệp nhất dưới quyền vị Vua Mục Tử!",
      en: "After inquiring of the Lord in prayer, David went up to Hebron. Now elders of all 12 Tribes from North to South gather at Hebron to make a covenant of unity under the Shepherd King!",
    },
  ] as L[],
  start: [
    {
      vi: "Đa-vít: “Ở Pha 1, bạn hãy giúp mình đón tiếp 4 Đoàn Trưởng Lão (Đông, Nam, Tây, Bắc) tại 4 cổng thành Khép-rôn để nhận Cờ Hiệu 12 Chi Tộc, rồi đặt vào đúng 4 Đài Đá Giao Ước. Sang Pha 2, hãy tiến lên Ngai Mục Tử ở trung tâm để cử hành lễ xức dầu đăng quang nhé!”",
      en: "David: “In Part 1, help me welcome the 4 Delegations of Elders (East, South, West, North) at the 4 gates of Hebron to receive the Twelve Tribe Banners, and place them onto the 4 Covenant Pedestals. In Part 2, step up to the Shepherd Throne at the centre for the anointing!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Đón Cờ Hiệu 4 cụm Chi Tộc & đặt lên Đài Giao Ước ({b}/4)",
      en: "Part 1/2: Receive the 4 Tribe Banner sets & place on the Pedestals ({b}/4)",
    },
    {
      vi: "Pha 2/2: Tiến lên Ngai Mục Tử cử hành lễ xức dầu Vua toàn Ít-ra-en",
      en: "Part 2/2: Step to the Shepherd Throne to be anointed King over all Israel",
    },
  ] as L[],
  groupNames: [
    { vi: "Cụm Đông (Giu-đa • Ít-xa-kha • Giơ-vu-lun)", en: "East Camp (Judah • Issachar • Zebulun)" },
    { vi: "Cụm Nam (Ru-vên • Si-mê-ôn • Gát)", en: "South Camp (Reuben • Simeon • Gad)" },
    { vi: "Cụm Tây (Ép-ra-im • Ma-na-sê • Ben-gia-min)", en: "West Camp (Ephraim • Manasseh • Benjamin)" },
    { vi: "Cụm Bắc (Đan • A-se • Náp-ta-li)", en: "North Camp (Dan • Asher • Naphtali)" },
  ] as L[],
  elderHint: { vi: "[A] Đón Cờ Hiệu Chi Tộc từ Trưởng Lão", en: "[A] Receive Tribe Banners from the Elder" } as L,
  pedestalHint: { vi: "[A] Đặt Cờ Hiệu lên Đài Đá Giao Ước", en: "[A] Place Banners on the Covenant Pedestal" } as L,
  needBannerMsg: {
    vi: "Hãy đến chào đón một vị Trưởng Lão ở 4 góc quảng trường để nhận Cờ Hiệu Chi Tộc trước nhé!",
    en: "Greet an Elder at one of the 4 corners of the plaza to receive the Tribe Banners first!",
  } as L,
  wrongPedestalMsg: {
    vi: "Đài đá này dành cho một cụm chi tộc khác! Hãy nhìn tên hướng (Đông, Nam, Tây, Bắc) của Cờ Hiệu đang cầm nhé.",
    en: "This pedestal belongs to another tribe camp! Match the direction (East, South, West, North) of the banners you are holding.",
  } as L,
  bannersReady: [
    {
      vi: "Đủ 12 Cờ Hiệu của 12 Chi Tộc Ít-ra-en đã tung bay rực rỡ quanh Bàn Giao Ước tại Khép-rôn! Hãy bước tới Ngai Mục Tử ở chính giữa quảng trường để đón nhận dầu thánh và vương miện!",
      en: "All 12 Banners of the 12 Tribes of Israel fly bright around the Covenant Altar at Hebron! Step to the Shepherd Throne at the centre of the plaza to receive the holy anointing and crown!",
    },
  ] as L[],
  throneHint: { vi: "[A] Đón nhận Dầu Thánh & Vương Miện Vua Mục Tử", en: "[A] Receive the Holy Anointing & Shepherd King's Crown" } as L,
  coronation: [
    {
      vi: "Các kỳ mục Ít-ra-en lập giao ước trước mặt Đức Chúa tại Khép-rôn và xức dầu tấn phong Đa-vít làm vua trên toàn cõi Ít-ra-en. Bên cạnh vương miện vàng, Đa-vít vẫn giữ cây gậy mục tử năm xưa để chăn dắt dân Chúa bằng tình thương. (2 Sm 5, 2-3)",
      en: "The elders of Israel made a covenant before the Lord at Hebron and anointed David king over all Israel. Beside the golden crown, David keeps his shepherd's staff to tend God's people with love. (2 Sam 5:2-3)",
    },
  ] as L[],
  outro: [
    {
      vi: "Đa-vít lên ngôi lúc ba mươi tuổi và trị vì bốn mươi năm, quy tụ toàn dân thành một đại gia đình hiệp nhất. (2 Sm 5, 4-5) Ấn Thánh Vịnh thứ 10 thắp sáng.",
      en: "David was thirty years old when he began to reign, and he reigned forty years, uniting all the people as one family. (2 Sam 5:4-5) The 10th Psalm Seal lights up.",
    },
  ] as L[],
  lesson: {
    vi: "Trước mỗi việc lớn nhỏ, hãy luôn cầu nguyện hỏi ý Chúa như Đa-vít; người lãnh đạo đích thực là người mục tử biết quy tụ, đoàn kết và phục vụ mọi người.",
    en: "Before every decision, inquire of the Lord in prayer like David; a true leader is a shepherd who unites and serves everyone.",
  } as L,
};

/** Stage 11 (2 Sm 5, 6-12; 1 Sb 11, 4-9): Gihon Spring water-shaft sluice puzzle and building the Citadel of Zion (City of David). */
export const STAGE11 = {
  speaker: "Thành Đô Xi-on",
  intro: [
    {
      vi: "“Tuy nhiên, Đa-vít đã chiếm được đồn lũy Xi-on, tức là Thành Đa-vít... Đa-vít ở trong đồn lũy và gọi đó là Thành Đa-vít; ông xây dựng thành chung quanh... Đa-vít ngày càng trở nên hùng mạnh, và Đức Chúa, Thiên Chúa các đạo binh, ở cùng ông.” (2 Sm 5, 7.9-10)",
      en: "“Nevertheless, David took the stronghold of Zion, that is, the City of David... And David lived in the stronghold and called it the City of David; and David built the city all around... And David became greater and greater, for the Lord, the God of hosts, was with him.” (2 Sam 5:7.9-10)",
    },
    {
      vi: "Đồn lũy Xi-on nằm trên đỉnh núi đá hiểm trở, nhưng Vua Đa-vít và tướng Giô-áp đã tìm ra Đường Ống Nước Ngầm Suối Gi-khôn dẫn thẳng vào bên trong thành để mở cổng thành hòa bình và xây dựng Kinh Đô Giê-ru-sa-lem.",
      en: "The stronghold of Zion sits high on steep crags, yet King David and Joab discover the underground Gihon Water Shaft leading straight inside to open the gate peacefully and build Jerusalem.",
    },
  ] as L[],
  start: [
    {
      vi: "Vua Đa-vít: “Ở Pha 1 dưới Đường Nước Ngầm Gi-khôn, bạn hãy xoay 3 Van Nước Đá theo thứ tự (Van 1 hạ nước hành lang -> Van 2 mở suối giữa -> Van 3 nâng nước Giếng Đứng) để lên mở Cổng Thành Xi-on. Sang Pha 2 trên Đồi Xi-on, hãy dựng đủ 4 Công Trình Thành Đa-vít nhé!”",
      en: "King David: “In Part 1 inside the Gihon Water Shaft, turn the 3 Stone Sluice Valves in order (Valve 1 lowers the hall -> Valve 2 opens the mid-channel -> Valve 3 raises the Vertical Shaft) to open the Gate of Zion. In Part 2 atop Mount Zion, build all 4 Landmarks of the City of David!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Xoay 3 Van Nước Ngầm Gi-khôn ({v}/3) & mở Cổng Thành Xi-on",
      en: "Part 1/2: Turn the 3 Gihon Sluice Valves ({v}/3) & open the Gate of Zion",
    },
    {
      vi: "Pha 2/2: Kiến thiết 4 Công Trình Thành Đa-vít trên Đồi Xi-on ({b}/4)",
      en: "Part 2/2: Build the 4 Landmarks of the City of David on Mount Zion ({b}/4)",
    },
  ] as L[],
  valveHint: { vi: "[A] Xoay Van Đá điều tiết dòng nước Gi-khôn", en: "[A] Turn Stone Valve to regulate the Gihon water" } as L,
  valveDone: [
    {
      vi: "Van Nước số 1 đã xoay! Mực nước ở hành lang đá thứ nhất đã hạ xuống, mở lối tiến sâu vào đường ngầm Gi-khôn.",
      en: "Sluice Valve 1 turned! The water level in the first stone corridor drops, opening the way deeper into the Gihon tunnel.",
    },
    {
      vi: "Van Nước số 2 đã xoay! Dòng nước xanh biếc từ suối Gi-khôn đã dẫn vào bể chứa chân Giếng Đứng.",
      en: "Sluice Valve 2 turned! Clear blue water from the Gihon Spring flows into the basin at the foot of the Vertical Shaft.",
    },
    {
      vi: "Van Nước số 3 đã xoay! Mực nước trong Giếng Đứng dâng lên nâng bè gỗ đưa tướng Giô-áp và bạn lên thẳng Cổng Thành Xi-on!",
      en: "Sluice Valve 3 turned! Water rises in the Vertical Shaft, lifting the wooden raft so Joab and you reach the Gate of Zion!",
    },
  ] as L[],
  buildNames: [
    { vi: "Vòng Tường Thành Đá Trắng", en: "White Stone Rampart" },
    { vi: "Tháp Canh Mi-lô", en: "Watchtower of Millo" },
    { vi: "Cung Điện Gỗ Bá Hương", en: "Palace of Cedar" },
    { vi: "Sân Đá Dựng Lều Thánh", en: "Sacred Tent Courtyard" },
  ] as L[],
  buildHint: { vi: "[A] Xây dựng công trình Thành Đa-vít", en: "[A] Build City of David landmark" } as L,
  outro: [
    {
      vi: "Thành Đa-vít trên núi Xi-on vươn lên rạng rỡ! Đa-vít nhận biết rằng Đức Chúa đã thiết lập ông làm vua trên Ít-ra-en và nâng cao vương quốc của ông vì dân Người là Ít-ra-en. (2 Sm 5, 12) Ấn Thánh Vịnh thứ 11 thắp sáng.",
      en: "The City of David on Mount Zion rises in splendour! And David perceived that the Lord had established him king over Israel, and that He had exalted his kingdom for the sake of His people Israel. (2 Sam 5:12) The 11th Psalm Seal lights up.",
    },
  ] as L[],
  lesson: {
    vi: "Sự khôn ngoan Chúa ban giúp chúng ta vượt qua những trở ngại khó khăn để xây dựng hòa bình; mọi tài năng và thành công đều nhằm phục vụ ích chung và làm sáng danh Chúa.",
    en: "God-given wisdom helps us overcome difficult obstacles to build peace; every talent and success is meant to serve the common good and glorify God.",
  } as L,
};

/** Stage 12 (2 Sm 6, 12-19; 7, 1-17): Grand procession of the Ark of the Covenant to Jerusalem, blessing the people, and Nathan's Eternal Kingdom prophecy. */
export const STAGE12 = {
  speaker: "Hòm Bia & Giao Ước Muôn Đời",
  intro: [
    {
      vi: "“Vua Đa-vít đi và rước Hòm Bia Thiên Chúa lên Thành Đa-vít trong niềm hân hoan... Khi những người khiêng Hòm Bia của Đức Chúa đi được sáu bước, vua liền dâng lễ tạ ơn. Vua Đa-vít nhảy múa hết sức trước mặt Đức Chúa, mình mặc tấm ê-phốt bằng vải gai... Ngôn sứ Na-than thưa với vua lời Đức Chúa phán: ‘Nhà của ngươi và vương quốc của ngươi sẽ bền vững muôn đời trước mặt Ta, ngai vàng của ngươi sẽ được củng cố đến muôn đời!’” (2 Sm 6, 12-14; 7, 16)",
      en: "“David went and brought up the Ark of God to the City of David with rejoicing... And when those who bore the Ark of the Lord had gone six steps, he sacrificed an offering. And David danced before the Lord with all his might, wearing a linen ephod... And Nathan the prophet spoke the word of the Lord: ‘Your house and your kingdom shall be made sure forever before Me; your throne shall be established forever!’” (2 Sam 6:12-14; 7:16)",
    },
    {
      vi: "Sau khi xây xong kinh đô Giê-ru-sa-lem, điều Vua Đa-vít khao khát nhất là rước Hòm Bia Giao Ước của Thiên Chúa về ngự ngay tại trung tâm thành thánh để Thiên Chúa làm Vua đích thực của toàn dân!",
      en: "Having built Jerusalem, King David's deepest desire is to bring the Ark of the Covenant of God to dwell at the very heart of the holy city so that God reigns as true King of all the people!",
    },
  ] as L[],
  start: [
    {
      vi: "Vua Đa-vít: “Ở Pha 1, mỗi khi đoàn tư tế khiêng Hòm Bia tiến được 6 bước đến Đài Lễ (3 chặng), bạn hãy nhấn [A] để mình gảy đàn và múa tạ ơn trước mặt Chúa! Sang Pha 2 tại Lều Thánh Xi-on, hãy chia Bánh Lộc cho 3 Nhóm Dân Chúng và lắng nghe ngôn sứ Na-than công bố Lời Hứa Vương Quốc Vĩnh Cửu nhé!”",
      en: "King David: “In Part 1, each time the priests carrying the Ark advance 6 steps to an Altar Station (3 stations), press [A] to play the harp and dance in thanksgiving before the Lord! In Part 2 at the Tent of Zion, share Blessing Cakes with 3 Family Groups and hear prophet Nathan's Eternal Kingdom Promise!”",
    },
  ] as L[],
  phase: [
    {
      vi: "Pha 1/2: Rước Hòm Bia lên Đồi Xi-on qua 3 Chặng 6 Bước ({s}/3)",
      en: "Part 1/2: Escort the Ark up Mount Zion across 3 Six-Step Stations ({s}/3)",
    },
    {
      vi: "Pha 2/2: Chia bánh chúc phúc ({b}/3) & nghe Sấm Truyền Na-than",
      en: "Part 2/2: Share blessing bread ({b}/3) & hear Nathan's Prophecy",
    },
  ] as L[],
  stationHint: { vi: "[A] Gảy Đàn Hạc & nhảy múa tạ ơn sau 6 Bước Thánh", en: "[A] Play the Harp & dance in thanksgiving after 6 Sacred Steps" } as L,
  stationPraise: [
    {
      vi: "Chặng 1 (6 Bước Thánh): Tiếng kèn sừng cừu vang dội! Vua Đa-vít mặc áo vải gai khiêm nhường nhảy múa ca ngợi Chúa trước Hòm Bia Giao Ước. (2 Sm 6, 13-14)",
      en: "Station 1 (Six Sacred Steps): The shofar blasts! Wearing a humble linen ephod, King David dances and praises the Lord before the Ark of the Covenant. (2 Sam 6:13-14)",
    },
    {
      vi: "Chặng 2 (12 Bước Thánh): Toàn thể nhà Ít-ra-en rước Hòm Bia của Đức Chúa lên giữa tiếng reo hò, tiếng tù và, tiếng đàn sắt đàn cầm vang lừng! (2 Sm 6, 15)",
      en: "Station 2 (Twelve Sacred Steps): All the house of Israel brought up the Ark of the Lord with shouting, with the sound of the horn, and with lyres and harps! (2 Sam 6:15)",
    },
    {
      vi: "Chặng 3 (Cửa Lều Thánh Xi-on): “Hỡi cửa đền, hãy cất đầu lên! Để Đức Vua vinh hiển ngự vào!” (Tv 24, 7) Hòm Bia Giao Ước đã tiến vào an vị giữa Lều Thánh trên núi Xi-on!",
      en: "Station 3 (Gates of Zion): “Lift up your heads, O gates! That the King of glory may come in!” (Ps 24:7) The Ark of the Covenant enters to rest inside the Sacred Tent on Mount Zion!",
    },
  ] as L[],
  breadHint: { vi: "[A] Trao Phần Bánh Lộc Chúc Phúc cho dân chúng", en: "[A] Share Blessing Bread with the people" } as L,
  breadThanks: [
    {
      vi: "Gia đình miền Bắc: “Tạ ơn Chúa và cảm ơn Vua Đa-vít! Hôm nay toàn dân từ Đan đến Bơ-e Sê-va đều chung hưởng niềm vui của Chúa!” (2 Sm 6, 19)",
      en: "Northern family: “Thanks be to God and to King David! Today all the people from Dan to Beersheba share in the joy of the Lord!” (2 Sam 6:19)",
    },
    {
      vi: "Gia đình miền Nam: “Bánh mì vòng, bánh chà là và bánh nho khô ngọt ngào như ân sủng Đức Chúa ngự giữa thành thánh Giê-ru-sa-lem!”",
      en: "Southern family: “The ring of bread, cake of dates, and cake of raisins are sweet like the grace of the Lord dwelling in Jerusalem!”",
    },
    {
      vi: "Các ca viên Lê-vi: “Hãy tạ ơn Đức Chúa vì Người hảo tâm, vì tình thương của Người bền vững muôn đời!” (1 Sb 16, 34) Giờ hãy đến gặp ngôn sứ Na-than bên Lều Thánh nhé!",
      en: "Levite singers: “Oh give thanks to the Lord, for He is good; for His steadfast love endures forever!” (1 Chr 16:34) Now speak with prophet Nathan beside the Sacred Tent!",
    },
  ] as L[],
  nathanHint: { vi: "[A] Lắng nghe Lời Hứa Vương Quốc Vĩnh Cửu từ ngôn sứ Na-than", en: "[A] Hear the Eternal Kingdom Promise from Prophet Nathan" } as L,
  needBreadFirst: {
    vi: "Hãy trao đủ 3 Phần Bánh Lộc Chúc Phúc cho toàn dân quanh sân Lều Thánh trước rồi đến gặp ngôn sứ Na-than nhé!",
    en: "Share all 3 Blessing Bread gifts with the people around the courtyard first, then speak with Prophet Nathan!",
  } as L,
  nathanProphecy: [
    {
      vi: "Ngôn sứ Na-than công bố lời Đức Chúa các đạo binh phán cùng Đa-vít: “Ta đã lấy ngươi từ đồng cỏ, từ việc đi theo đàn chiên, để làm người lãnh đạo dân Ta là Ít-ra-en... Chính Đức Chúa báo cho ngươi biết rằng Đức Chúa sẽ xây cho ngươi một nhà!” (2 Sm 7, 8.11)",
      en: "Prophet Nathan proclaims the word of the Lord of hosts to David: “I took you from the pasture, from following the sheep, that you should be prince over My people Israel... Moreover, the Lord declares to you that the Lord will make you a house!” (2 Sam 7:8.11)",
    },
    {
      vi: "“Ta sẽ cho dòng dõi ngươi đứng lên kế vị ngươi và Ta sẽ củng cố vương quyền của nó... Nhà của ngươi và vương quốc của ngươi sẽ bền vững muôn đời trước mặt Ta, ngai vàng của ngươi sẽ được củng cố đến muôn đời!” (2 Sm 7, 12.16)",
      en: "“I will raise up your offspring after you, and I will establish his kingdom... And your house and your kingdom shall be made sure forever before Me; your throne shall be established forever!” (2 Sam 7:12.16)",
    },
  ] as L[],
  outro: [
    {
      vi: "Vua Đa-vít bước vào ngồi trước nhan Đức Chúa và cầu nguyện: “Lạy Đức Chúa là Chúa Thượng, con là ai và nhà của con là gì mà Ngài đã dẫn con tới bậc này?... Xin chúc lành cho nhà của tôi tớ Ngài để nhà ấy tồn tại muôn đời trước nhan Ngài!” (2 Sm 7, 18.29) Ấn Thánh Vịnh thứ 12 hoàn tất trọn vẹn Cây Đàn Hạc & Vương Miện Đa-vít (12/12)!",
      en: "King David went in and sat before the Lord and prayed: “Who am I, O Lord God, and what is my house, that You have brought me thus far?... Now therefore may it please You to bless the house of Your servant, so that it may continue forever before You!” (2 Sam 7:18.29) The 12th Psalm Seal completes the Harp & Crown of David (12/12)!",
    },
  ] as L[],
  lesson: {
    vi: "Niềm vui lớn nhất của cuộc đời là rước Chúa vào ngự trị ở trung tâm trái tim và gia đình mình; hãy luôn ca ngợi và tạ ơn Chúa hết lòng như Vua Đa-vít.",
    en: "The greatest joy in life is welcoming God to dwell at the centre of our heart and family; always praise and thank the Lord wholeheartedly like King David.",
  } as L,
  bridge: [
    {
      vi: "Từ Ngai Vàng Đa-vít Đến Ngôi Sao Bê-lem: Con trai của Đa-vít là vua Sa-lô-môn đã xây dựng Đền Thờ Giê-ru-sa-lem nguy nga trên núi Xi-on. Qua hàng ngàn năm lịch sử, lời thề của Thiên Chúa với Vua Đa-vít vẫn rực sáng như ngôi sao đêm...",
      en: "From David's Throne to the Star of Bethlehem: David's son King Solomon built the glorious Temple in Jerusalem on Mount Zion. Across a thousand years of history, God's oath to King David shone bright like the morning star...",
    },
    {
      vi: "Và khi thời gian viên mãn, tại Bê-lem quê hương Đa-vít, Chúa Giêsu – Con Vua Đa-vít – đã giáng sinh! Như lời sứ thần Gáp-ri-en truyền tin cho Đức Maria: “Đức Chúa là Thiên Chúa sẽ ban cho Người ngai vàng vua Đa-vít, tổ phụ Người... và triều đại của Người sẽ vô cùng vô tận!” (Lc 1, 32-33)",
      en: "And in the fullness of time, in David's hometown of Bethlehem, Jesus — the Son of David — was born! As the angel Gabriel announced to Mary: “The Lord God will give to Him the throne of His father David... and of His kingdom there will be no end!” (Luke 1:32-33)",
    },
  ] as L[],
};

/** Epilogue (Lc 1, 32-33; Ga 10, 11; Kh 22, 16): Son of David — King of Love Forever. */
export const EPILOGUE = {
  speaker: "Đức Chúa Thánh Thần",
  intro: [
    {
      vi: "“Chính Tôi là Mục Tử nhân lành. Mục Tử nhân lành hy sinh mạng sống mình cho đoàn chiên... Ta là Chồi Lộc và là Dòng Dõi của Đa-vít, là Sao Mai sáng ngời!” (Ga 10, 11; Kh 22, 16)",
      en: "“I am the good shepherd. The good shepherd lays down his life for the sheep... I am the root and the descendant of David, the bright morning star!” (John 10:11; Rev 22:16)",
    },
    {
      vi: "Ánh bình minh chiếu sáng căn phòng nhỏ ấm áp. Cây Đàn Hạc & Vương Miện Đa-vít với đủ 12 Ấn Thánh Vịnh tỏa sáng lấp lánh bên cuốn Kinh Thánh.",
      en: "Morning light fills the warm little room. The Harp & Crown of David with all 12 Psalm Seals shines beside the open Bible.",
    },
  ] as L[],
  welcome: [
    {
      vi: "Chúc mừng con đã hoàn thành trọn vẹn 12 chặng hành trình cùng Vua Đa-vít – từ cậu bé chăn chiên ở Bê-lem đến Vị Vua Giao Ước trên núi Xi-on!",
      en: "Congratulations on completing all 12 stages with King David — from the shepherd boy of Bethlehem to the Covenant King on Mount Zion!",
    },
    {
      vi: "Trước khi đặt Cây Đàn Hạc & Vương Miện Đa-vít lên bàn cầu nguyện, con hãy đến 2 Kỷ Vật Suy Niệm trong phòng để nối kết hình ảnh Vua Đa-vít với Chúa Giêsu Kitô nhé!",
      en: "Before placing the Harp & Crown of David on the prayer table, visit the 2 Reflection Relics in the room to connect King David's life with Jesus Christ!",
    },
  ] as L[],
  phase: [
    {
      vi: "Màn Kết: Khám phá 2 nhịp cầu nối Đa-vít -> Chúa Giêsu ({r}/2) & đặt Đàn Hạc lên bàn",
      en: "Epilogue: Complete 2 reflections David -> Jesus ({r}/2) & place the Harp on the table",
    },
  ] as L[],
  relicHints: [
    { vi: "[A] Suy niệm: Người Chăn Chiên Bê-lem -> Mục Tử Nhân Lành", en: "[A] Reflect: Shepherd of Bethlehem -> The Good Shepherd" },
    { vi: "[A] Suy niệm: Đàn Hạc Thánh Vịnh & Trái Tim Khoan Dung", en: "[A] Reflect: Harp of the Psalms & the Merciful Heart" },
  ] as L[],
  relicQuestions: [
    {
      q: {
        vi: "Hình ảnh cậu bé Đa-vít chăn chiên ở Bê-lem, dám liều mình cứu chiên con khỏi sư tử và chiến thắng Gô-li-át nhân danh Chúa báo trước về Đấng nào?",
        en: "Who is prefigured by young David tending sheep in Bethlehem, rescuing lambs from the lion, and defeating Goliath in the Lord's name?",
      },
      a: [
        {
          vi: "Báo trước về Chúa Giêsu – Mục Tử Nhân Lành sinh ra tại Bê-lem, Đấng hiến mạng sống cứu đoàn chiên (Ga 10, 11)",
          en: "Jesus the Good Shepherd born in Bethlehem, who lays down His life to save the flock (John 10:11)",
        },
        {
          vi: "Chỉ là câu chuyện cổ tích không liên quan đến Chúa Giêsu",
          en: "Only an old folktale unrelated to Jesus",
        },
      ],
      ok: {
        vi: "Đúng thế! Từ đồng cỏ Bê-lem năm xưa, Đa-vít đã họa lại hình ảnh Chúa Giêsu – Mục Tử Nhân Lành yêu thương từng con chiên đến cùng!",
        en: "Indeed! From the pastures of Bethlehem, David prefigured Jesus the Good Shepherd who loves every lamb to the end!",
      },
    },
    {
      q: {
        vi: "Tiếng đàn Thánh Vịnh của Đa-vít và việc ông hai lần tha mạng cho vua Sa-un nơi hang đá dạy con bài học gì mỗi ngày?",
        en: "What daily lesson do we learn from David's Psalm harp and his mercy in sparing King Saul twice in the wilderness?",
      },
      a: [
        {
          vi: "Biết cầu nguyện ca tụng Chúa trong mọi hoàn cảnh và có trái tim nhân hậu, biết tha thứ, lấy thiện thắng ác",
          en: "To pray and praise God in every circumstance and keep a forgiving heart that overcomes evil with good",
        },
        {
          vi: "Luôn tìm cách trả đũa khi người khác làm mình buồn",
          en: "Always seek payback whenever someone hurts us",
        },
      ],
      ok: {
        vi: "Tuyệt vời! Lời cầu nguyện Thánh Vịnh và lòng tha thứ biến những hang đá tăm tối nhất thành nơi tràn ngập ánh sáng của Chúa!",
        en: "Wonderful! Psalm prayer and forgiveness turn even the darkest caves into places filled with God's light!",
      },
    },
  ],
  wrongChoice: {
    vi: "Chưa đúng rồi, con hãy suy nghĩ lại với lòng yêu mến Chúa nhé!",
    en: "Not quite right — reflect again with a loving heart!",
  } as L,
  deskHint: { vi: "[A] Đặt Cây Đàn Hạc & Vương Miện Đa-vít (12/12) lên bàn cầu nguyện", en: "[A] Place the Harp & Crown of David (12/12) on the prayer table" } as L,
  needRelicsFirst: {
    vi: "Con hãy hoàn thành 2 câu hỏi suy niệm tại Bản Đồ Bê-lem và Kệ Đàn Hạc trong phòng trước nhé!",
    en: "Complete the 2 reflections at the Bethlehem Map and Harp Stand in the room first!",
  } as L,
  finale: [
    {
      vi: "Cây Đàn Hạc & Vương Miện Đa-vít tỏa sáng rực rỡ bên cạnh Hai Bia Đá Môi-sê, Hải Đồ Nô-ê, Cuộn Sáng Thế và Chuỗi Mân Côi!",
      en: "The Harp & Crown of David shines radiantly beside the Two Tablets of Moses, Noah's Chart, the Genesis Scroll, and the Rosary!",
    },
    {
      vi: "Nguyện xin Chúa Giêsu – Con Vua Đa-vít, Mục Tử Nhân Lành và Vua Tình Yêu Muôn Đời – luôn ngự trị trong trái tim và gia đình của con hôm nay và mãi mãi. Amen!",
      en: "May Jesus — Son of David, the Good Shepherd, and King of Love Forever — reign always in your heart and family today and forevermore. Amen!",
    },
  ] as L[],
  theEnd: [
    {
      vi: "Chúc mừng con đã hoàn thành trọn vẹn hành trình Vua Đa-vít – Người Chăn Chiên & Vị Vua Giao Ước (12/12 Ấn Thánh Vịnh)! Con muốn ở lại căn phòng bình yên này hay trở về trang chủ?",
      en: "Congratulations on completing the entire journey of King David – Shepherd & Covenant King (12/12 Psalm Seals)! Would you like to stay in this peaceful room or return to the home page?",
    },
  ] as L[],
};




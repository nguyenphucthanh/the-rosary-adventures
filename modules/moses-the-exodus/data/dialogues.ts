/** Bilingual line. The game reads `.vi`; `.en` is kept ready for a language toggle. */
export interface L {
  vi: string;
  en: string;
}
export const tr = (l: L) => l.vi;

/** Prologue (Xh 3, 10.12): the little room at night, the lamp, the three map pieces, the Holy Spirit. */
export const PROLOGUE = {
  intro: [
    { vi: "“Bây giờ, ngươi hãy đi! Ta sai ngươi đến với Pha-ra-ô để đưa dân Ta là con cái Ít-ra-en ra khỏi Ai Cập... Thiên Chúa phán: ‘Ta sẽ ở với ngươi!’” (Xh 3, 10.12)", en: "“Now go! I am sending you to Pharaoh to bring my people, the Israelites, out of Egypt... God said: ‘I will be with you.’” (Ex 3:10.12)" },
    { vi: "Một buổi tối yên tĩnh trong căn phòng nhỏ của em. Trên bàn học, cuốn Kinh Thánh đang mở ở đầu Sách Xuất Hành, bên cạnh một tấm bản đồ cổ đã bị rách.", en: "A quiet evening in your little room. On the desk the Bible lies open at the start of Exodus, beside an old torn map." },
    { vi: "Dùng mũi tên / D-pad để đi, nhấn Space hoặc nút A để xem xét.", en: "Use the arrows / D-pad to move, press Space or A to interact." },
  ] as L[],
  lampHint: { vi: "[A] Ngọn đèn bàn học", en: "[A] Desk lamp" } as L,
  mapHint: { vi: "[A] Bản đồ cổ", en: "[A] Old map" } as L,
  lampLit: [
    { vi: "Em bật ngọn đèn bàn học. Ánh sáng vàng ấm áp soi rõ tấm bản đồ cổ: vẽ vùng châu thổ sông Nin, Biển Đỏ và bán đảo Xi-nai.", en: "You switch on the desk lamp. Warm light shows the old map: the Nile delta, the Red Sea and the Sinai peninsula." },
    { vi: "Ba mảnh bản đồ vừa rơi quanh phòng và lấp lánh. Hãy tìm chúng nhé!", en: "Three pieces of the map have fallen around the room and are sparkling. Find them!" },
  ] as L[],
  pieces: [
    { vi: "ĐẤT NÔ LỆ AI CẬP — “Dân Ta đang kêu than.”", en: "LAND OF SLAVERY, EGYPT — “My people are crying out.”" },
    { vi: "LÒNG BIỂN ĐỎ CỨU ĐỘ — “Dân đi giữa biển khô.”", en: "THE RED SEA OF SALVATION — “The people walked through on dry ground.”" },
    { vi: "ĐỈNH NÚI GIAO ƯỚC XI-NAI — “Chúa ký giao ước với dân.”", en: "THE COVENANT MOUNTAIN, SINAI — “The Lord made a covenant with his people.”" },
  ] as L[],
  pieceFound: { vi: "Em nhặt được mảnh bản đồ: ", en: "You found a map piece: " } as L,
  mapNotYet: [{ vi: "Tấm bản đồ còn rách. Hãy bật đèn bàn học rồi tìm ba mảnh bản đồ nhé.", en: "The map is torn. Switch on the desk lamp, then find the three pieces." }] as L[],
  mapPartial: { vi: "Em có {n}/3 mảnh bản đồ. Hãy tìm nốt nhé!", en: "You have {n}/3 map pieces. Keep looking!" } as L,
  mapStart: { vi: "Nối lộ trình Xuất Hành theo thứ tự. Nơi nào dân Chúa đi qua đầu tiên?", en: "Join the Exodus route in order. Which place did God's people leave first?" } as L,
  mapNext: { vi: "Đúng rồi! Họ đi tới đâu tiếp theo?", en: "Right! Where did they go next?" } as L,
  mapWrong: [{ vi: "Chưa đúng thứ tự. Hãy nhớ: rời nơi nô lệ, qua biển, rồi đến núi của Chúa. Thử lại nhé!", en: "Not the right order. Remember: leave slavery, cross the sea, then reach God's mountain. Try again!" }] as L[],
  mapDone: [
    { vi: "Ba mảnh khớp lại! Con đường đi từ Ai Cập, qua Biển Đỏ, đến núi Xi-nai sáng lên, và trang Sách Xuất Hành tỏa ánh vàng ấm áp.", en: "The three pieces fit! The road from Egypt, across the Red Sea, to Mount Sinai glows, and the page of Exodus shines warm gold." },
  ] as L[],
  spirit: [
    { vi: "Chim Bồ Câu trắng bay ra từ trang sách, đậu bên tấm bản đồ. Đó là Chúa Thánh Thần.", en: "A white dove flies from the page and lands by the map. It is the Holy Spirit." },
    { vi: "“Con yêu dấu, khi con cháu tổ phụ Gia-cóp sinh sôi đông đúc tại Ai Cập, một vua Pha-ra-ô mới lên ngôi đã bắt họ làm nô lệ cực nhọc. Nhưng Thiên Chúa đã nghe tiếng kêu than của dân Người và chọn ông Môi-sê để dẫn họ bước ra tự do. Hãy lên đường cùng Ta nhé!”", en: "“Dear child, when the descendants of Jacob grew many in Egypt, a new Pharaoh made them slaves. But God heard his people's cry and chose Moses to lead them to freedom. Come with Me!”" },
    { vi: "Em nhận được Hai Bia Đá Hành Trình (0/13 Ấn Dấu).", en: "You receive the Journey Tablets (0/13 Seals)." },
  ] as L[],
  lesson: { vi: "Thiên Chúa luôn lắng nghe lời cầu nguyện của những người đau khổ và không bao giờ bỏ rơi dân của Người.", en: "God always listens to the prayers of those who suffer and never abandons his people." } as L,
};

/** Stage 1 (Xh 1, 22 – 2, 10): the basket on the Nile. */
export const STAGE1 = {
  speaker: "Sông Nin",
  intro: [
    { vi: "“Khi không thể giấu con được nữa, bà lấy cho con một cái thúng sậy, trét hắc ín và nhựa thông, đặt đứa trẻ vào trong, rồi để giữa đám sậy gần bờ sông Nin. Chị đứa trẻ đứng đằng xa để xem cái gì sẽ xảy ra cho nó.” (Xh 2, 3-4)", en: "“When she could hide him no longer, she took a papyrus basket, coated it with tar and pitch, and placed the child in it among the reeds by the Nile. His sister stood at a distance to see what would happen to him.” (Ex 2:3-4)" },
    { vi: "Bình minh trên sông Nin. Chiếc thúng cói chở bé Môi-sê đang trôi theo dòng nước, dưới ánh mắt dõi theo của chị Mi-ri-am.", en: "Dawn on the Nile. The basket carrying baby Moses drifts with the current under his sister Miriam's watchful eyes." },
  ] as L[],
  start: [
    { vi: "Mi-ri-am: “Em ơi, giúp chị nhé! Thúng của bé Môi-sê sẽ trôi qua ba khúc sông. Đứng cạnh cần gạt lá sen rồi nhấn A để đổi làn nước, tránh xoáy nước và cá sấu!”", en: "Miriam: “Help me! The basket will drift through three reaches of river. Stand by the lotus lever and press A to change lanes, away from whirlpools and crocodiles!”" },
  ] as L[],
  leverHint: { vi: "[A] Gạt lá sen đổi làn nước", en: "[A] Turn the lotus lever" } as L,
  holdHint: { vi: "[A] Giữ dây sậy: giấu thúng", en: "[A] Hold the reed rope: hide the basket" } as L,
  releaseHint: { vi: "[A] Thả dây sậy cho thúng trôi", en: "[A] Release the rope" } as L,
  reach: [
    { vi: "Khúc sông 1/3", en: "Reach 1/3" },
    { vi: "Khúc sông 2/3: nấp sau bụi sậy", en: "Reach 2/3: hide in the reeds" },
    { vi: "Khúc sông 3/3", en: "Reach 3/3" },
  ] as L[],
  reach2: [
    { vi: "Lính tuần tra Ai Cập đang đứng canh trên bờ nam! Khi hắn quay nhìn xuống sông (vùng đỏ), hãy đứng cạnh cọc sậy, nhấn A giữ thúng nấp sau bụi sậy. Khi hắn quay đi thì thả ra nhé.", en: "An Egyptian guard stands on the south bank! When he looks at the river (red area), stand by the reed post and press A to hide the basket. Release it when he looks away." },
  ] as L[],
  reach3: [
    { vi: "Khúc sông cuối có nhiều hiểm nguy hơn. Gần tới bến của Công chúa rồi, cố lên nào!", en: "The last reach is more dangerous. The Princess's landing is near. Keep going!" },
  ] as L[],
  hit: [{ vi: "Ôi, thúng chạm nguy hiểm! Nhưng Thiên Chúa vẫn che chở. Mình thử lại khúc sông này nhé.", en: "Oh, the basket met danger! But God still protects. Let's try this reach again." }] as L[],
  spotted: [{ vi: "Lính canh đã thấy thúng! Đừng sợ, mình thử lại khúc sông này. Nhớ giữ dây sậy khi hắn nhìn xuống sông nhé.", en: "The guard saw the basket! Don't worry, try again. Remember to hold the rope when he looks at the river." }] as L[],
  dockHint: { vi: "[A] Giúp chị Mi-ri-am thưa chuyện với Công chúa", en: "[A] Help Miriam speak to the Princess" } as L,
  dock: [
    { vi: "Chiếc thúng cập bến. Công chúa Pha-ra-ô mở thúng ra: bé Môi-sê đang khóc. Bà thương xót: “Đây là một đứa bé Híp-ri.” (Xh 2, 6)", en: "The basket reaches the landing. Pharaoh's daughter opens it: the baby is crying. She has pity: “This is one of the Hebrew children.” (Ex 2:6)" },
    { vi: "Chị Mi-ri-am bước ra. Em giúp chị nói điều gì với Công chúa?", en: "Miriam steps forward. What do you help her say to the Princess?" },
  ] as L[],
  askRight: { vi: "“Con xin đi gọi một nhũ mẫu người Híp-ri về nuôi bé cho bà.”", en: "“Shall I call a Hebrew nurse to nurse the child for you?”" } as L,
  askWrong: { vi: "“Xin cứ giữ bé, con đi đây.”", en: "“Keep him, I'm leaving.”" } as L,
  wrong: [{ vi: "Nói vậy thì bé không về với mẹ được. Mi-ri-am cần lời khéo léo hơn. Em thử lại nhé!", en: "That would not bring the baby back to his mother. Miriam needs a wiser word. Try again!" }] as L[],
  right: [
    { vi: "Công chúa gật đầu: “Đi đi!” Mi-ri-am chạy đi gọi chính mẹ ruột của bé. Bà nói: “Hãy mang đứa trẻ này về nuôi giùm ta, ta sẽ trả công cho.” (Xh 2, 7-9)", en: "The Princess nods: “Yes, go.” Miriam runs to fetch the child's own mother. She says: “Take this baby and nurse him for me, and I will pay you.” (Ex 2:7-9)" },
  ] as L[],
  outro: [
    { vi: "Khi đứa trẻ lớn lên, bà đem đến cho Công chúa, và bà đặt tên cho em là Môi-sê, vì bà nói: “Ta đã kéo nó ra khỏi nước.” (Xh 2, 10) Ấn Dấu thứ 1 khắc sáng lên Bia Đá.", en: "When the child grew up, she brought him to the Princess, who named him Moses, saying: “I drew him out of the water.” (Ex 2:10) The 1st Seal lights up on the Tablets." },
  ] as L[],
  lesson: { vi: "Thiên Chúa quan phòng kỳ diệu và che chở em nhỏ qua tình yêu thương của mẹ và chị Mi-ri-am. Em hãy biết ơn gia đình đã chăm sóc mình.", en: "God's wonderful providence protects a little child through the love of a mother and sister. Be thankful for the family who cares for you." } as L,
  cutscene: [
    { vi: "Lớn Lên Nơi Hoàng Cung: Bé Môi-sê lớn lên bên mẹ ruột, được mẹ dạy về Thiên Chúa của Áp-ra-ham, I-xa-ác và Gia-cóp. Khi lớn khôn, em được đưa vào hoàng cung và trở thành dưỡng tử của Công chúa. (Xh 2, 10; Cv 7, 21-22)", en: "Growing up in the palace: Moses grows up beside his own mother, taught about the God of Abraham, Isaac and Jacob. When older, he is brought to the palace as the Princess's adopted son. (Ex 2:10; Acts 7:21-22)" },
    { vi: "Ông học mọi sự khôn ngoan của Ai Cập, sống trong nhung lụa. Nhưng trái tim ông không ngủ yên: mỗi khi nhìn qua cổng hoàng thành, ông thấy đồng bào Do Thái của mình đang rên xiết làm nô lệ...", en: "He learns all the wisdom of Egypt and lives in luxury. But his heart cannot rest: looking through the palace gate, he sees his own Hebrew people groaning in slavery..." },
  ] as L[],
};

/** Stage 2 (Xh 2, 11-25; Cv 7, 22-29; Dt 11, 24-27): the brick site, the escape, the well of Midian. */
export const STAGE2 = {
  speaker: "Hoàng tử Môi-sê",
  intro: [
    { vi: "“Nhờ đức tin, khi đã lớn khôn, ông Môi-sê từ chối không chịu cho người ta gọi mình là con của công chúa Pha-ra-ô; ông thà chịu ngược đãi với dân Thiên Chúa hơn là hưởng những khoái lạc chóng qua của tội lỗi.” (Dt 11, 24-25)", en: "“By faith Moses, when he grew up, refused to be called the son of Pharaoh's daughter, choosing rather to share ill-treatment with the people of God than to enjoy the fleeting pleasures of sin.” (Heb 11:24-25)" },
    { vi: "Năm bốn mươi tuổi, Hoàng tử Môi-sê nhìn xuống công trường gạch dưới nắng gắt. Ông thấy anh em Híp-ri kiệt sức dưới đòn roi. Ông trút áo hoàng gia, khoác áo vải thô, lặng lẽ đi xuống với họ.", en: "At forty, Prince Moses looked down on the brick site under the hot sun. He saw his Hebrew brothers worn out under the whip. He took off his royal robe, put on rough cloth, and quietly went down to them." },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Em đi cùng anh nhé. Các cụ già đang khát nước. Em lấy bình nước ở chum đất rồi mang đến cho ba người anh em. Nhớ tránh lính canh: vùng đỏ là nơi chúng nhìn thấy em!”", en: "Moses: “Come with me. The old ones are thirsty. Take a jar from the clay pot and bring water to three of our brothers. Avoid the guards: the red zone is where they can see you!”" },
  ] as L[],
  phase: [
    { vi: "Pha 1/3: Mang nước cho anh em", en: "Part 1/3: Water for our brothers" },
    { vi: "Pha 2/3: Trốn khỏi cổng thành", en: "Part 2/3: Escape the city gates" },
    { vi: "Pha 3/3: Giữ giếng Ma-đi-an", en: "Part 3/3: Guard the well of Midian" },
  ] as L[],
  potHint: { vi: "[A] Lấy bình nước", en: "[A] Take a water jar" } as L,
  slaveHint: { vi: "[A] Đưa nước cho người anh em", en: "[A] Give water" } as L,
  thanks: [
    { vi: "Cụ già: “Cảm ơn em. Nước mát quá, Thiên Chúa sẽ trả công cho em.”", en: "Old man: “Thank you. The water is cool. God will repay you.”" },
    { vi: "Người mẹ: “Nước này cho con tôi. Em thật tốt bụng.”", en: "Mother: “This is for my child. You are so kind.”" },
    { vi: "Người thợ: “Em đã cho tôi thêm sức. Xin Chúa chúc lành cho em.”", en: "Worker: “You gave me strength. God bless you.”" },
  ] as L[],
  caught: [{ vi: "Lính canh đã thấy em! Đừng sợ. Em quay lại chum nước và thử lần nữa, nhớ đợi lính đi xa rồi hãy băng qua.", en: "The guard saw you! Don't worry. Go back to the pot and try again; wait until the guard is far away, then cross." }] as L[],
  rescue: [
    { vi: "Bỗng có tiếng roi vút! Một tên cai ngục hung dữ đang đánh một người Híp-ri.", en: "Suddenly a whip cracks! A cruel overseer is beating a Hebrew." },
    { vi: "Môi-sê nhìn quanh, không thấy ai. Em hãy giúp ông cứu người anh em nhé.", en: "Moses looks around and sees no one. Help him save his brother." },
  ] as L[],
  strikeHint: { vi: "[A] Gạt tên cai ngục ra", en: "[A] Push the overseer away" } as L,
  strike: [
    { vi: "Môi-sê chạy tới gạt tên cai ngục ngã xuống, và người Híp-ri được cứu. Ông thương anh em lắm, nhưng cách ông làm chưa phải là đường lối của Thiên Chúa. (Xh 2, 11-12)", en: "Moses ran in and knocked the overseer down, and the Hebrew was saved. He loved his brothers, but this was not God's way. (Ex 2:11-12)" },
  ] as L[],
  buryHint: { vi: "[A] Lấp hố cát", en: "[A] Cover with sand" } as L,
  bury: [
    { vi: "Môi-sê vội vùi dấu vết dưới cát. Nhưng bí mật nào cũng có ngày lộ ra...", en: "Moses hurried to hide the trace under the sand. But every secret comes out one day..." },
  ] as L[],
  betray: [
    { vi: "Hôm sau, Môi-sê thấy hai người Híp-ri đánh nhau và can ngăn: “Sao anh lại đánh đồng bào mình?” Người kia đáp: “Ai đặt ông làm thủ lãnh trên chúng tôi? Hay ông muốn giết tôi như đã giết tên Ai Cập hôm qua?” (Xh 2, 13-14)", en: "The next day Moses saw two Hebrews fighting and said: “Why do you strike your own people?” One replied: “Who made you ruler over us? Will you kill me as you killed the Egyptian?” (Ex 2:13-14)" },
    { vi: "Tin đến tai Pha-ra-ô, và ông ra lệnh giết Môi-sê. Trời tối rồi. Em cùng Môi-sê chạy qua ba cổng thành, đợi lính tuần đi xa rồi mới băng qua nhé!", en: "Pharaoh heard and ordered Moses killed. It is night. Run with Moses through three city gates; wait until the guard is far away, then cross!" },
  ] as L[],
  gateCaught: [{ vi: "Lính tuần thấy em! Đừng sợ, em lùi lại, đợi hắn đi xa rồi chạy qua.", en: "The guard saw you! Step back, wait until he is far, then dash across." }] as L[],
  gateLabel: { vi: "Chốt cổng", en: "Gate" } as L,
  oasis: [
    { vi: "Môi-sê trốn đến xứ Ma-đi-an và ngồi nghỉ bên giếng đá. Bảy cô con gái của tư tế Giê-trô đến múc nước cho đàn chiên. Nhưng bọn mục đồng kéo tới xua đuổi các cô! (Xh 2, 15-17)", en: "Moses fled to Midian and sat by a stone well. The seven daughters of the priest Jethro came to water their flock. But shepherds came to drive them away! (Ex 2:15-17)" },
    { vi: "Em đứng gần bọn mục đồng rồi nhấn A để vung gậy xua họ đi. Đừng để họ chạm tới giếng!", en: "Stand near the shepherds and press A to wave your staff and drive them off. Don't let them reach the well!" },
  ] as L[],
  waveLabel: { vi: "Đẩy lùi mục đồng", en: "Drive off the shepherds" } as L,
  wave2: [{ vi: "Có thêm mục đồng kéo đến! Em cố lên nhé.", en: "More shepherds are coming! Hold on." }] as L[],
  waveHit: { vi: "Bọn mục đồng chạm tới giếng! Các cô gái sợ hãi. Em đuổi họ đi tiếp nhé.", en: "The shepherds reached the well! The girls are scared. Keep driving them off." } as L,
  waterStart: [
    { vi: "Bọn mục đồng đã bỏ đi. Môi-sê mỉm cười: “Giờ ta cùng múc nước cho đàn chiên uống nhé.” Kéo ròng rọc ở giếng rồi đổ đầy bốn máng nước!", en: "The shepherds are gone. Moses smiles: “Now let us draw water for the flock.” Pull the pulley at the well and fill the four troughs!" },
  ] as L[],
  wellHint: { vi: "[A] Kéo ròng rọc múc nước", en: "[A] Pull the pulley" } as L,
  troughHint: { vi: "[A] Đổ nước vào máng", en: "[A] Fill the trough" } as L,
  waterLabel: { vi: "Máng nước {n}/4", en: "Troughs {n}/4" } as L,
  done: [
    { vi: "Đàn chiên uống no nước. Các cô gái chạy về kể với cha. Giê-trô hỏi: “Sao các con không mời người ấy vào dùng bữa?” (Xh 2, 20)", en: "The flock drank its fill. The girls ran home to tell their father. Jethro asked: “Why did you not invite the man to eat with us?” (Ex 2:20)" },
  ] as L[],
  outro: [
    { vi: "Giê-trô đón Môi-sê về nhà, cảm ơn người lạ đã bênh vực con gái ông, và gả nàng Tsi-pô-ra cho Môi-sê. (Xh 2, 21) Ấn Dấu thứ 2 khắc sáng lên Bia Đá.", en: "Jethro welcomed Moses into his home, thanked the stranger who defended his daughters, and gave him Zipporah as his wife. (Ex 2:21) The 2nd Seal shines on the Tablet." },
  ] as L[],
  lesson: { vi: "Em hãy can đảm đứng về phía người yếu thế và nghèo khổ. Nhưng sức mạnh của chúng ta không thể thay cho đường lối và quyền năng cứu độ của Thiên Chúa.", en: "Be brave and stand with the weak and the poor. But our own strength cannot replace God's way and saving power." } as L,
  cutscene: [
    { vi: "Bốn Mươi Năm Trong Thung Lũng Khiêm Nhường: Môi-sê cưới nàng Tsi-pô-ra và sinh con trai Ghéc-sôm: “Tôi là ngoại kiều trên đất khách.” Ông bỏ gươm giáo và danh phận hoàng tử, khoác áo len thô, cầm cây gậy chăn chiên.", en: "Forty Years in the Humble Valley: Moses married Zipporah and had a son, Gershom: “I am a stranger in a foreign land.” He laid down sword and princely rank, put on a rough wool cloak, and took up a shepherd's staff." },
    { vi: "Suốt bốn mươi năm, ông tìm từng chú chiên lạc và băng bó chiên non. Người nóng vội năm xưa trở nên “người khiêm nhu nhất trên mặt đất.” (Ds 12, 3) Bấy giờ ở Ai Cập, vua cũ băng hà, vua mới còn tàn bạo hơn. “Tiếng kêu van của con cái Ít-ra-en thấu tới Thiên Chúa.” (Xh 2, 23-25)", en: "For forty years he searched for every lost sheep and bandaged the lambs. The hasty young man became “the most humble man on earth.” (Num 12:3) In Egypt the old king died and the new one was crueler. “Their cry for help went up to God.” (Ex 2:23-25)" },
    { vi: "Năm Môi-sê tám mươi tuổi, ông dẫn đàn chiên đến chân núi Khô-rép... giờ của Thiên Chúa đã điểm!", en: "When Moses was eighty he led his flock to the foot of Mount Horeb... God's hour had come!" },
  ] as L[],
};

/** Stage 3 (Xh 3, 1 – 4, 17): Mount Horeb, the burning bush, the holy ground and the three signs. */
export const STAGE3 = {
  speaker: "Núi Khô-rép",
  intro: [
    { vi: "“Ông nhìn, và kìa, bụi cây cứ cháy bừng bừng mà không bị thiêu rụi... Thiên Chúa gọi ông từ giữa bụi cây: ‘Môi-sê! Môi-sê!’ Ông thưa: ‘Dạ, tôi đây!’ Người phán: ‘Chớ lại gần đây! Cởi dép ở chân ngươi ra, vì nơi ngươi đang đứng là đất thánh!’” (Xh 3, 2.4-5)", en: "“He saw that the bush was on fire but not consumed... God called to him from the bush: ‘Moses! Moses!’ He said: ‘Here I am.’ God said: ‘Come no closer! Take off your sandals, for the place where you stand is holy ground.’” (Ex 3:2.4-5)" },
    { vi: "Hoàng hôn trên núi Khô-rép. Môi-sê, nay đã tám mươi tuổi, chăn đàn chiên của ông Giê-trô tới tận sa mạc. Bỗng ông thấy một bụi gai đang cháy sáng mà không tàn...", en: "Dusk on Mount Horeb. Moses, now eighty, has led Jethro's flock deep into the desert. Suddenly he sees a thorn bush burning without being consumed..." },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Em ơi, bốn chú chiên của ta đi lạc rồi! Em đến gần từng chú, nhấn A để gọi, rồi dẫn các chú về chuồng ở bên trái nhé.”", en: "Moses: “Child, four of my sheep have strayed! Walk up to each one, press A to call it, and lead them to the pen on the left.”" },
  ] as L[],
  phase: [
    { vi: "Pha 1/3: Gom chiên về chuồng", en: "Part 1/3: Bring the sheep home" },
    { vi: "Pha 2/3: Bước trên đất thánh", en: "Part 2/3: Walk on holy ground" },
    { vi: "Pha 3/3: Ba dấu lạ của Chúa", en: "Part 3/3: God's three signs" },
  ] as L[],
  sheepHint: { vi: "[A] Gọi chú chiên đi theo", en: "[A] Call the sheep" } as L,
  sheepCalled: { vi: "Be he he! Chú chiên đi theo em.", en: "Baa! The sheep follows you." } as L,
  sheepLabel: { vi: "Chiên về chuồng", en: "Sheep penned" } as L,
  sheepDone: [
    { vi: "Đủ cả bốn chú chiên rồi! Môi-sê mỉm cười, nhưng ông chợt dừng lại: trên sườn núi, một bụi gai đang cháy rực mà không hề tàn.", en: "All four sheep are home! Moses smiles, then stops: on the hillside a thorn bush burns bright and is not consumed." },
    { vi: "Môi-sê: “Ta phải lại gần xem cảnh lạ này.” (Xh 3, 3) Em cùng ông lên đỉnh núi nhé.", en: "Moses: “I must turn aside and see this great sight.” (Ex 3:3) Come up the mountain with me." },
  ] as L[],
  voice: [
    { vi: "Có tiếng từ bụi cây vang lên: “Môi-sê! Môi-sê! Chớ lại gần đây! Cởi dép ở chân ngươi ra, vì nơi ngươi đang đứng là đất thánh.” (Xh 3, 4-5)", en: "A voice calls from the bush: “Moses! Moses! Come no closer! Take off your sandals, for the place where you stand is holy ground.” (Ex 3:4-5)" },
    { vi: "Em hãy cởi dép ở Bệ Đá Khiêm Nhường để cùng Môi-sê bước vào đất thánh.", en: "Take off your sandals at the Humble Stone to enter the holy ground with Moses." },
  ] as L[],
  sandalHint: { vi: "[A] Cởi dép", en: "[A] Take off sandals" } as L,
  sandals: [
    { vi: "Em cởi đôi dép đặt lên bệ đá. Mặt đất thánh ấm áp dưới đôi chân trần. Hàng rào phía trước đã mở ra.", en: "You take off your sandals and set them on the stone. The holy ground is warm under bare feet. The fence ahead opens." },
  ] as L[],
  stonesIntro: [
    { vi: "Lửa từ bụi cây chỉ đường: chín phiến đá sẽ sáng lên lần lượt. Em nhớ thứ tự rồi bước đúng lên từng phiến, với lòng tôn kính nhé.", en: "Fire from the bush shows the way: the stones will light up one by one. Remember the order and step on each in turn, with reverence." },
  ] as L[],
  stonesLabel: { vi: "Phiến đá", en: "Stones" } as L,
  stonesWatch: { vi: "Hãy xem lửa chỉ đường...", en: "Watch the fire show the way..." } as L,
  replayHint: { vi: "[A] Xem lại ánh lửa", en: "[A] Watch the fire again" } as L,
  stonesWrong: [{ vi: "Chưa đúng phiến đá rồi. Đừng lo, em hãy xem lại ánh lửa và bước chậm rãi nhé.", en: "Not the right stone. Don't worry: watch the fire again and walk slowly." }] as L[],
  stonesDone: [
    { vi: "Bốn phiến đá sáng rực! Em đã đứng trước mặt Chúa với lòng tôn kính. Môi-sê che mặt, vì ông sợ nhìn vào Thiên Chúa. (Xh 3, 6)", en: "All four stones glow! You stand before God with reverence. Moses hides his face, afraid to look at God. (Ex 3:6)" },
    { vi: "Thiên Chúa phán: “Ta đã thấy cảnh dân Ta cực nhọc ở Ai Cập... Vậy bây giờ, hãy đi! Ta sai ngươi đến cùng Pha-ra-ô.” (Xh 3, 7.10) Môi-sê rụt rè: “Con là ai mà dám đi? Họ sẽ không tin con đâu!” (Xh 3, 11; 4, 1)", en: "God says: “I have seen the misery of my people in Egypt... So now, go! I send you to Pharaoh.” (Ex 3:7.10) Moses hesitates: “Who am I? They will not believe me!” (Ex 3:11; 4:1)" },
    { vi: "Chúa trao cho ông ba dấu lạ. Em hãy giúp Môi-sê thực hành từng dấu nhé.", en: "God gives him three signs. Help Moses perform each one." },
  ] as L[],
  moses1: { vi: "[A] Ném gậy xuống đất (Dấu 1)", en: "[A] Throw down the staff (Sign 1)" } as L,
  moses2: { vi: "[A] Đặt tay vào ngực (Dấu 2)", en: "[A] Put the hand to the chest (Sign 2)" } as L,
  moses3: { vi: "[A] Nói chuyện với Môi-sê", en: "[A] Talk to Moses" } as L,
  timingHint: { vi: "Nhấn A khi vạch trượt vào vùng sáng!", en: "Press A when the marker is in the bright zone!" } as L,
  sign1: [
    { vi: "Dấu lạ 1: Môi-sê ném cây gậy xuống đất, và gậy hóa thành rắn! (Xh 4, 3) Chúa phán: “Hãy nắm lấy đuôi nó.” Em căn nhịp: nhấn A khi vạch trượt vào vùng sáng để nắm đuôi rắn.", en: "Sign 1: Moses throws his staff down and it becomes a snake! (Ex 4:3) God says: “Take it by the tail.” Time it: press A when the marker is in the bright zone to catch the tail." },
  ] as L[],
  sign1Done: [{ vi: "Môi-sê nắm đuôi rắn, và nó hóa lại thành cây gậy trong tay ông. (Xh 4, 4)", en: "Moses seizes the tail and it becomes a staff in his hand again. (Ex 4:4)" }] as L[],
  sign2: [
    { vi: "Dấu lạ 2: Môi-sê đặt tay vào ngực, rút ra thì bàn tay trắng bệch vì bệnh phong! (Xh 4, 6) Em căn nhịp hai lần để chữa lành bàn tay nhé.", en: "Sign 2: Moses puts his hand into his cloak and it comes out white with disease! (Ex 4:6) Time it twice to heal the hand." },
  ] as L[],
  sign2Done: [{ vi: "Môi-sê lại đặt tay vào ngực, và bàn tay trở lại hồng hào khỏe mạnh. (Xh 4, 7)", en: "Moses puts his hand back and it is healthy and rosy again. (Ex 4:7)" }] as L[],
  handLabel: { vi: "Chữa tay", en: "Healing" } as L,
  sign3: [
    { vi: "Dấu lạ 3: nước sông Nin đổ xuống đất khô sẽ hóa thành máu. (Xh 4, 9) Em múc nước ở bình, rồi đổ lần lượt vào ba rãnh đá, từ rãnh số 1 đến số 3 nhé.", en: "Sign 3: Nile water poured on dry ground will become blood. (Ex 4:9) Fill a jar at the pot, then pour into the three grooves in order, from number 1 to 3." },
  ] as L[],
  waterHint: { vi: "[A] Múc nước sông Nin", en: "[A] Take Nile water" } as L,
  grooveHint: { vi: "[A] Đổ nước vào rãnh", en: "[A] Pour water" } as L,
  grooveWrong: [{ vi: "Nước đổ sai thứ tự rồi! Các rãnh khô lại. Em đổ từ rãnh số 1 đến số 3 nhé.", en: "Wrong order! The grooves dry up. Pour from groove 1 to 3." }] as L[],
  grooveLabel: { vi: "Rãnh đá", en: "Grooves" } as L,
  name: [
    { vi: "Môi-sê thưa: “Nếu dân hỏi tên Người là gì, con sẽ nói sao?” Thiên Chúa phán: “TA LÀ ĐẤNG HẰNG HỮU.” Người nói tiếp: “Ngươi sẽ nói với con cái Ít-ra-en: Đấng Hằng Hữu đã sai tôi đến với anh em.” (Xh 3, 13-14)", en: "Moses asks: “If they ask me his name, what shall I say?” God says: “I AM WHO I AM.” And: “Say to the Israelites: I AM has sent me to you.” (Ex 3:13-14)" },
    { vi: "Môi-sê còn nói: “Con vụng về ăn nói.” Chúa đáp: “Ai đã làm ra miệng con người? Ta sẽ ở với ngươi, và anh ngươi là A-ha-rôn sẽ nói thay.” (Xh 4, 10-16)", en: "Moses adds: “I am slow of speech.” God answers: “Who made the mouth? I will be with you, and your brother Aaron will speak for you.” (Ex 4:10-16)" },
  ] as L[],
  outro: [
    { vi: "Môi-sê vâng lời, cầm cây gậy Thiên Chúa, từ biệt ông Giê-trô và lên đường trở về Ai Cập cùng vợ con. (Xh 4, 18-20) Ấn Dấu thứ 3 khắc sáng lên Bia Đá.", en: "Moses obeys, takes the staff of God, bids Jethro farewell and sets out for Egypt with his family. (Ex 4:18-20) The 3rd Seal shines on the Tablet." },
  ] as L[],
  lesson: { vi: "Hãy giữ lòng tôn kính, trang nghiêm khi bước vào Nhà Thờ, là đất thánh của Chúa. Khi Chúa giao việc khó, Chúa sẽ ban ơn giúp chúng ta hoàn thành.", en: "Keep reverence when you enter church, the Lord's holy ground. When God gives a hard task, He gives the grace to finish it." } as L,
  cutscene: [
    { vi: "Trên đường trở về, Môi-sê gặp anh mình là A-ha-rôn ở núi Thiên Chúa. Hai anh em hôn nhau, và Môi-sê kể lại mọi lời Chúa phán. (Xh 4, 27-28)", en: "On the way back Moses meets his brother Aaron at the mountain of God. The brothers kiss, and Moses tells him all the Lord said. (Ex 4:27-28)" },
  ] as L[],
};

/** Stage 4 (Xh 7, 14 – 9, 35): Pharaoh's courtyard, three rounds of warning signs against the Shield of a Hard Heart. */
export const STAGE4 = {
  speaker: "Sân Cung Điện",
  intro: [
    { vi: "“Đức Chúa, Thiên Chúa của người Híp-ri, đã sai tôi đến nói với ngài rằng: ‘Hãy thả dân Ta ra để chúng đi thờ phượng Ta trong sa mạc!’ Nhưng cho đến nay ngài đã không nghe.” (Xh 7, 16)", en: "“The Lord, the God of the Hebrews, sent me to say: ‘Let my people go, so that they may worship me in the desert.’ But until now you have not listened.” (Ex 7:16)" },
    { vi: "Môi-sê và A-ha-rôn đứng trước ngai vàng Pha-ra-ô. Nhà vua kiêu ngạo dựng lên ba lớp khiên cứng lòng, và các thuật sĩ tung ra những vòng khói ảo thuật để cản đường.", en: "Moses and Aaron stand before Pharaoh's throne. The proud king raises three shields of a hard heart, and his magicians send out rings of magic smoke to block the way." },
  ] as L[],
  start: [
    { vi: "A-ha-rôn: “Em ơi, hãy tránh các vòng khói! Chạm vào đài dấu lạ và nhấn A để cây gậy của Chúa làm việc. Em có ba giọt Bình An trong mỗi vòng.”", en: "Aaron: “Child, dodge the smoke rings! Stand at a sign altar and press A so God's staff can work. You have three drops of Peace in each round.”" },
  ] as L[],
  phase: [
    { vi: "Vòng 1/3: Nước hóa máu", en: "Round 1/3: Water to blood" },
    { vi: "Vòng 2/3: Hàng rào Gô-sen", en: "Round 2/3: The Goshen line" },
    { vi: "Vòng 3/3: Mưa đá & châu chấu", en: "Round 3/3: Hail and locusts" },
  ] as L[],
  altarHint: { vi: "[A] Giương gậy", en: "[A] Raise the staff" } as L,
  columnHint: { vi: "[A] Chạm gậy vào cột nước", en: "[A] Touch the water column" } as L,
  postHint: { vi: "[A] Dựng hàng rào", en: "[A] Raise the fence" } as L,
  herdHint: { vi: "[A] Gọi vào mái che", en: "[A] Call to shelter" } as L,
  beamHint: { vi: "[A] Dẫn luồng sáng", en: "[A] Guide the light" } as L,
  round1: [
    { vi: "Vòng 1: Chạm gậy vào ba cột nước. Nước sông Nin hóa máu, ếch nhái tràn vào cung điện. (Xh 7, 19 – 8, 2)", en: "Round 1: Touch the three water columns. The Nile turns to blood and frogs flood the palace. (Ex 7:19 – 8:2)" },
  ] as L[],
  round1Done: [
    { vi: "Các thuật sĩ lùi lại, thốt lên: “Đây là ngón tay của Thiên Chúa!” (Xh 8, 15) Nhưng Pha-ra-ô vẫn cứng lòng. Lớp khiên thứ nhất vỡ tan.", en: "The magicians step back and cry: “This is the finger of God!” (Ex 8:15) Yet Pharaoh stays hard-hearted. The first shield shatters." },
  ] as L[],
  round2: [
    { vi: "Vòng 2: Ruồi nhặng và dịch bệnh tràn khắp Ai Cập, nhưng đất Gô-sen của dân Chúa được che chở. Em dựng ba đoạn hàng rào để phân ranh. (Xh 8, 18; 9, 4)", en: "Round 2: Flies and disease sweep Egypt, but Goshen, the land of God's people, is spared. Raise three pieces of fence to mark the border. (Ex 8:18; 9:4)" },
  ] as L[],
  round2Done: [
    { vi: "Vùng Gô-sen bình yên, gia súc của dân Chúa không hề hấn gì. Lớp khiên thứ hai vỡ tan.", en: "Goshen is at peace; the herds of God's people are untouched. The second shield shatters." },
  ] as L[],
  round3: [
    { vi: "Vòng 3: Mưa đá lẫn lửa sắp trút xuống. Ai kính sợ Lời Chúa hãy đưa gia súc vào mái che. (Xh 9, 20) Em gọi người chăn bò, rồi dẫn ba luồng sáng lên trời.", en: "Round 3: Hail mixed with fire is about to fall. Whoever fears the word of the Lord must bring the herds under shelter. (Ex 9:20) Call the herdsman, then guide three beams of light to the sky." },
  ] as L[],
  herdDone: [{ vi: "Người chăn bò kính sợ Lời Chúa dắt đàn gia súc vào mái che an toàn.", en: "The herdsman who fears the word of the Lord leads his cattle under shelter." }] as L[],
  hit: [{ vi: "Vòng khói ảo thuật làm em choáng váng! Đừng lo, em cứ bước sang bên để tránh nhé.", en: "A magic smoke ring dazes you! Don't worry, step aside to dodge it." }] as L[],
  pharaoh: [
    { vi: "Pha-ra-ô: “Được, ta sẽ thả dân ngươi đi!” (Xh 9, 28) ... nhưng khi tai ương lui đi, ông lại nuốt lời và cứng lòng như trước. (Xh 9, 34-35)", en: "Pharaoh: “Very well, I will let your people go!” (Ex 9:28) ... but when the plague ends, he breaks his word and hardens his heart as before. (Ex 9:34-35)" },
  ] as L[],
  outro: [
    { vi: "Dù thấy tận mắt quyền năng Thiên Chúa và nhiều lần hứa thả dân ra, lòng Pha-ra-ô vẫn chai đá. Ấn Dấu thứ 4 khắc sáng lên Bia Đá.", en: "Though he sees God's power with his own eyes and promises many times to let the people go, Pharaoh's heart stays like stone. The 4th Seal shines on the Tablet." },
  ] as L[],
  lesson: { vi: "Đừng bao giờ sống cứng lòng, ngoan cố hay thất hứa như Pha-ra-ô. Hãy có trái tim mềm mại, biết lắng nghe lời khuyên dạy tốt lành.", en: "Never live hard-hearted, stubborn or breaking your promises like Pharaoh. Keep a soft heart that listens to good advice." } as L,
  cutscene: [
    { vi: "Ai Cập còn phải chịu thêm nhiều tai ương nữa. Rồi một đêm, bóng tối dày đặc phủ kín cả đất nước, trừ vùng Gô-sen. (Xh 10, 21-23)", en: "Egypt would suffer more plagues. Then one day a thick darkness covered the whole land, except Goshen. (Ex 10:21-23)" },
  ] as L[],
  shieldLabel: { vi: "Khiên Cứng Lòng", en: "Hard-Heart Shield" } as L,
};

/** Stage 5 (Xh 10, 21-29): the Goshen oil lamps and bronze mirrors against the thick darkness. */
export const STAGE5 = {
  speaker: "Làng Gô-sen",
  intro: [
    { vi: "“Ông Môi-sê giơ tay lên trời, và có bóng tối dày đặc trên khắp đất Ai Cập suốt ba ngày. Người ta không nhìn thấy nhau... nhưng tất cả con cái Ít-ra-en đều có ánh sáng trong nơi mình ở.” (Xh 10, 22-23)", en: "“Moses stretched out his hand toward the sky, and a thick darkness covered the land of Egypt for three days. No one could see another... but all the Israelites had light where they lived.” (Ex 10:22-23)" },
    { vi: "Bóng tối dày đặc đang tràn qua ranh giới. Hãy giúp các gia đình Gô-sen thắp sáng tám trụ đèn dầu và nối chúng thành một vòng đai ánh sáng!", en: "The thick darkness is creeping over the border. Help the Goshen families light eight oil lamps and join them into a ring of light!" },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Con ơi, lấy dầu ở chum giữa làng rồi thắp đèn. Đèn mới thắp sẽ yếu dần sau 15 giây, trừ khi được nối bằng tia sáng với đèn bên cạnh. Ở bốn góc, hãy xoay gương đồng hướng vào trong làng.”", en: "Moses: “Child, take oil from the jar in the middle of the village and light the lamps. A new flame fades after 15 seconds unless a beam of light joins it to the next lamp. At the four corners, turn the bronze mirror to face into the village.”" },
  ] as L[],
  oilHint: { vi: "[A] Lấy dầu", en: "[A] Take oil" } as L,
  oilFull: { vi: "Đã đầy dầu", en: "Torch is full" } as L,
  lampHint: { vi: "[A] Thắp đèn", en: "[A] Light the lamp" } as L,
  lampNoOil: { vi: "Hết dầu! Về chum dầu", en: "No oil! Go to the jar" } as L,
  lampOn: { vi: "Đèn đang cháy", en: "Lamp is burning" } as L,
  mirrorHint: { vi: "[A] Xoay gương", en: "[A] Turn the mirror" } as L,
  progress: { vi: "Vòng đai ánh sáng", en: "Ring of light" } as L,
  oilOn: { vi: "Có dầu", en: "Oil: yes" } as L,
  oilOff: { vi: "Hết dầu", en: "Oil: none" } as L,
  lost: [
    { vi: "Em đi vào bóng tối mà đuốc đã hết dầu nên lạc hướng. Đừng lo, em được đưa về bên đèn sáng gần nhất.", en: "You walked into the darkness with an empty torch and lost your way. Don't worry, you are led back beside the nearest lit lamp." },
  ] as L[],
  firstLink: [
    { vi: "Hai đèn nối nhau bằng tia sáng! Bóng tối ở đó bị đẩy lùi, và hai đèn không còn tắt nữa.", en: "Two lamps joined by a beam! The darkness there is pushed back, and the two lamps will not go out again." },
  ] as L[],
  outro: [
    { vi: "Cả làng Gô-sen bừng sáng giữa đêm tối của Ai Cập, các gia đình Ít-ra-en bình an cầu nguyện, sẵn sàng cho đêm trọng đại nhất. Ấn Dấu thứ 5 khắc sáng.", en: "All of Goshen shines in the darkness of Egypt; the Israelite families pray in peace, ready for the greatest night. The 5th Seal shines." },
  ] as L[],
  lesson: { vi: "Nơi nào có Chúa hiện diện và gia đình biết cầu nguyện chung với nhau, nơi đó luôn tràn ngập ánh sáng bình an dù thế giới bên ngoài có tối tăm.", en: "Wherever God is present and the family prays together, peace and light fill the place, even when the world outside is dark." } as L,
  cutscene: [
    { vi: "Pha-ra-ô vẫn không chịu thả dân đi. Chúa báo trước tai ương cuối cùng, và Người truyền cho dân Ít-ra-en giữ Lễ Vượt Qua. (Xh 11, 4-5; 12, 1-14)", en: "Pharaoh still refuses to let the people go. The Lord announces the final plague, and tells Israel to keep the Passover. (Ex 11:4-5; 12:1-14)" },
  ] as L[],
};

export const STAGE6 = {
  speaker: "Đêm Vượt Qua",
  intro: [
    { vi: "“Chúng sẽ lấy máu chiên mà bôi lên hai thành cửa và thanh ngang... Nhờ thấy máu, Ta sẽ vượt qua, không giáng tai ương tiêu diệt các ngươi.” (Xh 12, 7.13)", en: "“They shall take some of the blood and put it on the two doorposts and the lintel... When I see the blood, I will pass over you, and no plague will destroy you.” (Ex 12:7,13)" },
    { vi: "Đêm trăng tròn đã đến. Hãy giúp các gia đình Ít-ra-en chuẩn bị bữa tiệc Vượt Qua, rồi bôi máu chiên lên cửa mười ngôi nhà trước nửa đêm!", en: "The full-moon night has come. Help the Israelite families prepare the Passover meal, then mark ten doors with the lamb's blood before midnight!" },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Con ơi, hãy chuẩn bị đúng như Chúa truyền: chiên nướng lửa, bánh không men và rau đắng. Rồi nhắc ba người trong nhà: thắt lưng gọn, mang dép, cầm gậy, vì ta sẽ ăn vội vã.”", en: "Moses: “Child, prepare everything as the Lord commands: roast lamb, unleavened bread and bitter herbs. Then remind three family members: belt tied, sandals on, staff in hand, for we eat in haste.”" },
  ] as L[],
  roast: { vi: "[A] Quay chiên nướng", en: "[A] Turn the lamb" } as L,
  roastDone: { vi: "Chiên đã chín vàng", en: "The lamb is roasted" } as L,
  knead: { vi: "[A] Nhào bột (không men)", en: "[A] Knead the dough" } as L,
  kneadDone: { vi: "Bánh không men đã xong", en: "Unleavened bread is ready" } as L,
  kneadFail: { vi: "Bột dậy men mất rồi! Nhào lại cho nhanh nhé.", en: "The dough started to rise! Knead again, faster." } as L,
  herbs: { vi: "[A] Hái rau đắng", en: "[A] Pick bitter herbs" } as L,
  herbsDone: { vi: "Rau đắng đã hái", en: "Bitter herbs picked" } as L,
  belt: { vi: "[A] Nhắc cha: thắt lưng gọn", en: "[A] Tell father: tie the belt" } as L,
  sandals: { vi: "[A] Nhắc mẹ: mang dép", en: "[A] Tell mother: put on sandals" } as L,
  staff: { vi: "[A] Nhắc em bé: cầm gậy", en: "[A] Tell the child: take the staff" } as L,
  ready: { vi: "Sẵn sàng!", en: "Ready!" } as L,
  progress1: { vi: "Chuẩn bị", en: "Preparing" } as L,
  prepDone: [
    { vi: "Môi-sê: “Bữa tiệc đã sẵn sàng! Giờ hãy cầm cành kinh giới, nhúng vào máu chiên, rồi bôi lên hai thành cửa và thanh ngang của cả mười nhà. Nửa đêm sắp đến rồi!”", en: "Moses: “The meal is ready! Now take the hyssop, dip it in the lamb's blood and mark the two doorposts and the lintel of all ten houses. Midnight is near!”" },
  ] as L[],
  bowl: { vi: "[A] Nhúng kinh giới vào máu chiên", en: "[A] Dip hyssop in the blood" } as L,
  bowlFull: { vi: "Kinh giới đã đẫm máu", en: "Hyssop is dipped" } as L,
  door: { vi: "[A] Bôi máu lên cửa", en: "[A] Mark the door" } as L,
  doorNoBlood: { vi: "Hết máu! Về chậu máu giữa làng", en: "No blood! Go to the bowl" } as L,
  doorDone: { vi: "Cửa đã có dấu máu", en: "Door is marked" } as L,
  home: { vi: "[A] Vào nhà, đóng cửa", en: "[A] Go in and shut the door" } as L,
  progress2: { vi: "Cửa", en: "Doors" } as L,
  blood: { vi: "Máu", en: "Blood" } as L,
  midnight: { vi: "Nửa đêm", en: "Midnight" } as L,
  late: [
    { vi: "Nửa đêm sắp điểm mà em chưa xong. Đừng lo, ta thử lại từ chậu máu nhé, và đi theo lộ trình ngắn hơn!", en: "Midnight is almost here and you are not done. Don't worry, try again from the bowl, and take a shorter route!" },
  ] as L[],
  gust: { vi: "Gió đêm lạnh làm em chậm bước.", en: "The cold night wind slows you down." } as L,
  outro: [
    { vi: "Đúng nửa đêm, Sứ Thần của Chúa đi qua đất Ai Cập. Thấy máu chiên trên khung cửa, Người đã “vượt qua”, gìn giữ mọi gia đình Ít-ra-en bình an. Pha-ra-ô kinh hoàng giục Môi-sê và toàn dân rời Ai Cập ngay trong đêm! Ấn Dấu thứ 6 khắc sáng. (Xh 12, 29-32)", en: "At midnight the Lord's messenger passed through Egypt. Seeing the blood on the doorposts, He “passed over” and kept every Israelite family safe. Terrified, Pharaoh urged Moses and the people to leave Egypt that very night! The 6th Seal shines. (Ex 12:29-32)" },
  ] as L[],
  lesson: { vi: "Chiên Vượt Qua ngày xưa là hình ảnh của Chúa Giêsu Kitô, Chiên Thiên Chúa, Đấng đã đổ máu đào trên Thập Giá để cứu chúng ta khỏi cái chết muôn đời.", en: "The Passover lamb foreshadows Jesus Christ, the Lamb of God, who shed His blood on the Cross to save us from eternal death." } as L,
  cutscene: [
    { vi: "Dân Ít-ra-en lên đường trong đêm, có Chúa đi trước dẫn lối. Nhưng Pha-ra-ô đổi ý và cho chiến xa đuổi theo... (Xh 13, 21; 14, 5-9)", en: "Israel sets out in the night with the Lord leading the way. But Pharaoh changes his mind and sends chariots after them... (Ex 13:21; 14:5-9)" },
  ] as L[],
};

export const STAGE7 = {
  speaker: "Biển Đỏ",
  intro: [
    { vi: "“Đức Chúa đi trước họ, ban ngày trong cột mây để dẫn đường, ban đêm trong cột lửa để soi sáng... Nước rẽ ra, và con cái Ít-ra-en đi vào giữa biển trên đất khô cạn, nước làm thành bức tường cho họ ở bên phải và bên trái.” (Xh 13, 21; 14, 22)", en: "“The Lord went before them in a pillar of cloud by day to lead them, and in a pillar of fire by night to give them light... The water was a wall to them on their right and on their left.” (Ex 13:21; 14:22)" },
    { vi: "Biển Đỏ đã rẽ đôi! Hãy giúp ba nhóm dân đi qua lòng biển khô, giữ tường nước khỏi đổ, và để Cột Lửa chặn chiến xa Ai Cập.", en: "The Red Sea has parted! Help three groups of people cross the dry seabed, keep the water walls steady, and let the Pillar of Fire stop the Egyptian chariots." },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Đừng sợ! Đức Chúa sẽ chiến đấu cho anh em. Con hãy làm hai việc: chạy lên giữ gió đông khi tường nước chực đổ, và dời Cột Lửa về đúng làn có chiến xa lao tới. Nhìn cột ô vuông bên trái màn hình: màu đỏ nhấp nháy là chiến xa sắp tới, màu vàng là nơi Cột Lửa đang đứng!”", en: "Moses: “Do not be afraid! The Lord will fight for you. Do two things: run ahead to hold the east wind when a water wall is about to fall, and move the Pillar of Fire to the lane where a chariot is rushing. Watch the squares on the left of the screen: flashing red means a chariot is coming, gold is where the Pillar stands!”" },
  ] as L[],
  pillar: { vi: "[A] Dời Cột Lửa sang làn này", en: "[A] Move the Pillar to this lane" } as L,
  wind: { vi: "[A] Giơ gậy, gọi gió đông", en: "[A] Raise the staff, call the east wind" } as L,
  windDone: { vi: "Tường nước đã vững", en: "The wall is steady" } as L,
  moses: { vi: "[A] Giơ tay trên biển", en: "[A] Stretch out your hand over the sea" } as L,
  progress: { vi: "Nhóm dân", en: "Groups" } as L,
  wall: { vi: "Tường nước", en: "Water wall" } as L,
  wallOk: { vi: "vững", en: "steady" } as L,
  wallBad: { vi: "chực đổ!", en: "falling!" } as L,
  halt: { vi: "Tường nước chực đổ! Đoàn dân dừng lại, chạy tới điểm gió đông nhé!", en: "A water wall is about to fall! The people stop. Run to the east-wind spot!" } as L,
  hit: { vi: "Chiến xa chạm tới đoàn dân! Hãy dời Cột Lửa kịp lúc hơn nhé.", en: "A chariot reached the people! Move the Pillar sooner next time." } as L,
  bog: { vi: "Ánh lửa thần linh làm bánh xe lún cát!", en: "The holy fire sinks the wheels in the sand!" } as L,
  lost: [
    { vi: "Chiến xa đã tới quá gần. Đừng lo, đoàn dân quay lại điểm xuất phát và ta thử lại nhé!", en: "The chariots came too close. Don't worry, the people go back to the start and we try again!" },
  ] as L[],
  groupDone: [
    [{ vi: "Nhóm thứ nhất đã tới Bờ Tự Do! Môi-sê: “Còn hai nhóm nữa, hãy vững lòng!”", en: "The first group reached the Shore of Freedom! Moses: “Two more groups, be strong!”" }] as L[],
    [{ vi: "Nhóm thứ hai đã qua biển an toàn! Chiến xa đang tới gần hơn, nhanh lên nào!", en: "The second group crossed safely! The chariots are closer, hurry!" }] as L[],
    [{ vi: "Nhóm cuối cùng đã lên bờ! Hãy chạy tới bên Môi-sê trên mỏm đá và giơ tay lên trên biển.", en: "The last group is ashore! Run to Moses on the rock and stretch out your hand over the sea." }] as L[],
  ],
  outro: [
    { vi: "Mặt biển khép lại êm đềm, nhấn chìm chiến xa Ai Cập dưới ánh bình minh. “Ngày hôm đó, Đức Chúa đã cứu Ít-ra-en khỏi tay người Ai Cập... Dân kính sợ Đức Chúa, và tin vào Đức Chúa cùng ông Môi-sê, tôi tớ của Người.” Ấn Dấu thứ 7 khắc sáng, khép lại Phần 1! (Xh 14, 30-31)", en: "The sea closes gently, sinking the Egyptian chariots in the dawn light. “That day the Lord saved Israel from the hand of the Egyptians... The people feared the Lord, and believed in the Lord and in his servant Moses.” The 7th Seal shines, closing Part 1! (Ex 14:30-31)" },
  ] as L[],
  lesson: { vi: "Biển Đỏ là hình ảnh của Bí tích Rửa Tội: nhờ nước Thánh Tẩy và quyền năng Chúa Thánh Thần, chúng ta được giải thoát khỏi nô lệ tội lỗi để bước vào đời sống mới tự do của con cái Chúa.", en: "The Red Sea foreshadows Baptism: through holy water and the power of the Holy Spirit we are freed from slavery to sin and enter the new, free life of God's children." } as L,
  cutscene: [
    { vi: "Bên kia Biển Đỏ, dân Ít-ra-en hát mừng Chúa. Nhưng hoang địa còn dài phía trước... (Xh 15, 1)", en: "On the far side of the Red Sea, Israel sings to the Lord. But the wilderness stretches long ahead... (Ex 15:1)" },
  ] as L[],
};

export const STAGE8 = {
  speaker: "Mi-ri-am",
  intro: [
    { vi: "“Nữ ngôn sứ Mi-ri-am, chị ông A-ha-rôn, tay cầm trống cơm, và tất cả các phụ nữ đều cầm trống cơm theo sau bà mà múa... Đến Ma-ra, họ không uống được nước vì nước đắng... Đức Chúa chỉ cho ông một cây gỗ; ông ném nó xuống nước, và nước liền hóa ngọt.” (Xh 15, 20.23.25)", en: "“The prophetess Miriam, Aaron's sister, took a tambourine in her hand, and all the women went out after her with tambourines and dancing... At Marah they could not drink the water, for it was bitter... The Lord showed him a piece of wood; he threw it into the water, and the water became sweet.” (Ex 15:20, 23, 25)" },
    { vi: "Hãy gõ nhịp trống cơm cùng cô Mi-ri-am để hát mừng Chúa, rồi tìm gỗ thánh làm ngọt hồ nước đắng Ma-ra nhé!", en: "Beat the tambourine with Miriam to sing for the Lord, then find the holy wood to sweeten the bitter waters of Marah!" },
  ] as L[],
  start: [
    { vi: "Mi-ri-am: “Con ơi, cầm trống cơm lên! Khi ô vuông vàng chạy vào khung trắng bên trên, hãy bấm [A] đúng nhịp. Ba đoạn ca, mỗi đoạn một nhịp nhanh hơn. Tạ ơn Chúa nào!”", en: "Miriam: “Take up the tambourine! When a gold square runs into the white frame above, press [A] on the beat. Three verses, each a little faster. Let us thank the Lord!”" },
  ] as L[],
  verse: [
    { vi: "Đoạn 1: Tôi xin hát mừng Đức Chúa", en: "Verse 1: I will sing to the Lord" },
    { vi: "Đoạn 2: Người đã chiến thắng oai hùng", en: "Verse 2: He has triumphed gloriously" },
    { vi: "Đoạn 3: Đức Chúa là sức mạnh của tôi", en: "Verse 3: The Lord is my strength" },
  ] as L[],
  beat: { vi: "Bấm [A] đúng nhịp!", en: "Press [A] on the beat!" } as L,
  verseFail: { vi: "Mi-ri-am: “Không sao! Nghe nhịp trống rồi hát lại đoạn này nhé.”", en: "Miriam: “It's fine! Listen to the drum and sing this verse again.”" } as L,
  verseOk: { vi: "Hay lắm! Cả đoàn dân hát vang theo.", en: "Wonderful! The whole people sing along." } as L,
  songDone: [
    { vi: "Mi-ri-am: “Cả dân đã hát mừng Chúa! Nhưng ba ngày đi trong sa mạc, chúng ta chưa có giọt nước nào...”", en: "Miriam: “The whole people sang to the Lord! But for three days in the desert we have had no water...”" },
  ] as L[],
  marahIntro: [
    { vi: "Ma-ra! Nước đắng tím sẫm, không ai uống được. Môi-sê kêu cầu Chúa, và Chúa chỉ cho ông những khúc gỗ chữa lành trên các tảng đá.", en: "Marah! The water is bitter and violet; no one can drink it. Moses cries to the Lord, and He shows him healing logs on the rocks." },
    { vi: "Môi-sê: “Làm hai việc nhé: [A] xoay phiến đá để chặn dòng bùn, rồi mang khúc gỗ thả xuống hồ. Bùn đục sẽ làm hồ đắng trở lại đấy!”", en: "Moses: “Two things: [A] turn the dam stone to stop the mud, then carry a log to the pool. Mud makes a pool bitter again!”" },
  ] as L[],
  log: { vi: "[A] Nhặt khúc gỗ chữa lành", en: "[A] Pick up the healing log" } as L,
  logHeld: { vi: "Con đã cầm một khúc gỗ rồi", en: "You already hold a log" } as L,
  stone: { vi: "[A] Xoay phiến đá chặn bùn", en: "[A] Turn the stone to stop the mud" } as L,
  stoneDone: { vi: "Bùn đã bị chặn", en: "Mud is stopped" } as L,
  pool: { vi: "[A] Thả khúc gỗ xuống hồ", en: "[A] Drop the log in the pool" } as L,
  poolNoLog: { vi: "Hồ đắng: cần khúc gỗ", en: "Bitter pool: needs a log" } as L,
  mudBack: { vi: "Bùn đục chảy vào hồ! Hồ lại đắng rồi. Hãy xoay phiến đá chặn bùn trước rồi thả gỗ lại nhé.", en: "Muddy water flowed in! The pool is bitter again. Turn the stone to stop the mud first, then drop the log again." } as L,
  mudHit: { vi: "Dòng bùn trơn trượt làm rơi khúc gỗ! Gỗ quay về tảng đá.", en: "The slippery mud made you drop the log! It goes back to its rock." } as L,
  gate: { vi: "[A] Bước vào ốc đảo Ê-lim", en: "[A] Enter the oasis of Elim" } as L,
  gateLocked: { vi: "Cổng Ê-lim: làm ngọt cả 3 hồ", en: "Elim gate: sweeten all 3 pools" } as L,
  progress1: { vi: "Điểm nhịp", en: "Beat" } as L,
  progress2: { vi: "Hồ ngọt", en: "Sweet pools" } as L,
  outro: [
    { vi: "Dân chúng uống nước ngọt lành và nghỉ dưới bóng chà là Ê-lim, nơi có 12 suối nước và 70 cây chà là. Chúa phán: “Chính Ta là Đức Chúa, Đấng chữa lành ngươi.” Ấn Dấu thứ 8 khắc sáng! (Xh 15, 26-27)", en: "The people drink sweet water and rest in the shade of the palms at Elim, with its 12 springs and 70 palm trees. The Lord says: “I am the Lord, your healer.” The 8th Seal shines! (Ex 15:26-27)" },
  ] as L[],
  lesson: { vi: "Khúc gỗ làm ngọt nước Ma-ra báo trước Cây Thánh Giá Chúa Giêsu: khi biết dâng nỗi buồn và khó khăn cho Chúa, Người biến vị đắng cuộc đời thành niềm vui và bình an.", en: "The wood that sweetened Marah foreshadows the Cross of Jesus: when we offer our sadness and trials to Him, He turns life's bitterness into joy and peace." } as L,
  cutscene: [
    { vi: "Rời Ê-lim, đoàn dân tiến vào hoang địa Xin. Bụng đã đói, họ bắt đầu kêu ca... (Xh 16, 1-3)", en: "Leaving Elim, the people enter the wilderness of Sin. Hungry, they begin to murmur... (Ex 16:1-3)" },
  ] as L[],
};

export const STAGE9 = {
  speaker: "Môi-sê",
  intro: [
    { vi: "“Đức Chúa phán với ông Môi-sê: ‘Này Ta sẽ làm cho bánh từ trời mưa xuống cho các ngươi; dân sẽ ra lượm khẩu phần mỗi ngày ngày nào cho ngày đó’... Nhà Ít-ra-en đặt tên cho vật ấy là Mân-na; nó giống như hạt ngò, màu trắng, và có vị như bánh làm bằng mật ong.” (Xh 16, 4.31)", en: "“The Lord said to Moses: ‘I will rain bread from heaven for you; the people shall go out and gather a day's portion every day’... The house of Israel called it manna; it was like coriander seed, white, and tasted like wafers made with honey.” (Ex 16:4, 31)" },
    { vi: "Hãy lượm Mân-na cho đúng khẩu phần từng lều trước khi nắng lên làm tan nhé!", en: "Gather the manna for each tent's exact portion before the sun melts it!" },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Con ơi, Chúa ban bánh từ trời! [A] nhặt cụm Mân-na (giỏ chứa tối đa 3 Ô-me), rồi [A] đặt vào lều. Mỗi lều cần ĐÚNG số Ô-me ghi trên lều: người lượm nhiều cũng không dư, người lượm ít cũng không thiếu.”", en: "Moses: “Child, the Lord gives bread from heaven! [A] pick up manna clumps (your basket holds 3 omers), then [A] put them in a tent. Each tent needs EXACTLY the omers shown: those who gathered much had nothing over, those who gathered little had no lack.”" },
    { vi: "Môi-sê: “Coi chừng vệt nắng chạy từ phải sang trái: Mân-na nào chưa nhặt sẽ tan chảy. Nhặt phía bên phải trước nhé!”", en: "Moses: “Watch the sunbeam sweeping from right to left: any manna not gathered will melt. Gather on the right first!”" },
  ] as L[],
  r1Ok: { vi: "Môi-sê: “Đủ cho cả ba lều! Hôm nay dân no bụng. Nhưng ngày mai là ngày thứ Sáu...”", en: "Moses: “Enough for all three tents! The people are fed today. But tomorrow is the sixth day...”" } as L,
  r2Intro: [
    { vi: "Ngày thứ Sáu! Chúa truyền lượm GẤP ĐÔI để dành cho ngày Sa-bát (Xh 16, 22-26). Số trên lều là số người: hãy nhân đôi!", en: "The sixth day! The Lord commands a DOUBLE portion for the Sabbath (Ex 16:22-26). The number on a tent is its people: double it!" },
    { vi: "A-ha-rôn: “Hãy đem thêm 1 Ô-me cho ta, để ta đặt vào bình vàng giữ trước mặt Chúa cho các thế hệ mai sau.” (Xh 16, 33)", en: "Aaron: “Bring me 1 more omer, and I will place it in the golden jar before the Lord for future generations.” (Ex 16:33)" },
  ] as L[],
  r2Ok: { vi: "Môi-sê: “Đủ gấp đôi, lại còn một Ô-me trong bình vàng. Mai là Sa-bát, ngày nghỉ thánh của Chúa.”", en: "Moses: “A double portion, and one omer in the golden jar. Tomorrow is the Sabbath, the Lord's holy rest.”" } as L,
  r3Intro: [
    { vi: "Ngày thứ Bảy, Sa-bát. Chúa không ban Mân-na ngày này (Xh 16, 26-27). Vài người thiếu kiên nhẫn đang định chạy ra đồng tìm Mân-na!", en: "The seventh day, the Sabbath. The Lord gives no manna today (Ex 16:26-27). Some impatient people are about to run out to the field looking for manna!" },
    { vi: "Môi-sê: “Con hãy đến gần và [A] nhắc họ quay về nghỉ ngơi trước khi họ ra tới đồng.”", en: "Moses: “Go close and [A] remind them to come back and rest before they reach the field.”" },
  ] as L[],
  melted: { vi: "Nắng đã làm tan Mân-na, không còn đủ cho các lều. Ta thử lại buổi sáng này nhé!", en: "The sun melted the manna; there is not enough for the tents. Let us try this morning again!" } as L,
  spoiled: { vi: "Lều nhận thừa Ô-me: phần giữ lại bị hỏng! Mỗi lều chỉ cần đúng khẩu phần. Ta chia lại nhé.", en: "A tent got too many omers: the extra spoiled! Each tent needs only its exact portion. Let us share again." } as L,
  sabbathFail: { vi: "Có người đã ra tới đồng, nhưng chẳng có gì cả! Hãy nhắc mọi người nghỉ ngơi sớm hơn nhé.", en: "Someone reached the field, but there was nothing! Remind everyone to rest a little sooner." } as L,
  pile: { vi: "[A] Nhặt Mân-na", en: "[A] Pick up manna" } as L,
  pileFull: { vi: "Giỏ đầy (tối đa 3 Ô-me)", en: "Basket full (3 omers max)" } as L,
  tent: { vi: "[A] Đặt Mân-na vào lều", en: "[A] Put manna in the tent" } as L,
  jar: { vi: "[A] Đưa 1 Ô-me cho A-ha-rôn", en: "[A] Give 1 omer to Aaron" } as L,
  jarWrong: { vi: "Cần đúng 1 Ô-me!", en: "Exactly 1 omer!" } as L,
  jarEmpty: { vi: "Giỏ đang trống", en: "Your basket is empty" } as L,
  walker: { vi: "[A] Nhắc nhở: hôm nay là ngày nghỉ", en: "[A] Remind: today is a day of rest" } as L,
  round: [
    { vi: "Ngày thường", en: "Weekday" },
    { vi: "Ngày thứ Sáu (×2)", en: "Friday (×2)" },
    { vi: "Ngày Sa-bát", en: "Sabbath" },
  ] as L[],
  basket: { vi: "Giỏ", en: "Basket" } as L,
  reminded: { vi: "Đã nhắc", en: "Reminded" } as L,
  outro: [
    { vi: "Con cái Ít-ra-en được nuôi bằng Bánh bởi trời suốt 40 năm, cho tới ngày đặt chân vào Đất Hứa (Xh 16, 35). Ấn Dấu thứ 9 khắc sáng!", en: "The Israelites ate the bread from heaven for 40 years, until they reached the Promised Land (Ex 16:35). The 9th Seal shines!" },
  ] as L[],
  lesson: { vi: "Khi đọc kinh Lạy Cha: “Xin Cha cho chúng con hôm nay lương thực hằng ngày”, ta học tín thác nơi Chúa và không tham lam. Mân-na báo trước Bí tích Thánh Thể, Bánh Trường Sinh Chúa Giêsu ban tặng (Ga 6, 32-35).", en: "When we pray the Our Father, “Give us this day our daily bread,” we learn to trust the Lord and not be greedy. Manna foreshadows the Eucharist, the Bread of Life Jesus gives (Jn 6:32-35)." } as L,
  cutscene: [
    { vi: "Rời hoang địa Xin, đoàn dân tiến tới Rê-phi-đim. Ở đó chẳng có nước cho dân uống... (Xh 17, 1)", en: "Leaving the wilderness of Sin, the people reach Rephidim. There is no water for them to drink... (Ex 17:1)" },
  ] as L[],
};

export const STAGE10 = {
  speaker: "Môi-sê",
  intro: [
    { vi: "“Đức Chúa phán với ông Môi-sê: ‘Ngươi sẽ đập vào tảng đá, từ đó nước sẽ chảy ra cho dân uống’... Khi nào ông Môi-sê giơ tay lên thì Ít-ra-en thắng thế; còn khi ông hạ tay xuống thì A-ma-lếch thắng thế... Hai ông A-ha-rôn và Khua đỡ tay ông, thế là tay ông cứ giơ vững cho đến lúc mặt trời lặn.” (Xh 17, 6.11-12)", en: "“The Lord said to Moses: ‘You shall strike the rock, and water will come out of it for the people to drink’... Whenever Moses held up his hand, Israel prevailed; when he lowered it, Amalek prevailed... Aaron and Hur held up his hands, so his hands remained steady until the sun set.” (Ex 17:6, 11-12)" },
    { vi: "Hãy giúp Môi-sê mở nguồn nước, rồi cùng đỡ đôi tay cầu nguyện của ông nhé!", en: "Help Moses open the water, then help hold up his praying hands!" },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Dân khát nước quá! Chúa bảo ta đập vào tảng đá Khô-rép. Con hãy đến gần tảng đá, thấy ba mạch sáng chạy qua lại. Khi mạch Ở GIỮA (có khung trắng) sáng lên, hãy [A] giáng gậy!”", en: "Moses: “The people are so thirsty! The Lord told me to strike the rock at Horeb. Go near the rock: three veins glow in turn. When the MIDDLE vein (the white frame) lights up, [A] strike with the staff!”" },
    { vi: "Môi-sê: “Phải đập trúng tâm 3 lần liên tiếp. Đập lệch là phải đếm lại từ đầu, đừng nản nhé!”", en: "Moses: “Hit the centre 3 times in a row. A missed strike means starting the count again, do not lose heart!”" },
  ] as L[],
  hit: { vi: "Trúng tâm!", en: "Centre hit!" } as L,
  miss: { vi: "Lệch rồi, đếm lại!", en: "Missed, start again!" } as L,
  rock: { vi: "[A] Giáng gậy vào tảng đá", en: "[A] Strike the rock" } as L,
  springOk: { vi: "Tảng đá nứt ra, nước mát tuôn trào! Cả dân reo mừng và uống thỏa thuê. (Xh 17, 6)", en: "The rock cracks and cool water gushes out! The people cheer and drink their fill. (Ex 17:6)" } as L,
  hillIntro: [
    { vi: "Bỗng quân A-ma-lếch kéo đến tấn công! Giu-suê dẫn quân ra giữ thung lũng, còn Môi-sê, A-ha-rôn và Khua lên đỉnh đồi cầu nguyện. (Xh 17, 8-10)", en: "Suddenly Amalek attacks! Joshua leads the men to hold the valley while Moses, Aaron and Hur climb the hill to pray. (Ex 17:8-10)" },
    { vi: "Môi-sê: “Gió lốc làm tay ta mỏi dần. Hãy nhặt [A] NGỌN LỬA CẦU NGUYỆN đem cho A-ha-rôn (bên trái) hoặc Khua (bên phải) để họ giữ tay ta thật cao. Nếu hòn đá ta ngồi bị gió xô đi, hãy đặt lại cho ta nhé. Giữ vững đến lúc mặt trời lặn!”", en: "Moses: “The whirlwind tires my arms. Pick up a PRAYER FLAME with [A] and bring it to Aaron (left) or Hur (right) so they keep my hands high. If the wind shoves away the stone I sit on, set it back for me. Hold on until the sun sets!”" },
  ] as L[],
  flame: { vi: "[A] Nhặt Ngọn Lửa Cầu Nguyện", en: "[A] Pick up a Prayer Flame" } as L,
  stone: { vi: "[A] Nhặt Hòn Đá Điểm Tựa", en: "[A] Pick up the Seat Stone" } as L,
  aaron: { vi: "[A] Tiếp sức cho A-ha-rôn", en: "[A] Strengthen Aaron" } as L,
  hur: { vi: "[A] Tiếp sức cho Khua", en: "[A] Strengthen Hur" } as L,
  mosesSeat: { vi: "[A] Đặt Hòn Đá cho Môi-sê", en: "[A] Set the stone for Moses" } as L,
  needFlame: { vi: "Cần Ngọn Lửa", en: "Needs a Flame" } as L,
  needStone: { vi: "Cần Hòn Đá", en: "Needs the Stone" } as L,
  gust: { vi: "Gió lốc!", en: "Whirlwind!" } as L,
  stoneLost: { vi: "Gió xô mất hòn đá!", en: "The wind shoved the stone!" } as L,
  failStone: { vi: "Môi-sê không có đá để ngồi nên ngã xuống! Nhớ đặt lại hòn đá điểm tựa ngay khi gió xô đi nhé.", en: "Moses had no stone to sit on and slipped! Remember to set the seat stone back as soon as the wind shoves it away." } as L,
  stoneWarn: { vi: "Tìm đá!", en: "Find the stone!" } as L,
  failHill: { vi: "Tay Môi-sê mỏi quá, quân Giu-suê bị đẩy lùi! Ta thử lại, nhớ tiếp sức đều cả hai bên nhé.", en: "Moses' hands grew too weary and Joshua's men were pushed back! Let us try again, and keep both sides strong." } as L,
  time: { vi: "Đến hoàng hôn", en: "Until sunset" } as L,
  left: { vi: "Trái", en: "Left" } as L,
  right: { vi: "Phải", en: "Right" } as L,
  outro: [
    { vi: "Mặt trời lặn, Giu-suê toàn thắng! Ông Môi-sê dựng một bàn thờ và đặt tên là “Đức Chúa là Ngọn Cờ của tôi” (Xh 17, 15). Ấn Dấu thứ 10 khắc sáng!", en: "The sun sets and Joshua wins! Moses builds an altar and names it “The Lord is my Banner” (Ex 17:15). The 10th Seal shines!" },
  ] as L[],
  lesson: { vi: "Lời cầu nguyện kiên trì và sự nâng đỡ nhau thật có sức mạnh. Khi cha mẹ, thầy cô hay bạn bè mệt mỏi, lời cầu nguyện và việc giúp nhỏ bé của con cũng như A-ha-rôn và Khua đỡ đôi tay Môi-sê.", en: "Persistent prayer and helping one another are powerful. When parents, teachers or friends are weary, our prayers and small acts of help are like Aaron and Hur holding up the hands of Moses." } as L,
  cutscene: [
    { vi: "Đoàn dân tiến tới chân núi Xi-nai, nơi Chúa sẽ ban Giao Ước. (Xh 19, 1-2)", en: "The people reach the foot of Mount Sinai, where the Lord will give the Covenant. (Ex 19:1-2)" },
  ] as L[],
};

export const STAGE11 = {
  speaker: "Môi-sê",
  intro: [
    { vi: "“Núi Xi-nai toàn khối bốc khói, vì Đức Chúa ngự xuống trên đó trong lửa... Bấy giờ Thiên Chúa phán tất cả những lời sau đây: ‘Ta là Đức Chúa, Thiên Chúa của ngươi, Đấng đã đưa ngươi ra khỏi đất Ai Cập, khỏi cảnh nô lệ. Ngươi không được có thần nào khác đối nghịch với Ta...’” (Xh 19, 18; 20, 1-3)", en: "“Mount Sinai was wrapped in smoke, for the Lord descended upon it in fire... Then God spoke all these words: ‘I am the Lord your God, who brought you out of Egypt, out of the house of slavery. You shall have no other gods before me...’” (Ex 19:18; 20:1-3)" },
    { vi: "Hãy giúp dân đứng đúng ranh giới thánh, rồi cùng Môi-sê leo lên đỉnh núi nhé!", en: "Help the people keep to the holy boundary, then climb the mountain with Moses!" },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Chúa dặn ta đặt ranh giới quanh chân núi, để dân đứng xa và kính cẩn. Con hãy đến từng chỗ có vòng sáng và [A] cắm cột mốc nhé. Có 4 cột!”", en: "Moses: “The Lord told me to set a boundary around the foot of the mountain so the people stand back with reverence. Go to each glowing ring and [A] plant a marker. There are 4!”" },
  ] as L[],
  site: { vi: "[A] Cắm cột mốc ranh giới", en: "[A] Plant a boundary marker" } as L,
  planted: { vi: "Đã cắm", en: "Planted" } as L,
  markers: { vi: "Cột mốc", en: "Markers" } as L,
  climbIntro: [
    { vi: "Môi-sê: “Đủ bốn cột rồi! Giờ ta lên núi. Mây sấm và lửa thánh chắn ngang lối đi. Đứng chờ cho tới khi nghe TIẾNG TÙ VÀ vang lên và mây tách ra, rồi mới bước qua. Mây khép lại là sẽ bị đẩy xuống đó!”", en: "Moses: “All four markers are set! Now we climb. Storm clouds and holy fire block the path. Wait until you hear the SHOFAR and the clouds part, then step through. When they close, you will be pushed back!”" },
  ] as L[],
  waitHorn: { vi: "Chờ tiếng tù và!", en: "Wait for the shofar!" } as L,
  zapped: { vi: "Mây khép lại rồi!", en: "The clouds closed!" } as L,
  tier: [
    { vi: "Qua tầng mây thứ nhất", en: "First cloud passed" },
    { vi: "Qua tầng mây thứ hai", en: "Second cloud passed" },
    { vi: "Qua tầng mây thứ ba", en: "Third cloud passed" },
  ] as L[],
  climbHud: { vi: "Leo núi", en: "Climbing" } as L,
  joshua: [
    { vi: "Giu-suê: “Ta chờ ở đây. Chỉ mình Môi-sê và con được lên tiếp. Đi cẩn thận nhé!”", en: "Joshua: “I will wait here. Only Moses and you may go further. Be careful!”" },
  ] as L[],
  summit: [
    { vi: "Môi-sê: “Đỉnh Xi-nai! Thiên Chúa phán và chúng ta nghe: đây là MƯỜI ĐIỀU RĂN. Có 10 phiến chữ ánh sáng. Hãy nhặt từng phiến bằng [A], rồi đặt vào đúng Bia Đá theo thứ tự từ Điều Thứ Nhất đến Điều Thứ Mười.”", en: "Moses: “The summit of Sinai! God spoke and we listened: these are the TEN COMMANDMENTS. There are 10 light tablets. Pick each one up with [A], then place it on the right Stone in order, from the First to the Tenth.”" },
    { vi: "Môi-sê: “Nhớ nhé: Bia thứ nhất có 3 điều nói về việc mến Chúa. Bia thứ hai có 7 điều nói về việc yêu người.”", en: "Moses: “Remember: the first Stone holds 3 commandments about loving God. The second Stone holds 7 about loving people.”" },
  ] as L[],
  slab: { vi: "[A] Nhặt Phiến Chữ Ánh Sáng", en: "[A] Pick up a Light Tablet" } as L,
  bia1: { vi: "[A] Đặt vào Bia I (Mến Chúa)", en: "[A] Place on Stone I (Love God)" } as L,
  bia2: { vi: "[A] Đặt vào Bia II (Yêu người)", en: "[A] Place on Stone II (Love people)" } as L,
  needSlab: { vi: "Cần Phiến Chữ", en: "Needs a tablet" } as L,
  bia1Name: { vi: "Bia I", en: "Stone I" } as L,
  bia2Name: { vi: "Bia II", en: "Stone II" } as L,
  engraved: { vi: "Đã khắc", en: "Engraved" } as L,
  right: { vi: "Đúng rồi!", en: "Right!" } as L,
  wrong: { vi: "Chưa đúng chỗ!", en: "Not the right place!" } as L,
  /** One tablet per commandment, in order. `bia` = 0 (Stone I) or 1 (Stone II). `hint` shows when it is placed wrongly. */
  tablets: [
    { bia: 0, text: { vi: "Thờ một Thiên Chúa", en: "Worship one God" }, hint: { vi: "Điều đầu tiên: “Ngươi không được có thần nào khác đối nghịch với Ta.” (Xh 20, 3). Thuộc Bia I, và là điều ĐẦU của cả mười điều.", en: "The very first: “You shall have no other gods before me.” (Ex 20:3). Stone I, and first of all ten." } },
    { bia: 0, text: { vi: "Chớ kêu tên Chúa vô cớ", en: "Do not misuse God's name" }, hint: { vi: "“Ngươi không được dùng danh Đức Chúa mà làm điều vô ích.” (Xh 20, 7). Thuộc Bia I, sau điều thờ phượng.", en: "“You shall not misuse the name of the Lord.” (Ex 20:7). Stone I, after worship." } },
    { bia: 0, text: { vi: "Giữ ngày Chúa Nhật", en: "Keep the Lord's Day" }, hint: { vi: "“Hãy nhớ ngày Sa-bát mà coi là ngày thánh.” (Xh 20, 8). Thuộc Bia I, điều cuối của Bia này.", en: "“Remember the Sabbath day and keep it holy.” (Ex 20:8). Stone I, its last commandment." } },
    { bia: 1, text: { vi: "Thảo kính cha mẹ", en: "Honour your parents" }, hint: { vi: "“Hãy thảo kính cha mẹ.” (Xh 20, 12). Mở đầu Bia II: bắt đầu yêu người từ ngay trong gia đình.", en: "“Honour your father and mother.” (Ex 20:12). Opens Stone II: love people starting at home." } },
    { bia: 1, text: { vi: "Chớ giết người", en: "Do not kill" }, hint: { vi: "“Ngươi không được giết người.” (Xh 20, 13). Bia II, tôn trọng sự sống, không đánh đập, không thù ghét.", en: "“You shall not murder.” (Ex 20:13). Stone II: respect life, no hitting, no hatred." } },
    { bia: 1, text: { vi: "Giữ trong sạch", en: "Keep purity" }, hint: { vi: "“Ngươi không được ngoại tình.” (Xh 20, 14). Bia II, giữ thân thể và tâm hồn trong sạch.", en: "“You shall not commit adultery.” (Ex 20:14). Stone II: keep body and heart pure." } },
    { bia: 1, text: { vi: "Chớ lấy của người", en: "Do not steal" }, hint: { vi: "“Ngươi không được trộm cắp.” (Xh 20, 15). Bia II, tôn trọng đồ của người khác.", en: "“You shall not steal.” (Ex 20:15). Stone II: respect what belongs to others." } },
    { bia: 1, text: { vi: "Chớ làm chứng dối", en: "Do not lie" }, hint: { vi: "“Ngươi không được làm chứng gian hại người đồng loại.” (Xh 20, 16). Bia II, sống thành thật.", en: "“You shall not bear false witness.” (Ex 20:16). Stone II: be truthful." } },
    { bia: 1, text: { vi: "Giữ tâm hồn trong sáng", en: "Keep a clear heart" }, hint: { vi: "“Ngươi không được ham muốn vợ (chồng) người đồng loại.” (Xh 20, 17). Bia II, giữ lòng trong sáng.", en: "“You shall not covet your neighbour's wife.” (Ex 20:17). Stone II: keep the heart clear." } },
    { bia: 1, text: { vi: "Chớ tham của người", en: "Do not covet" }, hint: { vi: "“Ngươi không được ham muốn nhà cửa, của cải của người đồng loại.” (Xh 20, 17). Điều CUỐI cùng của Bia II.", en: "“You shall not covet your neighbour's house or goods.” (Ex 20:17). The very last of Stone II." } },
  ] as { bia: 0 | 1; text: L; hint: L }[],
  flyBack: { vi: "Phiến chữ bay về chỗ cũ", en: "The tablet flies back" } as L,
  allDone: [
    { vi: "Hai Bia Đá tỏa sáng rực rỡ! Đây không phải xiềng xích cấm đoán, mà là CON ĐƯỜNG TỰ DO VÀ HẠNH PHÚC Chúa Cha trao để bảo vệ dân Người khỏi rơi lại vào cảnh nô lệ tội lỗi.", en: "The two Stones shine brightly! They are not chains of prohibition but the PATH OF FREEDOM AND HAPPINESS the Father gives to keep his people from falling back into the slavery of sin." },
  ] as L[],
  hud: { vi: "Điều Răn đã khắc", en: "Engraved" } as L,
  outro: [
    { vi: "Thiên Chúa viết Mười Điều Răn lên hai bia đá bằng chính ngón tay của Người (Xh 31, 18). Ấn Dấu thứ 11 khắc sáng!", en: "God wrote the Ten Commandments on two tablets of stone with his own finger (Ex 31:18). The 11th Seal shines!" },
  ] as L[],
  lesson: { vi: "Hãy thuộc lòng và sống Mười Điều Răn mỗi ngày, tóm lại trong hai điều răn trọng nhất: Mến Chúa hết lòng và Yêu người thân cận như chính mình (Mt 22, 37-40).", en: "Learn the Ten Commandments by heart and live them every day, summed up in the two greatest: love God with all your heart and love your neighbour as yourself (Mt 22:37-40)." } as L,
  cutscene: [
    { vi: "Môi-sê ở lại trên núi lâu quá, dưới chân núi dân chúng bắt đầu sốt ruột... (Xh 32, 1)", en: "Moses stays so long on the mountain that the people at its foot grow restless... (Ex 32:1)" },
  ] as L[],
};

/** Stage 12 (Xh 32, 1-34; 34, 1-10): the golden calf, the carving of two new tablets, Moses' intercession. */
export const STAGE12 = {
  speaker: "Môi-sê",
  intro: [
    { vi: "“Dân thấy ông Môi-sê cứ ở mãi trên núi chưa xuống, liền tụ họp quanh ông A-ha-rôn... làm thành một con bê đúc... Ông Môi-sê khẩn khoản nài xin Đức Chúa, Thiên Chúa của ông... Đức Chúa đi qua trước mặt ông và xướng lên: ‘Đức Chúa! Đức Chúa! Thiên Chúa nhân hậu và từ bi, hay nén giận, giàu nhân nghĩa và thành tín!’” (Xh 32, 1.4.11; 34, 6)", en: "“When the people saw that Moses was delayed in coming down, they gathered around Aaron... and made a molten calf... Moses implored the Lord his God... The Lord passed before him and proclaimed: ‘The Lord, the Lord, a God merciful and gracious, slow to anger, abounding in love and faithfulness!’” (Ex 32:1.4.11; 34:6)" },
    { vi: "Hãy giúp Môi-sê dẹp tan khói mê muội của bê vàng, đẽo lại hai bia đá mới và mang lên núi để cầu xin Chúa thứ tha nhé!", en: "Help Moses clear the smoke of the golden calf, carve two new tablets and carry them up the mountain to ask the Lord's forgiveness!" },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Dân đã để cái bê vàng chiếm chỗ của Chúa trong lòng. Khói từ bốn lò đúc làm họ mê muội, và những VÒNG SÓNG MÊ MUỘI tỏa ra từ bệ tượng. Con hãy bước qua khe hở của vòng sóng, đến từng lò và [A] gạt đổ nó. Rồi ta sẽ đập tan bệ tượng!”", en: "Moses: “The people let a calf take the Lord's place in their hearts. Smoke from four furnaces has dazed them, and RINGS OF DELUSION spread from the statue's base. Slip through the gaps in the rings, go to each furnace and [A] knock it over. Then we will smash the statue's base!”" },
  ] as L[],
  forge: { vi: "[A] Gạt đổ lò đúc vàng", en: "[A] Topple the gold furnace" } as L,
  forgeOut: { vi: "Lò đã tắt", en: "Furnace out" } as L,
  forgeHud: { vi: "Lò đúc đã tắt", en: "Furnaces out" } as L,
  forgesDone: [{ vi: "Môi-sê: “Cả bốn lò đã tắt! Giờ hãy đập tan bệ tượng bê vàng ở giữa trại.”", en: "Moses: “All four furnaces are out! Now smash the golden calf's base in the middle of the camp.”" }] as L[],
  calfLocked: { vi: "Hãy tắt hết bốn lò đúc trước đã!", en: "Put out all four furnaces first!" } as L,
  calf: { vi: "[A] Đập tan bệ tượng bê vàng", en: "[A] Smash the golden calf's base" } as L,
  smashed: [
    { vi: "Bệ tượng vỡ tan. Môi-sê: “Khói tan rồi. Nhìn xem, dân đang tỉnh lại và ăn năn.”", en: "The base shatters. Moses: “The smoke is gone. Look, the people are waking up and are sorry.”" },
    { vi: "Môi-sê: “Giờ ta phải xin Chúa thứ tha và nối lại Giao Ước. Chúa bảo ta đẽo hai bia đá mới. Cổng lên lán thợ đá đã mở, hãy theo ta!”", en: "Moses: “Now we must ask the Lord to forgive and renew the Covenant. He told me to carve two new tablets. The gate to the stonecutters' shelter is open, follow me!”" },
  ] as L[],
  ringHit: { vi: "Sóng mê muội!", en: "Wave of delusion!" } as L,
  carveIntro: [
    { vi: "Môi-sê: “Đây là phiến đá nguyên khối. Con hãy nhìn BIA MẪU bên cạnh, rồi [A] gọt bỏ những ô đá thừa để được đúng hình bia. Đừng gọt vào phần lõi nhé, đá sẽ nứt và ta phải bắt đầu lại!”", en: "Moses: “Here is a block of solid stone. Look at the MODEL TABLET beside it, then [A] chip away the extra cells to get the right shape. Do not chip the core, or the stone will crack and we must start again!”" },
  ] as L[],
  chip: { vi: "[A] Gọt ô đá này", en: "[A] Chip this cell" } as L,
  chipOk: { vi: "Gọt đúng!", en: "Well chipped!" } as L,
  cracked: [
    { vi: "Rắc! Con gọt vào phần lõi nên đá nứt rồi. Môi-sê: “Đừng lo, ta lấy khối đá mới cho con thử lại. Hãy so với Bia Mẫu thật kỹ nhé.”", en: "Crack! You chipped the core and the stone split. Moses: “Do not worry, here is a fresh block to try again. Compare it carefully with the model.”" },
  ] as L[],
  stoneDone: [
    { vi: "Phiến đá thứ nhất đã xong! Còn một phiến nữa.", en: "The first tablet is done! One more to go." },
    { vi: "Phiến đá thứ hai đã xong!", en: "The second tablet is done!" },
  ] as L[],
  carveHud: { vi: "Bia đã đẽo", en: "Tablets carved" } as L,
  model: { vi: "Bia mẫu", en: "Model" } as L,
  carryUp: [
    { vi: "Môi-sê: “Hai bia đá mới đã sẵn sàng! Giờ ta mang chúng lên hốc đá Xi-nai ngay lúc rạng đông. Gió lốc sa mạc sẽ cản bước: khi bụi gió cuốn lên, con đi chậm lại. Hãy chờ gió lặng rồi hãy bước qua.”", en: "Moses: “The two new tablets are ready! Now we carry them up to the rock cleft on Sinai at dawn. The desert whirlwind will slow you: when the dust rises you move slowly. Wait for the wind to calm, then step through.”" },
  ] as L[],
  gust: { vi: "Gió lốc! Chờ gió lặng.", en: "Whirlwind! Wait for it to calm." } as L,
  climbHud: { vi: "Mang bia lên núi", en: "Carrying the tablets up" } as L,
  niche: { vi: "[A] Đặt hai bia đá, cầu bầu cho dân", en: "[A] Set down the tablets and intercede for the people" } as L,
  atNiche: [
    { vi: "Môi-sê quỳ xuống, đặt hai bia đá mới trước Chúa. Đây là lúc ông cầu bầu cho dân, như một người mục tử sẵn sàng chịu phạt thay cho đoàn chiên của mình (Xh 32, 32).", en: "Moses kneels and lays the two new tablets before the Lord. This is the moment he intercedes for the people, a shepherd ready to bear the penalty for his flock (Ex 32:32)." },
    { vi: "Con hãy giúp Môi-sê chọn lời cầu xin đúng nhé.", en: "Help Moses choose the right prayer." },
  ] as L[],
  prayer: [
    { label: { vi: "Xin Chúa nhớ lời hứa với Áp-ra-ham, I-xa-ác, Gia-cóp và tha thứ cho dân", en: "Lord, remember your promise to Abraham, Isaac and Jacob and forgive the people" }, right: true },
    { label: { vi: "Xin Chúa bỏ dân này, chỉ chọn riêng con thôi", en: "Lord, abandon this people and choose only me" }, right: false },
    { label: { vi: "Xin Chúa cho dân làm lại con bê vàng cho đẹp hơn", en: "Lord, let the people make a nicer golden calf" }, right: false },
  ] as { label: L; right: boolean }[],
  prayerWrong: [
    { vi: "Môi-sê lắc đầu: “Không phải thế. Ta không bao giờ bỏ dân của mình, và cũng không xin Chúa cho họ thờ thần giả. Hãy xin lòng thương xót!”", en: "Moses shakes his head: “Not so. I will never abandon my people, nor ask the Lord to let them serve a false god. Ask for mercy!”" },
  ] as L[],
  mercy: [
    { vi: "Đức Chúa đi qua trước mặt ông Môi-sê và xướng lên: “Đức Chúa! Đức Chúa! Thiên Chúa nhân hậu và từ bi, hay nén giận, giàu nhân nghĩa và thành tín!” (Xh 34, 6)", en: "The Lord passed before Moses and proclaimed: “The Lord, the Lord, a God merciful and gracious, slow to anger, abounding in love and faithfulness!” (Ex 34:6)" },
    { vi: "Chúa tha thứ cho dân và viết lại Mười Điều Răn lên hai bia đá mới. Khi Môi-sê xuống núi, da mặt ông tỏa sáng vì đã chuyện trò với Chúa (Xh 34, 29)!", en: "The Lord forgives the people and writes the Ten Commandments again on the two new tablets. When Moses comes down, his face shines because he has spoken with the Lord (Ex 34:29)!" },
  ] as L[],
  outro: [
    { vi: "Ấn Dấu thứ 12 khắc sáng! Nhờ lời cầu bầu của Môi-sê, Giao Ước được nối lại.", en: "The 12th Seal shines! Through Moses' intercession the Covenant is renewed." },
  ] as L[],
  lesson: { vi: "Đừng để tiền bạc, trò chơi hay bất cứ “thần tượng” nào chiếm chỗ của Chúa trong lòng. Hãy học Môi-sê cầu nguyện cho người khác và tin vào Lòng Thương Xót vô biên của Thiên Chúa.", en: "Never let money, games or any “idol” take God's place in your heart. Learn from Moses to pray for others and to trust God's boundless mercy." } as L,
  cutscene: [
    { vi: "Giao Ước được nối lại. Toàn dân tự nguyện dâng vàng bạc, vải quý để dựng một Nơi Thánh cho Chúa ngự giữa họ... (Xh 35, 4-29)", en: "The Covenant is renewed. The whole people freely offer gold, silver and fine cloth to build a Sanctuary where the Lord may dwell among them... (Ex 35:4-29)" },
  ] as L[],
};

/** Stage 13 (Xh 35 – 40): raise the Tabernacle in three spaces, then the Glory of the Lord and the bridge to the Promised Land. */
export const STAGE13 = {
  speaker: "Môi-sê",
  intro: [
    { vi: "“Họ sẽ làm cho Ta một Nơi Thánh, và Ta sẽ ở giữa họ... Ông Môi-sê hoàn tất công việc. Bấy giờ đám mây bao phủ Lều Hội Ngộ, và vinh quang Đức Chúa tràn ngập Nhà Tạm.” (Xh 25, 8; 40, 33-34)", en: "“Let them make me a sanctuary, that I may dwell among them... So Moses finished the work. Then the cloud covered the Tent of Meeting, and the glory of the Lord filled the Tabernacle.” (Ex 25:8; 40:33-34)" },
    { vi: "Dân Ít-ra-en đã dâng nhiều đến mức ông Môi-sê phải bảo ngừng mang thêm (Xh 36, 5-6). Hãy cùng Môi-sê, Bơ-xan-ên và Ô-hô-li-áp dựng Nhà Tạm đúng như Chúa chỉ trên núi!", en: "The Israelites gave so much that Moses told them to stop bringing more (Ex 36:5-6). Help Moses, Bezalel and Oholiab raise the Tabernacle just as the Lord showed on the mountain!" },
  ] as L[],
  start: [
    { vi: "Môi-sê: “Nhà Tạm có ba nơi: SÂN NGOÀI, NƠI THÁNH và NƠI CỰC THÁNH. Ta bắt đầu ở sân ngoài: kéo ròng rọc dựng ba hàng rào vải gai, đặt Bàn Thờ Lễ Toàn Thiêu trước cửa lều, rồi đặt Chậu Đồng giữa bàn thờ và lều, và đổ đầy nước thanh tẩy.”", en: "Moses: “The Tabernacle has three spaces: the OUTER COURTYARD, the HOLY PLACE and the HOLY OF HOLIES. We begin in the courtyard: pull the pulleys to raise three linen fences, set the Altar of Burnt Offering before the tent door, then place the Bronze Basin between the altar and the tent, and fill it with water.”" },
  ] as L[],
  pulley: { vi: "[A] Kéo ròng rọc dựng hàng rào", en: "[A] Pull the pulley to raise the fence" } as L,
  pulleyHud: { vi: "Hàng rào", en: "Fences" } as L,
  pickItem: { vi: "[A] Nhấc lên", en: "[A] Pick up" } as L,
  slotHere: { vi: "[A] Đặt vào đây", en: "[A] Set it here" } as L,
  needItem: { vi: "Hãy nhấc một thánh vật lên trước", en: "Pick up a sacred item first" } as L,
  springHint: { vi: "[A] Múc nước suối", en: "[A] Draw spring water" } as L,
  haveWater: { vi: "Đã múc nước", en: "Water drawn" } as L,
  laverFirst: { vi: "Hãy đặt Chậu Đồng trước đã", en: "Place the Bronze Basin first" } as L,
  pourHint: { vi: "[A] Đổ nước vào Chậu Đồng", en: "[A] Pour water into the Basin" } as L,
  washHint: { vi: "[A] Rửa tay trước khi vào Nơi Thánh", en: "[A] Wash your hands before the Holy Place" } as L,
  washNeedWater: { vi: "Chậu còn khô. Hãy múc nước suối đổ vào chậu.", en: "The basin is dry. Draw spring water and pour it in." } as L,
  washed: { vi: "Đã thanh tẩy", en: "Washed" } as L,
  courtDone: [
    { vi: "Môi-sê: “Sân Ngoài đã xong! A-ha-rôn và các tư tế sẽ rửa tay chân ở Chậu Đồng trước khi vào Lều. Con cũng rửa tay rồi vào Nơi Thánh nhé.”", en: "Moses: “The Courtyard is done! Aaron and the priests will wash hands and feet at the Basin before entering the Tent. Wash your hands too, then enter the Holy Place.”" },
  ] as L[],
  gateLocked: { vi: "Hãy rửa tay ở Chậu Đồng trước", en: "Wash your hands at the Basin first" } as L,
  wrongSpot: [
    { vi: "Môi-sê nhẹ nhàng nhắc: “Chưa đúng chỗ rồi con. Hãy xem lại chỉ dẫn trong Xh 40.”", en: "Moses gently reminds you: “That is not the right place yet. Look again at the instructions in Exodus 40.”" },
  ] as L[],
  courtHints: {
    altar: { vi: "Bàn Thờ Lễ Toàn Thiêu đặt ngay trước cửa Lều Hội Ngộ. (Xh 40, 6)", en: "The Altar of Burnt Offering goes right before the door of the Tent of Meeting. (Ex 40:6)" },
    laver: { vi: "Chậu Đồng đặt giữa Lều Hội Ngộ và bàn thờ, rồi đổ nước vào. (Xh 40, 7)", en: "The Basin goes between the Tent of Meeting and the altar, with water in it. (Ex 40:7)" },
  } as Record<"altar" | "laver", L>,
  holyIntro: [
    { vi: "Môi-sê: “Nơi Thánh: nhớ phương hướng nhé! Lều quay về hướng đông, con bước vào là nhìn về phía tây. BÀN BÁNH TIẾN đặt phía BẮC (bên phải con), CHÂN ĐÈN VÀNG phía NAM (bên trái con), còn BÀN THỜ HƯƠNG ở CHÍNH GIỮA, ngay trước bức màn.”", en: "Moses: “The Holy Place: mind the directions! The tent faces east, so as you enter you look west. The TABLE OF BREAD goes on the NORTH side (your right), the GOLDEN LAMPSTAND on the SOUTH (your left), and the ALTAR OF INCENSE in the very CENTRE, right before the veil.”" },
  ] as L[],
  tableHint: { vi: "Bàn Bánh Tiến đặt ở phía Bắc (bên phải khi bước vào). (Xh 40, 22)", en: "The Table of Bread goes on the north side (your right as you enter). (Ex 40:22)" } as L,
  lampHint: { vi: "Chân Đèn Vàng đặt ở phía Nam, đối diện bàn bánh (bên trái). (Xh 40, 24)", en: "The Golden Lampstand goes on the south side, facing the table (your left). (Ex 40:24)" } as L,
  incenseHint: { vi: "Bàn Thờ Hương Vàng đặt chính giữa, ngay trước bức màn. (Xh 40, 26)", en: "The Golden Altar of Incense goes in the centre, right before the veil. (Ex 40:26)" } as L,
  compassN: { vi: "BẮC", en: "N" } as L,
  compassS: { vi: "NAM", en: "S" } as L,
  lampsIntro: [
    { vi: "Môi-sê: “Giờ thắp bảy ngọn đèn dầu ô-liu. Hãy bắt đầu từ NGỌN GIỮA, rồi sáng dần ra hai bên: phải, trái, phải, trái.”", en: "Moses: “Now light the seven olive-oil lamps. Start from the MIDDLE lamp, then spread outward: right, left, right, left.”" },
  ] as L[],
  lamp: { vi: "[A] Thắp ngọn đèn", en: "[A] Light the lamp" } as L,
  lampWrong: { vi: "Sai thứ tự! Bắt đầu lại từ ngọn giữa.", en: "Wrong order! Begin again from the middle." } as L,
  lampsHud: { vi: "Đèn đã thắp", en: "Lamps lit" } as L,
  incense: { vi: "[A] Đốt hương thơm", en: "[A] Burn the incense" } as L,
  incenseFirst: { vi: "Hãy thắp bảy ngọn đèn trước", en: "Light the seven lamps first" } as L,
  holyDone: [
    { vi: "Môi-sê: “Nơi Thánh đã xong, hương thơm bay lên như lời cầu nguyện của dân. Giờ đến Nơi Cực Thánh, nơi cất giữ Hòm Bia Giao Ước.”", en: "Moses: “The Holy Place is complete; the incense rises like the prayers of the people. Now the Holy of Holies, where the Ark of the Covenant rests.”" },
  ] as L[],
  holiesIntro: [
    { vi: "Môi-sê: “Nơi Cực Thánh! Hãy cung kính rước Hai Bia Đá Chứng Ước đặt vào lòng Hòm Bia, rồi đặt Nắp Xá Tội có hai thần Kê-ru-bim bằng vàng lên trên, và căng Bức Màn Thánh phía sau.”", en: "Moses: “The Holy of Holies! Reverently carry the two Tablets of the Testimony into the Ark, then set the Mercy Seat with its two golden cherubim on top, and stretch the holy Veil behind.”" },
  ] as L[],
  tablets: { vi: "[A] Rước Hai Bia Đá Chứng Ước", en: "[A] Carry the Tablets of the Testimony" } as L,
  seat: { vi: "[A] Nhấc Nắp Xá Tội", en: "[A] Lift the Mercy Seat" } as L,
  ark: { vi: "[A] Đặt vào Hòm Bia", en: "[A] Place in the Ark" } as L,
  arkFirst: { vi: "Hãy đặt Hai Bia Đá vào Hòm Bia trước, rồi mới đặt Nắp Xá Tội.", en: "Put the Tablets in the Ark first, then the Mercy Seat." } as L,
  veil: { vi: "[A] Căng Bức Màn Thánh", en: "[A] Hang the holy Veil" } as L,
  veilFirst: { vi: "Hãy đặt xong Hòm Bia trước", en: "Finish the Ark first" } as L,
  holiesDone: [
    { vi: "Môi-sê: “Hòm Bia đã yên vị! Giờ chỉ còn treo tấm màn cổng sân ở lối vào, nơi con đã bước vào lúc đầu.”", en: "Moses: “The Ark is in place! Only the courtyard gate curtain remains, at the entrance where you first came in.”" },
  ] as L[],
  gate: { vi: "[A] Treo màn cổng sân", en: "[A] Hang the courtyard gate curtain" } as L,
  gateFirst: { vi: "Hãy hoàn tất Nơi Cực Thánh trước", en: "Finish the Holy of Holies first" } as L,
  stepHud: [
    { vi: "Sân Ngoài", en: "Courtyard" },
    { vi: "Nơi Thánh", en: "Holy Place" },
    { vi: "Nơi Cực Thánh", en: "Holy of Holies" },
    { vi: "Màn cổng sân", en: "Gate curtain" },
  ] as L[],
  glory: [
    { vi: "Ngay khi bức màn cổng sân được treo xong, Đám Mây Vinh Quang của Đức Chúa từ trời ngự xuống bao phủ Lều Hội Ngộ, và vinh quang Chúa tràn ngập Nhà Tạm! (Xh 40, 34)", en: "As soon as the courtyard curtain was hung, the Cloud of the Lord's Glory came down and covered the Tent of Meeting, and the glory of the Lord filled the Tabernacle! (Ex 40:34)" },
    { vi: "Ban ngày Đám Mây của Chúa ở trên Nhà Tạm, ban đêm có Lửa ở trong mây, trước mắt toàn nhà Ít-ra-en trên mọi chặng đường họ đi. (Xh 40, 38)", en: "By day the cloud of the Lord was over the Tabernacle, and by night there was fire in it, in the sight of all the house of Israel on all their journeys. (Ex 40:38)" },
  ] as L[],
  outro: [
    { vi: "Ấn Dấu thứ 13 khắc sáng! Hai Bia Đá Hành Trình đã đủ 13/13 Ấn Dấu!", en: "The 13th Seal shines! The Journey Tablets now hold all 13/13 Seals!" },
  ] as L[],
  lesson: { vi: "Thiên Chúa cao cả trên trời nhưng muốn ở gần con người (Emmanuel, Thiên Chúa ở cùng chúng ta). Nhà Tạm xưa báo trước Chúa Giêsu ngự thật trong Nhà Tạm Thánh Thể nơi nhà thờ, và Đức Trinh Nữ Maria, Hòm Bia Giao Ước Mới.", en: "God is great in heaven yet wants to be near us (Emmanuel, God with us). The ancient Tabernacle foreshadows Jesus truly present in the Eucharist in every church, and the Virgin Mary, the New Ark of the Covenant." } as L,
  bridge: [
    { speaker: "Hoang địa", lines: [
      { vi: "Sau khi Nhà Tạm được dựng nên, dân Ít-ra-en tiếp tục hành trình suốt 40 năm trong hoang địa, dưới sự dẫn dắt của Cột Mây và Cột Lửa, với Hòm Bia Giao Ước đồng hành che chở. Giờ đây đoàn dân đã tiến sát bờ cõi Đất Hứa bên kia sông Gio-đan.", en: "After the Tabernacle was raised, Israel kept travelling for 40 years in the wilderness, led by the pillar of cloud and fire, with the Ark of the Covenant going with them. Now the people stand at the edge of the Promised Land beyond the Jordan." },
    ] as L[] },
    { speaker: "Đỉnh núi Nê-vô", lines: [
      { vi: "Ông Môi-sê đã 120 tuổi nhưng mắt không mờ, khí lực không giảm. Chúa đưa ông lên đỉnh núi Nê-vô và chỉ cho ông thấy toàn cảnh Đất Hứa: “Đây là đất Ta đã thề hứa với Áp-ra-ham, I-xa-ác và Gia-cóp... Ta cho ngươi nhìn thấy tận mắt, nhưng ngươi sẽ không qua đó.” (Đnl 34, 4)", en: "Moses was 120 years old, yet his eyes were not dim and his strength had not left him. The Lord brought him up Mount Nebo and showed him the whole Promised Land: “This is the land I swore to Abraham, Isaac and Jacob... I let you see it with your eyes, but you shall not cross over.” (Dt 34:4)" },
    ] as L[] },
    { speaker: "Môi-sê và Giu-suê", lines: [
      { vi: "Môi-sê đặt tay lên Giu-suê, trao gậy và chúc lành: “Hãy mạnh bạo và can trường... Đức Chúa sẽ đi trước ngươi, Người sẽ ở cùng ngươi, Người không bỏ rơi ngươi đâu.” (Đnl 31, 7-8) Rồi ông Môi-sê an nghỉ trong tình thương của Chúa.", en: "Moses laid his hands on Joshua, handed him the staff and blessed him: “Be strong and courageous... The Lord himself goes before you; he will be with you; he will not leave you.” (Dt 31:7-8) Then Moses rested in the Lord's love." },
    ] as L[] },
    { speaker: "Sông Gio-đan", lines: [
      { vi: "Giu-suê lãnh đạo toàn dân tiến bước. Khi chân các tư tế khiêng Hòm Bia Giao Ước chạm mép nước sông Gio-đan, dòng nước liền rẽ đôi như năm xưa ở Biển Đỏ. Toàn dân hân hoan bước qua đất khô, tiến vào Đất Hứa. (Gs 3, 15-17) Hành trình Xuất Hành đã trọn vẹn!", en: "Joshua led the people on. When the feet of the priests carrying the Ark touched the edge of the Jordan, the waters parted as at the Red Sea long ago. The whole people crossed joyfully on dry ground into the Promised Land. (Josh 3:15-17) The Exodus journey is complete!" },
    ] as L[] },
  ],
};

/** Epilogue (Xh 12; Ga 6, 32-35; 1 Cr 10, 1-4): the Holy Spirit helps the child see how the Exodus points to Jesus. */
export const EPILOGUE = {
  speaker: "Chúa Thánh Thần",
  intro: [
    { vi: "“Lề Luật đã được Thiên Chúa ban qua ông Môi-sê, còn ân sủng và sự thật thì nhờ Đức Giê-su Ki-tô mà có.” (Ga 1, 17)", en: "“The law was given through Moses; grace and truth came through Jesus Christ.” (Jn 1:17)" },
    { vi: "Bình minh yên bình trong căn phòng nhỏ. Cuốn Kinh Thánh Xuất Hành mở bên Hai Bia Đá, Hòm Bia, Tàu Nô-ê, Cuộn Sáng Thế và Chuỗi Mân Côi, nối Cựu Ước sang Tân Ước.", en: "A calm dawn in the little room. The Book of Exodus lies open beside the Two Tablets, the Ark, Noah's Ark, the Genesis scroll and the Rosary, joining the Old Testament to the New." },
  ] as L[],
  start: [
    { vi: "Chúa Thánh Thần: “Con yêu dấu, con đã đi hết hành trình Xuất Hành! Giờ hãy cùng Ta xây ba nhịp cầu nối Cựu Ước với Chúa Giêsu. Đến từng chỗ có ánh sáng nhé!”", en: "Holy Spirit: “Dear child, you have walked the whole Exodus journey! Now let us build three bridges joining the Old Testament to Jesus. Go to each place that shines!”" },
  ] as L[],
  dove: { vi: "[A] Chúa Thánh Thần", en: "[A] Holy Spirit" } as L,
  bridgeHud: { vi: "Nhịp cầu", en: "Bridges" } as L,
  spots: [
    { vi: "[A] Bản Đồ Biển Đỏ", en: "[A] The Red Sea map" },
    { vi: "[A] Bàn học: Mân-na và nước từ đá", en: "[A] Desk: manna and water from the rock" },
    { vi: "[A] Góc cầu nguyện", en: "[A] Prayer corner" },
  ] as L[],
  order: { vi: "Hãy đi theo thứ tự các nhịp cầu: bản đồ, bàn học, rồi góc cầu nguyện.", en: "Follow the bridges in order: map, desk, then prayer corner." } as L,
  q1: { vi: "Chúa Thánh Thần: “Máu chiên bôi trên khung cửa cứu dân khỏi chết, và cuộc vượt qua Biển Đỏ báo trước về mầu nhiệm nào?”", en: "Holy Spirit: “The lamb's blood on the doorposts saved the people from death, and the crossing of the Red Sea. What mystery do they foretell?”" } as L,
  a1: [
    { label: { vi: "Chúa Giêsu, Chiên Thiên Chúa chịu chết trên Thập Giá, và Bí tích Rửa Tội đưa ta từ nô lệ tội lỗi sang tự do của con cái Chúa", en: "Jesus, the Lamb of God who died on the Cross, and Baptism, which brings us from slavery to sin into the freedom of God's children" }, right: true },
    { label: { vi: "Chỉ là một câu chuyện xưa, không liên quan gì đến chúng ta", en: "Just an old story that has nothing to do with us" }, right: false },
    { label: { vi: "Báo trước một cuộc đua thuyền trên sông Nin", en: "A boat race on the Nile" }, right: false },
  ] as { label: L; right: boolean }[],
  q2: { vi: "Chúa Thánh Thần: “Bánh Mân-na từ trời nuôi dân suốt 40 năm, và nước chảy ra từ tảng đá Khô-rép. Những điều ấy giúp con nhớ đến ơn lành nào mỗi khi đi lễ?”", en: "Holy Spirit: “Manna from heaven fed the people for 40 years, and water flowed from the rock at Horeb. What blessing do they bring to mind each time you go to Mass?”" } as L,
  a2: [
    { label: { vi: "Bí tích Thánh Thể: chính Mình và Máu Chúa Giêsu là Bánh Hằng Sống nuôi linh hồn ta trên đường về Quê Trời (Ga 6, 35)", en: "The Eucharist: the Body and Blood of Jesus, the Bread of Life that feeds our souls on the way to our heavenly home (Jn 6:35)" }, right: true },
    { label: { vi: "Món bánh ngon trong bữa tiệc sinh nhật", en: "A tasty cake at a birthday party" }, right: false },
    { label: { vi: "Cách xếp hàng mua nước ở giếng", en: "How to queue for water at the well" }, right: false },
  ] as { label: L; right: boolean }[],
  q3: { vi: "Chúa Thánh Thần: “Giờ hãy đặt Hai Bia Đá Hành Trình (13/13 Ấn Dấu) cạnh Cuộn Sáng Thế, Hải Đồ Nô-ê và Chuỗi Mân Côi. Con quyết tâm điều gì?”", en: "Holy Spirit: “Now set the Journey Tablets (13/13 Seals) beside the Genesis scroll, Noah's chart and the Rosary. What do you resolve?”" } as L,
  a3: [
    { label: { vi: "Vâng giữ Mười Điều Răn và năng viếng Chúa Giêsu Thánh Thể đang ngự trong Nhà Tạm nơi nhà thờ", en: "To keep the Ten Commandments and often visit Jesus in the Eucharist in the church tabernacle" }, right: true },
    { label: { vi: "Cất Hai Bia Đá vào ngăn kéo và quên đi", en: "Put the Tablets in a drawer and forget them" }, right: false },
    { label: { vi: "Chỉ giữ những điều răn nào dễ", en: "Keep only the easy commandments" }, right: false },
  ] as { label: L; right: boolean }[],
  wrong: [
    { vi: "Chúa Thánh Thần mỉm cười dịu dàng: “Chưa đúng đâu con. Hãy nhớ lại hành trình của chúng ta và thử lại nhé.”", en: "The Holy Spirit smiles gently: “Not quite, dear child. Remember our journey and try again.”" },
  ] as L[],
  right: [
    { vi: "Chúa Thánh Thần: “Đúng rồi! Một nhịp cầu nữa đã nối xong.”", en: "Holy Spirit: “Yes! Another bridge is joined.”" },
    { vi: "Chúa Thánh Thần: “Con nhìn thấy rồi: nhịp cầu thứ hai nối xong!”", en: "Holy Spirit: “You see it: the second bridge is joined!”" },
    { vi: "Chúa Thánh Thần: “Ba nhịp cầu đã nối trọn!”", en: "Holy Spirit: “All three bridges are joined!”" },
  ] as L[],
  finale: [
    { vi: "Hai Bia Đá Hành Trình tỏa sáng cạnh Cuộn Sáng Thế, Hải Đồ Nô-ê và Chuỗi Mân Côi. Từ Sáng Thế, qua Xuất Hành, đến Chúa Giêsu Ki-tô: một chương trình cứu độ duy nhất của Thiên Chúa.", en: "The Journey Tablets shine beside the Genesis scroll, Noah's chart and the Rosary. From Creation through the Exodus to Jesus Christ: one single plan of salvation from God." },
    { vi: "Chúa Thánh Thần: “Hãy sống tự do khỏi những thói hư tật xấu, vâng giữ Mười Điều Răn và yêu mến Bí tích Thánh Thể. Ta luôn ở cùng con!”", en: "Holy Spirit: “Live free from bad habits, keep the Ten Commandments and love the Eucharist. I am always with you!”" },
  ] as L[],
  lesson: { vi: "Tri ân công trình cứu độ kỳ diệu của Thiên Chúa, trải dài từ Sáng Thế và Xuất Hành đến Chúa Giêsu Ki-tô.", en: "Give thanks for God's wonderful work of salvation, from Creation and the Exodus to Jesus Christ." } as L,
  theEnd: [
    { vi: "HOÀN THÀNH HÀNH TRÌNH XUẤT HÀNH! Cảm ơn con đã cùng Môi-sê đi qua 13 chặng đường. Chúc con luôn bình an trong Chúa!", en: "EXODUS JOURNEY COMPLETE! Thank you for walking the 13 stages with Moses. May you always be at peace in the Lord!" },
  ] as L[],
};

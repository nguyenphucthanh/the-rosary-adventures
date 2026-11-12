/** Bilingual line. `tr` picks the player's current language (shared language toggle). */
import type { L } from "@/modules/shared/i18n";
export type { L };
export { tr } from "@/modules/shared/i18n";

// Stage dialogue objects (PROLOGUE, STAGE1..STAGE12, EPILOGUE) are added with each stage scene.
// Scripture quotes: Catholic text only (see AGENTS.md); mark unverified verses [kiểm lại CGKPV] in scripts.md.

import type { L as Line } from "@/modules/shared/i18n";
const L = (vi: string, en: string): Line => ({ vi, en });

/** Prologue (St 37, 1-4): the little room at night, the lamp, the three map pieces, Joseph appears. */
export const PROLOGUE = {
  intro: [
    L("Một buổi tối yên tĩnh, em mở Sách Sáng Thế ở những trang cuối. Bên chiếc đèn bàn có một tấm bản đồ cổ bị xé thành ba mảnh, và một chiếc áo choàng dài màu vàng cam như mặt trời.", "One quiet evening you open the Book of Genesis near its last pages. Beside the desk lamp lies an old map torn in three, and a long coat the colour of the sun."),
    L("Thánh Thần thì thầm: “Hãy giúp một cậu bé tên Giuse ghép lại hành trình của mình.”", "The Holy Spirit whispers: “Help a boy named Joseph piece his journey back together.”"),
  ],
  lampHint: L("[A] Thắp đèn bàn", "[A] Light the lamp"),
  mapHint: L("[A] Bản đồ cổ", "[A] Old map"),
  lampLit: [L("Ngọn đèn sáng lên ấm áp. Ba mảnh bản đồ lấp lánh quanh phòng. Hãy đi tìm chúng nhé!", "The lamp glows warmly. Three map pieces sparkle around the room. Go and find them!")],
  mapPartial: L("Bản đồ còn thiếu mảnh. Em đã nhặt {n}/3 mảnh.", "The map is still missing pieces. You have {n}/3."),
  pieceFound: L("Em nhặt được một mảnh bản đồ! ", "You found a map piece! "),
  pieces: [
    L("Hếp-rôn — cánh đồng lúa vàng, nhà của cha Gia-cóp.", "Hebron — golden wheat fields, the home of father Jacob."),
    L("Ai-cập — dòng sông Nin và cung điện Pha-ra-ô.", "Egypt — the river Nile and Pharaoh's palace."),
    L("Gô-sen — đồng cỏ xanh nơi cả gia đình đoàn tụ.", "Goshen — green pastures where the whole family is reunited."),
  ],
  mapStart: L("Hành trình của Giuse bắt đầu ở đâu? Hãy chọn mảnh đầu tiên.", "Where does Joseph's journey begin? Choose the first piece."),
  mapNext: L("Tiếp theo Giuse đi đâu? Chọn mảnh kế tiếp.", "Where does Joseph go next? Choose the next piece."),
  mapWrong: [L("Chưa đúng rồi. Giuse bắt đầu ở nhà, rồi bị đưa sang xứ xa, và cuối cùng được gặp lại gia đình. Thử lại nhé!", "Not yet. Joseph starts at home, is taken to a far land, and is finally reunited with his family. Try again!")],
  mapDone: [L("Bản đồ đã liền lại: Hếp-rôn → Ai-cập → Gô-sen. Một ánh sáng vàng như mặt trời dâng lên từ trang sách.", "The map is whole: Hebron → Egypt → Goshen. A golden light like the sun rises from the page.")],
  giuse: [
    L("Chào em. Anh là Giuse, con ông Gia-cóp, con thứ mười một trong mười hai anh em. (Anh không phải thánh Giuse bạn của Đức Mẹ đâu, cùng tên thôi nhé!)", "Hello! I'm Joseph, son of Jacob, the eleventh of twelve brothers. (I'm not Saint Joseph, Mary's husband. We just share a name!)"),
    L("Chiếc áo này cha tặng anh. Nó đã đi một chặng đường rất dài. Em đi cùng anh nhé? Mỗi chặng đường em hoàn thành sẽ thắp sáng một tia nắng trên áo.", "Dad gave me this coat. It has travelled a very long way. Will you come with me? Each stage you finish lights one sunray on the coat."),
    L("Điều quan trọng không phải là chiếc áo đẹp, mà là Ai luôn ở bên anh: chính Thiên Chúa.", "What matters is not a beautiful coat, but Who is always beside me: God himself."),
  ],
  lesson: L("Thiên Chúa luôn ở cạnh những người tin cậy Người, ngay cả trên những chặng đường xa.", "God is always beside those who trust in him, even on the longest roads."),
};

/** Stage 1 (St 37, 1-11): harvest 12 sheaves, then the dream. */
export const STAGE1 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Ông Ít-ra-en thương ông Giuse hơn tất cả các con khác... và may cho cậu một chiếc áo dài có tay.” (St 37, 3)", "“Israel loved Joseph more than all his other sons... and he made him a long coat with sleeves.” (Genesis 37:3)"),
    L("Trên cánh đồng lúa Hếp-rôn, mùa gặt đã đến. Giuse cùng các anh gặt lúa. Cậu mặc chiếc áo cha tặng, và đêm qua cậu có một giấc mơ lạ.", "On the wheat fields of Hebron the harvest has come. Joseph reaps with his brothers, wearing the coat his father gave him. Last night he had a strange dream."),
  ],
  start: [L("Em giúp anh gặt đủ 12 bó lúa nhé! Đứng gần bó lúa rồi bấm [A] để cắt.", "Help me reap twelve sheaves! Stand near one and press [A] to cut it.")],
  sheafHint: L("[A] Gặt bó lúa", "[A] Reap the sheaf"),
  slotHint: L("[A] Dựng bó lúa", "[A] Stand the sheaf"),
  centerFirst: L("Hãy dựng bó lúa của Giuse ở giữa trước, đúng như trong giấc mơ.", "Stand Joseph's own sheaf in the middle first, just as in the dream."),
  brotherHint: L("[A] Nói chuyện", "[A] Talk"),
  jacobHint: L("[A] Cha Gia-cóp", "[A] Father Jacob"),
  brotherTalk: [L("Các anh gặt lúa chăm chỉ, nhưng nhìn chiếc áo mới của Giuse với ánh mắt không vui. Cha thương út hơn chúng ta thật...", "The brothers reap hard, but look at Joseph's new coat with unhappy eyes. Father does love him more than us...")],
  jacobTalk: [L("Cha Gia-cóp mỉm cười: “Con của cha, hãy luôn cảm tạ Thiên Chúa về mọi điều con có nhé.”", "Father Jacob smiles: “My son, always thank God for everything you have.”")],
  phase: [L("Gặt lúa: {n}/12", "Sheaves reaped: {n}/12"), L("Giấc mơ: dựng bó lúa {n}/12", "The dream: sheaves placed {n}/12")],
  dreamStart: [
    L("Chiều xuống, Giuse thiếp đi giữa cánh đồng. Cả cánh đồng nhuốm ánh tím mơ màng... Giuse thấy mình đang dựng những bó lúa.", "Evening falls and Joseph drifts to sleep in the field. A dreamy violet glow fills the land... He sees himself standing up sheaves.")],
  dreamDone: [
    L("Mười một bó lúa của các anh cúi mình trước bó lúa của Giuse. Trên trời có mặt trời, mặt trăng và mười một vì sao.", "Eleven sheaves bow before Joseph's sheaf. In the sky shine the sun, the moon and eleven stars."),
    L("Giuse kể lại giấc mơ với các anh. Các anh nhăn mặt, nghe xong càng ghen ghét hơn. Còn cha Gia-cóp thì ghi nhớ lời ấy trong lòng. (St 37, 5-11)", "Joseph tells the dream to his brothers. They frown and grow even more jealous, while father Jacob keeps the words in his heart. (Genesis 37:5-11)"),
  ],
  outro: [L("Giuse chưa hiểu hết giấc mơ. Nhưng Thiên Chúa đã gieo một hạt giống hy vọng, và em đã thắp tia nắng thứ nhất.", "Joseph does not yet understand the dream, but God has planted a seed of hope. You lit the first sunray.")],
  lesson: L("Hãy biết ơn tình yêu của cha mẹ và đừng khoe khoang điều mình nhận được. Lời nói có thể làm người khác buồn.", "Be thankful for your parents' love and never boast about what you receive. Words can hurt others."),
};

/** Stage 2 (St 37, 12-17): forks in the hills. */
export const STAGE2 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Cha sai con đi xem các anh con và đàn chiên có được bình an không.” (St 37, 14)", "“Go and see whether it is well with your brothers and the flocks.” (Genesis 37:14)"),
    L("Các anh đã đem đàn chiên đi xa, tới vùng Sê-khem rồi Đô-than. Cha Gia-cóp sai Giuse mang bánh và nước đến thăm các anh. Đường đi qua nhiều ngã rẽ giữa đồi đá.", "The brothers have taken the flocks far away, to Shechem and then Dothan. Father Jacob sends Joseph with bread and water to see them. The road winds through many forks in the rocky hills."),
  ],
  start: [L("Mỗi ngã rẽ có một bảng chỉ đường. Hãy đọc kỹ, tìm 3 cột mốc đá, rồi mở lối tới Đô-than!", "Each fork has a signpost. Read it well, find the 3 stone cairns, and open the way to Dothan!")],
  signHint: L("[A] Bảng chỉ đường", "[A] Signpost"),
  signs: [
    L("Bảng chỉ đường: “Lối trên có dấu chân chiên. Lối dưới toàn gai góc.”", "Signpost: “The upper path has sheep tracks. The lower one is all thorns.”"),
    L("Bảng chỉ đường: “Lối trên đã bị đá lấp. Lối dưới có cột mốc.”", "Signpost: “The upper path is blocked with stones. The lower one has a cairn.”"),
    L("Bảng chỉ đường: “Cột mốc cuối ở lối trên, hướng về Đô-than.”", "Signpost: “The last cairn is on the upper path, towards Dothan.”"),
  ],
  cairnHint: L("[A] Cột mốc đá", "[A] Stone cairn"),
  cairnGot: L("Giuse đặt thêm một hòn đá lên cột mốc. Đúng đường rồi!", "Joseph adds a stone to the cairn. This is the right way!"),
  thorn: L("Ui da! Bụi gai làm Giuse đau. Đây là ngõ cụt rồi, quay lại thôi.", "Ouch! The thorns prick Joseph. A dead end. Let's go back."),
  strangerHint: L("[A] Người lạ", "[A] Stranger"),
  strangerTalk: [
    L("Giuse hỏi: “Bác có thấy các anh cháu cùng đàn chiên không ạ?”", "Joseph asks: “Have you seen my brothers and their flocks?”"),
    L("Người lạ đáp: “Họ đã rời nơi này rồi. Ta nghe họ nói: ‘Chúng ta hãy đi Đô-than.’ Cháu cứ đi tiếp nhé.” (St 37, 17)", "The stranger answers: “They have left. I heard them say, ‘Let us go to Dothan.’ Keep going.” (Genesis 37:17)"),
  ],
  gateHint: L("Cần đủ 3 cột mốc để đi tiếp", "Find all 3 cairns to continue"),
  gateOpen: L("Ba cột mốc đã sáng. Lối tới Đô-than mở ra!", "All three cairns shine. The road to Dothan opens!"),
  banner: L("Cột mốc: {n}/3", "Cairns: {n}/3"),
  outro: [L("Giuse vẫn tiếp tục đi, dù đường xa và các anh không còn ở đó. Cậu đi vì đã hứa vâng lời cha. Tia nắng thứ hai sáng lên.", "Joseph keeps walking, though the road is long and his brothers are not where they were. He goes because he promised to obey his father. The second sunray shines.")],
  lesson: L("Hãy vâng lời cha mẹ với lòng tin, dù đường còn xa và công việc khó.", "Obey your parents with trust, even when the road is long and the task is hard."),
};

/** Stage 3 (St 37, 18-28): the dry well. */
export const STAGE3 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Chúng nói với nhau: ‘Kìa, tay chuyên mơ mộng đến rồi!’” (St 37, 19)", "“They said to one another, ‘Here comes that dreamer!’” (Genesis 37:19)"),
    L("Các anh thấy Giuse từ xa và nổi lòng ghen ghét. Giuse không đánh trả. Em hãy giúp cậu giữ lòng bình an bằng lời cầu nguyện.", "The brothers see Joseph from afar and are filled with jealousy. Joseph does not strike back. Help him keep a peaceful heart through prayer."),
  ],
  start: [L("Các anh đang tiến lại gần, mặt đầy giận dữ. Đừng chạy! Khi một người đến gần, hãy bấm [A] để cầu nguyện, lòng bình an sẽ làm họ dịu lại.", "The brothers come closer, faces full of anger. Don't run! When one gets near, press [A] to pray; a peaceful heart calms them.")],
  prayHint: L("[A] Cầu nguyện", "[A] Pray"),
  calmed: L("Lòng bình an lan tỏa. Người anh ấy dừng lại và lùi xa.", "Peace spreads. The brother stops and steps back."),
  phase: [L("Giữ bình an: {n}/6", "Keeping peace: {n}/6"), L("Dưới đáy giếng: tìm dây {n}/3", "In the well: ropes {n}/3")],
  taken: [
    L("Dù Giuse cầu nguyện, các anh vẫn lột chiếc áo của cậu và thả cậu xuống một cái giếng cạn. (St 37, 23-24) Anh cả Rúp-ben thì thầm: “Đừng hại em.”", "Even though Joseph prays, the brothers strip off his coat and lower him into a dry well. (Genesis 37:23-24) The eldest, Reuben, whispers: “Do not harm him.”"),
  ],
  wellStart: [L("Dưới đáy giếng tối và lạnh. Rúp-ben đã lén thả xuống mấy đoạn dây. Hãy tìm 3 đoạn dây, rồi nối lại để leo lên.", "The bottom of the well is dark and cold. Reuben secretly lowered some rope. Find the 3 pieces, then join them to climb up.")],
  ropeHint: L("[A] Nhặt dây", "[A] Pick up rope"),
  joinHint: L("[A] Nối dây và leo lên", "[A] Join the ropes and climb"),
  needRopes: L("Còn thiếu dây. Hãy tìm đủ 3 đoạn dưới đáy giếng.", "Ropes are missing. Find all 3 at the bottom of the well."),
  pray: L("Giuse thầm thì: “Lạy Chúa, con ở đây. Xin ở cùng con.”", "Joseph whispers: “Lord, I am here. Stay with me.”"),
  outro: [
    L("Giu-đa nói với các anh: “Đừng giết em. Chúng ta hãy bán nó cho đoàn lái buôn Ít-ma-en kia.” Họ bán Giuse với giá hai mươi đồng bạc. (St 37, 26-28)", "Judah says to his brothers: “Let us not kill him. Let us sell him to those Ishmaelite traders.” They sell Joseph for twenty pieces of silver. (Genesis 37:26-28)"),
    L("Các anh nhúng chiếc áo vào máu dê, chỉ còn lại một vết đỏ sẫm. Nhưng Thiên Chúa không rời bỏ Giuse. Tia nắng thứ ba sáng lên.", "The brothers dip the coat in goat's blood; only a dark red stain is left. But God has not left Joseph. The third sunray shines."),
  ],
  lesson: L("Khi bị đối xử bất công, hãy cầu nguyện và đừng trả đũa. Thiên Chúa vẫn ở bên em.", "When treated unfairly, pray and do not strike back. God is still beside you."),
};

/** Stage 4 (St 37, 25-36): the caravan. */
export const STAGE4 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Họ bán ông Giuse cho người Ít-ma-en với giá hai mươi đồng bạc; những người ấy đem ông Giuse đi Ai-cập.” (St 37, 28)", "“They sold Joseph to the Ishmaelites for twenty pieces of silver, and they took Joseph to Egypt.” (Genesis 37:28)"),
    L("Giuse đi theo đoàn lạc đà qua sa mạc dài. Nắng nóng, cát bay. Hãy giúp cậu đi theo kịp đoàn và nhớ uống nước.", "Joseph follows the camel caravan across the long desert. The sun is hot and the sand blows. Help him keep up and remember to drink."),
  ],
  start: [L("Đoàn lạc đà chỉ đi tiếp khi em theo kịp. Nhặt bình nước dọc đường, nghỉ ở ốc đảo, và tránh gai, đá!", "The caravan only moves on when you keep up. Pick up water jars on the way, rest at the oases, and avoid thorns and rocks!")],
  jarHint: L("[A] Nhặt bình nước", "[A] Take the water jar"),
  oasisHint: L("[A] Nghỉ ở ốc đảo", "[A] Rest at the oasis"),
  oasis: L("Ốc đảo mát lành! Em uống nước và nghỉ chân. Đã lưu mốc.", "A cool oasis! You drink and rest. Checkpoint saved."),
  thirsty: L("Khát quá! Giuse phải quay lại mốc gần nhất uống nước.", "So thirsty! Joseph goes back to the last checkpoint for water."),
  waitHint: L("Theo kịp đoàn lạc đà!", "Keep up with the caravan!"),
  banner: L("Nước", "Water"),
  bridge: [
    L("Xa phía sau, ở Hếp-rôn, các anh mang chiếc áo dính vết đỏ về cho cha. Ông Gia-cóp xé áo mình và khóc thương con rất lâu. (St 37, 31-35)", "Far behind in Hebron, the brothers bring the stained coat to their father. Jacob tears his own clothes and mourns his son for a long time. (Genesis 37:31-35)"),
    L("Đêm xuống trên sa mạc. Giuse ngẩng nhìn sao và nhớ cha. Cậu nói khẽ: “Thiên Chúa vẫn ở với con.”", "Night falls on the desert. Joseph looks up at the stars and thinks of his father. He says softly: “God is still with me.”"),
  ],
  outro: [L("Giuse bị đưa đến một đất nước xa lạ, nhưng hạt giống hy vọng vẫn còn. Tia nắng thứ tư sáng lên.", "Joseph is taken to a strange land, but the seed of hope remains. The fourth sunray shines.")],
  lesson: L("Hy vọng khi xa nhà: Thiên Chúa không bỏ rơi ai, dù họ ở nơi xa lạ nhất.", "Hope when far from home: God abandons no one, even in the strangest land."),
};

/** Stage 5 (St 39, 1-6): Potiphar's house, little steward. */
export const STAGE5 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Đức Chúa ở với ông Giuse, nên mọi việc ông làm đều thành công.” (St 39, 2)", "“The Lord was with Joseph, and he became a successful man.” (Genesis 39:2)"),
    L("Giuse bị đưa tới Ai-cập và bán làm người hầu cho ông Pút-ti-phác, một quan lớn của Pha-ra-ô. Giuse làm mọi việc chăm chỉ và trung tín, dù không ai khen.", "Joseph is brought to Egypt and sold as a servant to Potiphar, an officer of Pharaoh. He works hard and faithfully, even when no one praises him."),
  ],
  start: [L("Ông chủ giao cho em 5 phiếu việc. Bấm [A] để nhặt đồ, rồi mang đến đúng chỗ. Mỗi việc có giờ hẹn nhé!", "The master gives you 5 task tickets. Press [A] to pick up an item and carry it to the right place. Each task has a time limit!")],
  tasks: [
    { banner: L("Mang bình nước vào bếp", "Take the water jar to the kitchen"), from: L("[A] Múc nước ở hồ sen", "[A] Fill a jar at the lotus pond"), to: L("[A] Đặt bình ở bếp", "[A] Set the jar in the kitchen") },
    { banner: L("Mang bao lúa vào kho", "Take the grain sack to the storeroom"), from: L("[A] Nhấc bao lúa ngoài sân", "[A] Lift a grain sack in the yard"), to: L("[A] Xếp bao lúa vào kho", "[A] Stack the sack in the storeroom") },
    { banner: L("Mang chén bạc lên bàn ông chủ", "Take the silver cup to the master's table"), from: L("[A] Lấy chén bạc ở kệ bếp", "[A] Take the cup from the kitchen shelf"), to: L("[A] Đặt chén lên bàn", "[A] Set the cup on the table") },
    { banner: L("Tưới vườn bằng bình nước", "Water the garden with a jar"), from: L("[A] Múc nước ở hồ sen", "[A] Fill a jar at the lotus pond"), to: L("[A] Tưới cây trong vườn", "[A] Water the garden plants") },
    { banner: L("Chuyển bao lúa từ kho vào bếp", "Move a grain sack from the storeroom to the kitchen"), from: L("[A] Nhấc bao lúa trong kho", "[A] Lift a sack in the storeroom"), to: L("[A] Đặt bao lúa ở bếp", "[A] Set the sack in the kitchen") },
  ],
  late: L("Hết giờ rồi! Không sao, Giuse đặt đồ xuống và làm lại phiếu này.", "Time's up! No worries, Joseph puts it down and starts this ticket again."),
  taskDone: L("Xong một việc! Ông chủ mỉm cười.", "One job done! The master smiles."),
  banner: L("Phiếu việc {n}/5 · còn {s}s", "Ticket {n}/5 · {s}s left"),
  potipharHint: L("[A] Ông Pút-ti-phác", "[A] Master Potiphar"),
  potipharTalk: [L("Ông Pút-ti-phác nhìn quanh nhà: mọi thứ đều gọn gàng, trôi chảy. Ông thầm nhận ra Giuse có điều gì đó rất đặc biệt: Thiên Chúa ở cùng cậu.", "Potiphar looks around the house: everything is tidy and running smoothly. He quietly realises there is something special about Joseph: God is with him.")],
  done: [L("Ông Pút-ti-phác trao cho Giuse chùm chìa khóa: “Từ nay con trông coi cả nhà ta.” Ông tin tưởng cậu hoàn toàn. (St 39, 4-6)", "Potiphar hands Joseph the ring of keys: “From now on you will look after my whole house.” He trusts him completely. (Genesis 39:4-6)")],
  outro: [L("Giuse vẫn là người hầu, nhưng sự trung tín làm cậu được tin cậy. Tia nắng thứ năm sáng lên.", "Joseph is still a servant, but his faithfulness earns him trust. The fifth sunray shines.")],
  lesson: L("Hãy trung tín trong những việc nhỏ, dù không ai khen, vì Thiên Chúa vẫn thấy.", "Be faithful in small things, even when no one praises you, because God sees."),
};

/** Stage 6 (St 39, 7-20): corridor, choose the light. */
export const STAGE6 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Làm sao tôi dám làm điều ác này mà phạm tội với Thiên Chúa?” (St 39, 9)", "“How could I do this great wrong and sin against God?” (Genesis 39:9)"),
    L("Bà chủ nhà muốn Giuse làm một điều sai trái với ông Pút-ti-phác. Giuse dứt khoát từ chối. Một bóng đen của lời mời xấu đuổi theo cậu. Hãy giúp Giuse chạy về phía ánh sáng!", "The master's wife wants Joseph to do something wrong to Potiphar. Joseph firmly refuses. A dark shadow of the bad invitation chases him. Help Joseph run toward the light!"),
  ],
  start: [L("Ở mỗi gian phòng có 3 cánh cửa. Hãy chọn cửa có ÁNH SÁNG TRẮNG, đừng chọn cửa đỏ! Tránh bóng đen đang đuổi theo.", "Each room has 3 doors. Choose the door with WHITE LIGHT, never the red one! Avoid the dark shadow behind you.")],
  doorHint: L("[A] Mở cửa", "[A] Open the door"),
  wrongDoor: L("Cửa đỏ là cám dỗ! Giuse lùi lại ngay.", "The red door is a temptation! Joseph steps back at once."),
  caught: L("Bóng đen đuổi kịp! Giuse cầu nguyện và bắt đầu lại gian này.", "The shadow catches up! Joseph prays and starts this room again."),
  rightDoor: L("Cửa sáng! Giuse chạy qua, đóng cửa lại sau lưng.", "The light door! Joseph runs through and shuts it behind him."),
  banner: L("Gian phòng {n}/4 · chọn cửa sáng", "Room {n}/4 · choose the light door"),
  bridge: [
    L("Giuse chạy ra khỏi cửa lớn, nhưng chiếc áo choàng ngoài bị giữ lại trong tay bà chủ. Bà vu oan cho Giuse, và ông Pút-ti-phác tức giận cho bắt cậu vào ngục. (St 39, 12-20)", "Joseph runs out through the great door, but his outer cloak is left in the woman's hands. She accuses him falsely, and Potiphar, angry, has him thrown into prison. (Genesis 39:12-20)"),
    L("Giuse bị oan, nhưng lòng cậu bình an: “Con thà chịu thiệt chứ không làm điều ác.”", "Joseph is wronged, but his heart is at peace: “I would rather suffer than do wrong.”"),
  ],
  outro: [L("Giuse giữ được lòng trong sạch, dù mất áo và mất tự do. Tia nắng thứ sáu sáng lên.", "Joseph keeps a pure heart, though he loses his cloak and his freedom. The sixth sunray shines.")],
  lesson: L("Dám nói “không” với điều sai, dù phải chịu thiệt. Lòng trong sạch làm đẹp lòng Chúa.", "Dare to say “no” to what is wrong, even at a cost. A pure heart pleases God."),
};

/** Stage 7 (St 39, 21 – 40, 23): two dreams in prison. */
export const STAGE7 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Việc giải mộng chẳng phải của Thiên Chúa sao? Xin các ông cứ kể cho tôi nghe.” (St 40, 8)", "“Do not interpretations belong to God? Please tell me your dreams.” (Genesis 40:8)"),
    L("Trong ngục, Giuse vẫn chăm sóc các tù nhân. Một sáng nọ, quan tửu chánh và quan thượng thiện của Pha-ra-ô buồn bã vì mỗi người đều có một giấc mơ lạ mà không ai giải thích.", "In prison Joseph still cares for the other prisoners. One morning Pharaoh's chief cupbearer and chief baker are sad: each has had a strange dream that no one can explain."),
  ],
  start: [L("Hãy tìm các mảnh giấc mơ rải rác trong ngục: 3 cành nho, chén, 3 giỏ bánh, chim. Rồi nói chuyện với từng quan để cùng Giuse giải mộng.", "Find the dream pieces scattered in the prison: 3 vines, a cup, 3 bread baskets, a bird. Then talk to each official and help Joseph interpret.")],
  pieceHint: L("[A] Nhặt mảnh giấc mơ", "[A] Pick up the dream piece"),
  banner: L("Mảnh giấc mơ: {n}/8", "Dream pieces: {n}/8"),
  cupHint: L("[A] Quan tửu chánh", "[A] Chief cupbearer"),
  bakerHint: L("[A] Quan thượng thiện", "[A] Chief baker"),
  needPieces: L("Em chưa tìm đủ mảnh giấc mơ của ông ấy. Hãy tìm thêm trong ngục nhé.", "You have not found all of his dream pieces yet. Look around the prison."),
  cupDream: [L("Quan tửu chánh kể: “Tôi thấy một cây nho có ba cành. Nho chín, tôi ép vào chén của Pha-ra-ô và dâng lên ngài.” (St 40, 9-11)", "The cupbearer says: “I saw a vine with three branches. The grapes ripened, I pressed them into Pharaoh's cup and handed it to him.” (Genesis 40:9-11)")],
  bakerDream: [L("Quan thượng thiện kể: “Tôi đội trên đầu ba giỏ bánh. Trong giỏ trên cùng, chim sà xuống ăn hết bánh của Pha-ra-ô.” (St 40, 16-17)", "The baker says: “I carried three baskets of bread on my head. In the top basket, birds swooped down and ate Pharaoh's bread.” (Genesis 40:16-17)")],
  ask: L("Em giúp Giuse giải mộng nhé. Ý nghĩa nào đúng?", "Help Joseph interpret. Which meaning is right?"),
  cupOptions: [
    { label: L("Ba ngày nữa ông được phục chức", "In three days you will be restored"), ok: true },
    { label: L("Ba ngày nữa ông sẽ đi xa", "In three days you will leave for far away"), ok: false },
  ],
  bakerOptions: [
    { label: L("Ba ngày nữa ông sẽ chịu hình phạt của Pha-ra-ô", "In three days you will face Pharaoh's punishment"), ok: true },
    { label: L("Ba ngày nữa ông sẽ được thưởng", "In three days you will be rewarded"), ok: false },
  ],
  wrong: L("Giuse lắc đầu: “Không phải con giải, nhưng là Thiên Chúa. Mình nghĩ lại nhé.”", "Joseph shakes his head: “It is not I but God who interprets. Let us think again.”"),
  right: L("Giuse giải mộng đúng như Thiên Chúa soi sáng.", "Joseph interprets exactly as God enlightens him."),
  remember: L("Giuse nói thêm với quan tửu chánh: “Xin ông nhớ đến tôi trước mặt Pha-ra-ô, khi mọi sự tốt đẹp với ông.”", "Joseph adds to the cupbearer: “Please remember me before Pharaoh when all goes well for you.”"),
  outro: [
    L("Mọi sự xảy ra đúng như lời Giuse. Quan tửu chánh được phục chức, nhưng ông đã quên Giuse suốt hai năm. (St 40, 23)", "Everything happened as Joseph said. The cupbearer was restored, but forgot Joseph for two whole years. (Genesis 40:23)"),
    L("Giuse vẫn kiên nhẫn chờ đợi trong ngục. Tia nắng thứ bảy sáng lên.", "Joseph keeps waiting patiently in prison. The seventh sunray shines."),
  ],
  lesson: L("Hãy phục vụ người khác ngay cả khi mình đang đau khổ, và kiên nhẫn chờ giờ của Chúa.", "Serve others even when you are suffering, and wait patiently for God's hour."),
};

/** Stage 8 (St 41, 1-36): Pharaoh's dreams. */
export const STAGE8 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Không phải con, nhưng chính Thiên Chúa sẽ cho Pha-ra-ô một câu trả lời bình an.” (St 41, 16)", "“It is not I; God will give Pharaoh a favourable answer.” (Genesis 41:16)"),
    L("Hai năm sau, Pha-ra-ô mơ thấy bảy con bò béo bị bảy con bò gầy nuốt chửng, và bảy bông lúa đầy bị bảy bông lúa lép nuốt mất. Không ai trong cung giải được. Quan tửu chánh chợt nhớ tới Giuse.", "Two years later Pharaoh dreams of seven fat cows eaten by seven thin cows, and seven full ears of grain swallowed by seven thin ears. No one in the palace can explain it. The cupbearer suddenly remembers Joseph."),
  ],
  start: [L("Pha-ra-ô cần hiểu giấc mơ. Giúp Giuse xếp: nhặt mỗi con bò rồi đưa tới ô NĂM NO hoặc NĂM ĐÓI. Bò béo là năm no, bò gầy là năm đói.", "Pharaoh needs to understand the dream. Help Joseph sort: pick up each cow and take it to the YEARS OF PLENTY or YEARS OF FAMINE area. Fat cows mean plenty, thin cows mean famine.")],
  cowHint: L("[A] Nhấc con bò", "[A] Pick up the cow"),
  plentyHint: L("[A] Đặt vào NĂM NO", "[A] Place in YEARS OF PLENTY"),
  famineHint: L("[A] Đặt vào NĂM ĐÓI", "[A] Place in YEARS OF FAMINE"),
  wrong: L("Chưa đúng! Bò béo thuộc năm no, bò gầy thuộc năm đói.", "Not quite! Fat cows belong to plenty, thin cows to famine."),
  banner: [L("Xếp bò: {n}/14", "Sorting cows: {n}/14"), L("Cất lúa vào kho: {n}/7", "Storing grain: {n}/7")],
  phase2: [L("Giuse nói: “Bảy năm no cần cất lúa vào kho để dành cho bảy năm đói.” Hãy mang 7 bó lúa vào kho!", "Joseph says: “The seven years of plenty must store grain for the seven years of famine.” Carry 7 sheaves to the granary!")],
  sheafHint: L("[A] Nhấc bó lúa", "[A] Lift a sheaf"),
  granaryHint: L("[A] Cất vào kho", "[A] Store in the granary"),
  pharaoh: [
    L("Giuse thưa với Pha-ra-ô: “Chính Thiên Chúa cho ngài biết điều Người sắp làm. Ngài hãy chọn một người khôn ngoan để lo việc tích trữ lúa.” (St 41, 25-36)", "Joseph tells Pharaoh: “God has shown you what he is about to do. Choose a wise man to see to the storing of grain.” (Genesis 41:25-36)"),
  ],
  outro: [L("Pha-ra-ô lắng nghe và tin lời Giuse. Cậu chỉ nhận mình là người được Thiên Chúa dùng. Tia nắng thứ tám sáng lên.", "Pharaoh listens and believes Joseph. Joseph claims only to be God's instrument. The eighth sunray shines.")],
  lesson: L("Hãy khiêm nhường: mọi tài năng đều là quà của Thiên Chúa, và hãy chuẩn bị chu đáo cho tương lai.", "Be humble: every talent is God's gift, and prepare carefully for the future."),
};

/** Stage 9 (St 41, 37-52): governor, seven years of granaries. */
export const STAGE9 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("Pha-ra-ô nói với ông Giuse: “Thiên Chúa đã cho ông biết mọi điều ấy... không ai khôn ngoan sáng suốt bằng ông.” (St 41, 39)", "Pharaoh said to Joseph: “Since God has made all this known to you, there is no one as wise as you.” (Genesis 41:39)"),
    L("Từ trong ngục, Giuse được Pha-ra-ô trao nhẫn, khoác áo lanh mịn và đeo vòng vàng, làm tể tướng cai quản Ai-cập. Bảy năm được mùa bắt đầu. Đã đến lúc xây kho lúa!", "From prison, Joseph is given Pharaoh's ring, fine linen and a gold chain, and made governor of Egypt. The seven years of plenty begin. Time to build the granaries!"),
  ],
  start: [L("Mỗi năm có 3 bó lúa ngoài đồng. Nhặt từng bó, mang tới kho đang xây, rồi kho mới sẽ mọc lên. Làm đủ 7 năm nhé!", "Each year there are 3 sheaves in the fields. Carry each to the granary being built and a new granary will rise. Do it for all 7 years!")],
  sheafHint: L("[A] Nhặt bó lúa", "[A] Pick up the sheaf"),
  granaryHint: L("[A] Cất lúa vào kho", "[A] Store grain in the granary"),
  banner: L("Năm {y}/7 · bó lúa {k}/3", "Year {y}/7 · sheaves {k}/3"),
  yearDone: L("Một kho lúa mới đã đầy! Cất kỹ cho những năm đói sau này.", "A new granary is full! Grain kept safe for the lean years to come."),
  finale: [
    L("Bảy năm no đã qua, kho lúa đầy khắp Ai-cập. Giuse có hai con trai: Ma-na-xê, nghĩa là “Thiên Chúa khiến tôi quên mọi nỗi khổ”, và Ép-ra-gim, nghĩa là “Thiên Chúa làm tôi nở rộ nơi đất khổ”. (St 41, 50-52)", "The seven years of plenty pass, and granaries fill all Egypt. Joseph has two sons: Manasseh, “God has made me forget my hardship”, and Ephraim, “God has made me fruitful in the land of my affliction”. (Genesis 41:50-52)"),
  ],
  outro: [L("Giuse dùng quyền để phục vụ, không để khoe. Tia nắng thứ chín sáng lên.", "Joseph uses his power to serve, not to boast. The ninth sunray shines.")],
  lesson: L("Hãy khôn ngoan chuẩn bị, và dùng những gì mình có để phục vụ người khác.", "Prepare wisely, and use what you have to serve others."),
};

/** Stage 10 (St 41, 53 – 42, 38): famine, fair distribution, brothers arrive. */
export const STAGE10 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Cả thế giới kéo đến Ai-cập để mua lúa nơi ông Giuse.” (St 41, 57) Dân chúng kêu xin Pha-ra-ô, ngài bảo: “Hãy đến với ông Giuse.” (St 41, 55)", "“All the world came to Egypt to buy grain from Joseph.” (Genesis 41:57) The people cried to Pharaoh, who said: “Go to Joseph.” (Genesis 41:55)"),
    L("Nạn đói đã đến. Kho lúa mở ra, dân chúng xếp hàng dài. Giuse muốn ai cũng được phần lúa công bằng, và người yếu được lo trước.", "The famine has come. The granaries open and people line up. Joseph wants everyone to get a fair share, with the weak served first."),
  ],
  start: [L("Lấy bao lúa ở kho (bên trái), rồi đưa cho từng người trong hàng. Hãy phục vụ TRẺ NHỎ và CỤ GIÀ trước, rồi mới tới người lớn!", "Take a sack from the storehouse (left) and give one to each person in line. Serve the CHILDREN and ELDERS first, then the adults!")],
  sackHint: L("[A] Lấy bao lúa", "[A] Take a grain sack"),
  giveHint: L("[A] Đưa bao lúa", "[A] Give the sack"),
  complain: L("Mọi người phàn nàn: “Sao không lo cho trẻ nhỏ và cụ già trước?” Hãy xếp lại cho đúng.", "People complain: “Why not look after the children and the elderly first?” Let's do it properly."),
  thanks: L("Cảm ơn ngài!", "Thank you, my lord!"),
  labels: { child: L("Trẻ nhỏ", "Child"), elder: L("Cụ già", "Elder"), adult: L("Người lớn", "Adult") },
  banner: L("Đã phát: {n}/8", "Served: {n}/8"),
  brothers: [
    L("Giữa đoàn người, mười người anh của Giuse từ Ca-na-an cũng đến mua lúa. Họ quỳ lạy trước vị tể tướng, không nhận ra em mình. (St 42, 6-8)", "Among the crowd, Joseph's ten brothers from Canaan also come to buy grain. They bow down before the governor, not recognizing their brother. (Genesis 42:6-8)"),
    L("Giuse nhận ra các anh ngay, nhưng cậu giấu lòng mình để xem họ đã đổi thay chưa. Quay đi, ông khóc. (St 42, 24)", "Joseph recognizes them at once but hides his heart to see whether they have changed. He turns away and weeps. (Genesis 42:24)"),
  ],
  outro: [L("Giuse chia lúa công bằng cho mọi người, và lòng ông vẫn chờ ngày đoàn tụ. Tia nắng thứ mười sáng lên.", "Joseph shares the grain fairly with everyone, while his heart waits for the day of reunion. The tenth sunray shines.")],
  lesson: L("Hãy chia sẻ với người nghèo. “Hãy đến với ông Giuse” nhắc ta “Hãy đến với Chúa Giê-su”, Bánh Hằng Sống trong Thánh Thể (Ga 6, 35).", "Share with the poor. “Go to Joseph” reminds us “Come to Jesus”, the Bread of Life in the Eucharist (John 6:35)."),
};

/** Stage 11 (St 43-44): the silver cup and Judah's plea. */
export const STAGE11 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Xin cho con, tôi tớ ngài, ở lại thay cậu bé làm nô lệ của ngài, và để cậu ấy trở về với các anh.” (St 44, 33)", "“Let your servant remain in place of the boy as your lord's slave, and let the boy go back with his brothers.” (Genesis 44:33)"),
    L("Các anh trở lại Ai-cập, lần này có cả Ben-gia-min, em út. Giuse thết tiệc và cho đặt chén bạc của mình vào bao lúa của Ben-gia-min để thử lòng các anh.", "The brothers return to Egypt, this time with Benjamin, the youngest. Joseph feasts them and has his silver cup placed in Benjamin's sack to test their hearts."),
  ],
  start: [L("Chén bạc của tể tướng biến mất! Hãy kiểm tra 11 bao lúa. Bấm [A] để mở từng bao, và để ý ánh bạc lấp lánh.", "The governor's silver cup is missing! Check the 11 sacks. Press [A] to open each one and look for the silver glint.")],
  sackHint: L("[A] Mở bao lúa", "[A] Open the sack"),
  grain: L("Chỉ có lúa.", "Only grain."),
  banner: L("Đã kiểm: {n}/11", "Checked: {n}/11"),
  found: [
    L("Chén bạc nằm trong bao lúa của Ben-gia-min! Các anh sững sờ, xé áo vì lo sợ. Giuse nói: “Kẻ bị bắt gặp có chén sẽ ở lại làm nô lệ của ta. Còn các anh cứ bình an về với cha.” (St 44, 17)", "The silver cup is in Benjamin's sack! The brothers are stunned and tear their clothes in fear. Joseph says: “The one found with the cup shall remain my slave. The rest of you may go in peace to your father.” (Genesis 44:17)"),
    L("Giu-đa bước lên, quỳ trước Giuse. Ông nhớ lời đã hứa với cha, và nhớ ngày xưa chính ông đã đề nghị bán Giuse.", "Judah steps forward and kneels before Joseph. He remembers his promise to his father, and how he once proposed selling Joseph himself."),
  ],
  ask: L("Giu-đa nên thưa gì với tể tướng?", "What should Judah say to the governor?"),
  options: [
    { label: L("“Xin cho con ở lại làm nô lệ thay em, để em về với cha.”", "“Let me stay as your slave in place of my brother, so he can go home to our father.”"), ok: true },
    { label: L("“Chúng con không biết gì cả, xin ngài thả chúng con.”", "“We know nothing, please let us all go.”"), ok: false },
    { label: L("“Ngài cứ giữ Ben-gia-min, còn chúng con xin về.”", "“Keep Benjamin, and let the rest of us go.”"), ok: false },
  ],
  wrong: L("Giuse chờ một lát, mắt nhìn các anh thật sâu... Giu-đa hít một hơi dài và nghĩ lại.", "Joseph waits a moment, looking deeply at his brothers... Judah takes a deep breath and thinks again."),
  right: L("Nghe lời Giu-đa, Giuse không còn kìm được lòng mình. Cậu bé út được cứu, và các anh đã thay đổi: họ biết hy sinh vì nhau. (St 44, 18-34)", "Hearing Judah, Joseph can no longer hold back. The youngest is saved, and the brothers have changed: they are ready to sacrifice for one another. (Genesis 44:18-34)"),
  outro: [L("Điều tốt đẹp nhất của lòng hối cải là dám hy sinh vì người mình yêu. Tia nắng thứ mười một sáng lên.", "The best sign of repentance is being ready to sacrifice for those we love. The eleventh sunray shines.")],
  lesson: L("Hối cải là dám nhận lỗi và hy sinh vì anh em; tình yêu làm lành mọi vết thương.", "Repentance means admitting our fault and sacrificing for our brothers; love heals every wound."),
};

/** Stage 12 (St 45; 46; 50, 15-21): Goshen. */
export const STAGE12 = {
  speaker: L("Giuse", "Joseph"),
  intro: [
    L("“Anh em đã toan tính điều ác cho tôi, nhưng Thiên Chúa lại toan tính cho nó thành điều tốt, để cứu sống một dân đông đảo.” (St 50, 20)", "“You meant evil against me, but God meant it for good, to save the lives of many people.” (Genesis 50:20)"),
    L("Giuse không còn giấu mình nữa. Ông nói với các anh: “Tôi là Giuse, em các anh!” Pha-ra-ô cho đón cả nhà Gia-cóp sang vùng Gô-sen màu mỡ. Giuse dẫn đoàn xe ra đón cha.", "Joseph can hide no longer. He tells his brothers: “I am Joseph, your brother!” Pharaoh invites the whole house of Jacob to the fertile land of Goshen. Joseph leads the wagons to meet his father."),
  ],
  start: [L("Dẫn đoàn xe tới khu lều ở Gô-sen. Đoàn xe sẽ đi theo em. Khi tới nơi, hãy trao quà cho các anh.", "Lead the wagons to the camp in Goshen. They follow you. When you arrive, give gifts to your brothers.")],
  arrive: [
    L("Các anh đứng đó, e dè và đầy hối hận. Giuse nói: “Đừng sợ, đừng tự trách mình. Chính Thiên Chúa đã sai tôi đi trước anh em để cứu sống anh em.” (St 45, 5)", "The brothers stand there, shy and full of regret. Joseph says: “Do not be distressed or reproach yourselves. It was God who sent me before you to save your lives.” (Genesis 45:5)"),
  ],
  wagonHint: L("[A] Lấy một phần quà từ xe", "[A] Take a gift from the wagon"),
  giveHint: L("[A] Trao quà cho anh", "[A] Give the gift to your brother"),
  jacobHint: L("[A] Ôm cha Gia-cóp", "[A] Embrace father Jacob"),
  needGifts: L("Hãy trao quà cho đủ 11 người anh trước đã.", "First give a gift to all 11 brothers."),
  banner: [L("Dẫn đoàn xe tới khu lều", "Lead the wagons to the camp"), L("Quà đã trao: {n}/11", "Gifts given: {n}/11"), L("Chạy đến ôm cha", "Run to embrace your father")],
  hug: [
    L("Giuse chạy tới ôm cha, hai cha con khóc rất lâu. Gia-cóp nói: “Bây giờ cha có thể chết yên lòng, vì cha đã thấy mặt con còn sống.” (St 46, 30)", "Joseph runs to embrace his father and they weep for a long time. Jacob says: “Now I can die in peace, having seen your face and that you are still alive.” (Genesis 46:30)"),
    L("Về sau, khi cha qua đời, các anh sợ Giuse sẽ trả thù. Giuse khóc và nói: “Đừng sợ. Tôi sẽ nuôi anh em.” Ông an ủi họ bằng những lời dịu dàng. (St 50, 15-21)", "Later, when their father dies, the brothers fear that Joseph will take revenge. Joseph weeps and says: “Do not be afraid. I will provide for you.” He comforts them with kind words. (Genesis 50:15-21)"),
    L("Chiếc áo mặt trời đã được vá lành, và đủ mười hai tia nắng.", "The sun coat is mended, and all twelve sunrays shine."),
  ],
  outro: [L("Giuse tha thứ trọn vẹn. Thiên Chúa đã viết điều tốt trên cả những đường cong của nỗi đau. Tia nắng thứ mười hai sáng lên!", "Joseph forgives completely. God has written good even on the crooked lines of pain. The twelfth sunray shines!")],
  lesson: L("Tha thứ là cách giống Chúa nhất. Thiên Chúa có thể biến điều ác thành điều tốt.", "Forgiveness is the most God-like thing. God can turn evil into good."),
};

/** Epilogue: Joseph and Jesus. */
export const EPILOGUE = {
  speaker: L("Chúa Thánh Thần", "Holy Spirit"),
  intro: [
    L("“Chính Tôi là bánh trường sinh. Ai đến với Tôi sẽ không hề đói.” (Ga 6, 35)", "“I am the bread of life; whoever comes to me will never hunger.” (John 6:35)"),
    L("Ánh bình minh chiếu sáng căn phòng nhỏ. Chiếc Áo Mặt Trời đã được vá lành, đủ mười hai tia nắng, nằm bên cuốn Kinh Thánh.", "Morning light fills the little room. The Sun Coat, mended and shining with all twelve rays, lies beside the open Bible."),
  ],
  welcome: [
    L("Chúc mừng con đã hoàn thành hành trình cùng Giuse, từ giấc mơ ở Hếp-rôn đến ngôi tể tướng và lời tha thứ ở Gô-sen!", "Congratulations on finishing the journey with Joseph, from the dreams of Hebron to the governor's seat and forgiveness in Goshen!"),
    L("Hãy đến 2 kỷ vật trong phòng để nối câu chuyện Giuse với Chúa Giê-su, rồi đặt Chiếc Áo Mặt Trời lên bàn cầu nguyện nhé!", "Visit the 2 relics in the room to link Joseph's story to Jesus, then place the Sun Coat on the prayer table!"),
  ],
  phase: L("Màn Kết: suy niệm Giuse → Chúa Giê-su ({r}/2) rồi đặt Chiếc Áo lên bàn", "Epilogue: reflect Joseph → Jesus ({r}/2), then place the Coat on the table"),
  relicHints: [L("[A] Suy niệm: Bị bán và tha thứ", "[A] Reflect: Sold and forgiving"), L("[A] Suy niệm: “Hãy đến với ông Giuse”", "[A] Reflect: “Go to Joseph”")],
  relicQuestions: [
    {
      q: L("Giuse bị chính anh em bán với giá bạc, chịu khổ, rồi tha thứ và cứu cả gia đình. Điều đó gợi ta nhớ đến Ai?", "Joseph was sold by his own brothers for silver, suffered, then forgave and saved his family. Who does this remind us of?"),
      a: [
        L("Chúa Giê-su: bị bán với giá bạc, chịu khổ vì chúng ta và tha thứ cho tất cả", "Jesus: sold for silver, who suffered for us and forgave everyone"),
        L("Không liên quan đến ai cả", "It is not related to anyone"),
      ],
      ok: L("Đúng thế! Giuse là hình ảnh báo trước Chúa Giê-su: bị bán, bị chịu khổ, nhưng nhờ đó cứu độ nhiều người.", "Indeed! Joseph prefigures Jesus: sold and suffering, yet through it saving many."),
    },
    {
      q: L("Pha-ra-ô bảo dân đói: “Hãy đến với ông Giuse”, và họ được no. Trong Thánh Lễ, ta được nói “Hãy đến với Chúa Giê-su” để nhận gì?", "Pharaoh told the hungry: “Go to Joseph”, and they were fed. At Mass we are told “Come to Jesus” to receive what?"),
      a: [
        L("Bánh Hằng Sống: Mình Thánh Chúa, nuôi linh hồn chúng ta", "The Bread of Life: the Body of Christ, who feeds our souls"),
        L("Một món quà để khoe với bạn bè", "A present to show off to friends"),
      ],
      ok: L("Tuyệt vời! Cũng như kho lúa của Giuse, Chúa Giê-su ban Bánh Hằng Sống cho mọi người đến với Người.", "Wonderful! Like Joseph's granaries, Jesus gives the Bread of Life to all who come to him."),
    },
  ],
  wrongChoice: L("Chưa đúng rồi, con hãy suy nghĩ lại với lòng yêu mến Chúa nhé!", "Not quite right. Think again with a loving heart!"),
  deskHint: L("[A] Đặt Chiếc Áo Mặt Trời (12/12) lên bàn cầu nguyện", "[A] Place the Sun Coat (12/12) on the prayer table"),
  needRelicsFirst: L("Con hãy hoàn thành 2 suy niệm ở hai kỷ vật trong phòng trước nhé!", "First complete the 2 reflections at the two relics in the room!"),
  finale: [
    L("Chiếc Áo Mặt Trời tỏa sáng bên cạnh Cây Đàn Hạc Đa-vít, Hai Bia Đá Mô-sê, Hải Đồ Nô-ê, Cuộn Sáng Thế và Chuỗi Mân Côi!", "The Sun Coat shines beside David's Harp, Moses's Tablets, Noah's Chart, the Genesis Scroll and the Rosary!"),
    L("Giuse mỉm cười: “Anh bị bán, bị ruồng bỏ, rồi thành người cứu anh em. Có một Người khác cũng đã bị bán với giá bạc, chịu khổ vì chúng ta và tha thứ cho tất cả: Chúa Giê-su.”", "Joseph smiles: “I was sold and left behind, yet became my family's rescuer. Another One was also sold for silver, suffered for us, and forgave all: Jesus.”"),
    L("Nguyện xin Chúa luôn ở cùng con, và cho con biết tha thứ như Giuse. Amen!", "May the Lord always be with you, and teach you to forgive like Joseph. Amen!"),
  ],
  theEnd: [L("Chúc mừng con đã hoàn thành hành trình Giuse – Chiếc Áo Mặt Trời (12/12 tia nắng)! Con muốn ở lại căn phòng này hay về trang chủ?", "Congratulations on completing Joseph – The Coat of the Sun (12/12 sunrays)! Stay in this room or return to the home page?")],
};

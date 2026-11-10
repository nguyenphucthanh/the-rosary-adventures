import type { L } from "@/modules/the-garden-of-eden/data/dialogues";

const l = (vi: string, en: string): L => ({ vi, en });

/** Intro / outro / lesson for Stages 1-7. The game reads `.vi`; `.en` is ready for a language toggle. In-play hint labels stay Vietnamese-only inside the scenes. */
export const STAGE_TEXT = {
  s1: {
    speaker: "Ngày Thứ Nhất",
    intro: [
      l("“Thiên Chúa phán: ‘Hãy có ánh sáng!’ Liền có ánh sáng. Thiên Chúa thấy rằng ánh sáng tốt đẹp. Thiên Chúa phân rẽ ánh sáng và bóng tối.” (St 1, 3-4)", "“God said, ‘Let there be light,’ and there was light. God saw that the light was good, and He separated the light from the darkness.” (Gen 1:3-4)"),
      l("Vũ trụ còn chìm trong đêm. Ba Đài Nhật Quang đang chờ ánh sáng đầu tiên của Thiên Chúa.", "The universe is still in night. Three Sun Altars wait for God's first light."),
      l("Đến gần Trụ Tinh Thể, nhấn A để xoay hướng. Ánh sáng đi theo hướng mũi tên vàng. Đừng bước vào sương đen chưa được chiếu sáng nhé!", "Go near a crystal and press A to turn it. Light leaves it in the gold arrow's direction. Never step into unlit dark mist!"),
    ],
    outro: [
      l("Ba Đài Nhật Quang bừng sáng, bóng đêm lùi về một phía. “Qua một buổi chiều và một buổi sáng: đó là ngày thứ nhất.”", "The three altars blaze and night draws back. “There was evening and there was morning, the first day.”"),
      l("Ấn Dấu thứ nhất khắc sáng trên Cuộn Sách Sáng Thế!", "The first Seal glows on the Genesis Scroll!"),
    ],
    lesson: l("Chúa là Ánh Sáng thật. Đi trong ánh sáng của Chúa giúp chúng ta phân định điều tốt lành và tránh xa bóng tối tội lỗi.", "God is the true Light. Walking in His light helps us choose what is good and avoid the darkness of sin."),
  },
  s2: {
    speaker: "Ngày Thứ Hai",
    intro: [
      l("“Thiên Chúa làm ra cái vòm để phân rẽ nước phía dưới vòm với nước phía trên vòm. Thiên Chúa gọi cái vòm đó là ‘trời’.” (St 1, 7-8)", "“God made the vault and separated the waters below from the waters above. God called the vault ‘heaven’.” (Gen 1:7-8)"),
      l("Biển nước nguyên sơ đang tách đôi. Em cầm Còi Gió Khí Quyển đi trên con đường gió giữa hai tầng nước.", "The primeval waters are parting. You carry the Wind Whistle along a road of wind between the waters."),
      l("Nhấn A gần Khối Mây Nước để thổi gió đẩy nó về Cột Gió ở bốn góc. Tránh Xoáy Nước và Sóng Dâng (có vệt bọt báo trước). Em có 3 Giọt Bình An.", "Press A near a Water Cloud to blow it toward a Wind Column in a corner. Dodge whirlpools and waves (foam warns you first). You have 3 Drops of Peace."),
    ],
    phase2: [l("Hay lắm! Giờ là những Khối Mây lớn, nặng hơn, và dòng nước đang chảy ngược. Cố lên!", "Well done! Now the big, heavy clouds, with the current flowing backwards. Keep going!")],
    outro: [
      l("Bốn Cột Gió bừng sáng, vòm trời xanh biếc mở rộng bao la. Thiên Chúa gọi vòm đó là trời.", "The four Wind Columns shine and a vast blue vault opens. God called the vault heaven."),
      l("Ấn Dấu thứ hai khắc sáng!", "The second Seal glows!"),
    ],
    lesson: l("Hãy ngước nhìn bầu trời cao rộng để cảm tạ Chúa đã ban không khí cho muôn loài hít thở mỗi giây phút.", "Look up at the wide sky and thank God for the air every creature breathes each moment."),
  },
  s3: {
    speaker: "Ngày Thứ Ba",
    intro: [
      l("“Nước phía dưới trời phải tụ lại một nơi, để chỗ khô cạn lộ ra!... Đất phải sinh thảo mộc xanh tươi, cỏ mang hạt giống, và cây trên mặt đất có trái.” (St 1, 9.11)", "“Let the waters under heaven gather and let dry land appear!... Let the earth bring forth plants and fruit trees.” (Gen 1:9, 11)"),
      l("Ba hòn đảo đất nâu vừa nhô lên khỏi biển. Em mang Túi Hạt Giống Khởi Nguyên để phủ xanh chúng.", "Three brown islands rise from the sea. You carry the Bag of First Seeds to turn them green."),
      l("Dùng phím mũi tên hoặc cần điều khiển, mỗi lần đi một ô. Ô nào em bước qua sẽ nở hoa, nhưng đừng dẫm lên ô đã nở! Ô nước làm em trượt tới khi chạm đá. Bí quá thì bấm THỬ LẠI.", "Use the arrows or stick to move one tile at a time. Each tile you cross blooms, but never step on a bloomed tile! Water tiles slide you until you hit a rock. Stuck? Press RETRY."),
    ],
    outro: [
      l("Cả ba hòn đảo bừng nở thành cánh đồng hoa trái ngát hương giữa biển xanh rì rào.", "All three islands burst into fields of flowers and fruit among the murmuring sea."),
      l("Ấn Dấu thứ ba khắc sáng!", "The third Seal glows!"),
    ],
    lesson: l("Hãy yêu quý thiên nhiên, bảo vệ cây cối và biết ơn Chúa qua từng hạt gạo, trái cây nuôi sống chúng ta mỗi ngày.", "Love nature, protect the trees and thank God for every grain and fruit that feeds us."),
  },
  s4: {
    speaker: "Ngày Thứ Tư",
    intro: [
      l("“Thiên Chúa làm ra hai vầng sáng lớn: vầng sáng lớn hơn để điều khiển ngày, vầng sáng nhỏ hơn để điều khiển đêm; Người cũng làm ra các ngôi sao.” (St 1, 16)", "“God made the two great lights, the greater to rule the day and the lesser to rule the night; and the stars.” (Gen 1:16)"),
      l("Đài Thiên Văn Khởi Nguyên trên đỉnh núi cao. Có hai việc: thắp các chòm sao, rồi chỉnh nhịp cho Mặt Trời, Mặt Trăng và muôn sao.", "The First Observatory on a high mountain. Two tasks: light the constellations, then set the rhythm of the Sun, Moon and stars."),
      l("Pha 1: nhặt Mảnh Tinh Tú đang rơi (8 giây là tan), nhấn A để cầm, rồi đặt vào ô cùng màu, bên trái và bên phải đối xứng nhau.", "Phase 1: catch falling Star Pieces (they fade in 8 seconds), press A to carry one, then place it in a slot of its colour, left and right in mirror."),
    ],
    phase2: [l("Các chòm sao đã sáng! Giờ đứng vào Bệ Thời Gian đang phát sáng và nhấn A đúng lúc cả ba thiên thể vào Khung Vàng ở đỉnh vòng. Lần lượt Xuân, Hạ, Thu, Đông.", "The constellations shine! Now stand at the glowing Time Pedestal and press A when all three bodies are in the Golden Window at the top. In order: Spring, Summer, Autumn, Winter.")],
    outro: [
      l("Mặt Trời, Mặt Trăng và muôn sao vào đúng quỹ đạo, ban ánh sáng nhịp nhàng cho bốn mùa trên mặt đất.", "Sun, Moon and stars settle into their orbits, giving light in rhythm to the four seasons."),
      l("Ấn Dấu thứ tư khắc sáng!", "The fourth Seal glows!"),
    ],
    lesson: l("Hãy quý trọng thời gian Chúa ban: giờ học, giờ nghỉ và giờ cầu nguyện, mỗi việc có lúc của nó.", "Treasure the time God gives: a time to study, to rest and to pray; everything has its hour."),
  },
  s5: {
    speaker: "Ngày Thứ Năm",
    intro: [
      l("“Thiên Chúa phán: ‘Nước phải sinh ra thật nhiều sinh vật lúc nhúc, và chim chóc phải bay lượn trên mặt đất, dưới vòm trời!’” (St 1, 20)", "“God said, ‘Let the waters teem with living creatures, and let birds fly above the earth under the vault of heaven!’” (Gen 1:20)"),
      l("Dưới Vịnh San Hô, sáu chú cá nhỏ sẽ bơi theo em. Trên Đồi Gió, đàn chim non đang chờ luồng gió đưa lên trời.", "In the Coral Bay six little fish will swim after you. On Windy Hill a flock of young birds waits for wind to lift them."),
      l("Dẫn cả đàn cá về Biển Rộng bên trái phía dưới. Cá chạm gai sẽ bị lạc, hãy quay lại đón. Dòng xoáy sẽ đẩy em ngược lại.", "Lead the whole school to the Open Sea at the bottom left. A fish that touches thorns is lost; go back and fetch it. Currents push you back."),
    ],
    hill: [l("Đàn cá đã về biển rộng! Giờ lên Đồi Gió. Nhấn A ở Quạt Gió theo đúng số 1 đến 5, mỗi quạt cách nhau không quá vài giây, kẻo gió đổi chiều!", "The fish are home! Now to Windy Hill. Press A at the Wind Fans in order 1 to 5, only seconds apart, or the wind will change!")],
    outro: [
      l("Chúa chúc lành cho muôn loài dưới biển và chim trời: “Hãy sinh sôi nảy nở cho đầy mặt biển và mặt đất!”", "God blesses every creature of sea and sky: “Be fruitful and multiply, fill the waters and the earth!”"),
      l("Ấn Dấu thứ năm khắc sáng!", "The fifth Seal glows!"),
    ],
    lesson: l("Hãy ngợi khen sự phong phú của muôn loài, và đừng hành hạ hay phá tổ chim, những sinh vật nhỏ bé.", "Praise the richness of life, and never harm a bird's nest or any small creature."),
  },
  s6: {
    speaker: "Ngày Thứ Sáu",
    intro: [
      l("“Chúng ta hãy làm ra con người theo hình ảnh chúng ta... Đức Chúa là Thiên Chúa lấy bụi từ đất nặn ra con người, thổi sinh khí vào lỗ mũi, và con người trở nên một sinh vật sống động.” (St 1, 26; 2, 7)", "“Let us make man in our image... The LORD God formed man from the dust of the ground and breathed life into his nostrils, and man became a living being.” (Gen 1:26; 2:7)"),
      l("Thảo Nguyên Sáng Tạo có muôn thú chạy nhảy. Ở giữa là Bệ Đất Thánh, nơi Thiên Chúa sẽ nặn nên con người.", "The Creation Plain is alive with animals. At its heart is the Holy Clay Altar where God will form man."),
      l("Chúa Thánh Thần cho em xem vị trí của 4 Tinh Hoa Đất Đỏ trong 5 giây. Nhớ chỗ và thứ tự, rồi nhấn A đúng chỗ để thu thập. Né những con thú đang chạy!", "The Holy Spirit shows you where the 4 Red Earth Essences lie for 5 seconds. Remember the places and order, then press A on the spot to gather. Dodge the running animals!"),
    ],
    wrong: [l("Sai thứ tự rồi! Chúa Thánh Thần cho em xem lại một lần nữa nhé.", "Wrong order! The Holy Spirit shows you again.")],
    breath: [l("Đủ bốn Tinh Hoa! Giờ là Hơi Thở Sự Sống: nhấn A khi vòng sáng co lại vừa khít trái tim. Em cần ba nhịp thở.", "All four Essences! Now the Breath of Life: press A when the shrinking ring fits the heart. You need three breaths.")],
    outro: [
      l("A-đam mở mắt, đứng dậy mỉm cười giữa muôn thú. Thiên Chúa nhìn mọi sự Người đã làm ra: “Thật là rất tốt đẹp!” (St 1, 31)", "Adam opens his eyes and rises, smiling among the animals. God saw all He had made: “It was very good!” (Gen 1:31)"),
      l("Ấn Dấu thứ sáu bừng sáng rực rỡ!", "The sixth Seal shines brilliantly!"),
    ],
    lesson: l("Mỗi người chúng ta rất quý giá vì được dựng nên theo hình ảnh Thiên Chúa. Hãy tôn trọng bản thân và yêu thương mọi người.", "Each of us is precious, made in God's image. Respect yourself and love everyone."),
  },
  s7: {
    speaker: "Ngày Thứ Bảy",
    intro: [
      l("“Ngày thứ bảy, Thiên Chúa đã hoàn thành công việc Người làm... Thiên Chúa ban phúc lành cho ngày thứ bảy và thánh hóa ngày đó.” (St 2, 2-3)", "“On the seventh day God finished His work... God blessed the seventh day and made it holy.” (Gen 2:2-3)"),
      l("Đồi Thánh Hóa ngập hoa nở. Sáu Bệ Đàn Thiên Nhiên đại diện cho công trình của sáu ngày. Cả vũ trụ cùng hát Bản Giao Hưởng Tạ Ơn.", "The Holy Hill is full of flowers. Six Nature Pads stand for the six days of work. All creation sings the Symphony of Thanks."),
      l("Chim Bồ Câu sẽ chạm sáng từng bệ và vang một nốt nhạc. Hãy nhớ màu và âm thanh, rồi đến từng bệ nhấn A gõ lại đúng thứ tự. Ba chương: 4, 6 rồi 8 nốt.", "The dove will touch each pad, lighting it with a note. Remember colours and sounds, then go to each pad and press A in the same order. Three movements: 4, 6, then 8 notes."),
    ],
    outro: [
      l("Nốt nhạc thứ tám vang lên trọn vẹn, cả đồi ngân vang thánh ca bình an, hào quang vàng bao phủ muôn vật.", "The eighth note rings out; the whole hill echoes a hymn of peace and golden glory covers all things."),
      l("Ấn Dấu thứ bảy khắc sáng, khép lại Bảy Ngày Tạo Dựng!", "The seventh Seal glows, closing the Seven Days of Creation!"),
    ],
    lesson: l("Hãy giữ ngày Chúa Nhật thánh thiện: đi lễ, nghỉ ngơi bên gia đình và tạ ơn Chúa sau một tuần học tập, làm việc.", "Keep Sunday holy: go to Mass, rest with your family and thank God after a week of work and study."),
  },
  s8: {
    speaker: "Vườn Ê-đen",
    intro: [
      l("“Đức Chúa là Thiên Chúa đem con người đặt vào vườn Ê-đen, để cày cấy và canh giữ đất đai... Người dẫn các con vật đến với con người, xem con người gọi chúng là gì.” (St 2, 15.19)", "“The LORD God took the man and put him in the garden of Eden to till it and keep it... He brought the animals to the man to see what he would call them.” (Gen 2:15.19)"),
      l("Suối Nguồn tỏa ra bốn dòng sông, nhưng đá cuội và cành khô đã làm tắc các rãnh nước. Các luống cây đang héo.", "The Spring flows into four rivers, but pebbles and dry branches have blocked the channels. The beds are withering."),
      l("Nhấn A gần Cần Gạt để mở hoặc đóng đập. Mỗi đập đổi dòng nước của hai nhánh sông cạnh nhau. Làm cho cả bốn dòng cùng chảy, rồi cùng A-đam đặt tên muôn thú.", "Press A near a Lever to open or close a sluice. Each one flips the water of two neighbouring rivers. Make all four flow at once, then help Adam name the animals."),
    ],
    phase2: [l("Bốn dòng sông đã chảy! Muôn thú rụt rè ló ra. Hãy lần theo dấu chân, đến bụi cây quan sát từng con rồi về báo A-đam.", "All four rivers flow! Shy animals peek out. Follow the footprints, watch each one at its bush, then tell Adam.")],
    outro: [
      l("Muôn thú quây quần bên A-đam, nhưng ông chợt trầm tư: giữa muôn vật, chưa có một người bạn tương xứng.", "The animals gather round Adam, yet he grows thoughtful: among all creatures there is no companion like himself."),
      l("Ấn Dấu thứ tám khắc sáng!", "The eighth Seal glows!"),
    ],
    lesson: l("Chúa trao cho chúng ta quyền chăm sóc công trình tạo dựng: hãy khôn ngoan và có trách nhiệm, đừng phá hủy.", "God entrusts creation to our care: be wise and responsible, never destructive."),
  },
  s9: {
    speaker: "Vườn Đôi",
    intro: [
      l("“Con người ở một mình thì không tốt; Ta sẽ làm cho nó một trợ tá tương xứng... Từ chiếc xương sườn đã lấy nơi con người, Thiên Chúa xây dựng thành một người nữ.” (St 2, 18.22)", "“It is not good for the man to be alone; I will make him a helper fit for him... The rib the LORD God had taken from the man He made into a woman.” (Gen 2:18.22)"),
      l("Một dòng suối chia Vườn Đôi: A-đam ở bờ Tây, E-va ở bờ Đông. Màn này không thể giải nếu đi một mình!", "A stream divides the Twin Garden: Adam on the west bank, Eve on the east. This stage cannot be solved alone!"),
      l("Nhấn B (hoặc nút B) để đổi người điều khiển. Người đứng trên Bàn Đạp sẽ giữ nguyên chỗ khi em chuyển sang người kia.", "Press B (or the B button) to swap who you control. Whoever stands on a Plate keeps holding it while you control the other."),
    ],
    outro: [
      l("Cầu ánh sáng nối hai bờ suối. A-đam reo lên: “Phen này, đây là xương bởi xương tôi, thịt bởi thịt tôi!” (St 2, 23)", "A bridge of light joins the banks. Adam cries: “This one at last is bone of my bones and flesh of my flesh!” (Gen 2:23)"),
      l("Ấn Dấu thứ chín khắc sáng!", "The ninth Seal glows!"),
    ],
    lesson: l("Chúng ta cần nhau: hãy yêu thương, đoàn kết và nâng đỡ nhau trong gia đình và tình bạn.", "We need one another: love, unite and support each other in family and friendship."),
  },
  s10: {
    speaker: "Cây Biết Lành Biết Dữ",
    intro: [
      l("“Rắn là loài xảo quyệt nhất trong mọi giống vật ngoài đồng... Rắn hỏi người nữ: ‘Có thật Thiên Chúa bảo: Các ngươi không được ăn hết mọi cây trong vườn không?’” (St 3, 1)", "“The serpent was the most cunning of all the wild animals... He asked the woman, ‘Did God really say, You must not eat from any tree in the garden?’” (Gen 3:1)"),
      l("Con Rắn thì thầm nghi ngờ vào tai E-va. Những làn khói dối trá bay về phía hai người.", "The Serpent whispers doubt into Eve's ear. Clouds of lying smoke drift toward the two."),
      l("Chạy vòng quanh để Khiên Sự Thật chặn khói trước khi chạm E-va và A-đam, tránh các Bẫy tím. Rồi chọn đúng Lời Chúa để đáp lại Con Rắn. Em có 3 Ân Sủng.", "Run around so the Shield of Truth stops the smoke before it reaches Eve and Adam, and avoid the purple Traps. Then choose God's true Word against the Serpent. You have 3 Graces."),
    ],
    fall: [
      l("Dù đã nghe lời nhắc nhở, E-va và A-đam vẫn đưa tay hái trái cấm. Họ đã dùng sai tự do của mình.", "Though warned, Eve and Adam reached out and took the fruit. They misused their freedom."),
      l("Bầu trời Ê-đen tối sầm, sấm rền, hoa lá rụng xuống và gai nhọn mọc lên quanh Cây.", "The Eden sky darkens, thunder rolls, leaves fall and thorns sprout round the Tree."),
    ],
    outro: [
      l("Ấn Dấu thứ mười hiện lên với một vết nứt sám hối trên Cuộn Sách.", "The tenth Seal appears with a crack of repentance on the Scroll."),
      l("Nhưng Thiên Chúa vẫn chưa bỏ rơi con người...", "But God has not abandoned His children..."),
    ],
    lesson: l("Cám dỗ luôn bắt đầu bằng việc nghi ngờ tình yêu của Chúa. Hãy tỉnh thức và vâng giữ Lời Chúa.", "Temptation always begins by doubting God's love. Stay watchful and keep His Word."),
  },
  s11: {
    speaker: "Chiều Gió Thổi",
    intro: [
      l("“Họ nghe thấy tiếng Đức Chúa đi dạo trong vườn lúc chiều gió thổi, thì con người và vợ mình trốn vào giữa cây cối... Đức Chúa gọi con người và hỏi: ‘Ngươi ở đâu?’” (St 3, 8-9)", "“They heard the LORD God walking in the garden in the cool of the day, and they hid among the trees... The LORD God called to the man, ‘Where are you?’” (Gen 3:8-9)"),
      l("Rừng chiều đầy gai. Những Bóng Sợ Hãi tuần tra với vùng nhìn màu đỏ. A-đam và E-va đang trốn ở hai góc khuất.", "The evening wood is full of thorns. Fear Phantoms patrol with red sight cones. Adam and Eve hide in two far corners."),
      l("Núp sau bụi cây để tránh vùng nhìn. Nhấn A tại Khóa Ánh Sáng để dùng Đèn Lương Tâm mở đường. Nếu bị phát hiện, em về lại điểm an toàn.", "Hide behind bushes to avoid the sight cones. Press A at a Light Lock to open the way with the Lantern of Conscience. If seen, you return to the last safe spot."),
    ],
    outro: [
      l("A-đam và E-va cúi đầu bước ra khỏi bóng tối, đứng trước Ánh Sáng của Chúa và nhìn nhận lỗi lầm.", "Adam and Eve step out of the shadows with bowed heads and own their fault before God's Light."),
      l("Ấn Dấu thứ mười một khắc sáng!", "The eleventh Seal glows!"),
    ],
    lesson: l("Khi lỡ phạm lỗi, đừng trốn tránh hay đổ thừa. Hãy can đảm thưa thật với Chúa và xin lỗi cha mẹ, bạn bè.", "When you fail, don't hide or blame. Bravely tell God the truth and say sorry to parents and friends."),
  },
  s12: {
    speaker: "Lời Hứa Cứu Độ",
    intro: [
      l("“Ta sẽ đặt mối thù giữa mi và người nữ, giữa dòng dõi mi và dòng dõi người nữ; dòng dõi đó sẽ đánh vào đầu mi, và mi sẽ rình cắn vào gót chân người.” (St 3, 15)", "“I will put enmity between you and the woman, and between your offspring and hers; He will strike your head, and you will strike His heel.” (Gen 3:15)"),
      l("Thiên Chúa mặc áo da cho A-đam và E-va rồi cho họ rời Vườn. Ngoài kia là đất tối, lạnh và đầy gai, nhưng Người đã hứa cứu độ.", "God clothes Adam and Eve in garments of skin and sends them from the Garden. Outside it is dark, cold and thorny, but He has promised salvation."),
      l("Em cầm Ngọn Đuốc Lời Hứa. A-đam và E-va đi theo khi em ở gần. Nhặt Dầu Ân Sủng giữ lửa, tránh Bóng Rắn, và nhấn A đúng lúc để thắp 5 Cột Mốc.", "You carry the Torch of Promise. Adam and Eve follow while you stay close. Gather Grace Oil to keep the flame, dodge the Shadow Serpents, and press A at the right moment to light the 5 Pillars."),
    ],
    pillars: [
      l("Áo Da Tình Thương: dù con người phạm tội, Chúa vẫn chăm sóc và che chở.", "Garments of Love: though we sin, God still cares for and shelters us."),
      l("Lời Hứa Người Nữ: tiên báo Đức Trinh Nữ Maria, E-va Mới vâng phục.", "The Woman's Promise: it foretells the Virgin Mary, the obedient New Eve."),
      l("Dòng Dõi Đạp Đầu Rắn: tiên báo Chúa Giêsu chiến thắng tội lỗi.", "The Offspring Crushing the Serpent: it foretells Jesus' victory over sin."),
      l("Lao Động và Sám Hối: biến giọt mồ hôi thành lời cầu nguyện.", "Labour and Repentance: turn our sweat into prayer."),
      l("Cây Sự Sống Mới: Thập Giá Chúa Giêsu sẽ mở lại cửa Thiên Đàng.", "The New Tree of Life: the Cross of Jesus will reopen the gates of heaven."),
    ],
    outro: [
      l("Cột Mốc cuối cùng bừng sáng, bình minh ló dạng. Cầu vồng nối cổng Ê-đen xưa tới thành Nazareth, nơi Mẹ Maria sẽ thưa “Xin Vâng”.", "The last Pillar blazes and dawn breaks. A rainbow joins the old Eden gate to Nazareth, where Mary will say “Yes”."),
      l("Ấn Dấu thứ mười hai hoàn tất Cuộn Sách Sáng Thế: 12 trên 12!", "The twelfth Seal completes the Genesis Scroll: 12 of 12!"),
    ],
    lesson: l("Tội lỗi làm tổn thương con người, nhưng lòng thương xót của Chúa lớn hơn bội phần. Người đã hứa và sai Chúa Giêsu cùng Mẹ Maria đến cứu chuộc chúng ta.", "Sin wounds us, but God's mercy is far greater. He promised, and sent Jesus and Mary to redeem us."),
  },
  s13: {
    speaker: "Khu Vườn Tâm Hồn",
    intro: [
      l("“Vì như bởi sự không vâng phục của một người mà muôn người đã trở thành tội nhân, thì cũng một thể ấy, bởi sự vâng phục của Một Người mà muôn người sẽ trở nên công chính.” (Rm 5, 19)", "“For just as through the disobedience of one man the many were made sinners, so through the obedience of one the many will be made righteous.” (Rom 5:19)"),
      l("Em đã trở về căn phòng nhỏ. Nắng trưa dịu nhẹ, cuốn Kinh Thánh mở cạnh Chuỗi Mân Côi, và chậu hoa bên cửa sổ đã nở bông trắng.", "You are back in your little room. Gentle noon light, the Bible open beside the Rosary, and the flower by the window in white bloom."),
      l("Chúa Thánh Thần trao cho em hai khu vườn để chăm sóc: Ngôi Nhà Chung Trái Đất và Khu Vườn Tâm Hồn. Hãy đến ba góc phòng (cửa sổ, bàn học, góc cầu nguyện) để lập Ba Cam Kết.", "The Holy Spirit entrusts you with two gardens: our Common Home, the Earth, and the Garden of your Soul. Visit three corners (window, desk, prayer corner) to make Three Promises."),
    ],
    window: {
      q: l("Khi nhìn thấy bầu trời, cây cối và muôn loài Chúa dựng nên trong 6 ngày, con sẽ sống thế nào?", "Seeing the sky, the trees and creatures God made in six days, how will you live?"),
      ok: l("Tạ ơn Chúa, giữ gìn vệ sinh, tiết kiệm nước – ánh sáng và yêu thương thiên nhiên.", "Thank God, keep things clean, save water and light, and love nature."),
      bad: [l("Thiên nhiên nhiều lắm, dùng phí một chút cũng không sao.", "There is so much nature, a little waste does no harm."), l("Đó là việc của người lớn, con không cần lo.", "That is for grown-ups, I need not care.")],
      done: l("Cam kết thứ nhất: em sẽ chăm sóc Ngôi Nhà Chung Trái Đất.", "First promise: you will care for our Common Home."),
    },
    desk: {
      q: l("Nếu có lúc con bị cám dỗ nói dối, làm biếng hoặc lỡ làm điều sai như ông bà nguyên tổ, con sẽ làm gì?", "If you are ever tempted to lie, to be lazy, or you do wrong like our first parents, what will you do?"),
      ok: l("Không trốn tránh hay đổ lỗi, nhưng can đảm xin lỗi Chúa và sửa sai ngay.", "Not hide or blame, but bravely say sorry to God and make it right at once."),
      bad: [l("Giấu đi, đừng cho ai biết là xong.", "Hide it and let no one know."), l("Đổ lỗi cho người khác cho nhẹ lòng.", "Blame someone else to feel better.")],
      done: l("Cam kết thứ hai: em sẽ thắng cám dỗ và can đảm nhận lỗi.", "Second promise: you will resist temptation and bravely own your faults."),
    },
    altar: [
      l("Em đặt Cuộn Sách Sáng Thế (12/12 Ấn Dấu) cạnh Chuỗi Mân Côi. Cả hai cùng tỏa sáng.", "You set the Genesis Scroll (12/12 Seals) beside the Rosary. Both begin to glow."),
      l("Chúa Thánh Thần mỉm cười: “Con thấy không? Lời hứa ở cuối Vườn Địa Đàng (St 3, 15) đã được thực hiện nơi Chúa Giêsu – A-đam Mới và Mẹ Maria – E-va Mới!”", "The Holy Spirit smiles: “See? The promise at the end of Eden (Gen 3:15) is fulfilled in Jesus, the New Adam, and Mary, the New Eve!”"),
      l("“Hãy giữ Khu Vườn Tâm Hồn con luôn xanh tươi bằng Lời Chúa mỗi ngày nhé!”", "“Keep the Garden of your Soul ever green with God's Word each day!”"),
    ],
    notYet: l("Em hãy lập hai cam kết ở cửa sổ và bàn học trước, rồi trở lại góc cầu nguyện nhé.", "First make the two promises at the window and the desk, then come back to the prayer corner."),
    outro: [
      l("Ba Cam Kết của Người Quản Gia Nhỏ đã được lập. Khu vườn của Chúa đang chờ em chăm sóc!", "The Little Steward's Three Promises are made. God's garden awaits your care!"),
    ],
    lesson: l("Trân trọng công trình tạo dựng của Thiên Chúa, giữ tâm hồn sạch tội, sống vâng phục và cậy trông vào ơn cứu độ của Chúa Giêsu.", "Treasure God's creation, keep your soul free from sin, live in obedience and trust in the salvation of Jesus."),
  },
};

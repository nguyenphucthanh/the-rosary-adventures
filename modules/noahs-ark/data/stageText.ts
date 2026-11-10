import type { L } from "@/modules/noahs-ark/data/dialogues";

const l = (vi: string, en: string): L => ({ vi, en });

/** Intro / outro / lesson per stage. The game reads `.vi`; `.en` is ready for a language toggle. In-play hint labels stay Vietnamese-only inside the scenes. */
export const NOAH_TEXT = {
  s1: {
    speaker: "Người Công Chính",
    intro: [
      l("“Đức Chúa thấy sự gian ác của con người quá lớn trên mặt đất... Nhưng ông Nô-ê được đẹp lòng Đức Chúa.” (St 6, 5.8)", "“The Lord saw how great the wickedness of man was on the earth... But Noah found favor in the Lord's eyes.” (Gen 6:5, 8)"),
      l("Thung lũng chìm trong sương đen của cãi vã và gian dối. Em cầm Đèn Công Chính đi tìm bốn Bệ Đá Lương Tâm để mở đường lên Đồi Cầu Nguyện, nơi ông Nô-ê đang chờ.", "The valley lies under a black mist of quarrels and lies. You carry the Righteous Lantern to find four Conscience Stones and open the way to Prayer Hill, where Noah waits."),
      l("Nhấn A gần bệ đá để thắp sáng. Tránh vùng quét đỏ của Bóng Xoáy Bất Hòa. Khi có vạch gió cảnh báo, hãy nép sau Tường Đá Đức Tin kẻo đèn tắt!", "Press A near a stone to light it. Avoid the red sight cone of the Discord Shadows. When the wind warning shows, shelter behind a Faith Wall or your lantern goes out!"),
    ],
    outro: [
      l("Trên đồi bình an, Thiên Chúa phán với ông Nô-ê về cơn hồng thủy sắp tới và trao cho ông sứ mạng đóng một con tàu lớn để cứu gia đình cùng muôn loài.", "On the peaceful hill God tells Noah of the flood to come and entrusts him with building a great ark to save his family and every creature."),
      l("Ấn Dấu thứ nhất bừng sáng trên Hải Đồ Giao Ước!", "The first Seal glows on the Covenant Sea Chart!"),
    ],
    lesson: l("Dù người khác xung quanh có làm điều xấu, người con ngoan của Chúa vẫn kiên tâm chọn điều tốt và sống ngay thật.", "Even when others around us do wrong, God's good children keep choosing what is good and live honestly."),
  },
  s2: {
    speaker: "Bản Vẽ Của Chúa",
    intro: [
      l("“Ngươi hãy dùng gỗ bách mà làm cho mình một con tàu... lấy nhựa thông mà trét cả trong lẫn ngoài... Ngươi sẽ làm tàu có tầng dưới, tầng thứ hai rồi tầng thứ ba.” (St 6, 14.16)", "“Make yourself an ark of cypress wood... cover it with pitch inside and out... make it with lower, middle and upper decks.” (Gen 6:14, 16)"),
      l("Công trường giữa rừng bách đã sẵn sàng. Em giúp ông Nô-ê và các con lắp ba tầng khung tàu đúng theo bản vẽ của Chúa.", "The site among the cypress trees is ready. Help Noah and his sons build the three decks exactly as God drew them."),
      l("Đi vào khối gỗ để đẩy nó vào ô trống có viền vàng. Khi đủ gỗ, lấy nhựa thông ở thùng rồi chạy trét hết các mối nối trước khi nhựa nguội. Đẩy vào góc chết thì bấm THỬ LẠI.", "Walk into a block to push it into a gold-framed slot. When all fit, take pitch from the pot and rush to seal every joint before it cools. Stuck in a corner? Press RETRY."),
    ],
    floorDone: [l("Tầng này khít rồi! Bước lên tầng tiếp theo nào.", "This deck fits! On to the next deck.")],
    cooled: [l("Nhựa thông đã nguội! Hãy lấy lại nhựa nóng và trét nhanh hơn nhé.", "The pitch has cooled! Take fresh hot pitch and seal faster.")],
    outro: [
      l("Con tàu gỗ bách ba tầng sừng sững giữa đất khô: “Ông Nô-ê đã làm như vậy; mọi điều Thiên Chúa truyền cho ông, ông đều làm đúng hết.” (St 6, 22)", "The three-deck cypress ark stands on dry land: “Noah did everything just as God commanded him.” (Gen 6:22)"),
      l("Ấn Dấu thứ hai khắc sáng!", "The second Seal glows!"),
    ],
    lesson: l("Vâng lời và kiên trì: ông Nô-ê không ngại vất vả nhiều năm để làm đúng lời Chúa dạy, dù lúc đó trời chưa có một giọt mưa.", "Obey and persevere: Noah worked hard for years to do what God asked, though not a drop of rain had yet fallen."),
  },
  s3: {
    speaker: "Muôn Thú Lên Tàu",
    intro: [
      l("“Ngươi sẽ đưa vào tàu mỗi thứ một đôi, một đực một cái, để giữ cho chúng sống với ngươi... Từng đôi một đến với ông Nô-ê mà vào tàu, như Thiên Chúa đã truyền.” (St 6, 19; 7, 9)", "“Bring into the ark two of every kind, male and female, to keep them alive with you... Pair by pair they came to Noah and entered the ark, as God had commanded.” (Gen 6:19; 7:9)"),
      l("Mây tím báo bão đang kéo đến. Tiếng sấm làm vài con thú lạc mất bạn đời. Hãy tìm và gọi chúng về, rồi dẫn từng đôi vào đúng khoang tàu.", "Purple storm clouds roll in. Thunder has scattered some animals from their mates. Find and call them back, then guide each pair to its own cabin."),
      l("Gần cần gạt, nhấn A để đổi hướng đường mòn hoặc mở/đóng cổng rào. Thú dữ không được gặp thú hiền trên cùng một đường, và mỗi cặp phải vào đúng khoang!", "Near a lever press A to switch a trail or open/close a gate. Fierce animals must never meet gentle ones on the same trail, and every pair must reach its own cabin!"),
    ],
    found: [l("Tìm thấy rồi! Con thú chạy về điểm tập kết bên cửa tàu.", "Found! The animal runs to the gathering spot by the ark door.")],
    phase2: [l("Các cặp thú đã đông đủ! Giờ hãy đổi cần gạt để phân luồng, đợt đầu tiên bắt đầu.", "All the pairs are here! Now switch the levers to route them. The first group begins.")],
    wave: [l("Đợt này xong rồi, tiếp theo là đợt đông hơn!", "That group is aboard. A bigger one comes next!")],
    outro: [
      l("Muôn loài và lương thực đã yên vị trong các ngăn tàu; gia đình tám người của ông Nô-ê bước lên tàu sau cùng.", "All creatures and food are settled in their rooms; Noah's family of eight steps aboard last."),
      l("Ấn Dấu thứ ba khắc sáng!", "The third Seal glows!"),
    ],
    lesson: l("Thiên Chúa thương yêu và lo liệu cho từng sinh vật nhỏ bé; trong nhà Chúa, mọi loài đều có chỗ đứng và được chở che.", "God loves and provides for every little creature; in His house all have a place and are sheltered."),
  },
  s4: {
    speaker: "Bốn Mươi Đêm Mưa",
    intro: [
      l("“Các nguồn của vực thẳm bao la nổ tung ra, và các cống trời mở toang. Mưa đổ xuống đất suốt bốn mươi ngày và bốn mươi đêm... Rồi Đức Chúa đóng cửa lại sau lưng ông.” (St 7, 11-12.16)", "“All the springs of the great deep burst forth, and the floodgates of the heavens were opened. Rain fell forty days and forty nights... Then the Lord shut him in.” (Gen 7:11-12, 16)"),
      l("Bão ập đến! Nước ép vào thân tàu làm ván rỉ nước và cửa sổ bung chốt. Hãy lấy nhựa thông và chốt gỗ bách ở bàn chế tác để bịt kín con tàu.", "The storm hits! Water presses on the hull, leaking planks and bursting window latches. Take pitch and cypress pins from the work table to seal the ark."),
      l("Khe nước xanh lam cần Nhựa Thông. Cửa sổ xám cần Chốt Gỗ. Mỗi lần mang một món. Cẩn thận vũng nước trơn! Giữ Độ An Toàn của tàu đừng về 0.", "Blue leaks need Pitch. Grey windows need a Pin. Carry one item at a time. Mind the slippery puddles! Keep the Hull Integrity above 0."),
    ],
    wave: [l("Hết một đợt sóng dâng! Tàu vẫn vững. Đợt tiếp theo mạnh hơn.", "One surge is over and the ark holds! The next is stronger.")],
    last: [l("Đợt cuối đã qua. Hãy cùng ông Nô-ê kéo cần gạt đóng Cửa Chính!", "The last surge is past. Pull the lever with Noah to close the Main Door!")],
    outro: [
      l("Khi chốt khóa cuối cùng cài xong, một luồng ánh sáng vàng từ bên ngoài bao phủ cánh cửa chính: chính Thiên Chúa đã đóng cửa tàu lại để bảo vệ gia đình Nô-ê trước dòng nước lũ!", "When the last latch is set, a golden light from outside wraps the main door: God Himself has shut the ark to keep Noah's family safe from the flood!"),
      l("Ấn Dấu thứ tư hoàn tất!", "The fourth Seal is complete!"),
    ],
    lesson: l("Khi ta đã làm hết sức mình theo lời Chúa dạy, chính Thiên Chúa sẽ che chở ta trước mọi bão giông cuộc đời.", "When we have done our best by God's word, God Himself shelters us from every storm of life."),
  },
  s5: {
    speaker: "Biển Nước Mênh Mông",
    intro: [
      l("“Nước dâng lên và tăng thêm thật nhiều trên mặt đất, còn tàu thì trôi đi trên mặt nước. Mọi núi cao dưới gầm trời đều bị phủ ngập.” (St 7, 18-19)", "“The waters rose and increased greatly on the earth, and the ark floated on the surface. All the high mountains under the heavens were covered.” (Gen 7:18-19)"),
      l("Ngoài kia chỉ còn biển nước. Trong tàu, đèn dầu vẫn ấm áp, nhưng sóng ngầm cứ đánh nghiêng con tàu và muôn thú thì sợ hãi.", "Outside there is only sea. Inside the lamps are warm, but great waves keep tilting the ark and the animals are frightened."),
      l("Khi có mũi tên sóng, nhấn A cạnh Thùng Lương Thực để đẩy nó sang bên đối diện, giữ kim thăng bằng trong vùng xanh. Mang Cỏ, Đèn hoặc Chăn Rơm từ kệ phía trên tới khoang thú đang cần giúp. Chăm đủ 12 lượt!", "When a wave arrow shows, press A beside a Food Crate to shove it to the other side and keep the needle in the green. Carry Hay, a Lamp or a Straw Blanket from the shelf to each animal that needs help. Care 12 times!"),
    ],
    leg: [l("Chặng đầu đã vững! Sóng sắp mạnh hơn và dồn dập hơn.", "The first leg is steady! The waves will be stronger and closer together.")],
    tipped: [l("Tàu nghiêng quá lâu! Em thử lại chặng này nhé. Hãy đẩy thùng sang bên đối diện ngay khi thấy mũi tên sóng.", "The ark tilted too long! Try this leg again. Shove a crate to the other side as soon as you see the wave arrow.")],
    panic: [l("Có con thú sợ hãi chờ quá lâu! Em thử lại chặng này nhé.", "An animal waited too long and panicked! Try this leg again.")],
    outro: [
      l("Trong khoang tàu ấm áp, cả gia đình ông Nô-ê quây quần cầu nguyện dưới ánh đèn, kiên nhẫn chờ ngày Chúa cho nước rút.", "In the warm hold Noah's family gathers to pray beneath the lamps, patiently waiting for the day God lets the waters fall."),
      l("Ấn Dấu thứ năm khắc sáng!", "The fifth Seal glows!"),
    ],
    lesson: l("Kiên nhẫn, yêu thương chăm sóc nhau và giữ bình an trong lòng, ngay cả khi hoàn cảnh bên ngoài đang khó khăn.", "Be patient, care for one another and keep peace in your heart even when things outside are hard."),
  },
  s6: {
    speaker: "Ngọn Gió Của Chúa",
    intro: [
      l("“Thiên Chúa nhớ đến ông Nô-ê... Thiên Chúa cho một cơn gió thổi qua mặt đất, và nước bắt đầu rút xuống... Tàu đậu lại trên núi A-ra-rát.” (St 8, 1.4)", "“God remembered Noah... and God sent a wind over the earth, and the waters receded... the ark came to rest on the mountains of Ararat.” (Gen 8:1, 4)"),
      l("Mây đen tan dần. Em cùng ông Nô-ê đứng ở mũi tàu, lái con tàu về phía núi A-ra-rát ở phương Bắc.", "The dark clouds part. You and Noah stand at the bow and steer the ark north toward Mount Ararat."),
      l("Dùng phím mũi tên / cần điều khiển để bẻ lái. Nhấn A để mở hoặc thu cánh buồm. Mở buồm trong luồng gió vàng để được đẩy đi, nhưng thu buồm khi vào gió xoáy ngang, kẻo bị thổi vào đá ngầm! Chạm 3 Hải Đăng để nước rút dần.", "Use the arrows / stick to steer and press A to open or furl the sail. Open the sail in the golden wind to be pushed along, but furl it in cross-gusts or you drift onto the reefs! Touch 3 Beacons to let the water fall."),
    ],
    beacon: [l("Hải đăng sáng lên! Nước rút xuống một nấc.", "The beacon lights! The water falls a notch.")],
    hit: [l("Con tàu va vào đá! Em quay lại hải đăng gần nhất và thử lại nhé.", "The ark struck the reef! Back to the last beacon to try again.")],
    outro: [
      l("Con tàu từ từ đậu yên vững vàng trên sườn núi A-ra-rát giữa tiếng reo vui tạ ơn của cả gia đình.", "The ark settles gently and firmly on the slopes of Ararat among the thankful cheers of the whole family."),
      l("Ấn Dấu thứ sáu bừng sáng!", "The sixth Seal shines!"),
    ],
    lesson: l("“Thiên Chúa nhớ đến ông Nô-ê”: Chúa không bao giờ quên chúng ta. Sau cơn mưa trời lại sáng.", "“God remembered Noah”: He never forgets us. After the rain the sky clears."),
  },
  s7: {
    speaker: "Chim Bồ Câu",
    intro: [
      l("“Ông Nô-ê thả chim bồ câu ra... Đến chiều, chim bồ câu trở về với ông, và kìa, trong mỏ nó có một cành lá ô-liu tươi!” (St 8, 8.11)", "“Noah sent out a dove... and in the evening the dove returned to him, and there in its beak was a freshly plucked olive leaf!” (Gen 8:8, 11)"),
      l("Ông Nô-ê mở cửa sổ tàu. Em hóa thành chú chim bồ câu nhỏ, bay đi tìm xem đất đã khô chưa. Có ba lần thả chim, mỗi lần một khó hơn.", "Noah opens the window of the ark. You become the little dove and fly out to see if the land is dry. There are three flights, each harder than the last."),
      l("Dùng phím mũi tên / cần điều khiển để bay. Lượn qua Vòng Khí Ấm vàng để lấy lại sức. Tránh Gió Lốc đen. Cuối mỗi chặng, bay về cửa sổ tàu.", "Use the arrows / stick to fly. Glide through the golden Warm Rings to regain strength. Avoid the black Whirlwinds. At the end of each flight, return to the ark window."),
    ],
    raven: [l("Con quạ bay đi mãi mà không trở lại. Bây giờ đến lượt chú bồ câu!", "The raven flew off and never came back. Now it is the dove's turn!")],
    legs: [
      [l("Lần thả thứ nhất: mặt đất còn chìm trong nước. Hãy bay qua 3 điểm mốc rồi về tàu trước khi mỏi cánh.", "First flight: the land is still under water. Fly over 3 landmarks, then return before your wings tire.")],
      [l("Bảy ngày sau: nước đã rút bớt. Hãy bay qua gió lốc tới đồi ô-liu, hái một nhành lá tươi rồi mang về.", "Seven days later: the water has dropped. Fly past the whirlwinds to the olive hill, pick a fresh branch and bring it back.")],
      [l("Bảy ngày nữa: bình minh trên đất khô. Hãy bay xua tan sương mù trên 4 cánh đồng rồi báo tin cho ông Nô-ê.", "Seven days more: dawn over dry land. Fly through the mist over 4 fields to clear them, then tell Noah.")],
    ],
    olive: [l("Em hái được nhành ô-liu xanh tươi! Hãy mang về cho ông Nô-ê.", "You pick a fresh olive branch! Carry it back to Noah.")],
    back: [l("Chú chim mỏi cánh bay về cửa sổ tàu. Thử lại nào!", "The little dove tires and flies back to the window. Try again!")],
    outro: [
      l("Nhìn nhành ô-liu xanh trong mỏ chim bồ câu, ông Nô-ê biết chắc mặt đất đã hồi sinh và bình an của Chúa đã trở lại.", "Seeing the green olive branch in the dove's beak, Noah knows the earth is alive again and God's peace has returned."),
      l("Ấn Dấu thứ bảy khắc sáng!", "The seventh Seal glows!"),
    ],
    lesson: l("Bồ câu ngậm nhành ô-liu là dấu chỉ Chúa Thánh Thần và Bình An. Hãy là sứ giả mang lời hiền hòa và niềm vui đến cho mọi người.", "The dove with the olive branch is a sign of the Holy Spirit and of peace. Be a messenger of gentle words and joy."),
  },
  s8: {
    speaker: "Giao Ước Cầu Vồng",
    intro: [
      l("“Ông Nô-ê dựng một bàn thờ kính Đức Chúa... Thiên Chúa phán: ‘Ta đặt cây cung của Ta trong mây, nó sẽ là dấu chỉ giao ước giữa Ta với mặt đất.’” (St 8, 20; 9, 13)", "“Noah built an altar to the Lord... God said: ‘I have set My bow in the clouds, and it will be the sign of the covenant between Me and the earth.’” (Gen 8:20; 9:13)"),
      l("Việc đầu tiên ông Nô-ê làm trên đất khô là dựng bàn thờ tạ ơn Chúa. Em hãy nhặt 12 Viên Đá Tinh Tuyền rải rác trên đồi và mang về bàn thờ. Gặp suối thì nhặt ván gỗ để bắc cầu.", "Noah's first act on dry land was to build an altar of thanks. Gather the 12 Pure Stones scattered on the hill and bring them to the altar. At a stream, pick up a plank to bridge it."),
      l("Khi lửa lễ vật bốc lên, ánh sáng từ trời sẽ chiếu xuống bàn thờ. Nhấn A cạnh Trụ Tinh Thể để xoay hướng, dẫn tia sáng qua 7 màu: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím.", "When the offering fire rises, light shines down on the altar. Press A beside a Crystal Pillar to turn it and lead the ray through the 7 colours: Red, Orange, Yellow, Green, Blue, Indigo, Violet."),
    ],
    plank: [l("Em đã bắc ván qua suối!", "You laid the plank across the stream!")],
    stones: [l("Đủ 12 viên đá! Em xếp bàn thờ, và ông Nô-ê thắp lửa lễ vật tạ ơn Chúa.", "All 12 stones! You build the altar and Noah lights the thanksgiving fire.")],
    phase2: [l("Ánh sáng trắng từ trời chiếu xuống bàn thờ. Các Trụ Tinh Thể hiện ra. Hãy dẫn tia sáng qua 7 màu theo thứ tự cầu vồng!", "White light falls on the altar and the Crystal Pillars appear. Lead the ray through the seven colours in rainbow order!")],
    colours: ["Đỏ – Tình Yêu", "Cam – Hy Vọng", "Vàng – Tín Trung", "Lục – Sự Sống", "Lam – Bình An", "Chàm – Trông Cậy", "Tím – Thánh Ân"],
    outro: [
      l("Bảy sắc nối liền một mạch: Cầu Vồng Giao Ước vươn cao bao trùm cả bầu trời! Thiên Chúa chúc lành cho gia đình ông Nô-ê và lập giao ước muôn đời với mọi loài.", "Seven colours join in one: the Rainbow of the Covenant arches over the sky! God blesses Noah's family and makes an everlasting covenant with every creature."),
      l("Ấn Dấu thứ tám hoàn tất. Hải Đồ Giao Ước đã đủ 8/8 Ấn Dấu!", "The eighth Seal is complete. The Covenant Sea Chart now shows 8/8 Seals!"),
    ],
    lesson: l("Hãy biết ơn: được Chúa giúp thì thưa “Con cảm ơn Chúa!”. Mỗi lần thấy cầu vồng, hãy nhớ tình yêu trung tín muôn đời của Thiên Chúa.", "Be thankful: when God helps you, say “Thank You, Lord!”. Whenever you see a rainbow, remember God's faithful love."),
  },
  epilogue: {
    speaker: "Con Tàu Hội Thánh",
    intro: [
      l("“Trong tàu có một số ít, tức là tám người, được cứu thoát nhờ nước. Nước đó là hình ảnh phép rửa nay cứu thoát anh em.” (1 Pr 3, 20-21)", "“In the ark a few, that is eight people, were saved through water. That water symbolizes baptism that now saves you.” (1 Pet 3:20-21)"),
      l("Em đã trở về căn phòng nhỏ. Nắng chiều ngập tràn sau cơn mưa, cầu vồng sáng ngoài cửa sổ. Hãy đến ba góc phòng để thực hiện Ba Cam Kết của Người Thủy Thủ Đức Tin.", "You are back in your little room. Afternoon sun fills it after the rain and a rainbow shines at the window. Visit three corners of the room to make the Three Promises of the Sailor of Faith."),
    ],
    ark: {
      q: l("Khi bạn bè rủ làm điều sai trái hoặc chê cười việc tốt, em học được gì nơi ông Nô-ê?", "When friends tempt you to do wrong or laugh at your good deeds, what do you learn from Noah?"),
      right: l("Can đảm sống ngay thẳng và kiên trì vâng lời Chúa, dù phải đi ngược dòng.", "Live bravely and uprightly and keep obeying God, even against the current."),
      wrong: [l("Hãy nhớ ông Nô-ê: ông không chạy theo đám đông mà vẫn làm điều Chúa dạy. Thử lại nhé!", "Remember Noah: he did not follow the crowd but did what God asked. Try again!")],
      options: [l("Làm theo bạn bè cho vui, đừng nổi bật.", "Follow friends to fit in, don't stand out."), l("Can đảm sống ngay thẳng và kiên trì vâng lời Chúa, dù phải đi ngược dòng.", "Live bravely and uprightly and keep obeying God, even against the current."), l("Bỏ cuộc, vì chẳng ai làm cùng.", "Give up, since nobody joins you.")],
    },
    window: [
      l("Chúa Thánh Thần giải thích lời Thánh Phê-rô: “Con Tàu Nô-ê xưa là hình ảnh tiên báo về Hội Thánh, và nước Hồng Thủy là hình ảnh của Bí tích Rửa Tội, tái sinh chúng ta làm con cái Chúa!” (1 Pr 3, 20-21)", "The Holy Spirit explains St Peter's words: “Noah's Ark was a sign of the Church, and the Flood a sign of Baptism, which makes us God's children anew!” (1 Pet 3:20-21)"),
      l("Nhờ Bí tích Rửa Tội, em được bước lên Con Tàu Hội Thánh để Chúa dẫn về bến bình an.", "Through Baptism you step aboard the Ark of the Church, and God leads you to the harbour of peace."),
    ],
    prayer: {
      q: l("Hải Đồ Giao Ước (8/8 Ấn Dấu), Cuộn Sách Sáng Thế và Chuỗi Mân Côi đã đặt cạnh nhau. Em quyết tâm điều gì?", "The Covenant Sea Chart (8/8 Seals), the Genesis scroll and the Rosary lie side by side. What do you resolve?"),
      right: l("Làm chim bồ câu mang nhành ô-liu: hòa thuận và tha thứ cho gia đình, bạn bè.", "Be the dove with the olive branch: make peace and forgive at home and at school."),
      wrong: [l("Chim bồ câu mang nhành ô-liu là dấu chỉ bình an và tha thứ. Thử lại nhé!", "The dove with the olive branch stands for peace and forgiveness. Try again!")],
      options: [l("Giữ cho mình thôi, mặc người khác.", "Keep it to myself and ignore others."), l("Làm chim bồ câu mang nhành ô-liu: hòa thuận và tha thứ cho gia đình, bạn bè.", "Be the dove with the olive branch: make peace and forgive at home and at school.")],
    },
    left: { vi: "Còn {n} cam kết nữa. Hãy đến các góc còn lại nhé!", en: "{n} promises remain. Visit the other corners!" },
    done: [
      l("Chúa Thánh Thần mỉm cười: “Con đã trở thành Người Thủy Thủ Đức Tin. Hãy đem bình an của Chúa đến mọi nơi!”", "The Holy Spirit smiles: “You are now a Sailor of Faith. Carry God's peace everywhere!”"),
    ],
    lesson: l("Yêu mến Hội Thánh như Con Tàu Cứu Độ của Chúa, trân trọng ơn Bí tích Rửa Tội và luôn sống tâm tình tạ ơn, hòa bình.", "Love the Church as God's Ark of salvation, treasure the grace of Baptism and live thankful and peaceful."),
    end: [l("Hành trình Con Tàu Nô-ê đã khép lại. Cảm ơn em đã đồng hành. Cầu vồng của Chúa luôn ở cùng em!", "Noah's Ark journey is complete. Thank you for sailing along. God's rainbow is always with you!")],
  },
};

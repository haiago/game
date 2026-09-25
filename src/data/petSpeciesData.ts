export interface PetStage {
  level: number;
  reqStars: number;
  title: string;
  desc: string;
}

export interface PetSpecies {
  id: 'dragon' | 'cat' | 'penguin' | 'unicorn' | 'phoenix' | 'fox';
  name: string;
  icon: string;
  eggIcon: string;
  themeColor: string;
  badge: string;
  stages: PetStage[];
  quotes: string[];
}

export const PET_SPECIES_DATA: Record<string, PetSpecies> = {
  dragon: {
    id: 'dragon',
    name: 'Bé Rồng Lửa',
    icon: '🦖',
    eggIcon: '🥚🔥',
    themeColor: 'from-orange-400 to-rose-500',
    badge: 'Dũng Cảm 🔥',
    stages: [
      { level: 1, reqStars: 0, title: 'Quả Trứng Lửa', desc: 'Cần bé đọc bài và tính toán chăm chỉ để ấp nở!' },
      { level: 2, reqStars: 5, title: 'Rồng Con Nứt Vỏ', desc: 'Rồng hé mắt chào bé và bắt đầu nhún nhảy vui vẻ!' },
      { level: 3, reqStars: 15, title: 'Rồng Lửa Học Đọc', desc: 'Đã mọc thêm đôi cánh nhỏ vỗ cánh bay lượn!' },
      { level: 4, reqStars: 30, title: 'Chiến Binh Rồng', desc: 'Phun ra những quả cầu lửa tí hon chúc mừng bé!' },
      { level: 5, reqStars: 50, title: 'Vua Rồng Hoàng Gia 👑', desc: 'Đội vương miện vàng, thần hộ mệnh thông thái của bé!' }
    ],
    quotes: [
      "Gàooo! Bé học giỏi quá đi! 🔥",
      "Rồng lửa gửi ngàn tim tới bé nè! ❤️",
      "Cố lên bạn ơi, sắp tiến hóa cấp mới rồi! 🚀",
      "Bé đọc chuẩn và tính nhanh xuất sắc luôn! 🌟"
    ]
  },
  cat: {
    id: 'cat',
    name: 'Mèo Bánh Bao',
    icon: '🐱',
    eggIcon: '🥚🌿',
    themeColor: 'from-emerald-400 to-teal-500',
    badge: 'Đáng Yêu 🐾',
    stages: [
      { level: 1, reqStars: 0, title: 'Quả Trứng Cỏ May', desc: 'Cần hơi ấm chăm chỉ học tập của bé để trứng nở!' },
      { level: 2, reqStars: 5, title: 'Mèo Con Mắt Tròn', desc: 'Mở mắt to tròn, kêu meo meo vẫy đuôi mừng bé!' },
      { level: 3, reqStars: 15, title: 'Mèo Chuông Vàng', desc: 'Đeo lục lạc vàng kêu leng keng vui tai mỗi khi bé làm đúng!' },
      { level: 4, reqStars: 30, title: 'Mèo Pháp Sư', desc: 'Vung đũa phép sao lấp lánh chúc mừng bé học siêu!' },
      { level: 5, reqStars: 50, title: 'Đại Hiệp Mèo 👑', desc: 'Đạt danh hiệu thần đồng, bảo vệ bé suốt năm học!' }
    ],
    quotes: [
      "Meo meo! Giọng bé đọc hay như tiếng suối reo! 🐾",
      "Bé tính toán chuẩn xác làm tớ vui mê ly! 💖",
      "Thêm 1 câu nữa để tớ lớn nha! 🐱",
      "Bé thông minh số 1 luôn! 🌟"
    ]
  },
  penguin: {
    id: 'penguin',
    name: 'Cánh Cụt Pingu',
    icon: '🐧',
    eggIcon: '🥚❄️',
    themeColor: 'from-sky-400 to-blue-500',
    badge: 'Nhanh Nhẹn ❄️',
    stages: [
      { level: 1, reqStars: 0, title: 'Quả Trứng Băng Giá', desc: 'Cần hơi ấm siêng năng học bài của bé để ấp nở!' },
      { level: 2, reqStars: 5, title: 'Cánh Cụt Tí Hon', desc: 'Chập chững bước đi trên tuyết và vỗ cánh tí hon!' },
      { level: 3, reqStars: 15, title: 'Cánh Cụt Trượt Băng', desc: 'Lướt bụng trơn tru như cách bé đọc câu dài và làm tính nhanh!' },
      { level: 4, reqStars: 30, title: 'Siêu Nhân Cánh Cụt', desc: 'Đeo khăn len đỏ siêu ấm áp và trượt tuyết điêu luyện!' },
      { level: 5, reqStars: 50, title: 'Vua Băng Tuyết 👑', desc: 'Đạt danh hiệu đỉnh cao học giỏi không sợ bài khó!' }
    ],
    quotes: [
      "Pingu pingu! Bé đọc trơn như lướt băng vậy! 🐧",
      "Cố lên bé yêu ơi, sắp đạt cấp mới rồi! ❄️",
      "Tớ yêu giọng đọc trong trẻo và tài tính toán của bé! 💙",
      "Bé giỏi giang số một vương quốc băng tuyết! ⛄"
    ]
  },
  unicorn: {
    id: 'unicorn',
    name: 'Kỳ Lân Cầu Vồng',
    icon: '🦄',
    eggIcon: '🥚✨',
    themeColor: 'from-purple-400 via-pink-400 to-amber-300',
    badge: 'Phép Thuật ✨',
    stages: [
      { level: 1, reqStars: 0, title: 'Quả Trứng Pha Lê', desc: 'Phát ra ánh sáng 7 màu lấp lánh kỳ diệu!' },
      { level: 2, reqStars: 5, title: 'Kỳ Lân Nhí', desc: 'Chiếc sừng xoắn vàng bắt đầu phát ra bụi sao lấp lánh!' },
      { level: 3, reqStars: 15, title: 'Kỳ Lân Cánh Tiên', desc: 'Đôi cánh thiên thần vẫy nhẹ trên dải ngân hà rực rỡ!' },
      { level: 4, reqStars: 30, title: 'Kỳ Lân Vương Miện Hoa', desc: 'Đội vòng hoa pha lê, tung vó chở ước mơ của bé bay cao!' },
      { level: 5, reqStars: 50, title: 'Nữ Hoàng Phép Thuật 👑', desc: 'Vương miện hoàng gia vàng rực rỡ, thần hộ mệnh toàn năng!' }
    ],
    quotes: [
      "Ánh sao lấp lánh chúc mừng bé học bài xuất sắc! ✨",
      "Kỳ lân thả ngàn tim cho bé nè! 💖",
      "Bé có giọng đọc phép thuật và trí tuệ tuyệt vời! 🦄",
      "Bụi sao may mắn luôn bên bé yêu! 🌈"
    ]
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phượng Hoàng Lửa',
    icon: '🦅',
    eggIcon: '🥚⚡',
    themeColor: 'from-amber-500 via-red-500 to-yellow-400',
    badge: 'Bất Tử ⚡',
    stages: [
      { level: 1, reqStars: 0, title: 'Trứng Kim Cương Đỏ', desc: 'Tỏa ra vầng hào quang ấm áp chờ bé học chăm để ấp nở!' },
      { level: 2, reqStars: 5, title: 'Phượng Hoàng Nhí', desc: 'Lông vũ óng ánh vàng kim, cất tiếng hót líu lo mừng bé!' },
      { level: 3, reqStars: 15, title: 'Cánh Lửa Thần Kỳ', desc: 'Đôi cánh lửa vỗ nhịp tạo thành những luồng sáng rực rỡ!' },
      { level: 4, reqStars: 30, title: 'Sứ Giả Ánh Dương', desc: 'Mang theo vệt sao băng may mắn đến bên trang sách của bé!' },
      { level: 5, reqStars: 50, title: 'Thần Điểu Hoàng Kim 👑', desc: 'Vương trượng mặt trời rạng ngời, thần hộ mệnh thông thái!' }
    ],
    quotes: [
      "Tiếng hót của tớ bay vút cùng giọng đọc của bé! 🦅",
      "Bé học siêu xuất sắc, xứng danh thần đồng! 🌟",
      "Đôi cánh ánh dương chở niềm vui đến cho bé nè! ✨",
      "Cố lên bạn ơi, chúng ta cùng bay cao nhé! 🔥"
    ]
  },
  fox: {
    id: 'fox',
    name: 'Cáo Tuyết Hồ Ly',
    icon: '🦊',
    eggIcon: '🥚🌸',
    themeColor: 'from-orange-400 via-rose-300 to-indigo-400',
    badge: 'Thông Thái 🌸',
    stages: [
      { level: 1, reqStars: 0, title: 'Trứng Hoa Tuyết', desc: 'Lấp lánh những cánh hoa đào mùa xuân đang ngủ say!' },
      { level: 2, reqStars: 5, title: 'Cáo Con Đuôi Bông', desc: 'Chiếc đuôi bông xù xoe tròn và đôi tai nhọn vẫy chào bé!' },
      { level: 3, reqStars: 15, title: 'Cáo Thông Thái', desc: 'Đeo kính ngố tròn xoe, đọc sách vanh vách cùng bé!' },
      { level: 4, reqStars: 30, title: 'Hồ Ly Ánh Trăng', desc: 'Xòe 3 chiếc đuôi ngọc bích phát sáng lung linh huyền ảo!' },
      { level: 5, reqStars: 50, title: 'Cửu Vĩ Thiên Hồ 👑', desc: 'Chín đuôi thần thoại tỏa sáng, linh thú bảo hộ trí tuệ tuyệt đỉnh!' }
    ],
    quotes: [
      "Grao meo! Bé tính nhanh như chớp mắt vậy! 🦊",
      "Cáo tuyết ngoe nguẩy đuôi khen ngợi bé nè! 💖",
      "Bé đọc chuẩn từng từ một, quá đỗi thông minh! 🌸",
      "Hôm nay cùng tớ học thật nhiều điều thú vị nhé! 🐾"
    ]
  }
};

export const PET_ORDER: ('dragon' | 'cat' | 'penguin' | 'unicorn' | 'phoenix' | 'fox')[] = [
  'dragon',
  'cat',
  'penguin',
  'unicorn',
  'phoenix',
  'fox'
];

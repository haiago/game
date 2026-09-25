export interface BubbleWordItem {
  id: string;
  word: string; // Từ đích hoàn chỉnh, ví dụ: 'CÁ', 'MÈO'
  letters: string[]; // Các ký tự theo đúng thứ tự cần ghép (không kể khoảng trắng)
  distractors: string[]; // Chữ cái gây nhiễu thêm vào
  meaning: string; // Giải thích ngắn gọn hoặc nhãn nghĩa
  emoji: string; // Biểu tượng hình ảnh sinh động
  level: 1 | 2 | 3; // Cấp độ: 1 (2-3 chữ cái), 2 (4-5 chữ cái), 3 (6+ chữ cái)
}

export const BUBBLE_WORD_BANK: BubbleWordItem[] = [
  {
    "id": "bw-1",
    "word": "CÁ",
    "letters": [
      "c",
      "á"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Con cá bơi lội dưới nước",
    "emoji": "🐟",
    "level": 1
  },
  {
    "id": "bw-2",
    "word": "GÀ",
    "letters": [
      "g",
      "à"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Con gà trống gáy vang",
    "emoji": "🐔",
    "level": 1
  },
  {
    "id": "bw-3",
    "word": "BÒ",
    "letters": [
      "b",
      "ò"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Chú bò gặm cỏ trên đồi",
    "emoji": "🐂",
    "level": 1
  },
  {
    "id": "bw-4",
    "word": "HỔ",
    "letters": [
      "h",
      "ổ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chúa sơn lâm hổ dũng mãnh",
    "emoji": "🐯",
    "level": 1
  },
  {
    "id": "bw-5",
    "word": "DÊ",
    "letters": [
      "d",
      "ê"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Chú dê con kêu be be",
    "emoji": "🐐",
    "level": 1
  },
  {
    "id": "bw-6",
    "word": "MÈO",
    "letters": [
      "m",
      "è",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé mèo lười sưởi nắng",
    "emoji": "🐱",
    "level": 1
  },
  {
    "id": "bw-7",
    "word": "CHÓ",
    "letters": [
      "c",
      "h",
      "ó"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chú cún con giữ nhà",
    "emoji": "🐶",
    "level": 1
  },
  {
    "id": "bw-8",
    "word": "THỎ",
    "letters": [
      "t",
      "h",
      "ỏ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé thỏ trắng tai dài",
    "emoji": "🐰",
    "level": 1
  },
  {
    "id": "bw-9",
    "word": "CHIM",
    "letters": [
      "c",
      "h",
      "i",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chú chim hót líu lo",
    "emoji": "🐦",
    "level": 2
  },
  {
    "id": "bw-10",
    "word": "VỊT",
    "letters": [
      "v",
      "ị",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đàn vịt bơi dưới ao",
    "emoji": "🦆",
    "level": 1
  },
  {
    "id": "bw-11",
    "word": "NGỰA",
    "letters": [
      "n",
      "g",
      "ự",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Chú ngựa phi nhanh",
    "emoji": "🐴",
    "level": 2
  },
  {
    "id": "bw-12",
    "word": "HEO",
    "letters": [
      "h",
      "e",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chú heo con ủn ỉn",
    "emoji": "🐷",
    "level": 1
  },
  {
    "id": "bw-13",
    "word": "VOI",
    "letters": [
      "v",
      "o",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chú voi con có vòi dài",
    "emoji": "🐘",
    "level": 1
  },
  {
    "id": "bw-14",
    "word": "KHỈ",
    "letters": [
      "k",
      "h",
      "ỉ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé khỉ leo trèo thoăn thoắt",
    "emoji": "🐒",
    "level": 1
  },
  {
    "id": "bw-15",
    "word": "GẤU",
    "letters": [
      "g",
      "ấ",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chú gấu thích ăn mật ong",
    "emoji": "🐻",
    "level": 1
  },
  {
    "id": "bw-16",
    "word": "CỪU",
    "letters": [
      "c",
      "ừ",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chú cừu có bộ lông trắng",
    "emoji": "🐑",
    "level": 1
  },
  {
    "id": "bw-17",
    "word": "RÙA",
    "letters": [
      "r",
      "ù",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bác rùa bò chậm chạp",
    "emoji": "🐢",
    "level": 1
  },
  {
    "id": "bw-18",
    "word": "CUA",
    "letters": [
      "c",
      "u",
      "a"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Con cua có tám cẳng hai càng",
    "emoji": "🦀",
    "level": 1
  },
  {
    "id": "bw-19",
    "word": "ẾCH",
    "letters": [
      "ế",
      "c",
      "h"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chú ếch xanh ngồi trên lá sen",
    "emoji": "🐸",
    "level": 1
  },
  {
    "id": "bw-20",
    "word": "BƯỚM",
    "letters": [
      "b",
      "ư",
      "ớ",
      "m"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Cánh bướm bay lượn rập rờn",
    "emoji": "🦋",
    "level": 2
  },
  {
    "id": "bw-21",
    "word": "ONG",
    "letters": [
      "o",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chú ong chăm chỉ tìm mật",
    "emoji": "🐝",
    "level": 1
  },
  {
    "id": "bw-22",
    "word": "KIẾN",
    "letters": [
      "k",
      "i",
      "ế",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đàn kiến chăm chỉ tha mồi",
    "emoji": "🐜",
    "level": 2
  },
  {
    "id": "bw-23",
    "word": "CÚC",
    "letters": [
      "c",
      "ú",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bông hoa cúc vàng rực rỡ",
    "emoji": "🌼",
    "level": 1
  },
  {
    "id": "bw-24",
    "word": "SÓC",
    "letters": [
      "s",
      "ó",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé sóc chuyền cành nhặt hạt dẻ",
    "emoji": "🐿️",
    "level": 1
  },
  {
    "id": "bw-25",
    "word": "HƯƠU",
    "letters": [
      "h",
      "ư",
      "ơ",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chú hươu sao hiền lành",
    "emoji": "🦌",
    "level": 2
  },
  {
    "id": "bw-26",
    "word": "CHUỘT",
    "letters": [
      "c",
      "h",
      "u",
      "ộ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé chuột nhắt tinh nghịch",
    "emoji": "🐭",
    "level": 2
  },
  {
    "id": "bw-27",
    "word": "SƯ TỬ",
    "letters": [
      "s",
      "ư",
      "t",
      "ử"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Sư tử bờm vàng oai vệ",
    "emoji": "🦁",
    "level": 2
  },
  {
    "id": "bw-28",
    "word": "TÔM",
    "letters": [
      "t",
      "ô",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Con tôm búng càng tanh tách",
    "emoji": "🦐",
    "level": 1
  },
  {
    "id": "bw-29",
    "word": "ỐC",
    "letters": [
      "ố",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Con ốc bò chầm chậm",
    "emoji": "🐚",
    "level": 1
  },
  {
    "id": "bw-30",
    "word": "MỰC",
    "letters": [
      "m",
      "ự",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Con mực bơi dưới biển khơi",
    "emoji": "🦑",
    "level": 1
  },
  {
    "id": "bw-31",
    "word": "CÁ HEO",
    "letters": [
      "c",
      "á",
      "h",
      "e",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cá heo thông minh nhảy múa",
    "emoji": "🐬",
    "level": 2
  },
  {
    "id": "bw-32",
    "word": "CÁ MẬP",
    "letters": [
      "c",
      "á",
      "m",
      "ậ",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cá mập săn mồi đại dương",
    "emoji": "🦈",
    "level": 2
  },
  {
    "id": "bw-33",
    "word": "CÔNG",
    "letters": [
      "c",
      "ô",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chim công xòe đuôi rực rỡ",
    "emoji": "🦚",
    "level": 2
  },
  {
    "id": "bw-34",
    "word": "CÒ",
    "letters": [
      "c",
      "ò"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Con cò bay lả bay la",
    "emoji": "🦩",
    "level": 1
  },
  {
    "id": "bw-35",
    "word": "BỒ CÂU",
    "letters": [
      "b",
      "ồ",
      "c",
      "â",
      "u"
    ],
    "distractors": [
      "a",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Chim bồ câu đưa thư hiền hòa",
    "emoji": "🕊️",
    "level": 2
  },
  {
    "id": "bw-36",
    "word": "CÚ MÈO",
    "letters": [
      "c",
      "ú",
      "m",
      "è",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bác cú mèo thức đêm canh gác",
    "emoji": "🦉",
    "level": 2
  },
  {
    "id": "bw-37",
    "word": "HOA",
    "letters": [
      "h",
      "o",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bông hoa nở rộ ngát hương",
    "emoji": "🌸",
    "level": 1
  },
  {
    "id": "bw-38",
    "word": "CÂY",
    "letters": [
      "c",
      "â",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cây xanh tỏa bóng râm mát",
    "emoji": "🌳",
    "level": 1
  },
  {
    "id": "bw-39",
    "word": "LÁ",
    "letters": [
      "l",
      "á"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc lá xanh đón gió xuân",
    "emoji": "🍃",
    "level": 1
  },
  {
    "id": "bw-40",
    "word": "CAM",
    "letters": [
      "c",
      "a",
      "m"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Quả cam mọng nước ngọt thanh",
    "emoji": "🍊",
    "level": 1
  },
  {
    "id": "bw-41",
    "word": "TÁO",
    "letters": [
      "t",
      "á",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quả táo đỏ giòn ngọt",
    "emoji": "🍎",
    "level": 1
  },
  {
    "id": "bw-42",
    "word": "LÊ",
    "letters": [
      "l",
      "ê"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quả lê thơm mát dịu",
    "emoji": "🍐",
    "level": 1
  },
  {
    "id": "bw-43",
    "word": "CHUỐI",
    "letters": [
      "c",
      "h",
      "u",
      "ố",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Nải chuối tiêu chín vàng",
    "emoji": "🍌",
    "level": 2
  },
  {
    "id": "bw-44",
    "word": "DƯA",
    "letters": [
      "d",
      "ư",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "đ",
      "e"
    ],
    "meaning": "Dưa hấu mát ngọt ngày hè",
    "emoji": "🍉",
    "level": 1
  },
  {
    "id": "bw-45",
    "word": "NHO",
    "letters": [
      "n",
      "h",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chùm nho tím sai trĩu cành",
    "emoji": "🍇",
    "level": 1
  },
  {
    "id": "bw-46",
    "word": "DÂU",
    "letters": [
      "d",
      "â",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Quả dâu tây đỏ mọng",
    "emoji": "🍓",
    "level": 1
  },
  {
    "id": "bw-47",
    "word": "ĐÀO",
    "letters": [
      "đ",
      "à",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quả đào hồng xinh xắn",
    "emoji": "🍑",
    "level": 1
  },
  {
    "id": "bw-48",
    "word": "MẬN",
    "letters": [
      "m",
      "ậ",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quả mận chín đỏ ngọt lịm",
    "emoji": "🫐",
    "level": 1
  },
  {
    "id": "bw-49",
    "word": "XOÀI",
    "letters": [
      "x",
      "o",
      "à",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quả xoài cát chín thơm lừng",
    "emoji": "🥭",
    "level": 2
  },
  {
    "id": "bw-50",
    "word": "DỨA",
    "letters": [
      "d",
      "ứ",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "đ",
      "e"
    ],
    "meaning": "Quả dứa thơm ngát vị chua ngọt",
    "emoji": "🍍",
    "level": 1
  },
  {
    "id": "bw-51",
    "word": "DỪA",
    "letters": [
      "d",
      "ừ",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "đ",
      "e"
    ],
    "meaning": "Quả dừa xiêm mát lành",
    "emoji": "🥥",
    "level": 1
  },
  {
    "id": "bw-52",
    "word": "BƯỞI",
    "letters": [
      "b",
      "ư",
      "ở",
      "i"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Quả bưởi da xanh tép mọng",
    "emoji": "🍈",
    "level": 2
  },
  {
    "id": "bw-53",
    "word": "CHANH",
    "letters": [
      "c",
      "h",
      "a",
      "n",
      "h"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Quả chanh chua thanh mát",
    "emoji": "🍋",
    "level": 2
  },
  {
    "id": "bw-54",
    "word": "NGÔ",
    "letters": [
      "n",
      "g",
      "ô"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bắp ngô vàng ngọt bùi",
    "emoji": "🌽",
    "level": 1
  },
  {
    "id": "bw-55",
    "word": "CÀ RỐT",
    "letters": [
      "c",
      "à",
      "r",
      "ố",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Củ cà rốt cam giòn ngọt",
    "emoji": "🥕",
    "level": 2
  },
  {
    "id": "bw-56",
    "word": "KHOAI",
    "letters": [
      "k",
      "h",
      "o",
      "a",
      "i"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Củ khoai lang nướng thơm phức",
    "emoji": "🍠",
    "level": 2
  },
  {
    "id": "bw-57",
    "word": "CÀ CHUA",
    "letters": [
      "c",
      "à",
      "c",
      "h",
      "u",
      "a"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Quả cà chua đỏ mọng",
    "emoji": "🍅",
    "level": 3
  },
  {
    "id": "bw-58",
    "word": "ỚT",
    "letters": [
      "ớ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quả ớt cay nồng đậm đà",
    "emoji": "🌶️",
    "level": 1
  },
  {
    "id": "bw-59",
    "word": "NẤM",
    "letters": [
      "n",
      "ấ",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Cây nấm nhỏ xinh trong rừng",
    "emoji": "🍄",
    "level": 1
  },
  {
    "id": "bw-60",
    "word": "SEN",
    "letters": [
      "s",
      "e",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Hoa sen hồng thơm ngát hồ nước",
    "emoji": "🪷",
    "level": 1
  },
  {
    "id": "bw-61",
    "word": "HỒNG",
    "letters": [
      "h",
      "ồ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Hoa hồng đỏ thắm kiêu sa",
    "emoji": "🌹",
    "level": 2
  },
  {
    "id": "bw-62",
    "word": "HƯỚNG DƯƠNG",
    "letters": [
      "h",
      "ư",
      "ớ",
      "n",
      "g",
      "d",
      "ư",
      "ơ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Hoa hướng dương luôn hướng về mặt trời",
    "emoji": "🌻",
    "level": 3
  },
  {
    "id": "bw-63",
    "word": "LÚA",
    "letters": [
      "l",
      "ú",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bông lúa vàng óng ả trĩu hạt",
    "emoji": "🌾",
    "level": 1
  },
  {
    "id": "bw-64",
    "word": "TRE",
    "letters": [
      "t",
      "r",
      "e"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Lũy tre làng xanh rì rào",
    "emoji": "🎋",
    "level": 1
  },
  {
    "id": "bw-65",
    "word": "CỎ",
    "letters": [
      "c",
      "ỏ"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Ngọn cỏ non mọc sau mưa",
    "emoji": "🌱",
    "level": 1
  },
  {
    "id": "bw-66",
    "word": "BÚT",
    "letters": [
      "b",
      "ú",
      "t"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Chiếc bút chì tập viết nắn nót",
    "emoji": "✏️",
    "level": 1
  },
  {
    "id": "bw-67",
    "word": "SÁCH",
    "letters": [
      "s",
      "á",
      "c",
      "h"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Quyển sách truyện nhiều tranh đẹp",
    "emoji": "📚",
    "level": 2
  },
  {
    "id": "bw-68",
    "word": "VỞ",
    "letters": [
      "v",
      "ở"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quyển vở ô ly sạch đẹp",
    "emoji": "📒",
    "level": 1
  },
  {
    "id": "bw-69",
    "word": "CẶP",
    "letters": [
      "c",
      "ặ",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chiếc cặp sách màu xanh xinh",
    "emoji": "🎒",
    "level": 1
  },
  {
    "id": "bw-70",
    "word": "BÀN",
    "letters": [
      "b",
      "à",
      "n"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bàn học ngay ngắn thẳng hàng",
    "emoji": "🪑",
    "level": 1
  },
  {
    "id": "bw-71",
    "word": "GHẾ",
    "letters": [
      "g",
      "h",
      "ế"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc ghế ngồi học êm ái",
    "emoji": "🪑",
    "level": 1
  },
  {
    "id": "bw-72",
    "word": "THƯỚC",
    "letters": [
      "t",
      "h",
      "ư",
      "ớ",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cây thước kẻ thẳng tắp",
    "emoji": "📏",
    "level": 2
  },
  {
    "id": "bw-73",
    "word": "KÉO",
    "letters": [
      "k",
      "é",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Cây kéo thủ công cắt dán",
    "emoji": "✂️",
    "level": 1
  },
  {
    "id": "bw-74",
    "word": "BẢNG",
    "letters": [
      "b",
      "ả",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bảng con màu đen viết phấn",
    "emoji": "📋",
    "level": 2
  },
  {
    "id": "bw-75",
    "word": "PHẤN",
    "letters": [
      "p",
      "h",
      "ấ",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Viên phấn trắng viết chữ đều",
    "emoji": "🖍️",
    "level": 2
  },
  {
    "id": "bw-76",
    "word": "MỰC",
    "letters": [
      "m",
      "ự",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Lọ mực tím thơm mùi giấy mới",
    "emoji": "🖋️",
    "level": 1
  },
  {
    "id": "bw-77",
    "word": "GÔM",
    "letters": [
      "g",
      "ô",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Cục gôm tẩy sạch vết bút chì",
    "emoji": "🧽",
    "level": 1
  },
  {
    "id": "bw-78",
    "word": "TRANH",
    "letters": [
      "t",
      "r",
      "a",
      "n",
      "h"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bức tranh vẽ phong cảnh rực rỡ",
    "emoji": "🖼️",
    "level": 2
  },
  {
    "id": "bw-79",
    "word": "BÓNG",
    "letters": [
      "b",
      "ó",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Quả bóng đá tròn xoe",
    "emoji": "⚽",
    "level": 2
  },
  {
    "id": "bw-80",
    "word": "BÚP BÊ",
    "letters": [
      "b",
      "ú",
      "p",
      "b",
      "ê"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Búp bê xinh xắn cài nơ hồng",
    "emoji": "🪆",
    "level": 2
  },
  {
    "id": "bw-81",
    "word": "Ô TÔ",
    "letters": [
      "ô",
      "t",
      "ô"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Xe ô tô đồ chơi màu đỏ",
    "emoji": "🚗",
    "level": 1
  },
  {
    "id": "bw-82",
    "word": "TÀU HỎA",
    "letters": [
      "t",
      "à",
      "u",
      "h",
      "ỏ",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Đoàn tàu hỏa xình xịch chạy",
    "emoji": "🚂",
    "level": 3
  },
  {
    "id": "bw-83",
    "word": "MÁY BAY",
    "letters": [
      "m",
      "á",
      "y",
      "b",
      "a",
      "y"
    ],
    "distractors": [
      "c",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Chiếc máy bay giấy lượn bay",
    "emoji": "✈️",
    "level": 3
  },
  {
    "id": "bw-84",
    "word": "DIỀU",
    "letters": [
      "d",
      "i",
      "ề",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Cánh diều no gió bay cao",
    "emoji": "🪁",
    "level": 2
  },
  {
    "id": "bw-85",
    "word": "CHÓNG CHÓNG",
    "letters": [
      "c",
      "h",
      "ó",
      "n",
      "g",
      "c",
      "h",
      "ó",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chong chóng quay tít trong gió",
    "emoji": "🎐",
    "level": 3
  },
  {
    "id": "bw-86",
    "word": "TRỐNG",
    "letters": [
      "t",
      "r",
      "ố",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tiếng trống trường rộn rã tùng tùng",
    "emoji": "🥁",
    "level": 2
  },
  {
    "id": "bw-87",
    "word": "ĐÀN",
    "letters": [
      "đ",
      "à",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Cây đàn gảy khúc nhạc vui",
    "emoji": "🎸",
    "level": 1
  },
  {
    "id": "bw-88",
    "word": "CHUÔNG",
    "letters": [
      "c",
      "h",
      "u",
      "ô",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Tiếng chuông reo báo giờ ra chơi",
    "emoji": "🔔",
    "level": 3
  },
  {
    "id": "bw-89",
    "word": "LỒNG ĐÈN",
    "letters": [
      "l",
      "ồ",
      "n",
      "g",
      "đ",
      "è",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Lồng đèn ông sao đón Tết Trung Thu",
    "emoji": "🏮",
    "level": 3
  },
  {
    "id": "bw-90",
    "word": "NHÀ",
    "letters": [
      "n",
      "h",
      "à"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ngôi nhà ấm áp yêu thương",
    "emoji": "🏠",
    "level": 1
  },
  {
    "id": "bw-91",
    "word": "CỬA",
    "letters": [
      "c",
      "ử",
      "a"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Cánh cửa mở đón nắng mai",
    "emoji": "🚪",
    "level": 1
  },
  {
    "id": "bw-92",
    "word": "BẾP",
    "letters": [
      "b",
      "ế",
      "p"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Gian bếp mẹ nấu cơm chiều thơm lừng",
    "emoji": "🍳",
    "level": 1
  },
  {
    "id": "bw-93",
    "word": "NỒI",
    "letters": [
      "n",
      "ồ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Nồi canh nóng hổi mẹ nấu",
    "emoji": "🍲",
    "level": 1
  },
  {
    "id": "bw-94",
    "word": "BÁT",
    "letters": [
      "b",
      "á",
      "t"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Chiếc bát ăn cơm hoa văn đẹp",
    "emoji": "🥣",
    "level": 1
  },
  {
    "id": "bw-95",
    "word": "ĐŨA",
    "letters": [
      "đ",
      "ũ",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "e"
    ],
    "meaning": "Đôi đũa tre so bằng đầu",
    "emoji": "🥢",
    "level": 1
  },
  {
    "id": "bw-96",
    "word": "THÌA",
    "letters": [
      "t",
      "h",
      "ì",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Chiếc thìa nhỏ xúc cơm ngoan",
    "emoji": "🥄",
    "level": 2
  },
  {
    "id": "bw-97",
    "word": "CỐC",
    "letters": [
      "c",
      "ố",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chiếc cốc nước thủy tinh trong veo",
    "emoji": "🥛",
    "level": 1
  },
  {
    "id": "bw-98",
    "word": "ẤM",
    "letters": [
      "ấ",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ấm trà nóng ông uống mỗi sớm",
    "emoji": "🫖",
    "level": 1
  },
  {
    "id": "bw-99",
    "word": "QUẠT",
    "letters": [
      "q",
      "u",
      "ạ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc quạt mát lành trưa hè",
    "emoji": "🪭",
    "level": 2
  },
  {
    "id": "bw-100",
    "word": "ĐÈN",
    "letters": [
      "đ",
      "è",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đèn bàn sáng soi bài học",
    "emoji": "💡",
    "level": 1
  },
  {
    "id": "bw-101",
    "word": "GIƯỜNG",
    "letters": [
      "g",
      "i",
      "ư",
      "ờ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc giường êm ái ru bé ngủ",
    "emoji": "🛏️",
    "level": 3
  },
  {
    "id": "bw-102",
    "word": "GỐI",
    "letters": [
      "g",
      "ố",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc gối bông mềm mại",
    "emoji": "🧸",
    "level": 1
  },
  {
    "id": "bw-103",
    "word": "CHĂN",
    "letters": [
      "c",
      "h",
      "ă",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chiếc chăn ấm những ngày đông",
    "emoji": "🛋️",
    "level": 2
  },
  {
    "id": "bw-104",
    "word": "ÁO",
    "letters": [
      "á",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc áo trắng sạch thơm tho",
    "emoji": "👕",
    "level": 1
  },
  {
    "id": "bw-105",
    "word": "QUẦN",
    "letters": [
      "q",
      "u",
      "ầ",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc quần đùi mặc thoáng mát",
    "emoji": "👖",
    "level": 2
  },
  {
    "id": "bw-106",
    "word": "VÁY",
    "letters": [
      "v",
      "á",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc váy xòe hoa búp bê",
    "emoji": "👗",
    "level": 1
  },
  {
    "id": "bw-107",
    "word": "MŨ",
    "letters": [
      "m",
      "ũ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc mũ lưỡi trai che nắng",
    "emoji": "🧢",
    "level": 1
  },
  {
    "id": "bw-108",
    "word": "NƠ",
    "letters": [
      "n",
      "ơ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc nơ đỏ cài tóc gọn gàng",
    "emoji": "🎀",
    "level": 1
  },
  {
    "id": "bw-109",
    "word": "GIÀY",
    "letters": [
      "g",
      "i",
      "à",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đôi giày thể thao chạy êm chân",
    "emoji": "👟",
    "level": 2
  },
  {
    "id": "bw-110",
    "word": "DÉP",
    "letters": [
      "d",
      "é",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Đôi dép lê đi trong nhà",
    "emoji": "🩴",
    "level": 1
  },
  {
    "id": "bw-111",
    "word": "TẤT",
    "letters": [
      "t",
      "ấ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đôi tất ấm giữ ấm đôi chân",
    "emoji": "🧦",
    "level": 1
  },
  {
    "id": "bw-112",
    "word": "KHĂN",
    "letters": [
      "k",
      "h",
      "ă",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chiếc khăn quàng ấm áp",
    "emoji": "🧣",
    "level": 2
  },
  {
    "id": "bw-113",
    "word": "ĐỒNG HỒ",
    "letters": [
      "đ",
      "ồ",
      "n",
      "g",
      "h",
      "ồ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đồng hồ báo thức reng reng",
    "emoji": "⏰",
    "level": 3
  },
  {
    "id": "bw-114",
    "word": "GƯƠNG",
    "letters": [
      "g",
      "ư",
      "ơ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tấm gương soi mặt sáng bóng",
    "emoji": "🪞",
    "level": 2
  },
  {
    "id": "bw-115",
    "word": "LƯỢC",
    "letters": [
      "l",
      "ư",
      "ợ",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chiếc lược chải tóc mượt mà",
    "emoji": "🪮",
    "level": 2
  },
  {
    "id": "bw-116",
    "word": "BÀN CHẢI",
    "letters": [
      "b",
      "à",
      "n",
      "c",
      "h",
      "ả",
      "i"
    ],
    "distractors": [
      "a",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Bàn chải đánh răng sạch bóng",
    "emoji": "🪥",
    "level": 3
  },
  {
    "id": "bw-117",
    "word": "MẶT TRỜI",
    "letters": [
      "m",
      "ặ",
      "t",
      "t",
      "r",
      "ờ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Mặt trời tỏa ánh nắng chan hòa",
    "emoji": "🌞",
    "level": 3
  },
  {
    "id": "bw-118",
    "word": "MẶT TRĂNG",
    "letters": [
      "m",
      "ặ",
      "t",
      "t",
      "r",
      "ă",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Vầng trăng rằm tròn vành vạnh",
    "emoji": "🌕",
    "level": 3
  },
  {
    "id": "bw-119",
    "word": "NGÔI SAO",
    "letters": [
      "n",
      "g",
      "ô",
      "i",
      "s",
      "a",
      "o"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Ngôi sao lấp lánh trên trời đêm",
    "emoji": "⭐",
    "level": 3
  },
  {
    "id": "bw-120",
    "word": "MÂY",
    "letters": [
      "m",
      "â",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đám mây trắng bồng bềnh trôi",
    "emoji": "☁️",
    "level": 1
  },
  {
    "id": "bw-121",
    "word": "MƯA",
    "letters": [
      "m",
      "ư",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Cơn mưa rào tưới mát ruộng đồng",
    "emoji": "🌧️",
    "level": 1
  },
  {
    "id": "bw-122",
    "word": "GIÓ",
    "letters": [
      "g",
      "i",
      "ó"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Làn gió mát thổi bay lá vàng",
    "emoji": "💨",
    "level": 1
  },
  {
    "id": "bw-123",
    "word": "SẤM",
    "letters": [
      "s",
      "ấ",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tiếng sấm rền vang xa xa",
    "emoji": "⚡",
    "level": 1
  },
  {
    "id": "bw-124",
    "word": "CẦU VỒNG",
    "letters": [
      "c",
      "ầ",
      "u",
      "v",
      "ồ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cầu vồng bảy sắc lung linh sau mưa",
    "emoji": "🌈",
    "level": 3
  },
  {
    "id": "bw-125",
    "word": "NÚI",
    "letters": [
      "n",
      "ú",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ngọn núi cao sừng sững",
    "emoji": "⛰️",
    "level": 1
  },
  {
    "id": "bw-126",
    "word": "ĐỒI",
    "letters": [
      "đ",
      "ồ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đồi chè xanh mướt ngút ngàn",
    "emoji": "🏞️",
    "level": 1
  },
  {
    "id": "bw-127",
    "word": "SÔNG",
    "letters": [
      "s",
      "ô",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Dòng sông êm đềm trôi xuôi",
    "emoji": "🏞️",
    "level": 2
  },
  {
    "id": "bw-128",
    "word": "SUỐI",
    "letters": [
      "s",
      "u",
      "ố",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Dòng suối trong veo róc rách",
    "emoji": "🌊",
    "level": 2
  },
  {
    "id": "bw-129",
    "word": "BIỂN",
    "letters": [
      "b",
      "i",
      "ể",
      "n"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bờ biển sóng vỗ rì rào",
    "emoji": "🌊",
    "level": 2
  },
  {
    "id": "bw-130",
    "word": "HỒ",
    "letters": [
      "h",
      "ồ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Mặt hồ phẳng lặng như gương",
    "emoji": "💧",
    "level": 1
  },
  {
    "id": "bw-131",
    "word": "CÁT",
    "letters": [
      "c",
      "á",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bãi cát vàng mịn màng",
    "emoji": "🏖️",
    "level": 1
  },
  {
    "id": "bw-132",
    "word": "ĐÁ",
    "letters": [
      "đ",
      "á"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Hòn đá cuội tròn nhẵn",
    "emoji": "🪨",
    "level": 1
  },
  {
    "id": "bw-133",
    "word": "RỪNG",
    "letters": [
      "r",
      "ừ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Khu rừng bạt ngàn cây cối",
    "emoji": "🌲",
    "level": 2
  },
  {
    "id": "bw-134",
    "word": "HOÀNG HÔN",
    "letters": [
      "h",
      "o",
      "à",
      "n",
      "g",
      "h",
      "ô",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ánh hoàng hôn đỏ rực cuối chân trời",
    "emoji": "🌅",
    "level": 3
  },
  {
    "id": "bw-135",
    "word": "BÌNH MINH",
    "letters": [
      "b",
      "ì",
      "n",
      "h",
      "m",
      "i",
      "n",
      "h"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bình minh hé rạng sớm mai",
    "emoji": "🌄",
    "level": 3
  },
  {
    "id": "bw-136",
    "word": "BÉ",
    "letters": [
      "b",
      "é"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bé con ngoan ngoãn vâng lời",
    "emoji": "👶",
    "level": 1
  },
  {
    "id": "bw-137",
    "word": "BÀ",
    "letters": [
      "b",
      "à"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bà kể chuyện cổ tích đêm trăng",
    "emoji": "👵",
    "level": 1
  },
  {
    "id": "bw-138",
    "word": "ÔNG",
    "letters": [
      "ô",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ông đọc báo uống trà sớm",
    "emoji": "👴",
    "level": 1
  },
  {
    "id": "bw-139",
    "word": "MẸ",
    "letters": [
      "m",
      "ẹ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Mẹ yêu thương chăm sóc cả nhà",
    "emoji": "👩",
    "level": 1
  },
  {
    "id": "bw-140",
    "word": "BA",
    "letters": [
      "b",
      "a"
    ],
    "distractors": [
      "c",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Ba dắt tay bé đi dạo phố",
    "emoji": "👨",
    "level": 1
  },
  {
    "id": "bw-141",
    "word": "BỐ",
    "letters": [
      "b",
      "ố"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bố sửa xe đạp cho bé",
    "emoji": "👨",
    "level": 1
  },
  {
    "id": "bw-142",
    "word": "ANH",
    "letters": [
      "a",
      "n",
      "h"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Anh trai hướng dẫn em tập vẽ",
    "emoji": "👦",
    "level": 1
  },
  {
    "id": "bw-143",
    "word": "CHỊ",
    "letters": [
      "c",
      "h",
      "ị"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chị gái tết tóc xinh cho em",
    "emoji": "👧",
    "level": 1
  },
  {
    "id": "bw-144",
    "word": "EM",
    "letters": [
      "e",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Em bé cười tươi như hoa",
    "emoji": "👶",
    "level": 1
  },
  {
    "id": "bw-145",
    "word": "BẠN",
    "letters": [
      "b",
      "ạ",
      "n"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bạn bè cùng nhau học tập tiến bộ",
    "emoji": "🧑‍🤝‍🧑",
    "level": 1
  },
  {
    "id": "bw-146",
    "word": "CÔ",
    "letters": [
      "c",
      "ô"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cô giáo dịu hiền dạy từng nét chữ",
    "emoji": "👩‍🏫",
    "level": 1
  },
  {
    "id": "bw-147",
    "word": "THẦY",
    "letters": [
      "t",
      "h",
      "ầ",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Thầy giáo ân cần bảo ban",
    "emoji": "👨‍🏫",
    "level": 2
  },
  {
    "id": "bw-148",
    "word": "BÁC SĨ",
    "letters": [
      "b",
      "á",
      "c",
      "s",
      "ĩ"
    ],
    "distractors": [
      "a",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Bác sĩ chữa bệnh cho mọi người",
    "emoji": "🩺",
    "level": 2
  },
  {
    "id": "bw-149",
    "word": "CHÚ HỘI",
    "letters": [
      "c",
      "h",
      "ú",
      "h",
      "ộ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Chú công an giữ gìn bình yên",
    "emoji": "👮",
    "level": 3
  },
  {
    "id": "bw-150",
    "word": "CHÚ BỘ ĐỘI",
    "letters": [
      "c",
      "h",
      "ú",
      "b",
      "ộ",
      "đ",
      "ộ",
      "i"
    ],
    "distractors": [
      "a",
      "d",
      "e",
      "g"
    ],
    "meaning": "Chú bộ đội canh giữ biên cương",
    "emoji": "💂",
    "level": 3
  },
  {
    "id": "bw-151",
    "word": "XE",
    "letters": [
      "x",
      "e"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Xe chạy bon bon trên đường lớn",
    "emoji": "🚗",
    "level": 1
  },
  {
    "id": "bw-152",
    "word": "XE ĐẠP",
    "letters": [
      "x",
      "e",
      "đ",
      "ạ",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé đạp xe dạo mát công viên",
    "emoji": "🚲",
    "level": 2
  },
  {
    "id": "bw-153",
    "word": "XE MÁY",
    "letters": [
      "x",
      "e",
      "m",
      "á",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Xe máy chở mẹ đi làm",
    "emoji": "🛵",
    "level": 2
  },
  {
    "id": "bw-154",
    "word": "XE BUÝT",
    "letters": [
      "x",
      "e",
      "b",
      "u",
      "ý",
      "t"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Xe buýt đưa đón học sinh",
    "emoji": "🚌",
    "level": 3
  },
  {
    "id": "bw-155",
    "word": "THUYỀN",
    "letters": [
      "t",
      "h",
      "u",
      "y",
      "ề",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Thuyền buồm giương cánh ra khơi",
    "emoji": "⛵",
    "level": 3
  },
  {
    "id": "bw-156",
    "word": "TÀU",
    "letters": [
      "t",
      "à",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tàu thủy rẽ sóng đại dương",
    "emoji": "🚢",
    "level": 1
  },
  {
    "id": "bw-157",
    "word": "CA NÔ",
    "letters": [
      "c",
      "a",
      "n",
      "ô"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Ca nô lướt nhanh trên mặt nước",
    "emoji": "🚤",
    "level": 2
  },
  {
    "id": "bw-158",
    "word": "ĐỎ",
    "letters": [
      "đ",
      "ỏ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Màu đỏ tươi thắm của lá cờ",
    "emoji": "🔴",
    "level": 1
  },
  {
    "id": "bw-159",
    "word": "VÀNG",
    "letters": [
      "v",
      "à",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Màu vàng rực của hoa cúc",
    "emoji": "🟡",
    "level": 2
  },
  {
    "id": "bw-160",
    "word": "XANH",
    "letters": [
      "x",
      "a",
      "n",
      "h"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Màu xanh mướt của đồng cỏ",
    "emoji": "🟢",
    "level": 2
  },
  {
    "id": "bw-161",
    "word": "TRẮNG",
    "letters": [
      "t",
      "r",
      "ắ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Màu trắng tinh khôi của mây trời",
    "emoji": "⚪",
    "level": 2
  },
  {
    "id": "bw-162",
    "word": "TÍM",
    "letters": [
      "t",
      "í",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Màu tím biếc của bông hoa cà",
    "emoji": "🟣",
    "level": 1
  },
  {
    "id": "bw-163",
    "word": "HỒNG",
    "letters": [
      "h",
      "ồ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Màu hồng ngọt ngào của cánh đào",
    "emoji": "🌸",
    "level": 2
  },
  {
    "id": "bw-164",
    "word": "CAM",
    "letters": [
      "c",
      "a",
      "m"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Màu cam rực rỡ của cà rốt",
    "emoji": "🟠",
    "level": 1
  },
  {
    "id": "bw-165",
    "word": "NÂU",
    "letters": [
      "n",
      "â",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Màu nâu ấm áp của đất cày",
    "emoji": "🟤",
    "level": 1
  },
  {
    "id": "bw-166",
    "word": "ĐEN",
    "letters": [
      "đ",
      "e",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Màu đen nhánh của mái tóc",
    "emoji": "⚫",
    "level": 1
  },
  {
    "id": "bw-167",
    "word": "TRÒN",
    "letters": [
      "t",
      "r",
      "ò",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Hình tròn như quả bóng",
    "emoji": "⭕",
    "level": 2
  },
  {
    "id": "bw-168",
    "word": "VUÔNG",
    "letters": [
      "v",
      "u",
      "ô",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Hình vuông như chiếc bánh chưng",
    "emoji": "⏹️",
    "level": 2
  },
  {
    "id": "bw-169",
    "word": "CƠM",
    "letters": [
      "c",
      "ơ",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bát cơm trắng dẻo thơm",
    "emoji": "🍚",
    "level": 1
  },
  {
    "id": "bw-170",
    "word": "BÁNH",
    "letters": [
      "b",
      "á",
      "n",
      "h"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bánh mì giòn rụm thơm phức",
    "emoji": "🥖",
    "level": 2
  },
  {
    "id": "bw-171",
    "word": "KẸO",
    "letters": [
      "k",
      "ẹ",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Viên kẹo hoa quả ngọt thơm",
    "emoji": "🍬",
    "level": 1
  },
  {
    "id": "bw-172",
    "word": "SỮA",
    "letters": [
      "s",
      "ữ",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Ly sữa tươi ấm bụng mỗi sáng",
    "emoji": "🥛",
    "level": 1
  },
  {
    "id": "bw-173",
    "word": "TRỨNG",
    "letters": [
      "t",
      "r",
      "ứ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quả trứng gà tròn trịa",
    "emoji": "🥚",
    "level": 2
  },
  {
    "id": "bw-174",
    "word": "CANH",
    "letters": [
      "c",
      "a",
      "n",
      "h"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Bát canh rau ngót thanh mát",
    "emoji": "🍲",
    "level": 2
  },
  {
    "id": "bw-175",
    "word": "KEM",
    "letters": [
      "k",
      "e",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Que kem mát lạnh ngày hè",
    "emoji": "🍦",
    "level": 1
  },
  {
    "id": "bw-176",
    "word": "BÚN",
    "letters": [
      "b",
      "ú",
      "n"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bát bún sườn nóng hổi",
    "emoji": "🍜",
    "level": 1
  },
  {
    "id": "bw-177",
    "word": "PHỞ",
    "letters": [
      "p",
      "h",
      "ở"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tô phở thơm ngậy vị bò",
    "emoji": "🍜",
    "level": 1
  },
  {
    "id": "bw-178",
    "word": "CHÈ",
    "letters": [
      "c",
      "h",
      "è"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bát chè đỗ đen bùi ngọt",
    "emoji": "🥣",
    "level": 1
  },
  {
    "id": "bw-179",
    "word": "NƯỚC",
    "letters": [
      "n",
      "ư",
      "ớ",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cốc nước lọc tinh khiết",
    "emoji": "💧",
    "level": 2
  },
  {
    "id": "bw-180",
    "word": "TRÀ",
    "letters": [
      "t",
      "r",
      "à"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tách trà xanh thơm lừng",
    "emoji": "🍵",
    "level": 1
  },
  {
    "id": "bw-181",
    "word": "ĐỌC",
    "letters": [
      "đ",
      "ọ",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "e"
    ],
    "meaning": "Bé chăm chỉ đọc truyện tranh",
    "emoji": "📖",
    "level": 1
  },
  {
    "id": "bw-182",
    "word": "VIẾT",
    "letters": [
      "v",
      "i",
      "ế",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé nắn nót viết từng nét chữ",
    "emoji": "✍️",
    "level": 2
  },
  {
    "id": "bw-183",
    "word": "HỌC",
    "letters": [
      "h",
      "ọ",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé hăng hái học bài cùng bạn",
    "emoji": "🏫",
    "level": 1
  },
  {
    "id": "bw-184",
    "word": "CHẠY",
    "letters": [
      "c",
      "h",
      "ạ",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé chạy nhanh trên sân cỏ",
    "emoji": "🏃",
    "level": 2
  },
  {
    "id": "bw-185",
    "word": "NHẢY",
    "letters": [
      "n",
      "h",
      "ả",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé nhảy dây rèn luyện sức khỏe",
    "emoji": "🦘",
    "level": 2
  },
  {
    "id": "bw-186",
    "word": "HÁT",
    "letters": [
      "h",
      "á",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé cất tiếng hát vang bài ca",
    "emoji": "🎤",
    "level": 1
  },
  {
    "id": "bw-187",
    "word": "MÚA",
    "letters": [
      "m",
      "ú",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bé múa bài chào năm học mới",
    "emoji": "💃",
    "level": 1
  },
  {
    "id": "bw-188",
    "word": "CƯỜI",
    "letters": [
      "c",
      "ư",
      "ờ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Nụ cười rạng rỡ trên môi bé",
    "emoji": "😄",
    "level": 2
  },
  {
    "id": "bw-189",
    "word": "NGỦ",
    "letters": [
      "n",
      "g",
      "ủ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé ngủ ngon giấc say nồng",
    "emoji": "😴",
    "level": 1
  },
  {
    "id": "bw-190",
    "word": "VẼ",
    "letters": [
      "v",
      "ẽ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé vẽ bức tranh trường em",
    "emoji": "🎨",
    "level": 1
  },
  {
    "id": "bw-191",
    "word": "TẮM",
    "letters": [
      "t",
      "ắ",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tắm mát sau giờ vận động",
    "emoji": "🛁",
    "level": 1
  },
  {
    "id": "bw-192",
    "word": "ĐẾM",
    "letters": [
      "đ",
      "ế",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tập đếm từ một đến mười",
    "emoji": "🔢",
    "level": 1
  },
  {
    "id": "bw-193",
    "word": "QUÉT",
    "letters": [
      "q",
      "u",
      "é",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé giúp mẹ quét dọn nhà cửa",
    "emoji": "🧹",
    "level": 2
  },
  {
    "id": "bw-194",
    "word": "TƯỚI",
    "letters": [
      "t",
      "ư",
      "ớ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tưới nước cho cây xanh tươi",
    "emoji": "🪴",
    "level": 2
  },
  {
    "id": "bw-195",
    "word": "RỬA",
    "letters": [
      "r",
      "ử",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bé rửa tay sạch sẽ trước khi ăn",
    "emoji": "🧼",
    "level": 1
  },
  {
    "id": "bw-196",
    "word": "ĂN",
    "letters": [
      "ă",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé ăn cơm đầy đủ chất dinh dưỡng",
    "emoji": "🍴",
    "level": 1
  },
  {
    "id": "bw-197",
    "word": "UỐNG",
    "letters": [
      "u",
      "ố",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé uống nước đều đặn mỗi ngày",
    "emoji": "🥤",
    "level": 2
  },
  {
    "id": "bw-198",
    "word": "CHƠI",
    "letters": [
      "c",
      "h",
      "ơ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé chơi đồ chơi cùng anh chị",
    "emoji": "🧸",
    "level": 2
  },
  {
    "id": "bw-199",
    "word": "NGHE",
    "letters": [
      "n",
      "g",
      "h",
      "e"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé chăm chú nghe cô giảng bài",
    "emoji": "🎧",
    "level": 2
  },
  {
    "id": "bw-200",
    "word": "XEM",
    "letters": [
      "x",
      "e",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé xem tranh các loài vật",
    "emoji": "👀",
    "level": 1
  },
  {
    "id": "bw-201",
    "word": "BAY",
    "letters": [
      "b",
      "a",
      "y"
    ],
    "distractors": [
      "c",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Cánh chim bay lượn trên bầu trời xanh",
    "emoji": "🦅",
    "level": 1
  },
  {
    "id": "bw-202",
    "word": "BƠI",
    "letters": [
      "b",
      "ơ",
      "i"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bé tập bơi tung tăng dưới nước",
    "emoji": "🏊",
    "level": 1
  },
  {
    "id": "bw-203",
    "word": "LẶN",
    "letters": [
      "l",
      "ặ",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chú thợ lặn ngắm rạn san hô",
    "emoji": "🤿",
    "level": 1
  },
  {
    "id": "bw-204",
    "word": "LEO",
    "letters": [
      "l",
      "e",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé leo từng bậc cầu thang cẩn thận",
    "emoji": "🧗",
    "level": 1
  },
  {
    "id": "bw-205",
    "word": "BƯỚC",
    "letters": [
      "b",
      "ư",
      "ớ",
      "c"
    ],
    "distractors": [
      "a",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Bé từng bước đi đều nhịp nhàng",
    "emoji": "🚶",
    "level": 2
  },
  {
    "id": "bw-206",
    "word": "ĐÓN",
    "letters": [
      "đ",
      "ó",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Mẹ dang tay đón bé tan trường",
    "emoji": "🤗",
    "level": 1
  },
  {
    "id": "bw-207",
    "word": "CHÀO",
    "letters": [
      "c",
      "h",
      "à",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé khoanh tay chào thầy cô",
    "emoji": "🙋",
    "level": 2
  },
  {
    "id": "bw-208",
    "word": "YÊU",
    "letters": [
      "y",
      "ê",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé yêu thương gia đình ấm no",
    "emoji": "❤️",
    "level": 1
  },
  {
    "id": "bw-209",
    "word": "THƯƠNG",
    "letters": [
      "t",
      "h",
      "ư",
      "ơ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bà thương bé ngoan nhất nhà",
    "emoji": "🥰",
    "level": 3
  },
  {
    "id": "bw-210",
    "word": "GIÚP",
    "letters": [
      "g",
      "i",
      "ú",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé giúp bạn nhặt chiếc bút chì",
    "emoji": "🤝",
    "level": 2
  },
  {
    "id": "bw-211",
    "word": "KỂ",
    "letters": [
      "k",
      "ể"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Cô kể chuyện tấm gương hiếu học",
    "emoji": "🗣️",
    "level": 1
  },
  {
    "id": "bw-212",
    "word": "HỎI",
    "letters": [
      "h",
      "ỏ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé thắc mắc hỏi cô điều hay",
    "emoji": "❓",
    "level": 1
  },
  {
    "id": "bw-213",
    "word": "TRẢ LỜI",
    "letters": [
      "t",
      "r",
      "ả",
      "l",
      "ờ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tự tin giơ tay trả lời",
    "emoji": "💬",
    "level": 3
  },
  {
    "id": "bw-214",
    "word": "KHEN",
    "letters": [
      "k",
      "h",
      "e",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Cô khen bé học chăm viết đẹp",
    "emoji": "👏",
    "level": 2
  },
  {
    "id": "bw-215",
    "word": "TẶNG",
    "letters": [
      "t",
      "ặ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tặng mẹ bông hoa điểm mười",
    "emoji": "🎁",
    "level": 2
  },
  {
    "id": "bw-216",
    "word": "NHẬN",
    "letters": [
      "n",
      "h",
      "ậ",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé hai tay nhận quà từ ông bà",
    "emoji": "🤲",
    "level": 2
  },
  {
    "id": "bw-217",
    "word": "TÌM",
    "letters": [
      "t",
      "ì",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tìm sách trên giá ngăn nắp",
    "emoji": "🔍",
    "level": 1
  },
  {
    "id": "bw-218",
    "word": "CẤT",
    "letters": [
      "c",
      "ấ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé cất đồ chơi gọn gàng vào hộp",
    "emoji": "📦",
    "level": 1
  },
  {
    "id": "bw-219",
    "word": "GẤP",
    "letters": [
      "g",
      "ấ",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé gấp quần áo phụ giúp mẹ",
    "emoji": "🧺",
    "level": 1
  },
  {
    "id": "bw-220",
    "word": "CẮT",
    "letters": [
      "c",
      "ắ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé cắt giấy thủ công bông hoa",
    "emoji": "✂️",
    "level": 1
  },
  {
    "id": "bw-221",
    "word": "DÁN",
    "letters": [
      "d",
      "á",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Bé dán tranh lên bảng lớp",
    "emoji": "📄",
    "level": 1
  },
  {
    "id": "bw-222",
    "word": "XẾP",
    "letters": [
      "x",
      "ế",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé xếp hình khối lâu đài cát",
    "emoji": "🧱",
    "level": 1
  },
  {
    "id": "bw-223",
    "word": "ĐỠ",
    "letters": [
      "đ",
      "ỡ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé đỡ bạn khi bạn vấp ngã",
    "emoji": "🤲",
    "level": 1
  },
  {
    "id": "bw-224",
    "word": "DẮT",
    "letters": [
      "d",
      "ắ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Bé dắt em đi dạo mát công viên",
    "emoji": "🤝",
    "level": 1
  },
  {
    "id": "bw-225",
    "word": "BẾ",
    "letters": [
      "b",
      "ế"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Mẹ bế bé vỗ về giấc ngủ",
    "emoji": "🤱",
    "level": 1
  },
  {
    "id": "bw-226",
    "word": "RU",
    "letters": [
      "r",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Lời ru ngọt ngào của bà êm dịu",
    "emoji": "🎶",
    "level": 1
  },
  {
    "id": "bw-227",
    "word": "MỞ",
    "letters": [
      "m",
      "ở"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé mở trang sách thơm mùi mực",
    "emoji": "🔓",
    "level": 1
  },
  {
    "id": "bw-228",
    "word": "ĐÓNG",
    "letters": [
      "đ",
      "ó",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé đóng cửa nhẹ nhàng khi ra vào",
    "emoji": "🔒",
    "level": 2
  },
  {
    "id": "bw-229",
    "word": "BẬT",
    "letters": [
      "b",
      "ậ",
      "t"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bé bật đèn bàn khi ngồi học",
    "emoji": "💡",
    "level": 1
  },
  {
    "id": "bw-230",
    "word": "TẮT",
    "letters": [
      "t",
      "ắ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tắt điện quạt khi ra khỏi phòng",
    "emoji": "🔌",
    "level": 1
  },
  {
    "id": "bw-231",
    "word": "GIỮ",
    "letters": [
      "g",
      "i",
      "ữ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé giữ gìn sách vở luôn phẳng phiu",
    "emoji": "🛡️",
    "level": 1
  },
  {
    "id": "bw-232",
    "word": "CHĂM",
    "letters": [
      "c",
      "h",
      "ă",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé chăm sóc chậu hoa ban công",
    "emoji": "🪴",
    "level": 2
  },
  {
    "id": "bw-233",
    "word": "NUÔI",
    "letters": [
      "n",
      "u",
      "ô",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé cùng ba nuôi chú mèo cưng",
    "emoji": "🐱",
    "level": 2
  },
  {
    "id": "bw-234",
    "word": "TRỒNG",
    "letters": [
      "t",
      "r",
      "ồ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ba cùng bé trồng mầm cây mới",
    "emoji": "🌱",
    "level": 2
  },
  {
    "id": "bw-235",
    "word": "HÁI",
    "letters": [
      "h",
      "á",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé hái quả chín ngọt trên cành",
    "emoji": "🍎",
    "level": 1
  },
  {
    "id": "bw-236",
    "word": "GỌT",
    "letters": [
      "g",
      "ọ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Mẹ gọt táo cho cả nhà ăn tráng miệng",
    "emoji": "🔪",
    "level": 1
  },
  {
    "id": "bw-237",
    "word": "NẤU",
    "letters": [
      "n",
      "ấ",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Mẹ nấu bữa cơm chiều đầm ấm",
    "emoji": "🍲",
    "level": 1
  },
  {
    "id": "bw-238",
    "word": "NƯỚNG",
    "letters": [
      "n",
      "ư",
      "ớ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bố nướng bắp thơm phức bên bếp than",
    "emoji": "🍠",
    "level": 2
  },
  {
    "id": "bw-239",
    "word": "XÀO",
    "letters": [
      "x",
      "à",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Mẹ xào đĩa rau xanh mướt giòn ngọt",
    "emoji": "🥘",
    "level": 1
  },
  {
    "id": "bw-240",
    "word": "LUỘC",
    "letters": [
      "l",
      "u",
      "ộ",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Mẹ luộc trứng gà chín tới",
    "emoji": "🥚",
    "level": 2
  },
  {
    "id": "bw-241",
    "word": "RANG",
    "letters": [
      "r",
      "a",
      "n",
      "g"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bà rang mẻ lạc thơm lừng",
    "emoji": "🥜",
    "level": 2
  },
  {
    "id": "bw-242",
    "word": "KHO",
    "letters": [
      "k",
      "h",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Niêu cá kho thơm mùi riềng ớt",
    "emoji": "🐟",
    "level": 1
  },
  {
    "id": "bw-243",
    "word": "CHIÊN",
    "letters": [
      "c",
      "h",
      "i",
      "ê",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Đĩa khoai tây chiên vàng rụm giòn tan",
    "emoji": "🍟",
    "level": 2
  },
  {
    "id": "bw-244",
    "word": "PHA",
    "letters": [
      "p",
      "h",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bố pha cốc nước cam bổ dưỡng",
    "emoji": "🥛",
    "level": 1
  },
  {
    "id": "bw-245",
    "word": "RÓT",
    "letters": [
      "r",
      "ó",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé khéo léo rót nước mời ông bà",
    "emoji": "🫖",
    "level": 1
  },
  {
    "id": "bw-246",
    "word": "MỜI",
    "letters": [
      "m",
      "ờ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé kính cẩn mời ông xơi nước",
    "emoji": "🍵",
    "level": 1
  },
  {
    "id": "bw-247",
    "word": "CẢM ƠN",
    "letters": [
      "c",
      "ả",
      "m",
      "ơ",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé biết nói lời cảm ơn lễ phép",
    "emoji": "🙏",
    "level": 2
  },
  {
    "id": "bw-248",
    "word": "XIN LỖI",
    "letters": [
      "x",
      "i",
      "n",
      "l",
      "ỗ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé dũng cảm nhận lỗi và sửa sai",
    "emoji": "🙇",
    "level": 3
  },
  {
    "id": "bw-249",
    "word": "VÂNG LỜI",
    "letters": [
      "v",
      "â",
      "n",
      "g",
      "l",
      "ờ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé luôn ngoan ngoãn vâng lời cha mẹ",
    "emoji": "😇",
    "level": 3
  },
  {
    "id": "bw-250",
    "word": "CHĂM CHỈ",
    "letters": [
      "c",
      "h",
      "ă",
      "m",
      "c",
      "h",
      "ỉ"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé chăm chỉ như chú ong non",
    "emoji": "🐝",
    "level": 3
  },
  {
    "id": "bw-251",
    "word": "NGĂN NẮP",
    "letters": [
      "n",
      "g",
      "ă",
      "n",
      "n",
      "ắ",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Góc học tập của bé thật ngăn nắp",
    "emoji": "📐",
    "level": 3
  },
  {
    "id": "bw-252",
    "word": "GỌN GÀNG",
    "letters": [
      "g",
      "ọ",
      "n",
      "g",
      "à",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Phòng học luôn gọn gàng sạch sẽ",
    "emoji": "✨",
    "level": 3
  },
  {
    "id": "bw-253",
    "word": "SẠCH SẼ",
    "letters": [
      "s",
      "ạ",
      "c",
      "h",
      "s",
      "ẽ"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé giữ đôi bàn tay luôn sạch sẽ",
    "emoji": "🧼",
    "level": 3
  },
  {
    "id": "bw-254",
    "word": "LỄ PHÉP",
    "letters": [
      "l",
      "ễ",
      "p",
      "h",
      "é",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé đi thưa về gửi rất lễ phép",
    "emoji": "🙇‍♂️",
    "level": 3
  },
  {
    "id": "bw-255",
    "word": "KHIÊM TỐN",
    "letters": [
      "k",
      "h",
      "i",
      "ê",
      "m",
      "t",
      "ố",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé luôn khiêm tốn học hỏi bạn bè",
    "emoji": "🌱",
    "level": 3
  },
  {
    "id": "bw-256",
    "word": "THẬT THÀ",
    "letters": [
      "t",
      "h",
      "ậ",
      "t",
      "t",
      "h",
      "à"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé luôn trung thực và thật thà",
    "emoji": "💎",
    "level": 3
  },
  {
    "id": "bw-257",
    "word": "DŨNG CẢM",
    "letters": [
      "d",
      "ũ",
      "n",
      "g",
      "c",
      "ả",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "đ",
      "e"
    ],
    "meaning": "Bé dũng cảm vượt qua thử thách",
    "emoji": "🦁",
    "level": 3
  },
  {
    "id": "bw-258",
    "word": "TỰ TIN",
    "letters": [
      "t",
      "ự",
      "t",
      "i",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tự tin đứng trước lớp phát biểu",
    "emoji": "🌟",
    "level": 2
  },
  {
    "id": "bw-259",
    "word": "KIÊN TRÌ",
    "letters": [
      "k",
      "i",
      "ê",
      "n",
      "t",
      "r",
      "ì"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé kiên trì luyện từng nét chữ đẹp",
    "emoji": "🐢",
    "level": 3
  },
  {
    "id": "bw-260",
    "word": "SÁNG TẠO",
    "letters": [
      "s",
      "á",
      "n",
      "g",
      "t",
      "ạ",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé sáng tạo những bức tranh rực rỡ",
    "emoji": "💡",
    "level": 3
  },
  {
    "id": "bw-261",
    "word": "VUI VẺ",
    "letters": [
      "v",
      "u",
      "i",
      "v",
      "ẻ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé luôn vui vẻ hòa đồng với bạn bè",
    "emoji": "😊",
    "level": 2
  },
  {
    "id": "bw-262",
    "word": "HẠNH PHÚC",
    "letters": [
      "h",
      "ạ",
      "n",
      "h",
      "p",
      "h",
      "ú",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cả gia đình ấm êm hạnh phúc",
    "emoji": "💖",
    "level": 3
  },
  {
    "id": "bw-263",
    "word": "BÌNH YÊN",
    "letters": [
      "b",
      "ì",
      "n",
      "h",
      "y",
      "ê",
      "n"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Làng quê thanh bình và yên ả",
    "emoji": "🕊️",
    "level": 3
  },
  {
    "id": "bw-264",
    "word": "TƯƠI SÁNG",
    "letters": [
      "t",
      "ư",
      "ơ",
      "i",
      "s",
      "á",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tương lai tươi sáng đang chờ bé",
    "emoji": "🌈",
    "level": 3
  },
  {
    "id": "bw-265",
    "word": "RỘN RÃ",
    "letters": [
      "r",
      "ộ",
      "n",
      "r",
      "ã"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tiếng cười nói rộn rã sân trường",
    "emoji": "🥁",
    "level": 2
  },
  {
    "id": "bw-266",
    "word": "RỰC RỠ",
    "letters": [
      "r",
      "ự",
      "c",
      "r",
      "ỡ"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Pháo hoa rực rỡ đêm giao thừa",
    "emoji": "🎆",
    "level": 2
  },
  {
    "id": "bw-267",
    "word": "LẤP LÁNH",
    "letters": [
      "l",
      "ấ",
      "p",
      "l",
      "á",
      "n",
      "h"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Những vì sao lấp lánh trên bầu trời",
    "emoji": "✨",
    "level": 3
  },
  {
    "id": "bw-268",
    "word": "LUNG LINH",
    "letters": [
      "l",
      "u",
      "n",
      "g",
      "l",
      "i",
      "n",
      "h"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ánh nến lung linh trong đêm sinh nhật",
    "emoji": "🕯️",
    "level": 3
  },
  {
    "id": "bw-269",
    "word": "MÊNH MÔNG",
    "letters": [
      "m",
      "ê",
      "n",
      "h",
      "m",
      "ô",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Biển cả mênh mông sóng vỗ trùng khơi",
    "emoji": "🌊",
    "level": 3
  },
  {
    "id": "bw-270",
    "word": "BÁT NGÁT",
    "letters": [
      "b",
      "á",
      "t",
      "n",
      "g",
      "á",
      "t"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Cánh đồng lúa chín vàng bát ngát",
    "emoji": "🌾",
    "level": 3
  },
  {
    "id": "bw-271",
    "word": "BAO LA",
    "letters": [
      "b",
      "a",
      "o",
      "l",
      "a"
    ],
    "distractors": [
      "c",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Bầu trời đêm bao la rộng lớn",
    "emoji": "🌌",
    "level": 2
  },
  {
    "id": "bw-272",
    "word": "CAO VÚT",
    "letters": [
      "c",
      "a",
      "o",
      "v",
      "ú",
      "t"
    ],
    "distractors": [
      "b",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Tòa tháp cao vút chạm mây xanh",
    "emoji": "🗼",
    "level": 3
  },
  {
    "id": "bw-273",
    "word": "XANH MƯỚT",
    "letters": [
      "x",
      "a",
      "n",
      "h",
      "m",
      "ư",
      "ớ",
      "t"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Khu vườn xanh mướt mầm non mới nhú",
    "emoji": "🌿",
    "level": 3
  },
  {
    "id": "bw-274",
    "word": "ĐỎ THẮM",
    "letters": [
      "đ",
      "ỏ",
      "t",
      "h",
      "ắ",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bông hoa hồng nhung đỏ thắm kiêu hãnh",
    "emoji": "🌹",
    "level": 3
  },
  {
    "id": "bw-275",
    "word": "VÀNG ÓNG",
    "letters": [
      "v",
      "à",
      "n",
      "g",
      "ó",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Sân phơi đầy ắp thóc vàng óng ả",
    "emoji": "🌾",
    "level": 3
  },
  {
    "id": "bw-276",
    "word": "TRẮNG MUỐT",
    "letters": [
      "t",
      "r",
      "ắ",
      "n",
      "g",
      "m",
      "u",
      "ố",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đôi thiên nga trắng muốt bơi trên hồ",
    "emoji": "🦢",
    "level": 3
  },
  {
    "id": "bw-277",
    "word": "ĐEN LÁY",
    "letters": [
      "đ",
      "e",
      "n",
      "l",
      "á",
      "y"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đôi mắt bé đen láy tròn xoe",
    "emoji": "👀",
    "level": 3
  },
  {
    "id": "bw-278",
    "word": "TRÒN XOE",
    "letters": [
      "t",
      "r",
      "ò",
      "n",
      "x",
      "o",
      "e"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quả bóng tròn xoe lăn trên sân cỏ",
    "emoji": "⚽",
    "level": 3
  },
  {
    "id": "bw-279",
    "word": "DÀI NGOẰNG",
    "letters": [
      "d",
      "à",
      "i",
      "n",
      "g",
      "o",
      "ằ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Chú hươu cao cổ có chiếc cổ dài ngoẵng",
    "emoji": "🦒",
    "level": 3
  },
  {
    "id": "bw-280",
    "word": "NHỎ XINH",
    "letters": [
      "n",
      "h",
      "ỏ",
      "x",
      "i",
      "n",
      "h"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chú gà con lông vàng nhỏ xinh lon ton",
    "emoji": "🐥",
    "level": 3
  },
  {
    "id": "bw-281",
    "word": "TO LỚN",
    "letters": [
      "t",
      "o",
      "l",
      "ớ",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bác voi to lớn dắt đàn con dạo bước",
    "emoji": "🐘",
    "level": 2
  },
  {
    "id": "bw-282",
    "word": "MẬP MẠP",
    "letters": [
      "m",
      "ậ",
      "p",
      "m",
      "ạ",
      "p"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Chú gấu trúc mập mạp nhai cành trúc",
    "emoji": "🐼",
    "level": 3
  },
  {
    "id": "bw-283",
    "word": "NHANH NHẸN",
    "letters": [
      "n",
      "h",
      "a",
      "n",
      "h",
      "n",
      "h",
      "ẹ",
      "n"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Chú thỏ trắng nhanh nhẹn luồn qua bụi cỏ",
    "emoji": "🐇",
    "level": 3
  },
  {
    "id": "bw-284",
    "word": "CHẬM RÃI",
    "letters": [
      "c",
      "h",
      "ậ",
      "m",
      "r",
      "ã",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bác rùa già chậm rãi từng bước vững vàng",
    "emoji": "🐢",
    "level": 3
  },
  {
    "id": "bw-285",
    "word": "CHĂM HỌC",
    "letters": [
      "c",
      "h",
      "ă",
      "m",
      "h",
      "ọ",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé chăm học ngày ngày tiến bộ hơn",
    "emoji": "📚",
    "level": 3
  },
  {
    "id": "bw-286",
    "word": "ĐIỂM MƯỜI",
    "letters": [
      "đ",
      "i",
      "ể",
      "m",
      "m",
      "ư",
      "ờ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé đạt điểm mười đỏ chói trong bài kiểm tra",
    "emoji": "🔟",
    "level": 3
  },
  {
    "id": "bw-287",
    "word": "TRƯỜNG EM",
    "letters": [
      "t",
      "r",
      "ư",
      "ờ",
      "n",
      "g",
      "e",
      "m"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ngôi trường em khang trang tươi đẹp",
    "emoji": "🏫",
    "level": 3
  },
  {
    "id": "bw-288",
    "word": "LỚP MỘT",
    "letters": [
      "l",
      "ớ",
      "p",
      "m",
      "ộ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé tự hào là học sinh lớp một ngoan",
    "emoji": "🎒",
    "level": 3
  },
  {
    "id": "bw-289",
    "word": "BẠN THÂN",
    "letters": [
      "b",
      "ạ",
      "n",
      "t",
      "h",
      "â",
      "n"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Đôi bạn thân cùng nhau học cùng nhau chơi",
    "emoji": "👫",
    "level": 3
  },
  {
    "id": "bw-290",
    "word": "TỔ QUỐC",
    "letters": [
      "t",
      "ổ",
      "q",
      "u",
      "ố",
      "c"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Tổ quốc Việt Nam tươi đẹp gấm hoa",
    "emoji": "🇻🇳",
    "level": 3
  },
  {
    "id": "bw-291",
    "word": "QUÊ HƯƠNG",
    "letters": [
      "q",
      "u",
      "ê",
      "h",
      "ư",
      "ơ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Quê hương là chùm khế ngọt",
    "emoji": "🏡",
    "level": 3
  },
  {
    "id": "bw-292",
    "word": "HÒA BÌNH",
    "letters": [
      "h",
      "ò",
      "a",
      "b",
      "ì",
      "n",
      "h"
    ],
    "distractors": [
      "c",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Cánh chim bồ câu biểu tượng cho hòa bình",
    "emoji": "🕊️",
    "level": 3
  },
  {
    "id": "bw-293",
    "word": "MÙA XUÂN",
    "letters": [
      "m",
      "ù",
      "a",
      "x",
      "u",
      "â",
      "n"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Mùa xuân hoa đào nở rộ khắp nơi",
    "emoji": "🌸",
    "level": 3
  },
  {
    "id": "bw-294",
    "word": "MÙA HÈ",
    "letters": [
      "m",
      "ù",
      "a",
      "h",
      "è"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Mùa hè rộn rã tiếng ve kêu ngân nga",
    "emoji": "☀️",
    "level": 2
  },
  {
    "id": "bw-295",
    "word": "MÙA THU",
    "letters": [
      "m",
      "ù",
      "a",
      "t",
      "h",
      "u"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Mùa thu lá vàng rơi nhè nhẹ",
    "emoji": "🍂",
    "level": 3
  },
  {
    "id": "bw-296",
    "word": "MÙA ĐÔNG",
    "letters": [
      "m",
      "ù",
      "a",
      "đ",
      "ô",
      "n",
      "g"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "e"
    ],
    "meaning": "Mùa đông se lạnh gió bấc tràn về",
    "emoji": "❄️",
    "level": 3
  },
  {
    "id": "bw-297",
    "word": "TẾT ĐẾN",
    "letters": [
      "t",
      "ế",
      "t",
      "đ",
      "ế",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tết đến xuân về bé chúc thọ ông bà",
    "emoji": "🧧",
    "level": 3
  },
  {
    "id": "bw-298",
    "word": "TRUNG THU",
    "letters": [
      "t",
      "r",
      "u",
      "n",
      "g",
      "t",
      "h",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Tết Trung Thu rước đèn phá cỗ tưng bừng",
    "emoji": "🥮",
    "level": 3
  },
  {
    "id": "bw-299",
    "word": "GIÁNG SINH",
    "letters": [
      "g",
      "i",
      "á",
      "n",
      "g",
      "s",
      "i",
      "n",
      "h"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đêm Giáng Sinh cây thông lấp lánh ánh đèn",
    "emoji": "🎄",
    "level": 3
  },
  {
    "id": "bw-300",
    "word": "SINH NHẬT",
    "letters": [
      "s",
      "i",
      "n",
      "h",
      "n",
      "h",
      "ậ",
      "t"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé thổi nến đón tuổi mới tràn ngập niềm vui",
    "emoji": "🎂",
    "level": 3
  },
  {
    "id": "bw-301",
    "word": "NGÀY HỘI",
    "letters": [
      "n",
      "g",
      "à",
      "y",
      "h",
      "ộ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ngày hội thiếu nhi rực rỡ sắc màu",
    "emoji": "🎪",
    "level": 3
  },
  {
    "id": "bw-302",
    "word": "CÔNG VIÊN",
    "letters": [
      "c",
      "ô",
      "n",
      "g",
      "v",
      "i",
      "ê",
      "n"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Bé đi công viên chơi đu quay ngắm cảnh",
    "emoji": "🎡",
    "level": 3
  },
  {
    "id": "bw-303",
    "word": "VƯỜN THÚ",
    "letters": [
      "v",
      "ư",
      "ờ",
      "n",
      "t",
      "h",
      "ú"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bé vào vườn thú ngắm nhìn muôn loài",
    "emoji": "🦁",
    "level": 3
  },
  {
    "id": "bw-304",
    "word": "HỒ BƠI",
    "letters": [
      "h",
      "ồ",
      "b",
      "ơ",
      "i"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Mùa hè bé tung tăng bơi lội mát rượi",
    "emoji": "🏊‍♂️",
    "level": 2
  },
  {
    "id": "bw-305",
    "word": "BỜ HỒ",
    "letters": [
      "b",
      "ờ",
      "h",
      "ồ"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Chiều chiều bé cùng ba dạo mát quanh bờ hồ",
    "emoji": "🏞️",
    "level": 2
  },
  {
    "id": "bw-306",
    "word": "GÓC PHỐ",
    "letters": [
      "g",
      "ó",
      "c",
      "p",
      "h",
      "ố"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Góc phố thân quen rợp bóng cây xanh mát",
    "emoji": "🏙️",
    "level": 3
  },
  {
    "id": "bw-307",
    "word": "CON ĐƯỜNG",
    "letters": [
      "c",
      "o",
      "n",
      "đ",
      "ư",
      "ờ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "e"
    ],
    "meaning": "Con đường làng sạch sẽ dẫn lối về nhà",
    "emoji": "🛣️",
    "level": 3
  },
  {
    "id": "bw-308",
    "word": "CÁNH ĐỒNG",
    "letters": [
      "c",
      "á",
      "n",
      "h",
      "đ",
      "ồ",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "e"
    ],
    "meaning": "Cánh đồng lúa chín thoang thoảng hương thơm",
    "emoji": "🌾",
    "level": 3
  },
  {
    "id": "bw-309",
    "word": "DÒNG KINH",
    "letters": [
      "d",
      "ò",
      "n",
      "g",
      "k",
      "i",
      "n",
      "h"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Dòng kênh xanh uốn lượn quanh xóm ấp",
    "emoji": "🛶",
    "level": 3
  },
  {
    "id": "bw-310",
    "word": "BẾN PHÀ",
    "letters": [
      "b",
      "ế",
      "n",
      "p",
      "h",
      "à"
    ],
    "distractors": [
      "a",
      "c",
      "d",
      "đ"
    ],
    "meaning": "Bến phà tấp nập người qua lại sớm trưa",
    "emoji": "⛴️",
    "level": 3
  },
  {
    "id": "bw-311",
    "word": "NHỊP CẦU",
    "letters": [
      "n",
      "h",
      "ị",
      "p",
      "c",
      "ầ",
      "u"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Cây cầu dây văng nối liền hai bờ vui",
    "emoji": "🌉",
    "level": 3
  },
  {
    "id": "bw-312",
    "word": "NGỌN HẢI ĐĂNG",
    "letters": [
      "n",
      "g",
      "ọ",
      "n",
      "h",
      "ả",
      "i",
      "đ",
      "ă",
      "n",
      "g"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Ngọn hải đăng sáng rực dẫn lối tàu thuyền",
    "emoji": "🗼",
    "level": 3
  },
  {
    "id": "bw-313",
    "word": "ĐẢO XA",
    "letters": [
      "đ",
      "ả",
      "o",
      "x",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "d",
      "e"
    ],
    "meaning": "Hòn đảo nhỏ xanh biếc giữa trùng khơi",
    "emoji": "🏝️",
    "level": 2
  },
  {
    "id": "bw-314",
    "word": "RẶNG DỪA",
    "letters": [
      "r",
      "ặ",
      "n",
      "g",
      "d",
      "ừ",
      "a"
    ],
    "distractors": [
      "b",
      "c",
      "đ",
      "e"
    ],
    "meaning": "Rặng dừa nghiêng bóng soi bóng dòng mương",
    "emoji": "🌴",
    "level": 3
  },
  {
    "id": "bw-315",
    "word": "HỒNG HÀO",
    "letters": [
      "h",
      "ồ",
      "n",
      "g",
      "h",
      "à",
      "o"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Đôi má bé hồng hào đáng yêu",
    "emoji": "🍎",
    "level": 3
  },
  {
    "id": "bw-316",
    "word": "SÁNG DẠ",
    "letters": [
      "s",
      "á",
      "n",
      "g",
      "d",
      "ạ"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "đ"
    ],
    "meaning": "Bé học trò thông minh và sáng dạ",
    "emoji": "🧠",
    "level": 3
  },
  {
    "id": "bw-317",
    "word": "THÔNG THÁI",
    "letters": [
      "t",
      "h",
      "ô",
      "n",
      "g",
      "t",
      "h",
      "á",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "c",
      "d"
    ],
    "meaning": "Bác cú mèo thông thái uyên bác",
    "emoji": "🦉",
    "level": 3
  },
  {
    "id": "bw-318",
    "word": "BÉ NGOAN",
    "letters": [
      "b",
      "é",
      "n",
      "g",
      "o",
      "a",
      "n"
    ],
    "distractors": [
      "c",
      "d",
      "đ",
      "e"
    ],
    "meaning": "Phiếu bé ngoan cuối tuần cô khen thưởng",
    "emoji": "👶",
    "level": 3
  },
  {
    "id": "bw-319",
    "word": "NỤ CƯỜI",
    "letters": [
      "n",
      "ụ",
      "c",
      "ư",
      "ờ",
      "i"
    ],
    "distractors": [
      "a",
      "b",
      "d",
      "đ"
    ],
    "meaning": "Nụ cười thiên thần làm rạng rỡ cả ngôi nhà",
    "emoji": "😀",
    "level": 3
  }
];

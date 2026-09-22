# 🌟 Bé Vui Học Đọc Trơn Lớp 1 - Nuôi Thú Cưng Hoạt Hình

Ứng dụng web tương tác dạng thẻ Flashcard kết hợp cơ chế nuôi thú cưng hoạt hình (**Gamification**) nhằm tạo động lực và sự hào hứng cho học sinh tiền tiểu học & lớp 1 rèn luyện kỹ năng **đọc trơn, phát âm đúng dấu thanh và ngắt nhịp tiếng Việt lưu loát**.

---

## 📌 Điểm Nổi Bật

- **Hoàn toàn độc lập (Zero Dependency / Standalone):** Toàn bộ ứng dụng được đóng gói trọn vẹn trong một file [`flashcard.html`](flashcard.html). Không cần cài đặt Node.js hay backend server phức tạp; có thể chạy trực tiếp bằng bất kỳ trình duyệt hiện đại nào (Chrome, Safari, Edge, Firefox).
- **Gamification nuôi & tiến hóa thú cưng:** Bé đọc bài tích lũy ngôi sao để ấp nở và tiến hóa 4 loài thú cưng hoạt hình qua 5 cấp độ khác nhau.
- **Đồ họa tự sinh bằng HTML5 Canvas 2D:** Thú cưng được vẽ chuyển động dạng vector với biểu cảm chớp mắt, nhảy múa, vẫy cánh, không sử dụng tệp ảnh ngoài.
- **Âm thanh tổng hợp (Synthesized Audio):** Sử dụng Web Audio API để phát nhạc hiệu, tiếng đàn hạc và âm thanh chúc mừng tưng bừng mà không cần tải file MP3/WAV.
- **Tương tác đa nền tảng:** Tối ưu hóa giao diện cho cả máy tính để bàn (hỗ trợ phím tắt) lẫn điện thoại/máy tính bảng (hỗ trợ cử chỉ vuốt chạm màn hình).

---

## 🏗️ Kiến Trúc Kỹ Thuật

| Thành phần | Công nghệ / Kỹ thuật | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Giao diện & Bố cục** | HTML5, Tailwind CSS (CDN), Google Fonts (`Be Vietnam Pro`, `Quicksand`, `Nunito`) | Giao diện màu sắc pastel sống động. Bộ font chữ chuẩn giáo dục & thân thiện cho bé lớp 1: **`Be Vietnam Pro`** (chuẩn sách giáo khoa, dấu thanh rõ ràng không lem), kết hợp **`Quicksand`** (bo tròn mềm mại) và **`Nunito`** cùng nút chuyển font 1-chạm (`🔤 Font`) ghi nhớ tự động. |
| **Đồ họa Thú cưng** | HTML5 Canvas 2D API (`PetAnimationEngine`) | Vòng lặp hoạt ảnh `requestAnimationFrame` 60 FPS, vẽ thủ công hình học kết hợp hàm sóng lượng giác (`Math.sin`) tạo độ phập phồng (squash & stretch), nhịp thở, vẫy đuôi. |
| **Hiệu ứng chuyển động** | Web Animations API (WAAPI) & Canvas Confetti (CDN) | Hiệu ứng hạt nổ 3D (`triggerStarBurstEffect`), huy hiệu sao bay theo quỹ đạo parabol mượt mà vào hộp điểm, pháo giấy bung nở toàn màn hình khi hoàn thành bài. |
| **Âm thanh tương tác** | Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`) | Sinh các hợp âm chiptune, tiếng đàn hạc êm dịu, âm thanh kèn lệnh fanfare khi thú cưng tiến hóa. |
| **Logic & Điều khiển** | Vanilla JavaScript | Quản lý lượt học, trộn thẻ ngẫu nhiên Fisher–Yates, xử lý sự kiện cảm ứng (Touch swipe) và bàn phím (Keyboard listeners). |

---

## 📚 Ngân Hàng Câu Hỏi & Cấp Độ Học Tập (500 Thẻ - 100 Thẻ/Cấp)

Ngân hàng dữ liệu (`QUESTION_BANK`) gồm **500 câu/từ độc bản phong phú** được chuẩn hóa theo chương trình Tiếng Việt lớp 1, phân bổ đều qua 5 cấp độ (mỗi cấp đúng **100 câu**, tăng tối đa độ ngẫu nhiên khi luyện tập):

1. **Level 1 - Khởi Động Vui Vẻ (100 câu):**
   - *Đặc điểm:* Cụm 2–3 tiếng ngắn gọn, tập trung vào thanh điệu (hỏi, ngã, nặng) và vần cơ bản (*"Em cười tươi"*, *"Bé đánh răng"*, *"Bình hoa đẹp"*, *"Bé rửa mặt"*, *"Cá chép đỏ"*...).
2. **Level 2 - Tập Đọc Câu Đơn (100 câu):**
   - *Đặc điểm:* Câu đơn ngắn 4–6 tiếng về sinh hoạt gia đình, bạn bè và thiên nhiên (*"Bé giúp mẹ nhặt rau"*, *"Bầu trời xanh ngắt"*, *"Bé đánh răng thật sạch"*, *"Mẹ nấu xôi gấc đỏ"*...).
3. **Level 3 - Luyện Vần Khó & Tròn Môi (100 câu):**
   - *Đặc điểm:* Câu 6–8 tiếng chứa các vần tròn môi, vần ghép phức tạp và từ láy tượng thanh/tượng hình (`oan, oang, uat, uyt, uyên, oay, oai, uê`...: *"Suối chảy róc rách"*, *"Bé khoanh tay lễ phép"*, *"Hoa vạn thọ xum xuê"*...).
4. **Level 4 - Câu Phức & Trị Đọc Sai (100 câu):**
   - *Đặc điểm:* Câu dài rèn luyện phân biệt phụ âm đầu dễ lẫn (`l/n`, `s/x`, `tr/ch`, `r/d/gi`), dấu hỏi/ngã và ngắt nghỉ hơi theo dấu phẩy (*"Bé phân biệt rõ âm lờ và âm nờ khi đọc"*, *"Cây tre xanh rì rào trong làn gió thoảng"*...).
5. **Level 5 - Bậc Thầy Đoạn Văn & Diễn Cảm (100 câu):**
   - *Đặc điểm:* Các câu văn phức, khổ thơ và đoạn văn mini 12–20 tiếng giàu hình ảnh, cảm xúc và bài học đạo đức, giúp bé đọc liền mạch, phát triển tư duy đọc hiểu và phong thái tự tin.

---

## 🐾 Hệ Sinh Thái Thú Cưng (Pet System & Vector Chibi Art)

Bộ máy đồ họa hoạt hình thủ công (`PetAnimationEngine`) trên Canvas 2D 60 FPS đã được thiết kế lại toàn diện theo phong cách **Chibi Anime siêu cưng, màu sắc rực rỡ, mắt long lanh nhiều tầng ánh sáng và chuyển động sinh động**:

- 🦖 **Rồng Con Lửa (`dragon`):**
  - *Cấp 1 - Quả Trứng Lửa Thần Kỳ:* Vỏ đỏ ruby vân vảy rồng vàng óng ánh, tỏa hào quang ấm áp; khi chạm vào hoặc có sao sẽ hé mắt to tròn ngắm nhìn bé.
  - *Cấp 2 - Rồng Con Nứt Vỏ:* Đội mũ vỏ trứng nứt siêu đáng yêu, đôi sừng vàng tí hon, vẫy cánh phấp phới và đuôi ve vẩy ngọn lửa nhỏ.
  - *Cấp 3 - Rồng Lửa Tinh Nghịch:* Đeo khăn quàng đỏ phiêu lưu tung bay, có 3 gai lưng hoàng kim, răng nanh trắng sữa và đuôi lửa 2 tầng màu.
  - *Cấp 4 - Rồng Lửa Siêu Cấp:* Chiến binh rồng mang ngọc Trái Tim Lửa phát sáng nhịp tim trên ngực, vương miện trán đính ruby, cánh lửa rực cháy.
  - *Cấp 5 - Thần Long Hoàng Gia 👑:* Vương miện 3 ngọn đính hồng ngọc & lam ngọc, áo choàng nhung đỏ viền vàng, triệu hồi Viên Ngọc Rồng Thần lượn quanh hộ mệnh cho bé.
- 🐱 **Mèo Bánh Bao (`cat`):**
  - Má bánh bao phúng phính, đốm cam tam thể, tai vểnh rung rinh theo nhịp, mắt anime xanh ngọc bích, mũi hồng đào, miệng cười số 3 (`:3`), râu nhí nhảnh, đệm thịt chân hồng hào.
  - Tiến hóa từ Quả Trứng Bạc Hà -> Mèo con đeo chuông vàng -> Mèo thắt nơ hồng -> Pháp sư sao băng -> Vua Mèo Thần Tài (cầm đồng xu vàng "Điểm 10").
- 🐧 **Cánh Cụt Pingu (`penguin`):**
  - Thân chim cánh cụt quả lê tròn trĩnh, bụng trắng muốt, mỏ cam tròn, quàng khăn len đỏ ấm áp, đội vương miện băng tuyết pha lê.
- 🦄 **Kỳ Lân Cầu Vồng (`unicorn`):**
  - Ngựa pony trắng ngọc trai, bờm cầu vồng 4 màu bồng bềnh, sừng xoắn hoàng kim phát ánh sao, đôi cánh tiên lấp lánh và vương miện sao thiên hà.

### Quy Trình Nuôi Thú Cưng Lần Lượt & Lưu Trữ Cấp Độ (`localStorage`):
Bé sẽ được nuôi các bạn thú cưng **lần lượt theo thứ tự**:
1. 🦖 **Rồng Con Lửa** (Mở khóa mặc định từ đầu)
2. 🐱 **Mèo Bánh Bao** (Mở khóa khi Rồng Con Lửa tốt nghiệp Cấp 5)
3. 🐧 **Cánh Cụt Pingu** (Mở khóa khi Mèo Bánh Bao tốt nghiệp Cấp 5)
4. 🦄 **Kỳ Lân Cầu Vồng** (Mở khóa khi Cánh Cụt Pingu tốt nghiệp Cấp 5)

- **Mốc Tiến Hóa & Mở Khóa Cấp Độ:**
  - **Cấp 1 (0 ⭐) - Quả Trứng:** Mở khóa **Cấp 1 (50 câu khởi động)**.
  - **Cấp 2 (5 ⭐) - Thú Con:** Tự động mở khóa & thăng cấp lên **Cấp 2 (50 câu ngôi nhà bé)**.
  - **Cấp 3 (15 ⭐) - Trưởng Thành:** Tự động mở khóa & thăng cấp lên **Cấp 3 (50 câu vần tròn môi)**.
  - **Cấp 4 (30 ⭐) - Siêu Cấp:** Tự động mở khóa & thăng cấp lên **Cấp 4 (50 câu trị đọc sai)**.
  - **Cấp 5 (50 ⭐) - Hoàng Gia 👑:** Đạt cấp độ tối thượng và **Tốt Nghiệp (Graduated 🎓)**. Hệ thống sẽ bật thông báo ăn mừng tưng bừng và mở khóa bạn thú cưng tiếp theo để bé tiếp tục hành trình!
- **Lưu trữ vĩnh viễn (`localStorage`):** Mọi tiến trình sao, cấp độ của từng con thú và danh sách con đã mở khóa đều được tự động lưu vĩnh viễn qua key `BE_DOC_TRON_PET_PROGRESS_V2`.
- **Vườn Thú:** Bé có thể vào xem danh sách, ghé thăm hoặc chọn lại các bạn thú cưng đã tốt nghiệp (Lv.5 👑) làm bạn đồng hành bất cứ lúc nào. Các bạn chưa mở khóa sẽ hiển thị điều kiện rõ ràng (🔒).

---

## 🎮 Hướng Dẫn Sử Dụng & Điều Khiển

### 1. Khởi động ứng dụng
- Nhấp đúp mở file [`flashcard.html`](flashcard.html) bằng trình duyệt web bất kỳ.
- Hoặc phục vụ thông qua một static web server:
  ```bash
  # Ví dụ chạy bằng Python:
  python3 -m http.server 8080
  # Truy cập: http://localhost:8080/flashcard.html
  ```

### 2. Các thao tác trong bài học
- **Chuyển thẻ:**
  - *Màn hình cảm ứng (Mobile/Tablet):* Vuốt sang trái (thẻ kế tiếp) hoặc vuốt sang phải (thẻ trước đó).
  - *Bàn phím (Desktop):* Bấm phím mũi tên `←` (Lùi) hoặc `→` (Tiếp theo).
- **Đánh giá kết quả đọc của bé:**
  - **Đọc trơn đúng (+1 ⭐):** Bấm nút màu xanh lá hoặc phím `Spacebar`.
  - **Cần cố gắng (+½ ⭐):** Bấm nút màu vàng khuyến khích để bé ôn lại sau.
- **Chế độ Tự động chạy (Auto-play):** Bấm nút "Tự chạy" để tự động lật thẻ sau mỗi 4.5 giây.
- **Tương tác với thú cưng:** Nhấp vào thú cưng trên thanh công cụ hoặc trong modal để nghe thú cưng trò chuyện, nhảy mừng rỡ tung tim và sao!
- **Xem bảng thành tích:** Bấm "Xem kết quả" để xem tổng kết số sao đạt được, tỷ lệ hoàn thành và danh sách các từ cần ôn luyện.

---

## 🚀 Đề Xuất Nâng Cấp Tương Lai

1. **Nhận diện giọng nói (Web Speech API):** Tự động lắng nghe giọng đọc của bé và chấm điểm chính xác theo thời gian thực.
2. **Giọng đọc mẫu (Text-to-Speech):** Tích hợp nút loa phát âm mẫu chuẩn từng từ để bé nghe và nhắc lại trước khi đọc.
3. **Tùy chỉnh bộ câu hỏi:** Cho phép phụ huynh nhập danh sách từ vựng/câu theo bài học trên lớp của từng ngày.

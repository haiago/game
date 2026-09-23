# 🌟 Bé Vui Học Đọc Trơn Lớp 1 - Nuôi Thú Cưng Hoạt Hình

Ứng dụng web tương tác dạng thẻ Flashcard kết hợp cơ chế nuôi thú cưng hoạt hình (**Gamification**) nhằm tạo động lực và sự hào hứng cho học sinh tiền tiểu học & lớp 1 rèn luyện kỹ năng **đọc trơn, phát âm đúng dấu thanh và ngắt nhịp tiếng Việt lưu loát**.

🌐 **Chơi trực tuyến ngay trên GitHub Pages**: [https://haiago.github.io/game/](https://haiago.github.io/game/)

---

## 📌 Điểm Nổi Bật & Luật Chơi Mới

- **Luyện đọc liên tục không giới hạn (Endless Mode):** Bé đọc bài liên tục, không bị ngắt quãng bởi giới hạn 15 câu mỗi vòng. Bé chỉ cần tập trung đọc để tích lũy sao giúp trứng thú cưng lên cấp và nở ra các bạn thần thú đáng yêu.
- **Tập trung Level 1, 2, 3 vừa sức (300 câu hỏi tuyển chọn):** Loại bỏ hoàn toàn các câu hỏi Level 4 & 5 quá khó, chỉ giữ lại các câu từ ngắn gọn, trong sáng, thân thuộc, chuẩn sách giáo khoa GDPT 2018.
- **Cơ chế cộng trừ sao linh hoạt & công bằng:**
  - 🟢 **Level 1 & Level 2:** Đọc trơn thành công được **+1 ⭐** (Cố gắng đọc được **+½ ⭐**).
  - 🟣 **Level 3 (Thử thách vần tròn môi):** Đọc trơn thành công được **+2 ⭐** (Cố gắng đọc được **+1 ⭐**).
  - ⏭️ **Nút "Bỏ qua":** Bỏ qua không trả lời sẽ bị **-0.5 ⭐** (sao không bao giờ bị âm dưới 0).
- **Gamification nuôi & tiến hóa 4 Quả Trứng Thần Thú:** Bé tích lũy sao để ấp nở: `Rồng Lửa 🦖`, `Mèo Bánh Bao 🐱`, `Cánh Cụt Băng 🐧`, `Kỳ Lân Cầu Vồng 🦄`.
- **Đồ họa tự sinh bằng HTML5 Canvas 2D:** Thú cưng vector chuyển động 60FPS với biểu cảm chớp mắt, nhảy múa, vẫy cánh, không cần tải ảnh ngoài.
- **Âm thanh tổng hợp (Synthesized Audio):** Sử dụng Web Audio API để phát âm thanh chuông sao, tiếng đàn hạc và âm thanh chúc mừng tưng bừng.

---

## 🏗️ Cấu Trúc Bộ Câu Hỏi (300 Câu Chuẩn Hóa)

Bộ câu hỏi được lưu trữ độc lập tại file [`questions.js`](questions.js) giúp tải trang nhẹ và mượt mà:

1. **Level 1 - Khởi Động Vui Vẻ (100 câu):**
   - *Đặc điểm:* Cụm 2–3 tiếng ngắn gọn, dấu thanh rõ ràng, gần gũi (*"Bé đi học"*, *"Mẹ yêu bé"*, *"Bình hoa đẹp"*, *"Bé rửa mặt"*...).
   - *Điểm thưởng:* **+1 ⭐** (hoặc **+½ ⭐** khi có cố gắng).
2. **Level 2 - Ngôi Nhà Bé Yêu (100 câu):**
   - *Đặc điểm:* Câu đơn 4–6 tiếng về sinh hoạt, gia đình, loài vật và thiên nhiên (*"Bé giúp mẹ nhặt rau"*, *"Bầu trời xanh ngắt"*, *"Bé đánh răng thật sạch"*...).
   - *Điểm thưởng:* **+1 ⭐** (hoặc **+½ ⭐** khi có cố gắng).
3. **Level 3 - Vần Tròn Môi Thử Thách (100 câu):**
   - *Đặc điểm:* Câu 6–8 tiếng rèn luyện các vần tròn môi, từ ghép và từ láy tượng thanh sinh động (*"Suối chảy róc rách"*, *"Bé khoanh tay lễ phép"*, *"Hoa vạn thọ xum xuê"*...).
   - *Điểm thưởng:* **+2 ⭐** (hoặc **+1 ⭐** khi có cố gắng).

---

## 🥚 Cơ Chế Trộn Thẻ Thích Ứng (Adaptive Dynamic Stream)

Thẻ bài được tự động điều phối theo cấp độ của quả trứng bé đang ấp:
- **Cấp 1 (0-4 ⭐ - Quả trứng):** 70% câu Cấp 1, 30% câu Cấp 2.
- **Cấp 2 (5-14 ⭐ - Nứt vỏ hé mắt):** 30% câu Cấp 1, 50% câu Cấp 2, 20% câu Cấp 3.
- **Cấp 3 (15-29 ⭐ - Thú nhí tinh nghịch):** 20% câu Cấp 1, 40% câu Cấp 2, 40% câu Cấp 3.
- **Cấp 4 (30-49 ⭐ - Thú siêu cấp chiến binh):** 10% câu Cấp 1, 40% câu Cấp 2, 50% câu Cấp 3.
- **Cấp 5 (50 ⭐ - Thần thú hoàng gia tốt nghiệp 👑):** 20% câu Cấp 2, 80% câu Cấp 3.

Khi bé gần học hết thẻ bài trong đợt, hệ thống sẽ tự động bốc tiếp các câu mới từ ngân hàng để bé luyện đọc không ngừng nghỉ cho đến khi trứng tiến hóa.

---

## 🎮 Hướng Dẫn Sử Dụng & Điều Khiển

- **Lật câu tiếp theo / câu trước:** Bấm nút `Tiếp Theo ▶` hoặc `◀ Trước` (hoặc phím mũi tên `←` / `→`).
- **Đọc trơn đúng:** Bấm nút vàng `Đọc Trơn! (+1⭐ hoặc +2⭐)`.
- **Có cố gắng:** Bấm nút xanh `Cố Gắng Lắm! (+½⭐ hoặc +1⭐)`.
- **Bỏ qua câu khó:** Bấm nút `Bỏ Qua (-½⭐)` nếu bé chưa muốn đọc câu hiện tại.
- **Đổi font chữ:** Bấm nút `🔤 Font` để chuyển đổi giữa các font chữ chuẩn tiểu học (`Be Vietnam Pro`, `Quicksand`, `Nunito`).
- **Bật/tắt âm thanh:** Bấm nút loa `🔊` ở góc trên cùng.
- **Tương tác thú cưng:** Bấm vào hình thú cưng để nghe bạn ấy trò chuyện và cổ vũ bé!

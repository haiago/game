// Công cụ phát âm Tiếng Việt cho bé
// Hỗ trợ cả Web Speech API nội bộ và fallback an toàn

let viVoice: SpeechSynthesisVoice | null = null;

function findViVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Tìm voice khớp chính xác vi-VN
  const viList = voices.filter(
    (v) => v.lang && (v.lang.toLowerCase().includes("vi") || v.lang.toLowerCase().includes("vn")),
  );

  if (viList.length > 0) {
    const priorityKeywords = ["Google", "Linh", "Mai", "An", "Nam", "Natural", "Samsung"];
    for (const kw of priorityKeywords) {
      const found = viList.find((v) => v.name.toLowerCase().includes(kw.toLowerCase()));
      if (found) return found;
    }
    return viList[0];
  }
  return null;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  viVoice = findViVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      viVoice = findViVoice();
    };
  }
}

/**
 * Phát âm một từ hoặc câu Tiếng Việt
 */
export function speakVietnamese(text: string, onEnd?: () => void) {
  if (typeof window === "undefined") return;

  const cleanText = text.trim();
  if (!cleanText) return;

  // Luôn thử tìm lại voice nếu chưa có
  if (!viVoice && "speechSynthesis" in window) {
    viVoice = findViVoice();
  }

  // Phương án 1: Trình duyệt có Web Speech API
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel(); // Dừng câu trước

      // Khắc phục bug Chrome Android/Samsung: speechSynthesis bị treo (paused/suspended)
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "vi-VN";
      utterance.volume = 1.0;
      utterance.rate = 0.88; // Tốc độ vừa phải cho bé
      utterance.pitch = 1.05;

      if (viVoice) {
        utterance.voice = viVoice;
      }

      let isFinished = false;
      const finish = () => {
        if (!isFinished) {
          isFinished = true;
          if (onEnd) onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = (err) => {
        console.warn("Speech error:", err);
        finish();
      };

      // Timeout đề phòng trường hợp Chrome không bao giờ bắn sự kiện onend
      setTimeout(() => {
        if (!isFinished && window.speechSynthesis.speaking) {
          finish();
        }
      }, 5000);

      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.warn("SpeechSynthesis exception:", e);
    }
  }

  if (onEnd) onEnd();
}


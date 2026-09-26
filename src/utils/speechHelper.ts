// Công cụ phát âm Tiếng Việt chất lượng cao cho bé
// 1. Tự động tìm giọng đọc Tiếng Việt tự nhiên nhất (Google Tiếng Việt, Apple Linh/Mai, Microsoft...)
// 2. Tự động tạm giảm nhạc nền BGM (audio ducking) để giọng đọc phát to, rõ ràng, không bị chìm
// 3. Dự phòng audio online nếu thiết bị không có voice vi-VN

import { soundManager } from "@/audio/soundEffects";

let viVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;

  // Ưu tiên các giọng tiếng Việt chất lượng cao: Google, Apple, Microsoft, rồi đến bất kỳ voice vi
  const priorityKeywords = ["Google", "Linh", "Mai", "An", "Nam", "Natural"];

  const viList = voices.filter(
    (v) => v.lang && (v.lang.includes("vi") || v.lang.includes("VI")),
  );
  if (viList.length > 0) {
    // Tìm voice theo độ ưu tiên
    let best = viList[0];
    for (const kw of priorityKeywords) {
      const found = viList.find((v) => v.name.includes(kw));
      if (found) {
        best = found;
        break;
      }
    }
    viVoice = best;
    voicesLoaded = true;
  }
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Phát âm một từ hoặc câu Tiếng Việt to, rõ ràng, chuẩn ngữ điệu
 */
export function speakVietnamese(text: string, onEnd?: () => void) {
  if (typeof window === "undefined") return;

  const cleanText = text.trim();
  if (!cleanText) return;

  // 1. Audio Ducking: Giảm âm lượng nhạc nền BGM xuống mức rất nhỏ (0.03) khi đọc chữ
  soundManager.setBgmVolume(0.03);

  const restoreBgm = () => {
    soundManager.setBgmVolume(0.14);
    if (onEnd) onEnd();
  };

  // Thử dùng Web Speech API với voice Tiếng Việt chuẩn
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      if (!voicesLoaded) loadVoices();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "vi-VN";
      utterance.volume = 1.0; // Âm lượng tối đa
      utterance.rate = 0.88; // Tốc độ chuẩn, chậm rãi, dễ nghe cho bé lớp 1
      utterance.pitch = 1.05; // Độ cao hơi ấm, thân thiện với trẻ em

      if (viVoice) {
        utterance.voice = viVoice;
      }

      utterance.onend = restoreBgm;
      utterance.onerror = (e) => {
        // Nếu Web Speech lỗi hoặc không có giọng vi-VN, dùng audio fallback
        console.warn("SpeechSynthesis fallback:", e);
        fallbackOnlineTTS(cleanText, restoreBgm);
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.warn("Lỗi SpeechSynthesis:", e);
    }
  }

  // Dự phòng: Google Translate TTS audio
  fallbackOnlineTTS(cleanText, restoreBgm);
}

// Fallback phát âm chuẩn âm điệu Tiếng Việt online
function fallbackOnlineTTS(text: string, onEnd?: () => void) {
  try {
    const encoded = encodeURIComponent(text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=vi&client=tw-ob`;
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;
    audio
      .play()
      .then(() => {
        audio.onended = onEnd || null;
      })
      .catch(() => {
        if (onEnd) onEnd();
      });
  } catch (e) {
    if (onEnd) onEnd();
  }
}

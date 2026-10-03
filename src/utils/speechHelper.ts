// Công cụ phát âm Tiếng Việt chuẩn cho bé
// Hỗ trợ:
// 1. Deepgram Text-to-Speech API (có tiền $200 free của Deepgram)
// 2. Google Cloud Text-to-Speech API (Neural2 / WaveNet - 1.000.000 ký tự free/tháng)
// 3. Google Translate TTS Audio Stream (Miễn phí 100%, không cần key)
// 4. Web Speech API nội bộ (Dự phòng khi offline)
// 5. Audio Ducking: Tự động hạ nhỏ nhạc nền khi phát âm

import { soundManager } from '@/audio/soundEffects';

// ==============================================================================
// 🛠️ BIẾN CẤU HÌNH API TTS (DEEPGRAM / GOOGLE CLOUD / TRANSLATE)
// ==============================================================================
export const TTS_CONFIG = {
  // 1. Chế độ phát âm:
  // - 'auto': Ưu tiên Google Voice chuẩn Tiếng Việt (hoặc Google Cloud nếu có key)
  // - 'google_cloud': Dùng Google Cloud Text-to-Speech API (Neural2 / WaveNet)
  // - 'google_translate': Dùng Google Translate TTS (miễn phí 100%, chuẩn tiếng Việt)
  // - 'deepgram': Bắt buộc gọi qua Deepgram TTS (lưu ý: Deepgram hiện chưa có giọng Việt)
  mode: 'auto' as 'auto' | 'google_cloud' | 'google_translate' | 'deepgram',

  // 2. Google Cloud API Key (Dán API Key 'AIzaSy...' của Google Cloud nếu có):
  googleApiKey: ((typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_TTS_API_KEY) || '') as string,
  voiceName: 'vi-VN-Neural2-A', // Giọng Nữ Neural2 AI tiếng Việt chuẩn nhất của Google

  // 3. Deepgram API Key:
  deepgramApiKey: '',
  deepgramModel: 'aura-asteria-en',

  // 4. Tốc độ đọc (0.85 -> 0.95 là chuẩn vừa phải cho bé nghe rõ dấu)
  speakingRate: 0.92,
};

// Cho phép cập nhật nhanh API key từ Console trình duyệt để test:
if (typeof window !== 'undefined') {
  (window as any).TTS_CONFIG = TTS_CONFIG;

  (window as any).setGoogleTtsKey = (key: string) => {
    TTS_CONFIG.googleApiKey = key.trim();
    localStorage.setItem('VITE_GOOGLE_TTS_API_KEY', key.trim());
    audioCache.clear();
    console.log('✅ Đã gắn Google Cloud TTS API Key thành công! Key:', key.slice(0, 8) + '...');
  };

  const savedGgKey = localStorage.getItem('VITE_GOOGLE_TTS_API_KEY');
  if (savedGgKey && !TTS_CONFIG.googleApiKey) {
    TTS_CONFIG.googleApiKey = savedGgKey;
  }
}

// ==============================================================================
// LOGIC XỬ LÝ ÂM THANH
// ==============================================================================

let viVoice: SpeechSynthesisVoice | null = null;
let currentAudio: HTMLAudioElement | null = null;
const audioCache = new Map<string, string>(); // text -> url / blob url / base64 src

function findViVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

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
 * URL Google Translate TTS Stream (Miễn phí, không cần key)
 */
function getGoogleTranslateTTSUrl(text: string): string {
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=vi&client=tw-ob`;
}

/**
 * Gọi Deepgram Text-to-Speech API
 * https://developers.deepgram.com/docs/text-to-speech
 */
async function fetchDeepgramTTSAudio(text: string): Promise<string | null> {
  const apiKey = TTS_CONFIG.deepgramApiKey.trim();
  if (!apiKey) return null;

  try {
    console.log('🎙️ [TTS] Đang gửi request sang Deepgram API cho từ:', `"${text}"`);
    const url = `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(TTS_CONFIG.deepgramModel)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('❌ Deepgram TTS API Error:', res.status, err);
      return null;
    }

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    console.log('✨ [TTS] Đã nhận âm thanh từ Deepgram API thành công cho từ:', `"${text}"`);
    return blobUrl;
  } catch (e) {
    console.warn('❌ Lỗi kết nối Deepgram TTS API:', e);
  }
  return null;
}

/**
 * Gọi Google Cloud Text-to-Speech API (Trả về Base64 MP3)
 */
async function fetchGoogleCloudTTSAudio(text: string): Promise<string | null> {
  const apiKey = TTS_CONFIG.googleApiKey.trim();
  if (!apiKey) return null;

  try {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'vi-VN',
          name: TTS_CONFIG.voiceName,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: TTS_CONFIG.speakingRate,
          pitch: 0.0,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('❌ Google Cloud TTS API Error:', res.status, err);
      return null;
    }

    const data = await res.json();
    if (data?.audioContent) {
      console.log('✨ [TTS] Đã nhận âm thanh từ Google Cloud Neural2 API thành công!');
      return `data:audio/mp3;base64,${data.audioContent}`;
    }
  } catch (e) {
    console.warn('❌ Lỗi kết nối Google Cloud TTS API:', e);
  }
  return null;
}

/**
 * Phát file âm thanh qua Audio element với kiểm soát kết thúc & lỗi
 */
function playAudioStream(src: string, onEnd?: () => void, onError?: () => void) {
  try {
    const audio = new Audio(src);
    currentAudio = audio;
    audio.volume = 1.0;
    audio.playbackRate = TTS_CONFIG.speakingRate;

    let isFinished = false;
    const finish = () => {
      if (!isFinished) {
        isFinished = true;
        if (currentAudio === audio) currentAudio = null;
        onEnd?.();
      }
    };

    audio.onended = finish;
    audio.onerror = (e) => {
      console.warn('Audio stream playback error, falling back:', e);
      if (!isFinished) {
        isFinished = true;
        if (currentAudio === audio) currentAudio = null;
        onError?.();
      }
    };

    const p = audio.play();
    if (p !== undefined) {
      p.catch((err) => {
        console.warn('Audio play was rejected by browser:', err);
        if (!isFinished) {
          isFinished = true;
          if (currentAudio === audio) currentAudio = null;
          onError?.();
        }
      });
    }
  } catch (err) {
    console.warn('playAudioStream exception:', err);
    onError?.();
  }
}

/**
 * Phát âm qua Web Speech API (Dự phòng khi offline hoặc mất mạng)
 */
function fallbackWebSpeech(cleanText: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    if (!viVoice) {
      viVoice = findViVoice();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN";
    utterance.volume = 1.0;
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    if (viVoice) {
      utterance.voice = viVoice;
    }

    let isFinished = false;
    const finish = () => {
      if (!isFinished) {
        isFinished = true;
        onEnd?.();
      }
    };

    utterance.onend = finish;
    utterance.onerror = (err) => {
      console.warn("Web Speech error:", err);
      finish();
    };

    setTimeout(() => {
      if (!isFinished && window.speechSynthesis.speaking) {
        finish();
      }
    }, 5000);

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Fallback Web Speech exception:", e);
    onEnd?.();
  }
}

/**
 * Tải trước âm thanh phát âm để bé bấm là nghe ngay không độ trễ
 */
export async function preloadVietnameseWord(text: string) {
  if (typeof window === "undefined" || typeof Audio === "undefined") return;
  const clean = text.trim();
  if (!clean || audioCache.has(clean)) return;

  // 1. Nếu ép chế độ Deepgram:
  if (TTS_CONFIG.mode === 'deepgram' && TTS_CONFIG.deepgramApiKey.trim().length > 0) {
    const dgAudio = await fetchDeepgramTTSAudio(clean);
    if (dgAudio) {
      audioCache.set(clean, dgAudio);
      return;
    }
  }

  // 2. Thử Google Cloud nếu có key
  if (TTS_CONFIG.googleApiKey.trim().length > 0 && (TTS_CONFIG.mode === 'google_cloud' || TTS_CONFIG.mode === 'auto')) {
    const cloudAudio = await fetchGoogleCloudTTSAudio(clean);
    if (cloudAudio) {
      audioCache.set(clean, cloudAudio);
      return;
    }
  }

  // 3. Mặc định cho Tiếng Việt: Preload qua Google Translate TTS (Miễn phí 100%, chuẩn thanh điệu)
  const url = getGoogleTranslateTTSUrl(clean);
  const audio = new Audio(url);
  audio.preload = "auto";
  audioCache.set(clean, url);
}

/**
 * Phát âm một từ hoặc câu Tiếng Việt
 * Thứ tự ưu tiên Tiếng Việt: Google Cloud (nếu có key) -> Google Translate (miễn phí chuẩn 100%) -> Web Speech (offline)
 */
export async function speakVietnamese(text: string, onEnd?: () => void) {
  if (typeof window === "undefined") return;

  const cleanText = text.trim();
  if (!cleanText) return;

  // 1. Tự động hạ nhỏ nhạc nền BGM xuống 2% để giọng đọc nổi bật lên
  soundManager.duckBgm();

  // Dừng âm thanh cũ đang phát
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }

  let bgmRestored = false;
  const restoreMusic = () => {
    if (!bgmRestored) {
      bgmRestored = true;
      soundManager.restoreBgm();
    }
  };

  // Safety timer: đảm bảo khôi phục nhạc nền sau 4.5s phòng khi mất sự kiện kết thúc
  setTimeout(restoreMusic, 4500);

  const finishCallback = () => {
    restoreMusic();
    onEnd?.();
  };

  // 2. Kiểm tra bộ nhớ đệm cache (nếu đã có thì phát ngay lập tức)
  const cachedSrc = audioCache.get(cleanText);
  if (cachedSrc) {
    playAudioStream(cachedSrc, finishCallback, () => {
      fallbackWebSpeech(cleanText, finishCallback);
    });
    return;
  }

  // 3. Nếu ép chế độ Deepgram:
  if (TTS_CONFIG.mode === 'deepgram' && TTS_CONFIG.deepgramApiKey.trim().length > 0) {
    const dgAudioSrc = await fetchDeepgramTTSAudio(cleanText);
    if (dgAudioSrc) {
      audioCache.set(cleanText, dgAudioSrc);
      playAudioStream(dgAudioSrc, finishCallback, () => {
        fallbackWebSpeech(cleanText, finishCallback);
      });
      return;
    }
  }

  // 4. Ưu tiên 1 cho Tiếng Việt: Gọi Google Cloud Text-to-Speech API nếu có key
  const hasGgKey = TTS_CONFIG.googleApiKey.trim().length > 0;
  const useCloud = hasGgKey && (TTS_CONFIG.mode === 'google_cloud' || TTS_CONFIG.mode === 'auto');
  if (useCloud) {
    const cloudAudio = await fetchGoogleCloudTTSAudio(cleanText);
    if (cloudAudio) {
      audioCache.set(cleanText, cloudAudio);
      playAudioStream(cloudAudio, finishCallback, () => {
        fallbackWebSpeech(cleanText, finishCallback);
      });
      return;
    }
  }

  // 5. Ưu tiên 2 cho Tiếng Việt: Phát qua Google Translate TTS Audio Stream (Miễn phí, chuẩn 100%)
  if (typeof Audio !== "undefined") {
    const translateUrl = getGoogleTranslateTTSUrl(cleanText);
    audioCache.set(cleanText, translateUrl);
    playAudioStream(translateUrl, finishCallback, () => {
      fallbackWebSpeech(cleanText, finishCallback);
    });
    return;
  }

  // 6. Dự phòng: Web Speech API nội bộ
  fallbackWebSpeech(cleanText, finishCallback);
}

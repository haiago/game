<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { BUBBLE_WORD_BANK, type BubbleWordItem } from '@/data/bubbleWords';
import { triggerStarBurstEffect, triggerPenaltyEffect } from '@/utils/particleEffects';
import { soundManager } from '@/audio/soundEffects';
import { speakVietnamese, preloadVietnameseWord } from '@/utils/speechHelper';

defineEmits<{
  (e: 'back-home'): void;
}>();

const petStore = usePetStore();

// Font chữ lựa chọn
const fontOptions = [
  { id: 'vietnam', label: 'Font Chuẩn 📚', family: "'Be Vietnam Pro', sans-serif" },
  { id: 'baloo', label: 'Bo Tròn 🧸', family: "'Baloo 2', cursive, sans-serif" }
];
const currentFont = ref(fontOptions[0]);

function toggleFont() {
  currentFont.value = currentFont.value.id === 'vietnam' ? fontOptions[1] : fontOptions[0];
}

// Cấp độ lọc
const selectedLevel = ref<1 | 2 | 3 | 'all'>('all');

// Bộ từ hiện tại
const currentQuestionIndex = ref(0);
const questions = ref<BubbleWordItem[]>([]);
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || BUBBLE_WORD_BANK[0]);

// Chuẩn hóa từ: Viết hoa chữ cái đầu tiên, các chữ sau viết thường (ví dụ: "Cá", "Mèo", "Mặt trời")
const formattedWord = computed(() => {
  const w = currentQuestion.value.word.toLowerCase();
  if (!w) return '';
  return w.charAt(0).toUpperCase() + w.slice(1);
});

// Các ký tự chuẩn theo quy tắc: chỉ ký tự đầu tiên viết hoa, các ký tự sau viết thường
const targetFormattedLetters = computed(() => {
  return currentQuestion.value.letters.map((char, idx) => {
    return idx === 0 ? char.toUpperCase() : char.toLowerCase();
  });
});

// ==========================================
// CƠ CHẾ KIỂM TRA CHÍNH TẢ (ẨN 1 - 2 CHỮ CÁI)
// ==========================================

// Danh sách các nguyên âm tiếng Việt (có dấu và không dấu)
const VIETNAMESE_VOWELS = new Set([
  'a', 'à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ', 'â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ',
  'e', 'è', 'é', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ề', 'ế', 'ể', 'ễ', 'ệ',
  'i', 'ì', 'í', 'ỉ', 'ĩ', 'ị',
  'o', 'ò', 'ó', 'ỏ', 'õ', 'ọ', 'ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ', 'ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ',
  'u', 'ù', 'ú', 'ủ', 'ũ', 'ụ', 'ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự',
  'y', 'ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ'
]);

// Nhóm các nguyên âm có quan hệ dấu thanh & âm liên quan
const VOWEL_FAMILIES: Record<string, string[]> = {
  a: ['a', 'à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'â', 'ấ', 'ầ'],
  e: ['e', 'è', 'é', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ệ'],
  i: ['i', 'ì', 'í', 'ỉ', 'ĩ', 'ị', 'y', 'ỳ', 'ý'],
  o: ['o', 'ò', 'ó', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ơ', 'ớ', 'ờ', 'ở'],
  u: ['u', 'ù', 'ú', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ự'],
  y: ['y', 'ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ', 'i', 'í', 'ì']
};

// Nhóm phụ âm dễ nhầm lẫn chính tả
const CONSONANT_FAMILIES: Record<string, string[]> = {
  c: ['k', 'q', 'g', 'b'],
  k: ['c', 'q'],
  g: ['gh', 'c', 'k', 'd'],
  s: ['x', 'ch', 'tr'],
  x: ['s', 'ch'],
  t: ['th', 'tr', 'd'],
  d: ['đ', 'gi', 'r', 'b'],
  đ: ['d', 'b', 'p'],
  l: ['n', 'm', 'b'],
  n: ['l', 'm', 'h'],
  b: ['d', 'đ', 'p'],
  r: ['d', 'gi', 'g']
};

// Các vị trí chữ cái bị ẩn trong từ hiện tại (chỉ ẩn 1 hoặc 2 vị trí)
const hiddenIndices = ref<number[]>([]);

// Tiến trình hiển thị từng chữ cái: true = đã hiển thị, false = đang khuyết chờ bé điền
const matchedLetters = ref<boolean[]>([]);

// Vị trí chữ cái khuyết tiếp theo cần bé tìm bắn bóng
const nextLetterNeededIndex = computed(() => {
  return hiddenIndices.value.find(idx => !matchedLetters.value[idx]) ?? -1;
});

// Chữ cái mục tiêu đang cần tìm (đã format hoa/thường)
const expectedTargetLetter = computed(() => {
  if (nextLetterNeededIndex.value === -1) return '';
  return targetFormattedLetters.value[nextLetterNeededIndex.value];
});

// Tạo danh sách chữ cái gây nhiễu chính tả thông minh cho chữ cái đang thiếu
function getSpellingDistractorsForChar(targetChar: string, isUpper: boolean, distractorsPreset: string[]): string[] {
  const lower = targetChar.toLowerCase();
  const candidates: string[] = [];

  // Tìm trong nhóm nguyên âm
  for (const key in VOWEL_FAMILIES) {
    if (VOWEL_FAMILIES[key].includes(lower)) {
      candidates.push(...VOWEL_FAMILIES[key]);
      break;
    }
  }

  // Tìm trong nhóm phụ âm
  if (CONSONANT_FAMILIES[lower]) {
    candidates.push(...CONSONANT_FAMILIES[lower]);
  }

  // Bổ sung các chữ nhiễu có sẵn trong câu hỏi
  candidates.push(...distractorsPreset);

  // Lọc bỏ chính chữ cái mục tiêu và trùng lặp
  const unique = Array.from(new Set(candidates)).filter(c => c.toLowerCase() !== lower);
  unique.sort(() => Math.random() - 0.5);

  return unique.map(c => isUpper ? c.toUpperCase() : c.toLowerCase());
}

// Trạng thái bong bóng đang bay lơ lửng trên màn chơi
interface FlyingBubble {
  id: number;
  char: string;
  isTarget: boolean; // có phải là chữ cái mục tiêu đang cần
  x: number; // vị trí ngang % (5% -> 85%)
  y: number; // vị trí dọc px từ đáy hoặc translateY
  speed: number;
  size: number; // kích thước px (55px - 72px)
  colorClass: string;
  wobbleOffset: number;
  popped: boolean;
  isWrongShake: boolean;
}

const bubbles = ref<FlyingBubble[]>([]);
const bubblePoolTimer = ref<any>(null);
const animationFrameId = ref<number | null>(null);
let bubbleCounter = 0;

// Bảng màu bong bóng xà phòng bảy sắc
const bubbleColors = [
  'from-pink-300/80 via-rose-400/75 to-purple-400/80 border-pink-200 text-pink-950',
  'from-sky-300/80 via-blue-400/75 to-indigo-400/80 border-sky-200 text-sky-950',
  'from-amber-200/80 via-yellow-300/75 to-orange-400/80 border-amber-200 text-amber-950',
  'from-emerald-300/80 via-teal-400/75 to-cyan-400/80 border-emerald-200 text-emerald-950',
  'from-purple-300/80 via-fuchsia-400/75 to-pink-400/80 border-purple-200 text-purple-950'
];

// Lọc câu hỏi theo cấp độ
function initQuestions() {
  let pool = BUBBLE_WORD_BANK;
  if (selectedLevel.value !== 'all') {
    pool = pool.filter(q => q.level === selectedLevel.value);
  }
  // Xáo trộn ngẫu nhiên
  questions.value = [...pool].sort(() => Math.random() - 0.5);
  currentQuestionIndex.value = 0;
  loadCurrentQuestion();
}

// Chọn ngẫu nhiên 1 hoặc 2 vị trí chữ cái để ẩn (ưu tiên nguyên âm có dấu hoặc phụ âm quan trọng)
function pickHiddenIndices(letters: string[], level: 1 | 2 | 3): number[] {
  const len = letters.length;
  if (len <= 0) return [];

  // Số lượng chữ cái cần ẩn:
  // - Từ ngắn (<= 3 chữ): Ẩn 1 chữ
  // - Từ trung bình (4-5 chữ): Level 3 ẩn 2 chữ, level 1-2 ẩn 1 chữ
  // - Từ dài (>= 6 chữ): Level 1 ẩn 1 chữ, level 2-3 ẩn 2 chữ
  let numToHide = 1;
  if (len >= 6 && level >= 2) {
    numToHide = 2;
  } else if (len >= 4 && level === 3) {
    numToHide = 2;
  }

  // Tìm các vị trí ưu tiên (nguyên âm có dấu hoặc âm đầu)
  const priorityIndices: number[] = [];
  const otherIndices: number[] = [];

  letters.forEach((char, idx) => {
    const lower = char.toLowerCase();
    // Ưu tiên nguyên âm hoặc chữ cái đầu tiên
    if (VIETNAMESE_VOWELS.has(lower) || idx === 0) {
      priorityIndices.push(idx);
    } else {
      otherIndices.push(idx);
    }
  });

  priorityIndices.sort(() => Math.random() - 0.5);
  otherIndices.sort(() => Math.random() - 0.5);

  const picked: number[] = [];
  while (picked.length < numToHide && priorityIndices.length > 0) {
    picked.push(priorityIndices.pop()!);
  }
  while (picked.length < numToHide && otherIndices.length > 0) {
    picked.push(otherIndices.pop()!);
  }

  // Sắp xếp tăng dần theo thứ tự từ trái sang phải
  return picked.sort((a, b) => a - b);
}

function loadCurrentQuestion() {
  const q = currentQuestion.value;
  if (!q) return;

  // Xác định 1 hoặc 2 chữ cái cần ẩn
  const picked = pickHiddenIndices(q.letters, q.level);
  hiddenIndices.value = picked;

  // Các chữ cái không bị ẩn được điền sẵn (true), chữ cái bị ẩn cần bé tìm (false)
  matchedLetters.value = q.letters.map((_, idx) => !picked.includes(idx));

  bubbles.value = [];
  
  // Tải trước âm thanh phát âm Google TTS
  preloadVietnameseWord(q.word);
  const nextQ = questions.value[currentQuestionIndex.value + 1];
  if (nextQ) preloadVietnameseWord(nextQ.word);

  // Tạo đàn bong bóng đầu tiên
  seedInitialBubbles();

  // Tự động phát âm ngay khi ra chữ mới để bé nhận biết
  setTimeout(() => {
    speakWord(q.word);
  }, 250);
}

// Tạo chùm bóng ban đầu
function seedInitialBubbles() {
  bubbles.value = [];
  const expected = expectedTargetLetter.value;
  if (!expected) return;

  const isUpper = nextLetterNeededIndex.value === 0;
  const distractors = getSpellingDistractorsForChar(expected, isUpper, currentQuestion.value.distractors);

  // Sinh 2 bóng chứa chữ cái cần tìm và 5 bóng nhiễu chính tả
  const pool = [expected, expected, ...distractors.slice(0, 5)];
  pool.sort(() => Math.random() - 0.5);

  pool.forEach((char, idx) => {
    spawnBubble(char, 20 + idx * 60 + Math.random() * 40);
  });
}

function spawnBubble(charPreset?: string, startY = -60) {
  const q = currentQuestion.value;
  if (!q) return;

  const expected = expectedTargetLetter.value;
  if (!expected && !charPreset) return;

  let char = charPreset;
  if (!char) {
    // Đếm số lượng bóng đang bay chứa đúng chữ cái mục tiêu
    const activeTargetBubbles = bubbles.value.filter(b => b.char === expected && !b.popped).length;

    // Đảm bảo luôn có ít nhất 2 quả bóng chứa chữ mục tiêu đang bay để bé không phải chờ lâu
    if (activeTargetBubbles < 2 || Math.random() < 0.45) {
      char = expected;
    } else {
      const isUpper = nextLetterNeededIndex.value === 0;
      const distractors = getSpellingDistractorsForChar(expected, isUpper, q.distractors);
      char = distractors[Math.floor(Math.random() * distractors.length)] || 'a';
    }
  }

  const isTarget = char === expected;
  const colorClass = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];

  bubbleCounter++;
  bubbles.value.push({
    id: bubbleCounter,
    char: char,
    isTarget,
    x: 8 + Math.random() * 78, // % chiều rộng màn chơi
    y: startY, // px tính từ đáy
    speed: 0.75 + Math.random() * 0.75, // Tốc độ trôi vừa phải cho bé tập trung ngắm
    size: 58 + Math.random() * 16,
    colorClass,
    wobbleOffset: Math.random() * Math.PI * 2,
    popped: false,
    isWrongShake: false
  });
}

// Vòng lặp cập nhật chuyển động bong bóng
function updateLoop() {
  const containerHeight = 360; // Chiều cao vùng bay

  for (let i = bubbles.value.length - 1; i >= 0; i--) {
    const b = bubbles.value[i];
    b.y += b.speed;

    // Nếu bóng bay vượt quá đỉnh màn chơi -> tái sinh ở dưới đáy
    if (b.y > containerHeight + 80) {
      bubbles.value.splice(i, 1);
      spawnBubble();
    }
  }

  // Duy trì số lượng từ 6-8 quả bóng trên màn hình
  if (bubbles.value.length < 7) {
    spawnBubble();
  }

  animationFrameId.value = requestAnimationFrame(updateLoop);
}

// Xử lý khi bé chạm / click vào 1 quả bong bóng
function handleBubbleClick(bubble: FlyingBubble, event: MouseEvent) {
  if (bubble.popped) return;

  const nextIdx = nextLetterNeededIndex.value;
  if (nextIdx === -1) return; // Đã điền xong tất cả chữ khuyết

  const expectedLetter = expectedTargetLetter.value;

  // BÉ BẤM ĐÚNG CHỮ CÁI CHÍNH TẢ ĐANG THIẾU
  if (bubble.char === expectedLetter) {
    bubble.popped = true;
    soundManager.playBubblePop();

    // Điền chữ cái vào ô khuyết
    matchedLetters.value[nextIdx] = true;

    // Xóa quả bóng sau hiệu ứng nổ
    setTimeout(() => {
      const idx = bubbles.value.findIndex(b => b.id === bubble.id);
      if (idx !== -1) bubbles.value.splice(idx, 1);
    }, 280);

    // KIỂM TRA ĐÃ HOÀN THÀNH TẤT CẢ CHỮ KHUYẾT CHƯA
    if (matchedLetters.value.every(v => v)) {
      handleWordCompleted(event.currentTarget as HTMLElement);
    } else {
      // Nếu còn chữ khuyết thứ 2: phát âm thanh vui tai khích lệ bé tìm tiếp
      soundManager.playTap();
    }
  } else {
    // BÉ BẤM SAI CHỮ CHÍNH TẢ
    soundManager.playBubbleWrong();
    bubble.isWrongShake = true;
    setTimeout(() => {
      bubble.isWrongShake = false;
    }, 450);
  }
}

// Khi ghép hoàn thành 1 từ trọn vẹn
const isCompletedWord = ref(false);

function handleWordCompleted(sourceEl: HTMLElement | null) {
  isCompletedWord.value = true;
  soundManager.playCorrect();

  // Tặng 1 sao nuôi thú cưng
  petStore.addStars(1);
  triggerStarBurstEffect(sourceEl, 1);

  // Phát âm đọc mẫu từ nếu thiết bị hỗ trợ
  speakWord(currentQuestion.value.word);

  // Tự động chuyển câu tiếp theo sau 2.2 giây
  setTimeout(() => {
    isCompletedWord.value = false;
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
    } else {
      currentQuestionIndex.value = 0;
    }
    loadCurrentQuestion();
  }, 2200);
}

// Bỏ qua câu nếu khó
function handleSkip(e: MouseEvent) {
  soundManager.playTap();
  petStore.addStars(-0.5);
  triggerPenaltyEffect(e.currentTarget as HTMLElement);

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  } else {
    currentQuestionIndex.value = 0;
  }
  loadCurrentQuestion();
}

// Phát âm mẫu giọng đọc Tiếng Việt chuẩn & to rõ cho bé
function speakWord(text: string) {
  speakVietnamese(text);
}

onMounted(() => {
  initQuestions();
  animationFrameId.value = requestAnimationFrame(updateLoop);
});

onUnmounted(() => {
  if (animationFrameId.value) cancelAnimationFrame(animationFrameId.value);
  if (bubblePoolTimer.value) clearInterval(bubblePoolTimer.value);
});
</script>

<template>
  <div
    class="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-col items-center gap-2 select-none"
    :style="{ fontFamily: currentFont.family }"
  >
    <!-- KHUNG ĐIỀU KHIỂN & TỪ MỤC TIÊU TÍCH HỢP GỌN GÀNG (1 HÀNG DUY NHẤT) -->
    <div class="w-full bg-white/95 rounded-2xl border-2 border-purple-200 shadow-xs px-2.5 sm:px-3 py-1.5 flex items-center justify-between gap-2 flex-wrap">
      
      <!-- Cụm trái: Nút Về Sảnh, Icon + TỪ MỤC TIÊU VỚI Ô KHUYẾT + Loa -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <button
          @click="$emit('back-home')"
          class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-xs active:scale-95 transition cursor-pointer shrink-0"
        >
          <span>🏠</span> <span class="hidden sm:inline">Sảnh</span>
        </button>

        <div class="text-3xl sm:text-4xl filter drop-shadow-2xs shrink-0">
          {{ currentQuestion.emoji }}
        </div>

        <!-- TỪ MỤC TIÊU VỚI Ô CHÍNH TẢ KHUYẾT [ ? ] -->
        <div class="flex items-center gap-1.5 bg-purple-50/80 px-2.5 sm:px-3 py-1 rounded-2xl border border-purple-200">
          <div class="flex items-center gap-1 font-baloo tracking-wide">
            <template v-for="(letter, idx) in targetFormattedLetters" :key="idx">
              <!-- Chữ cái đã điền đúng hoặc có sẵn -->
              <span
                v-if="matchedLetters[idx]"
                class="text-2xl sm:text-3xl font-black transition-all"
                :class="hiddenIndices.includes(idx) ? 'text-emerald-600 animate-in zoom-in font-black' : 'text-purple-950'"
              >
                {{ letter }}
              </span>

              <!-- Ô khuyết đang cần bé tìm bắn bóng -->
              <span
                v-else-if="idx === nextLetterNeededIndex"
                class="inline-flex items-center justify-center min-w-[32px] sm:min-w-[38px] h-8 sm:h-9 px-1.5 rounded-xl border-2 border-dashed border-amber-500 bg-amber-100 text-amber-800 text-xl sm:text-2xl font-black animate-bounce shadow-xs ring-2 ring-amber-300"
                title="Bé tìm chữ cái này nhé!"
              >
                ?
              </span>

              <!-- Ô khuyết thứ 2 đang đợi lượt -->
              <span
                v-else
                class="inline-flex items-center justify-center min-w-[32px] sm:min-w-[38px] h-8 sm:h-9 px-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400 text-xl sm:text-2xl font-black"
              >
                ?
              </span>
            </template>
          </div>

          <button
            @click="speakWord(currentQuestion.word)"
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 hover:bg-amber-200 active:scale-90 border border-amber-300 flex items-center justify-center text-xs sm:text-sm text-amber-800 cursor-pointer transition shrink-0 shadow-2xs"
            title="Bấm để nghe đọc lại từ"
          >
            🔊
          </button>
        </div>

        <button
          @click="toggleFont"
          class="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs cursor-pointer border border-amber-200"
        >
          🔤 {{ currentFont.label }}
        </button>
      </div>

      <!-- Cụm phải: TIẾN TRÌNH CÁC Ô CHỮ CÁI (SLOTS) -->
      <div class="flex items-center justify-end gap-1.5 sm:gap-2 flex-wrap ml-auto">
        <div
          v-for="(letter, idx) in targetFormattedLetters"
          :key="idx"
          class="rounded-xl border-2 sm:border-3 flex items-center justify-center font-black transition-all transform relative"
          :class="[
            currentQuestion.letters.length > 5
              ? 'w-8 h-10 sm:w-9 sm:h-11 text-lg sm:text-xl'
              : 'w-9 h-11 sm:w-11 sm:h-13 text-xl sm:text-2xl',
            !hiddenIndices.includes(idx)
              ? 'bg-slate-100 border-slate-300 text-slate-700'
              : matchedLetters[idx]
                ? 'bg-gradient-to-b from-emerald-100 to-teal-200 border-emerald-500 text-emerald-950 scale-105 shadow-xs'
                : idx === nextLetterNeededIndex
                  ? 'bg-amber-100 border-amber-500 border-dashed text-amber-800 animate-pulse ring-3 ring-amber-300 shadow-md'
                  : 'bg-slate-50 border-slate-200 text-slate-300'
          ]"
        >
          <!-- Chữ cái có sẵn ban đầu -->
          <span v-if="!hiddenIndices.includes(idx)" class="font-bold opacity-80">
            {{ letter }}
          </span>
          <!-- Chữ cái khuyết đã tìm trúng -->
          <span v-else-if="matchedLetters[idx]" class="animate-in zoom-in duration-200 font-black text-emerald-900">
            {{ letter }}
          </span>
          <!-- Ô khuyết đang cần bắn -->
          <span v-else-if="idx === nextLetterNeededIndex" class="font-black text-amber-700 animate-bounce">
            ?
          </span>
          <!-- Ô khuyết đang chờ -->
          <span v-else class="font-bold text-slate-300">
            ?
          </span>
        </div>
      </div>

    </div>

    <!-- BANNER NHIỆM VỤ CHÍNH TẢ -->
    <div class="w-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 rounded-2xl px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-bold text-amber-950 shadow-2xs">
      <div class="flex items-center gap-1.5 sm:gap-2">
        <span class="text-base sm:text-lg animate-bounce">🎯</span>
        <span>
          <b>Thử thách chính tả:</b> Bé hãy tìm và bắn bóng chứa chữ cái <span class="px-2 py-0.5 rounded-lg bg-amber-200 text-amber-950 font-black border border-amber-300">[ ? ]</span> để điền vào chỗ trống!
        </span>
      </div>
      <span class="text-[11px] font-semibold text-slate-500 hidden md:inline bg-white/70 px-2 py-0.5 rounded-lg border border-amber-200/60">
        💡 {{ currentQuestion.meaning }}
      </span>
    </div>

    <!-- KHU VỰC BẦU TRỜI BONG BÓNG BAY LƠ LỬNG (CANVAS / BUBBLE ARENA) -->
    <div
      class="w-full h-[460px] sm:h-[530px] rounded-3xl bg-gradient-to-b from-sky-100 via-indigo-50/60 to-purple-100/90 border-3 border-sky-300 shadow-inner relative overflow-hidden flex flex-col justify-end"
    >
      <!-- Các đám mây trôi nền -->
      <div class="absolute top-4 left-6 text-3xl opacity-50 pointer-events-none select-none">☁️</div>
      <div class="absolute top-12 right-10 text-4xl opacity-50 pointer-events-none select-none">☁️</div>
      <div class="absolute top-28 left-1/3 text-2xl opacity-40 pointer-events-none select-none">✨</div>

      <!-- BONG BÓNG BAY -->
      <div
        v-for="b in bubbles"
        :key="b.id"
        class="absolute cursor-pointer flex items-center justify-center font-black rounded-full border-2 shadow-lg backdrop-blur-xs select-none transition-transform"
        :class="[
          b.colorClass,
          b.popped ? 'scale-150 opacity-0 duration-300' : 'active:scale-90 hover:scale-105',
          b.isWrongShake ? 'animate-bounce border-rose-500 ring-2 ring-rose-400' : ''
        ]"
        :style="{
          left: `${b.x}%`,
          bottom: `${b.y}px`,
          width: `${b.size}px`,
          height: `${b.size}px`,
          fontSize: `${b.size * 0.52}px`,
          boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.1), 0 6px 14px rgba(0,0,0,0.12)'
        }"
        @click="handleBubbleClick(b, $event)"
      >
        <!-- Tia sáng bóng nước -->
        <span class="absolute top-2 left-2.5 w-2.5 h-2.5 rounded-full bg-white/70 pointer-events-none"></span>
        <span class="relative z-10 font-black drop-shadow-xs">{{ b.char }}</span>
      </div>

      <!-- Overlay khi hoàn thành từ -->
      <div
        v-if="isCompletedWord"
        class="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20 animate-in fade-in zoom-in duration-200"
      >
        <span class="text-6xl animate-bounce">🎉</span>
        <h3 class="text-2xl sm:text-3xl font-black font-baloo text-emerald-600">
          ĐÚNG CHÍNH TẢ RỒI! (+1 ⭐)
        </h3>
        <p class="text-xl sm:text-2xl font-black text-purple-950 font-baloo flex items-center gap-2">
          <span>{{ currentQuestion.emoji }}</span>
          <span>{{ formattedWord }}</span>
        </p>
        <span class="text-xs font-bold text-slate-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {{ currentQuestion.meaning }}
        </span>
      </div>
    </div>

    <!-- Thanh nút bấm dưới cùng: Nút Bỏ qua -->
    <div class="w-full flex items-center justify-end">
      <button
        @click="handleSkip"
        class="px-4 py-2 rounded-2xl bg-white border-2 border-slate-300 hover:bg-rose-50 hover:border-rose-300 text-slate-600 hover:text-rose-600 text-xs font-black active:scale-95 transition cursor-pointer shadow-xs flex items-center gap-1.5"
      >
        <span>⏭️</span> Đổi từ khác (-½ ⭐)
      </button>
    </div>

  </div>
</template>

<style scoped>
/* Hiệu ứng chao đảo bập bồng nhẹ cho bóng */
@keyframes bubbleFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(4px, -6px, 0);
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { BUBBLE_WORD_BANK, type BubbleWordItem } from '@/data/bubbleWords';
import { triggerStarBurstEffect, triggerPenaltyEffect } from '@/utils/particleEffects';
import { soundManager } from '@/audio/soundEffects';
import { speakVietnamese } from '@/utils/speechHelper';

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

// Chuẩn hóa từ: Chỉ viết hoa chữ cái đầu tiên của từ, các chữ sau viết thường (ví dụ: "Cá", "Mèo", "Mặt trời")
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

// Tiến trình ghép chữ hiện tại của câu
// mảng boolean tương ứng với từng chữ cái trong currentQuestion.letters đã được tìm trúng chưa
const matchedLetters = ref<boolean[]>([]);
const nextLetterNeededIndex = computed(() => {
  return matchedLetters.value.findIndex(v => !v);
});

// Trạng thái bong bóng đang bay lơ lửng trên màn chơi
interface FlyingBubble {
  id: number;
  char: string;
  isTarget: boolean; // có phải là chữ cái mục tiêu
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

function loadCurrentQuestion() {
  const q = currentQuestion.value;
  matchedLetters.value = new Array(q.letters.length).fill(false);
  bubbles.value = [];
  
  // Tạo đàn bong bóng đầu tiên
  seedInitialBubbles();

  // Tự động phát âm ngay khi ra chữ mới để bé nhận biết
  setTimeout(() => {
    speakWord(q.word);
  }, 250);
}

// Tạo chùm bóng ban đầu và duy trì liên tục
function seedInitialBubbles() {
  bubbles.value = [];
  const q = currentQuestion.value;
  const targetChars = [...q.letters];
  const distractorChars = [...q.distractors];

  // Tạo tập hợp các chữ cái xuất hiện (bao gồm cả chữ đúng và chữ nhiễu)
  const allNeeded = [...targetFormattedLetters.value, ...distractorChars];
  allNeeded.sort(() => Math.random() - 0.5);

  allNeeded.forEach((char, idx) => {
    spawnBubble(char, 20 + idx * 80 + Math.random() * 60, false);
  });
}

function spawnBubble(charPreset?: string, startY = -60, isRepop = true) {
  const q = currentQuestion.value;
  if (!q) return;

  // Quyết định ký tự nào sẽ bay lên
  let char = charPreset;
  if (!char) {
    const nextIdx = nextLetterNeededIndex.value;
    const needChar = nextIdx !== -1
      ? targetFormattedLetters.value[nextIdx]
      : targetFormattedLetters.value[Math.floor(Math.random() * targetFormattedLetters.value.length)];
    // 55% khả năng sinh ra chữ cái bé đang cần hoặc chữ trong từ, 45% chữ nhiễu
    if (Math.random() < 0.55) {
      char = needChar;
    } else {
      const randomDistractor = q.distractors[Math.floor(Math.random() * q.distractors.length)] || 'a';
      // Nếu ô tiếp theo là ô đầu tiên -> chữ nhiễu cũng viết hoa; nếu là ô sau -> chữ nhiễu viết thường
      char = nextIdx === 0 ? randomDistractor.toUpperCase() : randomDistractor.toLowerCase();
    }
  }

  const isTarget = targetFormattedLetters.value.includes(char);
  const colorClass = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];

  bubbleCounter++;
  bubbles.value.push({
    id: bubbleCounter,
    char: char, // Giữ nguyên chữ hoa cho chữ đầu, chữ thường cho các chữ tiếp theo
    isTarget,
    x: 8 + Math.random() * 78, // % chiều rộng màn chơi
    y: startY, // px tính từ đáy
    speed: 0.8 + Math.random() * 0.9, // Tốc độ trôi vừa phải cho bé lớp 1
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
  if (nextIdx === -1) return; // Đã ghép xong

  const expectedLetter = targetFormattedLetters.value[nextIdx];

  // BÉ BẤM ĐÚNG CHỮ CÁI TIẾP THEO (Khớp chữ hoa nếu là chữ đầu, khớp chữ thường nếu là các chữ sau)
  if (bubble.char === expectedLetter) {
    bubble.popped = true;
    soundManager.playBubblePop();

    // Điền chữ cái vào ô
    matchedLetters.value[nextIdx] = true;

    // Xóa quả bóng sau hiệu ứng nổ nát bọt xà phòng
    setTimeout(() => {
      const idx = bubbles.value.findIndex(b => b.id === bubble.id);
      if (idx !== -1) bubbles.value.splice(idx, 1);
    }, 280);

    // KIỂM TRA ĐÃ HOÀN THÀNH TỪ CHƯA
    if (matchedLetters.value.every(v => v)) {
      handleWordCompleted(event.currentTarget as HTMLElement);
    }
  } else {
    // BÉ BẤM SAI CHỮ HOẶC SAI THỨ TỰ ĐÁNH VẦN
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
      
      <!-- Cụm trái: Nút Về Sảnh, Icon + TỪ MỤC TIÊU + Loa -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <button
          @click="$emit('back-home')"
          class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-xs active:scale-95 transition cursor-pointer shrink-0"
        >
          <span>🏠</span> <span class="hidden sm:inline">Sảnh</span>
        </button>

        <div class="text-2xl sm:text-3xl filter drop-shadow-2xs shrink-0">
          {{ currentQuestion.emoji }}
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-lg sm:text-xl font-black text-purple-950 font-baloo tracking-wide">
            {{ formattedWord }}
          </span>
          <button
            @click="speakWord(currentQuestion.word)"
            class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-100 hover:bg-amber-200 active:scale-90 border border-amber-300 flex items-center justify-center text-xs text-amber-800 cursor-pointer transition shrink-0"
            title="Bấm để nghe đọc lại"
          >
            🔊
          </button>
        </div>

        <button
          @click="toggleFont"
          class="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[10px] cursor-pointer"
        >
          🔤 {{ currentFont.label }}
        </button>
      </div>

      <!-- Cụm phải: CÁC Ô CHỮ CÁI ĐÍCH CẦN GHÉP (SLOTS) -->
      <div class="flex items-center justify-end gap-1 sm:gap-1.5 flex-wrap ml-auto">
        <div
          v-for="(letter, idx) in targetFormattedLetters"
          :key="idx"
          class="rounded-lg border-2 flex items-center justify-center font-black transition-all transform relative"
          :class="[
            currentQuestion.letters.length > 5
              ? 'w-6 h-8 sm:w-7 sm:h-9 text-sm sm:text-base'
              : 'w-7 h-9 sm:w-8 sm:h-10 text-base sm:text-lg',
            matchedLetters[idx]
              ? 'bg-gradient-to-b from-emerald-100 to-teal-200 border-emerald-500 text-emerald-950 scale-105 shadow-2xs'
              : idx === nextLetterNeededIndex
                ? 'bg-amber-50 border-amber-400 border-dashed text-amber-700 animate-pulse ring-1 ring-amber-300'
                : 'bg-slate-50 border-slate-200 text-slate-300'
          ]"
        >
          <!-- Đã ghép đúng -->
          <span v-if="matchedLetters[idx]" class="animate-in zoom-in duration-200">
            {{ letter }}
          </span>
          <!-- Ô tiếp theo cần bấm (chữ mờ hướng dẫn) -->
          <span v-else-if="idx === nextLetterNeededIndex" class="opacity-40 font-black text-amber-600">
            {{ letter }}
          </span>
          <!-- Ô chưa tới lượt (hiện chữ mờ nhạt làm mẫu) -->
          <span v-else class="opacity-25 font-bold">
            {{ letter }}
          </span>
        </div>
      </div>

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
          fontSize: `${b.size * 0.45}px`,
          boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.1), 0 6px 14px rgba(0,0,0,0.12)'
        }"
        @click="handleBubbleClick(b, $event)"
      >
        <!-- Tia sáng bóng nước -->
        <span class="absolute top-2 left-2.5 w-2.5 h-2.5 rounded-full bg-white/70 pointer-events-none"></span>
        <span class="relative z-10">{{ b.char }}</span>
      </div>

      <!-- Overlay khi hoàn thành từ -->
      <div
        v-if="isCompletedWord"
        class="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20 animate-in fade-in zoom-in duration-200"
      >
        <span class="text-5xl animate-bounce">🎉</span>
        <h3 class="text-2xl sm:text-3xl font-black font-baloo text-emerald-600">
          XUẤT SẮC! +1 ⭐
        </h3>
        <p class="text-lg font-black text-purple-950 font-baloo">
          {{ currentQuestion.word }} {{ currentQuestion.emoji }}
        </p>
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

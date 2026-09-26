<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { QUESTION_BANK, type QuestionItem } from '@/data/readingQuestions';
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

// Hàm xáo trộn mảng ngẫu nhiên
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface AdaptiveQuestionItem extends QuestionItem {
  sourceLevel: 1 | 2 | 3;
}

// Sinh bộ câu hỏi ngẫu nhiên trộn tỉ lệ Level 1, 2, 3 theo giai đoạn tiến hóa của thú cưng
function generateAdaptiveDeck(): AdaptiveQuestionItem[] {
  const stage = petStore.currentStageIndex + 1; // 1 -> 5
  let distribution: { 1: number; 2: number; 3: number };

  if (stage === 1) {
    // Trứng nhỏ: 70% Level 1, 30% Level 2, 0% Level 3
    distribution = { 1: 11, 2: 4, 3: 0 };
  } else if (stage === 2) {
    // Nứt vỏ: 35% Level 1, 45% Level 2, 20% Level 3
    distribution = { 1: 5, 2: 7, 3: 3 };
  } else if (stage === 3) {
    // Thú nhí: 20% Level 1, 40% Level 2, 40% Level 3
    distribution = { 1: 3, 2: 6, 3: 6 };
  } else if (stage === 4) {
    // Chiến binh: 10% Level 1, 40% Level 2, 50% Level 3
    distribution = { 1: 2, 2: 6, 3: 7 };
  } else {
    // Hoàng gia: 20% Level 2, 80% Level 3
    distribution = { 1: 0, 2: 3, 3: 12 };
  }

  let list: AdaptiveQuestionItem[] = [];
  ([1, 2, 3] as const).forEach(lvl => {
    const count = distribution[lvl];
    if (count > 0) {
      const pool = QUESTION_BANK[`level${lvl}`];
      const picked = shuffle(pool).slice(0, count).map(card => ({
        ...card,
        sourceLevel: lvl
      }));
      list = list.concat(picked);
    }
  });

  return shuffle(list);
}

// Trạng thái vòng đọc
const deck = ref<AdaptiveQuestionItem[]>(generateAdaptiveDeck());
const currentIndex = ref(0);
const hasAnsweredCurrent = ref(false);
const isBroken = ref(false);

const currentCard = computed<AdaptiveQuestionItem>(() => {
  return deck.value[currentIndex.value] || deck.value[0];
});

function markSuccess(event?: MouseEvent) {
  if (hasAnsweredCurrent.value || isBroken.value) return;
  hasAnsweredCurrent.value = true;
  
  // Điểm: Level 1, 2 = 1 sao; Level 3 = 2 sao
  const added = currentCard.value.sourceLevel === 3 ? 2 : 1;
  const targetEl = (event?.currentTarget as HTMLElement) || null;
  triggerStarBurstEffect(targetEl, added);
  petStore.addStars(added);

  setTimeout(() => {
    nextCard();
  }, 1200);
}

function skipCard(event?: MouseEvent) {
  if (hasAnsweredCurrent.value || isBroken.value) return;
  const targetEl = (event?.currentTarget as HTMLElement) || null;
  triggerPenaltyEffect(targetEl);
  soundManager.playWrongCrack();
  // Bỏ qua trừ 0.5 sao
  petStore.addStars(-0.5);
  
  isBroken.value = true;
  setTimeout(() => {
    isBroken.value = false;
    nextCard();
  }, 2000);
}

function nextCard() {
  hasAnsweredCurrent.value = false;
  if (currentIndex.value < deck.value.length - 1) {
    currentIndex.value++;
  } else {
    // Xáo trộn lượt đọc mới thích ứng
    deck.value = generateAdaptiveDeck();
    currentIndex.value = 0;
  }
}

function prevCard() {
  hasAnsweredCurrent.value = false;
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col items-center gap-4">
    
    <!-- Top Controls: Nút về sảnh & Đổi font chữ -->
    <div class="w-full flex items-center justify-between gap-2">
      <button
        @click="$emit('back-home')"
        class="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 font-black text-xs sm:text-sm border-2 border-slate-200 shadow-sm flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
      >
        <span>🏠</span>
        <span>Sảnh Game</span>
      </button>

      <!-- Nút đổi font chữ tiện dụng thay cho tabs chia cấp -->
      <button
        @click="toggleFont"
        class="px-3 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 font-black text-xs border border-slate-200 shadow-xs flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
        title="Bấm để đổi kiểu chữ"
      >
        <span>🔤</span>
        <span>{{ currentFont.label }}</span>
      </button>
    </div>

    <!-- THẺ FLASHCARD ĐỌC TRƠN LỚN (Có hiệu ứng vỡ đôi khi bỏ qua) -->
    <div class="w-full relative min-h-[300px] sm:min-h-[340px] flex items-center justify-center">
      
      <!-- Card đọc trơn bình thường -->
      <div
        v-if="!isBroken"
        class="w-full min-h-[300px] sm:min-h-[340px] rounded-[36px] bg-gradient-to-br p-6 sm:p-8 shadow-2xl border-4 border-white flex flex-col items-center justify-between text-center relative select-none transition-all"
        :class="currentCard.theme"
      >
        <!-- Huy hiệu câu & Cấp độ thẻ ngẫu nhiên -->
        <div class="w-full flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-black px-3 py-1 rounded-full bg-white/80 text-slate-800 shadow-xs">
              Câu {{ currentIndex + 1 }}/{{ deck.length }}
            </span>
            <span
              class="text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs"
              :class="currentCard.sourceLevel === 3 ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-amber-100 text-amber-900 border border-amber-300'"
            >
              {{ currentCard.sourceLevel === 3 ? 'Cấp 3 (+2⭐)' : `Cấp ${currentCard.sourceLevel} (+1⭐)` }}
            </span>
          </div>
          <span class="text-4xl animate-bounce">
            {{ currentCard.emoji }}
          </span>
        </div>

        <!-- Nội dung câu đọc trơn cỡ lớn cho bé lớp 1 -->
        <div class="my-6">
          <div class="flex items-center justify-center gap-3">
            <h2
              class="text-3xl sm:text-5xl font-black leading-relaxed tracking-wide"
              :class="currentCard.textColor"
              :style="{ fontFamily: currentFont.family }"
            >
              {{ currentCard.text }}
            </h2>
            <button
              @click="speakVietnamese(currentCard.text)"
              class="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white active:scale-90 border-2 border-purple-300 shadow-sm flex items-center justify-center text-xl text-purple-700 cursor-pointer transition shrink-0"
              title="Bấm để nghe đọc mẫu"
            >
              🔊
            </button>
          </div>
          <p class="text-xs sm:text-sm font-bold text-slate-600/90 mt-3 bg-white/70 px-4 py-1.5 rounded-full inline-block">
            💡 {{ currentCard.guide }}
          </p>
        </div>

        <!-- Nút điều hướng trước/sau -->
        <div class="w-full flex items-center justify-between text-xs font-bold text-slate-500">
          <button @click="prevCard" :disabled="currentIndex === 0 || isBroken" class="hover:text-slate-800 disabled:opacity-30 cursor-pointer">
            ⬅️ Câu trước
          </button>
          <button @click="nextCard" :disabled="isBroken" class="hover:text-slate-800 disabled:opacity-30 cursor-pointer">
            Câu sau ➡️
          </button>
        </div>
      </div>

      <!-- Card khi bị BỎ QUA: Vỡ đôi toác ra 2 bên kèm thông báo -->
      <div v-else class="w-full relative min-h-[300px] sm:min-h-[340px] card-earthquake">
        
        <!-- Nửa Trái -->
        <div
          class="w-full min-h-[300px] sm:min-h-[340px] rounded-[36px] bg-gradient-to-br from-rose-200 via-rose-100 to-amber-200 p-6 sm:p-8 shadow-2xl border-4 border-rose-400 flex flex-col items-center justify-between text-center split-part-left pointer-events-none select-none"
        >
          <div class="w-full flex items-center justify-between opacity-80">
            <span class="text-xs font-black px-3 py-1 rounded-full bg-rose-200 text-rose-900">
              💔 BÉ ĐÃ BỎ QUA
            </span>
            <span class="text-4xl">{{ currentCard.emoji }}</span>
          </div>
          <div class="my-6">
            <h2 class="text-3xl sm:text-5xl font-black leading-relaxed text-rose-950 filter blur-[0.4px]">
              {{ currentCard.text }}
            </h2>
          </div>
          <div class="text-xs font-bold text-rose-600">-0.5 sao</div>
        </div>

        <!-- Nửa Phải -->
        <div
          class="w-full min-h-[300px] sm:min-h-[340px] rounded-[36px] bg-gradient-to-br from-rose-200 via-rose-100 to-amber-200 p-6 sm:p-8 shadow-2xl border-4 border-rose-400 flex flex-col items-center justify-between text-center split-part-right pointer-events-none select-none absolute inset-0"
        >
          <div class="w-full flex items-center justify-between opacity-80">
            <span class="text-xs font-black px-3 py-1 rounded-full bg-rose-200 text-rose-900">
              💔 BÉ ĐÃ BỎ QUA
            </span>
            <span class="text-4xl">{{ currentCard.emoji }}</span>
          </div>
          <div class="my-6">
            <h2 class="text-3xl sm:text-5xl font-black leading-relaxed text-rose-950 filter blur-[0.4px]">
              {{ currentCard.text }}
            </h2>
          </div>
          <div class="text-xs font-bold text-rose-600">-0.5 sao</div>
        </div>

        <!-- Bụi nứt vỡ ở giữa -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div class="text-6xl animate-ping opacity-75 drop-shadow-lg">💥</div>
        </div>

      </div>

    </div>

    <!-- Hàng nút hành động: Nhận sao hoặc Bỏ qua -->
    <div class="w-full flex items-center gap-3">
      <!-- Bỏ qua (-0.5 sao) -->
      <button
        @click="skipCard($event)"
        :disabled="hasAnsweredCurrent || isBroken"
        class="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs sm:text-sm border-2 border-slate-300 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Bỏ qua (-½⭐)
      </button>

      <!-- Đọc Tốt (+1 hoặc +2 sao) -->
      <button
        @click="markSuccess($event)"
        :disabled="hasAnsweredCurrent || isBroken"
        class="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:opacity-95 text-white font-black text-sm sm:text-base shadow-xl border-2 border-white active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <span>⭐</span>
        <span>Bé Đọc Xong (+{{ currentCard.sourceLevel === 3 ? 2 : 1 }} Sao)</span>
      </button>
    </div>

  </div>
</template>

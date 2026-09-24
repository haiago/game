<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { QUESTION_BANK, type QuestionItem } from '@/data/readingQuestions';

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

// Trạng thái vòng đọc
const activeLevel = ref<1 | 2 | 3>(1);
const currentIndex = ref(0);
const hasAnsweredCurrent = ref(false);

const deck = computed<QuestionItem[]>(() => {
  if (activeLevel.value === 1) return QUESTION_BANK.level1;
  if (activeLevel.value === 2) return QUESTION_BANK.level2;
  return QUESTION_BANK.level3;
});

const currentCard = computed<QuestionItem>(() => {
  return deck.value[currentIndex.value] || deck.value[0];
});

function markSuccess() {
  if (hasAnsweredCurrent.value) return;
  hasAnsweredCurrent.value = true;
  
  // Điểm: Level 1, 2 = 1 sao; Level 3 = 2 sao
  const added = activeLevel.value === 3 ? 2 : 1;
  petStore.addStars(added);

  setTimeout(() => {
    nextCard();
  }, 900);
}

function skipCard() {
  if (hasAnsweredCurrent.value) return;
  // Bỏ qua trừ 0.5 sao
  petStore.addStars(-0.5);
  nextCard();
}

function nextCard() {
  hasAnsweredCurrent.value = false;
  if (currentIndex.value < deck.value.length - 1) {
    currentIndex.value++;
  } else {
    // Xáo trộn vòng mới ngẫu nhiên
    currentIndex.value = 0;
  }
}

function prevCard() {
  hasAnsweredCurrent.value = false;
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function changeLevel(lvl: 1 | 2 | 3) {
  activeLevel.value = lvl;
  currentIndex.value = 0;
  hasAnsweredCurrent.value = false;
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col items-center gap-4">
    
    <!-- Top Controls: Nút về sảnh & Chọn Level -->
    <div class="w-full flex items-center justify-between gap-2">
      <button
        @click="$emit('back-home')"
        class="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 font-black text-xs sm:text-sm border-2 border-slate-200 shadow-sm flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
      >
        <span>🏠</span>
        <span>Sảnh Game</span>
      </button>

      <!-- 3 Cấp độ đọc -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          v-for="lvl in ([1, 2, 3] as const)"
          :key="lvl"
          @click="changeLevel(lvl)"
          class="px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer"
          :class="activeLevel === lvl
            ? 'bg-purple-600 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900'"
        >
          Cấp {{ lvl }}
        </button>
      </div>
    </div>

    <!-- Thẻ Flashcard Đọc Trơn Lớn -->
    <div
      class="w-full min-h-[300px] sm:min-h-[340px] rounded-[36px] bg-gradient-to-br p-6 sm:p-8 shadow-2xl border-4 border-white flex flex-col items-center justify-between text-center relative select-none"
      :class="currentCard.theme"
    >
      <!-- Huy hiệu câu & Emoji -->
      <div class="w-full flex items-center justify-between">
        <span class="text-xs font-black px-3 py-1 rounded-full bg-white/80 text-slate-800 shadow-xs">
          Câu {{ currentIndex + 1 }}/{{ deck.length }}
        </span>
        <span class="text-4xl animate-bounce">
          {{ currentCard.emoji }}
        </span>
      </div>

      <!-- Nội dung câu đọc trơn cỡ lớn cho bé lớp 1 -->
      <div class="my-6">
        <h2
          class="text-3xl sm:text-5xl font-black leading-relaxed tracking-wide"
          :class="currentCard.textColor"
          :style="{ fontFamily: currentFont.family }"
        >
          {{ currentCard.text }}
        </h2>
        <p class="text-xs sm:text-sm font-bold text-slate-600/90 mt-3 bg-white/70 px-4 py-1.5 rounded-full inline-block">
          💡 {{ currentCard.guide }}
        </p>
      </div>

      <!-- Nút điều hướng trước/sau -->
      <div class="w-full flex items-center justify-between text-xs font-bold text-slate-500">
        <button @click="prevCard" :disabled="currentIndex === 0" class="hover:text-slate-800 disabled:opacity-30 cursor-pointer">
          ⬅️ Câu trước
        </button>
        <button @click="nextCard" class="hover:text-slate-800 cursor-pointer">
          Câu sau ➡️
        </button>
      </div>
    </div>

    <!-- Hàng nút hành động: Nhận sao hoặc Bỏ qua -->
    <div class="w-full flex items-center gap-3">
      <!-- Bỏ qua (-0.5 sao) -->
      <button
        @click="skipCard"
        :disabled="hasAnsweredCurrent"
        class="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs sm:text-sm border-2 border-slate-300 active:scale-95 transition disabled:opacity-50 cursor-pointer"
      >
        Bỏ qua (-½⭐)
      </button>

      <!-- Đọc Tốt (+1 hoặc +2 sao) -->
      <button
        @click="markSuccess"
        :disabled="hasAnsweredCurrent"
        class="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:opacity-95 text-white font-black text-sm sm:text-base shadow-xl border-2 border-white active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        <span>⭐</span>
        <span>Bé Đọc Xong (+{{ activeLevel === 3 ? 2 : 1 }} Sao)</span>
      </button>
    </div>

  </div>
</template>

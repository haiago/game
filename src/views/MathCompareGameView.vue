<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { generateCompareQuestions, type CompareQuestionItem } from '@/data/mathQuestions';
import { triggerStarBurstEffect } from '@/utils/particleEffects';
import { soundManager } from '@/audio/soundEffects';

defineEmits<{
  (e: 'back-home'): void;
}>();

const petStore = usePetStore();

const questions = ref<CompareQuestionItem[]>(generateCompareQuestions(10, 15));
const currentIndex = ref(0);
const selectedAnswer = ref<'>' | '<' | '=' | null>(null);
const isCorrect = ref<boolean | null>(null);

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

function chooseSign(sign: '>' | '<' | '=', event?: MouseEvent) {
  if (selectedAnswer.value !== null) return;
  selectedAnswer.value = sign;

  if (sign === currentQ.value.correctAnswer) {
    isCorrect.value = true;
    const targetEl = (event?.currentTarget as HTMLElement) || null;
    triggerStarBurstEffect(targetEl, 1);
    petStore.addStars(1);
    setTimeout(() => {
      nextQuestion();
    }, 1200);
  } else {
    isCorrect.value = false;
    soundManager.playSkip();
    setTimeout(() => {
      selectedAnswer.value = null;
      isCorrect.value = null;
    }, 1200);
  }
}

function nextQuestion() {
  selectedAnswer.value = null;
  isCorrect.value = null;
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  } else {
    questions.value = generateCompareQuestions(10, 15);
    currentIndex.value = 0;
  }
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center gap-5">
    
    <!-- Top Bar -->
    <div class="w-full flex items-center justify-between">
      <button
        @click="$emit('back-home')"
        class="px-3.5 py-2 rounded-2xl bg-white text-slate-700 font-black text-xs sm:text-sm border-2 border-slate-200 shadow-sm flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
      >
        <span>🏠</span>
        <span>Sảnh Game</span>
      </button>

      <span class="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
        Câu {{ currentIndex + 1 }}/{{ questions.length }}
      </span>
    </div>

    <!-- Khung So Sánh Cỡ Lớn -->
    <div class="w-full bg-white rounded-[36px] p-6 sm:p-8 shadow-xl border-4 border-emerald-300 flex flex-col items-center text-center gap-4">
      
      <span class="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
        Bé hãy chọn dấu thích hợp: &gt;, &lt; hoặc = (+1⭐)
      </span>

      <!-- 2 Bên Số / Phép Tính Cần So Sánh -->
      <div class="flex items-center justify-center gap-3 sm:gap-6 my-4 w-full">
        
        <!-- Bên Trái -->
        <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl bg-slate-100 border-3 border-slate-200 flex items-center justify-center text-2xl sm:text-4xl font-black font-baloo text-slate-800 shadow-inner">
          {{ currentQ.leftExpr }}
        </div>

        <!-- Ô Dấu Điền Ở Giữa -->
        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 border-3 border-dashed border-amber-400 flex items-center justify-center text-3xl sm:text-5xl font-black font-baloo text-amber-700 shadow-sm">
          {{ selectedAnswer || '?' }}
        </div>

        <!-- Bên Phải -->
        <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl bg-slate-100 border-3 border-slate-200 flex items-center justify-center text-2xl sm:text-4xl font-black font-baloo text-slate-800 shadow-inner">
          {{ currentQ.rightExpr }}
        </div>

      </div>

      <!-- Trợ giúp / Gợi ý -->
      <p class="text-xs font-bold text-slate-500">
        💡 Gợi ý: {{ currentQ.hint }}
      </p>

      <!-- Thông báo kết quả -->
      <div v-if="isCorrect === true" class="text-sm font-black text-emerald-600 animate-bounce">
        🌟 TUYỆT VỜI! BÉ ĐIỀN ĐÚNG RỒI! (+1 SAO)
      </div>
      <div v-else-if="isCorrect === false" class="text-sm font-black text-rose-500">
        ❌ Chưa đúng rồi, bé thử so sánh lại nha!
      </div>
    </div>

    <!-- 3 Nút Chọn Dấu: Lớn (>), Bằng (=), Bé (<) -->
    <div class="grid grid-cols-3 gap-3 w-full">
      
      <button
        @click="chooseSign('>', $event)"
        class="py-4 rounded-3xl font-black text-4xl sm:text-5xl font-baloo shadow-md border-3 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1"
        :class="[
          selectedAnswer === '>'
            ? (currentQ.correctAnswer === '>' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600')
            : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200 hover:border-emerald-400'
        ]"
      >
        <span>&gt;</span>
        <span class="text-xs font-bold font-sans">Lớn hơn</span>
      </button>

      <button
        @click="chooseSign('=', $event)"
        class="py-4 rounded-3xl font-black text-4xl sm:text-5xl font-baloo shadow-md border-3 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1"
        :class="[
          selectedAnswer === '='
            ? (currentQ.correctAnswer === '=' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600')
            : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200 hover:border-emerald-400'
        ]"
      >
        <span>=</span>
        <span class="text-xs font-bold font-sans">Bằng</span>
      </button>

      <button
        @click="chooseSign('<', $event)"
        class="py-4 rounded-3xl font-black text-4xl sm:text-5xl font-baloo shadow-md border-3 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1"
        :class="[
          selectedAnswer === '<'
            ? (currentQ.correctAnswer === '<' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600')
            : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200 hover:border-emerald-400'
        ]"
      >
        <span>&lt;</span>
        <span class="text-xs font-bold font-sans">Bé hơn</span>
      </button>

    </div>

  </div>
</template>

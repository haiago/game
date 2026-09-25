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
const isBroken = ref(false); // Khóa và vỡ đôi trong 2.5s

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

function chooseSign(sign: '>' | '<' | '=', event?: MouseEvent) {
  if (selectedAnswer.value !== null || isBroken.value) return;
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
    // Làm sai: khóa 2.5s, rung lắc nứt toác card và phát âm thanh rắc
    isCorrect.value = false;
    isBroken.value = true;
    soundManager.playWrongCrack();

    setTimeout(() => {
      selectedAnswer.value = null;
      isCorrect.value = null;
      isBroken.value = false;
    }, 2500);
  }
}

function nextQuestion() {
  selectedAnswer.value = null;
  isCorrect.value = null;
  isBroken.value = false;
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
    <div class="w-full flex items-center justify-between gap-2">
      <button
        @click="$emit('back-home')"
        :disabled="isBroken"
        class="px-3.5 py-2 rounded-2xl bg-white text-slate-700 font-black text-xs sm:text-sm border-2 border-slate-200 shadow-sm flex items-center gap-1.5 active:scale-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span>🏠</span>
        <span>Sảnh Game</span>
      </button>

      <div class="text-xs font-black px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-baloo shadow-xs flex items-center gap-1.5">
        <span>⚖️</span>
        <span>So Sánh (0 - 15)</span>
      </div>

      <span class="text-xs font-black px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
        Câu {{ currentIndex + 1 }}/{{ questions.length }}
      </span>
    </div>

    <!-- KHUNG SO SÁNH CỠ LỚN (Hỗ trợ vỡ đôi khi làm sai) -->
    <div class="w-full relative min-h-[300px] flex items-center justify-center">
      
      <!-- Card bình thường khi chưa vỡ -->
      <div
        v-if="!isBroken"
        class="w-full bg-white rounded-[36px] p-6 sm:p-8 shadow-xl border-4 flex flex-col items-center text-center gap-4 transition-all duration-300"
        :class="[
          isCorrect === true ? 'border-emerald-500 ring-4 ring-emerald-200 shadow-emerald-100' : 'border-emerald-300 shadow-emerald-50/50'
        ]"
      >
        <span class="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Bé hãy chọn dấu thích hợp: &gt;, &lt; hoặc = (+1⭐)
        </span>

        <!-- 2 Bên Số / Phép Tính Cần So Sánh -->
        <div class="flex items-center justify-center gap-3 sm:gap-6 my-4 w-full">
          <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl bg-slate-100 border-3 border-slate-200 flex items-center justify-center text-2xl sm:text-4xl font-black font-baloo text-slate-800 shadow-inner">
            {{ currentQ.leftExpr }}
          </div>

          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 border-3 border-dashed border-amber-400 flex items-center justify-center text-3xl sm:text-5xl font-black font-baloo text-amber-700 shadow-sm">
            {{ selectedAnswer || '?' }}
          </div>

          <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl bg-slate-100 border-3 border-slate-200 flex items-center justify-center text-2xl sm:text-4xl font-black font-baloo text-slate-800 shadow-inner">
            {{ currentQ.rightExpr }}
          </div>
        </div>

        <p class="text-xs font-bold text-slate-500">
          💡 Gợi ý: {{ currentQ.hint }}
        </p>

        <div v-if="isCorrect === true" class="text-sm font-black text-emerald-600 animate-bounce">
          🌟 TUYỆT VỜI! BÉ ĐIỀN ĐÚNG RỒI! (+1 SAO)
        </div>
      </div>

      <!-- Card khi LÀM SAI: Nứt vỡ đôi toác ra 2 bên kèm hiệu ứng khóa -->
      <div v-else class="w-full relative min-h-[300px] card-earthquake">
        
        <!-- Nửa Bên Trái Nứt Toác -->
        <div class="w-full bg-rose-50/90 rounded-[36px] p-6 sm:p-8 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-4 split-part-left pointer-events-none select-none">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>

          <div class="flex items-center justify-center gap-3 sm:gap-6 my-4 w-full filter blur-[0.4px]">
            <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl bg-rose-100/80 border-3 border-rose-300 flex items-center justify-center text-2xl sm:text-4xl font-black font-baloo text-rose-900">
              {{ currentQ.leftExpr }}
            </div>
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-200 border-3 border-rose-400 flex items-center justify-center text-3xl font-black font-baloo text-rose-800">
              ?
            </div>
            <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl bg-rose-100/80 border-3 border-rose-300 flex items-center justify-center text-2xl sm:text-4xl font-black font-baloo text-rose-900">
              {{ currentQ.rightExpr }}
            </div>
          </div>
          <div class="text-sm font-black text-rose-600">❌ Chưa đúng rồi!</div>
        </div>

        <!-- Nửa Bên Phải Nứt Toác -->
        <div class="w-full bg-rose-50/90 rounded-[36px] p-6 sm:p-8 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-4 split-part-right pointer-events-none select-none absolute inset-0">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>

          <div class="flex items-center justify-center gap-3 sm:gap-6 my-4 w-full filter blur-[0.4px]">
            <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl bg-rose-100/80 border-3 border-rose-300 flex items-center justify-center text-2xl sm:text-4xl font-black font-baloo text-rose-900">
              {{ currentQ.leftExpr }}
            </div>
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-200 border-3 border-rose-400 flex items-center justify-center text-3xl font-black font-baloo text-rose-800">
              ?
            </div>
            <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl bg-rose-100/80 border-3 border-rose-300 flex items-center justify-center text-2xl sm:text-4xl font-black font-baloo text-rose-900">
              {{ currentQ.rightExpr }}
            </div>
          </div>
          <div class="text-sm font-black text-rose-600">❌ Chưa đúng rồi!</div>
        </div>

        <!-- Biểu tượng nứt vỡ ở giữa -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div class="text-6xl animate-ping opacity-75 drop-shadow-lg">💥</div>
        </div>

      </div>

    </div>

    <!-- 3 Nút Chọn Dấu (Bị khóa khi làm sai) -->
    <div class="grid grid-cols-3 gap-3 w-full">
      
      <button
        @click="chooseSign('>', $event)"
        :disabled="isBroken || selectedAnswer !== null"
        class="py-4 rounded-3xl font-black text-4xl sm:text-5xl font-baloo shadow-md border-3 transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
        :class="[
          selectedAnswer === '>'
            ? (currentQ.correctAnswer === '>' ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300' : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300')
            : (isBroken ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50' : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200 hover:border-emerald-400 cursor-pointer')
        ]"
      >
        <span>&gt;</span>
        <span class="text-xs font-bold font-sans">Lớn hơn</span>
      </button>

      <button
        @click="chooseSign('=', $event)"
        :disabled="isBroken || selectedAnswer !== null"
        class="py-4 rounded-3xl font-black text-4xl sm:text-5xl font-baloo shadow-md border-3 transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
        :class="[
          selectedAnswer === '='
            ? (currentQ.correctAnswer === '=' ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300' : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300')
            : (isBroken ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50' : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200 hover:border-emerald-400 cursor-pointer')
        ]"
      >
        <span>=</span>
        <span class="text-xs font-bold font-sans">Bằng</span>
      </button>

      <button
        @click="chooseSign('<', $event)"
        :disabled="isBroken || selectedAnswer !== null"
        class="py-4 rounded-3xl font-black text-4xl sm:text-5xl font-baloo shadow-md border-3 transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
        :class="[
          selectedAnswer === '<'
            ? (currentQ.correctAnswer === '<' ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300' : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300')
            : (isBroken ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50' : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200 hover:border-emerald-400 cursor-pointer')
        ]"
      >
        <span>&lt;</span>
        <span class="text-xs font-bold font-sans">Bé hơn</span>
      </button>

    </div>

  </div>
</template>

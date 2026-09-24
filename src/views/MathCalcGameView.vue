<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { generateRandomMathQuestions, type MathQuestionItem } from '@/data/mathQuestions';
import { triggerStarBurstEffect } from '@/utils/particleEffects';
import { soundManager } from '@/audio/soundEffects';

defineEmits<{
  (e: 'back-home'): void;
}>();

const petStore = usePetStore();

const questions = ref<MathQuestionItem[]>(generateRandomMathQuestions(10, 10));
const currentIndex = ref(0);
const selectedAnswer = ref<number | string | null>(null);
const isCorrect = ref<boolean | null>(null);

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

function chooseOption(opt: number | string, event?: MouseEvent) {
  if (selectedAnswer.value !== null) return;
  selectedAnswer.value = opt;

  if (opt === currentQ.value.correctAnswer) {
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
    // Tạo bộ câu hỏi mới
    questions.value = generateRandomMathQuestions(10, 10);
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

      <span class="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
        Câu {{ currentIndex + 1 }}/{{ questions.length }}
      </span>
    </div>

    <!-- Khung Câu Hỏi Tính Toán Trực Quan -->
    <div class="w-full bg-white rounded-[36px] p-6 sm:p-8 shadow-xl border-4 border-amber-300 flex flex-col items-center text-center gap-4">
      
      <span class="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
        Bé hãy chọn kết quả đúng (+1⭐)
      </span>

      <!-- Phép tính to rõ -->
      <div class="text-4xl sm:text-6xl font-black font-baloo text-slate-800 tracking-wider my-2">
        {{ currentQ.num1 }} {{ currentQ.operator }} {{ currentQ.num2 }} = <span class="text-amber-500 font-black">?</span>
      </div>

      <!-- Mô hình đồ vật / quả táo đếm trực quan -->
      <div class="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-center gap-2 max-w-sm">
        <div class="flex flex-wrap gap-1 items-center justify-center">
          <span v-for="n in currentQ.num1" :key="'n1_'+n" class="text-2xl sm:text-3xl select-none hover:scale-110 transition-transform">
            {{ currentQ.hintEmoji }}
          </span>
        </div>
        <span class="text-xl font-black text-slate-400 font-baloo px-1">
          {{ currentQ.operator }}
        </span>
        <div class="flex flex-wrap gap-1 items-center justify-center">
          <span v-for="n in currentQ.num2" :key="'n2_'+n" class="text-2xl sm:text-3xl select-none hover:scale-110 transition-transform">
            {{ currentQ.hintEmoji }}
          </span>
        </div>
      </div>

      <!-- Thông báo kết quả -->
      <div v-if="isCorrect === true" class="text-sm font-black text-emerald-600 animate-bounce">
        🌟 CHÍNH XÁC! BÉ GIỎI QUÁ! (+1 SAO)
      </div>
      <div v-else-if="isCorrect === false" class="text-sm font-black text-rose-500">
        ❌ Chưa đúng rồi, bé đếm lại thử nha!
      </div>
    </div>

    <!-- 4 Lựa Chọn Đáp Án -->
    <div class="grid grid-cols-2 gap-3 w-full">
      <button
        v-for="opt in currentQ.options"
        :key="opt"
        @click="chooseOption(opt, $event)"
        class="py-4 rounded-3xl font-black text-2xl sm:text-3xl font-baloo shadow-md border-3 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
        :class="[
          selectedAnswer === opt
            ? (opt === currentQ.correctAnswer ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600')
            : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200 hover:border-amber-400'
        ]"
      >
        {{ opt }}
      </button>
    </div>

  </div>
</template>

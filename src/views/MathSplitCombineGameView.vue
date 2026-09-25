<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { generateSplitCombineQuestions, type SplitCombineQuestionItem } from '@/data/mathQuestions';
import { triggerStarBurstEffect } from '@/utils/particleEffects';
import { soundManager } from '@/audio/soundEffects';

defineEmits<{
  (e: 'back-home'): void;
}>();

const petStore = usePetStore();

const questions = ref<SplitCombineQuestionItem[]>(generateSplitCombineQuestions(10, 10));
const currentIndex = ref(0);
const selectedAnswer = ref<number | null>(null);
const isCorrect = ref<boolean | null>(null);
const isBroken = ref(false); // Khóa và vỡ đôi khi chọn sai

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

function chooseOption(opt: number, event?: MouseEvent) {
  if (selectedAnswer.value !== null || isBroken.value) return;
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
    // Làm sai: rung lắc nứt toác card và phát âm thanh
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
    questions.value = generateSplitCombineQuestions(10, 10);
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

      <div class="text-xs font-black px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 font-baloo shadow-xs flex items-center gap-1.5">
        <span>🌱</span>
        <span>Tách - Gộp Số</span>
      </div>

      <span class="text-xs font-black px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
        Câu {{ currentIndex + 1 }}/{{ questions.length }}
      </span>
    </div>

    <!-- KHUNG SƠ ĐỒ TÁCH GỘP (NUMBER BOND DIAGRAM) -->
    <div class="w-full relative min-h-[340px] flex items-center justify-center">
      
      <!-- Card bình thường khi chưa vỡ -->
      <div
        v-if="!isBroken"
        class="w-full bg-white rounded-[36px] p-5 sm:p-7 shadow-xl border-4 flex flex-col items-center text-center gap-3 transition-all duration-300"
        :class="[
          isCorrect === true ? 'border-emerald-500 ring-4 ring-emerald-200 shadow-emerald-100' : 'border-cyan-300 shadow-cyan-50/50'
        ]"
      >
        <!-- Tiêu đề câu hỏi thân thiện chuẩn SGK -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide"
             :class="currentQ.mode === 'combine' ? 'bg-indigo-50 text-indigo-700' : 'bg-pink-50 text-pink-700'">
          <span>{{ currentQ.mode === 'combine' ? '✨ BÀI TOÁN GỘP SỐ' : '🔍 BÀI TOÁN TÁCH SỐ' }}</span>
        </div>

        <h2 class="text-xl sm:text-2xl font-black font-baloo text-slate-800 tracking-wide mt-0.5">
          {{ currentQ.title }}
        </h2>

        <!-- SƠ ĐỒ TÁCH GỘP HÌNH CHỮ Y -->
        <div class="relative w-full max-w-xs flex flex-col items-center my-2 select-none">
          
          <!-- VÒNG TRÒN TỔNG (Ở TRÊN) -->
          <div class="relative z-10 flex flex-col items-center">
            <div
              class="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 shadow-lg flex flex-col items-center justify-center transition-all duration-300"
              :class="currentQ.missingSlot === 'total'
                ? (selectedAnswer !== null ? 'bg-amber-100 border-amber-500 text-amber-900' : 'bg-amber-50 border-dashed border-amber-400 text-amber-600 animate-pulse')
                : 'bg-gradient-to-b from-indigo-50 to-indigo-100 border-indigo-400 text-indigo-950'"
            >
              <span class="text-3xl sm:text-4xl font-black font-baloo">
                {{ currentQ.missingSlot === 'total' ? (selectedAnswer !== null ? selectedAnswer : '?') : currentQ.total }}
              </span>
            </div>
            <span class="text-[11px] font-black text-slate-500 mt-1 font-baloo">TỔNG</span>
          </div>

          <!-- ĐƯỜNG NỐI RẼ NHÁNH (SVG) -->
          <svg class="w-48 h-12 text-slate-300" viewBox="0 0 192 48" fill="none">
            <path d="M96 0 L40 48" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
            <path d="M96 0 L152 48" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
          </svg>

          <!-- 2 VÒNG TRÒN THÀNH PHẦN (Ở DƯỚI) -->
          <div class="w-full flex items-start justify-between px-2">
            
            <!-- Nhánh 1 -->
            <div class="flex flex-col items-center">
              <div
                class="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-3 shadow-md flex flex-col items-center justify-center transition-all"
                :class="currentQ.missingSlot === 'part1'
                  ? (selectedAnswer !== null ? 'bg-amber-100 border-amber-500 text-amber-900' : 'bg-amber-50 border-dashed border-amber-400 text-amber-600 animate-pulse')
                  : 'bg-gradient-to-b from-emerald-50 to-emerald-100 border-emerald-400 text-emerald-950'"
              >
                <span class="text-2xl sm:text-3xl font-black font-baloo">
                  {{ currentQ.missingSlot === 'part1' ? (selectedAnswer !== null ? selectedAnswer : '?') : currentQ.part1 }}
                </span>
              </div>
              <!-- Emoji đếm trực quan của nhánh 1 -->
              <div class="flex flex-wrap gap-0.5 justify-center max-w-[80px] mt-1">
                <span v-for="n in currentQ.part1" :key="'p1_'+n" class="text-sm">
                  {{ currentQ.emoji }}
                </span>
              </div>
            </div>

            <!-- Dấu cộng / gộp trang trí ở giữa 2 nhánh -->
            <div class="mt-4 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 font-black text-xs font-baloo">
              và
            </div>

            <!-- Nhánh 2 -->
            <div class="flex flex-col items-center">
              <div
                class="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-3 shadow-md flex flex-col items-center justify-center transition-all"
                :class="currentQ.missingSlot === 'part2'
                  ? (selectedAnswer !== null ? 'bg-amber-100 border-amber-500 text-amber-900' : 'bg-amber-50 border-dashed border-amber-400 text-amber-600 animate-pulse')
                  : 'bg-gradient-to-b from-purple-50 to-purple-100 border-purple-400 text-purple-950'"
              >
                <span class="text-2xl sm:text-3xl font-black font-baloo">
                  {{ currentQ.missingSlot === 'part2' ? (selectedAnswer !== null ? selectedAnswer : '?') : currentQ.part2 }}
                </span>
              </div>
              <!-- Emoji đếm trực quan của nhánh 2 -->
              <div class="flex flex-wrap gap-0.5 justify-center max-w-[80px] mt-1">
                <span v-for="n in currentQ.part2" :key="'p2_'+n" class="text-sm">
                  {{ currentQ.emoji }}
                </span>
              </div>
            </div>

          </div>

        </div>

        <!-- Thông báo hoặc Gợi ý nhẹ nhàng -->
        <div v-if="isCorrect === true" class="text-sm font-black text-emerald-600 animate-bounce">
          🌟 CHÍNH XÁC! BÉ TÁCH GỘP QUÁ SIÊU! (+1 SAO)
        </div>
        <p v-else class="text-xs font-bold text-slate-400">
          💡 {{ currentQ.hint }}
        </p>

      </div>

      <!-- Card khi bị LÀM SAI (Nứt đôi toác ra 2 nửa) -->
      <div v-else class="w-full relative min-h-[340px] card-earthquake">
        <div class="w-full bg-rose-50/90 rounded-[36px] p-5 sm:p-7 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-3 split-part-left pointer-events-none select-none">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-baloo text-rose-900">
            {{ currentQ.title }}
          </h2>
          <div class="text-4xl font-black font-baloo text-rose-600 my-4">❌ Chưa đúng rồi!</div>
        </div>

        <div class="w-full bg-rose-50/90 rounded-[36px] p-5 sm:p-7 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-3 split-part-right pointer-events-none select-none absolute inset-0">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-baloo text-rose-900">
            {{ currentQ.title }}
          </h2>
          <div class="text-4xl font-black font-baloo text-rose-600 my-4">❌ Chưa đúng rồi!</div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div class="text-6xl animate-ping opacity-75 drop-shadow-lg">💥</div>
        </div>
      </div>

    </div>

    <!-- 4 LỰA CHỌN ĐÁP ÁN BẤM CHỌN -->
    <div class="grid grid-cols-2 gap-3 w-full">
      <button
        v-for="opt in currentQ.options"
        :key="opt"
        @click="chooseOption(opt, $event)"
        :disabled="isBroken || selectedAnswer !== null"
        class="py-4 rounded-3xl font-black text-2xl sm:text-3xl font-baloo shadow-md border-3 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        :class="[
          selectedAnswer === opt
            ? (opt === currentQ.correctAnswer ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300' : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300')
            : (isBroken ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50' : 'bg-white hover:bg-cyan-50 text-slate-800 border-cyan-200 hover:border-cyan-400')
        ]"
      >
        {{ opt }}
      </button>
    </div>

  </div>
</template>

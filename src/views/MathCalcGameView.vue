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

const questions = ref<MathQuestionItem[]>(generateRandomMathQuestions(10, 15));
const currentIndex = ref(0);
const selectedAnswer = ref<number | string | null>(null);
const isCorrect = ref<boolean | null>(null);
const isBroken = ref(false); // Khóa và hiển thị hiệu ứng vỡ đôi trong 2.5s

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

function chooseOption(opt: number | string, event?: MouseEvent) {
  // Nếu đang khóa hoặc đã chọn đáp án -> cấm bấm
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
    // Làm sai: khóa toàn bộ thao tác 2.5s, phát tiếng rắc nứt vỡ và kích hoạt hiệu ứng nứt toác card
    isCorrect.value = false;
    isBroken.value = true;
    soundManager.playWrongCrack();

    setTimeout(() => {
      // Hồi phục sau 2.5s để bé tính lại
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
    // Tạo bộ câu hỏi mới
    questions.value = generateRandomMathQuestions(10, 15);
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

      <div class="text-xs font-black px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-baloo shadow-xs flex items-center gap-1.5">
        <span>✏️</span>
        <span>Bé Làm Toán (0 - 15)</span>
      </div>

      <span class="text-xs font-black px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
        Câu {{ currentIndex + 1 }}/{{ questions.length }}
      </span>
    </div>

    <!-- KHUNG CÂU HỎI TÍNH TOÁN TRỰC QUAN (Hỗ trợ vỡ đôi khi làm sai) -->
    <div class="w-full relative min-h-[300px] flex items-center justify-center">
      
      <!-- Card bình thường khi chưa vỡ -->
      <div
        v-if="!isBroken"
        class="w-full bg-white rounded-[36px] p-6 sm:p-8 shadow-xl border-4 flex flex-col items-center text-center gap-4 transition-all duration-300"
        :class="[
          isCorrect === true ? 'border-emerald-400 ring-4 ring-emerald-200 shadow-emerald-100' : 'border-amber-300 shadow-amber-50/50'
        ]"
      >
        <!-- Tiêu đề câu hỏi theo dạng -->
        <span
          class="text-xs font-black px-3.5 py-1 rounded-full font-baloo uppercase tracking-wider"
          :class="currentQ.targetSlot === 'operator' ? 'bg-purple-100 text-purple-800' : (currentQ.targetSlot === 'result' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800')"
        >
          <span v-if="currentQ.targetSlot === 'operator'">🔍 ĐIỀN DẤU + HOẶC -</span>
          <span v-else-if="currentQ.targetSlot === 'result'">🧮 TÍNH KẾT QUẢ</span>
          <span v-else>🧩 TÌM SỐ CÒN THIẾU</span>
        </span>

        <!-- Phép tính to rõ trực quan thích ứng theo từng ô trống cần tìm -->
        <div class="text-3xl sm:text-5xl font-black font-baloo text-slate-800 tracking-wider my-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          
          <!-- Số 1 -->
          <span
            v-if="currentQ.targetSlot === 'num1'"
            class="px-3 py-1 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-50 text-amber-600 animate-pulse min-w-[50px]"
          >
            {{ selectedAnswer !== null ? selectedAnswer : '?' }}
          </span>
          <span v-else class="text-slate-800">{{ currentQ.num1 }}</span>

          <!-- Dấu phép tính (+ / -) -->
          <span
            v-if="currentQ.targetSlot === 'operator'"
            class="px-3.5 py-1 rounded-2xl border-3 border-dashed border-purple-500 bg-purple-50 text-purple-700 animate-pulse min-w-[50px]"
          >
            {{ selectedAnswer !== null ? selectedAnswer : '?' }}
          </span>
          <span v-else class="text-amber-600 px-1">{{ currentQ.operator }}</span>

          <!-- Số 2 -->
          <span
            v-if="currentQ.targetSlot === 'num2'"
            class="px-3 py-1 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-50 text-amber-600 animate-pulse min-w-[50px]"
          >
            {{ selectedAnswer !== null ? selectedAnswer : '?' }}
          </span>
          <span v-else class="text-slate-800">{{ currentQ.num2 }}</span>

          <span class="text-slate-400">=</span>

          <!-- Kết quả -->
          <span
            v-if="currentQ.targetSlot === 'result'"
            class="px-3 py-1 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-50 text-amber-600 animate-pulse min-w-[50px]"
          >
            {{ selectedAnswer !== null ? selectedAnswer : '?' }}
          </span>
          <span v-else class="text-emerald-700 font-black">{{ currentQ.result }}</span>
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

        <!-- Thông báo kết quả đúng -->
        <div v-if="isCorrect === true" class="text-sm font-black text-emerald-600 animate-bounce">
          🌟 CHÍNH XÁC! BÉ GIỎI QUÁ! (+1 SAO)
        </div>
      </div>

      <!-- Card khi bị LÀM SAI: Nứt đôi toác ra 2 nửa kèm vết nứt và tia sét đỏ -->
      <div v-else class="w-full relative min-h-[300px] card-earthquake">
        
        <!-- Nửa Bên Trái Bị Nứt Toác -->
        <div class="w-full bg-rose-50/90 rounded-[36px] p-6 sm:p-8 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-4 split-part-left pointer-events-none select-none">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>

          <div class="text-3xl sm:text-5xl font-black font-baloo text-rose-900 tracking-wider my-2 filter blur-[0.4px]">
            {{ currentQ.title }}
          </div>

          <div class="text-sm font-black text-rose-600">❌ Chưa đúng rồi bé ơi!</div>
        </div>

        <!-- Nửa Bên Phải Bị Nứt Toác (Lồng đè đối xứng qua clip-path) -->
        <div class="w-full bg-rose-50/90 rounded-[36px] p-6 sm:p-8 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-4 split-part-right pointer-events-none select-none absolute inset-0">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>

          <div class="text-3xl sm:text-5xl font-black font-baloo text-rose-900 tracking-wider my-2 filter blur-[0.4px]">
            {{ currentQ.title }}
          </div>

          <div class="text-sm font-black text-rose-600">❌ Chưa đúng rồi bé ơi!</div>
        </div>

        <!-- Biểu tượng nứt vỡ ở giữa -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div class="text-6xl animate-ping opacity-75 drop-shadow-lg">💥</div>
        </div>

      </div>

    </div>

    <!-- Lựa Chọn Đáp Án (2 nút nếu chọn dấu +/-, hoặc 4 nút nếu chọn số) -->
    <div
      class="w-full"
      :class="currentQ.options.length === 2 ? 'grid grid-cols-2 gap-4 max-w-sm mx-auto' : 'grid grid-cols-2 gap-3'"
    >
      <button
        v-for="opt in currentQ.options"
        :key="opt"
        @click="chooseOption(opt, $event)"
        :disabled="isBroken || selectedAnswer !== null"
        class="py-4 rounded-3xl font-black text-2xl sm:text-4xl font-baloo shadow-md border-3 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        :class="[
          selectedAnswer === opt
            ? (opt === currentQ.correctAnswer ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300' : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300')
            : (isBroken ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50' : (currentQ.targetSlot === 'operator' ? 'bg-white hover:bg-purple-50 text-purple-950 border-purple-300 hover:border-purple-500 hover:scale-105' : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200 hover:border-amber-400 hover:scale-105'))
        ]"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { generateRandomMathQuestions, type MathQuestionItem } from '@/data/mathQuestions';
import { triggerStarBurstEffect } from '@/utils/particleEffects';
import { soundManager } from '@/audio/soundEffects';

defineEmits<{
  (e: 'back-home'): void;
}>();

const petStore = usePetStore();

const questions = ref<MathQuestionItem[]>(generateRandomMathQuestions(10, 20));
const currentIndex = ref(0);
const selectedAnswer = ref<number | string | null>(null);
const isCorrect = ref<boolean | null>(null);
const isBroken = ref(false); // Khóa và hiển thị hiệu ứng vỡ đôi trong 2.5s

// Bộ đếm ngược 30 giây gay cấn
const timeLeft = ref(30);
let timerInterval: any = null;

function startTimer() {
  stopTimer();
  timeLeft.value = 30;
  timerInterval = setInterval(() => {
    // Không đếm khi đang bị khóa nứt vỡ hoặc đã chọn đáp án
    if (isBroken.value || selectedAnswer.value !== null) return;

    if (timeLeft.value > 1) {
      timeLeft.value--;
      // Tiếng gõ kim đồng hồ táp táp nhẹ, dưới 10s sẽ dồn dập gay cấn hơn
      soundManager.playTick(timeLeft.value <= 10);
    } else {
      // Hết giờ!
      timeLeft.value = 0;
      stopTimer();
      handleTimeOut();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function handleTimeOut() {
  isCorrect.value = false;
  isBroken.value = true;
  soundManager.playTimeout();

  setTimeout(() => {
    selectedAnswer.value = null;
    isCorrect.value = null;
    isBroken.value = false;
    startTimer();
  }, 2500);
}

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

// Class viền card phát sáng gay cấn theo thời gian đếm ngược
const timerGlowClass = computed(() => {
  if (timeLeft.value <= 10) return 'timer-glow-urgent border-rose-500';
  if (timeLeft.value <= 20) return 'timer-glow-warning border-amber-500';
  return 'timer-glow-safe border-amber-300';
});

function chooseOption(opt: number | string, event?: MouseEvent) {
  // Nếu đang khóa hoặc đã chọn đáp án -> cấm bấm
  if (selectedAnswer.value !== null || isBroken.value) return;
  selectedAnswer.value = opt;

  if (opt === currentQ.value.correctAnswer) {
    isCorrect.value = true;
    stopTimer();
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
    questions.value = generateRandomMathQuestions(10, 20);
    currentIndex.value = 0;
  }
  startTimer();
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

      <!-- Đồng hồ đếm ngược 30 giây gay cấn -->
      <div
        class="px-3.5 py-1.5 rounded-2xl font-black text-sm flex items-center gap-1.5 shadow-sm transition-all"
        :class="timeLeft <= 10 ? 'bg-rose-500 text-white animate-pulse shadow-rose-300 ring-2 ring-rose-400' : (timeLeft <= 20 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-white text-slate-700 border border-slate-200')"
      >
        <span class="text-base">⏱️</span>
        <span class="font-mono text-base font-black">{{ timeLeft }}s</span>
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
          isCorrect === true ? 'border-emerald-400 ring-4 ring-emerald-200' : timerGlowClass
        ]"
      >
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

          <div class="text-4xl sm:text-6xl font-black font-baloo text-rose-900 tracking-wider my-2 filter blur-[0.4px]">
            {{ currentQ.num1 }} {{ currentQ.operator }} {{ currentQ.num2 }} = <span class="text-rose-500 font-black">?</span>
          </div>

          <div class="p-3 bg-rose-100/70 rounded-2xl border border-rose-300 flex flex-wrap items-center justify-center gap-2 max-w-sm">
            <div class="flex flex-wrap gap-1 items-center justify-center opacity-70">
              <span v-for="n in currentQ.num1" :key="'n1b_'+n" class="text-2xl sm:text-3xl">
                {{ currentQ.hintEmoji }}
              </span>
            </div>
            <span class="text-xl font-black text-rose-400 font-baloo px-1">{{ currentQ.operator }}</span>
            <div class="flex flex-wrap gap-1 items-center justify-center opacity-70">
              <span v-for="n in currentQ.num2" :key="'n2b_'+n" class="text-2xl sm:text-3xl">
                {{ currentQ.hintEmoji }}
              </span>
            </div>
          </div>
          <div class="text-sm font-black text-rose-600">❌ Chưa đúng rồi!</div>
        </div>

        <!-- Nửa Bên Phải Bị Nứt Toác (Lồng đè đối xứng qua clip-path) -->
        <div class="w-full bg-rose-50/90 rounded-[36px] p-6 sm:p-8 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-4 split-part-right pointer-events-none select-none absolute inset-0">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>

          <div class="text-4xl sm:text-6xl font-black font-baloo text-rose-900 tracking-wider my-2 filter blur-[0.4px]">
            {{ currentQ.num1 }} {{ currentQ.operator }} {{ currentQ.num2 }} = <span class="text-rose-500 font-black">?</span>
          </div>

          <div class="p-3 bg-rose-100/70 rounded-2xl border border-rose-300 flex flex-wrap items-center justify-center gap-2 max-w-sm">
            <div class="flex flex-wrap gap-1 items-center justify-center opacity-70">
              <span v-for="n in currentQ.num1" :key="'n1c_'+n" class="text-2xl sm:text-3xl">
                {{ currentQ.hintEmoji }}
              </span>
            </div>
            <span class="text-xl font-black text-rose-400 font-baloo px-1">{{ currentQ.operator }}</span>
            <div class="flex flex-wrap gap-1 items-center justify-center opacity-70">
              <span v-for="n in currentQ.num2" :key="'n2c_'+n" class="text-2xl sm:text-3xl">
                {{ currentQ.hintEmoji }}
              </span>
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

    <!-- 4 Lựa Chọn Đáp Án (Bị vô hiệu hóa hoàn toàn khi đang vỡ card) -->
    <div class="grid grid-cols-2 gap-3 w-full">
      <button
        v-for="opt in currentQ.options"
        :key="opt"
        @click="chooseOption(opt, $event)"
        :disabled="isBroken || selectedAnswer !== null"
        class="py-4 rounded-3xl font-black text-2xl sm:text-3xl font-baloo shadow-md border-3 transition-all active:scale-95 flex items-center justify-center"
        :class="[
          selectedAnswer === opt
            ? (opt === currentQ.correctAnswer ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300' : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300')
            : (isBroken ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50' : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200 hover:border-amber-400 cursor-pointer')
        ]"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { generatePatternQuestions, type PatternQuestionItem } from '@/data/mathQuestions';
import { triggerStarBurstEffect } from '@/utils/particleEffects';
import { soundManager } from '@/audio/soundEffects';

defineEmits<{
  (e: 'back-home'): void;
}>();

const petStore = usePetStore();

const questions = ref<PatternQuestionItem[]>(generatePatternQuestions(12, 20));
const currentIndex = ref(0);
const selectedAnswer = ref<number | null>(null);
const isCorrect = ref<boolean | null>(null);
const isBroken = ref(false);

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

function initQuestion() {
  selectedAnswer.value = null;
  isCorrect.value = null;
  isBroken.value = false;
}

watch(currentIndex, () => {
  initQuestion();
}, { immediate: true });

function handleSelectOption(num: number, event?: MouseEvent) {
  if (isBroken.value || isCorrect.value !== null) return;
  selectedAnswer.value = num;

  if (num === currentQ.value.correctAnswer) {
    isCorrect.value = true;
    const targetEl = (event?.currentTarget as HTMLElement) || null;
    triggerStarBurstEffect(targetEl, 1);
    petStore.addStars(1);
    soundManager.playCorrect();

    // Lời khen từ thú cưng
    petStore.triggerPetSpeech(`Đúng rồi bé ơi! ${currentQ.value.ruleExplanation} 💕`);

    setTimeout(() => {
      nextQuestion();
    }, 1800);
  } else {
    isCorrect.value = false;
    isBroken.value = true;
    soundManager.playWrongCrack();
    petStore.triggerPetSpeech('Chưa đúng rồi, bé hãy quan sát khoảng cách giữa các số nhé!');

    setTimeout(() => {
      selectedAnswer.value = null;
      isCorrect.value = null;
      isBroken.value = false;
    }, 2400);
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  } else {
    questions.value = generatePatternQuestions(12, 20);
    currentIndex.value = 0;
  }
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto px-3 sm:px-4 py-3 flex flex-col items-center gap-3 select-none">
    
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

      <div class="text-xs font-black px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 text-teal-900 border border-teal-300 font-baloo shadow-xs flex items-center gap-1.5">
        <span class="animate-bounce">
          {{ currentQ.theme === 'caterpillar' ? '🐛' : currentQ.theme === 'frog' ? '🐸' : '🔍' }}
        </span>
        <span>Quy Luật Dãy Số</span>
      </div>

      <span class="text-xs font-black px-3 py-1.5 rounded-full bg-white text-teal-900 border border-teal-200 shadow-xs">
        Câu {{ currentIndex + 1 }}/{{ questions.length }}
      </span>
    </div>

    <!-- KHUNG TRÒ CHƠI CHÍNH -->
    <div class="w-full relative min-h-[380px] flex items-center justify-center">
      
      <!-- Card bình thường -->
      <div
        v-if="!isBroken"
        class="w-full bg-white/95 backdrop-blur-md rounded-[32px] sm:rounded-[36px] p-4 sm:p-6 shadow-2xl border-4 flex flex-col items-center text-center gap-3 transition-all duration-300 relative overflow-hidden"
        :class="[
          isCorrect === true ? 'border-emerald-500 ring-4 ring-emerald-200 shadow-emerald-100' : 'border-teal-300 shadow-teal-50'
        ]"
      >
        <!-- Huy hiệu dạng chủ đề -->
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shadow-xs bg-teal-50 text-teal-900 border border-teal-200">
          <span>{{ currentQ.theme === 'caterpillar' ? '🐛 Chú Sâu Thông Thái' : currentQ.theme === 'frog' ? '🐸 Ếch Nhảy Bờ Đầm' : '🔍 Thám Tử Tìm Số Bí Ẩn' }}</span>
        </div>

        <h2 class="text-lg sm:text-xl font-black font-baloo text-slate-800 leading-tight">
          Bé hãy tìm số còn thiếu ở dấu [ ? ] nhé!
        </h2>
        <p class="text-xs font-bold text-slate-500 max-w-sm">
          Quan sát xem các số tăng lên hay giảm đi theo quy luật nào nha!
        </p>

        <!-- ==========================================
             CHỦ ĐỀ 1: CHÚ SÂU THÔNG THÁI 🐛 (Caterpillar)
             ========================================== -->
        <div
          v-if="currentQ.theme === 'caterpillar'"
          class="w-full bg-gradient-to-r from-lime-100 via-emerald-100 to-green-100 p-3 sm:p-4 rounded-3xl border-2 border-emerald-300 my-1 relative shadow-inner flex flex-col items-center"
        >
          <div class="flex items-center justify-center gap-1 sm:gap-2 relative z-10 py-2">
            <!-- Đầu chú sâu ngộ nghĩnh có râu nhấp nhô -->
            <div class="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-amber-400 to-orange-400 border-3 border-emerald-600 shadow-md flex flex-col items-center justify-center relative shrink-0">
              <span class="text-xl sm:text-2xl animate-pulse">😊</span>
              <div class="absolute -top-3 flex gap-2 text-xs">
                <span class="animate-bounce">✨</span>
                <span class="animate-bounce delay-150">✨</span>
              </div>
            </div>

            <!-- Các đốt thân của chú sâu mang số -->
            <template v-for="(num, sIdx) in currentQ.sequence" :key="'cat_' + sIdx">
              <div
                class="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-3 flex items-center justify-center font-black font-baloo shadow-md transition-all relative shrink-0"
                :class="[
                  num !== null
                    ? 'bg-gradient-to-b from-lime-300 to-emerald-400 border-emerald-600 text-emerald-950 text-xl sm:text-2xl hover:scale-105'
                    : isCorrect
                      ? 'bg-gradient-to-b from-amber-300 to-amber-400 border-amber-500 text-amber-950 text-xl sm:text-2xl scale-110'
                      : 'bg-white border-dashed border-rose-400 text-rose-500 animate-pulse text-2xl'
                ]"
              >
                <span v-if="num !== null">{{ num }}</span>
                <span v-else-if="isCorrect">{{ selectedAnswer }}</span>
                <span v-else>?</span>

                <!-- Đôi chân nhỏ xíu của đốt sâu -->
                <div class="absolute -bottom-1.5 flex gap-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-800"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-800"></div>
                </div>
              </div>
            </template>
          </div>

          <!-- Nền lá cỏ bên dưới -->
          <div class="w-full flex items-center justify-between text-xs opacity-75 mt-1 px-2 pointer-events-none">
            <span>🌿 Lá non ngon lành</span>
            <span class="text-[11px] font-bold text-emerald-800">{{ currentQ.ruleName }}</span>
          </div>
        </div>

        <!-- ==========================================
             CHỦ ĐỀ 2: ẾCH NHẢY LÁ SEN 🐸 (Frog on Lilypads)
             ========================================== -->
        <div
          v-else-if="currentQ.theme === 'frog'"
          class="w-full bg-gradient-to-r from-sky-100 via-teal-100 to-emerald-100 p-3 sm:p-4 rounded-3xl border-2 border-teal-300 my-1 relative shadow-inner flex flex-col items-center overflow-hidden"
        >
          <!-- Mặt nước gợn sóng và lá sen -->
          <div class="flex items-center justify-center gap-1.5 sm:gap-2.5 relative z-10 py-2">
            <template v-for="(num, sIdx) in currentQ.sequence" :key="'frog_' + sIdx">
              <!-- Bụi lá sen / Đá nổi mang số -->
              <div class="flex flex-col items-center relative">
                <!-- Chú ếch đang đậu trên lá sen có số hoặc nhảy tới -->
                <div
                  v-if="sIdx === currentQ.missingIndex - 1 || (currentQ.missingIndex === 0 && sIdx === 0)"
                  class="text-xl sm:text-2xl absolute -top-5 animate-bounce z-20"
                >
                  🐸
                </div>
                <div
                  v-else-if="isCorrect && sIdx === currentQ.missingIndex"
                  class="text-xl sm:text-2xl absolute -top-5 animate-bounce z-20"
                >
                  🐸
                </div>

                <div
                  class="w-12 h-12 sm:w-15 sm:h-15 rounded-2xl sm:rounded-3xl border-3 flex items-center justify-center font-black font-baloo shadow-md transition-all relative shrink-0"
                  :class="[
                    num !== null
                      ? 'bg-gradient-to-b from-teal-300 to-emerald-500 border-emerald-700 text-emerald-950 text-xl sm:text-2xl'
                      : isCorrect
                        ? 'bg-gradient-to-b from-amber-300 to-amber-400 border-amber-600 text-amber-950 text-xl sm:text-2xl scale-110'
                        : 'bg-white/90 border-dashed border-teal-500 text-teal-600 animate-pulse text-2xl'
                  ]"
                >
                  <span v-if="num !== null">{{ num }}</span>
                  <span v-else-if="isCorrect">{{ selectedAnswer }}</span>
                  <span v-else>?</span>
                </div>
                
                <span class="text-[9px] font-black text-teal-800 font-baloo mt-1">Lá {{ sIdx + 1 }}</span>
              </div>

              <!-- Mũi tên bước nhảy của ếch -->
              <div v-if="sIdx < 4" class="text-xs text-teal-600 font-black mb-4 select-none">
                🐾
              </div>
            </template>
          </div>

          <div class="w-full flex items-center justify-between text-xs opacity-75 mt-1 px-2 pointer-events-none">
            <span>🌊 Đầm sen số học</span>
            <span class="text-[11px] font-bold text-teal-900">{{ currentQ.ruleName }}</span>
          </div>
        </div>

        <!-- ==========================================
             CHỦ ĐỀ 3: THÁM TỬ TÌM SỐ BÍ ẨN 🔍 (Detective)
             ========================================== -->
        <div
          v-else
          class="w-full bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 p-3 sm:p-4 rounded-3xl border-2 border-amber-300 my-1 relative shadow-inner flex flex-col items-center"
        >
          <div class="flex items-center justify-center gap-1.5 sm:gap-2.5 relative z-10 py-2">
            <template v-for="(num, sIdx) in currentQ.sequence" :key="'det_' + sIdx">
              <div class="flex flex-col items-center">
                <!-- Hòm rương kho báu mật mã -->
                <div
                  class="w-12 h-13 sm:w-15 sm:h-16 rounded-2xl border-3 flex flex-col items-center justify-center font-black font-baloo shadow-md transition-all relative shrink-0"
                  :class="[
                    num !== null
                      ? 'bg-gradient-to-b from-amber-300 via-orange-300 to-amber-400 border-amber-600 text-amber-950 text-xl sm:text-2xl'
                      : isCorrect
                        ? 'bg-gradient-to-b from-emerald-300 to-emerald-400 border-emerald-600 text-emerald-950 text-xl sm:text-2xl scale-110'
                        : 'bg-white border-dashed border-amber-500 text-amber-600 animate-pulse text-2xl'
                  ]"
                >
                  <span v-if="num !== null">{{ num }}</span>
                  <span v-else-if="isCorrect">{{ selectedAnswer }}</span>
                  <div v-else class="flex flex-col items-center">
                    <span class="text-sm">🔍</span>
                    <span class="text-base font-black">?</span>
                  </div>
                </div>

                <span class="text-[9px] font-black text-amber-900 font-baloo mt-1">Khóa {{ sIdx + 1 }}</span>
              </div>

              <!-- Móc nối mật mã -->
              <div v-if="sIdx < 4" class="text-xs text-amber-500 font-black mb-4 select-none">
                🔑
              </div>
            </template>
          </div>

          <div class="w-full flex items-center justify-between text-xs opacity-75 mt-1 px-2 pointer-events-none">
            <span>🕵️ Mật mã kho báu</span>
            <span class="text-[11px] font-bold text-amber-900">{{ currentQ.ruleName }}</span>
          </div>
        </div>

        <!-- 4 LỰA CHỌN ĐÁP ÁN ĐỂ BÉ BẤM CHỌN -->
        <div class="w-full flex flex-col items-center gap-2 mt-2">
          <span class="text-xs font-black text-slate-600 font-baloo">
            👇 Bé hãy chọn số thích hợp để điền vào dấu [ ? ]:
          </span>

          <div class="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-md">
            <button
              v-for="opt in currentQ.options"
              :key="'opt_' + opt"
              @click="handleSelectOption(opt, $event)"
              :disabled="isBroken || isCorrect !== null"
              class="h-14 sm:h-16 rounded-2xl border-3 font-black text-2xl sm:text-3xl font-baloo shadow-md active:scale-95 transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center disabled:cursor-not-allowed"
              :class="[
                selectedAnswer === opt
                  ? opt === currentQ.correctAnswer
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-200'
                    : 'bg-rose-500 border-rose-600 text-white'
                  : 'bg-white hover:bg-slate-50 border-teal-300 hover:border-teal-500 text-slate-800'
              ]"
            >
              {{ opt }}
            </button>
          </div>
        </div>

        <!-- Thông báo chúc mừng khi bé tìm đúng quy luật -->
        <div v-if="isCorrect === true" class="text-xs sm:text-sm font-black text-emerald-600 animate-bounce mt-1 flex items-center gap-1.5">
          <span>🌟 CHÍNH XÁC! {{ currentQ.ruleExplanation }} (+1 SAO) ✨</span>
        </div>
      </div>

      <!-- Card khi bị LÀM SAI (Nứt vỡ) -->
      <div v-else class="w-full relative min-h-[350px] card-earthquake">
        <div class="w-full bg-rose-50/90 rounded-[36px] p-5 sm:p-7 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-3 split-part-left pointer-events-none select-none">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-baloo text-rose-900">
            Quy Luật Dãy Số
          </h2>
          <div class="text-3xl sm:text-4xl font-black font-baloo text-rose-600 my-4">❌ Số này chưa đúng quy luật rồi bé ơi!</div>
        </div>

        <div class="w-full bg-rose-50/90 rounded-[36px] p-5 sm:p-7 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-3 split-part-right pointer-events-none select-none absolute inset-0">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-baloo text-rose-900">
            Quy Luật Dãy Số
          </h2>
          <div class="text-3xl sm:text-4xl font-black font-baloo text-rose-600 my-4">❌ Số này chưa đúng quy luật rồi bé ơi!</div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div class="text-6xl animate-ping opacity-75 drop-shadow-lg">💥</div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { generateOrderQuestions, type OrderQuestionItem } from '@/data/mathQuestions';
import { triggerStarBurstEffect } from '@/utils/particleEffects';
import { soundManager } from '@/audio/soundEffects';

defineEmits<{
  (e: 'back-home'): void;
}>();

const petStore = usePetStore();

const questions = ref<OrderQuestionItem[]>(generateOrderQuestions(10, 15));
const currentIndex = ref(0);
const isCorrect = ref<boolean | null>(null);
const isBroken = ref(false);

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

// Các số còn lại ở kho chờ xếp
const availableNumbers = ref<number[]>([]);
// Các số đã được đưa vào đường ray tàu hỏa
const placedSlots = ref<(number | null)[]>([null, null, null, null]);

// Drag and drop state
const draggedNumber = ref<number | null>(null);

function initCurrentQuestion() {
  availableNumbers.value = [...currentQ.value.numbers];
  placedSlots.value = [null, null, null, null];
  isCorrect.value = null;
  isBroken.value = false;
}

watch(currentIndex, () => {
  initCurrentQuestion();
}, { immediate: true });

// Khi bấm vào 1 số ở kho -> tự động nhảy vào ô trống đầu tiên của đoàn tàu
function pickNumber(num: number) {
  if (isBroken.value || isCorrect.value) return;
  const emptyIdx = placedSlots.value.findIndex(s => s === null);
  if (emptyIdx === -1) return;

  const idxInAvail = availableNumbers.value.indexOf(num);
  if (idxInAvail !== -1) {
    availableNumbers.value.splice(idxInAvail, 1);
    placedSlots.value[emptyIdx] = num;
    soundManager.playTap();
  }
}

// Bấm vào toa tàu đã xếp -> trả số về kho
function unpickSlot(slotIdx: number) {
  if (isBroken.value || isCorrect.value) return;
  const num = placedSlots.value[slotIdx];
  if (num !== null) {
    placedSlots.value[slotIdx] = null;
    availableNumbers.value.push(num);
    soundManager.playTap();
  }
}

// HTML5 Drag & Drop handlers
function onDragStart(num: number) {
  if (isBroken.value || isCorrect.value) return;
  draggedNumber.value = num;
}

function onDropSlot(slotIdx: number) {
  if (isBroken.value || isCorrect.value || draggedNumber.value === null) return;
  const num = draggedNumber.value;
  draggedNumber.value = null;

  // Nếu ô này đã có số, trả số cũ về kho
  if (placedSlots.value[slotIdx] !== null) {
    availableNumbers.value.push(placedSlots.value[slotIdx]!);
  }

  // Bỏ số mới khỏi kho
  const idx = availableNumbers.value.indexOf(num);
  if (idx !== -1) {
    availableNumbers.value.splice(idx, 1);
  }

  placedSlots.value[slotIdx] = num;
  soundManager.playTap();
}

function onDropToAvailable() {
  if (draggedNumber.value === null) return;
  draggedNumber.value = null;
}

// Kiểm tra khi bé xếp xong cả 4 toa
function checkResult(event?: MouseEvent) {
  if (isBroken.value || isCorrect.value) return;
  if (placedSlots.value.some(s => s === null)) {
    petStore.triggerPetSpeech('Bé hãy xếp đủ cả 4 toa tàu số nhé! 💕');
    return;
  }

  const userArr = placedSlots.value as number[];
  const targetArr = currentQ.value.correctOrder;

  const isMatched = userArr.every((val, idx) => val === targetArr[idx]);

  if (isMatched) {
    isCorrect.value = true;
    const targetEl = (event?.currentTarget as HTMLElement) || null;
    triggerStarBurstEffect(targetEl, 1);
    petStore.addStars(1);
    soundManager.playCorrect();

    setTimeout(() => {
      nextQuestion();
    }, 1400);
  } else {
    isCorrect.value = false;
    isBroken.value = true;
    soundManager.playWrongCrack();

    setTimeout(() => {
      // Hồi phục lại các số để bé xếp lại
      initCurrentQuestion();
    }, 2400);
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  } else {
    questions.value = generateOrderQuestions(10, 15);
    currentIndex.value = 0;
  }
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center gap-4">
    
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

      <div class="text-xs font-black px-3.5 py-1.5 rounded-full bg-violet-100 text-violet-900 border border-violet-300 font-baloo shadow-xs flex items-center gap-1.5">
        <span>🚂</span>
        <span>Sắp Xếp Thứ Tự Số</span>
      </div>

      <span class="text-xs font-black px-3 py-1.5 rounded-full bg-violet-100 text-violet-900 border border-violet-300">
        Câu {{ currentIndex + 1 }}/{{ questions.length }}
      </span>
    </div>

    <!-- KHUNG ĐOÀN TÀU SẮP XẾP SỐ -->
    <div class="w-full relative min-h-[350px] flex items-center justify-center">
      
      <!-- Card bình thường khi chưa vỡ -->
      <div
        v-if="!isBroken"
        class="w-full bg-white rounded-[36px] p-4 sm:p-6 shadow-xl border-4 flex flex-col items-center text-center gap-3 transition-all duration-300"
        :class="[
          isCorrect === true ? 'border-emerald-500 ring-4 ring-emerald-200 shadow-emerald-100' : 'border-violet-300 shadow-violet-50/50'
        ]"
      >
        <!-- Tiêu đề thứ tự yêu cầu -->
        <div
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide"
          :class="currentQ.orderType === 'asc' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'"
        >
          <span>{{ currentQ.orderType === 'asc' ? '📈 TĂNG DẦN' : '📉 GIẢM DẦN' }}</span>
        </div>

        <h2 class="text-lg sm:text-xl font-black font-baloo text-violet-950">
          {{ currentQ.title }}
        </h2>
        <p class="text-xs font-bold text-slate-500 max-w-sm">
          {{ currentQ.instruction }}
        </p>

        <!-- ĐOÀN TÀU HỎA CÁC TOA CHỜ XẾP (ĐƯỜNG RAY) -->
        <div class="w-full bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 p-3 sm:p-4 rounded-3xl border-2 border-violet-200 my-1 relative shadow-inner">
          
          <!-- Đầu tàu hỏa ngộ nghĩnh -->
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-xs font-black text-violet-800 font-baloo flex items-center gap-1">
              <span>{{ currentQ.icon }}</span> Đoàn tàu số học
            </span>
            <span class="text-[11px] font-bold text-slate-400">Chạm toa để gỡ số ra</span>
          </div>

          <!-- 4 Toa tàu nhận số (Hỗ trợ kéo thả hoặc click) -->
          <div class="grid grid-cols-4 gap-2 sm:gap-3 relative z-10">
            <div
              v-for="(slot, sIdx) in placedSlots"
              :key="'slot_' + sIdx"
              @click="unpickSlot(sIdx)"
              @dragover.prevent
              @drop="onDropSlot(sIdx)"
              class="h-20 sm:h-24 rounded-2xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer relative"
              :class="slot !== null
                ? 'bg-gradient-to-b from-amber-300 to-amber-400 border-amber-500 text-amber-950 shadow-md transform hover:scale-105 active:scale-95'
                : 'bg-white/80 border-dashed border-violet-300 text-slate-300 hover:border-violet-400 hover:bg-white'"
            >
              <!-- Thứ tự toa -->
              <span class="text-[9px] font-black absolute top-1 left-2 font-baloo opacity-60">
                Toa {{ sIdx + 1 }}
              </span>

              <span v-if="slot !== null" class="text-3xl sm:text-4xl font-black font-baloo animate-in zoom-in-75 duration-150">
                {{ slot }}
              </span>
              <span v-else class="text-2xl opacity-40">
                📥
              </span>

              <!-- Bánh xe toa tàu phía dưới -->
              <div class="absolute -bottom-2 flex gap-3">
                <div class="w-3 h-3 rounded-full bg-slate-700 border border-slate-300"></div>
                <div class="w-3 h-3 rounded-full bg-slate-700 border border-slate-300"></div>
              </div>
            </div>
          </div>

          <!-- Thanh ray tàu hỏa trang trí -->
          <div class="w-full h-1.5 bg-slate-300 rounded-full mt-3 flex justify-around"></div>
        </div>

        <!-- CÁC TOA SỐ ĐANG CHỜ Ở DƯỚI (KHO SỐ) -->
        <div class="w-full flex flex-col items-center gap-2 mt-1">
          <span class="text-xs font-black text-slate-600 font-baloo">
            {{ availableNumbers.length > 0 ? '👇 Chạm hoặc kéo các số vào toa:' : '✅ Bé đã xếp đủ toa, bấm nút kiểm tra nào!' }}
          </span>

          <div
            class="flex items-center justify-center gap-2.5 sm:gap-4 min-h-[64px]"
            @dragover.prevent
            @drop="onDropToAvailable"
          >
            <div
              v-for="num in availableNumbers"
              :key="'avail_' + num"
              draggable="true"
              @dragstart="onDragStart(num)"
              @click="pickNumber(num)"
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-3 border-violet-400 hover:border-violet-600 text-violet-950 font-black text-2xl sm:text-3xl font-baloo shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition transform"
            >
              {{ num }}
            </div>
          </div>
        </div>

        <!-- Thông báo đúng -->
        <div v-if="isCorrect === true" class="text-sm font-black text-emerald-600 animate-bounce mt-1">
          🌟 CHÍNH XÁC! ĐOÀN TÀU CHẠY THẬT ĐÚNG THỨ TỰ! (+1 SAO)
        </div>
      </div>

      <!-- Card khi bị LÀM SAI (Nứt đôi toác ra 2 nửa) -->
      <div v-else class="w-full relative min-h-[350px] card-earthquake">
        <div class="w-full bg-rose-50/90 rounded-[36px] p-5 sm:p-7 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-3 split-part-left pointer-events-none select-none">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-baloo text-rose-900">
            {{ currentQ.title }}
          </h2>
          <div class="text-4xl font-black font-baloo text-rose-600 my-4">❌ Thứ tự chưa đúng rồi bé ơi!</div>
        </div>

        <div class="w-full bg-rose-50/90 rounded-[36px] p-5 sm:p-7 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-3 split-part-right pointer-events-none select-none absolute inset-0">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-baloo text-rose-900">
            {{ currentQ.title }}
          </h2>
          <div class="text-4xl font-black font-baloo text-rose-600 my-4">❌ Thứ tự chưa đúng rồi bé ơi!</div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div class="text-6xl animate-ping opacity-75 drop-shadow-lg">💥</div>
        </div>
      </div>

    </div>

    <!-- Nút KIỂM TRA ĐÁP ÁN HOẶC ĐỔI CÂU -->
    <div class="w-full flex items-center justify-center gap-3">
      <button
        @click="checkResult($event)"
        :disabled="isBroken || isCorrect === true || placedSlots.some(s => s === null)"
        class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-black text-base font-baloo shadow-lg active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
      >
        <span>🚂</span>
        <span>Kiểm Tra Thứ Tự Tàu Chạy 🚀</span>
      </button>
    </div>

  </div>
</template>

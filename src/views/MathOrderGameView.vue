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
const isTrainDeparting = ref(false);
const isTrainArriving = ref(false);

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
  isTrainDeparting.value = false;
  isTrainArriving.value = true;
  setTimeout(() => {
    isTrainArriving.value = false;
  }, 600);
}

watch(currentIndex, () => {
  initCurrentQuestion();
}, { immediate: true });

// Khi bấm vào 1 số ở kho -> tự động nhảy vào ô trống đầu tiên của đoàn tàu
function pickNumber(num: number) {
  if (isBroken.value || isCorrect.value || isTrainDeparting.value) return;
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
  if (isBroken.value || isCorrect.value || isTrainDeparting.value) return;
  const num = placedSlots.value[slotIdx];
  if (num !== null) {
    placedSlots.value[slotIdx] = null;
    availableNumbers.value.push(num);
    soundManager.playTap();
  }
}

// HTML5 Drag & Drop handlers
function onDragStart(num: number) {
  if (isBroken.value || isCorrect.value || isTrainDeparting.value) return;
  draggedNumber.value = num;
}

function onDropSlot(slotIdx: number) {
  if (isBroken.value || isCorrect.value || isTrainDeparting.value || draggedNumber.value === null) return;
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

// Màu sắc tươi sáng ngộ nghĩnh cho từng toa tàu
const carColors = [
  { bg: 'from-amber-300 via-amber-400 to-orange-400', border: 'border-amber-500', roof: 'bg-amber-600', text: 'text-amber-950', badge: 'bg-amber-100 text-amber-900' },
  { bg: 'from-sky-300 via-sky-400 to-blue-400', border: 'border-sky-500', roof: 'bg-sky-600', text: 'text-sky-950', badge: 'bg-sky-100 text-sky-900' },
  { bg: 'from-emerald-300 via-emerald-400 to-teal-400', border: 'border-emerald-500', roof: 'bg-emerald-600', text: 'text-emerald-950', badge: 'bg-emerald-100 text-emerald-900' },
  { bg: 'from-pink-300 via-pink-400 to-rose-400', border: 'border-pink-500', roof: 'bg-pink-600', text: 'text-pink-950', badge: 'bg-pink-100 text-pink-900' },
];

// Kiểm tra khi bé xếp xong cả 4 toa
function checkResult(event?: MouseEvent) {
  if (isBroken.value || isCorrect.value || isTrainDeparting.value) return;
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
    
    // Phát tiếng còi tàu "Tu tu... xình xịch!" + nhạc chúc mừng
    soundManager.playTrainWhistle();
    soundManager.playCorrect();

    // Bắt đầu hiệu ứng tàu tăng tốc xình xịch lăn bánh qua màn hình
    setTimeout(() => {
      isTrainDeparting.value = true;
    }, 450);

    setTimeout(() => {
      nextQuestion();
    }, 2200);
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
  <div class="w-full max-w-xl mx-auto px-3 sm:px-4 py-3 flex flex-col items-center gap-3 select-none">
    
    <!-- Top Bar -->
    <div class="w-full flex items-center justify-between gap-2">
      <button
        @click="$emit('back-home')"
        :disabled="isBroken || isTrainDeparting"
        class="px-3.5 py-2 rounded-2xl bg-white text-slate-700 font-black text-xs sm:text-sm border-2 border-slate-200 shadow-sm flex items-center gap-1.5 active:scale-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span>🏠</span>
        <span>Sảnh Game</span>
      </button>

      <div class="text-xs font-black px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-900 border border-violet-300 font-baloo shadow-xs flex items-center gap-1.5">
        <span class="animate-pulse">🚂</span>
        <span>Đoàn Tàu Số Học</span>
      </div>

      <span class="text-xs font-black px-3 py-1.5 rounded-full bg-white text-violet-900 border border-violet-200 shadow-xs">
        Câu {{ currentIndex + 1 }}/{{ questions.length }}
      </span>
    </div>

    <!-- KHUNG ĐOÀN TÀU SẮP XẾP SỐ -->
    <div class="w-full relative min-h-[390px] flex items-center justify-center">
      
      <!-- Card bình thường khi chưa vỡ -->
      <div
        v-if="!isBroken"
        class="w-full bg-white/95 backdrop-blur-md rounded-[32px] sm:rounded-[36px] p-3.5 sm:p-5 shadow-2xl border-4 flex flex-col items-center text-center gap-2.5 transition-all duration-300 relative overflow-hidden"
        :class="[
          isCorrect === true ? 'border-emerald-500 ring-4 ring-emerald-200 shadow-emerald-100' : 'border-violet-300 shadow-violet-100'
        ]"
      >
        <!-- Bầu trời nhỏ xinh với mây trôi nhẹ -->
        <div class="absolute top-2 left-3 text-lg opacity-40 animate-pulse pointer-events-none">☁️</div>
        <div class="absolute top-3 right-4 text-sm opacity-35 animate-pulse delay-500 pointer-events-none">☁️</div>

        <!-- Tiêu đề thứ tự yêu cầu -->
        <div
          class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shadow-xs"
          :class="currentQ.orderType === 'asc' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'"
        >
          <span>{{ currentQ.orderType === 'asc' ? '📈 SẮP XẾP: TĂNG DẦN (Bé đến Lớn)' : '📉 SẮP XẾP: GIẢM DẦN (Lớn đến Bé)' }}</span>
        </div>

        <h2 class="text-lg sm:text-xl font-black font-baloo text-violet-950 leading-tight">
          {{ currentQ.title }}
        </h2>
        <p class="text-xs font-bold text-slate-500 max-w-sm">
          {{ currentQ.instruction }}
        </p>

        <!-- SÂN GA & ĐƯỜNG RAY XE LỬA -->
        <div class="w-full bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 p-2.5 sm:p-3.5 rounded-3xl border-2 border-indigo-200 my-1 relative shadow-inner overflow-hidden">
          
          <!-- Hàng cây hoa và đồi cỏ phía sau đoàn tàu -->
          <div class="flex items-center justify-between px-2 mb-1 pointer-events-none opacity-80">
            <span class="text-xs font-black text-indigo-900 font-baloo flex items-center gap-1">
              <span>🚉 Ga Số Học</span>
              <span class="text-[10px] text-slate-500 font-normal">・Chạm toa để gỡ số</span>
            </span>
            <div class="flex gap-2 text-xs">
              <span>🌳</span>
              <span>🌻</span>
              <span>🌲</span>
            </div>
          </div>

          <!-- ĐOÀN TÀU HOÀN CHỈNH (ĐẦU TÀU + 4 TOA SỐ) -->
          <div
            class="relative py-1 transition-transform"
            :class="{
              'train-chugging': !isTrainDeparting && !isTrainArriving,
              'train-depart-run': isTrainDeparting,
              'train-arrive-slide': isTrainArriving
            }"
          >
            <!-- Khói hơi nước bốc lên từ ống khói đầu tàu -->
            <div class="absolute -top-3 left-4 sm:left-6 flex items-center gap-1 z-20 pointer-events-none">
              <span class="steam-puff puff-1">☁️</span>
              <span class="steam-puff puff-2">💨</span>
              <span class="steam-puff puff-3">☁️</span>
            </div>

            <div class="flex items-end justify-center gap-1 sm:gap-2">
              
              <!-- 🚂 ĐẦU TÀU HƠI NƯỚC (LOCOMOTIVE) -->
              <div class="flex flex-col items-center flex-shrink-0 relative">
                <!-- Thân đầu tàu hoạt hình rực rỡ -->
                <div class="w-14 sm:w-16 h-20 sm:h-24 rounded-2xl bg-gradient-to-b from-rose-500 via-red-500 to-amber-600 border-2 sm:border-3 border-red-700 shadow-md flex flex-col items-center justify-between p-1.5 relative">
                  <!-- Đèn pha tàu hỏa phát sáng vàng -->
                  <div class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-yellow-300 border-2 border-amber-500 shadow-lg shadow-yellow-300/80 animate-pulse flex items-center justify-center text-[8px]">
                    ✨
                  </div>

                  <!-- Cửa sổ cabin người lái tàu -->
                  <div class="w-9 sm:w-11 h-7 sm:h-8 rounded-xl bg-sky-200 border-2 border-sky-400 flex items-center justify-center text-base sm:text-lg shadow-inner">
                    🐱
                  </div>

                  <!-- Mác đầu tàu -->
                  <div class="text-[9px] font-black text-yellow-200 font-baloo tracking-tight">
                    NO.1
                  </div>
                </div>

                <!-- Bánh xe đầu tàu (Bánh lớn quay tròn) -->
                <div class="flex items-center gap-1 -mt-2.5 z-10">
                  <div
                    class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 border-2 border-yellow-400 flex items-center justify-center shadow"
                    :class="{ 'train-wheel-spin': isTrainDeparting }"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <div
                    class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 border-2 border-yellow-400 flex items-center justify-center shadow"
                    :class="{ 'train-wheel-spin': isTrainDeparting }"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>

              <!-- Móc nối xích giữa đầu tàu và toa 1 -->
              <div class="text-xs text-slate-400 font-black mb-4 select-none">🔗</div>

              <!-- 🚃 4 TOA CHỞ SỐ (TOA 1 ĐẾN TOA 4) -->
              <template v-for="(slot, sIdx) in placedSlots" :key="'slot_' + sIdx">
                <!-- Toa tàu -->
                <div
                  @click="unpickSlot(sIdx)"
                  @dragover.prevent
                  @drop="onDropSlot(sIdx)"
                  class="flex-1 max-w-[80px] sm:max-w-[95px] flex flex-col items-center cursor-pointer group"
                >
                  <!-- Thùng toa tàu -->
                  <div
                    class="w-full h-20 sm:h-24 rounded-2xl border-2 sm:border-3 flex flex-col items-center justify-between p-1.5 transition-all relative shadow-md"
                    :class="[
                      slot !== null
                        ? `bg-gradient-to-b ${carColors[sIdx].bg} ${carColors[sIdx].border} ${carColors[sIdx].text} transform group-hover:-translate-y-1`
                        : 'bg-white/85 border-dashed border-violet-300 text-slate-300 hover:border-violet-400 hover:bg-white'
                    ]"
                  >
                    <!-- Mái / Nhãn toa -->
                    <div class="w-full flex items-center justify-between px-1">
                      <span
                        class="text-[9px] font-black font-baloo px-1.5 py-0.5 rounded-md shadow-2xs"
                        :class="slot !== null ? carColors[sIdx].badge : 'bg-slate-100 text-slate-500'"
                      >
                        Toa {{ sIdx + 1 }}
                      </span>
                      <span v-if="slot !== null" class="text-[9px] opacity-70">📦</span>
                    </div>

                    <!-- Số hiển thị trong toa -->
                    <div class="flex-1 flex items-center justify-center">
                      <span
                        v-if="slot !== null"
                        class="text-2xl sm:text-3xl font-black font-baloo drop-shadow-sm animate-in zoom-in-75 duration-150"
                      >
                        {{ slot }}
                      </span>
                      <div v-else class="flex flex-col items-center justify-center text-slate-300 opacity-60">
                        <span class="text-xl">📥</span>
                        <span class="text-[8px] font-bold">Thả số</span>
                      </div>
                    </div>

                    <!-- Thanh trang trí hông toa -->
                    <div
                      class="w-full h-1 rounded-full"
                      :class="slot !== null ? 'bg-black/10' : 'bg-slate-200'"
                    ></div>
                  </div>

                  <!-- 2 Bánh xe của toa tàu (Quay tít khi tàu chạy) -->
                  <div class="flex items-center gap-3 -mt-2.5 z-10">
                    <div
                      class="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-800 border-2 border-slate-300 flex items-center justify-center shadow-sm"
                      :class="{ 'train-wheel-spin': isTrainDeparting }"
                    >
                      <div class="w-1 h-1 rounded-full bg-amber-300"></div>
                    </div>
                    <div
                      class="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-800 border-2 border-slate-300 flex items-center justify-center shadow-sm"
                      :class="{ 'train-wheel-spin': isTrainDeparting }"
                    >
                      <div class="w-1 h-1 rounded-full bg-amber-300"></div>
                    </div>
                  </div>
                </div>

                <!-- Móc xích nối giữa các toa -->
                <div v-if="sIdx < 3" class="text-[10px] text-slate-400 font-black mb-4 select-none">🔗</div>
              </template>

            </div>
          </div>

          <!-- ĐƯỜNG RAY XE LỬA VỚI CÁC THANH TÀ VẸT GỖ -->
          <div class="w-full relative mt-2 pt-1 flex flex-col items-center">
            <!-- Ray trên & Tà vẹt gỗ -->
            <div class="w-full h-2.5 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-full shadow-inner relative flex items-center justify-around px-2 overflow-hidden">
              <span v-for="t in 16" :key="'tie_' + t" class="w-1.5 h-full bg-amber-800/60 block"></span>
            </div>
            <!-- Nền đá ba-lát (ballast) dưới đường ray -->
            <div class="w-full h-2 bg-gradient-to-r from-amber-200/50 via-slate-200 to-amber-200/50 rounded-b-lg"></div>
          </div>
        </div>

        <!-- CÁC TOA SỐ ĐANG CHỜ Ở DƯỚI (KHO SỐ) -->
        <div class="w-full flex flex-col items-center gap-2 mt-1">
          <span class="text-xs font-black text-slate-600 font-baloo flex items-center gap-1">
            <span>{{ availableNumbers.length > 0 ? '👇 Chạm hoặc kéo các số vào toa tàu:' : '✅ Đã đủ 4 toa! Bấm nút bên dưới để tàu xuất phát nào:' }}</span>
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
              class="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-white to-amber-50 border-3 border-amber-400 hover:border-amber-500 text-violet-950 font-black text-2xl sm:text-3xl font-baloo shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition transform"
            >
              {{ num }}
            </div>
          </div>
        </div>

        <!-- Thông báo đoàn tàu lăn bánh -->
        <div v-if="isCorrect === true" class="text-xs sm:text-sm font-black text-emerald-600 animate-bounce mt-0.5 flex items-center gap-1.5">
          <span>🎉 TU TU XÌNH XỊCH! ĐOÀN TÀU CHẠY ĐÚNG THỨ TỰ RỒI! (+1 SAO) 🚂✨</span>
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
          <div class="text-3xl sm:text-4xl font-black font-baloo text-rose-600 my-4">❌ Thứ tự chưa đúng rồi bé ơi!</div>
        </div>

        <div class="w-full bg-rose-50/90 rounded-[36px] p-5 sm:p-7 shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center gap-3 split-part-right pointer-events-none select-none absolute inset-0">
          <span class="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            💔 ĐÃ BỊ NỨT VỠ RỒI!
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-baloo text-rose-900">
            {{ currentQ.title }}
          </h2>
          <div class="text-3xl sm:text-4xl font-black font-baloo text-rose-600 my-4">❌ Thứ tự chưa đúng rồi bé ơi!</div>
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
        :disabled="isBroken || isCorrect === true || isTrainDeparting || placedSlots.some(s => s === null)"
        class="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-black text-base sm:text-lg font-baloo shadow-lg hover:shadow-xl active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
      >
        <span class="text-xl" :class="{ 'animate-bounce': !placedSlots.some(s => s === null) }">🚂</span>
        <span>Kiểm Tra Thứ Tự Tàu Chạy 🚀</span>
      </button>
    </div>

  </div>
</template>

<style scoped>
/* Nhún nhảy xình xịch nhẹ nhàng khi đang ở ga */
@keyframes trainChug {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.train-chugging {
  animation: trainChug 0.7s infinite ease-in-out;
}

/* Đoàn tàu lướt chạy qua màn hình khi đúng */
@keyframes trainDepart {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-15px); /* Tàu lùi nhẹ lấy đà */
  }
  100% {
    transform: translateX(130%); /* Vọt qua bên phải khỏi màn hình */
  }
}

.train-depart-run {
  animation: trainDepart 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Đoàn tàu mới trôi từ bên trái vào ga */
@keyframes trainArrive {
  0% {
    transform: translateX(-120%);
    opacity: 0.5;
  }
  80% {
    transform: translateX(8px);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.train-arrive-slide {
  animation: trainArrive 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Bánh xe quay tít khi lăn bánh */
@keyframes wheelSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(720deg);
  }
}

.train-wheel-spin {
  animation: wheelSpin 1.4s linear infinite;
}

/* Khói hơi nước bay bồng bềnh */
@keyframes steamPuff1 {
  0% {
    transform: translate(0, 0) scale(0.6);
    opacity: 0.8;
  }
  50% {
    transform: translate(-10px, -12px) scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: translate(-20px, -24px) scale(1.5);
    opacity: 0;
  }
}

@keyframes steamPuff2 {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0.9;
  }
  50% {
    transform: translate(-8px, -15px) scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: translate(-16px, -28px) scale(1.6);
    opacity: 0;
  }
}

.puff-1 {
  animation: steamPuff1 1.8s infinite ease-out;
}

.puff-2 {
  animation: steamPuff2 1.8s infinite ease-out 0.6s;
}

.puff-3 {
  animation: steamPuff1 1.8s infinite ease-out 1.2s;
}
</style>


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
const showOptions = ref(false); // Ẩn đáp án ban đầu để bé suy nghĩ trước, bấm vào ô ? mới mở

function revealOptions() {
  if (showOptions.value || isBroken.value) return;
  showOptions.value = true;
  soundManager.playTap();
}

const currentQ = computed(() => questions.value[currentIndex.value] || questions.value[0]);

// Dữ liệu cho sơ đồ Tách - Gộp (Number Bond) chuẩn SGK Tiểu học (Không emoji)
const bondData = computed(() => {
  const q = currentQ.value;
  if (!q) {
    return {
      whole: { value: 0, isMissing: false },
      part1: { value: 0, isMissing: false },
      part2: { value: 0, isMissing: false },
      relationLabel: ''
    };
  }

  const isOpMissing = q.targetSlot === 'operator';

  if (q.operator === '+') {
    // Phép cộng: num1 + num2 = result -> Vòng trên là Tất cả/Gộp lại
    return {
      whole: {
        value: q.result,
        isMissing: q.targetSlot === 'result'
      },
      part1: {
        value: q.num1,
        isMissing: q.targetSlot === 'num1'
      },
      part2: {
        value: q.num2,
        isMissing: q.targetSlot === 'num2'
      },
      relationLabel: isOpMissing ? '?' : 'Gộp (+)'
    };
  } else {
    // Phép trừ: num1 - num2 = result -> Vòng trên là "Có tất cả / Ban đầu", tách thành "Bớt đi" (num2) và "Còn lại" (result)
    return {
      whole: {
        value: q.num1,
        isMissing: q.targetSlot === 'num1'
      },
      part1: {
        value: q.num2,
        isMissing: q.targetSlot === 'num2'
      },
      part2: {
        value: q.result,
        isMissing: q.targetSlot === 'result'
      },
      relationLabel: isOpMissing ? '?' : 'Bớt (-)'
    };
  }
});

// Dữ liệu cho bài toán Làm Tròn 10 (Make a Ten) cho phép cộng qua 10 (vd: 9+6 => 9+(1+5) => 10+5)
const makeTenData = computed(() => {
  const q = currentQ.value;
  if (!q || q.operator !== '+') return null;

  // Áp dụng khi tổng qua 10 và có 1 số từ 6 đến 9
  const isN1Big = q.num1 >= q.num2;
  const big = isN1Big ? q.num1 : q.num2;
  const small = isN1Big ? q.num2 : q.num1;

  if (q.result > 10 && big >= 6 && big < 10) {
    const need = 10 - big;
    if (small > need) {
      const remain = small - need;
      return {
        big,
        small,
        need,
        remain,
        tenSum: 10,
        finalResult: q.result,
        isN1Big
      };
    }
  }
  return null;
});

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
  showOptions.value = false; // Reset ẩn đáp án để câu tiếp theo bé suy nghĩ trước
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
            @click="revealOptions"
            class="px-3.5 py-1 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-50 text-amber-600 min-w-[50px] cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
            :class="!showOptions && selectedAnswer === null ? 'animate-bounce ring-4 ring-amber-300 shadow-md' : 'animate-pulse'"
            title="Bé bấm để mở đáp án nhé"
          >
            {{ selectedAnswer !== null ? selectedAnswer : '?' }}
          </span>
          <span v-else class="text-slate-800">{{ currentQ.num1 }}</span>

          <!-- Dấu phép tính (+ / -) -->
          <span
            v-if="currentQ.targetSlot === 'operator'"
            @click="revealOptions"
            class="px-3.5 py-1 rounded-2xl border-3 border-dashed border-purple-500 bg-purple-50 text-purple-700 min-w-[50px] cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
            :class="!showOptions && selectedAnswer === null ? 'animate-bounce ring-4 ring-purple-300 shadow-md' : 'animate-pulse'"
            title="Bé bấm để mở đáp án nhé"
          >
            {{ selectedAnswer !== null ? selectedAnswer : '?' }}
          </span>
          <span v-else class="text-amber-600 px-1">{{ currentQ.operator }}</span>

          <!-- Số 2 -->
          <span
            v-if="currentQ.targetSlot === 'num2'"
            @click="revealOptions"
            class="px-3.5 py-1 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-50 text-amber-600 min-w-[50px] cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
            :class="!showOptions && selectedAnswer === null ? 'animate-bounce ring-4 ring-amber-300 shadow-md' : 'animate-pulse'"
            title="Bé bấm để mở đáp án nhé"
          >
            {{ selectedAnswer !== null ? selectedAnswer : '?' }}
          </span>
          <span v-else class="text-slate-800">{{ currentQ.num2 }}</span>

          <span class="text-slate-400">=</span>

          <!-- Kết quả -->
          <span
            v-if="currentQ.targetSlot === 'result'"
            @click="revealOptions"
            class="px-3.5 py-1 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-50 text-amber-600 min-w-[50px] cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
            :class="!showOptions && selectedAnswer === null ? 'animate-bounce ring-4 ring-amber-300 shadow-md' : 'animate-pulse'"
            title="Bé bấm để mở đáp án nhé"
          >
            {{ selectedAnswer !== null ? selectedAnswer : '?' }}
          </span>
          <span v-else class="text-emerald-700 font-black">{{ currentQ.result }}</span>
        </div>

        <!-- KHU VỰC SƠ ĐỒ TOÁN TRỰC QUAN (RỘNG THOÁNG, KHÔNG BỊ SÁT NHAU) -->

        <!-- 1. DẠNG PHÉP TRỪ: SƠ ĐỒ TÁCH BỚT (Có tất cả -> Bớt đi & Còn lại) -->
        <div
          v-if="currentQ.operator === '-'"
          class="w-full max-w-sm sm:max-w-md p-4 bg-rose-50/40 rounded-3xl border-2 border-rose-200/80 flex flex-col items-center select-none shadow-xs"
        >
          <div class="text-[11px] font-black text-rose-600 font-baloo uppercase tracking-wider mb-1 flex items-center gap-1">
            <span>✂️</span> SƠ ĐỒ TÁCH BỚT (PHÉP TRỪ)
          </div>

          <svg class="w-full max-w-[350px] h-auto" viewBox="0 0 360 250" fill="none">
            <defs>
              <marker id="arrow-sub-left" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
              </marker>
              <marker id="arrow-sub-right" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>
            </defs>

            <!-- Nhãn CÓ TẤT CẢ đặt ở TRÊN CÙNG (tránh đè vào mũi tên phía dưới) -->
            <rect x="135" y="6" width="90" height="22" rx="11" fill="#ede9fe" />
            <text x="180" y="21" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="11" fill="#4338ca">
              CÓ TẤT CẢ
            </text>

            <!-- Vòng tròn CÓ TẤT CẢ (Ở Trên: X=180, Y=68, r=34) -->
            <g :class="bondData.whole.isMissing ? 'cursor-pointer hover:opacity-85' : ''" @click="bondData.whole.isMissing ? revealOptions() : null">
              <circle
                cx="180" cy="68" r="34"
                :fill="bondData.whole.isMissing ? (selectedAnswer !== null ? '#fef3c7' : '#fffbeb') : '#e0e7ff'"
                :stroke="bondData.whole.isMissing ? '#f59e0b' : '#6366f1'"
                :stroke-width="bondData.whole.isMissing ? 3.5 : 3"
                :stroke-dasharray="bondData.whole.isMissing && selectedAnswer === null ? '6 4' : 'none'"
              />
              <text x="180" y="78" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="30" :fill="bondData.whole.isMissing ? '#d97706' : '#312e81'">
                {{ bondData.whole.isMissing ? (selectedAnswer !== null ? selectedAnswer : '?') : bondData.whole.value }}
              </text>
            </g>

            <!-- Đường nối mũi tên Tách ra (Trái & Phải) thông thoáng, độ dài ~100px -->
            <path d="M 158 96 L 96 158" stroke="#f43f5e" stroke-width="3.5" stroke-linecap="round" marker-end="url(#arrow-sub-left)" />
            <path d="M 202 96 L 264 158" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" marker-end="url(#arrow-sub-right)" />

            <!-- Vòng tròn BỚT ĐI (Dưới Trái: X=75, Y=180, r=30) -->
            <g :class="bondData.part1.isMissing ? 'cursor-pointer hover:opacity-85' : ''" @click="bondData.part1.isMissing ? revealOptions() : null">
              <circle
                cx="75" cy="180" r="30"
                :fill="bondData.part1.isMissing ? (selectedAnswer !== null ? '#fef3c7' : '#fffbeb') : '#ffe4e6'"
                :stroke="bondData.part1.isMissing ? '#f59e0b' : '#f43f5e'"
                :stroke-width="bondData.part1.isMissing ? 3.5 : 3"
                :stroke-dasharray="bondData.part1.isMissing && selectedAnswer === null ? '6 4' : 'none'"
              />
              <text x="75" y="190" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="26" :fill="bondData.part1.isMissing ? '#d97706' : '#9f1239'">
                {{ bondData.part1.isMissing ? (selectedAnswer !== null ? selectedAnswer : '?') : bondData.part1.value }}
              </text>
              <!-- Badge dấu trừ '-' ở góc vòng tròn Bớt Đi -->
              <circle cx="53" cy="156" r="10" fill="#ffffff" stroke="#f43f5e" stroke-width="1.5" />
              <text x="53" y="160" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="13" fill="#f43f5e">-</text>
            </g>
            <text x="75" y="230" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#e11d48">
              BỚT ĐI
            </text>

            <!-- Badge ở giữa 2 nhánh (X=180, Y=180) -->
            <g :class="currentQ.targetSlot === 'operator' ? 'cursor-pointer hover:opacity-85' : ''" @click="currentQ.targetSlot === 'operator' ? revealOptions() : null">
              <rect
                x="144" y="165" width="72" height="30" rx="15"
                :fill="currentQ.targetSlot === 'operator' ? (selectedAnswer !== null ? '#ede9fe' : '#f5f3ff') : '#ffffff'"
                :stroke="currentQ.targetSlot === 'operator' ? '#8b5cf6' : '#fecdd3'"
                stroke-width="1.5"
                :stroke-dasharray="currentQ.targetSlot === 'operator' && selectedAnswer === null ? '4 3' : 'none'"
              />
              <text x="180" y="185" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" :fill="currentQ.targetSlot === 'operator' ? '#6d28d9' : '#be123c'">
                {{ currentQ.targetSlot === 'operator' ? (selectedAnswer !== null ? (selectedAnswer === '-' ? 'Bớt (-)' : 'Gộp (+)') : '?') : 'Bớt (-)' }}
              </text>
            </g>

            <!-- Vòng tròn CÒN LẠI (Dưới Phải: X=285, Y=180, r=30) -->
            <g :class="bondData.part2.isMissing ? 'cursor-pointer hover:opacity-85' : ''" @click="bondData.part2.isMissing ? revealOptions() : null">
              <circle
                cx="285" cy="180" r="30"
                :fill="bondData.part2.isMissing ? (selectedAnswer !== null ? '#fef3c7' : '#fffbeb') : '#d1fae5'"
                :stroke="bondData.part2.isMissing ? '#f59e0b' : '#10b981'"
                :stroke-width="bondData.part2.isMissing ? 3.5 : 3"
                :stroke-dasharray="bondData.part2.isMissing && selectedAnswer === null ? '6 4' : 'none'"
              />
              <text x="285" y="190" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="26" :fill="bondData.part2.isMissing ? '#d97706' : '#065f46'">
                {{ bondData.part2.isMissing ? (selectedAnswer !== null ? selectedAnswer : '?') : bondData.part2.value }}
              </text>
              <!-- Badge dấu bằng '=' ở góc vòng tròn Còn Lại -->
              <circle cx="307" cy="156" r="10" fill="#ffffff" stroke="#10b981" stroke-width="1.5" />
              <text x="307" y="160" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#10b981">=</text>
            </g>
            <text x="285" y="230" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#059669">
              CÒN LẠI
            </text>
          </svg>
        </div>

        <!-- 2. DẠNG PHÉP CỘNG QUA 10: SƠ ĐỒ TÁCH SỐ LÀM TRÒN 10 (Ví dụ 9+6 => 10+5) -->
        <div
          v-else-if="makeTenData"
          class="w-full max-w-sm sm:max-w-md p-4 bg-amber-50/50 rounded-3xl border-2 border-amber-200/90 flex flex-col items-center select-none shadow-xs"
        >
          <div class="text-[11px] font-black text-amber-800 font-baloo uppercase tracking-wider mb-1 flex items-center gap-1">
            <span>💡</span> TÁCH SỐ LÀM TRÒN 10
          </div>

          <!-- Sơ đồ SVG rộng rãi: Khi Số lớn ở bên trái (vd 9 + 6) -->
          <svg v-if="makeTenData.isN1Big" class="w-full max-w-[350px] h-auto" viewBox="0 0 360 250" fill="none">
            <!-- Nhãn trên cùng -->
            <rect x="42" y="10" width="86" height="22" rx="11" fill="#ede9fe" />
            <text x="85" y="25" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="11" fill="#4338ca">SỐ LỚN</text>

            <rect x="188" y="10" width="94" height="22" rx="11" fill="#fef3c7" />
            <text x="235" y="25" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="11" fill="#92400e">TÁCH SỐ BÉ</text>

            <!-- Số lớn (X=85, Y=75, r=30) -->
            <circle cx="85" cy="75" r="30" fill="#e0e7ff" stroke="#6366f1" stroke-width="3" />
            <text x="85" y="85" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="28" fill="#312e81">{{ makeTenData.big }}</text>

            <!-- Dấu '+' -->
            <text x="160" y="85" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="28" fill="#94a3b8">+</text>

            <!-- Số bé (X=235, Y=75, r=30) -->
            <circle cx="235" cy="75" r="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="3" />
            <text x="235" y="85" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="28" fill="#78350f">{{ makeTenData.small }}</text>

            <!-- Đường nối từ đáy Số bé (X=235, Y=105) tới 2 nhánh Bù 10 (X=180, Y=166) & Còn lại (X=290, Y=166) -->
            <path d="M 235 105 L 180 166" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" />
            <path d="M 235 105 L 290 166" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" />

            <!-- Cung nối mềm gộp 10 giữa Số lớn và Nhánh bù 10 -->
            <path d="M 85 105 C 85 170, 130 190, 156 190" stroke="#10b981" stroke-width="2.5" stroke-dasharray="5 4" stroke-linecap="round" fill="none" />
            <!-- Badge Gộp = 10 -->
            <rect x="88" y="145" width="68" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <text x="122" y="161" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="11" fill="#047857">Gộp = 10</text>

            <!-- Nhánh 1: Bù 10 (X=180, Y=190, r=24) -->
            <circle cx="180" cy="190" r="24" fill="#ecfdf5" stroke="#10b981" stroke-width="3" />
            <text x="180" y="198" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="22" fill="#065f46">{{ makeTenData.need }}</text>
            <text x="180" y="230" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#047857">BÙ 10</text>

            <!-- Nhánh 2: Còn lại (X=290, Y=190, r=24) -->
            <circle cx="290" cy="190" r="24" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="3" />
            <text x="290" y="198" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="22" fill="#0369a1">{{ makeTenData.remain }}</text>
            <text x="290" y="230" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#0284c7">CÒN LẠI</text>
          </svg>

          <!-- Sơ đồ SVG rộng rãi: Khi Số lớn ở bên phải (vd 5 + 8) -->
          <svg v-else class="w-full max-w-[350px] h-auto" viewBox="0 0 360 250" fill="none">
            <!-- Nhãn trên cùng -->
            <rect x="78" y="10" width="94" height="22" rx="11" fill="#fef3c7" />
            <text x="125" y="25" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="11" fill="#92400e">TÁCH SỐ BÉ</text>

            <rect x="232" y="10" width="86" height="22" rx="11" fill="#ede9fe" />
            <text x="275" y="25" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="11" fill="#4338ca">SỐ LỚN</text>

            <!-- Số bé (X=125, Y=75, r=30) -->
            <circle cx="125" cy="75" r="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="3" />
            <text x="125" y="85" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="28" fill="#78350f">{{ makeTenData.small }}</text>

            <!-- Dấu '+' -->
            <text x="200" y="85" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="28" fill="#94a3b8">+</text>

            <!-- Số lớn (X=275, Y=75, r=30) -->
            <circle cx="275" cy="75" r="30" fill="#e0e7ff" stroke="#6366f1" stroke-width="3" />
            <text x="275" y="85" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="28" fill="#312e81">{{ makeTenData.big }}</text>

            <!-- Đường nối từ đáy Số bé (X=125, Y=105) tới 2 nhánh Còn lại (X=70, Y=166) & Bù 10 (X=180, Y=166) -->
            <path d="M 125 105 L 70 166" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" />
            <path d="M 125 105 L 180 166" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" />

            <!-- Cung nối mềm gộp 10 giữa Nhánh bù 10 và Số lớn -->
            <path d="M 204 190 C 230 190, 275 170, 275 105" stroke="#10b981" stroke-width="2.5" stroke-dasharray="5 4" stroke-linecap="round" fill="none" />
            <!-- Badge Gộp = 10 -->
            <rect x="204" y="145" width="68" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <text x="238" y="161" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="11" fill="#047857">Gộp = 10</text>

            <!-- Nhánh 1: Còn lại (X=70, Y=190, r=24) -->
            <circle cx="70" cy="190" r="24" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="3" />
            <text x="70" y="198" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="22" fill="#0369a1">{{ makeTenData.remain }}</text>
            <text x="70" y="230" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#0284c7">CÒN LẠI</text>

            <!-- Nhánh 2: Bù 10 (X=180, Y=190, r=24) -->
            <circle cx="180" cy="190" r="24" fill="#ecfdf5" stroke="#10b981" stroke-width="3" />
            <text x="180" y="198" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="22" fill="#065f46">{{ makeTenData.need }}</text>
            <text x="180" y="230" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#047857">BÙ 10</text>
          </svg>

          <!-- Dòng nhẩm nhanh tròn 10 -->
          <div class="w-full flex items-center justify-center gap-1.5 pt-2 border-t border-amber-200/80 font-baloo">
            <span class="text-xs font-black text-slate-500">👉 Nhẩm:</span>
            <span class="px-2.5 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-sm">
              10
            </span>
            <span class="text-xs font-black text-slate-400">+</span>
            <span class="px-2.5 py-1 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 font-black text-sm">
              {{ makeTenData.remain }}
            </span>
            <span class="text-xs font-black text-slate-400">=</span>
            <span class="px-2.5 py-1 rounded-xl bg-amber-200 border border-amber-400 text-amber-950 font-black text-sm">
              {{ currentQ.targetSlot === 'result' ? (selectedAnswer !== null ? selectedAnswer : '?') : makeTenData.finalResult }}
            </span>
          </div>
        </div>

        <!-- 3. DẠNG PHÉP CỘNG THƯỜNG: SƠ ĐỒ GỘP SỐ (Phần 1 + Phần 2 -> Tất cả) -->
        <div
          v-else
          class="w-full max-w-sm sm:max-w-md p-4 bg-emerald-50/40 rounded-3xl border-2 border-emerald-200/80 flex flex-col items-center select-none shadow-xs"
        >
          <div class="text-[11px] font-black text-emerald-700 font-baloo uppercase tracking-wider mb-1 flex items-center gap-1">
            <span>🌱</span> SƠ ĐỒ GỘP SỐ (PHÉP CỘNG)
          </div>

          <svg class="w-full max-w-[350px] h-auto" viewBox="0 0 360 250" fill="none">
            <defs>
              <marker id="arrow-add-up-left" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>
              <marker id="arrow-add-up-right" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>
            </defs>

            <!-- Nhãn TẤT CẢ (Đặt trên đỉnh để không vướng mũi tên) -->
            <rect x="130" y="10" width="100" height="22" rx="11" fill="#d1fae5" />
            <text x="180" y="25" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="11" fill="#065f46">
              TẤT CẢ (GỘP)
            </text>

            <!-- Vòng tròn TẤT CẢ / GỘP LẠI (Ở Trên: X=180, Y=68, r=34) -->
            <g :class="bondData.whole.isMissing ? 'cursor-pointer hover:opacity-85' : ''" @click="bondData.whole.isMissing ? revealOptions() : null">
              <circle
                cx="180" cy="68" r="34"
                :fill="bondData.whole.isMissing ? (selectedAnswer !== null ? '#fef3c7' : '#fffbeb') : '#d1fae5'"
                :stroke="bondData.whole.isMissing ? '#f59e0b' : '#10b981'"
                :stroke-width="bondData.whole.isMissing ? 3.5 : 3"
                :stroke-dasharray="bondData.whole.isMissing && selectedAnswer === null ? '6 4' : 'none'"
              />
              <text x="180" y="78" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="30" :fill="bondData.whole.isMissing ? '#d97706' : '#065f46'">
                {{ bondData.whole.isMissing ? (selectedAnswer !== null ? selectedAnswer : '?') : bondData.whole.value }}
              </text>
            </g>

            <!-- Đường nối mũi tên Gộp vào (hướng lên đỉnh) -->
            <path d="M 96 158 L 158 96" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" marker-end="url(#arrow-add-up-left)" />
            <path d="M 264 158 L 202 96" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" marker-end="url(#arrow-add-up-right)" />

            <!-- Vòng tròn PHẦN 1 (Dưới Trái: X=75, Y=180, r=30) -->
            <g :class="bondData.part1.isMissing ? 'cursor-pointer hover:opacity-85' : ''" @click="bondData.part1.isMissing ? revealOptions() : null">
              <circle
                cx="75" cy="180" r="30"
                :fill="bondData.part1.isMissing ? (selectedAnswer !== null ? '#fef3c7' : '#fffbeb') : '#e0f2fe'"
                :stroke="bondData.part1.isMissing ? '#f59e0b' : '#38bdf8'"
                :stroke-width="bondData.part1.isMissing ? 3.5 : 3"
                :stroke-dasharray="bondData.part1.isMissing && selectedAnswer === null ? '6 4' : 'none'"
              />
              <text x="75" y="190" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="26" :fill="bondData.part1.isMissing ? '#d97706' : '#075985'">
                {{ bondData.part1.isMissing ? (selectedAnswer !== null ? selectedAnswer : '?') : bondData.part1.value }}
              </text>
            </g>
            <text x="75" y="230" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#0284c7">
              PHẦN 1
            </text>

            <!-- Badge ở giữa 2 nhánh (X=180, Y=180) -->
            <g :class="currentQ.targetSlot === 'operator' ? 'cursor-pointer hover:opacity-85' : ''" @click="currentQ.targetSlot === 'operator' ? revealOptions() : null">
              <rect
                x="144" y="165" width="72" height="30" rx="15"
                :fill="currentQ.targetSlot === 'operator' ? (selectedAnswer !== null ? '#ede9fe' : '#f5f3ff') : '#ffffff'"
                :stroke="currentQ.targetSlot === 'operator' ? '#8b5cf6' : '#a7f3d0'"
                stroke-width="1.5"
                :stroke-dasharray="currentQ.targetSlot === 'operator' && selectedAnswer === null ? '4 3' : 'none'"
              />
              <text x="180" y="185" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" :fill="currentQ.targetSlot === 'operator' ? '#6d28d9' : '#047857'">
                {{ currentQ.targetSlot === 'operator' ? (selectedAnswer !== null ? (selectedAnswer === '+' ? 'Gộp (+)' : 'Bớt (-)') : '?') : 'Gộp (+)' }}
              </text>
            </g>

            <!-- Vòng tròn PHẦN 2 (Dưới Phải: X=285, Y=180, r=30) -->
            <g :class="bondData.part2.isMissing ? 'cursor-pointer hover:opacity-85' : ''" @click="bondData.part2.isMissing ? revealOptions() : null">
              <circle
                cx="285" cy="180" r="30"
                :fill="bondData.part2.isMissing ? (selectedAnswer !== null ? '#fef3c7' : '#fffbeb') : '#e0e7ff'"
                :stroke="bondData.part2.isMissing ? '#f59e0b' : '#818cf8'"
                :stroke-width="bondData.part2.isMissing ? 3.5 : 3"
                :stroke-dasharray="bondData.part2.isMissing && selectedAnswer === null ? '6 4' : 'none'"
              />
              <text x="285" y="190" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="26" :fill="bondData.part2.isMissing ? '#d97706' : '#3730a3'">
                {{ bondData.part2.isMissing ? (selectedAnswer !== null ? selectedAnswer : '?') : bondData.part2.value }}
              </text>
            </g>
            <text x="285" y="230" text-anchor="middle" font-family="'Baloo 2', cursive, sans-serif" font-weight="900" font-size="12" fill="#4f46e5">
              PHẦN 2
            </text>
          </svg>
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

    <!-- Lựa Chọn Đáp Án (Chờ bé suy nghĩ và bấm dấu ? mới mở) -->
    <div v-if="!showOptions" class="w-full flex flex-col items-center gap-2 max-w-sm sm:max-w-md mx-auto">
      <button
        @click="revealOptions"
        :disabled="isBroken"
        class="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-baloo font-black text-lg sm:text-xl shadow-lg shadow-amber-200/60 border-2 border-amber-300 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer select-none animate-pulse"
      >
        <span class="text-2xl">🤔</span>
        <span>Bé nghĩ xong chưa? Bấm dấu [ ? ] nhé!</span>
        <span class="w-8 h-8 rounded-full bg-white/25 border border-white/40 flex items-center justify-center text-base">❓</span>
      </button>
      <span class="text-xs font-bold text-slate-400 text-center">
        💡 Mẹo: Bé có thể bấm trực tiếp vào ô <b class="text-amber-600">[ ? ]</b> ở phép tính nhé!
      </span>
    </div>

    <!-- Khi đã bấm dấu ?: Hiển thị danh sách đáp án -->
    <div
      v-else
      class="w-full transition-all duration-300 animate-in fade-in zoom-in-95 duration-200"
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

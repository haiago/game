<script setup lang="ts">
import { usePetStore } from '@/stores/petStore';
import PetCanvas from '@/components/pet/PetCanvas.vue';

const petStore = usePetStore();

defineEmits<{
  (e: 'select-game', game: 'reading' | 'math_calc' | 'math_compare'): void;
}>();
</script>

<template>
  <div class="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
    
    <!-- Hero Banner Thú Cưng Đang Chờ Bé -->
    <div
      class="w-full bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 border-3 border-purple-300 rounded-[36px] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-purple-400 transition"
      @click="petStore.triggerPetSpeech()"
    >
      <div class="flex items-center gap-4 text-center sm:text-left">
        <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/90 shadow-md border-2 border-purple-200 flex items-center justify-center shrink-0">
          <PetCanvas
            :species="petStore.activePetId"
            :stage="petStore.currentStageIndex + 1"
            :width="120"
            :height="120"
            :scale="1.0"
          />
        </div>

        <div>
          <span class="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-white/90 px-3 py-1 rounded-full border border-purple-200 shadow-xs">
            Bạn đồng hành của bé 🐾
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-baloo text-purple-950 mt-1.5 leading-tight">
            {{ petStore.activeSpecies.name }} (Cấp {{ petStore.currentStageIndex + 1 }})
          </h2>
          <p class="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
            {{ petStore.currentStage.title }} • Đang có <span class="text-amber-600 font-black">{{ petStore.currentStars }} ⭐</span>
          </p>
        </div>
      </div>

      <button
        @click.stop="petStore.showGardenModal = true"
        class="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition transform hover:scale-105 whitespace-nowrap cursor-pointer shrink-0"
      >
        Vào Vườn Thú 🐾
      </button>
    </div>

    <!-- Tiêu đề Sảnh Trò Chơi -->
    <div class="text-center">
      <h1 class="text-2xl sm:text-3xl font-black font-baloo text-slate-800 flex items-center justify-center gap-2">
        <span>🎮</span> HÔM NAY BÉ HỌC GÌ NÀO? <span>✨</span>
      </h1>
      <p class="text-xs sm:text-sm font-bold text-slate-500 mt-1">
        Mỗi bài học đúng đều giúp thú cưng của bé nhận sao và lớn lên vù vù!
      </p>
    </div>

    <!-- Danh sách Thẻ Trò Chơi Siêu To, Trực Quan -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
      
      <!-- GAME 1: ĐỌC TRƠN TIẾNG VIỆT -->
      <button
        @click="$emit('select-game', 'reading')"
        class="group p-5 sm:p-6 rounded-[32px] bg-gradient-to-b from-rose-50 to-pink-100/70 border-3 border-rose-300 hover:border-rose-500 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
      >
        <div class="w-20 h-20 rounded-3xl bg-white shadow-md border-2 border-rose-200 flex items-center justify-center text-5xl my-2 group-hover:scale-115 transition-transform duration-300">
          📖
        </div>
        <h3 class="text-lg sm:text-xl font-black font-baloo text-rose-950 mt-1">
          Bé Tập Đọc Trơn
        </h3>
        <p class="text-xs font-bold text-rose-700/90 mt-1 leading-relaxed">
          300 câu ngắn gọn theo SGK lớp 1, nhận sao nuôi thú cưng!
        </p>
        <span class="mt-4 px-4 py-2 rounded-2xl bg-rose-500 text-white font-black text-xs shadow-md group-hover:bg-rose-600 transition">
          Bắt Đầu Đọc 🚀
        </span>
      </button>

      <!-- GAME 2: TOÁN TÍNH NHANH -->
      <button
        @click="$emit('select-game', 'math_calc')"
        class="group p-5 sm:p-6 rounded-[32px] bg-gradient-to-b from-amber-50 to-yellow-100/70 border-3 border-amber-300 hover:border-amber-500 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
      >
        <div class="w-20 h-20 rounded-3xl bg-white shadow-md border-2 border-amber-200 flex items-center justify-center text-5xl my-2 group-hover:scale-115 transition-transform duration-300">
          🧮
        </div>
        <h3 class="text-lg sm:text-xl font-black font-baloo text-amber-950 mt-1">
          Toán Tính Nhanh
        </h3>
        <p class="text-xs font-bold text-amber-800/90 mt-1 leading-relaxed">
          Cộng trừ trong phạm vi 10 có quả táo 🍎 đếm trực quan!
        </p>
        <span class="mt-4 px-4 py-2 rounded-2xl bg-amber-500 text-white font-black text-xs shadow-md group-hover:bg-amber-600 transition">
          Tính Toán Ngay 🚀
        </span>
      </button>

      <!-- GAME 3: SO SÁNH BÉ LỚN -->
      <button
        @click="$emit('select-game', 'math_compare')"
        class="group p-5 sm:p-6 rounded-[32px] bg-gradient-to-b from-emerald-50 to-teal-100/70 border-3 border-emerald-300 hover:border-emerald-500 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
      >
        <div class="w-20 h-20 rounded-3xl bg-white shadow-md border-2 border-emerald-200 flex items-center justify-center text-5xl my-2 group-hover:scale-115 transition-transform duration-300">
          ⚖️
        </div>
        <h3 class="text-lg sm:text-xl font-black font-baloo text-emerald-950 mt-1">
          So Sánh Số (> < =)
        </h3>
        <p class="text-xs font-bold text-emerald-800/90 mt-1 leading-relaxed">
          Điền dấu Lớn, Bé, Bằng chuẩn xác nhận thưởng sao vàng!
        </p>
        <span class="mt-4 px-4 py-2 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-md group-hover:bg-emerald-600 transition">
          So Sánh Ngay 🚀
        </span>
      </button>

    </div>

  </div>
</template>

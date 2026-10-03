<script setup lang="ts">
import { usePetStore } from '@/stores/petStore';
import { soundManager } from '@/audio/soundEffects';
import { triggerHeartBurstEffect } from '@/utils/particleEffects';
import PetCanvas from '@/components/pet/PetCanvas.vue';

const petStore = usePetStore();

defineEmits<{
  (e: 'select-game', game: 'reading' | 'word_bubble' | 'math_calc' | 'math_compare' | 'math_split' | 'math_order' | 'math_pattern'): void;
}>();

function handlePetClick(e: MouseEvent) {
  soundManager.playPetCute();
  triggerHeartBurstEffect(e.currentTarget as HTMLElement);
}
</script>

<template>
  <div class="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
    
    <!-- Hero Banner Thú Cưng Đang Chờ Bé -->
    <div
      class="w-full bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 border-3 border-purple-300 rounded-[36px] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-purple-400 transition"
      @click="handlePetClick"
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
        @click.stop="petStore.availableSlots > 0 && petStore.lockedPetIds.length > 0 ? (petStore.showUnlockSlotModal = true) : (petStore.showGardenModal = true)"
        class="relative px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition transform hover:scale-105 whitespace-nowrap cursor-pointer shrink-0"
      >
        <span v-if="petStore.availableSlots > 0 && petStore.lockedPetIds.length > 0">
          🎁 Mở Thú Mới (+{{ petStore.availableSlots }})
        </span>
        <span v-else>
          Vào Vườn Thú 🐾
        </span>
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

    <!-- Danh sách 6 Thẻ Trò Chơi Siêu To, Trực Quan (Kết nối tri thức) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      
      <!-- GAME 1: ĐỌC TRƠN TIẾNG VIỆT -->
      <button
        @click="$emit('select-game', 'reading')"
        class="group p-5 rounded-[32px] bg-gradient-to-b from-rose-50 to-pink-100/70 border-3 border-rose-300 hover:border-rose-500 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden justify-between"
      >
        <div class="flex flex-col items-center">
          <div class="w-18 h-18 rounded-3xl bg-white shadow-md border-2 border-rose-200 flex items-center justify-center text-4xl my-2 group-hover:scale-115 transition-transform duration-300">
            📖
          </div>
          <h3 class="text-base sm:text-lg font-black font-baloo text-rose-950 mt-1">
            Bé Đọc Trơn
          </h3>
          <p class="text-xs font-bold text-rose-700/90 mt-1 leading-relaxed">
            300 câu ngắn SGK lớp 1, nhận sao nuôi thú!
          </p>
        </div>
        <span class="mt-4 w-full py-2 rounded-2xl bg-rose-500 text-white font-black text-xs shadow-md group-hover:bg-rose-600 transition">
          Bắt Đầu Đọc 🚀
        </span>
      </button>

      <!-- GAME MỚI: BONG BÓNG CHÍNH TẢ (ĐIỀN CHỮ KHUYẾT) -->
      <button
        @click="$emit('select-game', 'word_bubble')"
        class="group p-5 rounded-[32px] bg-gradient-to-b from-sky-50 to-blue-100/70 border-3 border-sky-300 hover:border-sky-500 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden justify-between"
      >
        <div class="flex flex-col items-center">
          <div class="w-18 h-18 rounded-3xl bg-white shadow-md border-2 border-sky-200 flex items-center justify-center text-4xl my-2 group-hover:scale-115 transition-transform duration-300">
            🫧
          </div>
          <h3 class="text-base sm:text-lg font-black font-baloo text-sky-950 mt-1">
            Bong Bóng Chính Tả
          </h3>
          <p class="text-xs font-bold text-sky-800/90 mt-1 leading-relaxed">
            Săn bóng chữ cái còn thiếu để hoàn thiện từ chính tả có minh họa!
          </p>
        </div>
        <span class="mt-4 w-full py-2 rounded-2xl bg-sky-500 text-white font-black text-xs shadow-md group-hover:bg-sky-600 transition">
          Săn Bóng Chính Tả 🚀
        </span>
      </button>

      <!-- GAME 2: TÁCH - GỘP SỐ (SGK MỚI) -->
      <button
        @click="$emit('select-game', 'math_split')"
        class="group p-5 rounded-[32px] bg-gradient-to-b from-cyan-50 to-sky-100/70 border-3 border-cyan-300 hover:border-cyan-500 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden justify-between"
      >
        <div class="flex flex-col items-center">
          <div class="w-18 h-18 rounded-3xl bg-white shadow-md border-2 border-cyan-200 flex items-center justify-center text-4xl my-2 group-hover:scale-115 transition-transform duration-300">
            🌱
          </div>
          <h3 class="text-base sm:text-lg font-black font-baloo text-cyan-950 mt-1">
            Tách – Gộp Số
          </h3>
          <p class="text-xs font-bold text-cyan-800/90 mt-1 leading-relaxed">
            Sơ đồ rẽ nhánh hình chữ Y trực quan, chuẩn SGK mới!
          </p>
        </div>
        <span class="mt-4 w-full py-2 rounded-2xl bg-cyan-500 text-white font-black text-xs shadow-md group-hover:bg-cyan-600 transition">
          Tách Gộp Ngay 🚀
        </span>
      </button>

      <!-- GAME 3: KÉO THẢ SẮP XẾP SỐ (KẾT NỐI TRI THỨC) -->
      <button
        @click="$emit('select-game', 'math_order')"
        class="group p-5 rounded-[32px] bg-gradient-to-b from-violet-50 to-purple-100/70 border-3 border-violet-300 hover:border-violet-500 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden justify-between"
      >
        <div class="flex flex-col items-center">
          <div class="w-18 h-18 rounded-3xl bg-white shadow-md border-2 border-violet-200 flex items-center justify-center text-4xl my-2 group-hover:scale-115 transition-transform duration-300">
            🚂
          </div>
          <h3 class="text-base sm:text-lg font-black font-baloo text-violet-950 mt-1">
            Đoàn Tàu Sắp Xếp Số
          </h3>
          <p class="text-xs font-bold text-violet-800/90 mt-1 leading-relaxed">
            Kéo thả hoặc chạm xếp số từ bé đến lớn / lớn đến bé!
          </p>
        </div>
        <span class="mt-4 w-full py-2 rounded-2xl bg-violet-600 text-white font-black text-xs shadow-md group-hover:bg-violet-700 transition">
          Xếp Toa Tàu 🚀
        </span>
      </button>

      <!-- GAME 4: TOÁN CỘNG TRỪ -->
      <button
        @click="$emit('select-game', 'math_calc')"
        class="group p-5 rounded-[32px] bg-gradient-to-b from-amber-50 to-yellow-100/70 border-3 border-amber-300 hover:border-amber-500 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden justify-between"
      >
        <div class="flex flex-col items-center">
          <div class="w-18 h-18 rounded-3xl bg-white shadow-md border-2 border-amber-200 flex items-center justify-center text-4xl my-2 group-hover:scale-115 transition-transform duration-300">
            🧮
          </div>
          <h3 class="text-base sm:text-lg font-black font-baloo text-amber-950 mt-1">
            Bé Làm Toán Vui
          </h3>
          <p class="text-xs font-bold text-amber-800/90 mt-1 leading-relaxed">
            Cộng trừ trong phạm vi 15 có hình vẽ đếm trực quan!
          </p>
        </div>
        <span class="mt-4 w-full py-2 rounded-2xl bg-amber-500 text-white font-black text-xs shadow-md group-hover:bg-amber-600 transition">
          Tính Toán Ngay 🚀
        </span>
      </button>

      <!-- GAME 5: SO SÁNH BÉ LỚN -->
      <button
        @click="$emit('select-game', 'math_compare')"
        class="group p-5 rounded-[32px] bg-gradient-to-b from-emerald-50 to-teal-100/70 border-3 border-emerald-300 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden justify-between"
      >
        <div class="flex flex-col items-center">
          <div class="w-18 h-18 rounded-3xl bg-white shadow-md border-2 border-emerald-200 flex items-center justify-center text-4xl my-2 group-hover:scale-115 transition-transform duration-300">
            ⚖️
          </div>
          <h3 class="text-base sm:text-lg font-black font-baloo text-emerald-950 mt-1">
            So Sánh Số
          </h3>
          <p class="text-xs font-bold text-emerald-800/90 mt-1 leading-relaxed">
            Điền dấu &gt;, &lt; hoặc = chuẩn xác nhận thưởng sao vàng!
          </p>
        </div>
        <span class="mt-4 w-full py-2 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-md group-hover:bg-emerald-600 transition">
          So Sánh Ngay 🚀
        </span>
      </button>

      <!-- GAME 6: QUY LUẬT DÃY SỐ (3 CHỦ ĐỀ THAY ĐỔI NHAU) -->
      <button
        @click="$emit('select-game', 'math_pattern')"
        class="group p-5 rounded-[32px] bg-gradient-to-b from-teal-50 via-emerald-50 to-green-100/70 border-3 border-teal-300 hover:border-teal-500 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex flex-col items-center text-center cursor-pointer relative overflow-hidden justify-between"
      >
        <div class="flex flex-col items-center">
          <div class="w-18 h-18 rounded-3xl bg-white shadow-md border-2 border-teal-200 flex items-center justify-center text-4xl my-2 group-hover:scale-115 transition-transform duration-300">
            🧩
          </div>
          <div class="flex items-center gap-1 mt-1">
            <span class="text-xs">🐛</span>
            <span class="text-xs">🐸</span>
            <span class="text-xs">🔍</span>
          </div>
          <h3 class="text-base sm:text-lg font-black font-baloo text-teal-950 mt-0.5">
            Quy Luật Dãy Số
          </h3>
          <p class="text-xs font-bold text-teal-800/90 mt-1 leading-relaxed">
            Sâu thông thái, ếch nhảy lá sen, thám tử tìm số bí ẩn!
          </p>
        </div>
        <span class="mt-4 w-full py-2 rounded-2xl bg-teal-600 text-white font-black text-xs shadow-md group-hover:bg-teal-700 transition">
          Tìm Quy Luật 🚀
        </span>
      </button>

    </div>

  </div>
</template>

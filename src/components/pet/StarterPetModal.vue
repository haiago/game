<script setup lang="ts">
import { usePetStore } from '@/stores/petStore';
import { PET_ORDER, PET_SPECIES_DATA } from '@/data/petSpeciesData';

const petStore = usePetStore();
</script>

<template>
  <div v-if="petStore.showStarterModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
    <div class="bg-white rounded-[32px] max-w-md w-full p-5 sm:p-6 text-center shadow-2xl border-4 sm:border-6 border-pink-400 flex flex-col items-center gap-3 relative overflow-hidden animate-in zoom-in-95 duration-200">
      
      <!-- Hào quang nền -->
      <div class="absolute -top-16 -right-16 w-40 h-40 bg-pink-200/50 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-200/50 rounded-full blur-2xl pointer-events-none"></div>

      <div class="text-4xl sm:text-5xl animate-bounce">🎁</div>
      <div>
        <h2 class="text-xl sm:text-2xl font-black font-baloo text-purple-950 leading-tight">CHÀO BÉ YÊU! 🌟</h2>
        <p class="text-xs sm:text-sm font-extrabold text-pink-600 mt-1">Bé hãy chọn một quả trứng thú cưng yêu thích để bắt đầu nhé!</p>
      </div>

      <!-- Lưới 6 Thú Cưng để chọn tự do -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full my-2">
        <button
          v-for="id in PET_ORDER"
          :key="id"
          @click="petStore.selectFirstStarter(id)"
          class="p-3.5 rounded-3xl bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-300 hover:border-purple-500 hover:scale-105 active:scale-95 transition flex flex-col items-center gap-1 shadow-sm group cursor-pointer"
        >
          <div class="text-4xl group-hover:scale-125 transition-transform duration-200">
            {{ PET_SPECIES_DATA[id].icon }}
          </div>
          <div class="font-black text-xs sm:text-sm text-purple-950 font-baloo">
            {{ PET_SPECIES_DATA[id].name }}
          </div>
          <div class="text-[10px] font-bold text-purple-600 bg-purple-100/90 px-2 py-0.5 rounded-full">
            {{ PET_SPECIES_DATA[id].badge }}
          </div>
        </button>
      </div>

      <p class="text-[11px] text-slate-500 font-bold">
        Sau khi nuôi lớn (đạt 50⭐), bé sẽ tiếp tục mở khóa các bạn thú cưng tiếp theo!
      </p>
    </div>
  </div>
</template>

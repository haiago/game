<script setup lang="ts">
import { usePetStore } from '@/stores/petStore';
import { PET_SPECIES_DATA } from '@/data/petSpeciesData';

const petStore = usePetStore();
</script>

<template>
  <div
    v-if="petStore.showUnlockSlotModal && petStore.availableSlots > 0 && petStore.lockedPetIds.length > 0"
    class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
  >
    <div class="bg-gradient-to-b from-amber-100 via-pink-50 to-purple-100 rounded-[36px] max-w-lg w-full p-5 sm:p-6 text-center shadow-2xl border-4 sm:border-6 border-amber-400 flex flex-col items-center gap-3 relative overflow-hidden animate-in zoom-in-95 duration-200">
      
      <!-- Hào quang nền -->
      <div class="absolute -top-16 -right-16 w-44 h-44 bg-yellow-300/40 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-16 -left-16 w-44 h-44 bg-pink-300/40 rounded-full blur-3xl pointer-events-none"></div>

      <div class="text-4xl sm:text-5xl animate-bounce">✨ 🎁 ✨</div>
      
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/90 text-amber-950 font-black text-xs rounded-full uppercase tracking-wider mb-1.5 shadow-sm font-baloo">
          <span>🔓</span> BÉ ĐÃ MỞ ĐƯỢC 1 SLOT MỚI!
        </div>
        <h2 class="text-xl sm:text-2xl font-black font-baloo text-purple-950 leading-tight">
          CHỌN THÚ CƯNG TIẾP THEO
        </h2>
        <p class="text-xs sm:text-sm font-extrabold text-pink-700 mt-1">
          Bé hãy chạm vào 1 bạn thú cưng yêu thích bên dưới để nhận bạn ấy vào vườn nhé!
        </p>
      </div>

      <!-- Danh sách các bạn thú còn lại đang khóa -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full my-2">
        <button
          v-for="id in petStore.lockedPetIds"
          :key="id"
          @click="petStore.unlockNewPet(id)"
          class="p-3.5 rounded-3xl bg-white/95 border-3 border-amber-300 hover:border-amber-500 hover:shadow-xl hover:scale-105 active:scale-95 transition flex flex-col items-center gap-1.5 shadow-md group cursor-pointer relative"
        >
          <span class="absolute top-2 right-2 text-[10px] bg-green-100 text-green-700 border border-green-300 px-1.5 py-0.5 rounded-full font-black font-baloo">
            Sẵn sàng mở ✨
          </span>

          <div class="text-5xl group-hover:scale-125 transition-transform duration-200 my-1">
            {{ PET_SPECIES_DATA[id].icon }}
          </div>
          
          <div class="font-black text-sm text-purple-950 font-baloo leading-tight">
            {{ PET_SPECIES_DATA[id].name }}
          </div>
          
          <div class="text-[10px] font-bold text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-full">
            {{ PET_SPECIES_DATA[id].badge }}
          </div>

          <div class="w-full mt-1 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-white font-black text-xs shadow-sm font-baloo">
            Chọn bạn này 🐾
          </div>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="petStore.showUnlockSlotModal = false"
          class="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer py-1 px-3"
        >
          Để sau (chọn trong Vườn Thú)
        </button>
      </div>

    </div>
  </div>
</template>

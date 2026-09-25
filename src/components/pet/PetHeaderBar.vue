<script setup lang="ts">
import { ref } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { soundManager } from '@/audio/soundEffects';
import { triggerHeartBurstEffect } from '@/utils/particleEffects';
import PetCanvas from './PetCanvas.vue';

const petStore = usePetStore();
const avatarRef = ref<HTMLElement | null>(null);

function handlePetAvatarClick(e: MouseEvent) {
  soundManager.playPetCute();
  triggerHeartBurstEffect((e.currentTarget as HTMLElement) || avatarRef.value);
}
</script>

<template>
  <header class="w-full bg-white/95 backdrop-blur-md border-b-2 border-purple-200 px-3 sm:px-6 py-2 shadow-sm sticky top-0 z-40">
    <div class="max-w-4xl mx-auto flex items-center justify-between gap-2">
      
      <!-- Thú cưng mini & Bung tim khi bấm -->
      <div class="flex items-center gap-2 relative">
        <div
          ref="avatarRef"
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-purple-100 to-pink-50 border-2 border-purple-300 flex items-center justify-center shadow-inner overflow-hidden cursor-pointer shrink-0 transition-transform active:scale-90"
          @click="handlePetAvatarClick"
          title="Bấm vào để yêu thương thú cưng!"
        >
          <PetCanvas
            :species="petStore.activePetId"
            :stage="petStore.currentStageIndex + 1"
            :width="100"
            :height="100"
            :scale="0.85"
          />
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <span class="font-black text-xs sm:text-sm text-purple-950 font-baloo leading-tight">{{ petStore.activeSpecies.name }}</span>
            <span class="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-purple-600 text-white font-baloo">Lv.{{ petStore.currentStageIndex + 1 }}</span>
          </div>

          <!-- Thanh tiến độ sao -->
          <div id="pet-exp-box" class="flex items-center gap-1.5 mt-0.5">
            <div class="w-20 sm:w-28 h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
              <div
                class="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 rounded-full"
                :style="{ width: `${Math.min(100, (petStore.currentStars / (petStore.nextStage?.reqStars || 50)) * 100)}%` }"
              ></div>
            </div>
            <span class="text-[11px] font-black text-amber-900 font-baloo">
              ⭐ {{ petStore.currentStars }}/{{ petStore.nextStage?.reqStars || 50 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Hộp đếm sao và Nút chức năng góc phải chuẩn nguyên bản -->
      <div class="flex items-center gap-2">
        <!-- HỘP ĐẾM SAO NỔI BẬT NGUYÊN BẢN (Target của sao bay về) -->
        <div
          id="star-badge-box"
          class="flex items-center bg-gradient-to-b from-amber-50 to-yellow-100 border-2 border-amber-400 px-3 py-1.5 rounded-2xl font-black shadow-sm transition-transform cursor-pointer hover:scale-105 active:scale-95"
          @click="handlePetAvatarClick"
        >
          <span class="text-xl mr-1.5 filter drop-shadow-xs animate-bounce">⭐</span>
          <span class="text-lg font-black text-amber-950 font-baloo tracking-tight">{{ petStore.currentStars }}</span>
          <span class="text-xs text-amber-700 font-bold ml-1 font-baloo">/{{ petStore.nextStage?.reqStars || 50 }}</span>
        </div>

        <!-- Nút Vườn Thú kèm huy hiệu Slot nếu có -->
        <button
          @click="petStore.showGardenModal = true"
          class="relative px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-2 border-purple-300 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition transform hover:scale-105 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span class="text-sm">🐾</span>
          <span>Vườn Thú</span>
          <span
            v-if="petStore.availableSlots > 0 && petStore.lockedPetIds.length > 0"
            class="absolute -top-2 -right-1 px-1.5 py-0.5 bg-rose-500 text-white font-black text-[10px] rounded-full border-2 border-white shadow animate-bounce"
          >
            +{{ petStore.availableSlots }}
          </span>
        </button>
      </div>

    </div>
  </header>
</template>

<style>
@keyframes starBoxEarned {
  0%, 100% { transform: scale(1); }
  30% { transform: scale(1.28) rotate(-6deg); background-color: #fef08a; box-shadow: 0 0 25px rgba(250, 204, 21, 0.95); }
  65% { transform: scale(1.15) rotate(4deg); }
}
.star-box-bump {
  animation: starBoxEarned 0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>

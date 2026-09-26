<script setup lang="ts">
import { ref } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { soundManager } from '@/audio/soundEffects';
import { triggerHeartBurstEffect } from '@/utils/particleEffects';
import PetCanvas from './PetCanvas.vue';

const petStore = usePetStore();
const avatarRef = ref<HTMLElement | null>(null);
const isMusicOn = ref(soundManager.bgmEnabled);
const currentTrackIdx = ref(soundManager.currentTrackIndex);

function toggleMusic() {
  isMusicOn.value = soundManager.toggleBgm();
}

function handleNextTrack() {
  currentTrackIdx.value = soundManager.nextBgmTrack();
  isMusicOn.value = soundManager.bgmEnabled;
}

function handlePetAvatarClick(e: MouseEvent) {
  soundManager.playPetCute();
  triggerHeartBurstEffect((e.currentTarget as HTMLElement) || avatarRef.value);
}
</script>

<template>
  <header class="w-full bg-white/95 backdrop-blur-md border-b border-purple-200 px-3 sm:px-5 py-1 sm:py-1.5 shadow-xs sticky top-0 z-40">
    <div class="max-w-4xl mx-auto flex items-center justify-between gap-2">
      
      <!-- Thú cưng mini & Bung tim khi bấm -->
      <div class="flex items-center gap-2 relative">
        <div
          ref="avatarRef"
          class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-purple-100 to-pink-50 border border-purple-300 flex items-center justify-center shadow-inner overflow-hidden cursor-pointer shrink-0 transition-transform active:scale-90"
          @click="handlePetAvatarClick"
          title="Bấm vào để yêu thương thú cưng!"
        >
          <PetCanvas
            :species="petStore.activePetId"
            :stage="petStore.currentStageIndex + 1"
            :width="80"
            :height="80"
            :scale="0.75"
          />
        </div>

        <div class="flex flex-col justify-center">
          <div class="flex items-center gap-1.5">
            <span class="font-black text-xs sm:text-sm text-purple-950 font-baloo leading-none">{{ petStore.activeSpecies.name }}</span>
            <span class="text-[9px] font-black px-1 py-0.2 rounded bg-purple-600 text-white font-baloo">Lv.{{ petStore.currentStageIndex + 1 }}</span>
          </div>

          <!-- Thanh tiến độ sao gọn gàng -->
          <div id="pet-exp-box" class="flex items-center gap-1.5 mt-0.5">
            <div class="w-16 sm:w-24 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
              <div
                class="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 rounded-full"
                :style="{ width: `${Math.min(100, (petStore.currentStars / (petStore.nextStage?.reqStars || 50)) * 100)}%` }"
              ></div>
            </div>
            <span class="text-[10px] font-black text-amber-900 font-baloo leading-none">
              ⭐ {{ petStore.currentStars }}/{{ petStore.nextStage?.reqStars || 50 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Hộp đếm sao và Nút chức năng góc phải gọn gàng -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <!-- HỘP ĐẾM SAO NỔI BẬT NGUYÊN BẢN (Target của sao bay về) -->
        <div
          id="star-badge-box"
          class="flex items-center bg-gradient-to-b from-amber-50 to-yellow-100 border border-amber-400 px-2.5 py-1 rounded-xl font-black shadow-xs transition-transform cursor-pointer hover:scale-105 active:scale-95"
          @click="handlePetAvatarClick"
        >
          <span class="text-base mr-1 filter drop-shadow-xs animate-bounce">⭐</span>
          <span class="text-sm sm:text-base font-black text-amber-950 font-baloo tracking-tight">{{ petStore.currentStars }}</span>
        </div>

        <!-- Nút Nhạc Nền Bo Tròn Đẹp Mắt (Click để Bật/Tắt, Click số để Đổi Bài) -->
        <div class="flex items-center gap-1 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-300 rounded-2xl px-2 py-1 shadow-xs transition select-none">
          <!-- Bật / Tắt BGM -->
          <button
            @click="toggleMusic"
            class="flex items-center gap-1 cursor-pointer active:scale-90 transition text-xs font-black font-baloo"
            :class="isMusicOn ? 'text-purple-700' : 'text-slate-400'"
            :title="isMusicOn ? 'Tắt nhạc nền' : 'Bật nhạc nền'"
          >
            <span class="text-sm" :class="{ 'animate-pulse': isMusicOn }">
              {{ isMusicOn ? '🎵' : '🔇' }}
            </span>
          </button>

          <!-- Nút Đổi Bài 1 / 2 Gọn Gàng -->
          <button
            @click="handleNextTrack"
            class="px-1.5 py-0.5 rounded-lg text-[10px] font-black font-baloo cursor-pointer active:scale-95 transition flex items-center gap-0.5"
            :class="isMusicOn
              ? 'bg-purple-600 text-white shadow-2xs hover:bg-purple-700'
              : 'bg-slate-200 text-slate-500'"
            title="Bấm để đổi bài nhạc (Bài 1 / Bài 2)"
          >
            <span>#{{ currentTrackIdx + 1 }}</span>
            <span class="text-[9px] opacity-80">↻</span>
          </button>
        </div>

        <!-- Nút Vườn Thú kèm huy hiệu Slot nếu có -->
        <button
          @click="petStore.showGardenModal = true"
          class="relative px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-300 rounded-xl font-black text-xs shadow-xs flex items-center gap-1 active:scale-95 transition whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span class="text-xs">🐾</span>
          <span class="hidden sm:inline">Vườn Thú</span>
          <span
            v-if="petStore.availableSlots > 0 && petStore.lockedPetIds.length > 0"
            class="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-rose-500 text-white font-black text-[9px] rounded-full border border-white shadow animate-bounce"
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

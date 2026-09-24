<script setup lang="ts">
import { usePetStore } from '@/stores/petStore';
import PetCanvas from './PetCanvas.vue';

const petStore = usePetStore();
</script>

<template>
  <header class="w-full bg-white/95 backdrop-blur-md border-b-2 border-purple-200 px-3 sm:px-6 py-2 shadow-sm sticky top-0 z-40">
    <div class="max-w-4xl mx-auto flex items-center justify-between gap-2">
      
      <!-- Thú cưng mini & Lời thoại -->
      <div class="flex items-center gap-2 relative">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-purple-100 to-pink-50 border-2 border-purple-300 flex items-center justify-center shadow-inner overflow-hidden cursor-pointer shrink-0" @click="petStore.triggerPetSpeech()">
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
          <div class="flex items-center gap-1.5 mt-0.5">
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

        <!-- Bong bóng lời thoại -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-1 scale-95"
        >
          <div
            v-if="petStore.showSpeechBubble"
            class="absolute left-16 -top-8 bg-white text-slate-800 text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-2xl shadow-xl border-2 border-amber-400 whitespace-nowrap z-50 pointer-events-none"
          >
            {{ petStore.speechBubbleText }}
          </div>
        </transition>
      </div>

      <!-- Nút Vườn Thú -->
      <button
        @click="petStore.showGardenModal = true"
        class="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-2 border-purple-300 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition transform hover:scale-105 whitespace-nowrap shrink-0 cursor-pointer"
      >
        <span class="text-sm">🐾</span>
        <span>Vườn Thú</span>
      </button>

    </div>
  </header>
</template>

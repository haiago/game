<script setup lang="ts">
import { watch } from 'vue';
import { usePetStore } from '@/stores/petStore';
import PetCanvas from './PetCanvas.vue';
import { triggerBigCelebration } from '@/utils/particleEffects';

const petStore = usePetStore();

watch(() => petStore.showEvolutionModal, (val) => {
  if (val) {
    triggerBigCelebration();
  }
});
</script>

<template>
  <div v-if="petStore.showEvolutionModal && petStore.evolutionData" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-gradient-to-b from-amber-200 via-yellow-100 to-rose-200 rounded-[36px] max-w-sm w-full p-5 sm:p-6 text-center shadow-2xl border-4 border-amber-400 flex flex-col items-center gap-3 relative overflow-hidden animate-in zoom-in-95 duration-200">
      
      <div class="text-5xl animate-bounce">🎉</div>
      <h3 class="text-2xl font-black font-baloo text-amber-950">
        {{ petStore.evolutionData.isGraduate ? '🎓 THÚ CƯNG TỐT NGHIỆP!' : '🎉 THÚ CƯNG TIẾN HÓA!' }}
      </h3>
      <p class="text-xs font-bold text-amber-900">
        {{ petStore.evolutionData.isGraduate ? 'Bé đã nuôi lớn hoàn hảo đạt Cấp 5 Hoàng Gia! 👑' : 'Bé đã tích đủ sao để giúp bạn ấy lớn lên!' }}
      </p>

      <div class="my-1">
        <PetCanvas
          :species="petStore.activePetId"
          :stage="petStore.currentStageIndex + 1"
          :width="180"
          :height="180"
          :scale="1.3"
        />
      </div>

      <div class="text-xl font-black font-baloo text-rose-700">
        {{ petStore.evolutionData.stageTitle }}
      </div>
      <p class="text-xs font-extrabold text-slate-700 bg-white/85 p-3 rounded-2xl border border-amber-300 leading-relaxed shadow-inner">
        {{ petStore.evolutionData.stageDesc }}
      </p>

      <div class="w-full flex flex-col gap-2 mt-1">
        <button
          @click="petStore.showEvolutionModal = false"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-sm shadow-lg active:scale-95 transition cursor-pointer"
        >
          Tuyệt Vời Quá Bé Ơi! ⭐
        </button>
      </div>
    </div>
  </div>
</template>

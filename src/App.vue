<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import PetHeaderBar from '@/components/pet/PetHeaderBar.vue';
import PetGardenModal from '@/components/pet/PetGardenModal.vue';
import StarterPetModal from '@/components/pet/StarterPetModal.vue';
import EvolutionCelebration from '@/components/pet/EvolutionCelebration.vue';
import PetUnlockSlotModal from '@/components/pet/PetUnlockSlotModal.vue';

import HomeHubView from '@/views/HomeHubView.vue';
import ReadingGameView from '@/views/ReadingGameView.vue';
import MathCalcGameView from '@/views/MathCalcGameView.vue';
import MathCompareGameView from '@/views/MathCompareGameView.vue';
import MathSplitCombineGameView from '@/views/MathSplitCombineGameView.vue';
import MathOrderGameView from '@/views/MathOrderGameView.vue';
import WordBubbleGameView from '@/views/WordBubbleGameView.vue';

const petStore = usePetStore();
const currentScreen = ref<'hub' | 'reading' | 'word_bubble' | 'math_calc' | 'math_compare' | 'math_split' | 'math_order'>('hub');

onMounted(() => {
  petStore.initFromStorage();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50/70 via-purple-50/50 to-pink-50/70 flex flex-col justify-between text-slate-800 selection:bg-purple-200">
    
    <!-- Header trạng thái Thú Cưng dùng chung cho toàn bộ app -->
    <PetHeaderBar />

    <!-- Nội dung chính: Sảnh Game hoặc Màn Chơi -->
    <main class="flex-1 flex flex-col justify-center">
      <HomeHubView
        v-if="currentScreen === 'hub'"
        @select-game="(g) => currentScreen = g"
      />

      <ReadingGameView
        v-else-if="currentScreen === 'reading'"
        @back-home="currentScreen = 'hub'"
      />

      <WordBubbleGameView
        v-else-if="currentScreen === 'word_bubble'"
        @back-home="currentScreen = 'hub'"
      />

      <MathCalcGameView
        v-else-if="currentScreen === 'math_calc'"
        @back-home="currentScreen = 'hub'"
      />

      <MathCompareGameView
        v-else-if="currentScreen === 'math_compare'"
        @back-home="currentScreen = 'hub'"
      />

      <MathSplitCombineGameView
        v-else-if="currentScreen === 'math_split'"
        @back-home="currentScreen = 'hub'"
      />

      <MathOrderGameView
        v-else-if="currentScreen === 'math_order'"
        @back-home="currentScreen = 'hub'"
      />
    </main>

    <!-- Các Modal Toàn Cục -->
    <PetGardenModal />
    <StarterPetModal />
    <EvolutionCelebration />
    <PetUnlockSlotModal />

  </div>
</template>

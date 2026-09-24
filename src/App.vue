<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import PetHeaderBar from '@/components/pet/PetHeaderBar.vue';
import PetGardenModal from '@/components/pet/PetGardenModal.vue';
import StarterPetModal from '@/components/pet/StarterPetModal.vue';
import EvolutionCelebration from '@/components/pet/EvolutionCelebration.vue';

import HomeHubView from '@/views/HomeHubView.vue';
import ReadingGameView from '@/views/ReadingGameView.vue';
import MathCalcGameView from '@/views/MathCalcGameView.vue';
import MathCompareGameView from '@/views/MathCompareGameView.vue';

const petStore = usePetStore();
const currentScreen = ref<'hub' | 'reading' | 'math_calc' | 'math_compare'>('hub');

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

      <MathCalcGameView
        v-else-if="currentScreen === 'math_calc'"
        @back-home="currentScreen = 'hub'"
      />

      <MathCompareGameView
        v-else-if="currentScreen === 'math_compare'"
        @back-home="currentScreen = 'hub'"
      />
    </main>

    <!-- Footer bản quyền -->
    <footer class="py-3 text-center text-xs font-bold text-slate-400 border-t border-slate-200/60 bg-white/40">
      Bé Học Vui • Luyện Đọc Trơn &amp; Toán Lớp 1 Nuôi Thú Cưng 🐾
    </footer>

    <!-- Các Modal Toàn Cục -->
    <PetGardenModal />
    <StarterPetModal />
    <EvolutionCelebration />

  </div>
</template>

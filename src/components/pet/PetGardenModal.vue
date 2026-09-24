<script setup lang="ts">
import { usePetStore } from '@/stores/petStore';
import { PET_ORDER, PET_SPECIES_DATA } from '@/data/petSpeciesData';
import PetCanvas from './PetCanvas.vue';

const petStore = usePetStore();
</script>

<template>
  <div v-if="petStore.showGardenModal" class="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div class="bg-white rounded-[32px] max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-purple-400 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 border-b-2 border-purple-300 flex items-center justify-between text-white">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-2xl">
            🐾
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black font-baloo leading-tight">VƯỜN TRỨNG THẦN KỲ</h2>
            <p class="text-[11px] font-bold text-purple-950 opacity-90">Tích sao học bài để ấp nở trọn bộ 4 thú cưng</p>
          </div>
        </div>
        <button
          @click="petStore.showGardenModal = false"
          class="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 font-black flex items-center justify-center shadow text-sm active:scale-95 transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4 no-scrollbar">
        
        <!-- Sân khấu tương tác thú cưng lớn -->
        <div
          class="w-full min-h-[240px] bg-gradient-to-b from-purple-100/90 via-pink-50 to-amber-50 rounded-3xl p-4 border-2 border-purple-300 flex flex-col items-center justify-between relative shadow-inner cursor-pointer select-none"
          @click="petStore.triggerPetSpeech()"
        >
          <div class="text-[11px] font-black text-purple-700 bg-white/90 px-3 py-1 rounded-full border border-purple-200 shadow-sm relative z-10 flex items-center gap-1.5">
            <span>✨</span> Sân khấu thú cưng (Chạm vào bạn ấy nhé!)
          </div>

          <div class="my-1">
            <PetCanvas
              :species="petStore.activePetId"
              :stage="petStore.currentStageIndex + 1"
              :width="200"
              :height="200"
              :scale="1.4"
            />
          </div>

          <div class="text-xs sm:text-sm font-black font-baloo text-purple-950 px-3 py-1 bg-white/90 rounded-xl border border-purple-200 shadow-sm relative z-10">
            {{ petStore.activeSpecies.name }} • Cấp {{ petStore.currentStageIndex + 1 }}: {{ petStore.currentStage.title }}
          </div>
        </div>

        <!-- Danh sách 4 Bạn Thú Cưng -->
        <div>
          <div class="text-xs sm:text-sm font-black text-purple-900 uppercase tracking-wide mb-2.5 flex items-center justify-between">
            <span class="flex items-center gap-1.5"><span>🐾</span> VƯỜN THÚ CỦA BÉ:</span>
            <span class="text-xs text-purple-800 font-black bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              {{ petStore.unlockedPetIds.length }}/{{ PET_ORDER.length }} Mở Khóa
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div
              v-for="(id, idx) in PET_ORDER"
              :key="id"
              class="relative"
            >
              <!-- Thú đã mở khóa -->
              <button
                v-if="petStore.unlockedPetIds.includes(id)"
                @click="petStore.choosePet(id)"
                class="w-full p-3 sm:p-4 rounded-3xl text-center transition flex flex-col items-center justify-center gap-1.5 active:scale-95 cursor-pointer relative"
                :class="petStore.activePetId === id
                  ? 'bg-gradient-to-b from-purple-100 via-pink-50 to-amber-50 border-3 border-purple-500 shadow-md ring-2 ring-purple-300'
                  : 'bg-white border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 shadow-sm'"
              >
                <!-- Huy hiệu sao góc -->
                <span class="absolute top-2 right-2 text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5 shadow-2xs font-baloo">
                  ⭐ {{ petStore.petProgress[id]?.stars || 0 }}/50
                </span>

                <div class="text-4xl my-1" :class="{ 'animate-bounce': petStore.activePetId === id }">
                  {{ PET_SPECIES_DATA[id].icon }}
                </div>

                <div class="font-black text-xs sm:text-sm text-slate-900 font-baloo leading-tight">
                  {{ PET_SPECIES_DATA[id].name }}
                </div>

                <span
                  class="text-[10px] font-black px-2.5 py-0.5 rounded-full font-baloo"
                  :class="petStore.activePetId === id
                    ? 'bg-purple-600 text-white shadow-xs animate-pulse'
                    : 'bg-slate-100 text-slate-700'"
                >
                  {{ petStore.activePetId === id ? 'Đang chơi 🐾' : 'Sẵn sàng ✨' }}
                </span>
              </button>

              <!-- Thú đang khóa -->
              <div
                v-else
                @click="petStore.triggerPetSpeech(`Bé hãy nuôi bạn trước đạt 50⭐ để đánh thức ${PET_SPECIES_DATA[id].name} nhé! 💕`)"
                class="p-3 sm:p-4 rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50/40 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-100/50 hover:border-purple-300 active:scale-95 select-none relative group"
              >
                <span class="absolute top-2 right-2 text-xs bg-slate-200/90 text-slate-600 px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5 shadow-2xs">
                  🔒
                </span>

                <div class="text-4xl my-1 filter grayscale-[40%] opacity-80 group-hover:scale-110 transition-transform">
                  {{ PET_SPECIES_DATA[id].icon }}
                </div>

                <div class="font-black text-xs sm:text-sm text-slate-700 font-baloo leading-tight">
                  {{ PET_SPECIES_DATA[id].name }}
                </div>

                <div class="text-[10px] text-purple-700 font-bold bg-white/90 px-2 py-0.5 rounded-full border border-purple-200">
                  Nuôi bạn trước để mở
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-3 bg-slate-50 border-t border-slate-200">
        <button
          @click="petStore.showGardenModal = false"
          class="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition cursor-pointer"
        >
          Đồng Ý &amp; Tiếp Tục Học Tập 🚀
        </button>
      </div>

    </div>
  </div>
</template>

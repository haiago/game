import { defineStore } from 'pinia';
import { PET_SPECIES_DATA, PET_ORDER, type PetSpecies } from '@/data/petSpeciesData';
import { soundManager } from '@/audio/soundEffects';

export interface PetProgress {
  stars: number;
  completed: boolean;
}

const STORAGE_KEY = 'BE_DOC_TRON_PET_PROGRESS_V2';

export const usePetStore = defineStore('pet', {
  state: () => ({
    activePetId: 'dragon' as 'dragon' | 'cat' | 'penguin' | 'unicorn',
    unlockedPetIds: ['dragon'] as ('dragon' | 'cat' | 'penguin' | 'unicorn')[],
    petProgress: {
      dragon: { stars: 0, completed: false },
      cat: { stars: 0, completed: false },
      penguin: { stars: 0, completed: false },
      unicorn: { stars: 0, completed: false }
    } as Record<string, PetProgress>,
    isFirstTime: false,
    showStarterModal: false,
    showGardenModal: false,
    showEvolutionModal: false,
    evolutionData: null as { stageTitle: string; stageDesc: string; isGraduate: boolean; nextPetName?: string } | null,
    speechBubbleText: 'Bé đọc to và tính toán tớ nghe nhé! 💕',
    showSpeechBubble: false,
    speechTimer: null as any
  }),

  getters: {
    activeSpecies(state): PetSpecies {
      return PET_SPECIES_DATA[state.activePetId] || PET_SPECIES_DATA.dragon;
    },
    currentStars(state): number {
      return state.petProgress[state.activePetId]?.stars || 0;
    },
    currentStageIndex(state): number {
      const stars = state.petProgress[state.activePetId]?.stars || 0;
      const pet = PET_SPECIES_DATA[state.activePetId];
      if (!pet) return 0;
      let stageIdx = 0;
      for (let i = pet.stages.length - 1; i >= 0; i--) {
        if (stars >= pet.stages[i].reqStars) {
          stageIdx = i;
          break;
        }
      }
      return stageIdx;
    },
    currentStage(state): any {
      const idx = this.currentStageIndex;
      return this.activeSpecies.stages[idx] || this.activeSpecies.stages[0];
    },
    nextStage(state): any {
      const idx = this.currentStageIndex;
      return this.activeSpecies.stages[idx + 1] || null;
    }
  },

  actions: {
    initFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          // Người dùng mới hoàn toàn -> bật modal chọn thú ban đầu không gán cứng
          this.isFirstTime = true;
          this.showStarterModal = true;
          return;
        }
        const parsed = JSON.parse(raw);
        if (parsed.petProgressData && typeof parsed.petProgressData === 'object') {
          PET_ORDER.forEach(id => {
            if (parsed.petProgressData[id]) {
              this.petProgress[id] = {
                stars: parseFloat(parsed.petProgressData[id].stars) || 0,
                completed: Boolean(parsed.petProgressData[id].completed)
              };
            }
          });
        }
        if (Array.isArray(parsed.unlockedPetSpeciesIds) && parsed.unlockedPetSpeciesIds.length > 0) {
          this.unlockedPetIds = parsed.unlockedPetSpeciesIds.filter((id: string) => PET_ORDER.includes(id as any));
        }
        if (parsed.activePetSpeciesId && PET_ORDER.includes(parsed.activePetSpeciesId)) {
          this.activePetId = parsed.activePetSpeciesId;
        } else if (this.unlockedPetIds.length > 0) {
          this.activePetId = this.unlockedPetIds[0];
        }
        if (!this.unlockedPetIds.includes(this.activePetId)) {
          this.unlockedPetIds.unshift(this.activePetId);
        }
      } catch (err) {
        console.warn('Lỗi đọc localStorage:', err);
      }
    },

    saveToStorage() {
      try {
        const payload = {
          activePetSpeciesId: this.activePetId,
          unlockedPetSpeciesIds: this.unlockedPetIds,
          petProgressData: this.petProgress,
          currentLevel: this.currentStageIndex + 1
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn('Lỗi lưu localStorage:', err);
      }
    },

    selectFirstStarter(speciesId: 'dragon' | 'cat' | 'penguin' | 'unicorn') {
      this.activePetId = speciesId;
      if (!this.unlockedPetIds.includes(speciesId)) {
        this.unlockedPetIds = [speciesId];
      }
      this.isFirstTime = false;
      this.showStarterModal = false;
      this.saveToStorage();
      soundManager.playFanfare();
      this.triggerPetSpeech(`Chào mừng bé! ${this.activeSpecies.name} rất vui được đồng hành cùng bé! 💕`);
    },

    choosePet(speciesId: 'dragon' | 'cat' | 'penguin' | 'unicorn') {
      if (!this.unlockedPetIds.includes(speciesId)) {
        this.triggerPetSpeech(`Bé hãy nuôi bạn trước đạt 50⭐ để đánh thức bạn này nhé! 💕`);
        return;
      }
      this.activePetId = speciesId;
      this.saveToStorage();
      soundManager.playTap();
      this.triggerPetSpeech(`Bạn ${this.activeSpecies.name} xin chào bé! Cùng học vui vẻ nhé! 🐾`);
    },

    addStars(delta: number) {
      if (!this.petProgress[this.activePetId]) {
        this.petProgress[this.activePetId] = { stars: 0, completed: false };
      }
      const oldStars = this.petProgress[this.activePetId].stars;
      const newStars = Math.max(0, parseFloat((oldStars + delta).toFixed(1)));
      this.petProgress[this.activePetId].stars = newStars;

      const pet = this.activeSpecies;
      let oldStage = 0;
      let newStage = 0;
      pet.stages.forEach((st, idx) => {
        if (oldStars >= st.reqStars) oldStage = idx;
        if (newStars >= st.reqStars) newStage = idx;
      });

      let isGraduate = false;
      let nextPetToUnlock: any = null;

      if (newStage >= 4 && !this.petProgress[this.activePetId].completed) {
        this.petProgress[this.activePetId].completed = true;
        isGraduate = true;

        const currentOrderIdx = PET_ORDER.indexOf(this.activePetId);
        if (currentOrderIdx !== -1 && currentOrderIdx < PET_ORDER.length - 1) {
          nextPetToUnlock = PET_ORDER[currentOrderIdx + 1];
          if (!this.unlockedPetIds.includes(nextPetToUnlock)) {
            this.unlockedPetIds.push(nextPetToUnlock);
          }
        }
      }

      this.saveToStorage();

      if (delta > 0) {
        soundManager.playCorrect();
      }

      // Kiểm tra tiến hóa
      if (newStage > oldStage) {
        setTimeout(() => {
          this.evolutionData = {
            stageTitle: pet.stages[newStage].title,
            stageDesc: pet.stages[newStage].desc,
            isGraduate,
            nextPetName: nextPetToUnlock ? PET_SPECIES_DATA[nextPetToUnlock]?.name : undefined
          };
          this.showEvolutionModal = true;
          soundManager.playFanfare();
        }, 1200);
      }
    },

    triggerPetSpeech(customText?: string) {
      soundManager.playPetCute();
      const quotes = this.activeSpecies.quotes;
      const text = customText || quotes[Math.floor(Math.random() * quotes.length)];
      this.speechBubbleText = text;
      this.showSpeechBubble = true;

      if (this.speechTimer) clearTimeout(this.speechTimer);
      this.speechTimer = setTimeout(() => {
        this.showSpeechBubble = false;
      }, 3500);
    }
  }
});

<template>
  <div class="relative -mt-2 sm:-mt-4 min-h-screen overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-50 via-rose-50 to-purple-100 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
    <div class="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl"></div>
    <div class="pointer-events-none absolute top-56 -left-24 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl"></div>

    <div class="relative mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <section class="overflow-hidden rounded-[2rem] border-2 border-white/80 bg-white/70 p-4 shadow-[0_24px_70px_-35px_rgba(244,114,182,0.65)] backdrop-blur-xl sm:p-6 lg:p-7">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="min-w-0">
            <div class="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-600 ring-1 ring-purple-200">
              <span>📖</span>
              <span>宠物成长档案</span>
            </div>
            <h2 class="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
              宠物图鉴馆
            </h2>
            <p class="mt-2 max-w-2xl text-sm font-bold text-slate-500 sm:text-base">
              收集 {{ PETS.length }} 种可爱伙伴，查看每只宠物从 Lv.1 到 Lv.{{ STAGES }} 的成长变化。
            </p>
          </div>

          <div class="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[24rem]">
            <div class="rounded-2xl bg-white/85 p-3 text-center shadow-sm ring-1 ring-orange-100">
              <p class="text-[11px] font-black text-slate-400">全部宠物</p>
              <p class="mt-1 text-2xl font-black text-slate-800">{{ PETS.length }}</p>
            </div>
            <div class="rounded-2xl bg-white/85 p-3 text-center shadow-sm ring-1 ring-rose-100">
              <p class="text-[11px] font-black text-slate-400">普通动物</p>
              <p class="mt-1 text-2xl font-black text-orange-500">{{ normalPets.length }}</p>
            </div>
            <div class="rounded-2xl bg-white/85 p-3 text-center shadow-sm ring-1 ring-purple-100">
              <p class="text-[11px] font-black text-slate-400">神兽伙伴</p>
              <p class="mt-1 text-2xl font-black text-purple-500">{{ mythicPets.length }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-[1.5rem] bg-white/75 p-1.5 shadow-inner ring-1 ring-white">
          <div class="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            <button
              v-for="tab in categoryTabs"
              :key="tab.id"
              @click="activeCategory = tab.id"
              :class="categoryButtonClass(tab)"
              class="rounded-[1.25rem] px-4 py-2.5 text-sm font-black transition-all duration-300"
            >
              <span class="mr-1">{{ tab.icon }}</span>{{ tab.label }}
              <span class="ml-1 opacity-80">{{ tab.count }}</span>
            </button>
          </div>
        </div>
      </section>

      <section v-if="activeCategory !== 'mythic'" class="rounded-[2rem] border-2 border-white/80 bg-white/65 p-4 shadow-[0_24px_70px_-40px_rgba(251,146,60,0.65)] backdrop-blur-xl sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 class="text-xl font-black text-slate-800 sm:text-2xl">🐾 普通动物</h3>
            <p class="text-xs font-bold text-slate-400 sm:text-sm">温暖、陪伴、每天都想摸摸头的小伙伴</p>
          </div>
          <span class="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600 ring-1 ring-orange-200">{{ normalPets.length }} 种</span>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <button
            v-for="(pet, i) in normalPets"
            :key="pet.id"
            @click="openPet(pet)"
            class="group relative overflow-hidden rounded-[1.5rem] border-2 border-white bg-white/85 p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl animate-stagger-fade-in"
            :style="{ animationDelay: `${i * 0.025}s` }"
          >
            <div class="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-orange-200/45 blur-2xl transition-transform duration-300 group-hover:scale-150"></div>
            <div class="relative aspect-square rounded-[1.25rem] bg-gradient-to-br from-orange-100 via-rose-50 to-white p-2 shadow-inner ring-1 ring-orange-100">
              <img :src="getPetImageUrl(pet.id, 1)" :alt="pet.name" class="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
              <span class="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-black text-orange-500 shadow-sm">Lv.1</span>
            </div>
            <div class="relative mt-3 flex items-end justify-between gap-2">
              <div class="min-w-0">
                <p class="truncate text-sm font-black text-slate-800 transition-colors group-hover:text-orange-500 sm:text-base">{{ pet.name }}</p>
                <p class="mt-0.5 text-[11px] font-bold text-slate-400">点击查看进化</p>
              </div>
              <span class="shrink-0 rounded-full bg-orange-50 px-2 py-1 text-xs font-black text-orange-500 ring-1 ring-orange-100">🐕</span>
            </div>
          </button>
        </div>
      </section>

      <section v-if="activeCategory !== 'normal'" class="rounded-[2rem] border-2 border-white/80 bg-white/65 p-4 shadow-[0_24px_70px_-40px_rgba(168,85,247,0.6)] backdrop-blur-xl sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 class="text-xl font-black text-slate-800 sm:text-2xl">✨ 神兽伙伴</h3>
            <p class="text-xs font-bold text-slate-400 sm:text-sm">更稀有、更闪耀，适合最特别的成长瞬间</p>
          </div>
          <span class="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-600 ring-1 ring-purple-200">{{ mythicPets.length }} 种</span>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <button
            v-for="(pet, i) in mythicPets"
            :key="pet.id"
            @click="openPet(pet)"
            class="group relative overflow-hidden rounded-[1.5rem] border-2 border-white bg-white/85 p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl animate-stagger-fade-in"
            :style="{ animationDelay: `${i * 0.035}s` }"
          >
            <div class="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-purple-300/45 blur-2xl transition-transform duration-300 group-hover:scale-150"></div>
            <div class="relative aspect-square rounded-[1.25rem] bg-gradient-to-br from-purple-100 via-fuchsia-50 to-white p-2 shadow-inner ring-1 ring-purple-100">
              <img :src="getPetImageUrl(pet.id, 1)" :alt="pet.name" class="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
              <span class="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-black text-purple-500 shadow-sm">稀有</span>
            </div>
            <div class="relative mt-3 flex items-end justify-between gap-2">
              <div class="min-w-0">
                <p class="truncate text-sm font-black text-slate-800 transition-colors group-hover:text-purple-500 sm:text-base">{{ pet.name }}</p>
                <p class="mt-0.5 text-[11px] font-bold text-slate-400">点击查看进化</p>
              </div>
              <span class="shrink-0 rounded-full bg-purple-50 px-2 py-1 text-xs font-black text-purple-500 ring-1 ring-purple-100">✨</span>
            </div>
          </button>
        </div>
      </section>
    </div>

    <div v-if="selectedPet" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-3 backdrop-blur-sm sm:p-4" @click.self="selectedPet = null">
      <div class="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border-2 border-white/70 bg-white shadow-2xl animate-bounce-in">
        <div class="relative overflow-hidden p-5 sm:p-6" :class="isMythic(selectedPet) ? 'bg-gradient-to-r from-purple-500 via-fuchsia-400 to-rose-400' : 'bg-gradient-to-r from-orange-400 via-rose-400 to-purple-400'">
          <div class="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/20 blur-3xl"></div>
          <div class="relative flex items-center justify-between gap-4">
            <div class="flex min-w-0 items-center gap-3 sm:gap-4">
              <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 sm:h-20 sm:w-20">
                <img :src="getPetImageUrl(selectedPet.id, previewStage)" :alt="selectedPet.name" class="h-full w-full object-contain p-1 drop-shadow-md" />
              </div>
              <div class="min-w-0">
                <div class="mb-1 inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-black text-white ring-1 ring-white/25">
                  {{ isMythic(selectedPet) ? '✨ 神兽伙伴' : '🐾 普通动物' }}
                </div>
                <h3 class="truncate text-2xl font-black text-white sm:text-3xl">{{ selectedPet.name }}</h3>
                <p class="mt-1 text-xs font-bold text-white/80 sm:text-sm">共 {{ STAGES }} 个进化阶段 · 当前预览 Lv.{{ previewStage }}</p>
              </div>
            </div>
            <button @click="selectedPet = null" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-black text-white transition-colors hover:bg-white/30">✕</button>
          </div>
        </div>

        <div class="grid flex-1 gap-5 overflow-auto bg-gradient-to-br from-white via-orange-50/40 to-purple-50/60 p-4 sm:p-6 md:grid-cols-[0.95fr_1.05fr]">
          <div class="rounded-[1.75rem] border-2 border-white bg-white/80 p-4 shadow-sm backdrop-blur">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-slate-400">当前形态</p>
                <h4 class="mt-1 text-xl font-black text-slate-800">Lv.{{ previewStage }} 预览</h4>
              </div>
              <span class="rounded-full px-3 py-1 text-xs font-black ring-1" :class="isMythic(selectedPet) ? 'bg-purple-100 text-purple-600 ring-purple-200' : 'bg-orange-100 text-orange-600 ring-orange-200'">
                {{ selectedPet.name }}
              </span>
            </div>
            <div class="mt-4 flex aspect-square items-center justify-center rounded-[1.5rem] shadow-inner" :class="isMythic(selectedPet) ? 'bg-gradient-to-br from-purple-100 via-fuchsia-50 to-white' : 'bg-gradient-to-br from-orange-100 via-rose-50 to-white'">
              <img :src="getPetImageUrl(selectedPet.id, previewStage)" :alt="selectedPet.name" class="h-4/5 w-4/5 object-contain drop-shadow-lg animate-float-idle" />
            </div>
          </div>

          <div class="rounded-[1.75rem] border-2 border-white bg-white/80 p-4 shadow-sm backdrop-blur">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-slate-400">成长阶段</p>
                <h4 class="mt-1 text-xl font-black text-slate-800">选择等级预览</h4>
              </div>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-100">{{ previewStage }} / {{ STAGES }}</span>
            </div>

            <div class="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-4">
              <button
                v-for="lv in STAGES"
                :key="lv"
                @click="previewStage = lv"
                class="group relative overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                :class="stageButtonClass(lv)"
              >
                <div class="aspect-square rounded-xl p-1 shadow-inner" :class="isMythic(selectedPet) ? 'bg-gradient-to-br from-purple-50 to-fuchsia-50' : 'bg-gradient-to-br from-orange-50 to-amber-50'">
                  <img :src="getPetImageUrl(selectedPet.id, lv)" :alt="`Lv.${lv}`" class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div class="mt-1 rounded-full bg-slate-50 py-1 text-center text-[10px] font-black text-slate-600">
                  Lv.{{ lv }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PETS, getPetImageUrl } from '../utils/pets.js'

const STAGES = 8
const MYTHIC_IDS = ['white-tiger', 'unicorn', 'azure-dragon', 'vermilion-bird', 'succulent-spirit', 'pixiu', 'suanni']

const activeCategory = ref('all')
const selectedPet = ref(null)
const previewStage = ref(1)

const normalPets = computed(() => PETS.filter(p => !MYTHIC_IDS.includes(p.id)))
const mythicPets = computed(() => PETS.filter(p => MYTHIC_IDS.includes(p.id)))
const categoryTabs = computed(() => [
  { id: 'all', icon: '🐾', label: '全部', count: PETS.length, activeClass: 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg shadow-orange-200/70', idleClass: 'text-slate-500 hover:bg-orange-50' },
  { id: 'normal', icon: '🐕', label: '普通动物', count: normalPets.value.length, activeClass: 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg shadow-orange-200/70', idleClass: 'text-slate-500 hover:bg-orange-50' },
  { id: 'mythic', icon: '✨', label: '神兽', count: mythicPets.value.length, activeClass: 'bg-gradient-to-r from-purple-400 to-fuchsia-400 text-white shadow-lg shadow-purple-200/70', idleClass: 'text-slate-500 hover:bg-purple-50' }
])

function isMythic(pet) {
  return MYTHIC_IDS.includes(pet.id)
}

function openPet(pet) {
  selectedPet.value = pet
  previewStage.value = 1
}

function categoryButtonClass(tab) {
  return activeCategory.value === tab.id ? tab.activeClass : tab.idleClass
}

function stageButtonClass(lv) {
  if (previewStage.value !== lv) return 'border-transparent hover:border-orange-200'
  return isMythic(selectedPet.value)
    ? 'border-purple-400 ring-4 ring-purple-200 shadow-lg scale-105'
    : 'border-orange-400 ring-4 ring-orange-200 shadow-lg scale-105'
}
</script>

<template>
  <div class="relative -mt-2 sm:-mt-4 min-h-screen overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-50 via-rose-50 to-purple-100 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
    <div class="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl"></div>
    <div class="pointer-events-none absolute top-48 -left-24 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl"></div>

    <div class="relative mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <section class="overflow-hidden rounded-[2rem] border-2 border-white/80 bg-white/70 p-4 shadow-[0_24px_70px_-35px_rgba(244,114,182,0.65)] backdrop-blur-xl sm:p-6 lg:p-7">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="min-w-0">
            <div class="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600 ring-1 ring-orange-200">
              <span>🏆</span>
              <span>{{ classStore.currentClass?.name || '班级宠物园' }}</span>
            </div>
            <h2 class="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
              荣耀排行榜
            </h2>
            <p class="mt-2 max-w-2xl text-sm font-bold text-slate-500 sm:text-base">
              {{ rankSubtitle }}
            </p>
          </div>

          <div class="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[24rem]">
            <div class="rounded-2xl bg-white/85 p-3 text-center shadow-sm ring-1 ring-orange-100">
              <p class="text-[11px] font-black text-slate-400">同学数</p>
              <p class="mt-1 text-2xl font-black text-slate-800">{{ rankedStudents.length }}</p>
            </div>
            <div class="rounded-2xl bg-white/85 p-3 text-center shadow-sm ring-1 ring-rose-100">
              <p class="text-[11px] font-black text-slate-400">当前维度</p>
              <p class="mt-1 text-sm font-black text-rose-500 sm:text-base">{{ rankTitle }}</p>
            </div>
            <div class="rounded-2xl bg-white/85 p-3 text-center shadow-sm ring-1 ring-amber-100">
              <p class="text-[11px] font-black text-slate-400">冠军成绩</p>
              <p class="mt-1 truncate text-sm font-black text-amber-600 sm:text-base">{{ championScore }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-full bg-white/75 p-1.5 shadow-inner ring-1 ring-white">
          <div class="grid grid-cols-2 gap-1.5">
            <button
              @click="rankBy = 'food'"
              :class="rankBy === 'food' ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg shadow-orange-200/70' : 'text-slate-500 hover:bg-orange-50'"
              class="rounded-full px-4 py-2.5 text-sm font-black transition-all duration-300"
            >
              🍖 食物排行
            </button>
            <button
              @click="rankBy = 'badges'"
              :class="rankBy === 'badges' ? 'bg-gradient-to-r from-purple-400 to-fuchsia-400 text-white shadow-lg shadow-purple-200/70' : 'text-slate-500 hover:bg-purple-50'"
              class="rounded-full px-4 py-2.5 text-sm font-black transition-all duration-300"
            >
              🏅 徽章排行
            </button>
          </div>
        </div>
      </section>

      <section v-if="rankedStudents.length" class="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div class="rounded-[2rem] border-2 border-white/80 bg-white/65 p-4 shadow-[0_24px_70px_-40px_rgba(251,146,60,0.75)] backdrop-blur-xl sm:p-6">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 class="text-xl font-black text-slate-800 sm:text-2xl">冠军领奖台</h3>
              <p class="text-xs font-bold text-slate-400 sm:text-sm">前三名高光展示</p>
            </div>
            <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-600 ring-1 ring-amber-200">Top 3</span>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end sm:gap-4">
            <div
              v-for="winner in podiumStudents"
              :key="winner.student.id"
              class="group relative flex flex-col items-center overflow-hidden rounded-[1.75rem] border-2 bg-white/85 p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              :class="podiumCardClass(winner.rank)"
              :style="{ order: winner.order }"
            >
              <div class="absolute inset-x-6 top-0 h-20 rounded-full blur-2xl" :class="podiumGlowClass(winner.rank)"></div>
              <span class="relative text-3xl sm:text-4xl">{{ winner.medal }}</span>
              <div class="relative mt-2 flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-white to-orange-50 shadow-inner ring-2 ring-white sm:h-28 sm:w-28">
                <img v-if="winner.student.pet_type" :src="getPetImage(winner.student)" class="h-20 w-20 object-contain drop-shadow-md sm:h-24 sm:w-24" :class="winner.rank === 1 ? 'animate-glow-gold' : 'animate-float-idle'" />
                <span v-else class="text-4xl">🥚</span>
              </div>
              <p class="mt-3 max-w-full truncate text-lg font-black text-slate-800">{{ winner.student.name }}</p>
              <p class="mt-1 rounded-full px-3 py-1 text-sm font-black" :class="podiumScoreClass(winner.rank)">{{ getScore(winner.student) }}</p>
              <div class="mt-4 flex w-full items-end justify-center rounded-t-[1.5rem] text-2xl font-black text-white shadow-inner" :class="podiumBaseClass(winner.rank)" :style="{ height: winner.height }">
                No.{{ winner.rank }}
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-[2rem] border-2 border-white/80 bg-white/70 p-4 shadow-[0_24px_70px_-40px_rgba(168,85,247,0.55)] backdrop-blur-xl sm:p-6">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 class="text-xl font-black text-slate-800 sm:text-2xl">完整榜单</h3>
              <p class="text-xs font-bold text-slate-400 sm:text-sm">每一次努力都看得见</p>
            </div>
            <span class="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-600 ring-1 ring-purple-200">{{ rankTitle }}</span>
          </div>

          <div class="grid gap-3">
            <div
              v-for="(s, i) in rankedStudents"
              :key="s.id"
              class="group relative overflow-hidden rounded-2xl border border-white bg-white/85 p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-4"
              :class="i < 3 ? 'ring-1 ring-amber-100' : ''"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-black shadow-inner" :class="rankBadgeClass(i)">
                  <span v-if="i === 0">🥇</span>
                  <span v-else-if="i === 1">🥈</span>
                  <span v-else-if="i === 2">🥉</span>
                  <span v-else>{{ i + 1 }}</span>
                </div>

                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-white ring-1 ring-orange-100">
                  <img v-if="s.pet_type" :src="getPetImage(s)" class="h-12 w-12 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
                  <span v-else class="text-2xl">🥚</span>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-base font-black text-slate-800 sm:text-lg">{{ s.name }}</p>
                      <p class="text-[11px] font-bold text-slate-400">第 {{ i + 1 }} 名</p>
                    </div>
                    <div class="shrink-0 rounded-2xl bg-orange-50 px-3 py-1.5 text-sm font-black text-orange-600 ring-1 ring-orange-100">
                      {{ getScore(s) }}
                    </div>
                  </div>
                  <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full rounded-full bg-gradient-to-r from-orange-400 via-rose-400 to-purple-400 transition-all duration-500" :style="{ width: `${getProgress(s)}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="rounded-[2rem] border-2 border-dashed border-white bg-white/65 px-6 py-16 text-center shadow-sm backdrop-blur-xl">
        <p class="text-6xl">🥚</p>
        <h3 class="mt-4 text-2xl font-black text-slate-700">还没有学生数据</h3>
        <p class="mt-2 text-sm font-bold text-slate-400">添加同学并开始喂养后，排行榜就会亮起来。</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useClassStore } from '../stores/class.js'
import { PETS, getPetImageUrl } from '../utils/pets.js'

const classStore = useClassStore()
const rankBy = ref('food')

const rankedStudents = computed(() => {
  const list = [...classStore.students]
  if (rankBy.value === 'food') list.sort((a, b) => b.food_count - a.food_count)
  else list.sort((a, b) => (b.badges || []).length - (a.badges || []).length)
  return list
})

const rankTitle = computed(() => rankBy.value === 'food' ? '食物排行' : '徽章排行')
const rankSubtitle = computed(() => rankBy.value === 'food'
  ? '按食物数量展示同学们的成长进度，看看谁的小宠物今天最开心。'
  : '按徽章数量展示同学们的荣耀收集，记录每一次闪光表现。'
)
const maxScore = computed(() => Math.max(1, ...rankedStudents.value.map(getScoreValue)))
const championScore = computed(() => rankedStudents.value[0] ? getScore(rankedStudents.value[0]) : '暂无')

const podiumStudents = computed(() => {
  const config = [
    { index: 1, rank: 2, medal: '🥈', order: 1, height: '4.5rem' },
    { index: 0, rank: 1, medal: '👑', order: 2, height: '6.5rem' },
    { index: 2, rank: 3, medal: '🥉', order: 3, height: '3.75rem' }
  ]
  return config
    .filter(item => rankedStudents.value[item.index])
    .map(item => ({ ...item, student: rankedStudents.value[item.index] }))
})

function getScoreValue(s) {
  if (!s) return 0
  if (rankBy.value === 'food') return Number(s.food_count) || 0
  return (s.badges || []).length
}

function getScore(s) {
  if (rankBy.value === 'food') return `🍖 ${s.food_count}`
  return `🏅 ${(s.badges || []).length}`
}

function getProgress(s) {
  return Math.max(8, Math.round((getScoreValue(s) / maxScore.value) * 100))
}

function getPetImage(s) {
  if (!s?.pet_type) return ''
  const pet = PETS.find(p => p.id === s.pet_type)
  if (!pet) return ''
  const stages = classStore.currentClass?.growth_stages || [0,5,10,20,30,45,60,75,90,100]
  let stage = 1
  for (let i = stages.length - 1; i >= 0; i--) {
    if (s.food_count >= stages[i]) { stage = i + 1; break }
  }
  return getPetImageUrl(pet.id, stage)
}

function podiumCardClass(rank) {
  if (rank === 1) return 'border-amber-200 sm:-translate-y-4'
  if (rank === 2) return 'border-slate-200'
  return 'border-orange-200'
}

function podiumGlowClass(rank) {
  if (rank === 1) return 'bg-amber-300/35'
  if (rank === 2) return 'bg-slate-300/35'
  return 'bg-orange-300/35'
}

function podiumScoreClass(rank) {
  if (rank === 1) return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
  if (rank === 2) return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
  return 'bg-orange-100 text-orange-700 ring-1 ring-orange-200'
}

function podiumBaseClass(rank) {
  if (rank === 1) return 'bg-gradient-to-b from-amber-300 to-orange-500 pb-5'
  if (rank === 2) return 'bg-gradient-to-b from-slate-300 to-slate-500 pb-4'
  return 'bg-gradient-to-b from-orange-300 to-orange-600 pb-4'
}

function rankBadgeClass(index) {
  if (index === 0) return 'bg-amber-100 text-amber-600 ring-1 ring-amber-200'
  if (index === 1) return 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
  if (index === 2) return 'bg-orange-100 text-orange-600 ring-1 ring-orange-200'
  return 'bg-purple-50 text-purple-500 ring-1 ring-purple-100'
}
</script>

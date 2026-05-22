<template>
  <div
    class="relative rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer bg-white"
    :class="{
      'cursor-pointer': !readOnly,
      'cursor-default': readOnly,
      'ring-4 ring-orange-400 scale-[0.98] opacity-90': batchMode && selected,
      'border-2 border-dashed border-gray-300 bg-white/50 opacity-70 hover:opacity-100': batchMode && !selected,
      'ring-4 ring-orange-400 shadow-xl shadow-orange-200/50 animate-card-breathe': !batchMode && selected,
      'border-2 border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:-translate-y-1': !batchMode && !selected,
    }"
    :style="!batchMode && !selected && student.pet_type ? { borderColor: 'rgb(244,114,182)', boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 4px 6px -1px rgba(244,114,182,0.25)' } : {}"
    @click="!readOnly && $emit(batchMode ? 'select' : 'click')"
  >
    <!-- 批量选择勾选框 -->
    <div v-if="batchMode" class="absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-40"
      :class="selected ? 'bg-orange-400 border-orange-400 text-white scale-110 shadow-md' : 'bg-white/80 border-gray-300 text-transparent'">
      <span class="text-sm font-bold" v-show="selected">✓</span>
    </div>

    <!-- 宠物图片区 (aspect-square 正方形) -->
    <div class="aspect-square relative overflow-hidden rounded-t-2xl"
      :class="student.pet_type ? 'bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100' : 'bg-gradient-to-br from-gray-100 to-gray-50'">

      <!-- 无宠物：显示姓名首字 -->
      <div v-if="!student.pet_type" class="w-full h-full flex items-center justify-center">
        <span class="text-4xl sm:text-5xl font-black text-gray-300">{{ student.name?.charAt(0) || '?' }}</span>
      </div>

      <!-- 有宠物：图片 -->
      <div v-else class="w-full h-full flex items-center justify-center animate-float-idle">
        <img v-if="petImageUrl" :src="petImageUrl" :alt="student.pet_name || '宠物'"
          class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 p-2"
          :class="{ 'animate-bounce': justScored }" />
        <div v-else class="text-xs text-red-300 font-bold text-center p-2">已下架</div>
      </div>

      <!-- 宠物名角标（右上角） -->
      <div v-if="student.pet_type && student.pet_name" class="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full text-white font-bold bg-black/40 backdrop-blur-sm shadow-md z-10 max-w-[60%] truncate">
        {{ student.pet_name }}
      </div>

      <!-- 等级徽章（右下角） -->
      <div v-if="student.pet_type" class="absolute bottom-2 right-2 z-10">
        <span class="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full text-white shadow-lg"
          :class="levelBadgeColor">Lv.{{ petStage }}</span>
      </div>

      <!-- 操作按钮（悬停显示，左上角） -->
      <div v-if="student.pet_type && !batchMode && !readOnly"
        class="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button class="w-8 h-8 flex items-center justify-center bg-white/95 rounded-full text-base shadow-lg hover:bg-white hover:scale-110 transition-all active:scale-90"
          title="保存收集卡" @click.stop="$emit('print-cert')">🖨️</button>
        <button class="w-8 h-8 flex items-center justify-center bg-white/95 rounded-full text-base shadow-lg hover:bg-white hover:scale-110 transition-all active:scale-90"
          title="AI评语" @click.stop="$emit('ai-evaluate')">✨</button>
        <button class="w-8 h-8 flex items-center justify-center bg-white/95 rounded-full text-base shadow-lg hover:bg-white hover:scale-110 transition-all active:scale-90"
          title="更换宠物" @click.stop="$emit('change-pet')">🔄</button>
      </div>

      <!-- 飞入食物动效 -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-50">
        <div v-for="food in flyingFoods" :key="food.id"
          class="absolute left-1/2 bottom-4 animate-feed-fly flex justify-center items-center">
          <span class="text-3xl drop-shadow-2xl">{{ food.icon }}</span>
        </div>
      </div>
    </div>

    <!-- 信息区 -->
    <div class="p-3 sm:p-4">
      <!-- 学生姓名 -->
      <h3 class="font-bold text-base sm:text-lg text-gray-800 group-hover:text-orange-500 transition-colors truncate leading-tight mb-2">
        {{ student.name }}
      </h3>

      <!-- 爱心值 + 积分行 -->
      <div v-if="student.pet_type" class="flex items-center justify-between text-sm mb-2.5">
        <div class="flex items-center gap-1 text-purple-500 font-medium">
          <span>💜</span>
          <span class="font-bold"><OdometerNumber :value="student.food_count" /></span>
          <span class="text-gray-300">/</span>
          <span class="text-gray-400 text-xs">{{ maxFood }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-yellow-400">⭐</span>
          <span class="font-bold text-orange-500 text-sm"><OdometerNumber :value="student.badges ? student.badges.length : 0" /></span>
        </div>
      </div>

      <!-- 无宠物时的积分 -->
      <div v-else class="flex items-center gap-1 text-gray-400 text-sm mb-2.5">
        <span>🥚</span><span class="font-bold text-xs">点击领养宠物</span>
      </div>

      <!-- 进度条 -->
      <div v-if="student.pet_type" class="bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div class="h-full progress-glow rounded-full transition-all duration-500"
          :style="{ width: `${progressPercent}%` }"></div>
      </div>

      <!-- 满级毕业按钮 -->
      <button v-if="isMaxLevel && !readOnly"
        class="mt-2.5 w-full py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:from-yellow-500 hover:to-amber-600 active:scale-95 transition-all pointer-events-auto"
        @click.stop="$emit('graduate')">
        ✨ 召唤守护兽
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { PETS, getPetImageUrl } from '../utils/pets'
import OdometerNumber from './OdometerNumber.vue'
import { useClassStore } from '../stores/class'

const props = defineProps({
  student: Object,
  batchMode: Boolean,
  undoMode: Boolean,
  selected: Boolean,
  readOnly: { type: Boolean, default: false },
  growthStages: Array
})

defineEmits(['click', 'select', 'change-pet', 'graduate', 'show-badges', 'print-cert', 'ai-evaluate'])

const justScored = ref(false)
const flyingFoods = ref([])
let foodIdCounter = 0

watch(() => props.student.food_count, (newVal, oldVal) => {
  if (oldVal !== undefined && newVal !== oldVal) {
    justScored.value = true
    setTimeout(() => { justScored.value = false }, 800)
    if (newVal > oldVal) {
      const id = foodIdCounter++
      const icons = ['🍖', '🍎', '🍓', '🥕', '✨', '🍬', '🍔']
      flyingFoods.value.push({ id, icon: icons[Math.floor(Math.random() * icons.length)] })
      setTimeout(() => { flyingFoods.value = flyingFoods.value.filter(f => f.id !== id) }, 1000)
    }
  }
})

const classStore = useClassStore()

const maxFood = computed(() => {
  const stages = props.growthStages || [0,5,10,20,30,45,60,75,90,100]
  return stages[stages.length - 1]
})

const progressPercent = computed(() => Math.min(100, (props.student.food_count / maxFood.value) * 100))
const isMaxLevel = computed(() => props.student.food_count >= maxFood.value)

const petStage = computed(() => {
  if (!props.student.pet_type) return 1
  const stages = props.growthStages || [0,5,10,20,30,45,60,75,90,100]
  let stage = 1
  for (let i = stages.length - 1; i >= 0; i--) {
    if (props.student.food_count >= stages[i]) { stage = i + 1; break }
  }
  return stage
})

const levelBadgeColor = computed(() => {
  const s = petStage.value
  if (s <= 2) return 'bg-gradient-to-r from-gray-400 to-slate-400'
  if (s <= 4) return 'bg-gradient-to-r from-blue-400 to-cyan-400'
  if (s <= 6) return 'bg-gradient-to-r from-purple-400 to-violet-400'
  return 'bg-gradient-to-r from-orange-400 to-rose-400'
})

const petImageUrl = computed(() => {
  const pet = PETS.find(p => p.id === props.student.pet_type)
  if (!pet) return ''
  return getPetImageUrl(pet.id, petStage.value)
})

const groupName = computed(() => {
  if (!props.student.group_id) return ''
  const g = classStore.groups.find(g => g.id === props.student.group_id)
  return g ? g.name : ''
})
</script>

<style scoped>
@keyframes feed-fly {
  0% { transform: translate(-50%, 0) scale(0.5) rotate(-20deg); opacity: 0; }
  20% { opacity: 1; transform: translate(-50%, -30px) scale(1.3) rotate(10deg); }
  70% { opacity: 1; transform: translate(-50%, -100px) scale(1) rotate(-10deg); }
  100% { transform: translate(-50%, -130px) scale(0) rotate(20deg); opacity: 0; }
}
.animate-feed-fly {
  animation: feed-fly 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>

<template>
  <div class="min-h-screen text-gray-800 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-4">

    <!-- 顶部双层导航 -->
    <header ref="topPanelRef" class="fixed top-0 left-0 right-0 z-50">
      <!-- 第一层：主 header 渐变 -->
      <div class="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-3 sm:px-4 md:px-6 py-2.5 flex items-center justify-between gap-2 shadow-md">
        <!-- Logo + 班级切换 -->
        <button @click="showClassModal = true" class="flex items-center gap-2 min-w-0">
          <span class="text-2xl animate-bounce-slow shrink-0">🐾</span>
          <div class="min-w-0">
            <p class="text-white font-black text-sm sm:text-base leading-tight truncate max-w-[8rem] sm:max-w-[16rem]">
              {{ classStore.currentClass?.name || '班级宠物园' }}
            </p>
            <p class="text-white/70 text-[10px] leading-none">点击切换班级 ▾</p>
          </div>
        </button>

        <!-- 右侧工具栏（仅首页） -->
        <div v-if="route.path === '/'" class="flex items-center gap-1.5 shrink-0">
          <button @click="batchMode = !batchMode; if (batchMode) groupMode = false"
            class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all border"
            :class="batchMode ? 'bg-white text-orange-500 border-white' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'">
            <span>👥</span><span class="hidden min-[400px]:inline">批量</span>
          </button>
          <button @click="groupMode = !groupMode; if (groupMode) batchMode = false"
            class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all border"
            :class="groupMode ? 'bg-white text-purple-500 border-white' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'">
            <span>📋</span><span class="hidden min-[400px]:inline">分组</span>
          </button>
          <select v-model="sortMode" class="appearance-none bg-white/20 text-white border border-white/30 rounded-full pl-2 pr-5 py-1 text-xs font-bold outline-none cursor-pointer hover:bg-white/30 transition-colors relative">
            <option value="manual" class="text-gray-800">排序 ⇅</option>
            <option value="name" class="text-gray-800">字典</option>
            <option value="food" class="text-gray-800">食物</option>
            <option value="progress" class="text-gray-800">进度</option>
          </select>
        </div>

        <!-- 搜索框（首页桌面端） -->
        <div v-if="route.path === '/'" class="hidden md:block flex-1 max-w-xs mx-2">
          <input v-model="searchQuery" type="text" placeholder="🔍 搜索学生..."
            class="w-full px-4 py-1.5 bg-white/20 placeholder-white/60 text-white rounded-full border border-white/30 text-sm outline-none focus:bg-white/30 font-bold" />
        </div>
      </div>

      <!-- 第二层：导航 tab 栏 -->
      <div class="bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-rose-500/90 backdrop-blur-sm border-t border-white/20 px-2 sm:px-4">
        <nav class="flex items-center gap-0.5 overflow-x-auto scrollbar-hide max-w-3xl">
          <router-link v-for="tab in tabs" :key="tab.to" :to="tab.to"
            class="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-t-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0"
            :class="isActive(tab.to) ? 'bg-white text-orange-600 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'">
            <span>{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </router-link>
        </nav>
      </div>

      <!-- 搜索框（首页移动端第三行） -->
      <div v-if="route.path === '/' " class="md:hidden bg-orange-50/95 backdrop-blur-sm px-3 py-2 border-t border-orange-100">
        <input v-model="searchQuery" type="text" placeholder="🔍 搜索学生..."
          class="w-full px-4 py-1.5 bg-white rounded-full border border-orange-200 text-sm outline-none focus:border-orange-400 font-bold text-gray-700 placeholder-gray-400" />
      </div>
    </header>

    <!-- 顶部占位 -->
    <div :style="{ height: `${topPanelHeight}px` }"></div>

    <!-- 分组筛选栏 -->
    <div v-if="classStore.groups.length && route.path === '/' && !groupMode"
      class="mb-3 relative z-40"
      :class="isFullWidthPage ? 'w-full px-3 sm:px-4 md:px-6 lg:px-8' : 'max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6'">
      <div class="bg-white/70 backdrop-blur-md border border-orange-100 rounded-full px-1.5 py-1 flex gap-1 overflow-x-auto shadow-sm">
        <button @click="activeGroup = null"
          :class="activeGroup === null ? 'bg-orange-100 text-orange-600 font-extrabold' : 'text-slate-500 hover:bg-orange-50'"
          class="px-3.5 py-1 rounded-full text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5">
          全部同学
          <span v-if="activeGroup === null" class="text-[10px] bg-orange-200 px-1.5 py-0.5 rounded-full">{{ groupStats.allCount }}</span>
        </button>
        <button v-for="g in groupStats.groupsList" :key="g.id" @click="activeGroup = g.id"
          :class="activeGroup === g.id ? 'bg-orange-100 text-orange-600 font-extrabold' : 'text-slate-500 hover:bg-orange-50'"
          class="px-3.5 py-1 rounded-full text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5">
          {{ g.name }}
          <span v-if="activeGroup === g.id" class="text-[10px] bg-orange-200 px-1.5 py-0.5 rounded-full">{{ g.count }}</span>
        </button>
        <button @click="activeGroup = 'ungrouped'"
          :class="activeGroup === 'ungrouped' ? 'bg-orange-100 text-orange-600 font-extrabold' : 'text-slate-500 hover:bg-orange-50'"
          class="px-3.5 py-1 rounded-full text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5">
          未分组
          <span v-if="activeGroup === 'ungrouped'" class="text-[10px] bg-orange-200 px-1.5 py-0.5 rounded-full">{{ groupStats.ungroupedCount }}</span>
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <main
      class="w-full py-2 sm:py-4"
      :class="isFullWidthPage ? 'px-3 sm:px-4 md:px-6 lg:px-8' : 'max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8'"
    >
      <router-view
        :search-query="searchQuery"
        :batch-mode="batchMode"
        :undo-mode="undoMode"
        :active-group="activeGroup"
        :sort-mode="sortMode"
        :group-mode="groupMode"
        :selected-students="selectedStudents"
        @select-student="toggleStudent"
        @exit-group-mode="groupMode = false"
      />
    </main>

    <!-- 批量操作底栏 -->
    <div v-if="batchMode" class="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl shadow-2xl border-2 border-orange-100 rounded-2xl px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center gap-4 z-50 w-[calc(100%-1rem)] sm:w-[90%] md:w-auto max-w-sm md:max-w-none">
      <span class="font-bold text-gray-600">已选 <span class="text-orange-500 text-xl mx-1">{{ selectedIds.length }}</span> 人</span>
      <div class="flex gap-3">
        <button @click="toggleSelectAll" class="btn-toy px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-600">
          {{ isAllSelected ? '取消全选' : '全选同学们' }}
        </button>
        <button @click="showBatchScoreModal = true" :disabled="!selectedIds.length"
          class="btn-toy px-6 py-2.5 bg-gradient-to-r from-orange-400 to-rose-400 text-white rounded-xl text-sm font-bold disabled:opacity-50 shadow-md flex items-center gap-2">
          <span class="text-lg">✨</span> 批量喂养
        </button>
      </div>
    </div>

    <!-- 班级切换弹窗 -->
    <ClassModal v-if="showClassModal" @close="showClassModal = false" />

    <!-- 批量喂养弹窗 -->
    <ScoreRuleModal
      v-if="showBatchScoreModal"
      :student="null"
      :batch-ids="selectedIds"
      @close="showBatchScoreModal = false"
      @scored="onBatchScored"
    />

    <!-- 随机点名 -->
    <RandomPick v-if="showRandomPick" @close="showRandomPick = false" />

    <!-- 课堂计时器 -->
    <ClassTimer v-if="showTimer" @close="showTimer = false" />
  </div>

  <!-- 底部 TabBar (仅移动端) -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-[999] bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.08)] border-t border-orange-100 pb-[env(safe-area-inset-bottom)]">
    <nav class="flex items-center justify-around px-1 py-1.5">
      <router-link v-for="tab in mobileTabs" :key="tab.to" :to="tab.to"
        class="flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all"
        :class="isActive(tab.to) ? 'bg-orange-50 text-orange-500 scale-105' : 'text-slate-400'">
        <span class="text-xl mb-0.5">{{ tab.icon }}</span>
        <span class="text-[10px] font-bold leading-none">{{ tab.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useClassStore } from '../stores/class'
import { useTheme } from '../composables/useTheme'
import ClassModal from '../components/ClassModal.vue'
import ScoreRuleModal from '../components/ScoreRuleModal.vue'
import RandomPick from '../components/RandomPick.vue'
import ClassTimer from '../components/ClassTimer.vue'

const classStore = useClassStore()
const route = useRoute()
const { setTheme } = useTheme()
const searchQuery = ref('')
const batchMode = ref(false)
const groupMode = ref(false)
const undoMode = ref(false)
const activeGroup = ref(null)
const sortMode = ref('manual')
const selectedIds = ref([])
const showClassModal = ref(false)
const showBatchScoreModal = ref(false)
const showRandomPick = ref(false)
const showTimer = ref(false)
const topPanelRef = ref(null)
const topPanelHeight = ref(120)
let topPanelObserver = null

const tabs = [
  { to: '/', icon: '🏠', label: '首页' },
  { to: '/leaderboard', icon: '🏆', label: '排行' },
  { to: '/history', icon: '📋', label: '记录' },
  { to: '/shop', icon: '🛍️', label: '小卖部' },
  { to: '/encyclopedia', icon: '📖', label: '图鉴' },
  { to: '/settings', icon: '⚙️', label: '设置' },
]

const mobileTabs = [
  { to: '/', icon: '🏠', label: '首页' },
  { to: '/leaderboard', icon: '🏆', label: '排行' },
  { to: '/history', icon: '📋', label: '记录' },
  { to: '/encyclopedia', icon: '📖', label: '图鉴' },
  { to: '/settings', icon: '⚙️', label: '设置' },
]

const isFullWidthPage = computed(() => ['/', '/leaderboard', '/encyclopedia'].includes(route.path))

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function updateTopPanelHeight() {
  const el = topPanelRef.value
  if (!el) return
  topPanelHeight.value = Math.ceil(el.getBoundingClientRect().height)
}

const selectedStudents = computed(() => new Set(selectedIds.value))

const groupStats = computed(() => {
  const counts = {}
  if (classStore.students) {
    classStore.students.forEach(s => {
      const gid = s.group_id || 'ungrouped'
      counts[gid] = (counts[gid] || 0) + 1
    })
  }
  const allCount = classStore.students?.length || 0
  const ungroupedCount = counts['ungrouped'] || 0
  const groupsList = classStore.groups.map(g => ({
    id: g.id, name: g.name, count: counts[g.id] || 0
  }))
  return { allCount, ungroupedCount, groupsList }
})

function toggleStudent(id) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

const validStudents = computed(() => classStore.students.filter(s => s.pet_type))
const isAllSelected = computed(() => validStudents.value.length > 0 && selectedIds.value.length === validStudents.value.length)

function toggleSelectAll() {
  if (isAllSelected.value) selectedIds.value = []
  else selectedIds.value = validStudents.value.map(s => s.id)
}

function exitBatch() {
  batchMode.value = false
  selectedIds.value = []
}

async function onBatchScored() {
  showBatchScoreModal.value = false
  try { await classStore.fetchStudents() } catch {}
  exitBatch()
}

onMounted(async () => {
  await nextTick()
  updateTopPanelHeight()
  window.addEventListener('resize', updateTopPanelHeight)
  if (typeof ResizeObserver !== 'undefined' && topPanelRef.value) {
    topPanelObserver = new ResizeObserver(updateTopPanelHeight)
    topPanelObserver.observe(topPanelRef.value)
  }
  try {
    await classStore.fetchClasses()
    if (classStore.currentClass) {
      await Promise.all([
        classStore.fetchStudents(),
        classStore.fetchGroups(),
        classStore.fetchScoreRules()
      ])
    }
  } catch {}
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTopPanelHeight)
  topPanelObserver?.disconnect()
  topPanelObserver = null
})
</script>

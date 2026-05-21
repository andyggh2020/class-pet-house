<template>
  <div class="max-w-4xl mx-auto">
    <!-- 标题 + 统计 -->
    <div class="flex items-center justify-between mb-4 px-1">
      <h2 class="text-xl font-black text-gray-700 flex items-center gap-2">
        <span>📋</span> 成长记录
        <span class="text-sm font-bold text-gray-400 ml-1">共 {{ total }} 条</span>
      </h2>
    </div>

    <!-- 搜索框 -->
    <div class="mb-4">
      <input v-model="searchQuery" type="text" placeholder="🔍 搜索学生姓名或事件..."
        class="w-full sm:max-w-sm px-4 py-2.5 rounded-xl border-2 border-orange-100 bg-white text-sm font-bold text-gray-700 outline-none focus:border-orange-400 placeholder-gray-400 transition-colors shadow-sm" />
    </div>

    <!-- 表格卡片 -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-orange-50">
      <!-- 表头 -->
      <div class="grid grid-cols-[2rem_1fr_4rem_1fr_5rem] sm:grid-cols-[2.5rem_1fr_5rem_1fr_6rem_5rem] bg-orange-50 border-b border-orange-100 px-3 sm:px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wide">
        <div></div>
        <div>学生</div>
        <div class="text-center">积分</div>
        <div>事件</div>
        <div class="hidden sm:block text-center">时间</div>
        <div class="text-center">操作</div>
      </div>

      <!-- 数据行 -->
      <div v-if="filteredHistory.length">
        <div v-for="(h, i) in filteredHistory" :key="h.id"
          class="grid grid-cols-[2rem_1fr_4rem_1fr_5rem] sm:grid-cols-[2.5rem_1fr_5rem_1fr_6rem_5rem] items-center px-3 sm:px-4 py-2.5 border-b border-gray-50 hover:bg-orange-50/40 transition-colors"
          :class="{ 'opacity-40': h.is_revoked }">
          <!-- 类型图标 -->
          <div class="text-base">
            {{ h.type === 'graduate' ? '🎓' : h.type === 'exchange' ? '🛍️' : h.value > 0 ? '➕' : '➖' }}
          </div>

          <!-- 学生头像+名字 -->
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
              :style="{ background: avatarColor(h.Student?.name) }">
              {{ h.Student?.name?.charAt(0) || '?' }}
            </div>
            <span class="text-sm font-bold text-gray-700 truncate">{{ h.Student?.name || '未知' }}</span>
          </div>

          <!-- 积分 -->
          <div class="text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-black"
              :class="h.value > 0 ? 'bg-green-100 text-green-600' : h.value < 0 ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'">
              {{ h.value > 0 ? '+' : '' }}{{ h.value }}
            </span>
          </div>

          <!-- 事件名 -->
          <div class="min-w-0">
            <span class="text-xs sm:text-sm text-gray-600 truncate block">{{ h.rule_name || h.type }}</span>
            <span v-if="h.is_revoked" class="text-[10px] text-red-400 font-bold">已撤回</span>
          </div>

          <!-- 时间（桌面端） -->
          <div class="hidden sm:block text-center text-xs text-gray-400 font-medium">
            {{ formatTime(h.createdAt) }}
          </div>

          <!-- 撤回按钮 -->
          <div class="text-center">
            <button v-if="!h.is_revoked && h.type === 'score'"
              @click="revoke(h)"
              class="text-xs text-orange-400 hover:text-orange-600 font-bold transition-colors px-1">
              撤回
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="py-16 text-center text-gray-400">
        <p class="text-4xl mb-2">📝</p>
        <p class="font-bold">{{ searchQuery ? `没有找到"${searchQuery}"的记录` : '暂无记录' }}</p>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-5">
      <button @click="goPage(currentPage - 1)" :disabled="currentPage === 1"
        class="w-9 h-9 rounded-xl bg-white border border-orange-100 text-sm font-bold text-gray-500 hover:bg-orange-50 disabled:opacity-30 transition-all shadow-sm">‹</button>

      <button v-for="p in pageNumbers" :key="p" @click="goPage(p)"
        class="w-9 h-9 rounded-xl text-sm font-bold transition-all shadow-sm"
        :class="p === currentPage ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-orange-100 text-gray-600 hover:bg-orange-50'">
        {{ p }}
      </button>

      <button @click="goPage(currentPage + 1)" :disabled="currentPage === totalPages"
        class="w-9 h-9 rounded-xl bg-white border border-orange-100 text-sm font-bold text-gray-500 hover:bg-orange-50 disabled:opacity-30 transition-all shadow-sm">›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useClassStore } from '../stores/class'
import api from '../utils/api'

const classStore = useClassStore()
const history = ref([])
const total = ref(0)
const currentPage = ref(1)
const limit = 30
const searchQuery = ref('')

// 确保数据已加载（直接导航到此页时 MainLayout 可能还未完成 fetch）
onMounted(async () => {
  if (!classStore.currentClass) {
    await classStore.fetchClasses()
  }
  if (classStore.currentClass) {
    loadHistory()
  }
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

const pageNumbers = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const filteredHistory = computed(() => {
  if (!searchQuery.value) return history.value
  const q = searchQuery.value.toLowerCase()
  return history.value.filter(h =>
    h.Student?.name?.toLowerCase().includes(q) ||
    h.rule_name?.toLowerCase().includes(q)
  )
})

watch(() => classStore.currentClass, cls => {
  if (cls) { currentPage.value = 1; loadHistory() }
}, { immediate: true })

watch(currentPage, loadHistory)

async function loadHistory() {
  if (!classStore.currentClass) return
  try {
    const offset = (currentPage.value - 1) * limit
    const data = await api.get(`/history/class/${classStore.currentClass.id}?limit=${limit}&offset=${offset}`)
    history.value = data.rows || []
    total.value = data.count || 0
  } catch {}
}

function goPage(p) {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
}

async function revoke(h) {
  try {
    await api.post('/history/revoke', { record_id: h.id })
    await loadHistory()
  } catch {}
}

function formatTime(t) {
  if (!t) return ''
  try {
    const d = new Date(t)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-')
  } catch { return '' }
}

const AVATAR_COLORS = [
  'linear-gradient(135deg,#fb923c,#f472b6)',
  'linear-gradient(135deg,#a78bfa,#818cf8)',
  'linear-gradient(135deg,#34d399,#06b6d4)',
  'linear-gradient(135deg,#fbbf24,#f97316)',
  'linear-gradient(135deg,#f472b6,#ec4899)',
]
function avatarColor(name) {
  if (!name) return AVATAR_COLORS[0]
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}
</script>

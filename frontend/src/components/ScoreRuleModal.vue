<template>
  <div class="fixed inset-0 bg-slate-950/45 z-[1000] flex items-center justify-center p-3 sm:p-4 backdrop-blur-md" @click.self="$emit('close')">
    <div class="relative w-full max-w-[520px] max-h-[92vh] overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-indigo-50/60 to-rose-50/60 shadow-[0_28px_80px_rgba(15,23,42,0.28)] border border-white/80 flex flex-col animate-slide-up-fade">
      <div class="absolute -top-24 -left-20 w-52 h-52 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-28 -right-20 w-60 h-60 bg-fuchsia-200/45 rounded-full blur-3xl pointer-events-none"></div>

      <!-- 头部 -->
      <div class="relative z-10 px-5 sm:px-6 pt-5 pb-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-black text-indigo-400 tracking-[0.28em] mb-1">选择项目</p>
            <h3 class="font-black text-slate-800 text-2xl sm:text-3xl tracking-tight leading-tight">
              给 <span class="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">{{ student ? student.name : `批量操作 (${batchIds.length}人)` }}</span>
            </h3>
            <p class="text-sm font-bold text-slate-400 mt-1">选择一条规则，立即加分/扣分</p>
          </div>

          <button @click="$emit('close')" class="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 bg-white/70 hover:bg-white shadow-sm border border-white transition-colors text-lg">
            ✕
          </button>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="relative z-10 px-5 sm:px-6 pb-3">
        <div class="w-full h-12 flex items-center bg-white/90 border border-indigo-100 rounded-2xl px-4 transition-all shadow-[0_8px_24px_rgba(99,102,241,0.08)] focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100/70">
          <span class="text-slate-400 mr-2 text-lg">🔍</span>
          <input v-model="filterKeyword" type="text" placeholder="搜索项目，支持拼音首字母，如 cd 搜迟到" class="w-full bg-transparent text-sm text-slate-700 outline-none placeholder-slate-400 font-bold" />
        </div>
      </div>

      <!-- 快捷筛选 Tabs -->
      <div class="relative z-10 px-5 sm:px-6 pb-4">
        <div class="grid grid-cols-3 gap-2 rounded-2xl bg-white/65 p-1.5 border border-white shadow-inner">
          <button @click="filterType = 'all'"
            class="h-10 rounded-xl text-sm font-black transition-all"
            :class="filterType === 'all' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600 hover:bg-white/80'">
            ✨ 全部
          </button>
          <button @click="filterType = 'add'"
            class="h-10 rounded-xl text-sm font-black transition-all"
            :class="filterType === 'add' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-600 hover:bg-white/80'">
            + 加分
          </button>
          <button @click="filterType = 'deduct'"
            class="h-10 rounded-xl text-sm font-black transition-all"
            :class="filterType === 'deduct' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'text-slate-400 hover:text-slate-600 hover:bg-white/80'">
            - 扣分
          </button>
        </div>
      </div>

      <!-- 规则网格 -->
      <div class="overflow-y-auto px-5 sm:px-6 pb-4 custom-scrollbar relative z-10 flex-1 min-h-[320px] space-y-5">
        <section v-for="group in groupedRules" :key="group.id" class="scroll-mt-3">
          <h4 class="sticky top-0 z-10 -mx-1 mb-2 px-1 py-1.5 text-sm font-black text-slate-600 flex items-center gap-2 bg-gradient-to-r from-white/95 via-white/85 to-transparent backdrop-blur-sm">
            <span class="inline-flex w-7 h-7 items-center justify-center rounded-xl bg-white shadow-sm border border-white">{{ group.icon }}</span>
            <span>{{ group.label }}</span>
            <span class="text-xs text-slate-400 font-black">{{ group.rules.length }} 项</span>
          </h4>
          <div class="grid grid-cols-2 min-[420px]:grid-cols-3 gap-3">
            <button v-for="rule in group.rules" :key="rule.id"
              @click="applyRule(rule)"
              class="group relative flex min-h-[132px] flex-col items-center overflow-hidden rounded-[1.35rem] bg-white/92 border transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 focus:outline-none"
              :class="rule.value > 0 ? 'border-emerald-100 hover:border-emerald-300 hover:shadow-[0_14px_28px_rgba(16,185,129,0.16)]' : 'border-rose-100 hover:border-rose-300 hover:shadow-[0_14px_28px_rgba(244,63,94,0.16)]'">
              <div class="absolute inset-x-0 top-0 h-14 opacity-70"
                :class="rule.value > 0 ? 'bg-gradient-to-b from-emerald-50 to-transparent' : 'bg-gradient-to-b from-rose-50 to-transparent'"></div>
              <div class="relative mt-4 w-13 h-13 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-transform group-hover:scale-110 shadow-inner"
                :class="rule.value > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'">
                {{ rule.icon || (rule.value > 0 ? '🌟' : '⚠️') }}
              </div>
              <div class="relative font-black text-slate-700 text-[13px] sm:text-sm text-center w-full leading-snug px-3 line-clamp-2 min-h-[2.4em]">{{ rule.name }}</div>
              <div class="relative mt-auto mb-3 font-black text-xs px-3 py-1 rounded-full flex items-center gap-0.5 font-mono border"
                :class="rule.value > 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'">
                <span>{{ rule.value > 0 ? '+' : '' }}{{ rule.value }}</span>
                <span class="text-[12px] -ml-0.5">🍖</span>
              </div>
            </button>
          </div>
        </section>

        <div v-if="rules.length === 0" class="py-16 text-center text-slate-400 text-sm font-black bg-white/70 rounded-3xl border border-dashed border-slate-200">
          没有找到对应的打分项...
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="relative z-10 px-5 sm:px-6 pb-4 pt-1">
        <div class="text-center text-[11px] text-slate-400 flex justify-center items-center gap-1 font-bold rounded-full bg-white/60 py-2 border border-white">
          ✨ 点击项目直接操作
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClassStore } from '../stores/class'
import { useEscClose } from '../composables/useEscClose'
import api from '../utils/api'
import Dialog from '../utils/dialog'
import { pinyin } from 'pinyin-pro'
import { fireGrandConfetti, firePopConfetti } from '../utils/confetti'
import { audioManager } from '../utils/audio'
import { groupScoreRulesByCategory } from '../utils/scoreRules'

const props = defineProps({
  student: Object,
  batchIds: { type: Array, default: () => [] }
})
const emit = defineEmits(['close', 'scored'])
useEscClose(emit)
const classStore = useClassStore()

const filterKeyword = ref('')
const filterType = ref('all')

const rules = computed(() => {
  let list = classStore.scoreRules || []

  if (filterType.value === 'add') {
    list = list.filter(r => r.value > 0)
  } else if (filterType.value === 'deduct') {
    list = list.filter(r => r.value < 0)
  }

  if (filterKeyword.value) {
    const lowerKwd = filterKeyword.value.toLowerCase().trim()
    list = list.filter(r => {
      const name = (r.name || '').toLowerCase()
      const pyFirstLetters = pinyin(name, { pattern: 'first', toneType: 'none', type: 'array' }).join('').toLowerCase()
      const pyFull = pinyin(name, { toneType: 'none', type: 'array' }).join('').toLowerCase()

      return name.includes(lowerKwd) || pyFirstLetters.includes(lowerKwd) || pyFull.includes(lowerKwd)
    })
  }

  return list
})

const groupedRules = computed(() => groupScoreRulesByCategory(rules.value))

onMounted(async () => {
  if (!classStore.scoreRules.length && classStore.currentClass) {
    await classStore.fetchScoreRules()
  }
})

async function applyRule(rule) {
  audioManager.playPop()
  const targetName = props.student ? props.student.name : `已选的 ${props.batchIds.length} 名学生`

  if (await Dialog.confirm(`确定要给 ${targetName} 使用规则【${rule.name}】(${rule.value}分) 吗？`)) {
    try {
      if (rule.value > 0) {
        audioManager.playScore()
        if (rule.value >= 10) fireGrandConfetti()
        else firePopConfetti()
      } else if (rule.value < 0) {
        audioManager.playPop()
      }

      const ids = props.batchIds.length
        ? props.batchIds
        : [props.student.id]
      await api.post('/history', {
        class_id: classStore.currentClass.id,
        student_ids: ids,
        rule_id: rule.id
      })
      emit('scored')
    } catch (err) {
      Dialog.alert(err.error || '操作失败')
    }
  }
}
</script>

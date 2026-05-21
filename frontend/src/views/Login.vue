<template>
  <div class="min-h-screen flex items-center justify-center p-4" style="background: linear-gradient(135deg, #fff7ed 0%, #fce7f3 50%, #faf5ff 100%)">
    <div class="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-orange-50">
      <!-- 品牌头部 -->
      <div class="text-center mb-6">
        <div class="text-5xl mb-2 animate-bounce-slow inline-block">🐾</div>
        <h1 class="text-2xl font-black text-gray-800">班级宠物园</h1>
        <p class="text-gray-400 text-sm mt-1">登录你的账号，开始今天的冒险</p>
      </div>

      <div v-if="error" class="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 border border-red-100">{{ error }}</div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-500 mb-1.5">用户名</label>
          <input v-model="username" type="text" placeholder="请输入用户名"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange-400 outline-none transition bg-gray-50 focus:bg-white font-medium" />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-500 mb-1.5">密码</label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" @keyup.enter="handleLogin"
              class="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-100 focus:border-orange-400 outline-none transition bg-gray-50 focus:bg-white font-medium" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            </button>
          </div>
        </div>
        <button @click="handleLogin" :disabled="loading"
          class="w-full py-3 bg-gradient-to-r from-orange-400 to-rose-400 text-white rounded-xl font-black text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50">
          {{ loading ? '登录中...' : '🚀 登录' }}
        </button>
      </div>

      <div class="mt-5 text-center text-sm text-gray-400 space-x-4">
        <router-link to="/register" class="hover:text-orange-500 font-bold transition-colors">注册账号</router-link>
        <router-link to="/reset-password" class="hover:text-orange-500 font-bold transition-colors">忘记密码</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '请填写用户名和密码'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const data = await auth.login(username.value, password.value)
    if (data.status === 'not_activated') {
      router.push('/activate')
    } else {
      router.push('/')
    }
  } catch (err) {
    error.value = err.error || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

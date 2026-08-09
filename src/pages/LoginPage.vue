<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Shield, Loader2 } from 'lucide-vue-next'
import NavBar from '@/components/common/NavBar.vue'
import { useStore } from '@/store/useStore'

interface FieldErrors {
  phone?: string
  password?: string
  code?: string
  agreement?: string
}

const router = useRouter()
const store = useStore()
const phone = ref('')
const password = ref('')
const code = ref('')
const showPassword = ref(false)
const agreed = ref(false)
const loginMode = ref<'password' | 'code'>('password')
const loading = ref(false)
const errors = ref<FieldErrors>({})
const codeCountdown = ref(0)

const validatePhone = (v: string) => {
  if (!v.trim()) return '请输入手机号'
  if (!/^1[3-9]\d{9}$/.test(v)) return '请输入正确的11位手机号'
  return ''
}

const validatePassword = (v: string) => {
  if (!v) return '请输入密码'
  if (v.length < 8) return '密码至少8位'
  return ''
}

const validateCode = (v: string) => {
  if (!v.trim()) return '请输入验证码'
  if (!/^\d{6}$/.test(v)) return '请输入6位数字验证码'
  return ''
}

const handleSendCode = () => {
  const phoneErr = validatePhone(phone.value)
  if (phoneErr) {
    errors.value = { ...errors.value, phone: phoneErr }
    return
  }
  errors.value = { ...errors.value, phone: '' }
  codeCountdown.value = 60
  const timer = setInterval(() => {
    if (codeCountdown.value <= 1) {
      clearInterval(timer)
      codeCountdown.value = 0
      return
    }
    codeCountdown.value = codeCountdown.value - 1
  }, 1000)
}

const handleLogin = () => {
  const newErrors: FieldErrors = {}

  if (loginMode.value === 'password') {
    newErrors.phone = validatePhone(phone.value)
    newErrors.password = validatePassword(password.value)
  } else {
    newErrors.phone = validatePhone(phone.value)
    newErrors.code = validateCode(code.value)
  }

  if (!agreed.value) {
    newErrors.agreement = '请先阅读并同意相关协议'
  }

  const hasError = Object.values(newErrors).some(Boolean)
  errors.value = newErrors
  if (hasError) return

  loading.value = true
  // 模拟登录请求
  setTimeout(() => {
    store.login()
    loading.value = false
    router.push('/')
  }, 800)
}

const onPhoneInput = (e: Event) => {
  phone.value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  errors.value = { ...errors.value, phone: '' }
}
const onPasswordInput = (e: Event) => {
  password.value = (e.target as HTMLInputElement).value
  errors.value = { ...errors.value, password: '' }
}
const onCodeInput = (e: Event) => {
  code.value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  errors.value = { ...errors.value, code: '' }
}
const switchMode = (m: 'password' | 'code') => {
  loginMode.value = m
  errors.value = {}
}
const toggleAgreed = () => {
  agreed.value = !agreed.value
  errors.value = { ...errors.value, agreement: '' }
}
</script>

<template>
  <div class="page-container-no-nav bg-neu-bg relative flex flex-col min-h-screen overflow-hidden">
    <!--顶部导航栏 -->
    <NavBar transparent>
      <template #right>
        <button class="text-neu-text-primary text-base font-semibold" @click="router.push('/register')">
          注册
        </button>
      </template>
    </NavBar>

    <!--品牌展示区 -->
    <div class="relative z-10 flex flex-col items-center mt-16">
      <div
        class="w-20 h-20 rounded-2xl bg-cover bg-center"
        :style="{ backgroundImage: 'url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200&h=200&fit=crop)' }"
      />
      <h1 class="mt-3 text-[28px] font-bold text-neu-text-primary">
        藏锋ART
      </h1>
    </div>

    <!--登录方式切换 -->
    <div class="relative z-10 flex mx-4 mt-6 rounded-2xl neu-inset p-1">
      <button
        class="flex-1 h-10 rounded-xl text-sm font-bold transition-all"
        :class="loginMode === 'password' ? 'neu-raised text-accent-blue' : 'text-neu-text-muted'"
        @click="switchMode('password')"
      >
        密码登录
      </button>
      <button
        class="flex-1 h-10 rounded-xl text-sm font-bold transition-all"
        :class="loginMode === 'code' ? 'neu-raised text-accent-blue' : 'text-neu-text-muted'"
        @click="switchMode('code')"
      >
        验证码登录
      </button>
    </div>

    <!--表单输入区 -->
    <div class="relative z-10 flex flex-col px-4 mt-6" style="gap: 20px">
      <!--手机号 -->
      <div class="flex flex-col">
        <label class="text-sm font-semibold text-neu-text-primary mb-2">
          手机号
        </label>
        <input
          type="tel"
          :maxlength="11"
          :value="phone"
          placeholder="请输入手机号码"
          class="w-full h-12 rounded-2xl bg-neu-bg px-4 text-base text-neu-text-primary placeholder-neu-text-muted outline-none neu-inset"
          :class="errors.phone ? 'ring-2 ring-red-400' : ''"
          style="border: none"
          @input="onPhoneInput"
        />
        <span v-if="errors.phone" class="text-xs text-red-400 mt-1.5 ml-2">{{ errors.phone }}</span>
      </div>

      <!--密码 -->
      <div v-if="loginMode === 'password'" class="flex flex-col">
        <label class="text-sm font-semibold text-neu-text-primary mb-2">
          密码
        </label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            :value="password"
            placeholder="请输入密码"
            class="w-full h-12 rounded-2xl bg-neu-bg pl-4 pr-12 text-base text-neu-text-primary placeholder-neu-text-muted outline-none neu-inset"
            :class="errors.password ? 'ring-2 ring-red-400' : ''"
            style="border: none"
            @input="onPasswordInput"
          />
          <button
            class="absolute right-4 top-1/2 -translate-y-1/2 text-neu-text-muted"
            type="button"
            @click="showPassword = !showPassword"
          >
            <Eye v-if="showPassword" :size="18" />
            <EyeOff v-else :size="18" />
          </button>
        </div>
        <span v-if="errors.password" class="text-xs text-red-400 mt-1.5 ml-2">{{ errors.password }}</span>
      </div>

      <!--验证码 -->
      <div v-else class="flex flex-col">
        <label class="text-sm font-semibold text-neu-text-primary mb-2">
          验证码
        </label>
        <div class="flex items-center gap-3">
          <div class="flex-1 flex items-center h-12 rounded-2xl neu-inset bg-neu-bg">
            <Shield :size="18" class="ml-4 text-neu-text-muted flex-shrink-0" />
            <input
              type="text"
              :maxlength="6"
              :value="code"
              placeholder="请输入验证码"
              class="flex-1 bg-transparent ml-2.5 mr-4 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
              :class="errors.code ? 'ring-0' : ''"
              style="border: none"
              @input="onCodeInput"
            />
          </div>
          <button
            class="h-12 px-4 rounded-2xl text-sm font-bold flex-shrink-0 transition-all"
            :class="codeCountdown > 0 ? 'neu-inset text-neu-text-muted' : 'neu-raised text-accent-blue'"
            type="button"
            :disabled="codeCountdown > 0"
            @click="handleSendCode"
          >
            {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
          </button>
        </div>
        <span v-if="errors.code" class="text-xs text-red-400 mt-1.5 ml-2">{{ errors.code }}</span>
      </div>
    </div>

    <!--操作按钮区 -->
    <div class="relative z-10 flex flex-col items-center px-4 mt-8">
      <button
        class="w-full h-12 rounded-2xl text-white text-lg font-bold transition-all flex items-center justify-center gap-2"
        :class="loading ? 'neu-inset opacity-70' : 'neu-accent'"
        :disabled="loading"
        @click="handleLogin"
      >
        <Loader2 v-if="loading" :size="20" class="animate-spin" />
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <button
        v-if="loginMode === 'password'"
        class="mt-4 text-base text-neu-text-primary font-semibold"
        @click="loginMode = 'code'"
      >
        验证码登录
      </button>
    </div>

    <!--弹性空间 -->
    <div class="flex-1" />

    <!--底部协议区 -->
    <div class="relative z-10 flex flex-col px-4 pb-8">
      <span v-if="errors.agreement" class="text-xs text-red-400 mb-2 ml-2">{{ errors.agreement }}</span>
      <div class="flex items-start">
        <button
          class="w-5 h-5 flex-shrink-0 mt-0.5"
          style="border: none; background: none; padding: 0"
          type="button"
          @click="toggleAgreed"
        >
          <div
            class="w-5 h-5 rounded-full flex items-center justify-center"
            :class="agreed ? 'neu-inset' : 'neu-raised'"
          >
            <div v-if="agreed" class="w-2.5 h-2.5 rounded-full bg-accent-blue" />
          </div>
        </button>
        <span class="ml-2 text-xs text-neu-text-primary leading-relaxed">
          已阅读并同意
          <span class="text-accent-blue cursor-pointer">《用户协议》</span>
          <span class="text-accent-blue cursor-pointer">《隐私政策》</span>
          <span class="text-accent-blue cursor-pointer">《平台交易细则》</span>
          <span class="text-accent-blue cursor-pointer">《风险揭示书》</span>
        </span>
      </div>
    </div>
  </div>
</template>

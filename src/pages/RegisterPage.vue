<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Lock, Phone, Shield, Loader2 } from 'lucide-vue-next'
import NavBar from '@/components/common/NavBar.vue'
import { useStore } from '@/store/useStore'

interface FieldErrors {
  phone?: string
  code?: string
  password?: string
  confirmPassword?: string
  agreement?: string
}

const router = useRouter()
const store = useStore()
const phone = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreed = ref(false)
const loading = ref(false)
const errors = ref<FieldErrors>({})
const codeCountdown = ref(0)

// 清理倒计时
let codeTimer: ReturnType<typeof setInterval> | undefined
watch(codeCountdown, (val) => {
  if (codeTimer) {
    clearInterval(codeTimer)
    codeTimer = undefined
  }
  if (val <= 0) return
  codeTimer = setInterval(() => {
    if (codeCountdown.value <= 1) {
      clearInterval(codeTimer)
      codeTimer = undefined
      codeCountdown.value = 0
      return
    }
    codeCountdown.value = codeCountdown.value - 1
  }, 1000)
})

onUnmounted(() => {
  if (codeTimer) {
    clearInterval(codeTimer)
    codeTimer = undefined
  }
})

const validatePhone = (v: string) => {
  if (!v.trim()) return '请输入手机号'
  if (!/^1[3-9]\d{9}$/.test(v)) return '请输入正确的11位手机号'
  return ''
}

const validateCode = (v: string) => {
  if (!v.trim()) return '请输入验证码'
  if (!/^\d{6}$/.test(v)) return '请输入6位数字验证码'
  return ''
}

const validatePassword = (v: string) => {
  if (!v) return '请设置登录密码'
  if (v.length < 8) return '密码至少8位'
  if (!/[a-zA-Z]/.test(v)) return '密码需包含字母'
  if (!/\d/.test(v)) return '密码需包含数字'
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
}

const handleRegister = () => {
  const newErrors: FieldErrors = {}

  newErrors.phone = validatePhone(phone.value)
  newErrors.code = validateCode(code.value)
  newErrors.password = validatePassword(password.value)

  if (!confirmPassword.value) {
    newErrors.confirmPassword = '请再次输入密码'
  } else if (confirmPassword.value !== password.value) {
    newErrors.confirmPassword = '两次输入的密码不一致'
  }

  if (!agreed.value) {
    newErrors.agreement = '请先阅读并同意相关协议'
  }

  const hasError = Object.values(newErrors).some(Boolean)
  errors.value = newErrors
  if (hasError) return

  loading.value = true
  // 模拟注册请求
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
const onCodeInput = (e: Event) => {
  code.value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  errors.value = { ...errors.value, code: '' }
}
const onPasswordInput = (e: Event) => {
  password.value = (e.target as HTMLInputElement).value
  errors.value = { ...errors.value, password: '' }
}
const onConfirmPasswordInput = (e: Event) => {
  confirmPassword.value = (e.target as HTMLInputElement).value
  errors.value = { ...errors.value, confirmPassword: '' }
}
const toggleAgreed = () => {
  agreed.value = !agreed.value
  errors.value = { ...errors.value, agreement: '' }
}
</script>

<template>
  <div class="page-container-no-nav bg-neu-bg flex flex-col min-h-screen">
    <!--顶部导航栏 -->
    <NavBar title="注册" />

    <!--表单区域 -->
    <div class="flex flex-col px-6 mt-4" style="gap: 22px">
      <!--1. 手机号 -->
      <div class="flex flex-col">
        <label class="text-sm font-semibold text-neu-text-primary">
          请输入您的手机号
        </label>
        <span class="text-xs text-neu-text-muted mt-0.5">
          用于接收验证码和账户安全验证
        </span>
        <div
          class="flex items-center h-12 mt-2 rounded-2xl bg-neu-bg neu-inset"
          :class="errors.phone ? 'ring-2 ring-red-400' : ''"
        >
          <Phone :size="18" class="ml-4 text-neu-text-muted flex-shrink-0" />
          <input
            type="tel"
            :maxlength="11"
            :value="phone"
            placeholder="请输入手机号"
            class="flex-1 bg-transparent ml-2.5 mr-4 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
            style="border: none"
            @input="onPhoneInput"
          />
        </div>
        <span v-if="errors.phone" class="text-xs text-red-400 mt-1.5 ml-2">{{ errors.phone }}</span>
      </div>

      <!--2. 验证码 -->
      <div class="flex flex-col">
        <label class="text-sm font-semibold text-neu-text-primary">
          发送验证码
        </label>
        <span class="text-xs text-neu-text-muted mt-0.5">
          验证码将发送至您的手机
        </span>
        <div class="flex items-center gap-3 mt-2">
          <div
            class="flex-1 flex items-center h-12 rounded-2xl bg-neu-bg neu-inset"
            :class="errors.code ? 'ring-2 ring-red-400' : ''"
          >
            <Shield :size="18" class="ml-4 text-neu-text-muted flex-shrink-0" />
            <input
              type="text"
              :maxlength="6"
              :value="code"
              placeholder="请输入验证码"
              class="flex-1 bg-transparent ml-2.5 mr-4 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
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
            {{ codeCountdown > 0 ? codeCountdown + 's' : '发送验证码' }}
          </button>
        </div>
        <span v-if="errors.code" class="text-xs text-red-400 mt-1.5 ml-2">{{ errors.code }}</span>
      </div>

      <!--3. 密码 -->
      <div class="flex flex-col">
        <label class="text-sm font-semibold text-neu-text-primary">
          设置登录密码
        </label>
        <span class="text-xs text-neu-text-muted mt-0.5">
          密码至少8位，包含数字和字母，可选特殊符号
        </span>
        <div
          class="flex items-center h-12 mt-2 rounded-2xl bg-neu-bg neu-inset"
          :class="errors.password ? 'ring-2 ring-red-400' : ''"
        >
          <Lock :size="18" class="ml-4 text-neu-text-muted flex-shrink-0" />
          <input
            :type="showPassword ? 'text' : 'password'"
            :value="password"
            placeholder="请输入登录密码"
            class="flex-1 bg-transparent ml-2.5 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
            style="border: none"
            @input="onPasswordInput"
          />
          <button
            class="mr-4 text-neu-text-muted flex-shrink-0"
            type="button"
            @click="showPassword = !showPassword"
          >
            <Eye v-if="showPassword" :size="18" />
            <EyeOff v-else :size="18" />
          </button>
        </div>
        <span v-if="errors.password" class="text-xs text-red-400 mt-1.5 ml-2">{{ errors.password }}</span>
      </div>

      <!--4. 确认密码 -->
      <div class="flex flex-col">
        <label class="text-sm font-semibold text-neu-text-primary">
          再次确认登录密码
        </label>
        <div
          class="flex items-center h-12 mt-2 rounded-2xl bg-neu-bg neu-inset"
          :class="errors.confirmPassword ? 'ring-2 ring-red-400' : ''"
        >
          <Lock :size="18" class="ml-4 text-neu-text-muted flex-shrink-0" />
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            :value="confirmPassword"
            placeholder="请再次输入登录密码"
            class="flex-1 bg-transparent ml-2.5 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
            style="border: none"
            @input="onConfirmPasswordInput"
          />
          <button
            class="mr-4 text-neu-text-muted flex-shrink-0"
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Eye v-if="showConfirmPassword" :size="18" />
            <EyeOff v-else :size="18" />
          </button>
        </div>
        <span v-if="errors.confirmPassword" class="text-xs text-red-400 mt-1.5 ml-2">{{ errors.confirmPassword }}</span>
      </div>
    </div>

    <!--主按钮 -->
    <div class="px-6 mt-8">
      <button
        class="w-full h-[52px] rounded-btn text-white text-lg font-bold transition-all flex items-center justify-center gap-2"
        :class="loading ? 'neu-inset opacity-70' : 'neu-accent-blue'"
        :disabled="loading"
        @click="handleRegister"
      >
        <Loader2 v-if="loading" :size="20" class="animate-spin" />
        {{ loading ? '注册中...' : '立即注册' }}
      </button>
    </div>

    <!--底部协议区 -->
    <div class="flex flex-col px-6 mt-5 pb-8">
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

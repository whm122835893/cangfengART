<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, Check, Diamond, Home, AlertTriangle, Minus, Plus } from 'lucide-vue-next'
import { getImageUrl, getNftById } from '@/data/nfts'
import { useStore } from '@/store/useStore'
import type { PendingOrder } from '@/store/useStore'

const paymentMethods = [
  { id: 'huifu', name: '汇付支付', desc: '汇付钱包余额支付', color: 'linear-gradient(145deg, #d4758a, #c44569)', label: '汇' },
  { id: 'yibao', name: '易宝支付', desc: '易宝钱包余额支付', color: 'linear-gradient(145deg, #70b080, #90cfa0)', label: '易' },
]

const router = useRouter()
const route = useRoute()
const store = useStore()

const orderId = computed(() => route.params.orderId as string)
const order = computed<PendingOrder | undefined>(() => store.getPendingOrder(orderId.value))
// 从藏品详情取发行/流通等信息（显示用）
const nft = computed(() => (order.value ? getNftById(order.value.nftId) : null))

// 倒计时
const remainMs = ref(0)
const remainSec = computed(() => Math.max(0, Math.ceil(remainMs.value / 1000)))
const countdownText = computed(() => {
  const s = remainSec.value
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
})
const expired = computed(() => remainMs.value <= 0 || !order.value || Date.now() > (order.value?.expireAt ?? 0))

// 发售类才用数量选择
const quantity = ref(1)
const paymentMethod = ref(order.value?.paymentMethod || 'huifu')
const totalPrice = computed(() => (order.value ? order.value.price * quantity.value : 0))

// 支付密码弹窗
const showPasswordModal = ref(false)
const password = ref(['', '', '', '', '', ''])
const paying = ref(false)
const inputRefs = ref<(HTMLInputElement | null)[]>([])

const gone = computed(() => !order.value || order.value.kind !== 'sale')

let tickTimer: ReturnType<typeof setInterval> | null = null
const startTicking = () => {
  stopTicking()
  tickTimer = setInterval(() => {
    if (!order.value) {
      remainMs.value = 0
      return
    }
    remainMs.value = order.value.expireAt - Date.now()
    if (remainMs.value <= 0) {
      remainMs.value = 0
      stopTicking()
      store.expirePendingOrder(order.value.id)
      store.showToast('订单已超时，藏品已释放', 'error')
    }
  }, 1000)
}
const stopTicking = () => {
  if (tickTimer) {
    clearInterval(tickTimer)
    tickTimer = null
  }
}

onMounted(() => {
  if (!store.isLoggedIn) {
    store.setShowAuthModal(true)
    router.replace('/')
    return
  }
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    router.back()
    return
  }
  if (order.value && order.value.kind === 'sale') {
    quantity.value = order.value.quantity
    remainMs.value = order.value.expireAt - Date.now()
    startTicking()
  }
})

onUnmounted(() => {
  stopTicking()
})

watch(order, (v) => {
  if (!v) stopTicking()
})

// 数量变化同步回 store
watch(quantity, (v) => {
  if (order.value && order.value.kind === 'sale') {
    store.updateSalePendingQuantity(order.value.id, v)
  }
})
watch(paymentMethod, (v) => {
  if (order.value) store.setPendingPaymentMethod(order.value.id, v)
})

const handleBack = () => {
  if (order.value) store.expirePendingOrder(order.value.id)
  store.showToast('订单已取消，藏品已释放回发售池', 'info')
  router.replace('/')
}

const handleCancelPay = () => {
  if (order.value) store.expirePendingOrder(order.value.id)
  store.showToast('订单已取消', 'info')
  router.replace('/')
}

const handleConfirm = () => {
  if (expired.value) {
    store.showToast('订单已超时', 'error')
    return
  }
  if (!store.hasOperationPassword) {
    store.showToast('请先设置交易密码', 'error')
    router.push('/security')
    return
  }
  showPasswordModal.value = true
  password.value = ['', '', '', '', '', '']
  setTimeout(() => inputRefs.value[0]?.focus(), 100)
}

const handlePasswordChange = (index: number, value: string) => {
  if (!/^\d?$/.test(value)) return
  const next = [...password.value]
  next[index] = value
  password.value = next
  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
  // 不再自动提交，必须点击按钮
}

const handleKeyDown = (index: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !password.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const submitPayment = (pwd: string) => {
  if (pwd.length < 6) return
  if (!store.verifyOperationPassword(pwd)) {
    store.showToast('交易密码错误', 'error')
    password.value = ['', '', '', '', '', '']
    setTimeout(() => inputRefs.value[0]?.focus(), 100)
    return
  }
  if (!order.value) return
  paying.value = true
  setTimeout(() => {
    paying.value = false
    showPasswordModal.value = false
    const ok = store.payPendingOrder(order.value!.id)
    if (!ok) {
      store.showToast('订单已失效或已支付', 'error')
      router.replace('/')
      return
    }
    store.showToast('支付成功，藏品已入库', 'success')
    setTimeout(() => router.replace('/assets'), 1000)
  }, 1500)
}

const handlePasswordSubmit = () => {
  const pwd = password.value.join('')
  if (pwd.length === 6) submitPayment(pwd)
}
</script>

<template>
  <div v-if="gone" class="min-h-screen bg-neu-bg flex flex-col items-center justify-center px-6">
    <div class="neu-raised rounded-2xl p-8 flex flex-col items-center max-w-sm w-full">
      <div class="w-16 h-16 rounded-full neu-inset flex items-center justify-center mb-4">
        <AlertTriangle :size="32" class="text-functional-danger" />
      </div>
      <h2 class="text-xl font-bold text-neu-text-primary mb-2">订单不存在</h2>
      <p class="text-sm text-neu-text-muted text-center mb-6">
        订单已超时释放、支付完成或已取消，请重新下单。
      </p>
      <button
        @click="router.replace('/')"
        class="flex items-center gap-2 px-6 h-11 rounded-full neu-accent-blue text-white font-bold text-sm"
      >
        <Home :size="16" />
        返回首页
      </button>
    </div>
  </div>

  <div v-else class="min-h-screen bg-neu-bg pb-24">
    <div class="flex items-center px-4 h-navbar sticky top-0 bg-neu-bg z-50">
      <button
        @click="handleBack"
        class="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center"
      >
        <ChevronLeft :size="18" class="text-accent-blue" />
      </button>
      <h1 class="text-lg font-bold text-neu-text-primary absolute left-1/2 -translate-x-1/2">
        订单支付
      </h1>
    </div>

    <!-- 倒计时卡 -->
    <div class="mx-4 mt-3">
      <div class="neu-raised rounded-lg-card p-4 flex items-center justify-between">
        <div>
          <p class="text-xs text-neu-text-muted mb-1">剩余支付时间</p>
          <p
            class="text-3xl font-bold font-mono"
            :class="expired ? 'text-functional-danger' : 'text-accent-blue'"
          >
            {{ countdownText }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative w-10 h-10">
            <svg viewBox="0 0 36 36" class="w-10 h-10 -rotate-90">
              <circle cx="18" cy="18" r="16" stroke="#e2e8f0" stroke-width="3" fill="none" />
              <circle
                cx="18" cy="18" r="16"
                :stroke="expired ? '#ef4444' : '#3b82f6'"
                stroke-width="3" fill="none" stroke-linecap="round"
                :stroke-dasharray="2 * Math.PI * 16"
                :stroke-dashoffset="2 * Math.PI * 16 * (1 - Math.max(0, Math.min(1, remainSec / 300)))"
              />
            </svg>
          </div>
          <span class="text-xs text-neu-text-muted">
            超时自动释放订单
          </span>
        </div>
      </div>
    </div>

    <!-- 藏品信息 -->
    <div class="mx-4 mt-3">
      <div class="neu-raised rounded-lg-card p-4 flex items-center gap-3">
        <div
          class="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
          :style="{ backgroundImage: 'url(' + getImageUrl(order.image, 'cover') + ')' }"
        />
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-bold text-neu-text-primary truncate">{{ order.name }}</h3>
          <p v-if="nft" class="text-xs text-neu-text-muted mt-1">
            发行 {{ nft.issue }} 份 · 流通 {{ nft.circulation }} 份
          </p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-lg font-bold text-accent-blue">¥{{ order.price }}</p>
          <p class="text-[10px] text-neu-text-muted">单价</p>
        </div>
      </div>
    </div>

    <!-- 购买份数（发售类独有） -->
    <div class="mx-4 mt-3">
      <div class="neu-raised rounded-lg-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm font-bold text-neu-text-primary">购买份数</span>
            <p class="text-xs text-neu-text-muted mt-0.5">每人限购 5 份</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="quantity = Math.max(1, quantity - 1)"
              class="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center disabled:opacity-40"
              :disabled="quantity <= 1"
            >
              <Minus :size="16" class="text-neu-text-secondary" />
            </button>
            <span class="text-xl font-bold text-neu-text-primary w-8 text-center">{{ quantity }}</span>
            <button
              @click="quantity = Math.min(5, quantity + 1)"
              class="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center disabled:opacity-40"
              :disabled="quantity >= 5"
            >
              <Plus :size="16" class="text-neu-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="mx-4 mt-3">
      <div class="neu-raised rounded-lg-card p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-bold text-neu-text-primary">选择支付方式</span>
          <span
            v-if="expired"
            class="text-xs font-bold text-functional-danger neu-inset px-2 py-1 rounded-full"
          >
            订单已超时
          </span>
        </div>
        <div class="space-y-3">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            @click="!expired && (paymentMethod = method.id)"
            :class="[
              'flex items-center gap-3 rounded-xl p-3 transition-colors',
              expired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              paymentMethod === method.id ? 'neu-pressed' : ''
            ]"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              :style="{ background: method.color }"
            >
              <span class="text-white font-bold text-sm">{{ method.label }}</span>
            </div>
            <div class="flex-1">
              <div class="text-sm font-semibold text-neu-text-primary">{{ method.name }}</div>
              <div class="text-xs text-neu-text-muted">{{ method.desc }}</div>
            </div>
            <div
              :class="[
                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                paymentMethod === method.id ? 'border-accent-blue bg-accent-blue' : 'border-neu-text-muted/40'
              ]"
            >
              <Check v-if="paymentMethod === method.id" :size="12" class="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 费用明细 -->
    <div class="mx-4 mt-3">
      <div class="neu-raised rounded-lg-card p-4 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm text-neu-text-muted">藏品单价</span>
          <span class="text-sm font-semibold text-neu-text-primary">¥{{ order.price }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-neu-text-muted">购买数量</span>
          <span class="text-sm font-semibold text-neu-text-primary">× {{ quantity }}</span>
        </div>
        <div class="neu-divider my-1" />
        <div class="flex items-center justify-between">
          <span class="text-base font-bold text-neu-text-primary">实付金额</span>
          <span class="text-xl font-bold text-accent-blue">¥{{ totalPrice }}</span>
        </div>
      </div>
    </div>

    <!-- 风险提示 -->
    <div class="mx-4 mt-4">
      <div class="neu-raised rounded-lg-card p-3 flex items-start gap-2">
        <AlertTriangle :size="16" class="text-functional-warning shrink-0 mt-0.5" />
        <p class="text-[11px] leading-relaxed text-neu-text-secondary">
          请在倒计时结束前完成支付，超时后订单将自动取消，名额立即释放回发售池。支付成功后不支持退款。
        </p>
      </div>
    </div>

    <!-- 底部支付栏 -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-neu-bg px-4 py-3 z-50 border-t border-neu-text-muted/10">
      <div class="flex items-center gap-4">
        <div class="flex flex-col">
          <span class="text-lg font-bold text-neu-text-primary">¥{{ totalPrice }}</span>
          <span class="text-[10px] text-neu-text-muted">合计 {{ quantity }} 份</span>
        </div>
        <button
          @click="handleConfirm"
          :disabled="expired"
          class="flex-1 h-12 rounded-full neu-accent-blue text-white text-base font-bold disabled:opacity-50"
        >
          {{ expired ? '订单已超时' : '立即支付' }}
        </button>
      </div>
    </div>

    <!-- 交易密码输入弹窗（仅按钮点击提交，不再自动） -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 z-[100] flex items-end justify-center"
      @click="() => { if (!paying) showPasswordModal = false }"
    >
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-8 px-4 animate-[flapIn_0.3s_ease-out]"
        @click="(e) => e.stopPropagation()"
      >
        <div class="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />
        <h2 class="text-center text-base font-bold text-neu-text-primary mb-1">输入交易密码</h2>
        <p class="text-center text-xs text-neu-text-muted mb-5">
          {{ paymentMethods.find((m) => m.id === paymentMethod)?.name }} · 支付 ¥{{ totalPrice }}
        </p>

        <div class="flex justify-center gap-3 mb-6">
          <input
            v-for="(digit, i) in password"
            :key="i"
            :ref="el => { if (el) inputRefs[i] = el as HTMLInputElement }"
            type="tel"
            maxlength="1"
            :value="digit"
            @input="e => handlePasswordChange(i, (e.target as HTMLInputElement).value)"
            @keydown="e => handleKeyDown(i, e)"
            :disabled="paying"
            class="w-11 h-12 rounded-xl neu-inset text-center text-xl font-bold text-neu-text-primary outline-none focus:ring-2 focus:ring-accent-blue/40"
          />
        </div>

        <button
          @click="handlePasswordSubmit"
          :disabled="password.join('').length < 6 || paying"
          class="w-full h-12 rounded-full neu-accent-blue text-white font-bold text-base disabled:opacity-50"
        >
          {{ paying ? '支付中...' : '确认支付' }}
        </button>

        <button
          @click="handleCancelPay"
          class="w-full h-10 mt-2 text-sm text-neu-text-muted"
          :disabled="paying"
        >
          取消支付
        </button>
      </div>
    </div>
  </div>
</template>

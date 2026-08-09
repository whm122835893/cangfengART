<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, Minus, Plus, Check, Diamond, Home } from 'lucide-vue-next'
import { getNftById, getImageUrl, formatPrice } from '@/data/nfts'
import { useStore } from '@/store/useStore'

const paymentMethods = [
  { id: 'huifu', name: '汇付支付', desc: '汇付钱包余额支付', color: 'linear-gradient(145deg, #d4758a, #c44569)', label: '汇' },
  { id: 'yibao', name: '易宝支付', desc: '易宝钱包余额支付', color: 'linear-gradient(145deg, #70b080, #90cfa0)', label: '易' },
]

const router = useRouter()
const route = useRoute()
const store = useStore()

const id = computed(() => route.params.id as string)
const nft = computed(() => getNftById(id.value))

const quantity = ref(1)
const paymentMethod = ref('huifu')
const showPasswordModal = ref(false)
const password = ref(['', '', '', '', '', ''])
const paying = ref(false)
const inputRefs = ref<(HTMLInputElement | null)[]>([])

// 权限校验
onMounted(() => {
  if (!store.isLoggedIn) {
    store.setShowAuthModal(true)
    router.back()
  } else if (!store.isVerified) {
    store.setShowVerifyModal(true)
    router.back()
  }
})

const unitPrice = computed(() => nft.value.price ?? 0)
const totalPrice = computed(() => unitPrice.value * quantity.value)

const handleConfirm = () => {
  // 交易密码前置检查
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
  // 必须点击"确认支付"按钮才提交
}

const handleKeyDown = (index: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !password.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const submitPayment = (pwd: string) => {
  if (pwd.length < 6) return
  // 校验交易密码
  if (!store.verifyOperationPassword(pwd)) {
    store.showToast('交易密码错误', 'error')
    password.value = ['', '', '', '', '', '']
    showPasswordModal.value = false
    return
  }
  paying.value = true
  // 模拟支付请求
  setTimeout(() => {
    paying.value = false
    showPasswordModal.value = false
    // 入库
    store.addAsset({
      nftId: nft.value.id,
      name: nft.value.name,
      image: nft.value.image,
      price: unitPrice.value,
      quantity: quantity.value,
    })
    // 创建订单
    store.addOrder({
      nftId: nft.value.id,
      name: nft.value.name,
      image: nft.value.image,
      price: unitPrice.value,
      quantity: quantity.value,
      type: 'sale',
      status: 'paid',
    })
    // 扣减钱包余额
    store.updateWalletBalance(-totalPrice.value)
    store.showToast('交易成功', 'success')
    setTimeout(() => {
      router.replace('/assets')
    }, 1000)
  }, 1500)
}

const handlePasswordSubmit = () => {
  const pwd = password.value.join('')
  if (pwd.length === 6) {
    submitPayment(pwd)
  }
}
</script>

<template>
  <div v-if="!nft || nft.id !== id" class="min-h-screen bg-neu-bg flex flex-col items-center justify-center px-6">
    <div class="neu-raised rounded-2xl p-8 flex flex-col items-center max-w-sm w-full">
      <div class="w-16 h-16 rounded-full neu-inset flex items-center justify-center mb-4">
        <Diamond :size="32" class="text-gray-400" />
      </div>
      <h2 class="text-xl font-bold text-neu-text-primary mb-2">藏品不存在</h2>
      <p class="text-sm text-neu-text-muted text-center mb-6">
        您访问的藏品可能已下架或链接无效
      </p>
      <button
        @click="router.push('/')"
        class="flex items-center gap-2 px-6 h-11 rounded-full neu-accent-blue text-white font-bold text-sm"
      >
        <Home :size="16" />
        返回首页
      </button>
    </div>
  </div>

  <div v-else class="min-h-screen bg-neu-bg pb-24">
    <!-- 顶部导航 -->
    <div class="flex items-center px-4 h-navbar sticky top-0 bg-neu-bg z-50">
      <button
        @click="router.back()"
        class="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center"
      >
        <ChevronLeft :size="18" class="text-accent-blue" />
      </button>
      <h1 class="text-lg font-bold text-neu-text-primary absolute left-1/2 -translate-x-1/2">
        确认订单
      </h1>
    </div>

    <!-- 藏品信息卡片 -->
    <div class="mx-4 mt-3">
      <div class="neu-raised rounded-lg-card p-4 flex items-center gap-3">
        <div
          class="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
          :style="{ backgroundImage: 'url(' + getImageUrl(nft.image, 'cover') + ')' }"
        />
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-bold text-neu-text-primary truncate">{{ nft.name }}</h3>
          <p class="text-xs text-neu-text-muted mt-1">发行 {{ nft.issue }} 份 · 流通 {{ nft.circulation }} 份</p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-lg font-bold text-accent-blue">{{ formatPrice(nft.price) }}</p>
          <p class="text-[10px] text-neu-text-muted">单价</p>
        </div>
      </div>
    </div>

    <!-- 购买份数 -->
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
        <span class="text-sm font-bold text-neu-text-primary">支付方式</span>
        <div class="mt-3 space-y-3">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            @click="paymentMethod = method.id"
            class="flex items-center gap-3 cursor-pointer"
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
              :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center', paymentMethod === method.id ? 'border-accent-blue bg-accent-blue' : 'border-neu-text-muted/40']"
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
          <span class="text-sm font-semibold text-neu-text-primary">{{ formatPrice(nft.price) }}</span>
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

    <!-- 底部确认按钮 -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-neu-bg px-4 py-3 z-50 border-t border-neu-text-muted/10">
      <div class="flex items-center gap-4">
        <div class="flex flex-col">
          <span class="text-lg font-bold text-neu-text-primary">¥{{ totalPrice }}</span>
          <span class="text-[10px] text-neu-text-muted">合计 {{ quantity }} 份</span>
        </div>
        <button
          @click="handleConfirm"
          class="flex-1 h-12 rounded-full neu-accent-blue text-white text-base font-bold"
        >
          确认订单
        </button>
      </div>
    </div>

    <!-- 交易密码输入弹窗 -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-[100] flex items-end justify-center" @click="() => { if (!paying) showPasswordModal = false }">
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-8 px-4 animate-[flapIn_0.3s_ease-out]"
        @click="(e) => e.stopPropagation()"
      >
        <!-- 拖拽指示器 -->
        <div class="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

        <h2 class="text-center text-base font-bold text-neu-text-primary mb-1">输入交易密码</h2>
        <p class="text-center text-xs text-neu-text-muted mb-5">
          {{ paymentMethods.find((m) => m.id === paymentMethod)?.name }} · 支付 ¥{{ totalPrice }}
        </p>

        <!-- 密码输入框 -->
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

        <!-- 提交按钮 -->
        <button
          @click="handlePasswordSubmit"
          :disabled="password.join('').length < 6 || paying"
          class="w-full h-12 rounded-full neu-accent-blue text-white font-bold text-base disabled:opacity-50"
        >
          {{ paying ? '支付中...' : '确认支付' }}
        </button>

        <button
          @click="() => { if (!paying) showPasswordModal = false }"
          class="w-full h-10 mt-2 text-sm text-neu-text-muted"
          :disabled="paying"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

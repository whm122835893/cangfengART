<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine } from 'lucide-vue-next'
import NavBar from '@/components/common/NavBar.vue'
import { useStore } from '@/store/useStore'

type ActionType = 'recharge' | 'withdraw' | null

const store = useStore()
const showBalanceSheet = ref(false)
const actionType = ref<ActionType>(null)
const amount = ref('')

const formattedBalance = computed(() => `¥${store.walletBalance.toLocaleString('zh-CN')}`)

const handleWalletClick = () => {
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    return
  }
  showBalanceSheet.value = true
}

const closeBalanceSheet = () => {
  showBalanceSheet.value = false
}

const openAction = (type: 'recharge' | 'withdraw') => {
  actionType.value = type
  amount.value = ''
}

const closeAction = () => {
  actionType.value = null
  amount.value = ''
}

const handleConfirmAction = () => {
  const value = parseFloat(amount.value)
  if (isNaN(value) || value <= 0) {
    store.showToast('请输入有效金额', 'error')
    return
  }
  if (actionType.value === 'recharge') {
    store.updateWalletBalance(value)
    store.showToast('充值成功', 'success')
  } else if (actionType.value === 'withdraw') {
    if (value > store.walletBalance) {
      store.showToast('提现金额不能超过余额', 'error')
      return
    }
    store.updateWalletBalance(-value)
    store.showToast('提现成功', 'success')
  }
  closeAction()
}
</script>

<template>
  <div class="page-container bg-neu-bg">
    <NavBar title="我的钱包" />

    <!-- 卡片1 - 汇付支付 -->
    <div class="mx-4 my-3">
      <div
        class="neu-raised rounded-lg-card p-5 h-36 relative overflow-hidden"
        :style="{ background: 'linear-gradient(145deg, #d4758a, #c44569)' }"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 neu-raised rounded-full bg-white flex items-center justify-center">
            <span class="text-base font-bold text-accent-blue">汇</span>
          </div>
          <span class="text-white font-bold">汇付支付</span>
        </div>
        <button class="absolute bottom-5 right-5 neu-accent rounded-full px-5 py-2 text-white font-semibold text-sm" @click="handleWalletClick">
          进入钱包
        </button>
      </div>
    </div>

    <!-- 卡片2 - 易宝支付 -->
    <div class="mx-4 my-3">
      <div
        class="neu-raised rounded-lg-card p-5 h-36 relative overflow-hidden"
        :style="{ background: 'linear-gradient(145deg, #70b080, #90cfa0)' }"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 neu-raised rounded-full bg-white flex items-center justify-center">
            <span class="text-base font-bold text-accent-green">易</span>
          </div>
          <div>
            <span class="text-white font-bold">易宝支付</span>
            <span class="block text-xs text-white/70">YIBAOZHIFU</span>
          </div>
        </div>
        <button class="absolute bottom-5 right-5 neu-accent-green rounded-full px-5 py-2 text-white font-semibold text-sm" @click="handleWalletClick">
          进入钱包
        </button>
      </div>
    </div>

    <!-- 钱包余额卡片 -->
    <div class="mx-4 my-3">
      <div class="neu-raised rounded-lg-card p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 neu-raised rounded-full flex items-center justify-center">
            <WalletIcon :size="20" class="text-accent-blue" />
          </div>
          <span class="text-neu-text-primary font-bold">钱包余额</span>
        </div>
        <p class="text-3xl font-bold text-accent-blue">{{ formattedBalance }}</p>
        <p class="text-xs text-neu-text-muted mt-1">可用余额</p>
      </div>
    </div>

    <!-- 余额明细底部弹窗 -->
    <div
      v-if="showBalanceSheet"
      class="fixed inset-0 z-[100] flex items-end justify-center"
      @click="closeBalanceSheet"
    >
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-6 px-4 animate-[flapIn_0.3s_ease-out]"
        @click="(e) => e.stopPropagation()"
      >
        <!-- 拖拽指示器 -->
        <div class="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-neu-text-primary">余额明细</h3>
          <button @click="closeBalanceSheet">
            <X :size="20" class="text-neu-text-muted" />
          </button>
        </div>

        <!-- 余额展示 -->
        <div class="neu-inset rounded-2xl p-5 mb-5">
          <p class="text-xs text-neu-text-muted mb-1">钱包余额</p>
          <p class="text-3xl font-bold text-accent-blue">{{ formattedBalance }}</p>
        </div>

        <!-- 充值 / 提现 -->
        <div class="flex gap-3">
          <button
            class="flex-1 h-12 neu-accent-blue rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
            @click="openAction('recharge')"
          >
            <ArrowDownToLine :size="18" />
            充值
          </button>
          <button
            class="flex-1 h-12 neu-raised rounded-2xl text-accent-blue font-bold text-base flex items-center justify-center gap-2"
            @click="openAction('withdraw')"
          >
            <ArrowUpFromLine :size="18" />
            提现
          </button>
        </div>
      </div>
    </div>

    <!-- 充值 / 提现输入弹窗 -->
    <div
      v-if="actionType"
      class="fixed inset-0 z-[110] flex items-center justify-center"
      @click="closeAction"
    >
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative neu-raised bg-neu-bg rounded-lg-card w-[320px] p-6"
        @click="(e) => e.stopPropagation()"
      >
        <button class="absolute top-4 right-4" @click="closeAction">
          <X :size="20" class="text-neu-text-muted" />
        </button>
        <h3 class="text-lg font-bold text-neu-text-primary mb-2 text-center">
          {{ actionType === 'recharge' ? '充值' : '提现' }}
        </h3>
        <p class="text-xs text-neu-text-muted mb-4 text-center">
          当前余额：{{ formattedBalance }}
        </p>
        <div class="neu-inset rounded-2xl px-4 h-12 flex items-center mb-6">
          <span class="text-base font-bold text-neu-text-primary mr-1">¥</span>
          <input
            type="number"
            :value="amount"
            placeholder="请输入金额"
            class="flex-1 h-full bg-transparent outline-none text-sm text-neu-text-primary placeholder:text-neu-text-muted"
            @input="(e) => amount = (e.target as HTMLInputElement).value"
          />
        </div>
        <button
          class="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base disabled:opacity-50"
          :disabled="!amount"
          @click="handleConfirmAction"
        >
          确认{{ actionType === 'recharge' ? '充值' : '提现' }}
        </button>
      </div>
    </div>
  </div>
</template>

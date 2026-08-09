<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Settings,
  Wallet,
  PiggyBank,
  Shield,
  Award,
  Lock,
  FileText,
  Info,
  Share2,
  UserPlus,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-vue-next'
import BottomNav from '@/components/common/BottomNav.vue'
import { useStore } from '@/store/useStore'

const menuItems1 = [
  { icon: Wallet, label: '我的资产', desc: '查看数字藏品资产', path: '/assets' },
  { icon: PiggyBank, label: '我的钱包', desc: '管理钱包与余额', path: '/wallet' },
]

const menuItems2 = [
  { icon: Shield, label: '藏锋ART订单', desc: '查看我的订单记录', path: '/orders' },
  { icon: Award, label: '我的认证', desc: '完成认证，解锁更多权益', path: '/verification' },
  { icon: Lock, label: '安全设置', desc: '管理账号安全与隐私', path: '/security' },
  { icon: FileText, label: '相关协议', desc: '查看平台相关协议', path: '' },
]

const moreItems = [
  { icon: Info, label: '关于藏锋ART', desc: '了解关于藏锋ART', path: '' },
  { icon: Share2, label: '分享藏锋ART', desc: '分享给好友', path: '' },
  { icon: UserPlus, label: '邀请好友', desc: '邀请好友，领取奖励', path: '/invite' },
]

const router = useRouter()
const store = useStore()
const copied = ref<'uid' | 'wallet' | null>(null)

const handleMenuClick = (path: string) => {
  if (!path) {
    store.showToast('功能开发中', 'info')
    return
  }
  if (!store.isLoggedIn) {
    store.setShowAuthModal(true)
    return
  }
  router.push(path)
}

const handleLogout = () => {
  store.logout()
  router.push('/login')
}

const handleUserAreaClick = () => {
  if (!store.isLoggedIn) {
    router.push('/login')
  }
}

const handleCopy = (text: string, type: 'uid' | 'wallet') => {
  navigator.clipboard.writeText(text)
  copied.value = type
  setTimeout(() => (copied.value = null), 1500)
}
</script>

<template>
  <div class="page-container bg-neu-bg">
    <!-- 顶部导航 -->
    <div class="flex items-center justify-center h-navbar px-4 sticky top-0 bg-neu-bg z-50">
      <h1 class="text-lg font-bold text-neu-text-primary">我的</h1>
      <button
        class="absolute right-4 w-9 h-9 neu-raised rounded-full flex items-center justify-center neu-interactive"
        @click="router.push('/settings')"
      >
        <Settings :size="22" class="text-accent-blue" />
      </button>
    </div>

    <!-- 用户信息卡片 -->
    <div
      class="mx-4 neu-raised rounded-lg-card p-5 overflow-hidden cursor-pointer"
      :style="{ background: 'linear-gradient(145deg, #6DB3F2, #4A90D9)' }"
      @click="handleUserAreaClick"
    >
      <div class="flex items-center gap-4">
        <!-- 头像 -->
        <div class="w-14 h-14 neu-raised rounded-full bg-black flex items-center justify-center flex-shrink-0">
          <span class="text-xs font-bold text-yellow-400">藏锋</span>
        </div>

        <!-- 昵称 + UID -->
        <div class="flex flex-col min-w-0">
          <span class="text-xl font-bold text-white truncate">
            {{ store.isLoggedIn ? store.user.nickname : '未登录' }}
          </span>
          <div v-if="store.isLoggedIn" class="flex items-center gap-1.5 mt-0.5">
            <span class="text-sm text-white/70">UID: {{ store.user.uid }}</span>
            <button
              class="text-white/60 hover:text-white/90 transition-colors"
              @click="(e) => { e.stopPropagation(); handleCopy(store.user.uid, 'uid') }"
            >
              <Check v-if="copied === 'uid'" :size="14" />
              <Copy v-else :size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- 钱包地址 - 头像和UID下方 -->
      <div v-if="store.isLoggedIn" class="flex items-center gap-1.5 mt-3">
        <span class="text-[13px] text-white/70 truncate flex-1">
          <template v-if="store.isVerified && store.user.walletAddress">
            钱包地址：{{ store.user.walletAddress.length > 16
              ? `${store.user.walletAddress.slice(0, 8)}...${store.user.walletAddress.slice(-6)}`
              : store.user.walletAddress }}
          </template>
          <template v-else>实名后生成地址</template>
        </span>
        <button
          v-if="store.isVerified && store.user.walletAddress"
          class="text-white/60 hover:text-white/90 transition-colors flex-shrink-0"
          @click="(e) => { e.stopPropagation(); handleCopy(store.user.walletAddress, 'wallet') }"
        >
          <Check v-if="copied === 'wallet'" :size="15" />
          <Copy v-else :size="15" />
        </button>
      </div>
    </div>

    <!-- 资产服务模块 -->
    <div class="mx-4 mt-4">
      <h2 class="text-base font-bold text-neu-text-primary mb-1">资产服务</h2>
      <div
        v-for="(item, i) in menuItems1"
        :key="i"
        class="neu-raised rounded-card p-4 mb-3 flex items-center cursor-pointer"
        @click="handleMenuClick(item.path)"
      >
        <component :is="item.icon" :size="20" class="text-accent-blue" />
        <div class="ml-3 flex-1">
          <div class="text-sm text-neu-text-primary">{{ item.label }}</div>
          <div class="text-xs text-neu-text-muted">{{ item.desc }}</div>
        </div>
        <ChevronRight :size="18" class="text-neu-text-muted" />
      </div>
    </div>

    <!-- 订单与认证模块 -->
    <div class="mx-4 mt-4">
      <h2 class="text-base font-bold text-neu-text-primary mb-1">订单与认证</h2>
      <div
        v-for="(item, i) in menuItems2"
        :key="i"
        class="neu-raised rounded-card p-4 mb-3 flex items-center cursor-pointer"
        @click="handleMenuClick(item.path)"
      >
        <component :is="item.icon" :size="20" class="text-accent-blue" />
        <div class="ml-3 flex-1">
          <div class="text-sm text-neu-text-primary">{{ item.label }}</div>
          <div class="text-xs text-neu-text-muted">{{ item.desc }}</div>
        </div>
        <span
          v-if="item.label === '我的认证'"
          class="text-xs rounded px-2 py-0.5 mr-2 font-semibold"
          :class="store.isVerified
            ? 'neu-pressed bg-accent-blue/20 text-accent-blue'
            : 'neu-raised text-accent-blue'"
        >
          {{ store.isVerified ? '已认证' : '去认证' }}
        </span>
        <ChevronRight :size="18" class="text-neu-text-muted" />
      </div>
    </div>

    <!-- 更多功能 -->
    <div class="mx-4 mt-4 pb-4">
      <h2 class="text-base font-bold text-neu-text-primary mb-3">更多功能</h2>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="(item, i) in moreItems"
          :key="i"
          class="neu-raised rounded-card p-3 flex flex-col items-center cursor-pointer"
          @click="handleMenuClick(item.path)"
        >
          <component :is="item.icon" :size="22" class="text-neu-text-secondary mb-2" />
          <span class="text-xs text-neu-text-primary">{{ item.label }}</span>
          <span class="text-[10px] text-neu-text-muted mt-0.5">{{ item.desc }}</span>
        </div>
      </div>
    </div>

    <!-- 退出登录 - 仅登录后显示 -->
    <div v-if="store.isLoggedIn" class="mx-4 mt-4 mb-4">
      <button
        class="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base"
        @click="handleLogout"
      >
        退出登录
      </button>
    </div>

    <BottomNav />
  </div>
</template>

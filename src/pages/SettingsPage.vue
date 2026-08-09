<script setup lang="ts">
import { ref } from 'vue'
import { Camera, Copy, Check } from 'lucide-vue-next'
import NavBar from '@/components/common/NavBar.vue'
import { useStore } from '@/store/useStore'

const store = useStore()

const nickname = ref(store.user.nickname)
const address = ref(store.user.address || '')
const saved = ref(false)
const copied = ref(false)

const handleSave = () => {
  store.updateUser({ nickname: nickname.value, address: address.value })
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

const handleAvatarChange = () => {
  const colors = ['#4A90D9', '#d4758a', '#70b080', '#e09060', '#a855f7']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  store.updateUser({ avatar: randomColor })
}

const handleCopyWallet = () => {
  navigator.clipboard.writeText(store.user.walletAddress)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="page-container bg-neu-bg">
    <NavBar title="设置" />

    <div class="px-4 mt-4 flex flex-col gap-4">
      <!-- 头像 -->
      <div
        class="neu-raised rounded-card p-4 flex items-center cursor-pointer"
        @click="handleAvatarChange"
      >
        <span class="text-sm font-semibold text-neu-text-primary flex-1">
          头像
        </span>
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
          :style="{ background: store.user.avatar || '#1a1a1a' }"
        >
          <span v-if="!store.user.avatar" class="text-[10px] font-bold text-yellow-400">藏锋</span>
          <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Camera :size="16" class="text-white" />
          </div>
        </div>
      </div>

      <!-- 昵称 - 可修改 -->
      <div class="neu-raised rounded-card p-4">
        <label class="text-sm font-semibold text-neu-text-primary block mb-2">
          昵称
        </label>
        <input
          type="text"
          :value="nickname"
          @input="e => nickname = (e.target as HTMLInputElement).value"
          placeholder="请输入昵称"
          :maxlength="16"
          class="w-full h-11 neu-inset rounded-2xl px-4 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
          style="border: none"
        />
      </div>

      <!-- UID - 只读 -->
      <div class="neu-raised rounded-card p-4">
        <label class="text-sm font-semibold text-neu-text-primary block mb-2">
          UID
        </label>
        <div class="flex items-center h-11 neu-inset rounded-2xl px-4">
          <span class="flex-1 text-sm text-neu-text-primary font-mono">
            {{ store.user.uid || '—' }}
          </span>
          <span class="text-xs text-neu-text-muted">不可修改</span>
        </div>
      </div>

      <!-- 钱包地址 - 只读 + 可复制 -->
      <div class="neu-raised rounded-card p-4">
        <label class="text-sm font-semibold text-neu-text-primary block mb-2">
          钱包地址
        </label>
        <div class="flex items-center gap-2 h-11 neu-inset rounded-2xl px-4">
          <span class="flex-1 text-sm text-neu-text-primary truncate">
            {{ store.isVerified && store.user.walletAddress ? `钱包地址：${store.user.walletAddress}` : '实名后生成地址' }}
          </span>
          <button
            v-if="store.isVerified && store.user.walletAddress"
            @click="handleCopyWallet"
            class="text-accent-blue hover:text-accent-blue/80 transition-colors flex-shrink-0"
          >
            <Check v-if="copied" :size="16" />
            <Copy v-else :size="16" />
          </button>
        </div>
        <span class="text-xs text-neu-text-muted mt-1.5 block">实名认证后自动生成，不可修改</span>
      </div>

      <!-- 收货地址 -->
      <div class="neu-raised rounded-card p-4">
        <label class="text-sm font-semibold text-neu-text-primary block mb-2">
          收货地址
        </label>
        <textarea
          :value="address"
          @input="e => address = (e.target as HTMLInputElement).value"
          placeholder="请输入收货地址"
          rows="3"
          class="w-full neu-inset rounded-2xl px-4 py-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none resize-none"
          style="border: none"
        />
      </div>

      <!-- 保存按钮 -->
      <button
        @click="handleSave"
        class="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base mt-2"
      >
        {{ saved ? '已保存' : '保存修改' }}
      </button>
    </div>
  </div>
</template>

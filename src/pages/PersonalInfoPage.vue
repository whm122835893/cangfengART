<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Copy, ChevronRight } from 'lucide-vue-next'
import NavBar from '@/components/common/NavBar.vue'
import { useStore } from '@/store/useStore'

type ListItem =
  | { label: string; type: 'avatar'; clickable?: boolean }
  | { label: string; type: 'text'; valueKey: 'nickname' | 'phone'; clickable?: boolean }
  | { label: string; type: 'copy'; clickable?: boolean }
  | { label: string; type: 'arrow'; clickable?: boolean }

const listItems: ListItem[] = [
  { label: '头像', type: 'avatar' },
  { label: '昵称', type: 'text', valueKey: 'nickname' },
  { label: '手机号', type: 'text', valueKey: 'phone', clickable: false },
  { label: '区块链地址', type: 'copy', clickable: false },
  { label: '收货地址', type: 'arrow' },
  { label: '平台交易细则', type: 'arrow' },
]

const router = useRouter()
const store = useStore()

const handleCopyWalletAddress = () => {
  if (!store.user.walletAddress) {
    store.showToast('暂无地址', 'info')
    return
  }
  navigator.clipboard.writeText(store.user.walletAddress)
  store.showToast('已复制', 'success')
}

const handleLogout = () => {
  store.logout()
  router.push('/login')
}
</script>

<template>
  <div class="page-container bg-neu-bg">
    <NavBar title="个人信息" />

    <!-- 列表 -->
    <div class="mx-4 mt-4 neu-raised rounded-card overflow-hidden">
      <template v-for="(item, i) in listItems" :key="i">
        <div
          :class="`flex items-center justify-between h-14 px-4 ${item.clickable !== false ? 'cursor-pointer' : ''}`"
        >
          <span class="text-base font-semibold text-neu-text-primary">{{ item.label }}</span>
          <div class="flex items-center gap-1">
            <div
              v-if="item.type === 'avatar'"
              class="w-10 h-10 neu-raised rounded-full bg-black flex items-center justify-center"
            >
              <span class="text-[9px] font-bold text-yellow-400">藏锋</span>
            </div>
            <span
              v-if="item.type === 'text' && item.valueKey"
              class="text-sm text-neu-text-muted"
            >
              {{ store.user[item.valueKey] }}
            </span>
            <button
              v-if="item.type === 'copy'"
              class="text-accent-blue"
              @click="handleCopyWalletAddress"
            >
              <Copy :size="18" />
            </button>
            <ChevronRight
              v-if="item.clickable !== false"
              :size="18"
              class="text-neu-text-muted"
            />
          </div>
        </div>
        <div v-if="i !== listItems.length - 1" class="neu-divider" />
      </template>
    </div>

    <!-- 退出按钮 -->
    <div class="fixed bottom-8 left-0 right-0 px-4 max-w-[430px] mx-auto">
      <button
        class="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base"
        @click="handleLogout"
      >
        退出账号
      </button>
    </div>
  </div>
</template>

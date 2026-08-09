<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Home, ShoppingBag, Bell, Smile, AlertCircle, ChevronRight } from 'lucide-vue-next'
import { useStore } from '@/store/useStore'

const tabs = [
  { key: 'home', label: '首页', icon: Home, path: '/', restricted: false },
  { key: 'market', label: '市场', icon: ShoppingBag, path: '/market', restricted: false },
  { key: 'discover', label: '公告', icon: Bell, path: '/discover', badge: true, restricted: false },
  { key: 'profile', label: '我的', icon: Smile, path: '/profile', restricted: false },
]

const router = useRouter()
const route = useRoute()
const store = useStore()

const activeTab = computed(() => {
  const path = route.path
  if (path === '/' || path === '/home') return 'home'
  if (path.startsWith('/market')) return 'market'
  if (path.startsWith('/discover')) return 'discover'
  if (path.startsWith('/profile')) return 'profile'
  return 'home'
})

const handleTabClick = (tab: typeof tabs[0]) => {
  if (tab.restricted && !store.isLoggedIn) {
    store.setShowAuthModal(true)
    return
  }
  router.push(tab.path)
}

const showAuthPrompt = computed(() => !store.isLoggedIn || (store.isLoggedIn && !store.isVerified))
const isMainPage = computed(() => {
  const p = route.path
  return p === '/' || p === '/market' || p === '/discover' || p.startsWith('/market') || p.startsWith('/discover')
})

const handleAuthPromptClick = () => {
  if (!store.isLoggedIn) router.push('/login')
  else router.push('/verification')
}
</script>

<template>
  <!-- Auth Prompt above BottomNav -->
  <div
    v-if="showAuthPrompt && isMainPage"
    class="fixed bottom-[74px] left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4"
  >
    <div
      class="neu-raised rounded-card p-3 flex items-center gap-3 cursor-pointer bg-neu-bg"
      @click="handleAuthPromptClick"
    >
      <AlertCircle :size="20" class="text-accent-blue" />
      <span class="text-sm font-semibold text-accent-blue flex-1">
        {{ !store.isLoggedIn ? '您还未登录，点击去登录' : '您还未实名认证，点击去实名' }}
      </span>
      <ChevronRight :size="18" class="text-accent-blue" />
    </div>
  </div>

  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-bottom-nav neu-raised flex items-center justify-around z-50">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-all duration-150"
      @click="handleTabClick(tab)"
    >
      <div class="relative">
        <div v-if="activeTab === tab.key" class="p-1.5 rounded-xl neu-pressed">
          <component :is="tab.icon" :size="22" class="text-accent-blue" :stroke-width="2.5" />
        </div>
        <component
          :is="tab.icon"
          v-else
          :size="22"
          class="text-accent-blue/40"
          :stroke-width="2"
        />
        <div v-if="tab.badge" class="absolute -top-1 -right-1 w-2 h-2 bg-functional-danger rounded-full" />
      </div>
      <span
        class="text-[10px] font-semibold"
        :class="activeTab === tab.key ? 'text-accent-blue' : 'text-accent-blue/50'"
      >
        {{ tab.label }}
      </span>
    </button>
  </div>
</template>

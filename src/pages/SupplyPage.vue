<script setup lang="ts">
import NavBar from '@/components/common/NavBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useStore } from '@/store/useStore'
import { Clock, Gift, Shield, Package } from 'lucide-vue-next'

const store = useStore()

const handleSupply = () => {
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    return
  }
}
</script>

<template>
  <div class="page-container bg-neu-bg">
    <NavBar title="补给站" />

    <!-- Banner -->
    <div class="mx-4 mt-4">
      <div class="h-56 rounded-lg-card neu-raised overflow-hidden">
        <div class="w-full h-full bg-gradient-to-br from-accent-orange to-accent-magenta relative overflow-hidden">
          <!-- 3D场景装饰 -->
          <div class="absolute inset-0">
            <div class="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm rotate-45" />
            <div class="absolute top-20 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm rotate-12" />
            <div class="absolute top-28 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm -rotate-6" />
          </div>
          <!-- 光效 -->
          <div class="absolute top-8 right-8 w-16 h-16 rounded-full bg-white/10 blur-xl" />
          <div class="absolute bottom-12 left-6 w-12 h-12 rounded-full bg-white/10 blur-xl" />

          <!-- 文字内容 -->
          <div class="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h2 class="text-[34px] font-black text-white mb-2">
              补给站
            </h2>
            <p class="text-white/90 text-sm font-semibold mb-1">补给资源·助力成长</p>
            <p class="text-white/60 text-xs font-semibold mb-4">每日领取补给，助力你的收藏之旅</p>
            <button @click="handleSupply" class="px-6 py-2 rounded-full neu-accent-blue neu-interactive text-white text-sm font-bold">
              获取补给 →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 装饰分隔区 -->
    <div class="flex items-center justify-center gap-2 my-6">
      <div class="flex-1 h-px neu-divider" />
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-1.5 rounded-full neu-pressed" />
        <span class="text-sm text-neu-text-primary font-bold">补给礼包</span>
        <div class="w-1.5 h-1.5 rounded-full neu-pressed" />
      </div>
      <div class="flex-1 h-px neu-divider" />
    </div>

    <!-- 空状态 -->
    <EmptyState title="暂无更多补给" subtitle="更多补给正在路上，敬请期待~">
      <template #icon>
        <div class="w-[120px] h-[120px] rounded-3xl neu-inset flex items-center justify-center mb-6">
          <Package :size="48" class="text-accent-blue" />
        </div>
      </template>
    </EmptyState>

    <!-- 小贴士三栏 -->
    <div class="mx-4 mb-4">
      <div class="neu-raised rounded-card p-4">
        <div class="grid grid-cols-3 gap-3">
          <div class="flex flex-col items-center text-center">
            <div class="w-8 h-8 rounded-full neu-inset flex items-center justify-center mb-1.5">
              <Clock :size="16" class="text-functional-tech" />
            </div>
            <p class="text-[10px] text-neu-text-secondary font-semibold leading-tight">每日定时</p>
            <p class="text-[10px] text-neu-text-secondary font-semibold leading-tight">发放补给</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-8 h-8 rounded-full neu-inset flex items-center justify-center mb-1.5">
              <Gift :size="16" class="text-accent-blue" />
            </div>
            <p class="text-[10px] text-neu-text-secondary font-semibold leading-tight">限量礼包</p>
            <p class="text-[10px] text-neu-text-secondary font-semibold leading-tight">先到先得</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-8 h-8 rounded-full neu-inset flex items-center justify-center mb-1.5">
              <Shield :size="16" class="text-functional-success" />
            </div>
            <p class="text-[10px] text-neu-text-secondary font-semibold leading-tight">官方正品</p>
            <p class="text-[10px] text-neu-text-secondary font-semibold leading-tight">品质保障</p>
          </div>
        </div>
      </div>
    </div>

    <div class="h-4" />
  </div>
</template>

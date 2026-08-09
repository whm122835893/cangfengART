<script setup lang="ts">
import NavBar from '@/components/common/NavBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { Gift } from 'lucide-vue-next'
</script>

<template>
  <div class="page-container bg-neu-bg">
    <NavBar title="合成活动" />

    <!-- Banner -->
    <div class="mx-4 mt-4">
      <div class="h-44 rounded-lg-card neu-raised overflow-hidden">
        <div class="w-full h-full bg-gradient-to-br from-accent-orange to-accent-pink relative overflow-hidden">
          <!-- 装饰猫咪 -->
          <div class="absolute right-4 bottom-0 w-24 h-28">
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white/20" />
            <div class="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-10 rounded-full bg-white/15" />
            <div class="absolute top-1 left-3 w-3 h-3 rounded-full bg-white/90" />
            <div class="absolute top-1 right-3 w-3 h-3 rounded-full bg-white/90" />
            <div class="absolute top-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pink-300" />
            <div class="absolute top-3 left-1 w-3 h-2 rounded-full bg-white/30 -rotate-12" />
            <div class="absolute top-3 right-1 w-3 h-2 rounded-full bg-white/30 rotate-12" />
            <div class="absolute bottom-4 left-2 w-3 h-3 rounded-full bg-white/20" />
            <div class="absolute bottom-4 right-2 w-3 h-3 rounded-full bg-white/20" />
          </div>

          <div class="absolute left-5 top-6 z-10">
            <h2 class="text-2xl font-bold text-white mb-2">
              合成活动
            </h2>
            <p class="text-white/90 text-sm font-semibold">合成专属藏品·兑换惊喜好礼</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 装饰分隔线 -->
    <div class="flex items-center justify-center gap-3 my-6">
      <div class="flex items-center gap-1">
        <div class="w-4 h-0.5 rounded-full neu-inset" />
        <div class="w-1 h-1 rounded-full neu-inset" />
      </div>
      <span class="text-sm text-neu-text-secondary font-semibold">请选择活动方式</span>
      <div class="flex items-center gap-1">
        <div class="w-1 h-1 rounded-full neu-inset" />
        <div class="w-4 h-0.5 rounded-full neu-inset" />
      </div>
    </div>

    <!-- 空状态 -->
    <EmptyState title="暂无可参与合成活动" subtitle="敬请期待更多精彩活动">
      <template #icon>
        <div class="w-[120px] h-[120px] rounded-3xl neu-inset flex items-center justify-center mb-6">
          <Gift :size="48" class="text-accent-blue" />
        </div>
      </template>
    </EmptyState>
  </div>
</template>

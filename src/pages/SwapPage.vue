<script setup lang="ts">
import NavBar from '@/components/common/NavBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { Lightbulb, Gift } from 'lucide-vue-next'
</script>

<template>
  <div class="page-container bg-neu-bg">
    <NavBar title="置换活动" />

    <!-- Banner -->
    <div class="mx-4 mt-4">
      <div class="h-48 rounded-lg-card neu-raised overflow-hidden">
        <div class="w-full h-full bg-gradient-to-br from-accent-orange to-accent-orange-light relative overflow-hidden">
          <!-- 玻璃拟态装饰 -->
          <div class="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div class="w-8 h-8 rounded-lg bg-white/30" />
            </div>
          </div>

          <!-- 光点 -->
          <div class="absolute top-4 left-6 w-2 h-2 rounded-full bg-white/60" />
          <div class="absolute top-12 right-8 w-1.5 h-1.5 rounded-full bg-white/40" />
          <div class="absolute bottom-8 left-10 w-1 h-1 rounded-full bg-white/50" />
          <div class="absolute bottom-6 right-10 w-2 h-2 rounded-full bg-white/40" />

          <!-- 气泡 -->
          <div class="absolute bottom-4 left-1/4 w-4 h-4 rounded-full bg-white/10" />
          <div class="absolute top-16 right-1/4 w-3 h-3 rounded-full bg-white/15" />
          <div class="absolute bottom-10 left-1/3 w-5 h-5 rounded-full bg-white/8" />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <EmptyState title="暂无可参与置换活动" subtitle="敬请期待更多精彩活动">
      <template #icon>
        <div class="w-[120px] h-[120px] rounded-3xl neu-inset flex items-center justify-center mb-6">
          <Gift :size="48" class="text-accent-blue" />
        </div>
      </template>
    </EmptyState>

    <!-- 小贴士卡片 -->
    <div class="mx-4 mb-4">
      <div class="neu-raised rounded-card p-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-6 h-6 rounded-full neu-inset flex items-center justify-center">
            <Lightbulb :size="14" class="text-accent-blue" />
          </div>
          <span class="text-sm font-bold text-neu-text-primary">小贴士</span>
        </div>
        <p class="text-sm text-neu-text-secondary leading-relaxed font-semibold">
          参与置换活动可用已有物品兑换新物品或奖励，不定期上线，记得常来看看哦！
        </p>
      </div>
    </div>

    <!-- 底部留白 -->
    <div class="h-4" />
  </div>
</template>

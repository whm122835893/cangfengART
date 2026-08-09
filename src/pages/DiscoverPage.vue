<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, RefreshCw, Heart } from 'lucide-vue-next'
import BottomNav from '@/components/common/BottomNav.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const primaryTabs = ['平台公告', '新闻发布', '辟谣墙']
const secondaryFilters = ['全部', '我的关注', '寄售公告', '上新公告']

const announcements = [
  {
    id: 1,
    title: '【藏锋ART运营公告】关于藏锋ART平台数字资产迁移说明及第一阶段运营活动正式启动',
    tag: '运营公告',
    time: '2026/07/04 10:26:29',
    cover: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
  },
  {
    id: 2,
    title: '【藏锋ART运营公告】藏锋ART·焕新升级进展',
    tag: '运营公告',
    time: '2026/07/01 12:30:09',
    cover: 'linear-gradient(135deg, #1a1a2e, #2d1b69, #6b21a8)',
  },
]

const router = useRouter()
const activeTab = ref(0)
const activeFilter = ref(0)
const likedIds = ref<Set<number>>(new Set())

const toggleLike = (e: MouseEvent, id: number) => {
  e.stopPropagation()
  if (likedIds.value.has(id)) {
    likedIds.value.delete(id)
  } else {
    likedIds.value.add(id)
  }
}
</script>

<template>
  <div class="page-container bg-neu-bg">
    <!-- 顶部标题栏 -->
    <div class="h-12 flex items-center justify-center relative">
      <h1 class="text-[18px] font-bold text-neu-text-primary">发现</h1>
      <button class="absolute right-4 w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center">
        <RefreshCw :size="18" class="text-neu-text-muted" />
      </button>
    </div>

    <!-- 一级标签栏 -->
    <div class="h-[44px] flex items-end">
      <button
        v-for="(tab, i) in primaryTabs"
        :key="tab"
        class="relative flex-1 h-full flex items-center justify-center text-base font-semibold"
        :class="i === activeTab ? 'text-accent-blue font-bold' : 'text-neu-text-muted'"
        @click="activeTab = i"
      >
        {{ tab }}
        <div v-if="i === activeTab" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full neu-pressed" />
      </button>
    </div>

    <!-- 分隔线 -->
    <div class="neu-divider mx-4" />

    <!-- 二级筛选栏 -->
    <div class="h-[44px] flex items-center px-4 gap-2 overflow-x-auto no-scrollbar">
      <Search :size="18" class="text-neu-text-muted shrink-0" />
      <button
        v-for="(item, i) in secondaryFilters"
        :key="item"
        class="h-7 px-4 rounded-full text-sm font-semibold whitespace-nowrap shrink-0"
        :class="i === activeFilter ? 'neu-pressed text-white' : 'neu-raised text-neu-text-secondary'"
        :style="i === activeFilter ? { backgroundColor: '#4A90D9' } : undefined"
        @click="activeFilter = i"
      >
        {{ item }}
      </button>
    </div>

    <!-- 公告列表 -->
    <div v-if="activeTab === 0" class="px-4 flex flex-col gap-3 pt-1 pb-4">
      <div
        v-for="item in announcements"
        :key="item.id"
        class="neu-raised rounded-card p-3 flex gap-3 cursor-pointer"
        @click="router.push('/discover/' + item.id)"
      >
        <!-- 左侧文字区 -->
        <div class="flex-[6] flex flex-col gap-2 min-w-0">
          <h3 class="text-sm font-semibold text-neu-text-primary leading-[1.5] line-clamp-2">
            {{ item.title }}
          </h3>
          <span class="self-start text-xs text-accent-blue bg-neu-bg rounded px-2 py-0.5 font-semibold">
            {{ item.tag }}
          </span>
          <span class="text-xs text-neu-text-muted">{{ item.time }}</span>
        </div>

        <!-- 右侧封面图 -->
        <div
          class="flex-[4] aspect-[4/3] rounded-xl neu-inset relative overflow-hidden shrink-0"
          :style="{ background: item.cover }"
        >
          <span class="absolute inset-0 flex items-center justify-center text-white/15 text-base font-bold">
            藏锋ART
          </span>
          <div
            class="absolute bottom-2 right-2 flex items-center gap-1 bg-black/30 rounded-full px-2 py-0.5 cursor-pointer"
            @click="(e) => toggleLike(e, item.id)"
          >
            <Heart
              :size="12"
              :class="likedIds.has(item.id) ? 'text-red-500 fill-red-500' : 'text-white/80'"
            />
            <span class="text-xs text-white/80 font-semibold">
              {{ likedIds.has(item.id) ? '已关注' : '关注' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <EmptyState v-else title="暂无内容" subtitle="敬请期待更多精彩内容" />

    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

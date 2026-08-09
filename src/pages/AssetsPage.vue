<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Filter, Package, X, ChevronRight } from 'lucide-vue-next'
import NavBar from '@/components/common/NavBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useStore } from '@/store/useStore'
import type { UserAsset } from '@/store/useStore'
import { getImageUrl, formatPrice } from '@/data/nfts'

const tabs = ['数字资产', '盲盒', '寄售中', '已售出']

const router = useRouter()
const store = useStore()
const activeTab = ref(0)
const selectedAsset = ref<UserAsset | null>(null)
const searchQuery = ref('')

const handleNumberClick = (nftId: string, number: string) => {
  router.push(`/nft/${nftId}?number=${encodeURIComponent(number)}&from=assets`)
}

// 根据 Tab 和搜索关键词过滤资产
const filteredAssets = computed(() => {
  return store.userAssets.filter((asset) => {
    // 搜索过滤（按 name 模糊匹配）
    if (searchQuery.value && !asset.name.includes(searchQuery.value)) {
      return false
    }
    // Tab 过滤
    if (activeTab.value === 2) {
      // 寄售中：只显示有寄售编号的资产
      return asset.listedNumbers.length > 0
    }
    if (activeTab.value === 1 || activeTab.value === 3) {
      // 盲盒、已售出：暂无数据
      return false
    }
    // 数字资产（全部）：显示所有
    return true
  })
})

// 是否展示列表（数字资产 + 寄售中 在有数据时展示列表，其余展示空状态）
const showList = computed(() => (activeTab.value === 0 || activeTab.value === 2) && filteredAssets.value.length > 0)
</script>

<template>
  <div class="page-container bg-neu-bg">
    <NavBar title="我的资产" />

    <!-- Tab 切换栏 -->
    <div class="flex h-11">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        class="relative flex-1 flex items-center justify-center"
        @click="activeTab = i"
      >
        <span
          class="text-sm"
          :class="activeTab === i ? 'text-accent-blue font-bold' : 'text-neu-text-muted'"
        >
          {{ tab }}
        </span>
        <div
          v-if="activeTab === i"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 neu-pressed rounded-full"
        />
      </button>
    </div>

    <!-- 分隔线 -->
    <div class="neu-divider mx-4" />

    <!-- 搜索筛选栏 -->
    <div class="flex items-center gap-3 px-4 h-12">
      <div class="flex-1 flex items-center h-9 neu-inset rounded-full px-3">
        <Search :size="16" class="text-neu-text-muted" />
        <input
          type="text"
          placeholder="搜索藏品"
          :value="searchQuery"
          class="ml-2 flex-1 text-sm bg-transparent outline-none placeholder:text-neu-text-muted"
          @input="(e) => searchQuery = (e.target as HTMLInputElement).value"
        />
      </div>
      <button class="flex items-center gap-1 text-sm text-accent-blue font-semibold">
        <Filter :size="16" />
        筛选
      </button>
    </div>

    <!-- 资产列表 / 空状态 -->
    <div v-if="showList" class="px-4 pb-4">
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="asset in filteredAssets"
          :key="asset.nftId"
          class="neu-raised rounded-xl overflow-hidden active:bg-white/40 transition-colors cursor-pointer"
          @click="selectedAsset = asset"
        >
          <!-- 图片区 -->
          <div class="relative">
            <div
              class="w-full aspect-square bg-cover bg-center"
              :style="{ backgroundImage: `url(${getImageUrl(asset.image, 'cover')})` }"
            />
            <span
              v-if="asset.quantity > 1"
              class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-bold"
            >
              ×{{ asset.quantity }}
            </span>
            <span
              v-if="asset.listedNumbers.length > 0"
              class="absolute top-2 left-2 bg-amber-500/90 text-white text-[10px] px-2 py-0.5 rounded-md font-bold"
            >
              寄售中 {{ asset.listedNumbers.length }} 件
            </span>
          </div>
          <!-- 信息区 -->
          <div class="px-2.5 py-2">
            <h3 class="text-sm font-bold text-neu-text-primary truncate">
              {{ asset.name }}
            </h3>
            <span class="inline-block mt-1 text-[10px] text-neu-text-muted bg-gray-100 px-1.5 py-0.5 rounded">
              编号 {{ asset.numbers[0] ?? asset.listedNumbers[0] }}
            </span>
            <p class="mt-1.5 text-sm font-bold text-accent-blue">
              {{ formatPrice(asset.price) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <EmptyState
      v-else
      :title="activeTab === 0 ? '暂无数字资产' : activeTab === 2 ? '暂无寄售中藏品' : '暂无数据'"
      :subtitle="activeTab === 0 ? '快去市场探索精彩藏品吧' : '敬请期待更多精彩内容'"
    >
      <template #icon>
        <Package :size="48" class="text-neu-text-muted opacity-30" />
      </template>
    </EmptyState>

    <!-- 藏品编号弹窗 -->
    <div
      v-if="selectedAsset"
      class="fixed inset-0 z-[100] flex items-end justify-center"
      @click="selectedAsset = null"
    >
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-6 px-4 animate-[flapIn_0.3s_ease-out]"
        @click="(e) => e.stopPropagation()"
      >
        <!-- 拖拽指示器 -->
        <div class="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

        <!-- 标题栏 -->
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <div
              class="w-10 h-10 rounded-lg bg-cover bg-center shrink-0"
              :style="{ backgroundImage: `url(${getImageUrl(selectedAsset.image, 'cover')})` }"
            />
            <div>
              <h2 class="text-base font-bold text-neu-text-primary">{{ selectedAsset.name }}</h2>
              <p class="text-xs text-neu-text-muted">共 {{ selectedAsset.quantity }} 个藏品</p>
            </div>
          </div>
          <button
            class="w-8 h-8 rounded-full neu-raised neu-interactive flex items-center justify-center shrink-0"
            @click="selectedAsset = null"
          >
            <X :size="16" class="text-neu-text-muted" />
          </button>
        </div>

        <!-- 分隔线 -->
        <div class="neu-divider my-3" />

        <!-- 编号列表 -->
        <div class="max-h-[40vh] overflow-y-auto no-scrollbar">
          <div class="flex flex-wrap gap-2">
            <!-- 可点击的编号 -->
            <button
              v-for="(number, i) in selectedAsset.numbers"
              :key="i"
              class="neu-raised neu-interactive rounded-lg px-3 py-2 flex items-center gap-1.5"
              @click="handleNumberClick(selectedAsset.nftId, number)"
            >
              <span class="text-sm font-bold text-neu-text-primary">{{ number }}</span>
              <ChevronRight :size="14" class="text-neu-text-muted" />
            </button>
            <!-- 寄售中编号：灰色不可点击 -->
            <div
              v-for="(number, i) in selectedAsset.listedNumbers"
              :key="`listed-${i}`"
              class="neu-inset rounded-lg px-3 py-2 flex items-center gap-1.5 opacity-60 cursor-not-allowed"
            >
              <span class="text-sm font-bold text-neu-text-muted">{{ number }}</span>
              <span class="text-[10px] text-neu-text-muted bg-gray-200 px-1 py-0.5 rounded">
                寄售中
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Grid2X2, List } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import BottomNav from '@/components/common/BottomNav.vue'
import { useStore } from '@/store/useStore'
import { nfts as marketList, getImageUrl, formatPrice } from '@/data/nfts'

const mainTabs = ['数字资产', '盲盒']
const categoryFilters = ['全部', '我的关注']

const router = useRouter()
const activeMainTab = ref(0)
const activeFilter = ref(0)
const likedIds = ref<Set<string>>(
  new Set(marketList.filter((i) => i.liked).map((i) => i.id))
)
const viewMode = ref<'list' | 'grid'>('list')
const searchQuery = ref('')

// 按名称模糊匹配过滤，排除空投藏品（不在市场流通）
const filteredList = computed(() => marketList.filter((item) =>
  !item.id.startsWith('airdrop-') &&
  item.name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
))

const store = useStore()
const isVerified = computed(() => store.isVerified)

const toggleLike = (id: string) => {
  const next = new Set(likedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  likedIds.value = next
}

const handleBuy = () => {
  if (!isVerified.value) {
    store.setShowVerifyModal(true)
    return
  }
}
</script>

<template>
  <div class="page-container bg-neu-bg">
    <!-- 搜索栏 -->
    <div class="h-[44px] flex items-center px-4 mt-3">
      <div class="flex items-center w-full h-9 rounded-full neu-inset px-4 gap-2">
        <Search :size="18" class="text-neu-text-muted shrink-0" />
        <input
          type="text"
          :value="searchQuery"
          @input="e => searchQuery = (e.target as HTMLInputElement).value"
          placeholder="搜索数字资产、盲盒或专辑"
          class="flex-1 bg-transparent text-sm text-neu-text-primary outline-none placeholder:text-neu-text-muted"
        />
      </div>
    </div>

    <!-- 主标签栏 -->
    <div class="h-[44px] flex items-end px-4 relative">
      <div class="flex items-center gap-6 h-full">
        <button
          v-for="(tab, i) in mainTabs"
          :key="tab"
          @click="activeMainTab = i"
          :class="`relative h-full flex items-center text-base font-semibold ${i === activeMainTab ? 'text-accent-blue font-bold' : 'text-neu-text-muted'}`"
        >
          {{ tab }}
          <div v-if="i === activeMainTab" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full neu-pressed" />
        </button>
      </div>
      <div class="flex items-center h-full ml-auto">
        <button @click="viewMode = viewMode === 'list' ? 'grid' : 'list'" class="p-1">
          <Grid2X2 v-if="viewMode === 'list'" :size="20" class="text-accent-blue" />
          <List v-else :size="20" class="text-accent-blue" />
        </button>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="neu-divider mx-4" />

    <!-- 次级筛选栏 -->
    <div class="h-[44px] flex items-center px-4 gap-3">
      <Search :size="18" class="text-neu-text-muted shrink-0" />
      <button
        v-for="(item, i) in categoryFilters"
        :key="item"
        @click="activeFilter = i"
        :class="`h-7 px-4 rounded-full text-sm font-semibold ${i === activeFilter ? 'neu-pressed text-white' : 'neu-raised text-neu-text-secondary'}`"
        :style="i === activeFilter ? { backgroundColor: '#4A90D9' } : undefined"
      >
        {{ item }}
      </button>
      <div class="flex-1 flex justify-end">
        <List :size="20" class="text-accent-blue" />
      </div>
    </div>

    <!-- 列表视图 -->
    <template v-if="viewMode === 'list'">
      <!-- 分隔线 -->
      <div class="neu-divider mx-4" />

      <!-- 列表表头 -->
      <div class="h-9 flex items-center px-4 mt-1">
        <span class="flex-1 text-xs text-neu-text-muted font-semibold text-left">
          藏品名称 | 发行流通
        </span>
        <span class="w-16 text-xs text-neu-text-muted font-semibold text-center">
          地板价
        </span>
        <span class="w-14 text-xs text-neu-text-muted font-semibold text-right">
          成交量
        </span>
      </div>

      <!-- 列表 -->
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-16">
          <p class="text-base font-bold text-neu-text-primary">未找到相关藏品</p>
          <p class="text-sm text-neu-text-muted mt-2">试试其他关键词</p>
        </div>
        <div
          v-for="item in filteredList"
          :key="item.id"
          @click="router.push(`/market/${item.id}`)"
          class="neu-raised rounded-xl flex items-center p-3 mb-3 mt-2 active:bg-white/40 transition-colors cursor-pointer"
        >
          <!-- 头像 -->
          <div
            class="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 overflow-hidden"
            :style="{ backgroundImage: 'url(' + getImageUrl(item.image, 'thumb') + ')' }"
          />

          <!-- 名称 + 发行/流通 -->
          <div class="flex-1 ml-3 min-w-0">
            <h3 class="text-[15px] font-bold text-neu-text-primary truncate">
              {{ item.name }}
            </h3>
            <div class="flex items-center gap-2 mt-1 text-[10px] text-neu-text-muted">
              <span>发行{{ item.issue }}</span>
              <span>流通{{ item.circulation }}</span>
            </div>
          </div>

          <!-- 收藏 -->
          <button @click="(e) => { e.stopPropagation(); toggleLike(item.id) }" class="p-1 mx-2">
            <svg width="16" height="16" viewBox="0 0 24 24"
              :fill="likedIds.has(item.id) ? '#f59e0b' : 'none'"
              :stroke="likedIds.has(item.id) ? '#f59e0b' : '#9ca3af'"
              stroke-width="1.8">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>

          <!-- 地板价 -->
          <div class="w-16 flex flex-col items-center justify-center">
            <span class="text-sm font-semibold text-neu-text-primary">
              {{ formatPrice(item.price) }}
            </span>
          </div>

          <!-- 成交量 -->
          <button @click="(e) => { e.stopPropagation(); handleBuy() }" class="w-14 text-right">
            <span class="text-sm font-bold text-accent-blue">
              {{ item.volume }}
            </span>
          </button>
        </div>
      </div>
    </template>

    <!-- 网格视图 -->
    <template v-else>
      <div class="flex-1 overflow-y-auto px-3 pb-4">
        <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-16">
          <p class="text-base font-bold text-neu-text-primary">未找到相关藏品</p>
          <p class="text-sm text-neu-text-muted mt-2">试试其他关键词</p>
        </div>
        <div v-else class="grid grid-cols-2 gap-3 mt-3">
          <div
            v-for="item in filteredList"
            :key="item.id"
            @click="router.push(`/market/${item.id}`)"
            class="neu-raised rounded-xl overflow-hidden active:bg-white/40 transition-colors cursor-pointer"
          >
            <!-- 图片区 -->
            <div class="relative">
              <div
                class="w-full aspect-square bg-cover bg-center"
                :style="{ backgroundImage: 'url(' + getImageUrl(item.image, 'cover') + ')' }"
              />
              <span v-if="item.saleStatus === 'onsale'" class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow-sm">
                发售中
              </span>
            </div>
            <!-- 信息区 -->
            <div class="px-2.5 py-2">
              <h3 class="text-sm font-bold text-neu-text-primary truncate">
                {{ item.name }}
              </h3>
              <span class="inline-block mt-1 text-[10px] text-neu-text-muted bg-gray-100 px-1.5 py-0.5 rounded">
                发行{{ item.issue }}
              </span>
              <p class="mt-1.5 text-lg font-bold text-accent-blue">
                {{ formatPrice(item.price) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

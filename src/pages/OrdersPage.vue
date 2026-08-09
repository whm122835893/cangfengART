<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ChevronDown, Gift } from 'lucide-vue-next'
import BackButton from '@/components/common/BackButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useStore } from '@/store/useStore'
import type { Order } from '@/store/useStore'
import { getImageUrl } from '@/data/nfts'

const statusTabs = ['全部', '待付款', '已支付', '订单取消', '藏品空投']

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function statusLabel(order: Order): string {
  if (order.type === 'airdrop' || order.status === 'airdrop') return '空投到账'
  return order.status === 'paid' ? '已支付' : '订单取消'
}

/** 展示主时间：空投优先用 airdropTime */
function showOrderDate(order: Order): string {
  if (order.type === 'airdrop' && order.airdropTime) {
    return formatDate(order.airdropTime)
  }
  return formatDate(order.date)
}

const store = useStore()
const activeStatus = ref(0)
const search = ref('')

const filteredOrders = computed(() => {
  let list = store.orders
  // 状态过滤：0 全部 / 1 待付款 / 2 已支付 / 3 订单取消 / 4 藏品空投
  if (activeStatus.value === 1) {
    list = []
  } else if (activeStatus.value === 2) {
    list = list.filter((o) => o.status === 'paid')
  } else if (activeStatus.value === 3) {
    list = list.filter((o) => o.status === 'cancelled')
  } else if (activeStatus.value === 4) {
    list = list.filter((o) => o.type === 'airdrop' || o.status === 'airdrop')
  }
  const keyword = search.value.trim()
  if (keyword) {
    list = list.filter((o) => o.name.toLowerCase().includes(keyword.toLowerCase()))
  }
  return list
})
</script>

<template>
  <div class="page-container bg-neu-bg">
    <!-- 顶部导航 -->
    <div class="flex items-center gap-3 px-4 h-navbar bg-neu-bg sticky top-0 z-50">
      <BackButton variant="gray" />
      <div class="flex-1 flex items-center h-8 neu-inset rounded-full px-3">
        <Search :size="15" class="text-neu-text-muted" />
        <input
          type="text"
          placeholder="搜索订单"
          :value="search"
          class="ml-2 flex-1 text-sm bg-transparent outline-none placeholder:text-neu-text-muted"
          @input="(e) => search = (e.target as HTMLInputElement).value"
        />
      </div>
      <button class="flex items-center gap-0.5 text-sm text-accent-blue font-semibold whitespace-nowrap">
        筛选
        <ChevronDown :size="14" />
      </button>
    </div>

    <!-- 状态标签栏 -->
    <div class="neu-divider" />
    <div class="flex gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar">
      <button
        v-for="(tab, i) in statusTabs"
        :key="i"
        class="rounded-full px-4 py-1.5 text-sm font-semibold shrink-0"
        :class="activeStatus === i
          ? 'neu-pressed bg-accent-blue text-white'
          : 'neu-raised text-neu-text-secondary'"
        @click="activeStatus = i"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 订单列表 / 空状态 -->
    <EmptyState
      v-if="filteredOrders.length === 0"
      title="暂无订单"
      subtitle="快去选购心仪的藏品吧"
    />
    <div v-else class="px-4 pt-1 pb-4 flex flex-col gap-3">
      <div v-for="order in filteredOrders" :key="order.id" class="neu-raised rounded-card p-3 flex gap-3">
        <!-- 藏品图片 -->
        <div class="w-20 h-20 rounded-xl neu-inset overflow-hidden shrink-0 relative">
          <img
            :src="getImageUrl(order.image, 'thumb')"
            :alt="order.name"
            class="w-full h-full object-cover"
          />
          <!-- 空投角标 -->
          <div
            v-if="order.type === 'airdrop' || order.status === 'airdrop'"
            class="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-sm"
          >
            <Gift :size="10" />
            空投
          </div>
        </div>

        <!-- 信息 -->
        <div class="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-semibold text-neu-text-primary truncate">
              {{ order.name }}
            </h3>
            <p v-if="order.number" class="text-xs text-neu-text-muted mt-0.5">编号：{{ order.number }}</p>
            <!-- 获取方式 -->
            <p class="text-xs text-neu-text-muted mt-0.5">
              获取方式：
              <span :class="(order.type === 'airdrop') ? 'text-functional-warning font-semibold' : 'text-neu-text-primary'">
                {{ order.acquireMethod || (order.type === 'sale' ? '首发购买' : order.type === 'market' ? '市场购买' : '藏品空投') }}
              </span>
            </p>
            <!-- 空投获取时间（独立行） -->
            <p v-if="(order.type === 'airdrop') && order.airdropTime" class="text-xs text-functional-warning mt-0.5">
              空投获取时间：{{ showOrderDate(order) }}
            </p>
            <!-- 非空投：下单时间 -->
            <p v-else class="text-xs text-neu-text-muted mt-0.5">
              下单时间：{{ showOrderDate(order) }} · 数量：{{ order.quantity }}
            </p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold" :class="(order.type === 'airdrop') ? 'text-functional-warning' : 'text-accent-blue'">
              {{ (order.type === 'airdrop' || order.price === 0) ? '空投免费' : '¥' + order.price }}
            </span>
            <span
              class="text-xs rounded px-2 py-0.5 font-semibold"
              :class="
                (order.type === 'airdrop' || order.status === 'airdrop')
                  ? 'neu-pressed bg-functional-warning/15 text-functional-warning'
                  : order.status === 'paid'
                    ? 'neu-pressed bg-accent-blue/20 text-accent-blue'
                    : 'neu-pressed text-neu-text-muted'
              "
            >
              {{ statusLabel(order) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
</style>

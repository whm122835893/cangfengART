<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, Lock, ChevronRight } from 'lucide-vue-next'
import { getNftById, getImageUrl, sellList } from '@/data/nfts'
import { useStore } from '@/store/useStore'

type MarketListing = {
  id: string;
  number: string;
  price: number;
  wallet: string;
  isMine: boolean;
};

const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id as string)
const activeTab = ref(0)
const subTab = ref(0)
const collection = computed(() => getNftById(id.value))
const liked = ref(false)

const store = useStore()
const userListings = computed(() => store.listings.filter((l) => l.nftId === id.value))

// 购买流程状态
const purchaseListing = ref<MarketListing | null>(null)

// 合并静态挂单 + 用户寄售挂单
const allListings = computed<MarketListing[]>(() => [
  ...userListings.value.map((l) => ({ id: l.id, number: l.number, price: l.price, wallet: l.seller, isMine: true })),
  ...sellList.map((l) => ({ ...l, isMine: false })),
])

// 取消寄售
const handleCancelListing = (e: MouseEvent, listingId: string) => {
  e.stopPropagation()
  if (window.confirm('确认取消寄售？')) {
    store.cancelListing(listingId)
    store.showToast('已取消寄售', 'success')
  }
}

// 点击挂单：自己的不可跳转，别人的进入 NFT 详情页（市场来源）
const handleListingClick = (item: MarketListing) => {
  if (item.isMine) return
  router.push(
    `/nft/${id.value}?from=market&listingId=${encodeURIComponent(item.id)}&number=${encodeURIComponent(item.number)}&price=${item.price}`
  )
}

// 快捷下单：取第一条不是自己的挂单，直接进入购买确认
const handleQuickBuy = () => {
  const first = allListings.value.find((l) => !l.isMine)
  if (!first) {
    store.showToast('暂无可购买挂单', 'info')
    return
  }
  purchaseListing.value = first
}

// 确认购买：创建 5 分钟锁定的 pending 订单，跳转订单支付页
const handleConfirmPurchase = () => {
  if (!purchaseListing.value || !collection.value) return
  if (!store.isLoggedIn) {
    store.setShowAuthModal(true)
    return
  }
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    return
  }
  const listing = purchaseListing.value
  const pending = store.createPendingOrder({
    kind: 'market',
    nftId: id.value,
    name: collection.value.name,
    image: collection.value.image,
    listingId: listing.id,
    number: listing.number,
    price: listing.price,
    quantity: 1,
  })
  if (!pending) {
    store.showToast('该挂单正被他人锁定，请稍后再试', 'error')
    return
  }
  purchaseListing.value = null
  router.push(`/order-pay/${pending.id}`)
}

const closePurchaseModal = () => {
  purchaseListing.value = null
}
</script>

<template>
  <!-- getNftById 判空兜底：getNftById 未命中时会回退到 nfts[0]，通过 id 不一致判断藏品不存在 -->
  <div v-if="!collection || collection.id !== id" class="page-container bg-neu-bg flex flex-col min-h-screen">
    <button
      @click="router.back()"
      class="fixed top-4 left-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
    >
      <ChevronLeft :size="22" class="text-gray-700" />
    </button>
    <div class="flex-1 flex flex-col items-center justify-center">
      <p class="text-lg font-bold text-neu-text-primary">藏品不存在</p>
      <p class="text-sm text-neu-text-muted mt-2">该藏品可能已下架或链接有误</p>
      <button
        @click="router.push('/market')"
        class="mt-6 px-6 h-11 rounded-full neu-accent-blue text-white text-sm font-bold"
      >
        返回市场
      </button>
    </div>
  </div>

  <div v-else class="page-container bg-neu-bg flex flex-col min-h-screen">
    <button
      @click="router.back()"
      class="fixed top-4 left-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
    >
      <ChevronLeft :size="22" class="text-gray-700" />
    </button>

    <button
      @click="liked = !liked"
      :class="`fixed top-4 right-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50 ${liked ? 'bg-amber-50' : ''}`"
    >
      <svg width="18" height="18" viewBox="0 0 24 24"
        :fill="liked ? '#f59e0b' : 'none'"
        :stroke="liked ? '#f59e0b' : '#374151'"
        stroke-width="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>

    <div class="relative shrink-0">
      <div
        class="w-full h-[280px] bg-cover bg-center"
        :style="{ backgroundImage: 'url(' + getImageUrl(collection.image, 'bg') + ')' }"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neu-bg" />
      </div>

      <div class="absolute left-1/2 -translate-x-1/2 top-[120px] z-10">
        <div
          class="w-[120px] h-[120px] rounded-2xl bg-cover bg-center shadow-lg border-2 border-white"
          :style="{ backgroundImage: 'url(' + getImageUrl(collection.image, 'cover') + ')' }"
        />
      </div>
    </div>

    <div class="flex flex-col items-center mt-12 px-4 -mt-[10px] relative z-20">
      <h1 class="text-xl font-bold text-gray-900">{{ collection.name }}</h1>
      <div class="flex items-center gap-2 mt-2 text-sm text-gray-500">
        <span>发行 {{ collection.issue }} 份</span>
        <span>|</span>
        <span>流通 {{ collection.circulation }} 份</span>
      </div>
    </div>

    <div class="flex items-center px-4 mt-6 border-b border-gray-100">
      <button
        v-for="(tab, i) in ['挂单列表', '相关公告']"
        :key="tab"
        @click="activeTab = i"
        :class="`relative h-10 mr-6 text-base font-semibold ${i === activeTab ? 'text-gray-900' : 'text-gray-400'}`"
      >
        {{ tab }}
        <div v-if="i === activeTab" class="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-500 rounded-full" />
      </button>
    </div>

    <div class="flex items-center px-4 mt-3 gap-4">
      <button
        v-for="(tab, i) in ['寄售', '求购']"
        :key="tab"
        @click="subTab = i"
        :class="`flex items-center gap-1 text-sm font-semibold ${i === subTab ? 'text-gray-900' : 'text-gray-400'}`"
      >
        {{ tab }}
        <Lock v-if="i === 1" :size="14" />
      </button>
    </div>

    <div class="flex items-center px-4 mt-3 text-xs text-gray-400">
      <span class="flex-1 font-semibold">藏品名称 | 编号</span>
      <span class="w-16 text-right font-semibold">价格</span>
      <span class="w-14 text-right font-semibold">编号</span>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-24">
      <div
        v-for="(item, idx) in allListings"
        :key="item.id"
        @click="handleListingClick(item)"
        :class="`neu-raised rounded-xl flex items-center p-3 ${idx === 0 ? 'mt-2' : ''} mb-3 ${item.isMine ? 'ring-1 ring-accent-blue/30' : 'cursor-pointer'}`"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-900">{{ collection.name }}</span>
            <span v-if="item.isMine" class="text-[10px] text-white bg-accent-blue px-1.5 py-0.5 rounded font-bold">我的</span>
          </div>
          <span class="inline-block mt-1 px-3 py-1 text-xs font-bold text-blue-600 neu-inset rounded-lg border border-blue-200/50">
            {{ item.number }}
          </span>
        </div>

        <div class="w-20 flex flex-col items-end">
          <span class="text-lg font-bold text-gray-900">¥ {{ item.price }}</span>
          <div class="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
            <span>支付钱包:</span>
            <span class="px-1 py-0.5 bg-gray-100 rounded text-gray-500">{{ item.wallet }}</span>
          </div>
        </div>

        <button
          v-if="item.isMine"
          @click="(e) => handleCancelListing(e, item.id)"
          class="ml-2 px-2.5 py-1.5 rounded-full neu-raised text-functional-danger text-xs font-bold whitespace-nowrap shrink-0"
        >
          取消寄售
        </button>
        <div v-else class="w-8 flex items-center justify-end">
          <ChevronRight :size="16" class="text-gray-300" />
        </div>
      </div>
    </div>

    <div class="fixed bottom-3 left-3 right-3 flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 z-50" :style="{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }">
      <button
        @click="store.showToast('功能开发中', 'info')"
        class="flex-1 h-12 rounded-full neu-raised text-blue-500 text-base font-bold"
      >
        发布求购
      </button>
      <button
        @click="handleQuickBuy"
        class="flex-1 h-12 rounded-full neu-accent-blue text-white text-base font-bold"
      >
        快捷下单
      </button>
    </div>

    <!-- 购买信息弹窗 -->
    <div
      v-if="purchaseListing"
      class="fixed inset-0 z-[100] flex items-end justify-center"
      @click="closePurchaseModal"
    >
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-8 px-4 animate-[flapIn_0.3s_ease-out]"
        @click="(e) => e.stopPropagation()"
      >
        <div class="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />
        <h2 class="text-center text-base font-bold text-neu-text-primary mb-4">确认购买</h2>

        <div class="neu-raised rounded-card p-4 flex items-center gap-3 mb-5">
          <div
            class="w-14 h-14 rounded-lg bg-cover bg-center shrink-0"
            :style="{ backgroundImage: 'url(' + getImageUrl(collection.image, 'cover') + ')' }"
          />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold text-neu-text-primary truncate">{{ collection.name }}</h3>
            <p class="text-xs text-neu-text-muted mt-1">编号 {{ purchaseListing.number }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-lg font-bold text-accent-blue">¥{{ purchaseListing.price }}</p>
          </div>
        </div>

        <button
          @click="handleConfirmPurchase"
          class="w-full h-12 rounded-full neu-accent-blue text-white font-bold text-base"
        >
          确认购买
        </button>
        <button
          @click="closePurchaseModal"
          class="w-full h-10 mt-2 text-sm text-neu-text-muted"
        >
          取消
        </button>
      </div>
    </div>

  </div>
</template>

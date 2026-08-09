<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight, Copy, Diamond, Home } from 'lucide-vue-next'
import { getNftById, getImageUrl, formatPrice, creatorInfo, brandInfo, storyText } from '@/data/nfts'
import { useStore } from '@/store/useStore'

const router = useRouter()
const route = useRoute()
const store = useStore()

const id = computed(() => route.params.id as string)
const nft = computed(() => getNftById(id.value))
const number = computed(() => (route.query.number as string) || '#79361')

const liked = ref(false)
const activeTab = ref(0)
const copied = ref(false)

// 通过 from 参数区分入口：assets=仓库藏品（立即寄售），market=市场挂单（立即购买该编号），其他=发售（立即购买跳支付页）
const from = computed(() => route.query.from as string | undefined)
const isOwned = computed(() => from.value === 'assets')
const fromMarket = computed(() => from.value === 'market')
// 市场来源传入的挂单信息
const marketListingId = computed(() => (route.query.listingId as string) || '')
const marketNumber = computed(() => (route.query.number as string) || '')
const marketPrice = computed(() => {
  const p = parseFloat(route.query.price as string)
  return isNaN(p) ? 0 : p
})
// 判断该编号是否已在寄售中
const isListed = computed(() => store.listings.some((l) => l.nftId === nft.value.id && l.number === number.value))
// 市场上没有的藏品（如空投藏品）不允许寄售
const canConsign = computed(() => !nft.value.id.startsWith('airdrop-'))

// 寄售弹窗状态
const showConsignModal = ref(false)
const consignPrice = ref('')
const showPasswordModal = ref(false)
const password = ref(['', '', '', '', '', ''])
const paying = ref(false)
const inputRefs = ref<(HTMLInputElement | null)[]>([])
// 市场购买确认弹窗
const showMarketBuyModal = ref(false)

// 藏品不存在兜底
const notFound = computed(() => !nft.value || nft.value.id !== id.value)

const FEE_RATE = 0.03
const consignPriceNum = computed(() => parseFloat(consignPrice.value) || 0)
const fee = computed(() => Math.round(consignPriceNum.value * FEE_RATE * 100) / 100)
const income = computed(() => Math.round((consignPriceNum.value - fee.value) * 100) / 100)

const contractAddress = '0xb' + '*'.repeat(4) + '62e02a'

const handleBuy = () => {
  if (!store.isLoggedIn) {
    store.setShowAuthModal(true)
    return
  }
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    return
  }
  if (fromMarket.value) {
    // 市场挂单来源：弹出确认购买（该编号）
    showMarketBuyModal.value = true
  } else {
    // 发售来源：创建 pending order（默认 1 份），倒计时 5 分钟独立支付页
    const unitPrice = nft.value.price ?? 0
    if (unitPrice <= 0) {
      store.showToast('暂未发售', 'info')
      return
    }
    const pending = store.createPendingOrder({
      kind: 'sale',
      nftId: nft.value.id,
      name: nft.value.name,
      image: nft.value.image,
      listingId: '',
      number: '',
      price: unitPrice,
      quantity: 1,
    })
    if (!pending) {
      store.showToast('创建订单失败，请稍后重试', 'error')
      return
    }
    router.push(`/sale-pay/${pending.id}`)
  }
}

// 市场购买：确认 → 创建 5 分钟锁定的 pending 订单，跳转订单支付页
const handleMarketConfirm = () => {
  if (!store.isLoggedIn) {
    store.setShowAuthModal(true)
    return
  }
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    return
  }
  const lid =
    store.listings.find((l) => l.nftId === nft.value.id && l.number === marketNumber.value)?.id ||
    marketListingId.value ||
    `static-${nft.value.id}-${marketNumber.value}`
  const pending = store.createPendingOrder({
    kind: 'market',
    nftId: nft.value.id,
    name: nft.value.name,
    image: nft.value.image,
    listingId: lid,
    number: marketNumber.value,
    price: marketPrice.value,
    quantity: 1,
  })
  if (!pending) {
    store.showToast('该挂单正被他人锁定，请稍后再试', 'error')
    return
  }
  showMarketBuyModal.value = false
  router.push(`/order-pay/${pending.id}`)
}

const handleConsign = () => {
  if (!store.isLoggedIn) {
    store.setShowAuthModal(true)
    return
  }
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    return
  }
  showConsignModal.value = true
}

const handleConsignConfirm = () => {
  // 寄售价格校验
  if (!consignPrice.value || consignPriceNum.value <= 0) {
    store.showToast('请输入有效的寄售价格', 'error')
    return
  }
  // 交易密码前置检查
  if (!store.hasOperationPassword) {
    store.showToast('请先设置交易密码', 'error')
    router.push('/security')
    return
  }
  showConsignModal.value = false
  showPasswordModal.value = true
  password.value = ['', '', '', '', '', '']
  setTimeout(() => inputRefs.value[0]?.focus(), 100)
}

const handlePasswordChange = (index: number, value: string) => {
  if (!/^\d?$/.test(value)) return
  const next = [...password.value]
  next[index] = value
  password.value = next
  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
  // 必须点击"确认寄售"按钮才提交
}

const handleKeyDown = (index: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !password.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const submitConsign = (pwd: string) => {
  if (pwd.length < 6) return
  // 校验交易密码
  if (!store.verifyOperationPassword(pwd)) {
    store.showToast('交易密码错误', 'error')
    password.value = ['', '', '', '', '', '']
    inputRefs.value[0]?.focus()
    return
  }
  paying.value = true
  setTimeout(() => {
    const ok = store.consignAsset(nft.value.id, number.value, consignPriceNum.value)
    paying.value = false
    showPasswordModal.value = false
    if (!ok) {
      store.showToast('寄售失败，请重试', 'error')
      return
    }
    store.showToast('寄售成功', 'success')
    setTimeout(() => {
      router.replace(`/market/${nft.value.id}`)
    }, 1000)
  }, 1500)
}

const handlePasswordSubmit = () => {
  const pwd = password.value.join('')
  if (pwd.length === 6) submitConsign(pwd)
}

const handleCopy = () => {
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div v-if="notFound" class="min-h-screen bg-neu-bg flex flex-col items-center justify-center px-6">
    <div class="neu-raised rounded-2xl p-8 flex flex-col items-center max-w-sm w-full">
      <div class="w-16 h-16 rounded-full neu-inset flex items-center justify-center mb-4">
        <Diamond :size="32" class="text-gray-400" />
      </div>
      <h2 class="text-xl font-bold text-neu-text-primary mb-2">藏品不存在</h2>
      <p class="text-sm text-neu-text-muted text-center mb-6">
        您访问的藏品可能已下架或链接无效
      </p>
      <button
        @click="router.push('/')"
        class="flex items-center gap-2 px-6 h-11 rounded-full neu-accent-blue text-white font-bold text-sm"
      >
        <Home :size="16" />
        返回首页
      </button>
    </div>
  </div>

  <div v-else class="min-h-screen bg-neu-bg text-gray-800">
    <div class="relative w-full h-[360px] overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center scale-125 blur-xl"
        :style="{ backgroundImage: 'url(' + getImageUrl(nft.image, 'bg') + ')' }"
      />
      <div class="absolute inset-0 bg-neu-bg/30" />

      <div
        class="absolute top-0 left-1/4 w-[300px] h-[200px] opacity-30"
        :style="{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }"
      />
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] opacity-40"
        :style="{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }"
      />
      <div
        class="absolute top-0 right-1/4 w-[300px] h-[200px] opacity-30"
        :style="{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }"
      />

      <div class="absolute left-1/2 -translate-x-1/2 top-[50px] z-10" :style="{ perspective: '1000px' }">
        <div class="relative animate-swing">
          <div
            class="absolute -inset-3 rounded-sm"
            :style="{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(200,200,200,0.2) 100%)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.4)',
              transform: 'translateZ(-10px)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.3)',
            }"
          />
          <div
            class="absolute -inset-1.5 rounded-sm"
            :style="{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,200,200,0.2) 50%, rgba(180,180,180,0.3) 100%)',
              backdropFilter: 'blur(2px)',
              border: '1px solid rgba(255,255,255,0.5)',
              transform: 'translateZ(-5px)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 12px rgba(0,0,0,0.2)',
            }"
          />
          <div
            class="w-[200px] h-[200px] bg-cover bg-center rounded-sm"
            :style="{
              backgroundImage: 'url(' + getImageUrl(nft.image, 'cover') + ')',
              transform: 'translateZ(0)',
              border: '2px solid rgba(255,255,255,0.6)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2), 0 0 30px rgba(255,255,255,0.1)',
            }"
          />
          <div
            class="absolute inset-0 rounded-sm pointer-events-none"
            :style="{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.15) 100%)',
              transform: 'translateZ(1px)',
            }"
          />
        </div>
      </div>

      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[80px]">
        <div
          class="absolute bottom-0 left-0 right-0 h-[72px]"
          :style="{
            clipPath: 'polygon(10% 0%, 90% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 40%, #050505 100%)',
            borderLeft: '3px solid #333',
            borderRight: '3px solid #333',
          }"
        />
        <div
          class="absolute bottom-[40px] left-0 right-0 h-[32px]"
          :style="{
            clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(180deg, #252525 0%, #151515 100%)',
            borderLeft: '2px solid #444',
            borderRight: '2px solid #444',
          }"
        />
        <div
          class="absolute bottom-[64px] left-[8%] right-[8%] h-[16px]"
          :style="{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 80%, transparent 100%)',
            filter: 'blur(1px)',
          }"
        />
        <div
          class="absolute bottom-[60px] left-[25%] w-[20px] h-[20px] rounded-full opacity-35"
          :style="{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }"
        />
        <div
          class="absolute bottom-[58px] left-[45%] w-[16px] h-[16px] rounded-full opacity-25"
          :style="{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }"
        />
        <div
          class="absolute bottom-[56px] right-[25%] w-[18px] h-[18px] rounded-full opacity-30"
          :style="{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }"
        />
        <div
          class="absolute bottom-[36px] left-[6%] right-[6%] h-[3px]"
          :style="{
            clipPath: 'polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)',
            background: 'linear-gradient(90deg, #6b4c00 0%, #b8860b 20%, #ffd700 50%, #b8860b 80%, #6b4c00 100%)',
            boxShadow: '0 0 8px rgba(218,165,32,0.5)',
          }"
        />
      </div>

      <button
        @click="router.back()"
        class="fixed top-4 left-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
      >
        <ChevronLeft :size="20" class="text-gray-700" />
      </button>

      <button
        @click="liked = !liked"
        class="fixed top-4 right-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24"
          :fill="liked ? '#f59e0b' : 'none'"
          :stroke="liked ? '#f59e0b' : '#374151'"
          stroke-width="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    </div>

    <div class="relative pt-10 pb-28 px-4">
      <div class="flex flex-col items-center">
        <h1 class="text-xl font-bold text-gray-900">{{ nft.name }}</h1>
        <div class="flex items-center gap-3 mt-2 text-sm text-gray-500">
          <span>发行 {{ nft.issue }} 份</span>
          <span class="w-1 h-1 rounded-full bg-gray-400" />
          <span>流通 {{ nft.circulation }} 份</span>
        </div>
      </div>

      <div class="neu-raised rounded-2xl p-4 mt-5">
        <div class="flex items-center justify-between py-2">
          <span class="text-gray-500 text-sm">藏品编号</span>
          <span class="text-gray-900 text-lg font-bold">{{ number }}</span>
        </div>
        <div class="w-full h-px bg-gray-200/60" />
        <div class="flex items-center justify-between py-2">
          <span class="text-gray-500 text-sm">合约地址</span>
          <div class="flex items-center gap-2">
            <span class="text-gray-900 text-sm font-semibold">{{ contractAddress }}</span>
            <button @click="handleCopy" class="text-gray-400">
              <Copy :size="14" />
            </button>
          </div>
        </div>

      </div>

      <div class="mt-8">
        <div class="flex items-center justify-center mb-4">
          <div class="flex-1 h-px bg-gray-300" />
          <div class="px-4 text-center">
            <div class="text-gray-400 text-xs tracking-[0.2em] mb-0.5">STORY</div>
            <div class="text-gray-900 text-lg font-bold">藏品故事</div>
          </div>
          <div class="flex-1 h-px bg-gray-300" />
        </div>
        <div class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {{ storyText }}
        </div>
      </div>

      <div class="mt-6 flex items-center border-b border-gray-200">
        <button
          v-for="(tab, i) in ['藏品信息', '相关公告']"
          :key="tab"
          @click="activeTab = i"
          :class="`relative h-10 mr-6 text-base font-semibold ${i === activeTab ? 'text-gray-900' : 'text-gray-400'}`"
        >
          {{ tab }}
          <div v-if="i === activeTab" class="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-500 rounded-full" />
        </button>
      </div>

      <div v-if="activeTab === 0" class="mt-4 space-y-3">
        <div class="neu-raised rounded-2xl p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <Diamond :size="20" class="text-blue-500" />
              <div>
                <div class="text-base font-bold text-gray-900">创作者</div>
                <div class="text-xs text-gray-400 tracking-wider">ARTIST</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-cover bg-center"
                :style="{ backgroundImage: 'url(' + creatorInfo.avatar + ')' }"
              />
              <span class="text-sm font-semibold text-gray-700">{{ creatorInfo.name }}</span>
              <ChevronRight :size="16" class="text-gray-400" />
            </div>
          </div>
          <div class="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
            {{ creatorInfo.bio }}
          </div>
        </div>

        <div class="neu-raised rounded-2xl p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <Diamond :size="20" class="text-blue-500" />
              <div>
                <div class="text-base font-bold text-gray-900">品牌方</div>
                <div class="text-xs text-gray-400 tracking-wider">BRAND</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-cover bg-center bg-blue-500"
                :style="{ backgroundImage: 'url(' + brandInfo.logo + ')' }"
              />
              <span class="text-sm font-semibold text-gray-700">{{ brandInfo.name }}</span>
              <ChevronRight :size="16" class="text-gray-400" />
            </div>
          </div>
          <div class="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
            {{ brandInfo.desc }}
          </div>
        </div>

        <div class="neu-raised rounded-2xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <Diamond :size="20" class="text-blue-500" />
            <div>
              <div class="text-base font-bold text-gray-900">藏品须知</div>
              <div class="text-xs text-gray-400 tracking-wider">NOTICE</div>
            </div>
          </div>
          <div class="text-gray-500 text-sm font-light leading-relaxed">
            数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁，并小于60周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。请勿对数字藏品进行炒作、场外交易、欺诈，或以任何其他非法方式进行使用。
          </div>
        </div>
      </div>

      <div v-if="activeTab === 1" class="mt-4">
        <div class="neu-raised rounded-2xl p-8">
          <div class="text-gray-400 text-center text-sm">暂无相关公告</div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-neu-bg px-4 py-3 flex items-center gap-4 z-50 border-t-2 border-gray-300/60 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div class="flex flex-col">
        <span class="text-xl font-bold text-gray-900">
          {{ fromMarket ? '¥' + marketPrice : formatPrice(nft.price) }}
        </span>
        <button
          @click="router.push(`/market/${nft.id}`)"
          class="flex items-center text-gray-400 text-xs"
        >
          前往市场 <ChevronRight :size="12" />
        </button>
      </div>
      <button
        v-if="isOwned && isListed"
        disabled
        class="flex-1 h-11 rounded-full neu-inset text-gray-400 text-base font-bold"
      >
        寄售中
      </button>
      <button
        v-else-if="isOwned && !canConsign"
        disabled
        class="flex-1 h-11 rounded-full neu-inset text-gray-400 text-base font-bold"
      >
        暂未开启寄售
      </button>
      <button
        v-else-if="isOwned"
        @click="handleConsign"
        class="flex-1 h-11 rounded-full neu-accent-orange text-white text-base font-bold"
      >
        立即寄售
      </button>
      <button
        v-else-if="fromMarket"
        @click="handleBuy"
        class="flex-1 h-11 rounded-full neu-accent-blue text-white text-base font-bold"
      >
        立即购买该编号
      </button>
      <button
        v-else
        @click="handleBuy"
        class="flex-1 h-11 rounded-full neu-raised text-blue-500 text-base font-bold"
      >
        立即购买
      </button>
    </div>

    <!-- 复制提示 -->
    <div v-if="copied" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2 bg-gray-800/80 text-white text-sm rounded-lg z-50">
      已复制
    </div>

    <!-- 寄售价格弹窗 -->
    <div v-if="showConsignModal" class="fixed inset-0 z-[100] flex items-end justify-center" @click="showConsignModal = false">
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-6 px-4 animate-[flapIn_0.3s_ease-out]"
        @click="(e) => e.stopPropagation()"
      >
        <div class="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

        <h2 class="text-center text-base font-bold text-neu-text-primary mb-1">寄售藏品</h2>
        <p class="text-center text-xs text-neu-text-muted mb-4">
          {{ nft.name }} · 编号 {{ number }}
        </p>

        <!-- 寄售价格输入 -->
        <div class="neu-inset rounded-xl px-4 py-3 mb-3">
          <label class="text-xs text-neu-text-muted">寄售价格（元）</label>
          <div class="flex items-center gap-1 mt-1">
            <span class="text-lg font-bold text-neu-text-primary">¥</span>
            <input
              type="number"
              :value="consignPrice"
              @input="e => consignPrice = (e.target as HTMLInputElement).value"
              placeholder="请输入寄售价格"
              class="flex-1 bg-transparent text-lg font-bold text-neu-text-primary outline-none placeholder:text-neu-text-muted/50 placeholder:text-sm placeholder:font-normal"
            />
          </div>
        </div>

        <!-- 手续费明细 -->
        <div class="neu-raised rounded-xl p-3 space-y-2 mb-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-neu-text-muted">寄售价格</span>
            <span class="text-sm font-semibold text-neu-text-primary">¥{{ consignPriceNum || '--' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-neu-text-muted">
              手续费 <span class="text-accent-blue">(3%)</span>
            </span>
            <span class="text-sm font-semibold text-functional-danger">-¥{{ consignPriceNum > 0 ? fee : '--' }}</span>
          </div>
          <div class="neu-divider my-1" />
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-neu-text-primary">实际到账</span>
            <span class="text-base font-bold text-accent-blue">¥{{ consignPriceNum > 0 ? income : '--' }}</span>
          </div>
        </div>

        <button
          @click="handleConsignConfirm"
          :disabled="consignPriceNum <= 0"
          class="w-full h-12 rounded-full neu-accent-orange text-white font-bold text-base disabled:opacity-50"
        >
          确认寄售
        </button>
        <button
          @click="showConsignModal = false"
          class="w-full h-10 mt-2 text-sm text-neu-text-muted"
        >
          取消
        </button>
      </div>
    </div>

    <!-- 市场购买确认弹窗 -->
    <div
      v-if="showMarketBuyModal"
      class="fixed inset-0 z-[100] flex items-end justify-center"
      @click="showMarketBuyModal = false"
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
            :style="{ backgroundImage: 'url(' + getImageUrl(nft.image, 'cover') + ')' }"
          />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold text-neu-text-primary truncate">{{ nft.name }}</h3>
            <p class="text-xs text-neu-text-muted mt-1">编号 {{ marketNumber || number }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-lg font-bold text-accent-blue">¥{{ marketPrice }}</p>
          </div>
        </div>

        <button
          @click="handleMarketConfirm"
          class="w-full h-12 rounded-full neu-accent-blue text-white font-bold text-base"
        >
          确认购买
        </button>
        <button
          @click="showMarketBuyModal = false"
          class="w-full h-10 mt-2 text-sm text-neu-text-muted"
        >
          取消
        </button>
      </div>
    </div>

    <!-- 交易密码弹窗（寄售/市场购买复用） -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-[110] flex items-end justify-center" @click="() => { if (!paying) showPasswordModal = false }">
      <div class="absolute inset-0 bg-black/40" />
      <div
        class="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-8 px-4 animate-[flapIn_0.3s_ease-out]"
        @click="(e) => e.stopPropagation()"
      >
        <div class="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

        <h2 class="text-center text-base font-bold text-neu-text-primary mb-1">输入交易密码</h2>
        <p class="text-center text-xs text-neu-text-muted mb-5">
          寄售 {{ nft.name }} · ¥{{ consignPriceNum }}
        </p>

        <div class="flex justify-center gap-3 mb-6">
          <input
            v-for="(digit, i) in password"
            :key="i"
            :ref="el => { if (el) inputRefs[i] = el as HTMLInputElement }"
            type="tel"
            maxlength="1"
            :value="digit"
            @input="e => handlePasswordChange(i, (e.target as HTMLInputElement).value)"
            @keydown="e => handleKeyDown(i, e)"
            :disabled="paying"
            class="w-11 h-12 rounded-xl neu-inset text-center text-xl font-bold text-neu-text-primary outline-none focus:ring-2 focus:ring-accent-blue/40"
          />
        </div>

        <button
          @click="handlePasswordSubmit"
          :disabled="password.join('').length < 6 || paying"
          class="w-full h-12 rounded-full neu-accent-orange text-white font-bold text-base disabled:opacity-50"
        >
          {{ paying ? '提交中...' : '确认寄售' }}
        </button>

        <button
          @click="() => { if (!paying) showPasswordModal = false }"
          class="w-full h-10 mt-2 text-sm text-neu-text-muted"
          :disabled="paying"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

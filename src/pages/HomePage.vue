<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Sparkles, Calendar, ArrowLeftRight, Vote, ChevronRight, UserPlus } from 'lucide-vue-next'
import BottomNav from '@/components/common/BottomNav.vue'
import { useStore } from '@/store/useStore'
import { getOnSaleNfts, getImageUrl, formatPrice } from '@/data/nfts'

const features = [
  { icon: Sparkles, label: '合成活动', color: 'text-accent-blue', path: '/synthesis' },
  { icon: Calendar, label: '签到活动', color: 'text-accent-blue', path: '/checkin' },
  { icon: ArrowLeftRight, label: '置换活动', color: 'text-accent-blue', path: '/swap' },
  { icon: Vote, label: '抽签活动', color: 'text-accent-blue', path: '/lottery' },
  { icon: UserPlus, label: '邀请好友', color: 'text-accent-blue', path: '/invite' },
]

const tabs = ['首发', '盲盒', '精选活动']

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=400&fit=crop',
    desc: '经典老IP回归 · 重温热血经典 开启全新冒险',
  },
  {
    image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=400&fit=crop',
    desc: '限时合成活动 · 合成稀有藏品 赢取限定好礼',
  },
  {
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=400&fit=crop',
    desc: '新人专享福利 · 注册即送盲盒 开启收藏之旅',
  },
]

const announcementList = [
  '【运营公告】关于藏锋ART平台数字资产迁移说明及第一阶段运营活动正式启动',
  '【运营公告】藏锋ART·焕新升级进展',
  '【上新预告】限时稀有藏品即将上线，敬请期待',
  '【活动公告】每日签到积分翻倍，连续7天赢好礼',
]

const activeTab = ref(0)
const bannerIndex = ref(0)
const announceIndex = ref(0)
const tick = ref(0)
const router = useRouter()
const store = useStore()

const onSaleNfts = getOnSaleNfts()

const handleFeatureClick = (path: string) => {
  if (!store.isLoggedIn) {
    store.setShowAuthModal(true)
    return
  }
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    return
  }
  router.push(path)
}

let bannerTimer: ReturnType<typeof setInterval> | undefined
let announceTimer: ReturnType<typeof setInterval> | undefined
let tickTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  bannerTimer = setInterval(() => {
    bannerIndex.value = (bannerIndex.value + 1) % banners.length
  }, 3000)

  announceTimer = setInterval(() => {
    announceIndex.value = (announceIndex.value + 1) % announcementList.length
  }, 2500)

  // 倒计时每秒刷新
  tickTimer = setInterval(() => {
    tick.value = tick.value + 1
  }, 1000)
})

onUnmounted(() => {
  clearInterval(bannerTimer)
  clearInterval(announceTimer)
  clearInterval(tickTimer)
})
</script>

<template>
  <div class="page-container bg-neu-bg">
    <!--Banner 轮播 -->
    <div class="px-4 mt-3 mb-3">
      <div class="w-full h-40 rounded-lg-card neu-raised overflow-hidden relative">
        <!--轮播图片 -->
        <div
          class="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
          :style="{ backgroundImage: 'url(' + banners[bannerIndex].image + ')' }"
        />
        <!--底部渐变遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <!--左下角描述 -->
        <p class="absolute bottom-3 left-3 text-white text-sm font-bold z-10 drop-shadow-lg">
          {{ banners[bannerIndex].desc }}
        </p>
        <!--轮播指示器 -->
        <div class="absolute bottom-3 right-3 flex gap-1.5 z-10">
          <div
            v-for="(_, i) in banners"
            :key="i"
            class="h-1.5 rounded-full transition-all"
            :class="i === bannerIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'"
          />
        </div>
      </div>
    </div>

    <!--公告流动栏 -->
    <div
      class="mx-4 mb-5 h-10 neu-raised rounded-card flex items-center px-3 cursor-pointer overflow-hidden"
      @click="router.push('/discover')"
    >
      <span class="neu-pressed text-accent-blue text-[10px] px-2 py-0.5 rounded-full mr-2 shrink-0 font-semibold">
        公告
      </span>
      <Bell :size="14" class="text-accent-blue mr-1.5 shrink-0" />
      <div class="flex-1 h-10 overflow-hidden relative">
        <div
          v-for="(text, i) in announcementList"
          :key="i"
          class="absolute inset-0 flex items-center transition-all duration-500"
          :style="{ transform: 'translateY(' + ((i - announceIndex) * 100) + '%)', opacity: i === announceIndex ? 1 : 0 }"
        >
          <span class="text-sm text-neu-text-primary font-semibold truncate w-full">
            {{ text }}
          </span>
        </div>
      </div>
      <ChevronRight :size="16" class="text-neu-text-muted ml-1 shrink-0" />
    </div>

    <!--功能入口 -->
    <div class="px-4 mb-5">
      <div class="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        <div
          v-for="(item, i) in features"
          :key="i"
          class="flex flex-col items-center gap-2 cursor-pointer shrink-0 w-16"
          @click="handleFeatureClick(item.path)"
        >
          <div
            class="w-12 h-12 rounded-full neu-raised neu-interactive flex items-center justify-center"
            :class="item.color"
          >
            <component :is="item.icon" :size="22" />
          </div>
          <span class="text-xs font-semibold text-neu-text-secondary">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!--内容Tab -->
    <div class="flex">
      <button
        v-for="(tab, i) in tabs"
        :key="tab"
        class="flex-1 h-11 text-sm font-semibold relative"
        :class="activeTab === i ? 'text-accent-blue font-bold' : 'text-neu-text-muted'"
        @click="activeTab = i"
      >
        {{ tab }}
        <div v-if="activeTab === i" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full neu-pressed" />
      </button>
    </div>
    <!--Tab 内容 -->
    <div v-if="activeTab === 0" class="flex-1 px-3 pt-3 pb-4">
      <div v-if="onSaleNfts.length > 0" class="grid grid-cols-2 gap-3">
        <div
          v-for="item in onSaleNfts"
          :key="item.id"
          class="neu-raised rounded-xl overflow-hidden active:bg-white/40 transition-colors cursor-pointer"
          @click="router.push('/nft/' + item.id)"
        >
          <!--图片区 -->
          <div class="relative">
            <div
              class="w-full aspect-square bg-cover bg-center"
              :style="{ backgroundImage: 'url(' + getImageUrl(item.image, 'cover') + ')' }"
            />
            <!--状态标签 -->
            <span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow-sm">
              发售中
            </span>
          </div>
          <!--信息区 -->
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
      <div v-else class="flex flex-col items-center justify-center py-16 text-neu-text-muted">
        <Sparkles :size="32" class="mb-2 opacity-40" />
        <p class="text-sm">暂无发售中的藏品</p>
      </div>
    </div>

    <div v-if="activeTab === 1 || activeTab === 2" class="flex-1 h-40 flex items-center justify-center text-neu-text-muted text-sm">
      敬请期待
    </div>

    <BottomNav />
  </div>
</template>

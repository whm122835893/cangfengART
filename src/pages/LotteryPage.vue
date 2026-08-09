<script setup lang="ts">
import { ref, computed } from 'vue'
import NavBar from '@/components/common/NavBar.vue'
import { useStore } from '@/store/useStore'
import { ChevronRight, X } from 'lucide-vue-next'

interface Prize {
  name: string
  desc: string
  icon: string
  color: string
  weight: number
}

const prizes: Prize[] = [
  { name: '一等奖', desc: '传说级数字藏品', icon: '👑', color: '#f59e0b', weight: 3 },
  { name: '二等奖', desc: '史诗级数字藏品', icon: '💎', color: '#a855f7', weight: 10 },
  { name: '三等奖', desc: '稀有级数字藏品', icon: '🌟', color: '#3b82f6', weight: 20 },
  { name: '四等奖', desc: '精品级数字藏品', icon: '🎁', color: '#22c55e', weight: 30 },
  { name: '谢谢参与', desc: '再接再厉', icon: '🎈', color: '#9ca3af', weight: 37 },
]

const ballColors = ['#f59e0b', '#a855f7', '#3b82f6', '#22c55e', '#9ca3af', '#ef4444', '#ec4899', '#14b8a6']

const store = useStore()

const drawing = ref(false)
const result = ref<Prize | null>(null)
const ballDropped = ref(false)
const showModal = ref(false)
const shake = ref(false)

// 今日剩余次数：跨日时重置为 3
const today = new Date().toISOString().split('T')[0]
const remainingCount = computed(() => (store.lotteryDate === today ? store.lotteryCount : 3))

const lotteryRecords = [
  { name: '张**', prize: '二等奖', time: '2026-07-12 14:30' },
  { name: '李**', prize: '三等奖', time: '2026-07-12 14:25' },
  { name: '王**', prize: '一等奖', time: '2026-07-12 14:20' },
]

const handleDraw = () => {
  if (!store.isVerified) {
    store.setShowVerifyModal(true)
    return
  }
  if (drawing.value) return
  // 扣减抽奖次数，失败则提示
  if (!store.drawLottery()) {
    store.showToast('今日次数已用完', 'error')
    return
  }
  drawing.value = true
  ballDropped.value = false
  showModal.value = false
  result.value = null

  // 晃动动画
  shake.value = true

  // 计算奖品
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0)
  let random = Math.random() * totalWeight
  let selected = prizes[0]
  for (const prize of prizes) {
    random -= prize.weight
    if (random <= 0) {
      selected = prize
      break
    }
  }

  // 2秒后停止晃动，出蛋
  setTimeout(() => {
    shake.value = false
    drawing.value = false
    result.value = selected
    ballDropped.value = true
    // 中奖入库（非"谢谢参与"）
    if (selected.name !== '谢谢参与') {
      store.addAsset({
        nftId: 'lottery_' + Date.now(),
        name: selected.name,
        image: '',
        price: 0,
        quantity: 1,
      })
      store.showToast('奖品已入库', 'success')
    }
  }, 2000)
}

const handleBallClick = () => {
  showModal.value = true
}
</script>

<template>
  <div class="page-container bg-neu-bg pb-4">
    <NavBar title="扭蛋抽奖" />

    <!-- 扭蛋机主体 -->
    <div class="flex flex-col items-center mx-4 mt-4">
      <div
        class="neu-raised rounded-lg-card w-full p-4 flex flex-col items-center relative overflow-hidden"
        :style="{ background: 'linear-gradient(180deg, #e8ecf1 0%, #d5dce6 100%)' }"
      >
        <!-- ===== 扭蛋机 3D ===== -->
        <div class="relative w-full flex flex-col items-center" :style="{ perspective: '800px' }">
          <!-- 顶部装饰 / 投币口 -->
          <div
            class="w-40 h-5 rounded-t-2xl relative z-10"
            :style="{ background: 'linear-gradient(180deg, #c0c8d4, #a0aab8)' }"
          >
            <div class="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-[#4A90D9] shadow-inner" />
          </div>

          <!-- 透明罩 -->
          <div class="relative w-44 h-44 z-0" :style="{ transformStyle: 'preserve-3d' }">
            <!-- 罩子主体 -->
            <div
              class="absolute inset-0 rounded-full overflow-hidden"
              :style="{
                background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.5) 0%, rgba(180,200,220,0.3) 40%, rgba(140,160,180,0.5) 100%)',
                boxShadow: 'inset 0 0 30px rgba(255,255,255,0.3), 0 8px 20px rgba(0,0,0,0.15)',
              }"
            >
              <!-- 高光 -->
              <div class="absolute top-3 left-4 w-10 h-6 rounded-full bg-white/30 rotate-12" />
              <div class="absolute top-6 left-5 w-4 h-2 rounded-full bg-white/40 rotate-12" />

              <!-- 彩色小球 -->
              <div :class="['absolute inset-0 flex items-center justify-center', shake ? 'animate-pulse' : '']">
                <div
                  v-for="(color, i) in ballColors"
                  :key="i"
                  :class="['absolute w-7 h-7 rounded-full transition-all duration-200', shake ? 'ball-shake' : '']"
                  :style="{
                    background: `radial-gradient(circle at 35% 30%, ${color}88, ${color})`,
                    boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.3)',
                    top: `${20 + (i % 3) * 35 + Math.sin(i * 1.5) * 10}px`,
                    left: `${25 + Math.floor(i / 3) * 35 + Math.cos(i * 1.5) * 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }"
                />
              </div>
            </div>

            <!-- 罩子底部边框 -->
            <div
              class="absolute bottom-0 left-0 right-0 h-3 rounded-b-full"
              :style="{ background: 'linear-gradient(180deg, rgba(180,200,220,0.6), #a0aab8)' }"
            />
          </div>

          <!-- 机器主体 -->
          <div
            class="w-36 h-20 relative z-[-1] -mt-1"
            :style="{
              background: 'linear-gradient(180deg, #a0aab8 0%, #8892a0 50%, #6e7a8a 100%)',
              borderRadius: '0 0 16px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.2)',
            }"
          >
            <!-- 出蛋口 -->
            <div
              class="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              :style="{
                background: 'radial-gradient(circle, #4a5568 0%, #2d3748 100%)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 0 0 3px #8892a0',
              }"
            >
              <div class="w-6 h-6 rounded-full bg-[#2d3748] shadow-inner" />
            </div>

            <!-- 扭蛋按钮 -->
            <button
              @click="handleDraw"
              :disabled="drawing"
              class="absolute -right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200"
              :style="{
                background: 'linear-gradient(145deg, #6DB3F2, #4A90D9)',
                boxShadow: drawing ? 'inset -1px -1px 2px rgba(255,255,255,0.7), inset 1px 1px 2px rgba(174,186,204,0.5)' : '-1px -1px 2px rgba(255,255,255,0.7), 1px 1px 2px rgba(174,186,204,0.5)',
                transform: drawing ? 'scale(0.95)' : 'scale(1)',
              }"
            >
              <span class="text-white text-xs font-bold">{{ drawing ? '扭动中' : '扭一扭' }}</span>
            </button>
          </div>

          <!-- 机器底座 -->
          <div
            class="w-44 h-4 -mt-1"
            :style="{
              background: 'linear-gradient(180deg, #6e7a8a, #5a6678)',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }"
          />

          <!-- 出蛋滑槽 -->
          <div
            class="w-8 h-6 relative -mt-0.5"
            :style="{
              background: 'linear-gradient(180deg, #5a6678, #4a5568)',
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            }"
          />

          <!-- 托盘 -->
          <div
            class="w-24 h-7 relative"
            :style="{
              background: 'linear-gradient(180deg, #8892a0, #6e7a8a)',
              borderRadius: '0 0 50% 50%',
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.15)',
            }"
          >
            <!-- 掉落的小球 -->
            <div
              v-if="ballDropped && result"
              class="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full cursor-pointer animate-bounce z-20"
              :style="{
                background: `radial-gradient(circle at 35% 30%, ${result.color}88, ${result.color})`,
                boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.2)',
              }"
              @click="handleBallClick"
            />
          </div>
        </div>

        <!-- 提示文字 -->
        <p class="text-sm text-neu-text-muted font-semibold mt-4">
          {{ ballDropped ? '点击扭蛋查看结果' : drawing ? '扭蛋中...' : '点击右侧按钮开始扭蛋' }}
        </p>
      </div>
    </div>

    <!-- 剩余次数 -->
    <div class="mx-4 mt-4">
      <div class="neu-raised rounded-card p-4 flex items-center justify-between">
        <span class="text-sm font-semibold text-neu-text-primary">今日剩余次数</span>
        <span class="text-lg font-bold text-accent-blue">{{ remainingCount }}</span>
      </div>
    </div>

    <!-- 中奖记录 -->
    <div class="mx-4 mt-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-neu-text-primary">扭蛋记录</h3>
        <button class="flex items-center gap-0.5 text-xs text-neu-text-muted font-semibold">
          查看更多
          <ChevronRight :size="14" />
        </button>
      </div>
      <div class="neu-raised rounded-card divide-y divide-neu-divider">
        <div v-for="(item, i) in lotteryRecords" :key="i" class="p-3 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full neu-accent-blue flex items-center justify-center shrink-0">
            <span class="text-white text-xs font-bold">🎰</span>
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-sm font-semibold text-neu-text-primary block">
              {{ item.name }} 抽中 {{ item.prize }}
            </span>
            <span class="text-xs text-neu-text-muted">{{ item.time }}</span>
          </div>
          <span class="text-xs text-accent-blue font-bold neu-pressed px-2 py-0.5 rounded-full shrink-0">
            {{ item.prize }}
          </span>
        </div>
      </div>
    </div>

    <!-- 活动规则 -->
    <div class="mx-4 mt-4">
      <div class="neu-raised rounded-card p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-neu-text-primary">活动规则</span>
          <ChevronRight :size="16" class="text-neu-text-muted" />
        </div>
        <div class="neu-divider my-3" />
        <div class="text-xs text-neu-text-secondary leading-relaxed space-y-1.5">
          <p>1. 每位用户每天可免费扭蛋 3 次。</p>
          <p>2. 中奖藏品将自动发放至您的资产账户。</p>
          <p>3. 扭蛋结果随机，概率公平公正。</p>
          <p>4. 活动最终解释权归藏锋ART平台所有。</p>
        </div>
      </div>
    </div>

    <!-- 中奖弹窗 -->
    <div
      v-if="showModal && result"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      @click="showModal = false"
    >
      <div
        class="neu-raised rounded-lg-card mx-6 p-6 flex flex-col items-center w-full max-w-[320px] animate-scale-in relative"
        @click.stop
      >
        <!-- 关闭按钮 -->
        <button
          @click="showModal = false"
          class="absolute top-3 right-3 w-7 h-7 neu-raised rounded-full flex items-center justify-center"
        >
          <X :size="14" class="text-neu-text-muted" />
        </button>

        <!-- 结果图标 -->
        <div class="w-20 h-20 rounded-full neu-inset flex items-center justify-center mb-4">
          <span class="text-5xl">{{ result.icon }}</span>
        </div>

        <!-- 结果文字 -->
        <h2 class="text-xl font-bold text-neu-text-primary mb-1">
          {{ result.name === '谢谢参与' ? '很遗憾' : '恭喜获得' }}
        </h2>
        <p class="text-lg font-bold text-accent-blue mb-1">{{ result.name }}</p>
        <p class="text-sm text-neu-text-muted mb-6">{{ result.desc }}</p>

        <!-- 按钮 -->
        <div class="flex gap-3 w-full">
          <button
            @click="showModal = false"
            class="flex-1 h-10 neu-raised rounded-2xl text-sm font-bold text-neu-text-primary"
          >
            知道了
          </button>
          <button
            @click="showModal = false"
            class="flex-1 h-10 neu-accent-blue rounded-2xl text-sm font-bold text-white"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
  @keyframes ballShake {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(4px, -6px) rotate(15deg); }
    50% { transform: translate(-3px, 2px) rotate(-10deg); }
    75% { transform: translate(2px, -4px) rotate(5deg); }
  }
  .ball-shake {
    animation: ballShake 0.3s infinite;
  }
  @keyframes scaleIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }
</style>

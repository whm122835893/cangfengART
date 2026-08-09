<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle, X } from 'lucide-vue-next'
import { useStore } from '@/store/useStore'

const router = useRouter()
const store = useStore()

const visible = computed(() => store.showAuthModal || store.showVerifyModal)
const isAuth = computed(() => store.showAuthModal)

const handleClose = () => {
  store.setShowAuthModal(false)
  store.setShowVerifyModal(false)
}

const handleConfirm = () => {
  const target = isAuth.value ? '/login' : '/verification'
  handleClose()
  router.push(target).catch(() => { /* ignore nav errors */ })
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center"
    @click.self="handleClose"
  >
    <div
      class="neu-raised bg-neu-bg rounded-lg-card w-[300px] p-6 relative"
      @click.stop
    >
      <button class="absolute top-4 right-4 z-10" @click="handleClose">
        <X :size="20" class="text-neu-text-muted" />
      </button>
      <div class="flex flex-col items-center pt-6 pb-4">
        <div class="w-16 h-16 rounded-full neu-inset flex items-center justify-center mb-5">
          <AlertCircle :size="32" class="text-accent-blue" />
        </div>
        <p class="text-lg font-bold text-neu-text-primary mb-2">
          {{ isAuth ? '请先登录' : '请先完成实名认证' }}
        </p>
        <p class="text-sm text-neu-text-secondary mb-6 text-center">
          {{ isAuth ? '登录后即可使用完整功能' : '实名认证后可购买藏品' }}
        </p>
        <div class="flex gap-3 w-full">
          <button
            type="button"
            class="flex-1 h-11 neu-raised rounded-2xl text-neu-text-secondary font-semibold text-sm"
            @click="handleClose"
          >
            取消
          </button>
          <button
            type="button"
            class="flex-1 h-11 neu-accent-blue rounded-2xl text-white font-semibold text-sm z-10"
            @click="handleConfirm"
          >
            {{ isAuth ? '去登录' : '去认证' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

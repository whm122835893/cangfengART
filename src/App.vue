<script setup lang="ts">
import { onErrorCaptured, ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Toast from '@/components/common/Toast.vue'
import AuthModal from '@/components/common/AuthModal.vue'
import { useStore } from '@/store/useStore'

const hasError = ref(false)

const store = useStore()

const goHome = () => {
  window.location.href = '/'
}

onErrorCaptured(() => {
  hasError.value = true
  return false
})

// 应用初始化：确保老用户（从持久化恢复）也能补全空投订单与资产入库
onMounted(() => {
  if (store.isLoggedIn && store.isVerified) {
    store.ensureAirdropOrders()
  }
})
</script>

<template>
  <div v-if="hasError" class="min-h-screen bg-neu-bg flex flex-col items-center justify-center">
    <p class="text-lg font-bold text-neu-text-primary mb-2">页面出错了</p>
    <button
      class="px-6 py-2 rounded-full neu-accent-blue text-white font-bold text-sm"
      @click="goHome"
    >
      返回首页
    </button>
  </div>
  <template v-else>
    <RouterView />
    <AuthModal />
    <Toast />
  </template>
</template>

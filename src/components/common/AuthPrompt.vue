<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle, ChevronRight } from 'lucide-vue-next'
import { useStore } from '@/store/useStore'

const props = withDefaults(defineProps<{
  /** 提示类型：'login' 未登录 | 'verify' 未实名 */
  type?: 'login' | 'verify'
}>(), { type: 'login' })

const router = useRouter()
const store = useStore()

const visible = computed(() =>
  (props.type === 'login' && !store.isLoggedIn) ||
  (props.type === 'verify' && !store.isVerified)
)

const message = computed(() =>
  props.type === 'login' ? '您还未登录，点击去登录' : '您还未实名认证，点击去实名'
)
const path = computed(() => props.type === 'login' ? '/login' : '/verification')
</script>

<template>
  <div
    v-if="visible"
    class="neu-raised rounded-card p-3 flex items-center gap-3 cursor-pointer"
    @click="router.push(path)"
  >
    <AlertCircle :size="20" class="text-accent-blue" />
    <span class="text-sm font-semibold text-accent-blue flex-1">{{ message }}</span>
    <ChevronRight :size="18" class="text-accent-blue" />
  </div>
</template>

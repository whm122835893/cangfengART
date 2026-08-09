<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle, XCircle, Info } from 'lucide-vue-next'
import { useStore } from '@/store/useStore'

const store = useStore()
const toast = computed(() => store.toast)
</script>

<template>
  <div
    v-if="toast"
    class="fixed top-20 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
  >
    <div class="neu-raised rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg animate-[slideDown_0.3s_ease-out]">
      <CheckCircle v-if="toast.type === 'success'" :size="18" class="text-functional-success" />
      <XCircle v-else-if="toast.type === 'error'" :size="18" class="text-functional-error" />
      <Info v-else :size="18" class="text-accent-blue" />
      <span class="text-sm font-semibold text-neu-text-primary">{{ toast.message }}</span>
    </div>
  </div>
</template>

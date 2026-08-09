<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps<{
  title?: string
  transparent?: boolean
  onBack?: () => void
}>()

const router = useRouter()

const handleBack = () => {
  if (props.onBack) props.onBack()
  else router.back()
}
</script>

<template>
  <div
    class="flex items-center justify-between px-4 h-navbar sticky top-0 z-50"
    :class="transparent ? 'bg-transparent' : 'neu-flat'"
  >
    <button
      class="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center"
      @click="handleBack"
    >
      <ArrowLeft :size="18" class="text-accent-blue" />
    </button>
    <h1
      v-if="title"
      class="text-lg font-bold text-neu-text-primary absolute left-1/2 -translate-x-1/2"
    >
      {{ title }}
    </h1>
    <div class="min-w-[36px]"><slot name="right" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  onClick?: () => void
  variant?: 'white' | 'gray' | 'transparent'
}>(), { variant: 'white' })

const router = useRouter()

const handleClick = () => {
  if (props.onClick) props.onClick()
  else router.back()
}

const variantClass = computed(() => ({
  white: 'neu-raised',
  gray: 'neu-inset',
  transparent: 'bg-white/20 backdrop-blur-sm',
}[props.variant]))
</script>

<template>
  <button
    class="w-9 h-9 rounded-full flex items-center justify-center neu-interactive"
    :class="[variantClass]"
    @click="handleClick"
  >
    <ArrowLeft :size="18" class="text-accent-blue" />
  </button>
</template>

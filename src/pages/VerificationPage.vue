<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Shield } from 'lucide-vue-next'
import NavBar from '@/components/common/NavBar.vue'
import { useStore } from '@/store/useStore'

const router = useRouter()
const store = useStore()

const name = ref('')
const idNumber = ref('')

const isIdNumberValid = (value: string) => /^\d{17}[\dXx]$/.test(value)

const onNameInput = (e: Event) => {
  name.value = (e.target as HTMLInputElement).value
}

const onIdNumberInput = (e: Event) => {
  idNumber.value = (e.target as HTMLInputElement).value
}

const handleSubmit = () => {
  if (!name.value || idNumber.value.length !== 18) return
  if (!isIdNumberValid(idNumber.value)) {
    store.showToast('身份证号格式不正确', 'error')
    return
  }
  store.updateUser({ realName: name.value, idNumber: idNumber.value.toUpperCase() })
  store.setVerified(true)
  store.showToast('认证成功', 'success')
  setTimeout(() => router.back(), 1200)
}
</script>

<template>
  <div v-if="store.isVerified" class="page-container bg-neu-bg">
    <NavBar title="实名认证" />
    <div class="flex flex-col items-center justify-center pt-24">
      <div class="w-20 h-20 rounded-full neu-accent-green flex items-center justify-center mb-6">
        <Shield :size="36" class="text-white" />
      </div>
      <p class="text-lg font-bold text-neu-text-primary mb-2">已认证</p>
      <p class="text-sm text-neu-text-muted">您的账号已完成实名认证</p>
    </div>
  </div>
  <div v-else class="page-container bg-neu-bg">
    <NavBar title="实名认证" />

    <div class="px-4 mt-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full neu-raised flex items-center justify-center">
          <Shield :size="24" class="text-accent-blue" />
        </div>
        <div>
          <p class="text-base font-bold text-neu-text-primary">实名认证</p>
          <p class="text-xs text-neu-text-muted">完成认证，解锁更多权益</p>
        </div>
      </div>

      <!-- 姓名 -->
      <div class="mb-4">
        <label class="text-sm font-semibold text-neu-text-primary mb-2 block">真实姓名</label>
        <input
          type="text"
          :value="name"
          @input="onNameInput"
          placeholder="请输入真实姓名"
          class="w-full h-12 neu-inset rounded-2xl px-4 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
        />
      </div>

      <!-- 身份证号 -->
      <div class="mb-8">
        <label class="text-sm font-semibold text-neu-text-primary mb-2 block">身份证号码</label>
        <input
          type="text"
          :value="idNumber"
          @input="onIdNumberInput"
          placeholder="请输入18位身份证号码"
          :maxlength="18"
          class="w-full h-12 neu-inset rounded-2xl px-4 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
        />
      </div>

      <button
        @click="handleSubmit"
        :disabled="!name || idNumber.length !== 18"
        class="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base disabled:opacity-50"
      >
        提交认证
      </button>
    </div>
  </div>
</template>

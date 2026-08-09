<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight, X, Shield } from 'lucide-vue-next'
import NavBar from '@/components/common/NavBar.vue'
import { useStore } from '@/store/useStore'

type ModalType = 'operation' | 'loginPassword' | null

const store = useStore()

const modalType = ref<ModalType>(null)
const code = ref('')
const newPassword = ref('')
const operationPassword = ref('')
const confirmCode = ref('')
const showSuccess = ref(false)

const closeModal = () => {
  modalType.value = null
  code.value = ''
  newPassword.value = ''
  operationPassword.value = ''
  confirmCode.value = ''
  showSuccess.value = false
}

const handleSendCode = () => {
  code.value = '123456'
}

const handleSubmitLoginPassword = () => {
  if (newPassword.value.length >= 8 && code.value) {
    showSuccess.value = true
    setTimeout(closeModal, 1500)
  }
}

const handleSubmitOperationPassword = () => {
  if (operationPassword.value.length === 6 && /^\d{6}$/.test(operationPassword.value) && confirmCode.value === operationPassword.value) {
    store.setOperationPassword(operationPassword.value)
    store.showToast('设置成功', 'success')
    showSuccess.value = true
    setTimeout(closeModal, 1500)
  }
}
</script>

<template>
  <div class="page-container bg-neu-bg">
    <NavBar title="安全设置" />

    <div class="mx-4 mt-4 neu-raised rounded-card overflow-hidden">
      <!-- 设置操作密码 -->
      <div
        class="flex items-center justify-between h-14 px-4 cursor-pointer"
        @click="modalType = 'operation'"
      >
        <span class="text-base font-semibold text-neu-text-primary">
          {{ store.hasOperationPassword ? '修改操作密码' : '设置操作密码' }}
        </span>
        <ChevronRight :size="18" class="text-neu-text-muted" />
      </div>
      <div class="neu-divider" />

      <!-- 修改登录密码 -->
      <div
        class="flex items-center justify-between h-14 px-4 cursor-pointer"
        @click="modalType = 'loginPassword'"
      >
        <span class="text-base font-semibold text-neu-text-primary">修改登录密码</span>
        <ChevronRight :size="18" class="text-neu-text-muted" />
      </div>
      <div class="neu-divider" />

      <!-- 账号注销 -->
      <div
        class="flex items-center justify-between h-14 px-4 cursor-pointer"
        @click="store.showToast('功能开发中', 'info')"
      >
        <span class="text-base font-semibold text-neu-text-primary">账号注销</span>
        <ChevronRight :size="18" class="text-neu-text-muted" />
      </div>
    </div>

    <!-- 弹窗遮罩 -->
    <div v-if="modalType" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div class="neu-raised bg-neu-bg rounded-lg-card w-[320px] p-6 relative">
        <button @click="closeModal" class="absolute top-4 right-4">
          <X :size="20" class="text-neu-text-muted" />
        </button>

        <div v-if="showSuccess" class="flex flex-col items-center py-8">
          <div class="w-14 h-14 rounded-full neu-accent-green flex items-center justify-center mb-4">
            <Shield :size="28" class="text-white" />
          </div>
          <p class="text-base font-bold text-neu-text-primary">设置成功</p>
        </div>
        <template v-else>
          <h3 class="text-lg font-bold text-neu-text-primary mb-4 text-center">
            {{ modalType === 'operation' ? (store.hasOperationPassword ? '修改操作密码' : '设置操作密码') : '修改登录密码' }}
          </h3>

          <template v-if="modalType === 'operation'">
            <!-- 验证码 -->
            <label class="text-sm font-semibold text-neu-text-primary mb-1 block">验证码</label>
            <div class="flex gap-2 mb-4">
              <input
                type="text"
                :value="code"
                @input="e => code = (e.target as HTMLInputElement).value"
                placeholder="请输入验证码"
                :maxlength="6"
                class="flex-1 h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
              />
              <button
                @click="handleSendCode"
                class="h-10 px-4 neu-accent-blue rounded-2xl text-white text-sm font-semibold shrink-0"
              >
                发送验证码
              </button>
            </div>

            <!-- 设置6位操作密码 -->
            <label class="text-sm font-semibold text-neu-text-primary mb-1 block">设置6位操作密码</label>
            <input
              type="password"
              :value="operationPassword"
              @input="e => operationPassword = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6)"
              placeholder="请输入6位数字密码"
              :maxlength="6"
              class="w-full h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none mb-4"
            />

            <!-- 确认密码 -->
            <label class="text-sm font-semibold text-neu-text-primary mb-1 block">确认操作密码</label>
            <input
              type="password"
              :value="confirmCode"
              @input="e => confirmCode = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6)"
              placeholder="请再次输入操作密码"
              :maxlength="6"
              class="w-full h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none mb-6"
            />

            <button
              @click="handleSubmitOperationPassword"
              :disabled="!code || operationPassword.length !== 6 || confirmCode !== operationPassword"
              class="w-full h-11 neu-accent-blue rounded-2xl text-white font-bold text-base disabled:opacity-50"
            >
              确认设置
            </button>
          </template>
          <template v-else>
            <!-- 验证码 -->
            <label class="text-sm font-semibold text-neu-text-primary mb-1 block">验证码</label>
            <div class="flex gap-2 mb-4">
              <input
                type="text"
                :value="code"
                @input="e => code = (e.target as HTMLInputElement).value"
                placeholder="请输入验证码"
                :maxlength="6"
                class="flex-1 h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
              />
              <button
                @click="handleSendCode"
                class="h-10 px-4 neu-accent-blue rounded-2xl text-white text-sm font-semibold shrink-0"
              >
                发送验证码
              </button>
            </div>

            <!-- 新密码 -->
            <label class="text-sm font-semibold text-neu-text-primary mb-1 block">新登录密码</label>
            <input
              type="password"
              :value="newPassword"
              @input="e => newPassword = (e.target as HTMLInputElement).value"
              placeholder="至少8位，包含数字和字母"
              class="w-full h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none mb-6"
            />

            <button
              @click="handleSubmitLoginPassword"
              :disabled="!code || newPassword.length < 8"
              class="w-full h-11 neu-accent-blue rounded-2xl text-white font-bold text-base disabled:opacity-50"
            >
              确认修改
            </button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

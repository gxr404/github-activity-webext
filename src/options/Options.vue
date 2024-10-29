<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import ThemeToggle from './ThemeToggle.vue'
import logo from '~/assets/logo.svg'
import { storageConfig } from '~/logic/storage'
import 'element-plus/es/components/message-box/style/index'
import 'element-plus/es/components/message/style/index'

const isCustomService = ref(storageConfig.value.isCustomService)
const customService = ref(storageConfig.value.customService)
// 在你的 setup 方法中
const { appContext } = getCurrentInstance()!

watch(isCustomService, () => {
  if (!isCustomService.value) {
    customService.value = ''
  }
})

watch(storageConfig, () => {
  isCustomService.value = storageConfig.value.isCustomService
  customService.value = storageConfig.value.customService
}, {
  once: true,
  deep: true,
})

// eslint-disable-next-line regexp/no-unused-capturing-group, regexp/no-misleading-capturing-group
const urlReg = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(:\d{1,5})?(\/[\w.-]*)*(\?[\w=&.]*)?$/i

function save() {
  if (!isCustomService.value) {
    storageConfig.value.isCustomService = false
    storageConfig.value.customService = ''
    successMsg()
    return
  }

  if (!customService.value) {
    ElMessage({
      message: 'Need to fill in customService',
      type: 'error',
    }, appContext)
    return
  }

  if (!urlReg.test(customService.value)) {
    ElMessage({
      message: 'Illegal URL',
      type: 'error',
    }, appContext)
    return
  }
  const len = customService.value.length
  const lastChar = customService.value.charAt(len - 1)

  storageConfig.value.customService = lastChar === '/'
    ? customService.value.slice(0, len - 1)
    : customService.value

  storageConfig.value.isCustomService = true
  successMsg()
}

function successMsg() {
  ElMessage({
    message: 'Save Success',
    type: 'success',
  }, appContext)
}
</script>

<template>
  <div class="w-[100vw] h-[100vh] bg-bbg">
    <ThemeToggle />
    <main class="px-4 py-20 text-center text-gray-700 dark:text-gray-200 flex flex-col items-center">
      <el-card shadow="never" class="b-rounded-2xl">
        <template #header>
          <div class="card-header">
            <img :src="logo" class="icon-btn mx-2 text-2xl w-[100px] h-[100px]" alt="extension icon">
            <div class="text-[20px] font-bold py-1">
              Options
            </div>
          </div>
        </template>
        <div class="flex flex-col justify-center py-2 w-[550px] gap-2">
          <div class="flex gap-2 items-center">
            <span class="text-[16px] min-w-140px">Custom Service</span>
            <div class="flex min-w-400px ">
              <el-switch v-model="isCustomService" />
            </div>
          </div>
          <div v-if="isCustomService" class="flex gap-2 items-center">
            <span class="text-[16px] min-w-140px"> Domain </span>
            <div class="flex min-w-400px">
              <el-input
                v-model="customService"
                class="rounded w-full"
                placeholder="https://xxx"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <button
            class="py-1 px-6 border b-rounded-full text-[14px] dark:b-[#414243] hover:opacity-60"
            @click="save"
          >
            Save
          </button>
        </template>
      </el-card>
    </main>
  </div>
</template>

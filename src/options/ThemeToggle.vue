<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { SwitchInstance } from 'element-plus'
import { isDark, toggleDark } from '../composables/dark'
import DarkIcon from './icons/dark.vue'
import LightIcon from './icons/light.vue'

defineOptions({ inheritAttrs: false })

const darkMode = ref(isDark.value)
const switchRef = ref<SwitchInstance>()

watch(
  () => darkMode.value,
  () => {
    toggleDark()
  },
)

function beforeChange() {
  return new Promise<boolean>((resolve) => {
    const isAppearanceTransition
      = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isAppearanceTransition) {
      resolve(true)
      return
    }

    const switchElement = switchRef.value?.$el
    const rect = switchElement.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    const transition = document.startViewTransition(async () => {
      resolve(true)
      await nextTick()
    })
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          // duration: 1000,
          easing: 'ease-in',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
  })
}
</script>

<template>
  <div class="theme-toggler-content absolute right-6 top-6">
    <el-switch
      ref="switchRef"
      v-model="darkMode"
      v-bind="$attrs"
      :before-change="beforeChange"
      :active-action-icon="DarkIcon"
      :inactive-action-icon="LightIcon"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-switch__core) {
  --el-switch-on-color: var(--bg-color-mute);
  --el-switch-off-color: var(--bg-color-mute);
  --el-switch-border-color: var(--border-color);

  .el-switch__action {
    width: 14px;
    height: 14px;
  }
}

:deep(.dark-icon) {
  border-radius: 50%;
  color: #cfd3dc;
  background-color: #141414;
}

:deep(.light-icon) {
  color: #606266;
}

.theme-toggler-content {
  color: var(--text-color);
  transition: border-color var(--el-transition-duration), background-color var(--el-transition-duration-fast);
  background-color: transparent;
  border-radius: 50%;
  height: 24px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  // @include respond-to('md') {
  //   display: flex;
  //   align-items: center;
  // }
}
</style>

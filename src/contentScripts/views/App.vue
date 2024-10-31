<script setup lang="ts">
import 'uno.css'
import { storageConfig } from '~/logic/storage'

const { pathname } = location
const username = ref('')

const activityHref = computed(() => {
  if (!username.value)
    return ''
  if (storageConfig.value.isCustomService) {
    return `${storageConfig.value.customService}/${username.value}?theme=dark`
  }
  return `https://github-activity-one.vercel.app/${username.value}?theme=dark`
})

const pathArr = pathname.split('/').filter(Boolean)
if (pathArr.length === 1) {
  username.value = pathArr[0]
}
</script>

<template>
  <span v-if="username" class="follow d-block">
    <a
      class="btn btn-block mt-2"
      :href="activityHref"
      target="_blank"
    >
      User Activity
    </a>
  </span>
</template>

<template>
  <div
    class="shadow-md dark:shadow-base-content/30 select-none bg-base-200 basis-1/8 max-w-1/8 rounded-lg hover:btn-active">
    <div class="flex justify-start items-center gap-2 px-4 py-2" :class="{ 'tooltip': tooltipOn }"
      :data-tip="props.data.folderName">
      <Iconify icon="solar:folder-bold-duotone" class="grow-0 text-orange-400 dark:text-blue-600" height="1.5em" />
      <div class="grow text-left w-28 truncate">{{ props.data.folderName }}</div>
      <DetailDrop />
    </div>
    <div v-if="props.preview"
      class="my-2 rounded-md mx-2 flex justify-center items-center h-40 bg-white dark:bg-base-content dark:text-base-300">
      <slot />
    </div>
  </div>
</template>

<script setup>
import DetailDrop from '~/components/DetailDrop.vue'
import { onMounted, ref } from 'vue'
const props = defineProps({
  preview: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: {},
  },
})
const tooltipOn = ref(false)

onMounted(() => {
  if (props.data) {
    if (props.data.folderName.length > 15) {
      tooltipOn.value = true
    }
  }
})
</script>

<style></style>

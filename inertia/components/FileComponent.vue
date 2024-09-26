<template>
  <div
    class="shadow-md dark:shadow-base-content/30 select-none bg-base-200 basis-1/12 rounded-lg hover:btn-active"
  >
    <div
      class="flex justify-start items-center text-sm gap-2 px-4 py-2 tooltip"
      :data-tip="props.data.folderName || props.data.fileName"
    >
      <Iconify :icon="icons.icon" class="grow-0" :class="icons.class" height="1.5em" />
      <div class="grow text-left w-28 truncate">
        {{ props.data.folderName || props.data.fileName }}
      </div>
      <DetailDrop :data="props.data" :isFile="props.preview" />
    </div>
    <div
      v-if="props.preview"
      class="my-2 rounded-lg mx-2 flex justify-center items-center overflow-hidden aspect-square bg-white dark:bg-white/90 dark:text-base-300"
    >
      <slot>
        <Iconify
          v-if="isImageOrVideo()"
          :icon="icons.icon"
          class="grow-0 drop-shadow-lg rounded-lg"
          :class="icons.class"
          height="4.5em"
        />
        <img
          v-else
          :src="props.data.thumbnailPath"
          class="grow-0 drop-shadow-lg w-full h-full object-top object-cover"
          :alt="props.data.fileName"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import DetailDrop from '~/components/DetailDrop.vue'
import { onMounted, ref } from 'vue'
import sysService from '~/services/sys.service.ts'
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
const icons = ref({
  icon: 'solar:folder-bold-duotone',
  class: 'text-orange-400 dark:text-blue-600',
})

const changeIcon = async () => {
  const icon = await sysService.fileTypeIcons()
  const color = await sysService.fileTypeColor()
  icons.value.icon = icon[props.data.fileExt.toLowerCase()] || icon['default']
  icons.value.class = color[props.data.fileExt.toLowerCase()] || color['default']
}

const isImageOrVideo = () => {
  const imageAndVideoTypeFile = ['image', 'video']
  const check = imageAndVideoTypeFile.includes(props.data.fileType.toLowerCase())
  return !check
}

onMounted(() => {
  if (props.data) {
    if (props.preview === true) {
      changeIcon()
      isImageOrVideo()
      if (props.data.fileName.length > 15) {
        tooltipOn.value = true
      }
    } else {
      if (props.data.folderName.length > 15) {
        tooltipOn.value = true
      }
    }
  }
})
</script>

<style></style>

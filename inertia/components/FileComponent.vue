<template>
  <div
    class="shadow-md dark:shadow-base-content/30 select-none basis-1/12 rounded-lg"
    :class="{
      'bg-success/40 dark:bg-success/30': props.selected,
      'bg-base-200': !props.selected,
    }"
  >
    <div
      class="flex justify-start items-center text-sm gap-2 px-4 py-2 tooltip"
      :data-tip="props.data.folderName || props.data.fileName"
    >
      <Iconify :icon="icons.icon" class="grow-0" :class="icons.class" height="1.5em" />
      <div class="grow text-left w-28 truncate">
        {{ props.data.folderName || props.data.fileName }}
      </div>
      <DetailDropTrash v-if="props.trash" :data="props.data" :isFile="props.preview" />
      <DetailDrop
        v-else
        :data="props.data"
        :isFile="props.preview"
        :disabled="selected && totalSelected > 1"
      />
    </div>
    <div
      v-if="props.preview"
      class="my-2 rounded-lg mx-2 flex justify-center items-center overflow-hidden aspect-square bg-white dark:bg-white/90 dark:text-base-300"
      @dblclick="openFile()"
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

    <PreviewComponent
      v-if="props.preview"
      :show="modalOpenPreview"
      :src="props.data.filePath"
      @close="modalOpenPreview = false"
      :type="props.data.fileType"
    />
  </div>
</template>

<script setup>
import DetailDrop from '~/components/DetailDrop.vue'
import { computed, onMounted, ref, watch } from 'vue'
import sysService from '~/services/sys.service.ts'
import PreviewComponent from '~/components/Preview.vue'
import { useStore } from 'vuex'
import DetailDropTrash from '~/components/DetailDropTrash.vue'
import uploadService from '~/services/upload.service.ts'
const props = defineProps({
  preview: {
    type: Boolean,
    default: false,
  },
  trash: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: {},
  },
  selected: {
    type: Boolean,
    default: false,
  },
  totalSelected: {
    type: Number,
    default: 0,
  },
})
const store = useStore()
const modalOpenPreview = ref(false)
const isLoadFile = computed(() => store.state.loadFile)
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

const openFile = async () => {
  if (props.preview) {
    await uploadService.opened(props.data.id.toString())
    modalOpenPreview.value = true
  }
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

watch(isLoadFile, async (newVal) => {
  if (newVal) {
    await changeIcon()
    setTimeout(async () => {
      await store.dispatch('setLoadFile', false)
    }, 1000)
  }
})
</script>

<style></style>

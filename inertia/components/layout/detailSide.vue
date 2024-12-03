<script setup>
import { usePage } from '@inertiajs/vue3'
import { ref, computed, watchEffect, watch } from 'vue'
import { Icon as Iconify } from '@iconify/vue'
import { useStore } from 'vuex'
import sysService from '~/services/sys.service.ts'

const props = defineProps({
  side: {
    type: Boolean,
  },
  toggleSide: {
    type: Function,
  },
})

const store = useStore()
const pages = usePage().props.auth
const dataDetail = computed(() => store.state.sideDetailData)
const isFolder = computed(() => store.state.sideDetailIsFolder)
const icons = ref({
  icon: 'solar:folder-bold-duotone',
  class: 'text-orange-400 dark:text-blue-600',
})

const emit = defineEmits(['toggleSide'])

const sideBarFun = () => {
  console.log('masuk')
  emit('toggleSide')
}

const isImageOrVideo = (data) => {
  if (isFolder.value) return true
  const imageAndVideoTypeFile = ['image', 'video']
  const check = imageAndVideoTypeFile.includes(data.fileType.toLowerCase())
  return !check
}

const changeIcon = async () => {
  if (!isFolder.value) {
    const icon = await sysService.fileTypeIcons()
    const color = await sysService.fileTypeColor()
    icons.value.icon = icon[dataDetail.value['fileExt'].toLowerCase()] || icon['default']
    icons.value.class = color[dataDetail.value['fileExt'].toLowerCase()] || color['default']
  }
}

watch(dataDetail, changeIcon, { deep: true })

const menu = ref([
  {
    title: 'Drive Saya',
    icon: 'solar:folder-with-files-broken',
    link: '/home',
  },
  {
    title: 'Dibagikan kepada saya',
    icon: 'solar:users-group-rounded-broken',
    link: '/shared',
  },
  {
    title: 'Terbaru',
    icon: 'solar:clock-circle-broken',
    link: '/latest',
  },
  {
    title: 'Berbintang',
    icon: 'solar:medal-ribbons-star-broken',
    link: '/starry',
  },
  {
    title: 'Sampah',
    icon: 'solar:trash-bin-trash-broken',
    link: '/trash',
  },
])
</script>
<template>
  <div
    v-if="side"
    class="absolute py-4 z-30 right-0 sm:relative sm:right-0 sm:z-0 min-w-[30rem] h-full sm:min-w-[20rem]"
  >
    <div class="absolute sm:hidden bg-base-300/70 w-screen h-screen"></div>
    <div
      class="absolute right-0 rounded-l-xl sm:h-[calc(100vh-5.5rem)] shadow dark:shadow-success/20 flex flex-col overflow-auto sm:relative bg-base-100 border border-base-200 w-2/3 sm:w-full"
    >
      <div
        class="flex justify-between items-center text-sm gap-2 px-4 py-2 tooltip border-b border-base-300/50"
      >
        <div class="cursor-pointer">
          <Iconify :icon="icons.icon" :class="icons.class" height="2em" />
        </div>
        <div class="text-sm text-left font-bold antialiased font-sans truncate group">
          {{ isFolder ? dataDetail['folderName'] : dataDetail['fileName'] }}
          <span
            class="group-hover:visible z-10 whitespace-normal invisible text-center group-hover:opacity-100 bg-base-100 p-2 rounded-md shadow mx-3 top-[2rem] left-0 right-0 text-xs absolute text-gray-500"
            >{{ isFolder ? dataDetail['folderName'] : dataDetail['fileName'] }}</span
          >
        </div>
        <div class="cursor-pointer" @click="sideBarFun">
          <Iconify icon="solar:close-circle-linear" height="2em" />
        </div>
      </div>

      <div class="w-full h-44 p-2 rounded-lg">
        <slot name="imageContent">
          <div
            v-if="isImageOrVideo(dataDetail)"
            class="bg-base-300 w-full h-full rounded-lg overflow-hidden flex justify-center items-center"
          >
            <Iconify
              :icon="icons.icon"
              class="grow-0 drop-shadow-lg rounded-lg"
              :class="icons.class"
              height="4.5em"
            />
          </div>
          <img
            v-else
            :src="dataDetail['filePath']"
            class="grow-0 drop-shadow-lg w-full h-full object-top object-cover rounded-lg"
            :alt="dataDetail['fileName']"
          />
        </slot>
      </div>

      <div class="p-2 overflow-auto">
        <label class="font-bold px-2">Yang Memiliki akses</label>
        <div class="px-2">
          <div class="flex flex-col gap-2 py-2">
            <div class="flex items-center gap-2">
              <div class="avatar">
                <div
                  class="p-1 w-8 h-8 font-bold rounded-full bg-primary z-0 overflow-hidden text-white text-center"
                >
                  {{ dataDetail['createdByUser']['fullName'].charAt(0) }}
                </div>
              </div>
              <div class="font-bold text-sm">{{ dataDetail['createdByUser']['fullName'] }}</div>
            </div>
            <div v-if="dataDetail['createdBy'] === pages.id" class="font-bold text-sm">
              <button class="btn btn-sm btn-outline btn-info">
                <Iconify icon="solar:share-bold-duotone" height="1.5em" class="mr-2"></Iconify>
                Kelola Akses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

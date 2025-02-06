<script setup>
import { usePage } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import { Icon as Iconify } from '@iconify/vue'
import { useStore } from 'vuex'
import sysService from '~/services/sys.service.ts'
import folderService from '~/services/folder.service.ts'
import uploadService from '~/services/upload.service.ts'
import svgSearchDetail from '~/assets/search_detail.svg'
import svgSelected from '~/assets/selected.svg'
import { encrypt } from '~/services/crypto.service.ts'

const props = defineProps({
  side: {
    type: Boolean,
    default: false,
  },
  toggleSide: {
    type: Function,
  },
})

const store = useStore()
const side = computed(() => props.side)
const pages = usePage().props.auth
const dataDetail = ref({})
const isRender = ref(true)
const isImage = ref(false)
const checkID = ref(false)
const getID = ref(null)
const compSideDetailToggle = computed(() => store.state.sideDetail)
const fileIDState = computed(() => store.state.sideDetailFileID)
const folderIDState = computed(() => store.state.sideDetailFolderID)
const isFolder = computed(() => store.state.sideDetailIsFolder)
const folderNameDefault = computed(() => store.state.sideDetailSubFolder)
const selectedLength = computed(() => store.state.sideDetailSelectedLength)
const icons = ref({
  icon: 'solar:folder-bold-duotone',
  class: 'text-orange-400 dark:text-blue-600',
})

const emit = defineEmits(['toggleSide'])

const sideBarFun = () => {
  emit('toggleSide')
}

const loadData = async () => {
  isRender.value = true
  checkID.value = false
  if (fileIDState.value !== null || folderIDState.value !== null) {
    checkID.value = true
    getID.value = isFolder.value ? folderIDState.value : fileIDState.value
    let encrypts = encrypt(getID.value.toString())
    if (isFolder.value) {
      let result = await folderService.getById(encrypts)
      dataDetail.value = result.data
    } else {
      let result = await uploadService.getById(encrypts)
      dataDetail.value = result.data
    }
    setTimeout(async () => {
      await changeIcon()
      isImage.value = await isImageOrVideo(dataDetail.value)
      isRender.value = false
    }, 200)
  } else {
    await changeIcon()
    isRender.value = false
  }
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
  } else {
    icons.value.icon = 'solar:folder-bold-duotone'
    icons.value.class = 'text-orange-400 dark:text-blue-600'
  }
}

const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

const formatDate = (timestamp) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const date = new Date(timestamp)
  return date.toLocaleDateString('id-ID', options)
}

const ownerOrNot = (item, name) => {
  return pages.id === item ? 'Saya' : name
}

watch(
  () => {
    if (compSideDetailToggle.value) {
      loadData()
    }
  },
  { deep: true }
)
</script>
<template>
  <div
    v-if="side"
    class="absolute py-4 z-30 right-0 sm:relative sm:right-0 sm:z-0 min-w-[30rem] h-full sm:min-w-[20rem]"
  >
    <div
      v-if="isRender"
      class="absolute right-0 rounded-l-xl sm:h-[calc(100vh-5.5rem)] shadow dark:shadow-success/20 flex flex-col overflow-auto sm:relative bg-base-100 border border-base-200 w-2/3 sm:w-full"
    >
      <div
        class="flex justify-between items-center text-sm gap-2 px-4 py-2 tooltip border-b border-base-300/50"
      >
        <div>
          <div class="skeleton h-[2em] w-[2em] shrink-0 rounded-lg" />
        </div>
        <div class="skeleton h-[1.5em] w-full shrink rounded-md" />
        <div class="skeleton h-[2em] w-[2em] shrink-0 rounded-full" />
      </div>

      <div class="w-full h-44 p-2 rounded-lg">
        <div
          class="skeleton w-full h-full rounded-lg overflow-hidden flex justify-center items-center"
        />
      </div>

      <div class="p-2 overflow-auto">
        <div class="font-bold mx-2 skeleton h-[1.5em] w-48 shrink-0 rounded" />
        <div class="px-2">
          <div class="flex flex-col gap-2 py-2">
            <div class="flex items-center gap-2">
              <div class="skeleton h-[2em] w-[2em] shrink-0 rounded-full" />
              <div class="font-bold px-2 skeleton h-[1.5em] w-36 shrink-0 rounded" />
            </div>
            <div class="font-bold text-sm mt-3">
              <div class="btn btn-sm skeleton w-28" />
            </div>
          </div>
        </div>
      </div>

      <div class="divider" />

      <div class="p-2 overflow-auto">
        <div class="font-bold mx-2 skeleton h-[1.5em] w-28 shrink-0 rounded" />
        <div class="px-2">
          <div class="flex flex-col gap-4 py-2">
            <div v-for="i in 6" :key="i" class="flex flex-col">
              <div class="skeleton h-[1em] w-20 shrink-0 rounded" />
              <div class="my-2 skeleton h-[1em] w-48 shrink-0 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!checkID || selectedLength > 1"
      class="absolute right-0 rounded-l-xl sm:h-[calc(100vh-5.5rem)] shadow dark:shadow-success/20 flex flex-col overflow-auto sm:relative bg-base-100 border border-base-200 w-2/3 sm:w-full"
    >
      <div
        class="flex justify-between items-center text-sm gap-2 px-4 py-2 tooltip border-b border-base-300/50"
      >
        <div>
          <Iconify :icon="icons.icon" :class="icons.class" height="2em" />
        </div>
        <div class="text-sm text-left font-bold antialiased font-sans truncate group">
          {{ selectedLength > 1 ? selectedLength + ' item dipilih' : folderNameDefault }}
          <span
            class="group-hover:visible z-10 whitespace-normal invisible text-center group-hover:opacity-100 bg-base-100 p-2 rounded-md shadow mx-3 top-[2rem] left-0 right-0 text-xs absolute text-gray-500"
            >{{ selectedLength > 1 ? selectedLength + ' item dipilih' : folderNameDefault }}</span
          >
        </div>
        <div class="cursor-pointer group" @click="sideBarFun">
          <Iconify icon="solar:close-circle-linear" height="2em" class="group-hover:text-error" />
        </div>
      </div>

      <div class="w-full h-44 p-2 rounded-lg">
        <slot name="imageContent">
          <img
            :src="selectedLength > 1 ? svgSelected : svgSearchDetail"
            class="grow-0 drop-shadow-lg w-full h-full object-contain rounded-lg"
            alt="Detail File"
          />
          <p v-if="selectedLength < 1" class="text-center text-sm mt-2">
            Pilih item untuk melihat detailnya
          </p>
        </slot>
      </div>
    </div>

    <div
      v-else
      class="absolute right-0 rounded-l-xl sm:h-[calc(100vh-5.5rem)] shadow dark:shadow-success/20 flex flex-col overflow-auto sm:relative bg-base-100 border border-base-200 w-2/3 sm:w-full"
    >
      <div
        class="flex justify-between items-center text-sm gap-2 px-4 py-2 tooltip border-b border-base-300/50"
      >
        <div>
          <Iconify :icon="icons.icon" :class="icons.class" height="2em" />
        </div>
        <div class="text-sm text-left font-bold antialiased font-sans truncate group">
          {{ isFolder ? dataDetail['folderName'] : dataDetail['fileName'] }}
          <span
            class="group-hover:visible z-10 whitespace-normal invisible text-center group-hover:opacity-100 bg-base-100 p-2 rounded-md shadow mx-3 top-[2rem] left-0 right-0 text-xs absolute text-gray-500"
            >{{ isFolder ? dataDetail['folderName'] : dataDetail['fileName'] }}</span
          >
        </div>
        <div class="cursor-pointer group" @click="sideBarFun">
          <Iconify icon="solar:close-circle-linear" height="2em" class="group-hover:text-error" />
        </div>
      </div>

      <div class="w-full h-44 p-2 rounded-lg">
        <slot name="imageContent">
          <div
            v-if="isImage"
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
            <div v-if="dataDetail['createdBy'] === pages.id" class="font-bold text-sm mt-3">
              <button class="btn btn-sm btn-outline btn-info">
                <Iconify icon="solar:settings-bold-duotone" height="1.5em"></Iconify>
                Kelola Akses
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="divider" />

      <div class="p-2 overflow-auto">
        <label class="font-bold px-2">Detail {{ isFolder ? 'Folder' : 'File' }}</label>
        <div class="px-2">
          <div class="flex flex-col gap-4 py-2">
            <div class="flex flex-col">
              <div class="text-xs font-semibold">Jenis</div>
              <div class="text-xs uppercase">
                {{ !isFolder ? dataDetail['fileExt'] : 'folder' }}
              </div>
            </div>

            <div v-if="!isFolder" class="flex flex-col">
              <div class="text-xs font-semibold">Ukuran</div>
              <div class="text-sm">{{ formatFileSize(dataDetail['fileSize'] ?? 0) }}</div>
            </div>

            <div class="flex flex-col">
              <div class="text-xs font-semibold">Pemilik</div>
              <div class="text-sm">
                {{ ownerOrNot(dataDetail['createdBy'], dataDetail['createdByUser']['fullName']) }}
              </div>
            </div>

            <div class="flex flex-col">
              <div class="text-xs font-semibold">Dimodifikasi</div>
              <div class="text-sm">
                {{ formatDate(dataDetail['updatedAt']) }} oleh
                {{
                  ownerOrNot(
                    dataDetail['updatedByUser']['id'],
                    dataDetail['updatedByUser']['fullName']
                  )
                }}
              </div>
            </div>

            <div class="flex flex-col">
              <div class="text-xs font-semibold">Dibuka</div>
              <div class="text-sm">
                {{ dataDetail['openedAt'] === null ? '-' : formatDate(dataDetail['openedAt']) }}
                oleh
                {{
                  dataDetail['openedAt'] === null
                    ? '-'
                    : ownerOrNot(dataDetail['openedBy'], dataDetail['openedByUser']['fullName'])
                }}
              </div>
            </div>

            <div class="flex flex-col">
              <div class="text-xs font-semibold">Dibuat</div>
              <div class="text-sm">
                {{ formatDate(dataDetail['createdAt']) }} oleh
                {{
                  ownerOrNot(
                    dataDetail['createdByUser']['id'],
                    dataDetail['createdByUser']['fullName']
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

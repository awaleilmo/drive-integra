<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import fileManagerSvg from '~/assets/file_manager.svg'
import FileComponent from '~/components/FileComponent.vue'
import FloatMenu from '~/components/FloatMenu.vue'
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import InfoEmpty from '~/components/InfoEmpty.vue'
import { encrypt } from '~/services/crypto.service.ts'
import { useStore } from 'vuex'
import uploadService from '~/services/upload.service'
import folderService from '~/services/folder.service'
import side_detailStore from '~/store/side_detail.store.ts'
import MenuAdd from '~/components/MenuAdd.vue'

const props = defineProps({
  breadcrumbs: Object,
})

const store = useStore()
const files = computed(() => store.state.fileMultiple)
const isDragging = ref(false)
const isLoadFile = computed(() => store.state.loadFile)
const isFileData = ref([])
const isFolderData = ref([])
const selected = ref([])
const sideDetailStore = new side_detailStore(store)
const contextMenuVisible = ref(false)
const contextMenuStyle = ref({ top: '0px', left: '0px' })

const showContextMenu = (event) => {
  event.preventDefault()
  event.preventDefault()

  const mouseX = event.clientX
  const mouseY = event.clientY
  const parentElement = event.currentTarget
  const parentRect = parentElement.getBoundingClientRect()

  const menu = document.getElementById('context-menu')
  const menuRect = menu.getBoundingClientRect()

  let x = mouseX - parentRect.left
  let y = mouseY - parentRect.top

  // Menyesuaikan posisi menu agar tidak keluar dari elemen induk
  // Posisi X: pastikan menu tidak melampaui batas kanan
  if (x + menuRect.width > parentRect.width) {
    x = parentRect.width - menuRect.width - 10
  }

  // Posisi Y: pastikan menu tidak melampaui batas bawah
  if (y + menuRect.height > parentRect.height) {
    y = parentRect.height - menuRect.height - 10
  }

  contextMenuStyle.value = {
    top: `${y}px`,
    left: `${x}px`,
  }
  contextMenuVisible.value = true
}

const folderAction = async (item) => {
  await folderService.opened(item.id.toString())
  let encrypts = encrypt(item.id.toString())
  window.location.href = '/home?folders=' + encrypts
}

const getFolderId = () => {
  let queryString = window.location.search
  if (queryString) {
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('folders')
  }
  return null
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event) => {
  if (!store.state.onUpload) {
    isDragging.value = false
    const droppedFiles = Array.from(event.dataTransfer.files)
    files.value.push(...droppedFiles)
  }
}

const getFile = async () => {
  try {
    let result = await uploadService.getFile(getFolderId())
    return result.data
  } catch (error) {
    return []
  }
}

const getFolder = async () => {
  try {
    let result = await folderService.getFolder(getFolderId())
    return result.data
  } catch (error) {
    return []
  }
}

const selectedFn = (item, isFolder, shiftKey) => {
  sideDetailStore.actionUpdateDataAndFolder(item.id, isFolder)

  if (shiftKey) {
    // Jika shiftKey ditekan, kita periksa apakah item sudah ada di dalam array 'selected'
    const itemIndex = selected.value.findIndex(
      (data) => data.id === item.id && data['isFolder'] === isFolder
    )
    if (itemIndex === -1) {
      // Jika item belum ada, tambahkan ke array selected
      selected.value.push({ id: item.id, isFolder })
    } else {
      // Jika item sudah ada, hapus item tersebut dari array selected
      selected.value.splice(itemIndex, 1)
    }
  } else {
    // Cek apakah item sudah terpilih
    const itemIndex = selected.value.findIndex(
      (data) => data.id === item.id && data['isFolder'] === isFolder
    )
    if (itemIndex === -1) {
      // Jika item belum terpilih, seleksi hanya item ini
      selected.value = [{ id: item.id, isFolder }]
    }
    // Jika item sudah terpilih, jangan ubah seleksi apapun
  }
}

const checkSelected = (item, isFolder) => {
  return selected.value.find((data) => data.id === item.id && data['isFolder'] === isFolder)
}

watch(isLoadFile, async (newVal) => {
  if (newVal) {
    await getFile().then((data) => {
      isFileData.value = data
    })

    await getFolder().then((data) => {
      isFolderData.value = data
    })
    setTimeout(async () => {
      await store.dispatch('setLoadFile', false)
    }, 1000)
  }
})

const hideContextMenu = () => {
  contextMenuVisible.value = false
}
const clearSelected = () => {
  const menuElement = document.getElementById('context-menu')
  const menuSelected = document.getElementById('menu-selected')
  const fileComponents = document.querySelectorAll('.file-component')

  const clickedInsideMenu = menuElement && menuElement.contains(event.target)
  const clickedInsideMenuSelected = menuSelected && menuSelected.contains(event.target)
  const clickedInsideFileComponent = Array.from(fileComponents).some((el) =>
    el.contains(event.target)
  )

  if (!clickedInsideMenu && !clickedInsideFileComponent && !clickedInsideMenuSelected) {
    selected.value = []
  }
}

onMounted(async () => {
  await store.dispatch('setLoadFile', true)
  document.addEventListener('click', hideContextMenu)
  document.addEventListener('mousedown', clearSelected)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', hideContextMenu)
  document.removeEventListener('mousedown', clearSelected)
})
</script>

<template>
  <Layout>
    <PanelDrive :breadcrumbs="props.breadcrumbs" defaultHomeUrl="/home">
      <template #header>
        <h1>Drive Saya</h1>
      </template>
      <template #main>
        <div
          class="w-full relative h-full overflow-y-auto overflow-x-hidden"
          @dragover.prevent="onDragOver"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop"
          @contextmenu="showContextMenu"
        >
          <div
            v-show="selected.length > 0"
            id="menu-selected"
            class="flex items-center gap-4 justify-start mb-2 p-0 rounded-full border border-base-300/50 bg-base-200"
          >
            <iconify
              icon="solar:close-circle-bold-duotone"
              class="cursor-pointer btn btn-ghost btn-circle btn-sm hover:text-error"
              height="1.8em"
              @click="selected = []"
            />
            <span class="text-sm font-medium w-fit">{{ selected.length }} dipilih</span>
            <div class="gap-3 flex">
              <div class="tooltip tooltip-bottom" data-tip="Download">
                <button class="cursor-pointer btn btn-ghost btn-circle btn-sm hover:text-info">
                  <iconify icon="solar:download-square-bold-duotone" height="1.5em" />
                </button>
              </div>
              <div class="tooltip tooltip-bottom" data-tip="Pindahkan">
                <button class="cursor-pointer btn btn-ghost btn-circle btn-sm hover:text-info">
                  <iconify icon="solar:move-to-folder-bold-duotone" height="1.5em" />
                </button>
              </div>
              <div class="tooltip tooltip-bottom" data-tip="Pindahkan ke Sampah">
                <button class="cursor-pointer btn btn-ghost btn-circle btn-sm hover:text-info">
                  <iconify icon="solar:trash-bin-trash-bold-duotone" height="1.5em" />
                </button>
              </div>
            </div>
          </div>
          <label v-if="isFolderData.length > 0" class="text-base font-medium">Folder</label>
          <div
            class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 my-5"
          >
            <FileComponent
              class="file-component"
              v-for="(item, index) in isFolderData"
              :key="index"
              :data="item"
              @dblclick="folderAction(item)"
              :selected="checkSelected(item, true)"
              @click="selectedFn(item, true, $event.shiftKey)"
            />
          </div>

          <label v-if="isFileData.length > 0" class="text-base font-medium">File</label>
          <div
            class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-5"
          >
            <FileComponent
              class="file-component"
              v-for="(item, index) in isFileData"
              :key="index"
              :data="item"
              :preview="true"
              :selected="checkSelected(item, false)"
              @click="selectedFn(item, false, $event.shiftKey)"
            />
          </div>

          <info-empty
            :show="isFolderData.length === 0 && isFileData.length === 0"
            :src="fileManagerSvg"
            title="Tempat untuk semua file Anda"
            message="Tarik file Anda ke sini atau gunakan tombol '+' atau klik kanan untuk mengupload"
          />

          <div id="context-menu" class="z-50 absolute" :style="contextMenuStyle">
            <MenuAdd :active="contextMenuVisible" @close="contextMenuVisible = false" />
          </div>
        </div>
      </template>
    </PanelDrive>

    <FloatMenu />
  </Layout>
</template>

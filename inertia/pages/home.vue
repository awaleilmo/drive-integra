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
const selectionBox = ref({ x: 0, y: 0, width: 0, height: 0 })
const isDraggingSelection = ref(false)
const selectionStart = ref({ x: 0, y: 0 })
const isClickEvent = ref(false)

const startSelection = (event) => {
  if (event.button !== 0) return
  event.stopPropagation() // Mencegah konflik
  isDraggingSelection.value = true
  isClickEvent.value = true

  const mouseX = event.clientX
  const mouseY = event.clientY
  const parentElement = event.currentTarget
  const parentRect = parentElement.getBoundingClientRect()

  selectionStart.value = { x: mouseX - parentRect.left, y: mouseY - parentRect.top }
  selectionBox.value = {
    x: mouseX - parentRect.left,
    y: mouseY - parentRect.top,
    width: 0,
    height: 0,
  }
}

const updateSelection = (event) => {
  if (isDraggingSelection.value) {
    const mouseX = event.clientX
    const mouseY = event.clientY
    const parentElement = event.currentTarget
    const parentRect = parentElement.getBoundingClientRect()

    let currentX = mouseX - parentRect.left
    let currentY = mouseY - parentRect.top

    if (currentX > parentRect.width) {
      currentX = parentRect.width - 10
    }

    if (currentY > parentRect.height) {
      currentY = parentRect.height - 10
    }

    const distanceX = Math.abs(currentX - selectionStart.value.x)
    const distanceY = Math.abs(currentY - selectionStart.value.y)

    // Tentukan ambang batas untuk mendeteksi drag
    const dragThreshold = 5
    if (distanceX > dragThreshold || distanceY > dragThreshold) {
      isClickEvent.value = false // Hanya jika gerakan signifikan
    }

    selectionBox.value = {
      x: Math.min(selectionStart.value.x, currentX),
      y: Math.min(selectionStart.value.y, currentY),
      width: Math.abs(selectionStart.value.x - currentX),
      height: Math.abs(selectionStart.value.y - currentY),
    }
    if (!isClickEvent.value) {
      applySelection()
    }
  }
}

const endSelection = () => {
  if (isDraggingSelection.value) {
    if (isClickEvent.value) {
      clearSelected()
    }
    isDraggingSelection.value = false
  }
}

const applySelection = () => {
  if (selectionBox.value.width < 5 && selectionBox.value.height < 5) {
    return
  }

  const selectedElements = document.querySelectorAll('.file-component')
  selected.value = []

  selectedElements.forEach((element) => {
    const rect = element.getBoundingClientRect()
    const parentRect = event.currentTarget['getBoundingClientRect']()

    if (
      rect.left - parentRect.left < selectionBox.value.x + selectionBox.value.width &&
      rect.right - parentRect.left > selectionBox.value.x &&
      rect.top - parentRect.top < selectionBox.value.y + selectionBox.value.height &&
      rect.bottom - parentRect.top > selectionBox.value.y
    ) {
      const itemId = element.getAttribute('data-id')
      const isFolder = element.getAttribute('data-is-folder') === 'true'
      selected.value.push({ id: parseInt(itemId), isFolder })
    }
  })
}

const showContextMenu = (event) => {
  if (isDraggingSelection.value) return
  event.preventDefault()

  const mouseX = event.clientX
  const mouseY = event.clientY
  const parentElement = event.currentTarget
  const parentRect = parentElement.getBoundingClientRect()

  const menu = document.getElementById('context-menu')
  const menuRect = menu.getBoundingClientRect()

  let x = mouseX - parentRect.left
  let y = mouseY - parentRect.top

  if (x + menuRect.width > parentRect.width) {
    x = parentRect.width - menuRect.width - 10
  }

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
  if (isDraggingSelection.value) return
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
    const itemIndex = selected.value.findIndex(
      (data) => data.id === item.id && data['isFolder'] === isFolder
    )
    if (itemIndex === -1) {
      selected.value.push({ id: item.id, isFolder })
    } else {
      selected.value.splice(itemIndex, 1)
    }
  } else {
    const itemIndex = selected.value.findIndex(
      (data) => data.id === item.id && data['isFolder'] === isFolder
    )
    if (itemIndex === -1) {
      selected.value = [{ id: item.id, isFolder }]
    }
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
})

onBeforeUnmount(() => {
  document.removeEventListener('click', hideContextMenu)
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
          id="canvas-container"
          class="w-full relative h-full overflow-y-auto overflow-x-hidden"
          @mousedown="startSelection"
          @mousemove="updateSelection"
          @mouseup="endSelection"
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

          <div
            v-if="isDraggingSelection"
            class="absolute bg-blue-300 bg-opacity-50 border border-blue-500"
            :style="{
              left: `${selectionBox.x}px`,
              top: `${selectionBox.y}px`,
              width: `${selectionBox.width}px`,
              height: `${selectionBox.height}px`,
            }"
          ></div>

          <label v-if="isFolderData.length > 0" class="text-base font-medium">Folder</label>
          <div
            class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 my-5"
          >
            <FileComponent
              class="file-component"
              v-for="(item, index) in isFolderData"
              :key="index"
              :data="item"
              :data-id="item.id"
              :data-is-folder="true"
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
              :data-id="item.id"
              :data-is-folder="false"
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

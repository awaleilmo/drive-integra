<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import fileManagerSvg from '~/assets/file_manager.svg'
import FileComponent from '~/components/FileComponent.vue'
import FloatMenu from '~/components/FloatMenu.vue'
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import InfoEmpty from '~/components/InfoEmpty.vue'
import { encrypt } from '~/services/crypto.service.ts'
import { useStore } from 'vuex'
import uploadService from '~/services/upload.service'
import folderService from "~/services/folder.service";

const props = defineProps({
  breadcrumbs: Object,
})

const store = useStore()
const files = computed(() => store.state.fileMultiple)
const isDragging = ref(false)
const isLoadFile = computed(() => store.state.loadFile)
const isFileData = ref([])
const isFolderData = ref([])

const folderAction = async (item) => {
  console.log('masuk')
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

onMounted(async () => {
  await store.dispatch('setLoadFile', true)
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
        >
          <label v-if="isFolderData.length > 0" class="text-base font-medium">Folder</label>
          <div
            class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 my-5"
          >
            <FileComponent
              v-for="(item, index) in isFolderData"
              :key="index"
              :data="item"
              @dblclick="folderAction(item)"
            />
          </div>

          <label v-if="isFileData.length > 0" class="text-base font-medium">File</label>
          <div
            class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-5"
          >
            <FileComponent
              v-for="(item, index) in isFileData"
              :key="index"
              :data="item"
              :preview="true"
            />
          </div>

          <info-empty
            :show="isFolderData.length === 0 && isFileData.length === 0"
            :src="fileManagerSvg"
            title="Tempat untuk semua file Anda"
            message="Tarik file Anda ke sini atau gunakan tombol '+' untuk mengupload"
          />
        </div>
      </template>
    </PanelDrive>

    <FloatMenu />
  </Layout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import myFilesSvg from '~/assets/my_files.svg'
import InfoEmpty from '~/components/InfoEmpty.vue'
import FileComponent from '~/components/FileComponent.vue'
import FloatMenu from '~/components/FloatMenu.vue'
import { useStore } from 'vuex'
import uploadService from '~/services/upload.service'


const store = useStore()
const files = computed(() => store.state.fileMultiple)
const isDragging = ref(false)
const isLoadFile = computed(() => store.state.loadFile)
const isFileData = ref([])

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
    let result = await uploadService.getFile(getFolderId(), false, true)
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
    <PanelDrive>
      <template #header>
        <h1>Terbaru</h1>
      </template>
      <template #main>
        <div
          class="w-full relative h-full overflow-y-auto overflow-x-hidden"
          @dragover.prevent="onDragOver"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop"
        >
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
            :show="isFileData.length === 0"
            :src="myFilesSvg"
            title="Tidak ada file terbaru"
            message="Lihat semua file yang baru saja Anda edit dan buka"
          />
        </div>
      </template>
    </PanelDrive>

    <FloatMenu />
  </Layout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import throwAwaySvg from '~/assets/throw_away.svg'
import InfoEmpty from '~/components/InfoEmpty.vue'
import FileComponent from '~/components/FileComponent.vue'
import { useStore } from 'vuex'
import uploadService from '~/services/upload.service'
import folderService from "~/services/folder.service";


const store = useStore()
const files = computed(() => store.state.fileMultiple)
const isLoadFile = computed(() => store.state.loadFile)
const isFileData = ref([])
const isFolderData = ref([])

const getFolderId = () => {
  let queryString = window.location.search
  if (queryString) {
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('folders')
  }
  return null
}

const getFile = async () => {
  try {
    let result = await uploadService.getFile(getFolderId(), true)
    return result.data
  } catch (error) {
    return []
  }
}

const getFolder = async () => {
  try {
    let result = await folderService.getFolder(getFolderId(), true)
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
    <PanelDrive>
      <template #header>
        <h1>Sampah</h1>
      </template>
      <template #main>
        <div class="w-full relative h-full overflow-y-auto overflow-x-hidden">
          <div role="alert" class="alert alert-info mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="h-6 w-6 shrink-0 stroke-current">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Item dalam sampah akan dihapus selamanya setelah 30 hari</span>
          </div>
          <label v-if="isFolderData.length > 0" class="text-base font-medium">Folder</label>
          <div
            class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 my-5"
          >
            <FileComponent
              v-for="(item, index) in isFolderData"
              :key="index"
              :data="item"
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
            :src="throwAwaySvg"
            title="Sampah Kosong"
            message="Pindahkan item yg tidak Anda Butuhkan ke sampah. item dalam sampah akan dihapus selamanya setelah 30 hari"
          />
        </div>
      </template>
    </PanelDrive>
  </Layout>
</template>

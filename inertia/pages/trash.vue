<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import throwAwaySvg from '~/assets/throw_away.svg'
import InfoEmpty from '~/components/InfoEmpty.vue'
import FileComponent from '~/components/FileComponent.vue'
import { useStore } from 'vuex'
import uploadService from '~/services/upload.service'
import folderService from '~/services/folder.service'
import { Icon as Iconify } from '@iconify/vue'

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
            <iconify icon="solar:danger-circle-bold-duotone" height="1.8em" />
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
              :trash="true"
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
              :trash="true"
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

<script setup>
import { computed, onMounted, ref } from "vue";
import fileManagerSvg from '~/assets/file_manager.svg'
import FileComponent from '~/components/FileComponent.vue'
import FloatMenu from '~/components/FloatMenu.vue'
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import InfoEmpty from '~/components/InfoEmpty.vue'
import { encrypt, decrypt } from '~/services/crypto.service.ts'
import { useStore } from "vuex";

const props = defineProps({
  folder: Object,
  file: Object,
  breadcrumbs: Object,
})

const store = useStore()
const files = computed(() => store.state.fileMultiple)
const isDragging = ref(false)
const fileInput = ref(null)

const folderAction = async (item) => {
  let encrypts = encrypt(item.id.toString())
  window.location.href = '/home?folders=' + encrypts
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event) => {
  isDragging.value = false
  const droppedFiles = Array.from(event.dataTransfer.files)
  files.value.push(...droppedFiles)
  // store.dispatch('setFileMultiple', ...droppedFiles)
}

const onFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files)
  files.value.push(...selectedFiles)
}

const triggerFileInput = () => {
  fileInput.value['click']()
}

const uploadFiles = () => {
  // Upload logic goes here
  console.log('Files to upload:', files.value)
}

onMounted(async () => {})
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
          <label v-if="props.folder.length > 0" class="text-base font-medium">Folder</label>
          <div
            class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 my-5"
          >
            <FileComponent
              v-for="(item, index) in props.folder"
              :key="index"
              :data="item"
              @dblclick="folderAction(item)"
            />
          </div>

          <label v-if="props.file.length > 0" class="text-base font-medium">File</label>
          <div
            class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-5"
          >
            <FileComponent
              v-for="(item, index) in props.file"
              :key="index"
              :data="item"
              :preview="true"
            />
          </div>

          <info-empty
            :show="props.folder.length === 0 && props.file.length === 0"
            :src="fileManagerSvg"
            title="Tempat untuk semua file Anda"
            message="Tarik file Anda ke sini atau gunakan tombol '+' untuk mengupload"
          />

          <div v-if="files.length" class="mt-4">
            <h2 class="text-lg font-semibold">Selected Files:</h2>
            <ul class="list-disc ml-4 mt-2">
              <li v-for="(file, index) in files" :key="index">{{ file.name }}</li>
            </ul>
            <button class="btn btn-success mt-4" @click="uploadFiles">Upload Files</button>
          </div>
        </div>
      </template>
    </PanelDrive>

    <FloatMenu />
  </Layout>
</template>

<script setup>
import Modal from '~/components/Modal.vue'
import { computed, ref, watch } from 'vue'
import folderService from '~/services/folder.service.ts'
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  dataProp: {
    type: Object,
    default: {
      data: [],
      folderId: null,
    },
  },
  titleName: {
    type: String,
    default: 'Folder',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const inputFolderName = ref(null)
const folderModal = ref({
  open: false,
  name: 'Folder tanpa nama',
  path: '/',
})
const isFolderData = ref([])
const show = computed(() => props.show)
const isLoading = ref(false)
const getFolderId = ref(null)
const model = ref({
  id: [],
  targetId: null,
  currentFolderId: null,
})

const folderSave = () => {
  emit('close', folderModal.value)
}

const closeFolderModal = () => {
  folderModal.value.name = 'Folder tanpa nama'
  folderModal.value.path = '/'
  folderModal.value.open = false

  emit('close')
}

const closeModal = () => {
  emit('close')
}

const getFolder = async () => {
  try {
    let result = await folderService.getFolder(getFolderId.value)
    return result.data
  } catch (error) {
    return []
  }
}

watch(isLoading, async (newVal) => {
  if (newVal) {
    await getFolder().then((data) => {
      isFolderData.value = data
    })
    setTimeout(async () => {
      isLoading.value = false
    }, 1000)
  }
})

watch(show, () => {
  if (show.value) {
    model.value.id = props.dataProp['data']
    model.value.currentFolderId = props.dataProp['folderId']
    isLoading.value = true
  }
})
</script>

<template>
  <modal :show="props.show" @close="closeModal" maxWidth="lg">
    <div class="py-6 px-6 flex flex-col items-start justify-start">
      <label class="text-xl text-start font-medium"
        >Pindahkan
        {{
          dataProp['data'].length > 1 ? dataProp['data'].length + 'item' : `"${titleName}"`
        }}</label
      >
      <div class="py-6">
        Lokasi Saat ini:
        <div class="btn btn-sm btn-outline">folder</div>
      </div>
      <div class="mt-3 flex justify-end gap-4">
        <div @click="closeFolderModal" class="btn btn-sm btn-ghost text-red-400">Batal</div>
        <div @click="folderSave" class="btn btn-sm btn-ghost text-blue-400">Buat</div>
      </div>
    </div>
  </modal>
</template>

<style scoped></style>

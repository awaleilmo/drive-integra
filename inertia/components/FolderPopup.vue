<script setup>
import Modal from '~/components/Modal.vue'
import { computed, ref, watch } from 'vue'
import folderService from '~/services/folder.service.ts'
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: {},
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
  id: null,
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
    console.log(model.value, 'ini model')
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
    model.value.id = props.data.id
    model.value.currentFolderId = props.data.parentId || props.data.folderId
    isLoading.value = true
  }
})
</script>

<template>
  <modal :show="props.show" @close="closeModal" maxWidth="lg">
    <div class="py-6 px-6 form-control">
      <label class="text-2xl font-medium">Folder Baru</label>
      <input
        @keyup.enter="folderSave"
        ref="inputFolderName"
        type="text"
        placeholder="Nama Folder"
        v-model="folderModal.name"
        class="input input-bordered w-full mt-5"
      />
      <div class="mt-3 flex justify-end gap-4">
        <div @click="closeFolderModal" class="btn btn-sm btn-ghost text-red-400">Batal</div>
        <div @click="folderSave" class="btn btn-sm btn-ghost text-blue-400">Buat</div>
      </div>
    </div>
  </modal>
</template>

<style scoped></style>

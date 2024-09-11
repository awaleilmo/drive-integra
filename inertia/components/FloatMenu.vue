<script setup>
import { onMounted, ref } from "vue";
import { useStore } from 'vuex'
import FolderService from '~/services/folder.service.ts'
import UploadService from '~/services/upload.service.ts'
import Modal from '~/components/Modal.vue'
import Alert from '~/components/Alert.vue'
import { decrypt } from '~/services/crypto.service'

// data
const active = ref(false)
const store = useStore()
const folderModal = ref({
  open: false,
  name: '',
  path: '/',
})
const fileData = ref({
  id: null,
  folderId: null,
  file: null,
  description: '',
})
const pathName = ref('')
const alert = ref({
  message: '',
  type: 'default',
  show: false,
})
const resetModel = () => {
  folderModal.value.name = ''
  folderModal.value.path = '/'
  folderModal.value.open = false
  alert.value.message = ''
  alert.value.type = 'default'
  alert.value.show = false
}
const close = () => {
  active.value = false
}

const closeFolderModal = () => {
  resetModel()
}

const folderFn = () => {
  folderModal.value.open = true
}

const folderSave = async () => {
  await store.dispatch('showLoading')

  try {
    FolderService.folderName = folderModal.value.name
    let data = await FolderService.addFolder()
    if (data.status) {
      alert.value = {
        message: data.message,
        type: 'success',
        show: true,
      }
      closeFolderModal()
      window.location.reload()
    } else {
      alert.value = {
        message: data.message,
        type: 'error',
        show: true,
      }
    }
    await store.dispatch('hideLoading')
  } catch (error) {
    console.error('test', error)
  }
}

const fileSaveFn = async () => {
  await store.dispatch('showLoading')
  try {
    const formData = new FormData()
    formData.append('id', fileData.value.id)
    formData.append('file', fileData.value.file)
    formData.append('folderId', fileData.value.folderId)
    formData.append('description', fileData.value.description)
    let data = await UploadService.Uploads(formData)
    if (data.status) {
      alert.value = {
        message: data.message,
        type: 'success',
        show: true,
      }
      window.location.reload()
    } else {
      alert.value = {
        message: data.message,
        type: 'error',
        show: true,
      }
      fileData.value.file = null
    }
    await store.dispatch('hideLoading')
  } catch (error) {
    console.error('test', error)
  }
}

const fileChange = (e) => {
  fileData.value.file = e.target.files[0]
  fileSaveFn()
}

const fileBrowse = () => {
  const input = document.getElementById('fileButton')
  input['click']()
}

onMounted(() => {
  let queryString = window.location.search
  if (queryString) {
    const urlParams = new URLSearchParams(queryString)
    const param = urlParams.get('folders')
    pathName.value = param
    const decryptParam = decrypt(param).split(':')
    FolderService.parentId = decryptParam[1]
    fileData.value.folderId = param
  }
})
</script>

<template>
  <div
    class="fixed flex flex-col bottom-4 z-10 right-2 md:bottom-10 md:right-10 transition-all group"
  >
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="active" class="fixed inset-0 transform transition-all" @click="close">
        <div class="absolute inset-0" />
      </div>
    </transition>
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div
        v-show="active"
        class="rounded-lg overflow-hidden transform transition-all sm:w-full sm:mx-auto"
      >
        <div
          v-if="active"
          class="menu bg-base-100 border border-base-300 py-4 my-2 dark:border-white/50 shadow-lg rounded-lg"
        >
          <ul>
            <li @click="folderFn">
              <a>
                <iconify
                  icon="solar:add-folder-bold-duotone"
                  class="text-orange-600 dark:text-blue-600"
                  height="1.8em"
                />
                <span class="text-sm font-medium">Folder baru</span>
              </a>
            </li>
            <hr class="my-2" />
            <li>
              <a @click="fileBrowse">
                <input type="file" class="hidden" id="fileButton" @change="fileChange" />
                <iconify
                  icon="solar:file-send-bold-duotone"
                  class="text-orange-500 dark:text-blue-600"
                  height="1.8em"
                />
                <span class="text-sm font-medium">Upload File</span>
              </a>
            </li>
            <li>
              <a>
                <iconify
                  icon="solar:move-to-folder-bold-duotone"
                  class="text-orange-500 dark:text-blue-600"
                  height="1.8em"
                />
                <span class="text-sm font-medium">Upload Folder</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <div
      class="btn btn-success btn-circle btn-lg ml-auto transform shadow-lg"
      @click="active = !active"
    >
      <iconify height="3em" class="text-base-100" icon="solar:add-circle-broken" />
    </div>
  </div>

  <Modal :show="folderModal.open" @close="closeFolderModal" maxWidth="sm">
    <div class="py-6 px-6 form-control">
      <alert :alerts="alert" @click="alert.show = false" />
      <label class="text-2xl font-medium">Folder Baru</label>
      <input
        @keyup.enter="folderSave"
        id="inputFolderName"
        type="text"
        placeholder="Nama Folder"
        v-model="folderModal.name"
        autofocus
        class="input input-bordered w-full mt-5"
      />
      <div class="mt-3 flex justify-end gap-4">
        <div @click="closeFolderModal" class="btn btn-sm btn-ghost text-red-400">Batal</div>
        <div @click="folderSave" class="btn btn-sm btn-ghost text-blue-400">Buat</div>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>

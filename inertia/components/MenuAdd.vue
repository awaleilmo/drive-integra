<script setup>
import Modal from '~/components/Modal.vue'
import FolderService from '~/services/folder.service.ts'
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'
import { decrypt } from '~/services/crypto.service.ts'
import { useStore } from 'vuex'

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  closeable: {
    type: Boolean,
    default: true,
  },
})

const folderModal = ref({
  open: false,
  name: 'Folder tanpa nama',
  path: '/',
})

const fileMultiple = computed(() => store.state.fileMultiple)
const fileData = ref({
  id: null,
  folderId: null,
  file: null,
  description: '',
})

const emit = defineEmits(['close'])

const close = () => {
  if (props.closeable) {
    emit('close')
  }
}

const store = useStore()

const inputFolderName = ref(null)
const pathName = ref('')

const resetModel = () => {
  folderModal.value.name = 'Folder tanpa nama'
  folderModal.value.path = '/'
  folderModal.value.open = false

  fileData.value.id = null
  fileData.value.folderId = null
  fileData.value.file = null
  fileData.value.description = ''
}

const folderFn = () => {
  folderModal.value.open = true
}

const closeFolderModal = () => {
  resetModel()
}

const folderSave = async () => {
  await store.dispatch('showLoading')

  try {
    FolderService.folderName = folderModal.value.name
    let data = await FolderService.addFolder()
    if (data.status) {
      await store.dispatch('triggerToast', { message: data.message, type: 'success' })
      await store.dispatch('setLoadFile', true)
      closeFolderModal()
    } else {
      await store.dispatch('triggerToast', { message: data.message, type: 'error' })
    }
    await store.dispatch('hideLoading')
  } catch (error) {
    await store.dispatch('hideLoading')
    await store.dispatch('triggerToast', { message: error.message, type: 'error' })
  }
}

const fileChange = (e) => {
  fileData.value.file = e.target.files
  fileMultiple.value.push(...e.target.files)
  close()
  // store.dispatch('setFileMultiple', e.target.files)
  // fileSaveFn()
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

watchEffect(() => {
  if (folderModal.value.open) {
    nextTick(() => {
      inputFolderName.value['focus']()
      inputFolderName.value['setSelectionRange'](0, inputFolderName.value['value'].length)
    })
  }
})
</script>

<template>
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div v-show="active" class="rounded-lg overflow-hidden transform transition-all sm:w-fit">
      <div
        v-if="active"
        class="menu relative bg-base-100 border border-base-300 py-4 my-2 dark:border-white/50 shadow-lg rounded-lg"
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
              <input type="file" class="hidden" id="fileButton" @change="fileChange" multiple />
              <iconify
                icon="solar:file-send-bold-duotone"
                class="text-orange-500 dark:text-blue-600"
                height="1.8em"
              />
              <span class="text-sm font-medium">Upload File</span>
            </a>
          </li>
          <!--            <li>-->
          <!--              <a>-->
          <!--                <iconify-->
          <!--                  icon="solar:move-to-folder-bold-duotone"-->
          <!--                  class="text-orange-500 dark:text-blue-600"-->
          <!--                  height="1.8em"-->
          <!--                />-->
          <!--                <span class="text-sm font-medium">Upload Folder</span>-->
          <!--              </a>-->
          <!--            </li>-->
        </ul>
      </div>
    </div>
  </transition>

  <Modal :show="folderModal.open" @close="closeFolderModal" maxWidth="sm">
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
  </Modal>
</template>

<style scoped></style>

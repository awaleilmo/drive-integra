<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import uploadService from '~/services/upload.service'
import Modal from '~/components/Modal.vue'

const store = useStore()
const fileData = ref([])
const toggleMinimize = ref(true)
const replace = ref(true)
const isDuplicate = ref(false)
const modalValidateDuplicate = ref({
  open: false,
  message: '',
})

const minimizeFn = () => {
  toggleMinimize.value = !toggleMinimize.value
}

const checkFileArrayDuplicate = (val, i) => {
  const value = store.state.fileMultiple
  for (let j = 0; j < value.length; j++) {
    if (i !== j) {
      if (value[j].name === val.name) {
        store.state.fileMultiple.splice(j, 1)
        return true
      }
    }
  }
  return false
}

const pushFileData = (val, i) => {
  fileData.value.push({
    folderId: null,
    description: '',
    file: val,
    loading: false,
    warning: false,
    pending: true,
    error: false,
    success: false,
    message: null,
    same: 0,
    version: 0,
  })
}

const validateDuplicate = async () => {
  const value = fileData.value.map((val) => val['file'].name)
  const check = await uploadService.CountDuplicate({ data: value, folderId: FolderIdGet() })
  if (check.status) {
    if (check.count === 0) {
      await UploadFiles()
    }
    if (check.count > 0) {
      isDuplicate.value = true
      modalValidateDuplicate.value = {
        open: true,
        message: check.count > 1 ? 'Satu atau beberapa item' : check.data[0]['fileName'],
      }
    }
  } else {
    await store.dispatch('triggerToast', { message: check.message, type: 'error' })
  }
}

const updateFile = () => {
  const value = store.state.fileMultiple
  if (value.length > 0) {
    fileData.value = []
    for (let i = 0; i < value.length; i++) {
      if (i === 0) {
        pushFileData(value[i], i)
      } else {
        const check = checkFileArrayDuplicate(value[i], i)
        if (!check) {
          pushFileData(value[i], i)
        }
      }
    }
  }
}

const FolderIdGet = () => {
  let queryString = window.location.search
  if (queryString) {
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('folders')
  }
  return null
}

const UploadFiles = async () => {
  await store.dispatch('setOnUpload', true)
  const value = fileData.value
  let err = false
  for (let i = 0; i < value.length; i++) {
    const formData = new FormData()
    let localDup = false
    fileData.value[i].loading = true
    fileData.value[i].pending = false
    fileData.value[i].warning = false
    fileData.value[i].error = false
    fileData.value[i].success = false
    fileData.value[i].message = null
    fileData.value[i].same = 0
    fileData.value[i].version = 0
    let fileNameReplace = value[i].file['name']
    if (isDuplicate.value) {
      localDup = true
      const getData = await uploadService.CountDuplicate({
        data: [value[i].file['name']],
        folderId: FolderIdGet(),
      })
      if (replace.value) {
        fileData.value[i].version = Number.parseInt(getData.data[0]['version'].toString()) + 1
      } else {
        fileData.value[i].same = Number.parseInt(getData.data[0]['sameFileCount'].toString()) + 1
        const fileNameWithExt = value[i].file['name']
        const baseName = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.'))
        fileNameReplace =
          baseName +
          ' ' +
          fileData.value[i].same +
          fileNameWithExt.substring(fileNameWithExt.lastIndexOf('.'))
      }
    }
    formData.append('file', value[i].file)
    formData.append('folderId', FolderIdGet())
    formData.append('description', null)
    formData.append('fileName', fileNameReplace)
    formData.append('replace', replace.value)
    formData.append('isDuplicate', localDup)
    let data = await uploadService.Uploads(formData)
    if (data.status) {
      fileData.value[i].loading = false
      fileData.value[i].success = true
      await store.dispatch('triggerToast', { message: data.message, type: 'success' })
    } else {
      fileData.value[i].loading = false
      fileData.value[i].error = true
      fileData.value[i].message = data.message
      err = true
      await store.dispatch('triggerToast', { message: data.message, type: 'error' })
    }
  }
  if (!err) {
    await store.dispatch('setOnUpload', false)
    setTimeout(async () => {
      await store.dispatch('setFileMultiple', [])
      fileData.value = []
      window.location.reload()
    }, 2000)
  }
}

watch(store.state.fileMultiple, (newVal) => {
  if (newVal.length > 0) {
    updateFile()
  }
})
</script>

<template>
  <div
    v-if="fileData.length > 0"
    class="fixed transition-all delay-150 flex flex-col bottom-0 drop-shadow-2xl z-10 max-w-xs sm:max-w-md mx-auto min-w-24 rounded-t-2xl left-0 right-16 sm:right-0 dark:shadow-blue-400 shadow-lg"
  >
    <div class="bg-base-100 border w-full border-base-300 mx-auto dark:border-none rounded-t-2xl">
      <div
        class="btn border-0 btn-sm m-0 w-full rounded-t-2xl rounded-b-none bg-orange-200 overflow-y-auto text-center text-orange-600 dark:bg-blue-600/50 dark:text-blue-400 cursor-pointer"
        @click="minimizeFn"
      >
        klik untuk {{ toggleMinimize ? 'minimize' : 'maximize' }}
      </div>
      <transition
        enter-active-class="ease-in duration-500"
        enter-from-class="opacity-0 translate-y-36"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="ease-out duration-300"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-36"
      >
        <div v-show="toggleMinimize" class="max-h-80 min-h-12 overflow-y-auto overflow-x-hidden">
          <div class="flex sticky justify-end px-4 py-2 w-full">
            <button class="btn btn-success text-base-100" @click="validateDuplicate()">
              <iconify icon="solar:upload-square-broken" height="1.8em" />
              Upload
            </button>
          </div>
          <ul class="menu py-4">
            <li
              v-for="(item, index) in fileData"
              :key="index"
              :data-tip="item.file['name']"
              class="tooltip break-words"
            >
              <div>
                <iconify
                  icon="solar:file-send-bold-duotone"
                  class="text-orange-500 dark:text-blue-600"
                  height="1.8em"
                />
                <span class="text-sm font-medium truncate max-w-2xl min-w-24"
                  >{{ item.file['name'] }}
                </span>
                <div class="ml-2 group">
                  <iconify
                    v-if="item.loading"
                    icon="svg-spinners:90-ring-with-bg"
                    class="text-info"
                    height="1.8em"
                  />
                  <iconify
                    v-if="item.pending"
                    icon="solar:clock-circle-bold-duotone"
                    class="text-primary"
                    height="1.8em"
                  />
                  <iconify
                    v-if="item.error"
                    icon="solar:danger-triangle-bold"
                    class="text-red-600"
                    height="1.8em"
                  />
                  <iconify
                    v-if="item.success"
                    icon="solar:check-circle-bold-duotone"
                    class="text-success"
                    height="1.8em"
                  />
                  <span
                    v-if="item.message !== null"
                    class="absolute z-10 right-[10%] top-0 max-h-48 mb-40 bg-error hidden group-hover:block rounded max-w-[80%] h-auto py-2 px-3 break-words text-white"
                    >{{ item.message }}</span
                  >
                </div>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
  <Modal :show="modalValidateDuplicate.open" @close="modalValidateDuplicate.open = false">
    <div class="card bg-base-100 w-full shadow-xl">
      <div class="card-body">
        <h1 class="card-title">Opsi Upload</h1>
        <p>
          {{ modalValidateDuplicate.message }} sudah ada di lokasi ini, Apakah Anda ingin mengganti
          file yang ada dengan versi baru atau menyimpan kedua file? Mengganti file tidak akan
          merubah settingan berbagi.
        </p>
        <div class="flex mt-4 w-full flex-col mx-4">
          <div class="form-control w-1/3">
            <label class="label cursor-pointer">
              <span class="label-text">Ganti file yang ada</span>
              <input
                v-model="replace"
                type="radio"
                :value="true"
                name="radio-10"
                class="radio checked:bg-red-500"
                :checked="replace"
              />
            </label>
          </div>
          <div class="form-control w-1/3">
            <label class="label cursor-pointer">
              <span class="label-text">Simpan kedua file</span>
              <input
                v-model="replace"
                type="radio"
                :value="false"
                name="radio-10"
                class="radio checked:bg-blue-500"
                :checked="!replace"
              />
            </label>
          </div>
        </div>
        <div class="card-actions justify-end">
          <button class="btn btn-sm" @click="modalValidateDuplicate.open = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="UploadFiles()">Upload</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>

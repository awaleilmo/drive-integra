<script setup>
import Modal from '~/components/Modal.vue'
import { computed, ref, watch } from 'vue'
import folderService from '~/services/folder.service.ts'
import { encrypt } from '~/services/crypto.service.ts'
import uploadService from '~/services/upload.service.ts'
import folderPopupStore from '~/store/folder_popup.store.ts'
import { useStore } from 'vuex'

const folderModal = ref({
  open: false,
  name: 'Folder tanpa nama',
  path: '/',
})
const store = useStore()
const folderStore = new folderPopupStore(store)
const isFolderData = ref([])
const show = computed(() => store.state.folderPopupShow)
const dataProp = computed(() => store.state.folderPopupData)
const folderID = computed(() => store.state.folderPopupFolderId)
const titleName = computed(() => store.state.folderPopupTitle)
const isLoading = ref(false)
const model = ref({
  data: [],
  targetId: null,
  targetName: null,
  currentFolderId: null,
  currentFolderName: null,
  backFolderId: null,
})
const activeBtnFolder = ref(null)

const closeFolderModal = () => {
  folderModal.value.name = 'Folder tanpa nama'
  folderModal.value.path = '/'
  folderModal.value.open = false

  folderStore.reset()
}

const closeModal = () => {
  folderStore.reset()
}

const getFolder = async () => {
  try {
    let encrypts = encrypt(model.value.targetId || null)
    let result = await folderService.getFolder(encrypts)
    return result.data
  } catch (error) {
    return null
  }
}

const getFolderById = async (id) => {
  try {
    let encrypts = encrypt(id)
    let result = await folderService.getById(encrypts)
    return result.data
  } catch (error) {
    return null
  }
}

const getFolderNameById = async (id) => {
  try {
    let result = await getFolderById(id)
    return result['folderName']
  } catch (error) {
    return null
  }
}

const dblClickFolder = (item) => {
  model.value.targetId = item['id']
  model.value.targetName = item['folderName']
  model.value.backFolderId = item['parentId']
  isLoading.value = true
}

const backFolder = async () => {
  if (model.value.targetId === null) return
  model.value.targetId = model.value.backFolderId
  model.value.targetName = (await getFolderNameById(model.value.backFolderId)) || null
  model.value.backFolderId = null
  isLoading.value = true
}

const clickLocationDefault = async () => {
  let data = await getFolderById(model.value.currentFolderId)
  if (!data || !data['id']) {
    data = {
      id: null,
      folderName: null,
      parentId: null,
    }
  }
  dblClickFolder(data)
}
const actionSaveFolder = async (item) => {
  isLoading.value = true
  item.data.map(async (data) => {
    const payload = {
      id: data.id.toString(),
      targetId: model.value.targetId,
    }
    if (data.isFile) {
      const res = await uploadService.moveFile(payload)
      if (res.status) {
        await store.dispatch('triggerToast', { message: res.message, type: 'success' })
        await store.dispatch('setLoadFile', true)
      } else {
        await store.dispatch('triggerToast', { message: res.message, type: 'error' })
      }
      await store.dispatch('hideLoading')
    } else {
      const res = await folderService.moveFolder(payload)
      if (res.status) {
        await store.dispatch('triggerToast', { message: res.message, type: 'success' })
        await store.dispatch('setLoadFile', true)
      } else {
        await store.dispatch('triggerToast', { message: res.message, type: 'error' })
      }
      await store.dispatch('hideLoading')
    }
  })
  isLoading.value = false
  folderStore.reset()
}

const moveFolderBtnBottom = async () => {
  await actionSaveFolder(model.value)
}
const moveFolderBtnList = async (id) => {
  model.value.targetId = id
  await actionSaveFolder(model.value)
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

const disabledBtn = (id = null) => {
  if (id === null) {
    return model.value.targetId === model.value.currentFolderId
  } else {
    const data = model.value.data.filter((a) => a.id === id && !a['isFile']).map((a) => a.id)
    return data.includes(id)
  }
}

watch(show, async () => {
  if (show.value) {
    model.value.data = dataProp.value
    model.value.targetId = null
    model.value.targetName = null
    model.value.currentFolderId = folderID.value
    model.value.currentFolderName = (await getFolderNameById(folderID.value)) ?? null
    model.value.backFolderId = null
    isLoading.value = true
  }
})
</script>

<template>
  <modal :show="show" @close="closeModal" maxWidth="2xl">
    <div class="py-6 px-6 flex flex-col items-start justify-start">
      <label class="text-xl text-start font-medium"
        >Pindahkan {{ dataProp.length > 1 ? dataProp.length + 'item' : `"${titleName}"` }}</label
      >
      <div class="pt-4">
        Lokasi Asal:
        <div class="btn btn-sm btn-outline" @click="clickLocationDefault">
          {{ model.currentFolderName || 'Drive Saya' }}
        </div>
      </div>
      <div class="py-2 flex items-center justify-start border-b w-full font-bold">
        <button class="btn btn-xs btn-ghost" @click="backFolder">
          <iconify
            v-if="model.targetId !== null || model.targetId === ''"
            icon="solar:arrow-left-bold"
            class="font-bold text-red-400"
            height="2em"
          />
          <iconify v-else icon="solar:folder-bold" class="font-bold text-red-400" height="1.5em" />
        </button>
        {{ model.targetName ?? 'Drive Saya' }}
      </div>
      <div
        v-if="isLoading"
        class="py-2 flex h-[25em] justify-center items-center w-full overflow-y-auto"
      >
        <iconify
          icon="svg-spinners:90-ring-with-bg"
          class="font-bold text-red-400"
          height="2.5em"
        />
      </div>
      <div v-else class="py-2 flex h-[25em] justify-start w-full overflow-y-auto">
        <div class="w-full">
          <div
            v-for="(item, index) in isFolderData"
            :key="index"
            class="w-full px-2 group relative"
            @click="activeBtnFolder === null ? (activeBtnFolder = index) : (activeBtnFolder = null)"
            @dblclick="dblClickFolder(item)"
            disabled="disabled"
          >
            <div
              class="font-semibold bg-base-200 flex items-center py-1 rounded hover:bg-base-300"
              :class="activeBtnFolder === index ? 'bg-base-300 active' : ''"
            >
              <iconify
                icon="solar:folder-bold"
                class="mx-2 font-bold text-red-400"
                height="1.5em"
              />
              {{ item['folderName'] }}
            </div>
            <button
              :disabled="disabledBtn(item.id)"
              class="absolute z-10 bottom-0 top-0 right-3 btn group-hover:block btn-xs btn-info my-auto"
              :class="activeBtnFolder === index ? 'block' : 'hidden'"
              @click="moveFolderBtnList(item.id)"
            >
              Pindahkan
            </button>
          </div>
        </div>
      </div>
      <div class="mt-3 w-full flex justify-end gap-4">
        <div @click="closeFolderModal" class="btn btn-sm btn-ghost text-red-400">Batal</div>
        <button
          :disabled="isLoading || disabledBtn()"
          @click="moveFolderBtnBottom"
          class="btn btn-sm btn-info"
        >
          Pindahkan
        </button>
      </div>
    </div>
  </modal>
</template>

<style scoped></style>

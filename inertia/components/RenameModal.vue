<script setup>
import { computed, ref, watchEffect, nextTick } from 'vue'
import Modal from './Modal.vue'
import { useStore } from 'vuex'
import UploadService from '~/services/upload.service'
import FolderService from '~/services/folder.service'

const store = useStore()

const show = computed(() => store.state.renameModal.show)
const data = computed(() => store.state.renameModal.data)
const isFile = computed(() => store.state.renameModal.isFile)

const form = computed(() => {
  return {
    name: data.value['folderName'] || data.value['fileName'],
  }
})

const inputField = ref(null)

const closeModal = () => {
  store.dispatch('setRenameModalShow', false)
  store.dispatch('setRenameModalData', {})
  store.dispatch('setRenameModalIsFile', false)
}

const save = async () => {
  await store.dispatch('showLoading')

  try {
    const res = isFile.value
      ? await UploadService.renameFile(data.value.id, form.value)
      : await FolderService.renameFolder(data.value.id, form.value)
    if (res.status) {
      await store.dispatch('triggerToast', { message: res.message, type: 'success' })
      await store.dispatch('setLoadFile', true)
      setTimeout(() => {
        closeModal()
      }, 200)
    } else {
      await store.dispatch('triggerToast', { message: res.message, type: 'error' })
    }
    await store.dispatch('hideLoading')
  } catch (error) {
    await store.dispatch('hideLoading')
    await store.dispatch('triggerToast', { message: error.message, type: 'error' })
  }
}

watchEffect(() => {
  if (show.value) {
    nextTick(() => {
      inputField.value.focus()
      inputField.value.setSelectionRange(0, inputField.value.value.length)
    })
  }
})
</script>
<template>
  <Modal :show="show" @close="closeModal" maxWidth="sm">
    <div class="py-6 px-6 form-control">
      <label class="text-2xl font-medium">Ganti nama</label>
      <input
        @keyup.enter="save"
        ref="inputField"
        type="text"
        placeholder="ganti nama"
        class="input input-bordered w-full mt-5"
        v-model="form.name"
      />
      <div class="mt-3 flex justify-end gap-4">
        <div @click="save" class="btn btn-sm btn-ghost text-success">Simpan</div>
      </div>
    </div>
  </Modal>
</template>
<style></style>

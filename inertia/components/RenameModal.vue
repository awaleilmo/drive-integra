<script setup>
import { computed, ref, watchEffect, nextTick } from 'vue'
import Modal from './Modal.vue'
import { useStore } from 'vuex'
import UploadService from '~/services/upload.service'
import FolderService from "~/services/folder.service";

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
  isFile: {
    type: Boolean,
    default: false,
  }
})
const store = useStore()

const form = computed(() => {
  return {
    name: props.data.folderName || props.data.fileName,
  }
})

const inputField = ref(null)

const emit = defineEmits(['close'])

const closeModal = () => {
  if (props.closeable) {
    emit('close')
  }
}

const save = async () => {
    await store.dispatch('showLoading')

    try {
        const data = props.isFile ? await UploadService.renameFile(props.data.id, form.value) : await FolderService.renameFolder(props.data.id, form.value)
        if (data.status) {
            await store.dispatch('triggerToast', { message: data.message, type: 'success' })
            closeModal()
          await store.dispatch('setLoadFile', true)
        } else {
            await store.dispatch('triggerToast', { message: data.message, type: 'error' })
        }
        await store.dispatch('hideLoading')
    } catch (error) {
        await store.dispatch('hideLoading')
        await store.dispatch('triggerToast', { message: error.message, type: 'error' })
    }
}

watchEffect(() => {
  if (props.show) {
    nextTick(() => {
      inputField.value.focus()
      inputField.value.setSelectionRange(0, inputField.value.value.length);
    })
  }
})
</script>
<template>
  <Modal :show="props.show" @close="closeModal" maxWidth="sm">
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

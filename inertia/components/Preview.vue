<script setup>
import Modal from './Modal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  src: {
    type: String,
    default: '',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: 'image',
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  if (props.closeable) {
    emit('close')
  }
}
</script>

<template>
  <Modal :show="props.show" @close="closeModal" maxWidth="7xl">
    <div class="max-h-[80vh] h-full flex justify-center">
      <embed v-if="props.type === 'image'" class="min-w-40 max-h-[80vh] overflow-y-auto rounded-lg" :src="props.src"/>
      <embed v-if="props.type === 'application'" class="w-full min-h-[80vh] overflow-y-auto rounded-lg" :src="props.src"/>
    </div>
  </Modal>
</template>

<style scoped>

</style>

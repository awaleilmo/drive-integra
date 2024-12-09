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
  },
})

const emit = defineEmits(['close'])

const closeModal = () => {
  if (props.closeable) {
    emit('close')
  }
}
</script>

<template>
  <transition leave-active-class="duration-200">
    <div
      v-show="show"
      class="fixed flex items-center inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50 justify-center"
    >
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-show="show" class="fixed inset-0 transform transition-all" @click="closeModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75" />
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
          v-show="show"
          class="my-6 bg-base-100/70 max-w-[vw-90] rounded-lg shadow-xl transform transition-all w-fit p-6 sm:mx-auto"
        >
          <div class="max-h-[80vh] h-full flex justify-center">
            <embed
              v-if="props.type === 'image'"
              class="min-w-40 max-h-[80vh] overflow-y-auto rounded-lg"
              :src="props.src"
            />
            <embed
              v-if="props.type === 'application'"
              class="w-[80vw] min-h-[80vh] overflow-y-auto rounded-lg"
              :src="props.src"
            />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped></style>

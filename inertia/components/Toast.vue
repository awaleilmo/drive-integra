<script setup>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const showToast = computed(() => store.state.showToast)
const toastMessage = computed(() => store.state.toastMessage)
const toastType = computed(() => store.getters.toastType)

const toastClass = computed(() => {
  switch (toastType.value) {
    case 'success':
      return 'alert alert-success'
    case 'warning':
      return 'alert alert-warning'
    case 'error':
      return 'alert alert-error'
    case 'info':
      return 'alert alert-info'
  }
})

const hideToast = () => {
  store.dispatch('hideToast')
}

watch(showToast, (newVal) => {
  if (newVal) {
    setTimeout(hideToast, 4000)
  }
})
</script>

<template>
  <div v-if="showToast" class="toast toast-start" @click="hideToast">
    <div :class="toastClass">
      <div>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  //top: 1rem;
  //right: 1rem;
  z-index: 9999;
}
</style>

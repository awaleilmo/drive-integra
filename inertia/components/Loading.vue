<script setup>
const props = defineProps({
  loading: Boolean,
})
</script>
<template>
  <teleport to="body">
    <transition leave-active-class="duration-200">
      <div
        v-show="loading"
        class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50 items-center justify-center flex"
      >
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-show="loading" class="fixed inset-0 transform transition-all">
            <div class="absolute inset-0 bg-gray-800 opacity-75" />
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
          <div v-show="loading" class="mb-6 rounded overflow-hidden transform transition-all">
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style scoped></style>

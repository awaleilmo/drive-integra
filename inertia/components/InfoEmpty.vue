<script setup>
const props = defineProps({
  show: Boolean,
  src: String,
  title: String,
  message: String,
})
</script>

<template>
  <div
    v-if="show"
    class="flex flex-col justify-center select-none items-center gap-4 absolute top-0 bottom-0 right-0 left-0"
  >
    <img :src="src" class="w-64" alt="File Manager" />
    <h1 class="text-3xl text-center">{{ title }}</h1>
    <p class="text-lg text-center max-w-2xl">{{ message }}</p>
  </div>
</template>

<style scoped></style>

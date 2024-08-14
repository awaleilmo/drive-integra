<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  size: {
    type: String,
    default: '32',
  },
})
const darkMode = ref(localStorage.getItem('theme') === 'dark')
const changeDarkMode = () => {
  darkMode.value = !darkMode.value
  document.documentElement.setAttribute('data-theme', darkMode.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', darkMode.value)
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
  // window.location.reload()
}
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  }
  darkMode.value = savedTheme === 'dark'
})
</script>
<template>
  <label class="swap swap-rotate">
    <input type="checkbox" class="theme-controller" :checked="!darkMode" @change="changeDarkMode" />
    <iconify
      class="swap-on text-yellow-500"
      icon="solar:sun-fog-bold-duotone"
      :width="props.size"
      :height="props.size"
    />
    <iconify
      class="swap-off"
      icon="solar:moon-fog-bold-duotone"
      :width="props.size"
      :height="props.size"
    />
  </label>
</template>

<style></style>

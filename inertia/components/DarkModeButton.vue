<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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
const checkDarkMode = () => {
  let savedTheme = localStorage.getItem('theme')
  if (!savedTheme) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      savedTheme = 'dark'
    } else {
      savedTheme = 'light'
    }
  }
  darkMode.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  }else{
    document.documentElement.classList.remove('dark')
  }
}
onMounted(() => {
  checkDarkMode()

  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQueryList.addEventListener('change', checkDarkMode)
})

onUnmounted(() => {
  mediaQueryList.removeEventListener('change', checkDarkMode);
})
</script>
<template>
  <label class="swap swap-rotate">
    <input type="checkbox" class="theme-controller" :checked="!darkMode" @change="changeDarkMode" />
    <iconify
      class="swap-on text-yellow-500"
      icon="solar:sun-fog-broken"
      :width="props.size"
      :height="props.size"
    />
    <iconify
      class="swap-off"
      icon="solar:moon-fog-broken"
      :width="props.size"
      :height="props.size"
    />
  </label>
</template>

<style></style>

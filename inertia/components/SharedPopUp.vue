<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const show = computed(() => store.state.sharedPopup.show)
</script>

<template></template>

<style scoped></style>

<script setup>
const props = defineProps({
  links: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="join justify-end border shadow-lg shadow-base-content/20">
    <button
      v-for="item in links"
      class="join-item btn"
      :class="{
        'btn-active': item.active,
        'btn-info': !item.active,
      }"
      @click="item.url ? $emit('clickProps', item.url) : null"
      :disabled="!item.url || item.active"
      v-html="item.label"
    />
  </div>
</template>

<style scoped></style>

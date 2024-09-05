<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])

const input = ref(null)
</script>

<template>
  <textarea
    class="textarea textarea-bordered"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    ref="input"
    model-value=""
  >

        <slot />

    </textarea
  >
</template>

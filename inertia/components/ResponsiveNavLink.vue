<script setup>
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
  },
})

const classes = computed(() =>
  props.active
    ? 'block w-full pl-3 pr-4 py-2 border-l-4 border-indigo-400 text-left text-base font-medium text-indigo-300 bg-indigo-900/50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-900 focus:border-indigo-300 transition duration-150 ease-in-out'
    : 'block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-600 focus:outline-none focus:text-gray-200 focus:bg-gray-50 focus:border-gray-600 transition duration-150 ease-in-out'
)
</script>

<template>
  <Link :href="href" :class="classes">
    <slot />
  </Link>
</template>

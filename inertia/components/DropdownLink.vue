<script setup>
import { Link } from '@inertiajs/vue3'

defineProps({
  href: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <Link
    :href="href"
    class="block w-full px-4 py-2 text-left text-sm leading-5 hover:bg-base-300 focus:outline-none focus:bg-base-100 transition duration-150 ease-in-out"
  >
    <slot />
  </Link>
</template>

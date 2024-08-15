<script setup>
import { watchEffect } from 'vue'
const props = defineProps({
  alerts: {
      type: Object,
      default: {
        type: 'default',
        show: false,
        message: 'New message!',
      }
  }
})

watchEffect(
  () => {
  if (props.alerts.message) {
    props.alerts.show = true
    setTimeout(() => {
      props.alerts.show = false
    }, 3000)
  }
})
</script>

<template>
  <div
    v-show="props.alerts.show"
    role="alert"
    class=" alert shadow-lg transition delay-150 ease-in-out duration-300"
    :class="{
      'alert-success': props.alerts.type === 'success',
      'alert-error': props.alerts.type === 'error',
      'alert-info': props.alerts.type === 'info',
      'alert-warning': props.alerts.type === 'warning',
    }"
  >
    <svg
      v-if="props.alerts.type === 'default'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-info shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <svg
      v-if="props.alerts.type === 'info'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <svg
      v-if="props.alerts.type === 'success'"
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <svg
      v-if="props.alerts.type === 'warning'"
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <svg
      v-if="props.alerts.type === 'error'"
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div>
      <slot name="message">
        <span class="break-words">{{ props.alerts.message }}</span>
      </slot>
    </div>
    <slot name="body" />
  </div>
</template>

<style scoped></style>
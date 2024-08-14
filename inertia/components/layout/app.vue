<script setup>
const theme = localStorage.getItem('theme')
</script>

<template>
    <div :data-theme="theme ?? 'dark'" class="h-screen w-screen">
        <slot />
    </div>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'button',
    },
});
</script>

<template>
    <button
        :type="type"
        class="btn btn-secondary font-bold shadow-xl shadow-secondary/50"
    >
        <slot />
    </button>
</template>

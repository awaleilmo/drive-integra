<template>
    <div
        class="shadow-md dark:shadow-base-content/30 select-none bg-base-200 basis-60 rounded-lg hover:btn-active flex justify-start items-center py-2 px-4 gap-2">
        <Iconify icon="solar:folder-bold-duotone" class="grow-0" height="1.5em" />
        <div class="grow text-left w-28 truncate">SOLAR</div>
        <DetailDrop />
    </div>
</template>

<script setup>
import DetailDrop from '~/components/DetailDrop.vue';
</script>

<style></style>
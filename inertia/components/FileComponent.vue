<template>
    <div class="shadow-md dark:shadow-base-content/30 select-none bg-base-200 basis-72 rounded-lg hover:btn-active">
        <div class=" flex justify-start items-center gap-2 px-4 py-2">
            <Iconify icon="solar:folder-bold-duotone" class="grow-0" height="1.5em" />
            <div class="grow text-left w-28 truncate">SOLAR</div>
            <DetailDrop />
        </div>
        <div
            class="my-2 rounded-md mx-2 flex justify-center items-center h-52 bg-white dark:bg-base-content dark:text-base-300">
            test
        </div>
    </div>
</template>

<script setup>
import DetailDrop from '~/components/DetailDrop.vue';
</script>

<style></style>
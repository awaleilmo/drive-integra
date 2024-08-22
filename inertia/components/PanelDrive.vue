<template>
    <div class="rounded-xl h-[calc(100vh-6rem)] shadow dark:shadow-success/20">
        <div
            class="w-full rounded-t-xl text-2xl font-medium h-[2.5rem] bg-base-200 flex justify-start px-4 py-6 items-center">
            <slot  name="header"></slot>
        </div>
        <div class="bg-base-100 rounded-b-xl px-4 py-4 shadow-lg mb-5 h-[calc(100%-2.5rem)] relative overflow-y-auto">
            <label class="text-md font-medium">Folder</label>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full justify-stretch gap-4 my-5">

                <FolderComponent v-for="item in 20" :key="item" />

            </div>
            <label class="text-md font-medium">File</label>
            <div class="flex flex-row flex-wrap w-full justify-stretch gap-4 mt-5 place-content-stretch">

                <FileComponent />

            </div>
            <slot name="main"></slot>
        </div>
    </div>
</template>

<script setup>
import  FolderComponent from './FolderComponent.vue'
import FileComponent from './FileComponent.vue'

</script>

<style></style>
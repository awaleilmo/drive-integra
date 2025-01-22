<template>
  <div class="rounded-xl h-[calc(100vh-6rem)] shadow dark:shadow-success/20">
    <div
      class="w-full rounded-t-xl text-2xl font-medium h-[2.5rem] bg-base-200 flex justify-start px-4 py-6 items-center"
    >
      <div class="breadcrumbs">
        <ul>
          <li>
            <a :href="defaultHomeUrl"><slot name="header"></slot></a>
          </li>
          <li v-for="(item, index) in breadcrumbs" :key="index">
            <a class="capitalize" :href="item.url">{{ item.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="bg-base-100 rounded-t-xl px-4 py-3 shadow-lg">
      <slot name="panelTop"></slot>
    </div>
    <div
      class="bg-base-100 rounded-b-xl px-4 pb-4 shadow-lg mb-5 h-[calc(100%-2.5rem)] overflow-y-auto"
    >
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  breadcrumbs: Object,
  defaultHomeUrl: String,
})
</script>

<style></style>

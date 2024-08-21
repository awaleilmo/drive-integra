<script setup>
import Layout from '~/components/layout/dashboard.vue'
</script>

<template>
  <Layout>
    <div class="rounded-xl h-[calc(100vh-6rem)] shadow dark:shadow-success/20">
      <div
        class="w-full rounded-t-xl h-[2.5rem] bg-base-100 dark:bg-base-200 flex justify-start p-4 items-center"
      >
        Drive Saya
      </div>
      <div class="bg-base-100 rounded-b-xl flex justify-start px-4 py-4 h-[calc(100%-2.5rem)]">
        <div class="grid grid-flow-col auto-cols-max gap-4">
          <div class="btn w-52 hover:cursor-auto flex">
            <Iconify icon="solar:folder-broken" class="grow-0" height="1.2em" />
            <div class="grow text-left w-28 truncate">SOasdasasdasLAR</div>
            <Iconify icon="solar:menu-dots-bold" class="rotate-90 grow-0 hover:cursor-pointer" height="1.5em" />
          </div>
          <div class="btn btn-info w-52">02</div>
          <div class="btn btn-info w-52">03</div>
        </div>
      </div>
    </div>
  </Layout>
</template>

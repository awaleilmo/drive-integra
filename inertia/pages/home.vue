<script setup>
import FileComponent from '~/components/FileComponent.vue';
import FloatMenu from '~/components/FloatMenu.vue';
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'

</script>

<template>
  <Layout>
    <PanelDrive>
      <template #header>
        <h1>Drive Saya</h1>
      </template>
      <template #main>
        <label class="text-md font-medium">Folder</label>
        <div class="flex flex-wrap w-full gap-4 my-5">

          <FileComponent v-for="item in 20" :key="item" />

        </div>
        <label class="text-md font-medium">File</label>
        <div class="flex flex-row flex-wrap w-full justify-stretch gap-4 mt-5 place-content-stretch">

          <FileComponent v-for="item in 50" :preview="true" />

        </div>
      </template>
    </PanelDrive>

    <FloatMenu />
  </Layout>
</template>

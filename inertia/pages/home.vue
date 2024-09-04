<script setup>
import { onMounted } from 'vue';
import FileComponent from '~/components/FileComponent.vue';
import FloatMenu from '~/components/FloatMenu.vue';
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'

const props = defineProps({
  folder: Object,
  file: Object
})

const folderAction = (item) => {

}

onMounted(async () => {
  console.log(props.folder[0])
})
</script>

<template>
  <Layout>
    <PanelDrive>
      <template #header>
        <h1>Drive Saya</h1>
      </template>
      <template #main>

        <label v-if="props.folder.length > 0" class="text-base font-medium">Folder</label>
        <div class="flex flex-wrap w-full gap-4 my-5">

          <FileComponent v-for="(item, index) in props.folder" :key="index" :data="item"
            @dblclick="folderAction(item)" />

        </div>

        <label v-if="props.file.length > 0" class="text-base font-medium">File</label>
        <div class="flex flex-row flex-wrap w-full justify-stretch gap-4 mt-5 place-content-stretch">

          <FileComponent v-for="(item, index) in props.file" :key="index" :data="item" />

        </div>
      </template>
    </PanelDrive>

    <FloatMenu />
  </Layout>
</template>

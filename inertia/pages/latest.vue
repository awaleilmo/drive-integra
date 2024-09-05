<script setup>
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import myFilesSvg from '~/assets/my_files.svg'
import InfoEmpty from '~/components/InfoEmpty.vue'
</script>

<template>
  <Layout>
    <PanelDrive>
      <template #header>
        <h1>Terbaru</h1>
      </template>
      <template #main>
        <div class="w-full relative h-full overflow-y-auto">
          <info-empty
            :show="true"
            :src="myFilesSvg"
            title="Tidak ada file terbaru"
            message="Lihat semua file yang baru saja Anda edit dan buka"
          />
        </div>
      </template>
    </PanelDrive>
  </Layout>
</template>

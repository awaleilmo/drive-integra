<script setup>
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import selectedOptionsSvg from '~/assets/selected_options.svg'
import myFilesSvg from '~/assets/my_files.svg'
import InfoEmpty from '~/components/InfoEmpty.vue'
</script>

<template>
  <Layout>
    <PanelDrive>
      <template #header>
        <h1>Berbintang</h1>
      </template>
      <template #main>
        <div class="w-full relative h-full overflow-y-auto">
          <info-empty
            :show="true"
            :src="selectedOptionsSvg"
            title="Tidak ada file Berbintang"
            message="Tambahkan bintang pada item agar Anda mudah mencarinya nanti"
          />
        </div>
      </template>
    </PanelDrive>
  </Layout>
</template>

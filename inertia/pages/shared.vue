<script setup>
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import shareArticlesSvg from '~/assets/sharing_articles.svg'
import InfoEmpty from '~/components/InfoEmpty.vue'
</script>

<template>
  <Layout>
    <PanelDrive>
      <template #header>
        <h1>Dibagikan kepada saya</h1>
      </template>
      <template #main>
        <div class="w-full relative h-full overflow-y-auto">
          <info-empty
            :show="true"
            :src="shareArticlesSvg"
            title="Belum yang ada dibagikan kepada Anda"
            message="Lihat semua item yg dibagikan kepada Anda dalam satu tempat"
          />
        </div>
      </template>
    </PanelDrive>
  </Layout>
</template>

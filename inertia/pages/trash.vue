<script setup>
import Layout from '~/components/layout/dashboard.vue'
import PanelDrive from '~/components/PanelDrive.vue'
import throwAwaySvg from '~/assets/throw_away.svg'
import InfoEmpty from '~/components/InfoEmpty.vue'
</script>

<template>
  <Layout>
    <PanelDrive>
      <template #header>
        <h1>Sampah</h1>
      </template>
      <template #main>
        <div class="w-full relative h-full overflow-y-auto">
          <info-empty
            :show="true"
            :src="throwAwaySvg"
            title="Sampah Kosong"
            message="Pindahkan item yg tidak Anda Butuhkan ke sampah. item dalam sampah akan dihapus selamanya setelah 30 hari"
          />
        </div>
      </template>
    </PanelDrive>
  </Layout>
</template>

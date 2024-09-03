<script setup>
import layout from './app.vue'
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from 'vue'
import sideBar from './sideBar.vue'
import Loading from '~/components/Loading.vue'
import DarkModeButton from '~/components/DarkModeButton.vue'
import { getLoadingStatus, setLoadingStatus } from '~/services/utils.service'
import { useStore } from 'vuex'


const sidebarFn = () => {
  side.value = !side.value
  localStorage.setItem('sidebar', side.value)

}

const store = useStore();

const isLoading = computed(() => store.getters.isLoading);

const isRender = ref(false)

const side = ref(false)

onBeforeMount(() => {
  side.value = localStorage.getItem('sidebar') === 'true'
})

onMounted(() => {
  isRender.value = true
})

</script>

<template>
  <layout v-if="isRender" style="
      background-image: repeating-linear-gradient(
        45deg,
        var(--fallback-b1, oklch(var(--b1))),
        var(--fallback-b1, oklch(var(--b1))) 13px,
        var(--fallback-b2, oklch(var(--b2))) 13px,
        var(--fallback-b2, oklch(var(--b2))) 14px
      );
      background-size: 40px 40px;
    " class="flex justify-center">
    <sideBar :side="side" @toggleSide="sidebarFn" />

    <div class="w-screen">
      <nav class="navbar bg-base-100 shadow-md dark:shadow-success/10">
        <div class="navbar-start">
          <div @click="sidebarFn" class="btn btn-ghost btn-circle">
            <iconify icon="solar:list-bold-duotone" height="2em" />
          </div>
        </div>
        <div class="navbar-center">
          <a class="btn btn-ghost text-xl">IPM Drive</a>
        </div>
        <div class="navbar-end">
          <DarkModeButton class="btn btn-ghost btn-circle" />
          <button class="btn btn-ghost btn-circle">
            <iconify icon="solar:card-search-broken" height="2em" />
          </button>
          <button class="btn btn-ghost btn-circle">
            <div class="indicator">
              <iconify icon="solar:bell-broken" height="2em" />
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </nav>
      <main class="p-4">
        <slot />
      </main>
    </div>
  </layout>
  <loading :loading="isLoading" />
</template>

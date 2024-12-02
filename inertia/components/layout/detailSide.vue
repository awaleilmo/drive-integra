<script setup>
import logoDark from '~/assets/logo_dark.png'
import userService from '~/services/user.service'
import logoLight from '~/assets/logo_light.png'
import { Link, usePage } from '@inertiajs/vue3'
import { ref, onMounted, computed } from 'vue'
import { Icon as Iconify } from '@iconify/vue'
import { useStore } from 'vuex'

const props = defineProps({
  side: {
    type: Boolean,
  },
  toggleSide: {
    type: Function,
  },
})

const store = useStore()
const pages = usePage().props.auth
const dataDetail = computed(() => store.state.sideDetailData)

const emit = defineEmits(['toggleSide'])

const sideBarFun = () => {
  console.log('masuk')
  emit('toggleSide')
}

const menu = ref([
  {
    title: 'Drive Saya',
    icon: 'solar:folder-with-files-broken',
    link: '/home',
  },
  {
    title: 'Dibagikan kepada saya',
    icon: 'solar:users-group-rounded-broken',
    link: '/shared',
  },
  {
    title: 'Terbaru',
    icon: 'solar:clock-circle-broken',
    link: '/latest',
  },
  {
    title: 'Berbintang',
    icon: 'solar:medal-ribbons-star-broken',
    link: '/starry',
  },
  {
    title: 'Sampah',
    icon: 'solar:trash-bin-trash-broken',
    link: '/trash',
  },
])
</script>
<template>
  <div v-if="side" class="absolute py-4 z-30 right-0 sm:relative sm:right-0 sm:z-0">
    <div class="absolute sm:hidden bg-base-300/70 w-screen h-screen"></div>
    <div
      class="absolute right-0 rounded-l-xl h-[calc(100vh-6rem)] shadow dark:shadow-success/20 flex flex-col overflow-auto sm:relative bg-base-100 border border-base-200 w-2/3 sm:w-full"
      :class="['transition-all duration-300', props.side ? '-translate-x-0' : 'translate-x-80']"
    >
      <div class="flex justify-start text-sm gap-2 px-4 py-2 tooltip border-b border-base-300/50">
        <div class="cursor-pointer">
          <Iconify
            icon="solar:folder-bold-duotone"
            class="text-orange-400 dark:text-blue-600"
            height="2em"
          />
        </div>
        <div class="text-sm text-left font-bold antialiased font-sans">
          {{ dataDetail['fileName'] }}
        </div>
        <div class="cursor-pointer" @click="sideBarFun">
          <Iconify icon="solar:close-circle-linear" height="2em" />
        </div>
      </div>
      <div class="w-full h-44 p-2">
        <div class="bg-base-300 w-full h-full rounded-lg overflow-hidden"></div>
      </div>
      <div class="row-span-7 overflow-auto">
        <ul class="menu">
          <li v-for="(item, index) in menu" :key="index">
            <a class="font-semibold" :href="item.link">
              <iconify
                :icon="item.icon"
                height="1.5em"
                class="text-orange-400 dark:text-blue-600"
              />
              {{ item.title }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

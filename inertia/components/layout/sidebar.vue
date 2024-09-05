<script setup>
import logoDark from '~/assets/logo_dark.png'
import userService from '~/services/user.service'
import logoLight from '~/assets/logo_light.png'
import { Link, usePage } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'

const props = defineProps({
  side: {
    type: Boolean,
  },
  toggleSide: {
    type: Function,
  },
})

const pages = usePage().props.auth

const emit = defineEmits(['toggleSide'])

const sideBarFun = () => {
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
  <div
    class="h-screen absolute z-40 left-0 sm:relative sm:left-0 sm:z-0"
    :class="['transition-all duration-300', props.side ? 'w-full sm:w-72' : 'w-0']"
  >
    <div
      v-if="side"
      class="absolute sm:hidden bg-base-300/70 w-screen h-screen"
      @click="sideBarFun"
    ></div>
    <div
      class="absolute grid grid-rows-12 p-2 overflow-auto sm:relative bg-base-100 shadow-lg dark:shadow-success/20 h-screen w-2/3 sm:w-full"
      :class="['transition-all duration-300', props.side ? 'translate-x-0' : '-translate-x-72']"
    >
      <div class="flex justify-start items-center">
        <img
          alt="logo-dark"
          loading="lazy"
          width="72"
          height="20"
          decoding="async"
          class="hidden dark:inline"
          style="color: transparent"
          :src="logoDark"
        /><img
          alt="logo-light"
          loading="lazy"
          width="72"
          height="20"
          decoding="async"
          class="inline dark:hidden"
          style="color: transparent"
          :src="logoLight"
        />
        <label class="text-sm font-bold antialiased font-sans">Integra Corporation</label>
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
      <div class="row-span-4">
        <div class="pb-1">
          <div class="px-4 flex justify-center items-center flex-col">
            <iconify icon="solar:user-circle-broken" height="5em" />
            <div class="font-medium text-base capitalize">
              {{ pages.fullName }}
            </div>
            <div class="font-medium text-sm text-gray-500">{{ pages.email }}</div>
          </div>

          <div class="mt-3 space-y-1 flex items-center justify-around">
            <Link href="/logout" method="post">
              <button class="btn btn-error">
                <iconify icon="solar:logout-2-broken" height="1.5em" />
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

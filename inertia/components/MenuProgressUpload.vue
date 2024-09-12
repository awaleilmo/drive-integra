<script setup>

import { ref } from "vue";

const toggleMinimize = ref(true)

const minimizeFn = () => {
  toggleMinimize.value = !toggleMinimize.value
}
</script>

<template>
  <div
    class="absolute flex flex-col bottom-0 drop-shadow-2xl z-10 max-w-xs sm:max-w-md mx-auto min-w-24 left-0 right-16 sm:right-0 transition-all shadow-blue-400"
  >
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div
        class=" overflow-hidden transform transition-all sm:w-full sm:mx-auto"
      >
        <div
          class="bg-base-100 border border-base-300 mx-auto dark:border-white/50 shadow-lg rounded-t-2xl"
          :class="['transition-all duration-300', toggleMinimize ? 'translate-y-0' : 'translate-y-32']"
        >
          <div class="btn border-0 btn-sm m-0 w-full rounded-t-2xl rounded-b-none bg-orange-200 text-center text-orange-600 dark:bg-blue-600/50 dark:text-blue-400 cursor-pointer" @click="minimizeFn">klik untuk {{ toggleMinimize ? 'minimize' : 'maximize' }}</div>
          <ul class="menu py-4">
            <li>
              <a>
                <iconify
                  icon="solar:add-folder-bold-duotone"
                  class="text-orange-600 dark:text-blue-600"
                  height="1.8em"
                />
                <span class="text-sm font-medium">Folder baru</span>
              </a>
            </li>
            <hr class="my-2" />
            <li>
              <div>
                <iconify
                  icon="solar:file-send-bold-duotone"
                  class="text-orange-500 dark:text-blue-600"
                  height="1.8em"
                />
                <span class="text-sm font-medium">Upload File</span>
                <button class="btn btn-primary btn-xs ml-2 group">
                  Upload
                  <span class="absolute right-[20%] mb-2 bg-error hidden group-hover:block rounded max-w-[80%] h-auto py-2 px-3 break-words text-white text-justify">Toast sekarang bisa tampil dengan berbagai tipe (info, success, warning, error) dan akan memiliki gaya berbeda berdasarkan tipe yang dipanggil. Misalnya, jika kamu memanggil triggerErrorToast, maka toast akan muncul dengan gaya error.</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped></style>

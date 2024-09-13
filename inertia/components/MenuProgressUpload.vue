<script setup>
import { computed, ref, watch } from "vue";
import {useStore} from "vuex";

const store = useStore()
const fileData = ref([])
const toggleMinimize = ref(true)

const minimizeFn = () => {
  toggleMinimize.value = !toggleMinimize.value
}

const checkFile = (value) => {
  if (value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      fileData.value.push({
        folderId: null,
        description: '',
        file: value[i],
        loading: i === 0,
        warning: false,
        pending: i !== 0,
        error: false,
        success: false,
        message: null,
      })
    }
  }
}

watch(store.state.fileMultiple, (newVal) => {
  if (newVal.length > 0) {
    checkFile(newVal)
  }
})
</script>

<template>
  <div
    v-if="fileData.length > 0"
    class="fixed transition-all delay-150 flex flex-col bottom-0 drop-shadow-2xl z-10 max-w-xs sm:max-w-md mx-auto min-w-24 rounded-t-2xl left-0 right-16 sm:right-0 dark:shadow-blue-400 shadow-lg"
  >
    <div class="bg-base-100 border w-full border-base-300 mx-auto dark:border-none rounded-t-2xl">
      <div
        class="btn border-0 btn-sm m-0 w-full rounded-t-2xl rounded-b-none bg-orange-200 overflow-y-auto text-center text-orange-600 dark:bg-blue-600/50 dark:text-blue-400 cursor-pointer"
        @click="minimizeFn"
      >
        klik untuk {{ toggleMinimize ? 'minimize' : 'maximize' }}
      </div>
      <transition
        enter-active-class="ease-in duration-500"
        enter-from-class="opacity-0 translate-y-36"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="ease-out duration-300"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-36"
      >
        <div v-show="toggleMinimize" class="max-h-80 min-h-12 overflow-y-auto overflow-x-hidden">
          <div class="flex sticky justify-end px-4 py-2 w-full">
            <button class="btn btn-success text-base-100">
              <iconify icon="solar:upload-square-broken" height="1.8em" />
              Upload
            </button>
          </div>
          <ul class="menu py-4">
            <li v-for="(item, index) in fileData" :key="index" :data-tip="item.file['name']" class="tooltip break-words">
              <div>
                <iconify
                  icon="solar:file-send-bold-duotone"
                  class="text-orange-500 dark:text-blue-600"
                  height="1.8em"
                />
                <span class="text-sm font-medium truncate max-w-2xl min-w-24"
                  >{{ item.file['name'] }}
                </span>
                <div class="ml-2 group">
                  <iconify v-if="item.loading" icon="svg-spinners:90-ring-with-bg" class="text-info" height="1.8em" />
                  <iconify v-if="item.pending" icon="solar:clock-circle-bold-duotone" class="text-primary" height="1.8em" />
                  <iconify v-if="item.error" icon="solar:danger-triangle-bold" class="text-red-600" height="1.8em" />
                  <span v-if="item.message !== null"
                    class="absolute z-10 right-[10%] top-0 max-h-48 mb-40 bg-error hidden group-hover:block rounded max-w-[80%] h-auto py-2 px-3 break-words text-white"
                    >Toast sekarang bisa Toastsekarangbisatampildenganberbagaitipe</span
                  >
                </div>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped></style>

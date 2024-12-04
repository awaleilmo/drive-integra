<script setup>
import {ref} from 'vue'
import {useStore} from "vuex";
import MenuAdd from "~/components/MenuAdd.vue";

// data
const active = ref(false)
const store = useStore()

const close = () => {
  active.value = false
}
</script>

<template>
  <div
    class="fixed flex flex-col bottom-4 z-20 right-2 md:bottom-10 md:right-10 transition-all group"
  >
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="active" class="fixed inset-0 transform transition-all" @click="close">
        <div class="absolute inset-0" />
      </div>
    </transition>
    <MenuAdd :active="active" @close="close" class="z-50" />
    <div
      class="btn btn-success btn-circle btn-lg ml-auto transform shadow-lg"
      :class="store.state.onUpload ? 'btn-disabled' : ''"
      @click="active = !active"
    >
      <iconify height="3em" class="text-base-100" icon="solar:add-circle-broken" />
    </div>
  </div>


</template>

<style scoped></style>

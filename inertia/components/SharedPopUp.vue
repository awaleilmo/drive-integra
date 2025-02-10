<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import Modal from '~/components/Modal.vue'
import folderService from '~/services/folder.service.ts'
import userService from '~/services/user.service.ts'

const store = useStore()
const isLoading = ref(true)
const show = computed(() => store.state.sharedPopup.show ?? false)
const data = computed(() => store.state.sharedPopup.data ?? [])
const selected = ref([])
const modelSharedUser = ref([])

const loadItems = () => {
  const payload = data.value
  if (payload.length <= 1) {
    selected.value = [0]
  }
  loadUsers()
}

const loadUsers = async () => {
  for (const item of data.value) {
    const index = data.value.indexOf(item)
    const res = await userService.showUserBatch(item.data.sharedWithUsers)
    if (res.status) {
      data.value[index].sharedUser = res.data
    } else {
      data.value[index].sharedUser = []
    }
  }
  isLoading.value = false
}

const closeModal = () => {
  store.dispatch('setSharedPopupShow', false)
}

const toggleCheckedAll = () => {
  if (selected.value.length === data.value.length) {
    selected.value = []
  } else {
    selected.value = data.value.map((item, index) => index)
  }
}

const toggleChecked = (index) => {
  if (selected.value.includes(index)) {
    selected.value = selected.value.filter((item) => item !== index)
  } else {
    selected.value.push(index)
  }
}

const save = () => {
  data.value.forEach(async (item, index) => {
    if (selected.value.includes(index)) {
      let payload = {
        sharedWithUsers: [2, 3],
      }
      const res = await folderService.sharedPost(item.data.id, payload)
      console.log(res)
    }
  })
  store.dispatch('setSharedPopupShow', false)
}

watch(
  show,
  () => {
    if (show.value) {
      loadItems()
    }
  },
  { deep: true }
)
</script>

<template>
  <modal :show="show" @close="closeModal" maxWidth="5xl">
    <div class="py-6 px-6 flex flex-col items-start justify-start">
      <div class="flex flex-row items-center justify-between w-full">
        <label class="text-xl text-start font-medium">Kelola Akses</label>
        <div class="flex gap-2">
          <button class="btn btn-primary btn-sm">Add</button>
          <button class="btn btn-success btn-sm" @click="save">Save</button>
        </div>
      </div>
      <div class="overflow-y-auto w-full border-t mt-6">
        <table class="table w-full" v-if="!isLoading">
          <!-- head -->
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    class="checkbox"
                    :checked="selected.length === data.length"
                    @change="toggleCheckedAll"
                  />
                </label>
              </th>
              <th>Nama</th>
              <th>Kelola Akses</th>
            </tr>
          </thead>
          <tbody>
            <!-- row -->
            <tr v-for="(item, index) in data" :key="item.id">
              <th class="w-7">
                <label>
                  <input
                    type="checkbox"
                    class="checkbox"
                    :checked="selected.includes(index)"
                    @change="toggleChecked(index)"
                  />
                </label>
              </th>
              <td class="w-2/3">
                <div class="font-bold">{{ item.data.folderName || item.data.fileName }}</div>
              </td>
              <td class="flex w-2/6 gap-2">
                <div class="flex flex-col gap-2">
                  <div
                    v-for="users in item.sharedUser"
                    class="badge badge-ghost badge-sm gap-2 flex justify-between"
                  >
                    <span> {{ users.email }} </span>
                    <button class="btn btn-xs tooltip" data-tip="Hapus akses">X</button>
                  </div>
                </div>
                <button class="btn btn-ghost btn-xs tooltip" data-tip="Edit">
                  <iconify
                    icon="solar:pen-2-bold-duotone"
                    class="font-bold text-orange-400 dark:text-blue-600"
                    height="1.8em"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </modal>
</template>

<style scoped></style>

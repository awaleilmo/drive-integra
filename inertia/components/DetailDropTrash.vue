<script setup>
import { computed, onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import uploadService from '~/services/upload.service'
import folderService from '~/services/folder.service'

const props = defineProps({
  align: {
    type: String,
    default: 'right',
  },
  width: {
    type: String,
    default: '48',
  },
  contentClasses: {
    type: String,
    default: 'py-1 bg-white',
  },
  data: {
    type: Object,
    default: {},
  },
  isFile: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()

const closeOnEscape = (e) => {
  if (open.value && e.key === 'Escape') {
    open.value = false
  }
}

onMounted(() => document.addEventListener('keydown', closeOnEscape))
onUnmounted(() => document.removeEventListener('keydown', closeOnEscape))

const widthClass = computed(() => {
  return {
    48: 'w-48',
  }[props.width.toString()]
})

const alignmentLRClasses = computed(() => {
  if (dropdownPositionClass.value === 'left') {
    return 'right-7'
  } else if (dropdownPositionClass.value === 'right') {
    return 'right-0'
  } else {
    return ''
  }
})

const alignmentTBClasses = computed(() => {
  if (dropdownBTPositionClass.value === 'top') {
    return 'top-7'
  } else if (dropdownBTPositionClass.value === 'bottom') {
    return 'bottom-9'
  } else {
    return 'top-7'
  }
})

const open = ref(false)

const dropdownButton = ref(null)
const dropdownMenu = ref(null)
const dropdownPositionClass = ref(props.align)
const dropdownBTPositionClass = ref(top)
const subDropdownPositionClass = ref(props.align)

const toggle = () => {
  open.value = !open.value
  nextTick(() => {
    if (open.value) {
      adjustDropdownPosition()
    }
  })
}

const adjustDropdownPosition = () => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const { right, left, top, bottom } = dropdownButton.value.getBoundingClientRect()

  dropdownPositionClass.value = right + 350 > screenWidth ? 'left' : 'right'
  subDropdownPositionClass.value = right + 350 > screenWidth ? 'left' : 'right'
  dropdownBTPositionClass.value = bottom + 350 > screenHeight ? 'bottom' : 'top'
}

watch(open, (newVal) => {
  if (newVal) {
    adjustDropdownPosition()
  }
})

const recoveryFn = async () => {
  await store.dispatch('showLoading')
  try {
    const data = props.isFile
      ? await uploadService.recoveryFile(props.data.id)
      : await folderService.recoveryFolder(props.data.id)
    if (data.status) {
      await store.dispatch('triggerToast', { message: data.message, type: 'success' })
      await store.dispatch('setLoadFile', true)
      await toggle()
    } else {
      await store.dispatch('triggerToast', { message: data.message, type: 'error' })
    }
  } catch (error) {
    await store.dispatch('triggerToast', { message: error.message, type: 'error' })
  }
  await store.dispatch('hideLoading')
}
</script>

<template>
  <div class="relative inline-block text-left">
    <div @click="toggle" ref="dropdownButton">
      <Iconify
        icon="solar:menu-dots-bold"
        class="rotate-90 grow-0 hover:cursor-pointer btn btn-ghost btn-circle btn-xs"
      />
    </div>

    <!-- Full Screen Dropdown Overlay -->
    <div v-show="open" class="fixed inset-0 z-40 aspect-square" @click="open = false"></div>
    <div
      v-if="open"
      class="absolute z-50 mt-2"
      ref="dropdownMenu"
      :class="[widthClass, alignmentLRClasses, alignmentTBClasses]"
    >
      <ul class="menu bg-base-200 rounded-box z-[1] w-60 p-2 shadow">
        <li @click="recoveryFn">
          <a>
            <iconify
              icon="solar:history-bold-duotone"
              class="font-bold text-orange-400 dark:text-blue-600"
              height="1.8em"
            />
            Pulihkan
          </a>
        </li>
        <li>
          <a>
            <iconify
              icon="solar:trash-bin-trash-bold-duotone"
              class="font-bold text-orange-400 dark:text-blue-600"
              height="1.8em"
            />Hapus Selamanya
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

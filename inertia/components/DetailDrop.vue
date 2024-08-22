<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

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
})

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

const alignmentClasses = computed(() => {
    if (props.align === 'left') {
        return 'origin-top-left left-0'
    } else if (props.align === 'right') {
        return 'origin-top-right right-0'
    } else {
        return 'origin-top'
    }
})

const open = ref(false)
</script>

<template>
    <div class="relative">
        <div @click="open = !open">
            <Iconify icon="solar:menu-dots-bold"
                class="rotate-90 grow-0 hover:cursor-pointer btn btn-ghost btn-circle btn-xs" />
        </div>

        <!-- Full Screen Dropdown Overlay -->
        <div v-show="open" class="fixed inset-0 z-40" @click="open = false"></div>

        <transition enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-show="open" class="absolute z-50 mt-2" :class="[widthClass, alignmentClasses]">
                <ul class="menu bg-base-200 rounded-box z-[1] w-60 p-2 shadow">
                    <li>
                        <a>
                            <iconify icon="solar:download-bold-duotone" class="font-bold" height="1.8em" />
                            Download
                        </a>
                    </li>
                    <li>
                        <a>
                            <iconify icon="solar:pen-2-bold-duotone" class="font-bold" height="1.8em" />Ganti
                            Nama
                        </a>
                    </li>
                    <hr class="my-2" />
                    <li>
                        <a>
                            <iconify icon="solar:share-bold-duotone" class="font-bold" height="1.8em" />Bagikan
                        </a>
                    </li>
                    <li class="dropdown dropdown-hover">
                        <a tabindex="0" role="button">
                            <iconify icon="solar:folder-open-bold-duotone" class="font-bold" height="1.8em" />
                            Atur
                            <iconify icon="solar:alt-arrow-right-bold" class="font-bold" height="1.2em" />
                        </a>
                        <ul tabindex="0" class="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-64">
                            <li>
                                <a href="#">
                                    <iconify icon="solar:move-to-folder-bold-duotone" class="font-bold" height="1.8em" />
                                    Pindahkan
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <iconify icon="solar:star-outline" class="font-bold" height="1.8em" />
                                    Tambahkan ke berbintang
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a>
                            <iconify icon="solar:info-circle-bold-duotone" class="font-bold" height="1.8em" />
                            Informasi folder
                        </a>
                    </li>
                    <hr class="my-2" />
                    <li>
                        <a>
                            <iconify icon="solar:trash-bin-trash-bold-duotone" class="font-bold" height="1.8em" />
                            Pindahkan ke sampah
                        </a>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

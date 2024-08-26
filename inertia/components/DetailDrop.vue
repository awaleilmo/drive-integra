<script setup>
import { computed, onMounted, onUnmounted, ref, nextTick, watch } from 'vue'

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


const alignmentLRSubDropdown = computed(() => {
    if (subDropdownPositionClass.value === 'left') {
        return 'dropdown-left'
    } else if (subDropdownPositionClass.value === 'right') {
        return 'dropdown-right'
    } else {
        return ''
    }
})

const open = ref(false)

const dropdownButton = ref(null);
const dropdownMenu = ref(null);
const dropdownPositionClass = ref(props.align);
const dropdownBTPositionClass = ref(top);
const subDropdownPositionClass = ref(props.align);

const toggle = () => {
    open.value = !open.value
    nextTick(() => {
        if (open.value) {
            adjustDropdownPosition();
        }
    });
}

const adjustDropdownPosition = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const { right, left, top, bottom } = dropdownButton.value.getBoundingClientRect();

    dropdownPositionClass.value = ( right + 350 ) >  screenWidth ? 'left' : 'right';
    subDropdownPositionClass.value = ( right + 350 ) >  screenWidth ? 'left' : 'right';
    dropdownBTPositionClass.value = ( bottom + 350 ) > screenHeight  ? 'bottom' : 'top';

};

watch(open, (newVal) => {
    if (newVal) {
        adjustDropdownPosition();
    }
});

</script>

<template>
    <div class="relative inline-block text-left">
        <div @click="toggle" ref="dropdownButton">
            <Iconify icon="solar:menu-dots-bold"
                class="rotate-90 grow-0 hover:cursor-pointer btn btn-ghost btn-circle btn-xs" />
        </div>

        <!-- Full Screen Dropdown Overlay -->
        <div v-show="open" class="fixed inset-0 z-40" @click="open = false"></div>
        <div v-if="open" class="absolute z-50 mt-2" ref="dropdownMenu" :class="[widthClass, alignmentLRClasses, alignmentTBClasses]">
            <ul class="menu bg-base-200 rounded-box z-[1] w-60 p-2 shadow ">
                <li>
                    <a>
                        <iconify icon="solar:download-bold" class="font-bold text-orange-400 dark:text-blue-600" height="1.8em" />
                        Download
                    </a>
                </li>
                <li>
                    <a>
                        <iconify icon="solar:pen-2-bold-duotone" class="font-bold text-orange-400 dark:text-blue-600" height="1.8em" />Ganti
                        Nama
                    </a>
                </li>
                <hr class="my-2" />
                <li>
                    <a>
                        <iconify icon="solar:share-bold-duotone" class="font-bold text-orange-400 dark:text-blue-600" height="1.8em" />Bagikan
                    </a>
                </li>
                <li class="dropdown" :class="[alignmentLRSubDropdown]">
                    <a tabindex="0" role="button">
                        <iconify icon="solar:folder-open-bold-duotone" class="font-bold text-orange-400 dark:text-blue-600" height="1.8em" />
                        Atur
                        <iconify icon="solar:alt-arrow-right-bold" class="font-bold text-orange-400 dark:text-blue-600" height="1.2em" />
                    </a>
                    <ul tabindex="0" ref="subDropdownButton"
                        class="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-64" 
                        :class="[subDropdownPositionClass ===  'left' ? 'mr-4' : '']">


                        <li>
                            <a href="#">
                                <iconify icon="solar:move-to-folder-bold-duotone" class="font-bold text-orange-400 dark:text-blue-600" height="1.8em" />
                                Pindahkan
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <iconify icon="solar:star-outline" class="font-bold text-orange-400 dark:text-blue-600" height="1.8em" />
                                Tambahkan ke berbintang
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a>
                        <iconify icon="solar:info-circle-bold" class="font-bold text-orange-400 dark:text-blue-600" height="1.8em" />
                        Informasi folder
                    </a>
                </li>
                <hr class="my-2" />
                <li>
                    <a>
                        <iconify icon="solar:trash-bin-trash-bold-duotone" class="font-bold text-orange-400 dark:text-blue-600" height="1.8em" />
                        Pindahkan ke sampah
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

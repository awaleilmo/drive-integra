<script setup>
import {onBeforeMount, ref} from "vue";

const theme = ref('dim');

const dataTheme = ref([
    {value: 'light', text: 'light', active: false},
    {value: 'dark', text: 'dark', active: false},
    {value: 'cupcake', text: 'cupcake', active: false},
    {value: 'bumblebee', text: 'bumblebee', active: false},
    {value: 'emerald', text: 'emerald', active: false},
    {value: 'corporate', text: 'corporate', active: false},
    {value: 'synthwave', text: 'synthwave', active: false},
    {value: 'retro', text: 'retro', active: false},
    {value: 'cyberpunk', text: 'cyberpunk', active: false},
    {value: 'valentine', text: 'valentine', active: false},
    {value: 'halloween', text: 'halloween', active: false},
    {value: 'garden', text: 'garden', active: false},
    {value: 'forest', text: 'forest', active: false},
    {value: 'aqua', text: 'aqua', active: false},
    {value: 'lofi', text: 'lofi', active: false},
    {value: 'pastel', text: 'pastel', active: false},
    {value: 'fantasy', text: 'fantasy', active: false},
    {value: 'wireframe', text: 'wireframe', active: false},
    {value: 'black', text: 'black', active: false},
    {value: 'luxury', text: 'luxury', active: false},
    {value: 'dracula', text: 'dracula', active: false},
    {value: 'cmyk', text: 'cmyk', active: false},
    {value: 'autumn', text: 'autumn', active: false},
    {value: 'business', text: 'business', active: false},
    {value: 'acid', text: 'acid', active: false},
    {value: 'lemonade', text: 'lemonade', active: false},
    {value: 'night', text: 'night', active: false},
    {value: 'coffee', text: 'coffee', active: false},
    {value: 'winter', text: 'winter', active: false},
    {value: 'dim', text: 'dim', active: false},
    {value: 'nord', text: 'nord', active: false},
    {value: 'sunset', text: 'sunset', active: false},
])
const changeTheme = (val) => {
    theme.value = val
    localStorage.setItem('theme', val)
    window.location.reload()
}
onBeforeMount(() => {
    const rawTheme = localStorage.getItem('theme')
    theme.value = rawTheme ?? 'dim'
    if (rawTheme === null) {
        localStorage.setItem('theme', 'dim')
    }
})
</script>

<template>
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn m-1">
            Theme
            <svg width="12px" height="12px" class="h-2 w-2 fill-current opacity-60 inline-block"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
        </div>
        <ul tabindex="0"
            class="m-1 dropdown-content z-[1] p-2 shadow shadow-info/50 bg-base-300 rounded-box w-96 h-96 overflow-y-auto overflow-x-hidden">
            <li v-for="item in dataTheme" :key="item">
                <button class="outline-base-content text-start outline-offset-4 p-2 w-full"
                        @click="changeTheme(item.value)"
                        data-set-theme="light">
                    <span :data-theme="item.value"
                          class="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans">
                        <span
                            class="grid grid-cols-5 grid-rows-3">
                            <span
                                class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                <font-awesome-icon v-if="theme === item.value" icon="fa-solid fa-circle-check" class="mx-1"/>
                                <span
                                    class="flex-grow text-sm Capitalize">{{ item.text }}</span>
                                <span
                                    class="flex h-full shrink-0 flex-wrap gap-1">
                                    <span
                                        class="bg-primary rounded-badge w-2"></span>
                                    <span
                                        class="bg-secondary rounded-badge w-2"></span>
                                    <span
                                        class="bg-accent rounded-badge w-2"></span>
                                    <span
                                        class="bg-neutral rounded-badge w-2"></span>
                                </span>
                            </span>
                        </span>
                    </span>
                </button>
            </li>
        </ul>
    </div>
</template>

<style scoped>

</style>

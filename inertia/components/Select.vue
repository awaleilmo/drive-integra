<script setup>
import {ref} from 'vue';

defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    data: {
        type: Array,
    }
});

defineEmits(['update:modelValue']);

const input = ref(null);

defineExpose({focus: () => input.value.focus()});
</script>

<template>
    <select
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="select capitalize w-full select-bordered" data="" model-value="">
        <option v-for="item in data" :key="item" :value="item.id">
            <div class="capitalize">
            {{ item.name }}
            </div>
        </option>
    </select>
</template>

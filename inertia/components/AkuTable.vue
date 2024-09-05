<script setup>
import { onBeforeMount, ref, defineExpose } from 'vue'
import Loading from './Loading.vue'
import { usePage } from '@inertiajs/vue3'
import axios from 'axios'
import sysService from '../Service/sys.service'

const props = defineProps({
  columns: {
    type: Array,
    default: [],
  },
  urls: {
    type: String,
    default: '',
  },
  defaultSortField: {
    type: String,
    default: 'name',
  },
  defaultSortType: {
    type: String,
    default: 'desc',
  },
})
const isLoading = ref(false)
const totalRecords = ref(0)
const rows = ref([])
const page = ref(1)
const perPage = ref(10)
const sortField = ref(props.defaultSortField)
const sortType = ref(props.defaultSortType)
const searchQuery = ref('')

const loadItems = async () => {
  isLoading.value = true
  const response = await axios.get('/api/' + props.urls, {
    params: {
      page: page.value,
      perPage: perPage.value,
      sortField: sortField.value,
      sortType: sortType.value,
      searchQuery: searchQuery.value,
    },
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + sysService.token(),
    },
  })
  rows.value = response.data.data
  totalRecords.value = response.data.meta.total
  isLoading.value = false
}

const onPageChange = (params) => {
  page.value = params.currentPage
  loadItems()
}
const onPerPageChange = (params) => {
  perPage.value = params.currentPerPage
  loadItems()
}
const onSortChange = (params) => {
  sortField.value = params[0].field
  sortType.value = params[0].type
  loadItems()
}
const onSearch = (params) => {
  page.value = 1
  searchQuery.value = params.searchTerm
  loadItems()
}
onBeforeMount(() => {
  loadItems()
})

defineExpose({ loadItems })
</script>

<template>
  <div class="z-10">
    <vue-good-table
      mode="remote"
      :totalRows="totalRecords"
      :isloading="isLoading"
      :columns="columns"
      :line-numbers="true"
      :search-options="{
        enabled: true,
        placeholder: 'Search this table, and press enter',
        trigger: 'enter',
      }"
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: perPage,
        setCurrentPage: page,
        perPageDropdown: [2, 10, 20, 30, 40, 50],
      }"
      :sortable="true"
      :sort-options="{
        enable: true,
        multipleColumns: false,
      }"
      @page-change="onPageChange"
      @per-page-change="onPerPageChange"
      @sortChange="onSortChange"
      @search="onSearch"
      @load="loadItems"
      :rows="rows"
      theme="nocturnal"
    >
      <template #table-row="props">
        <slot name="table-row" v-bind="props"></slot>
      </template>
      <template #table-column="props">
        <slot name="table-column" v-bind="props"></slot>
      </template>
      <template #column-filter="props">
        <slot name="column-filter" v-bind="props"></slot>
      </template>
      <template #emptystate="props">
        <slot name="emptystate" v-bind="props">This will show up when there are no rows</slot>
      </template>
    </vue-good-table>
  </div>
  <loading :loading="isLoading" />
</template>

<style scoped></style>

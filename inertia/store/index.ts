import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
    showToast: false,
    toastMessage: '',
    toastType: 'info',
    fileMultiple: [],
    onUpload: false,
    loadFile: false,
    sideDetail: false,
    sideDetailData: {},
  },
  getters: {
    isLoading: (state: any) => state.isLoading,
    showToast: (state: any) => state.showToast,
    toastMessage: (state: any) => state.toastMessage,
    toastType: (state: any) => state.toastType,
    fileMultiple: (state: any) => state.fileMultiple,
    onUpload: (state: any) => state.onUpload,
    loadFile: (state: any) => state.loadFile,
    sideDetail: (state: any) => state.sideDetail,
    sideDetailData: (state: any) => state.sideDetailData,
  },
  mutations: {
    setLoading(state: any, status: any): void {
      state.isLoading = status
    },
    SET_FILE_MULTIPLE(state: any, files: any): void {
      state.fileMultiple = files
    },
    SET_TOAST(state: any, { message, type }: any): void {
      state.showToast = true
      state.toastMessage = message
      state.toastType = type || 'info'

      localStorage.setItem('showToast', String(true))
      localStorage.setItem('toastMessage', message)
      localStorage.setItem('toastType', type || 'info')
    },
    HIDE_TOAST(state: any): void {
      state.showToast = false
      state.toastMessage = ''
      state.toastType = 'info'

      localStorage.removeItem('showToast')
      localStorage.removeItem('toastMessage')
      localStorage.removeItem('toastType')
    },
    SET_ON_UPLOAD(state: any, status: boolean): void {
      state.onUpload = status
    },
    SET_LOAD_FILE(state: any, status: boolean): void {
      state.loadFile = status
    },
    SET_SIDE_DETAIL(state: any, status: boolean): void {
      state.sideDetail = status
    },
    SET_SIDE_DETAIL_DATA(state: any, data: any): void {
      state.sideDetailData = data
    },
  },
  actions: {
    showLoading({ commit }: any): void {
      commit('setLoading', true)
    },
    setFileMultiple({ commit }: any, files: any): void {
      commit('SET_FILE_MULTIPLE', files)
    },
    hideLoading({ commit }: any): void {
      commit('setLoading', false)
    },
    triggerToast({ commit }: any, { message, type }: any): void {
      commit('SET_TOAST', { message, type })
    },
    hideToast({ commit }: any): void {
      commit('HIDE_TOAST')
    },
    setOnUpload({ commit }: any, status: boolean): void {
      commit('SET_ON_UPLOAD', status)
    },
    setLoadFile({ commit }: any, status: boolean): void {
      commit('SET_LOAD_FILE', status)
    },
    setSideDetail({ commit }: any, status: boolean): void {
      commit('SET_SIDE_DETAIL', status)
    },
    setSideDetailData({ commit }: any, data: any): void {
      commit('SET_SIDE_DETAIL_DATA', data)
    },
  },
})

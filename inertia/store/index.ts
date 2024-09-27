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
  },
  getters: {
    isLoading: (state: any) => state.isLoading,
    showToast: (state: any) => state.showToast,
    toastMessage: (state: any) => state.toastMessage,
    toastType: (state) => state.toastType,
    fileMultiple: (state) => state.fileMultiple,
    onUpload: (state) => state.onUpload,
    loadFile: (state) => state.loadFile,
  },
  mutations: {
    setLoading(state: any, status: any) {
      state.isLoading = status
    },
    SET_FILE_MULTIPLE(state: any, files: any) {
      state.fileMultiple = files
    },
    SET_TOAST(state, { message, type }) {
      state.showToast = true
      state.toastMessage = message
      state.toastType = type || 'info'

      localStorage.setItem('showToast', true)
      localStorage.setItem('toastMessage', message)
      localStorage.setItem('toastType', type || 'info')
    },
    HIDE_TOAST(state) {
      state.showToast = false
      state.toastMessage = ''
      state.toastType = 'info'

      localStorage.removeItem('showToast')
      localStorage.removeItem('toastMessage')
      localStorage.removeItem('toastType')
    },
    SET_ON_UPLOAD(state, status) {
      state.onUpload = status
    },
    SET_LOAD_FILE(state, status) {
      state.loadFile = status
    },
  },
  actions: {
    showLoading({ commit }) {
      commit('setLoading', true)
    },
    setFileMultiple({ commit }, files) {
      commit('SET_FILE_MULTIPLE', files)
    },
    hideLoading({ commit }) {
      commit('setLoading', false)
    },
    triggerToast({ commit }, { message, type }) {
      commit('SET_TOAST', { message, type })
    },
    hideToast({ commit }) {
      commit('HIDE_TOAST')
    },
    setOnUpload({ commit }, status) {
      commit('SET_ON_UPLOAD', status)
    },
    setLoadFile({ commit }, status) {
      commit('SET_LOAD_FILE', status)
    },
  },
})

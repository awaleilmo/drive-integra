import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
    showToast: false,
    toastMessage: '',
    toastType: 'info',
    fileMultiple: [],
  },
  getters: {
    isLoading: (state: any) => state.isLoading,
    showToast: (state: any) => state.showToast,
    toastMessage: (state: any) => state.toastMessage,
    toastType: (state) => state.toastType,
    fileMultiple: (state) => state.fileMultiple,
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
  },
})

import { createStore } from "vuex";

export default createStore({
  state: {
    isLoading: false,
    showToast: false,
    toastMessage: "",
    toastType: "info",
  },
  getters: {
    isLoading: (state: any) => state.isLoading,
    showToast: (state: any) => state.showToast,
    toastMessage: (state: any) => state.toastMessage,
    toastType: (state) => state.toastType,
  },
  mutations: {
    setLoading(state: any, status: any) {
      state.isLoading = status;
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
      commit("setLoading", true);
    },
    hideLoading({ commit }) {
      commit("setLoading", false);
    },
    triggerToast({ commit }, {message, type}) {
      commit('SET_TOAST',{message, type})
    },
    hideToast({ commit }) {
      commit('HIDE_TOAST')
    },
  },
});

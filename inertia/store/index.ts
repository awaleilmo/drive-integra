import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      isLoading: false,
    }
  },
  mutations: {
    setLoading(state: any, status: any) {
      state.isLoading = status
    },
  },
  actions: {
    showLoading({ commit }) {
      commit('setLoading', true)
    },
    hideLoading({ commit }) {
      commit('setLoading', false)
    },
  },
  getters: {
    isLoading: (state: any) => state.isLoading,
  },
})

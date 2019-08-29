import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedToken: -1
  },
  mutations: {
    UPDATE_SELECTED_TOKEN: (state, tokenId) => {
      state.selectedToken = tokenId;
    }
  },
  actions: {
    setSelectedToken: ({ commit }, tokenId) => {
      commit('UPDATE_SELECTED_TOKEN', tokenId);
    }
  }
});

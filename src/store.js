import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedNFTs: -1
  },
  mutations: {
    UPDATE_SELECTED_NFTS: (state, nfts) => {
      state.selectedNFTs = nfts;
    }
  },
  actions: {
    setSelectedNFTs: ({ commit }, nfts) => {
      commit("UPDATE_SELECTED_NFTS", nfts);
    }
  }
});

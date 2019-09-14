<template>
  <div>
    <vue-select-image
      :dataImages="this.nfts"
      :is-multiple="true"
      w="180px"
      h="240px"
      @onselectmultipleimage="onSelectNFTs"
    ></vue-select-image>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import VueSelectImage from "vue-select-image";
import "vue-select-image/dist/vue-select-image.css";

export default {
  name: "NFTSelector",

  components: {
    VueSelectImage
  },

  // NOTE: list of {'id', 'src', 'alt'}
  props: ["nfts"],

  methods: {
    ...mapActions(["setSelectedNFTs"]),

    onSelectNFTs(nfts) {
      this.setSelectedNFTs(nfts);
    }
  }
};
</script>

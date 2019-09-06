<template>
  <div>
    <vue-select-image
      :dataImages="this.nfts"
      :is-multiple="true"
      w="180px"
      h="auto"
      @onselectmultipleimage="onSelectNFTs"
    ></vue-select-image>
  </div>
</template>

<script>
import VueSelectImage from "vue-select-image";
import "vue-select-image/dist/vue-select-image.css";

export default {
  name: "NFTSelector",

  components: {
    VueSelectImage
  },

  // NOTE: list of {'id', 'imageUrl'}
  props: ["nfts"],

  methods: {
    onSelectNFTs(nfts) {
      console.log(nfts);
    }
  }
};
</script>

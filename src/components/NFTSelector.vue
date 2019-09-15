<template>
  <div>
    <vue-select-image
      :dataImages="this.nfts"
      :is-multiple="true"
      :use-label="true"
      w="180px"
      h="240px"
      @onselectmultipleimage="onSelectNFTs"
    ></vue-select-image>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "NFTSelector",

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

<style>
.vue-select-image__item {
  margin-bottom: 24px;
}
.vue-select-image__thumbnail {
  cursor: pointer;
}
.vue-select-image__thumbnail--selected {
  background-color: #b79afc;
}
.vue-select-image__lbl {
  text-align: center;
}
.vue-select-image__lbl .label {
  width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
</style>

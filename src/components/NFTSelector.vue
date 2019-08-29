<template>
  <div>
    <NFT v-for="nft of this.nfts" v-bind:key="nft.tokenId" :nft="nft" />
  </div>
</template>

<script>
import NFT from "@/components/NFT.vue";

export default {
  name: "NFTSelector",
  components: {
    NFT
  },

  // NOTE: list of {'tokenId', 'imageUrl'}
  props: ["nfts"],

  data() {
    return {};
  }
};
</script>

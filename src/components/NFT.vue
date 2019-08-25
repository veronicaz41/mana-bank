<template>
  <div @click="setSelectedToken(nft.tokenId)">
    <div>
      <img v-bind:src="this.cwImageUrl" alt="nft image">
    </div>
    <div>
      {{ this.nft.tokenId }}
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "NFT",

  // NOTE: {'tokenId', 'imageUrl'}
  props: ["nft"],

  computed: {
    cwImageUrl() {
      return `https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/${this.nft.tokenId}.svg`;
    }
  },

  methods: {
    ...mapActions(["setSelectedToken"])
  },

  data() {
    return {
    };
  }
};
</script>

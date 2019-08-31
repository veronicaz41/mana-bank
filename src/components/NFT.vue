<template>
  <div @click="setSelectedToken(nft.id)">
    <div>
      <img v-bind:src="this.imageUrl" alt="cheeze wizard image">
    </div>
    <div>
      {{ this.nft.id }}
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "NFT",

  // NOTE: {'id', 'image_url'}
  props: ["nft"],

  computed: {
    imageUrl() {
      if (this.nft.image_url) {
        return this.nft.image_url;
      }
      return `https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/${this.nft.id}.svg`;
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

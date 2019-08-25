<template>
  <div @click="setSelectedToken(nft.tokenId)">
    <div>
      <img v-bind:src="this.nft.imageUrl" alt="nft image">
    </div>
    <div>
      {{ this.nft.tokenId }}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'NFT',

  // NOTE: {'tokenId', 'imageUrl'}
  props: ['nft'],

  methods:  {
    ...mapActions(['setSelectedToken'])

  },

  data() {
    return {
    };
  },
}
</script>

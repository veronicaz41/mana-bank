<template>
  <div>
    <div>
      <img v-bind:src="this.nft.imageUrl" alt="nft image">
    </div>
    <div>
      {{ this.nft.tokenId }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFT',

  // NOTE: {'tokenId', 'imageUrl'}
  props: ['nft'],

  data() {
    return {
    };
  },
}
</script>
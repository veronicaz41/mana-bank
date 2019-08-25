<template>
  <div>
    <div v-for="nft of nfts">
      {{ nft.imageUrl }}
    </div>
    Hello world
  </div>
</template>

<script>
export default {
  name: 'NFTSelector',

  // NOTE: list of {'tokenId', 'imageUrl'}
  props: ['nfts'],

  data() {
    return {
    };
  },
}
</script>

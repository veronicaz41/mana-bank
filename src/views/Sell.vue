<template>
  <NFTSelector :nfts="nfts"/>
</template>

<script>
import NFTSelector from '@/components/NFTSelector.vue';

export default {
  name: 'Sell',
  components: {
    NFTSelector
  },

  data() {
    return {
      nfts: [
        {
          tokenId: "0x234123",
          imageUrl: "https://www.cheezewizards.com/static/img/logo/mark.svg"
        },
        {
          tokenId: "0x23e234",
          imageUrl: "https://www.cheezewizards.com/static/img/logo/mark.svg"
        },
        {
          tokenId: "0x23e234",
          imageUrl: "https://www.cheezewizards.com/static/img/logo/mark.svg"
        }
      ]
    };
  },
}
</script>

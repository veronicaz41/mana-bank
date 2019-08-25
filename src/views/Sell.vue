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
      nfts: []
    };
  },
}
</script>

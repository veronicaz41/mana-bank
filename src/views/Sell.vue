<template>
  <div>
    <NFTSelector :nfts="nfts" />
  </div>
</template>

<script>
import NFTSelector from "@/components/NFTSelector.vue";
import { mapState } from "vuex";

export default {
  name: "Sell",
  components: {
    NFTSelector
  },

  computed: {
    ...mapState(["selectedToken"])
  },

  data() {
    return {
      nfts: [
        {
          tokenId: 2445,
        },
        {
          tokenId: 2446,
        },
        {
          tokenId: 2444,
        }
      ]
    };
  }
};
</script>

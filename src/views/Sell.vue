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
          tokenId: "0x234123",
          imageUrl: "https://www.cheezewizards.com/static/img/logo/mark.svg"
        },
        {
          tokenId: "0x23e234",
          imageUrl: "https://www.cheezewizards.com/static/img/logo/mark.svg"
        },
        {
          tokenId: "0x23d324w",
          imageUrl: "https://www.cheezewizards.com/static/img/logo/mark.svg"
        }
      ]
    };
  }
};
</script>

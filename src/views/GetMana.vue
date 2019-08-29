<template>
  <div>
    <b-container>

      <b-row>
        <b-col cols="9">
          <NFTSelector :nfts="nfts" />
        </b-col>

        <b-col cols="3">
          Get Mana button + description
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>

<script>
import NFTSelector from "@/components/NFTSelector.vue";
import { mapState } from "vuex";

export default {
  name: "GetMana",
  components: {
    NFTSelector
  },

  computed: {
    ...mapState(["selectedToken"])
  },

  data() {
    return {
      // TODO: include tokenType
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

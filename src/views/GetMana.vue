<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <NFTSelector :nfts="nfts" />
        </b-col>

        <b-col cols="3">Get Mana button + description</b-col>
      </b-row>
    </b-container>
    <div>{{ this.wizards.config }}</div>
    <br />
    <div>{{ this.kitties.config }}</div>
  </div>
</template>

<script>
import NFTSelector from "@/components/NFTSelector.vue";
import { mapState } from "vuex";
import axios from "axios";

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
          tokenId: 2445
        },
        {
          tokenId: 2446
        },
        {
          tokenId: 2444
        }
      ],
      wizards: null,
      kitties: null
    };
  },

  methods: {
    getWizards(owner) {
      axios
        .get("https://cheezewizards.alchemyapi.io/wizards", {
          params: {
            owner: owner
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-token": process.env.VUE_APP_CHEEZE_VERSE_API_KEY,
            "x-email": process.env.VUE_APP_CHEEZE_VERSE_EMAIL
          }
        })
        .then(response => (this.wizards = response));
    },

    getKitties(owner) {
      axios
        .get("https://public.api.cryptokitties.co/v1/kitties", {
          params: {
            owner_wallet_address: owner
          },
          headers: {
            "x-api-token": process.env.VUE_APP_KITTY_VERSE_API_TOKEN
          }
        })
        .then(response => (this.kitties = response));
    }
  },

  mounted() {
    const owner = "";
    this.getWizards(owner);
    this.getKitties(owner);
  }
};
</script>

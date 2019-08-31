<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <NFTSelector :nfts="wizards" />
          <NFTSelector :nfts="kitties" />
        </b-col>

        <b-col cols="3">Get Mana button + description</b-col>
      </b-row>
    </b-container>
    <div>{{ this.wizards }}</div>
    <br />
    <div>{{ this.kitties }}</div>
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
        .then(response => {
            this.wizards = response.data.wizards || []
        })
        .catch(error => {
          console.log(error)
        });
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
        .then(response => {
          // response.data { "limit": 12, "offset": 0, "kitties": [], "total": 0 }
          // TODO: paging
          this.kitties = response.data.kitties || []
        })
        .catch(error => {
          console.log(error)
        });
    }
  },

  mounted() {
    const owner = "0xF0128825b0c518858971d8521498769148137936";
    this.getWizards(owner);
    this.getKitties(owner);
  }
};
</script>

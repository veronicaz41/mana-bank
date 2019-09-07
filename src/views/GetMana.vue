<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <NFTSelector :nfts="nfts" />
        </b-col>
        <b-col cols="3">
          <div>Deposit {{this.selectedNFTs.length}} Wizards/Kitties</div>
          <b-button>Get MANA</b-button>
          <div>MANA is bla bla bla, a description of what MANA is. And then a link to about page.</div>
        </b-col>
      </b-row>
    </b-container>
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
    ...mapState(["selectedNFTs"])
  },

  data() {
    return {
      nfts: []
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
          let wizards = response.data.wizards || [];
          wizards.forEach(item => {
            let wizard = {
              id: item.id,
              src: `https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/${item.id}.svg`,
              alt: `Wizard ${item.id}`
            };
            this.nfts.push(wizard);
          });
        })
        .catch(error => {
          console.log(error);
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
          let kitties = response.data.kitties || [];
          console.log(kitties);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  created() {
    const owner = "0xF0128825b0c518858971d8521498769148137936";
    this.getWizards(owner);
    this.getKitties(owner);
  }
};
</script>

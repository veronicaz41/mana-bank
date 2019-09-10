<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <NFTSelector :nfts="nfts" />
        </b-col>
        <b-col cols="3">
          <div v-if="isDrizzleInitialized">
            <div v-if="this.wizardsNeedApproval">Approve Wizards</div>
            <div v-if="this.kittiesNeedApproval">Approve Kitties</div>
            <div>Deposit {{this.selectedNFTs.length}} Wizards/Kitties</div>
            <b-button @click="getMana">Get MANA</b-button>
            <div>MANA is bla bla bla, a description of what MANA is. And then a link to about page.</div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NFTSelector from "@/components/NFTSelector.vue";
import { mapGetters, mapState } from "vuex";
import axios from "axios";

export default {
  name: "GetMana",
  components: {
    NFTSelector
  },

  data() {
    return {
      nfts: [],
      wizardsNeedApproval: false,
      kittiesNeedApproval: false
    };
  },

  computed: {
    ...mapState(["selectedNFTs"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized", "drizzleInstance"]),
    ...mapGetters("accounts", ["activeAccount"])
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
              alt: `Wizard ${item.id}`,
              type: "wizard"
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
          kitties.forEach(item => {
            let kitty = {
              id: item.id,
              src: item.image_url,
              alt: `Kitty ${item.id}`,
              type: "kitty"
            };
            this.nfts.push(kitty);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    async getMana() {
      // TODO: this button should show loading when "isDrizzleInitialized()" is false
    }
  },

  created() {
    const owner = "0xF0128825b0c518858971d8521498769148137936";
    // const owner = this.activeAccount;
    this.getWizards(owner);
    this.getKitties(owner);
  },

  watch: {
    async selectedNFTs() {
      let found = this.selectedNFTs.find(item => item.type == "wizard");
      if (found) {
        let wizardAddress = this.drizzleInstance.contracts.WizardPresale.options
          .address;
        let isWizardsApproved = await this.drizzleInstance.contracts.WizardPresale.methods[
          "isApprovedForAll"
        ](this.activeAccount, wizardAddress).call();
        this.wizardsNeedApproval = !isWizardsApproved;
      } else {
        this.wizardsNeedApproval = false;
      }

      found = this.selectedNFTs.find(item => {
        item.type == "kitty";
      });
      if (found) {
        let kittyAddress = this.drizzleInstance.contracts.KittyCore.options
          .address;
        let isKittiesApproved = await this.drizzleInstance.contracts.KittyCore.methods[
          "isApprovedForAll"
        ](this.activeAccount, kittyAddress).call();
        this.kittiesNeedApproval = !isKittiesApproved;
      } else {
        this.kittiesNeedApproval = false;
      }
    }
  }
};
</script>

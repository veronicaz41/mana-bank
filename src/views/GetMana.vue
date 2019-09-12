<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <NFTSelector :nfts="nfts" />
        </b-col>
        <b-col cols="3">
          <div v-if="isDrizzleInitialized">
            <div v-if="this.wizardsNeedApproval">
              <p>Please approve us to manage your wizards assets</p>
              <b-button @click="approveWizards">Approve wizards</b-button>
            </div>
            <div v-if="this.kittiesNeedApproval">
              <p>Please approve us to manage your wizards assets</p>
              <b-button @click="approveKitties">Approve kitties</b-button>
            </div>
            <div>
              <p>Deposit {{this.selectedNFTs.length}} Wizards/Kitties</p>
              <b-button @click="getMana">Get MANA</b-button>
            </div>
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
      // axios
      //   .get("https://cheezewizards.alchemyapi.io/wizards", {
      //     params: {
      //       owner: owner
      //     },
      //     headers: {
      //       "Content-Type": "application/json",
      //       "x-api-token": process.env.VUE_APP_CHEEZE_VERSE_API_KEY,
      //       "x-email": process.env.VUE_APP_CHEEZE_VERSE_EMAIL
      //     }
      //   })
      //   .then(response => {
      //     let wizards = response.data.wizards || [];
      //     wizards.forEach(item => {
      //       let wizard = {
      //         id: item.id,
      //         src: `https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/${item.id}.svg`,
      //         alt: `Wizard ${item.id}`,
      //         type: "wizard"
      //       };
      //       this.nfts.push(wizard);
      //     });
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // For testing
      const wizards = [
        {
          id: 1,
          src:
            "https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/1.svg"
        },
        {
          id: 2,
          src:
            "https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/2.svg"
        },
        {
          id: 3,
          src:
            "https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/3.svg"
        },
        {
          id: 4,
          src:
            "https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/4.svg"
        }
      ];
      this.nfts.push(...wizards);
    },

    getKitties(owner) {
      // axios
      //   .get("https://public.api.cryptokitties.co/v1/kitties", {
      //     params: {
      //       owner_wallet_address: owner
      //     },
      //     headers: {
      //       "x-api-token": process.env.VUE_APP_KITTY_VERSE_API_TOKEN
      //     }
      //   })
      //   .then(response => {
      //     // response.data { "limit": 12, "offset": 0, "kitties": [], "total": 0 }
      //     // TODO: paging
      //     let kitties = response.data.kitties || [];
      //     kitties.forEach(item => {
      //       let kitty = {
      //         id: item.id,
      //         src: item.image_url,
      //         alt: `Kitty ${item.id}`,
      //         type: "kitty"
      //       };
      //       this.nfts.push(kitty);
      //       console.log(kitty);
      //     });
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // For testing
      const kitties = [
        {
          id: 5,
          src:
            "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/5.svg"
        },
        {
          id: 6,
          src:
            "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/6.svg"
        },
        {
          id: 7,
          src:
            "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/7.svg"
        }
      ];
      this.nfts.push(...kitties);
    },

    async isWizardsApproved() {
      let wizardAddress = this.drizzleInstance.contracts.WizardPresale.options
        .address;
      return await this.drizzleInstance.contracts.WizardPresale.methods[
        "isApprovedForAll"
      ](this.activeAccount, wizardAddress).call();
    },

    async isKittiesApproved() {
      let kittyAddress = this.drizzleInstance.contracts.KittyCore.options
        .address;
      return await this.drizzleInstance.contracts.KittyCore.methods[
        "isApprovedForAll"
      ](this.activeAccount, kittyAddress).call();
    },

    approveWizards() {
      this.drizzleInstance.contracts.WizardPresale.methods.setApprovalForAll.cacheSend(
        this.drizzleInstance.contracts.ManaBank.options.address,
        true,
        { from: this.activeAccount }
      );
    },

    approveKitties() {
      this.drizzleInstance.contracts.KittyCore.methods.setApprovalForAll.cacheSend(
        this.drizzleInstance.contracts.ManaBank.options.address,
        true,
        { from: this.activeAccount }
      );
    },

    getMana() {
      const wizardAddress = this.drizzleInstance.contracts.WizardPresale.options
        .address;
      const kittyAddress = this.drizzleInstance.contracts.KittyCore.options
        .address;

      let tokenAddresses = [];
      let tokenIds = [];
      this.selectedNFTs.forEach(item => {
        if (item.type == "wizard") {
          tokenAddresses.push(wizardAddress);
          tokenIds.push(item.id);
        } else if (item.type == "kitty") {
          tokenAddresses.push(kittyAddress);
          tokenIds.push(item.id);
        }
      });

      this.drizzleInstance.contracts.ManaBank.methods.getMana.cacheSend(
        tokenAddresses,
        tokenIds,
        { from: this.activeAccount }
      );
    }
  },

  created() {
    // const owner = "0xF0128825b0c518858971d8521498769148137936";
    const owner = this.activeAccount;
    this.getWizards(owner);
    this.getKitties(owner);
  },

  mounted() {
    this.$drizzleEvents.$on("drizzle/contractEvent", async payload => {
      const { contractName, eventName, data } = payload;
      if (eventName == "ApprovalForAll") {
        if (!data.approved) return;
        if (contractName == "WizardPresale") {
          this.wizardsNeedApproval = false;
        } else if (contractName == "KittyCore") {
          this.kittiesNeedApproval = false;
        }
      }
    });
  },

  watch: {
    async selectedNFTs() {
      let found = this.selectedNFTs.find(item => item.type == "wizard");
      if (found) {
        const isApproved = await this.isWizardsApproved();
        this.wizardsNeedApproval = !isApproved;
      } else {
        this.wizardsNeedApproval = false;
      }

      found = this.selectedNFTs.find(item => item.type == "kitty");
      if (found) {
        const isApproved = await this.isKittiesApproved();
        this.kittiesNeedApproval = !isApproved;
      } else {
        this.kittiesNeedApproval = false;
      }
    }
  }
};
</script>

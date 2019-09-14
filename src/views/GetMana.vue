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
              <p>Deposit {{ this.selectedNFTs.length }} Wizards/Kitties</p>
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
import { getWizards, getKitties } from "@/utils/GetNFTs.js";

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
    },

    async getNFTs() {
      if (!this.isDrizzleInitialized) return;
      const owner = this.activeAccount;
      const wizards = await getWizards(owner, this.drizzleInstance);
      this.nfts.push(...wizards);
      const kitties = await getKitties(owner, this.drizzleInstance);
      this.nfts.push(...kitties);
    }
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
      } else if (eventName == "GetMana") {
        console.log("GetMana");
        const tokenId = data.tokenId;
        this.nfts = this.nfts.filter(item => item.id != tokenId);
      }
    });
    this.getNFTs();
  },

  watch: {
    isDrizzleInitialized() {
      this.getNFTs();
    },

    async selectedNFTs() {
      const manaAddress = this.drizzleInstance.contracts.ManaBank.options
        .address;

      let found = this.selectedNFTs.find(item => item.type == "wizard");
      if (found) {
        const isWizardsApproved = await this.drizzleInstance.contracts.WizardPresale.methods
          .isApprovedForAll(this.activeAccount, manaAddress)
          .call();
        this.wizardsNeedApproval = !isWizardsApproved;
      } else {
        this.wizardsNeedApproval = false;
      }

      found = this.selectedNFTs.find(item => item.type == "kitty");
      if (found) {
        const isKittiesApproved = await this.drizzleInstance.contracts.KittyCore.methods
          .isApprovedForAll(this.activeAccount, manaAddress)
          .call();
        this.kittiesNeedApproval = !isKittiesApproved;
      } else {
        this.kittiesNeedApproval = false;
      }
    }
  }
};
</script>

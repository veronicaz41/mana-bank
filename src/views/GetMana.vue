<template>
  <div class="get-mana">
    <b-container>
      <b-row>
        <b-col lg="8">
          <NFTSelector :nfts="nfts" />
        </b-col>
        <b-col lg="4">
          <div v-if="isDrizzleInitialized">
            <div class="section">
              <b>XMN</b> is an ERC20 token that allows you to cash out your
              spare CryptoKitties and CheezeWizards <em>quickly</em>. For more
              about how XMN works, see
              <router-link to="/about">here</router-link>.
            </div>
            <div class="section" v-if="this.wizardsNeedApproval">
              <card shadow>
                <p>Please approve us to manage your CheezeWizards</p>
                <b-button variant="primary" @click="approveWizards"
                  >Approve</b-button
                >
              </card>
            </div>
            <div class="section" v-if="this.kittiesNeedApproval">
              <card shadow>
                <p>Please approve us to manage your CryptoKitties</p>
                <b-button variant="primary" @click="approveKitties"
                  >Approve</b-button
                >
              </card>
            </div>
            <div class="section">
              <p>
                XMN can be redeemed by 'exiling' CheezeWizards or CryptoKitties.
              </p>
              <card shadow>
                <p>
                  Please select CheezeWizards or CryptoKitties you want to exile
                </p>
                <b-button
                  variant="primary"
                  @click="getMana"
                  class="get-mana-button"
                  >Get XMN</b-button
                >
                <p>Each exiled item = <b>100</b> XMN</p>
                <!-- <p>Deposit {{ this.selectedNFTs.length }} Wizards/Kitties</p> -->
              </card>
            </div>
            <div class="section confirmation">
              <p>
                {{ this.selectedNFTs.length }} CheezeWizards / CryptoKitties
                exiled
              </p>
            </div>
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

<style>
.get-mana .section {
  margin-bottom: 26px;
}
.get-mana .card {
  text-align: center;
}
.get-mana-button {
  margin-bottom: 20px;
}
.get-mana .confirmation {
  text-align: center;
  font-weight: 600;
  color: #b79afc;
}
</style>

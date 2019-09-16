<template>
  <div class="get-mana">
    <Loading :active.sync="isLoading" loader="dots" is-full-page></Loading>
    <b-container>
      <b-row>
        <b-col lg="4" order-lg="2">
          <div v-if="isDrizzleInitialized">
            <div class="section">
              <b>XMN</b> is an ERC20 token that allows you to cash out your
              spare CryptoKitties and CheezeWizards
              <em>quickly</em>. For more
              about how XMN works, see
              <router-link to="/about">here</router-link>.
            </div>
            <div class="section" v-if="this.wizardsNeedApproval">
              <card shadow>
                <p>Please approve us to manage your CheezeWizards</p>
                <b-button variant="primary" @click="approveWizards">Approve</b-button>
              </card>
            </div>
            <div class="section" v-if="selectedKitties.length">
              <div v-for="(kitty, index) in selectedKitties" :key="index">
                <card shadow class="kitty-approval-card">
                  <p>
                    Please approve us to manage
                    <a :href="kitty.url" target="_blank">{{ kitty.alt }}</a>
                  </p>
                  <b-button variant="primary" @click="approveKitty(kitty.id)">Approve</b-button>
                </card>
              </div>
            </div>
            <div class="section">
              <p>XMN can be redeemed by 'exiling' CheezeWizards or CryptoKitties.</p>
              <card shadow>
                <p>Please select CheezeWizards or CryptoKitties you want to exile</p>
                <b-button variant="primary" @click="getMana" class="get-mana-button">Get XMN</b-button>
                <p class="last">
                  Each exiled item =
                  <b>100</b> XMN
                </p>
              </card>
            </div>
            <div class="section confirmation" v-if="depositedCount">
              <p>{{ this.depositedCount }} CheezeWizards / CryptoKitties exiled</p>
              <p>You got {{ this.depositedCount * 100 }} XMN</p>
            </div>
          </div>
        </b-col>
        <b-col lg="8" order-lg="1">
          <NFTSelector :nfts="nfts" />
          <div v-if="haveMore">
            <b-button @click="loadMore" class="load-more-button">Load More</b-button>
          </div>
          <div v-if="!nfts.length && !getNFTIsLoading" class="empty-state">
            There is no
            <a href="https://www.cheezewizards.com">CheezeWizards</a> or
            <a href="https://www.cryptokitties.co">CryptoKitties</a> in your
            account.
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import NFTSelector from "@/components/NFTSelector.vue";
import { mapGetters, mapState } from "vuex";
import { getWizards, getKitties } from "@/utils/GetNFTs.js";

export default {
  name: "GetMana",

  components: {
    NFTSelector,
    Loading
  },

  data() {
    return {
      nfts: [],
      selectedKitties: [],

      wizardsNeedApproval: false,
      depositedCount: 0,
      wizardApprovalIsLoading: false,
      kittyApprovalIsLoading: false,
      getManaIsLoading: false,
      getNFTIsLoading: true,

      kittiesTotal: 0,
      kittiesOffset: 0
    };
  },

  computed: {
    ...mapState(["selectedNFTs"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized", "drizzleInstance"]),
    ...mapGetters("accounts", ["activeAccount"]),

    isLoading() {
      return (
        this.wizardApprovalIsLoading ||
        this.kittyApprovalIsLoading ||
        this.getManaIsLoading ||
        this.getNFTIsLoading
      );
    },

    haveMore() {
      return this.kittiesTotal > 0 && this.kittiesOffset < this.kittiesTotal;
    }
  },

  methods: {
    approveWizards() {
      this.drizzleInstance.contracts.WizardPresale.methods.setApprovalForAll.cacheSend(
        this.drizzleInstance.contracts.ManaBank.options.address,
        true,
        { from: this.activeAccount }
      );
      this.wizardApprovalIsLoading = true;
    },

    approveKitty(tokenId) {
      this.drizzleInstance.contracts.KittyCore.methods.approve.cacheSend(
        this.drizzleInstance.contracts.ManaBank.options.address,
        tokenId,
        { from: this.activeAccount }
      );
      this.kittyApprovalIsLoading = true;
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

      this.getManaIsLoading = true;
    },

    async getNFTs() {
      if (!this.isDrizzleInitialized) return;
      this.getNFTIsLoading = true;
      const owner = this.activeAccount;

      const wizards = await getWizards(owner, this.drizzleInstance);
      this.nfts.push(...wizards);

      const { kitties, total } = await getKitties(
        owner,
        this.drizzleInstance,
        this.kittiesOffset
      );
      this.nfts.push(...kitties);
      this.kittiesTotal = total;
      this.kittiesOffset += kitties.length;

      this.getNFTIsLoading = false;
    },

    loadMore() {
      this.getNFTs();
    }
  },

  mounted() {
    this.getNFTs();

    this.depositedCount = 0;
    this.wizardApprovalIsLoading = false;
    this.kittyApprovalIsLoading = false;
    this.getManaIsLoading = false;

    this.$drizzleEvents.$on("drizzle/contractEvent", async payload => {
      const { contractName, eventName, data } = payload;
      if (eventName == "ApprovalForAll") {
        if (!data.approved) return;
        if (contractName == "WizardPresale") {
          this.wizardsNeedApproval = false;
          this.wizardApprovalIsLoading = false;
        }
      } else if (eventName == "Approval") {
        const idx = this.selectedKitties.findIndex(
          item => item.id == data.tokenId
        );
        if (idx >= 0) {
          this.selectedKitties.splice(idx, 1);
          this.kittyApprovalIsLoading = false;
        }
      } else if (eventName == "GetMana") {
        const tokenId = data.tokenId;
        const oldCount = this.nfts.length;
        this.nfts = this.nfts.filter(item => item.id != tokenId);

        if (this.nfts.length < oldCount) {
          // tokenId has been deposited
          this.depositedCount += 1;
        }
        this.getManaIsLoading = false;
      }
    });

    var _error = console.error;
    console.error = function() {
      if (arguments.length > 0) {
        const e = String(arguments[0]);
        if (e.includes("Error: Internal JSON-RPC error.")) {
          this.kittyApprovalIsLoading = false;
          this.wizardApprovalIsLoading = false;
          this.getManaIsLoading = false;
        }
      }
      return _error.apply(console, arguments);
    }.bind(this);
  },

  watch: {
    isDrizzleInitialized() {
      this.getNFTs();
    },

    async selectedNFTs() {
      this.depositedCount = 0;
      this.wizardsNeedApproval = false;
      this.selectedKitties = [];

      const manaAddress = this.drizzleInstance.contracts.ManaBank.options
        .address;

      let seenWizard = false;
      this.selectedNFTs.forEach(async item => {
        if (item.type == "wizard" && !seenWizard) {
          seenWizard = true;
          const isWizardsApproved = await this.drizzleInstance.contracts.WizardPresale.methods
            .isApprovedForAll(this.activeAccount, manaAddress)
            .call();
          this.wizardsNeedApproval = !isWizardsApproved;
        } else if (item.type == "kitty") {
          const approvedAddress = await this.drizzleInstance.contracts.KittyCore.methods
            .kittyIndexToApproved(item.id)
            .call();
          if (approvedAddress != manaAddress) {
            const found = this.selectedKitties.find(
              kitty => kitty.id == item.id
            );
            if (!found) {
              this.selectedKitties.push(item);
            }
          }
        }
      });
    }
  }
};
</script>

<style>
.get-mana .section {
  margin-bottom: 26px;
}
.last {
  margin-bottom: 0px;
}
.card {
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
.get-mana .empty-state {
  margin-left: 6px;
}
.get-mana .load-more-button {
  width: 100%;
  background-color: white;
  color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: none;
}
.get-mana .load-more-button:hover {
  transform: none;
  color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.get-mana .kitty-approval-card {
  margin-bottom: 12px;
}
</style>

<template>
  <div class="get-collectibles">
    <b-container>
      <b-row>
        <b-col
          lg="4"
          order-lg="2"
          class="d-flex justify-content-center right-col"
        >
          <div v-if="isDrizzleInitialized">
            <p>
              You can burn XMN to 'summon' random CheezeWizards or
              CryptoKitties.
            </p>
            <p>Each CheezeWizard and CryptoKitty costs 100 XMN.</p>
            <card shadow class="get-collectible-form">
              <p>
                Please enter number of CheezeWizards and CryptoKitties you want
                to summon
              </p>
              <b-form-input
                id="mana-select"
                v-model="selectedNumber"
                :state="validSelectedNumber"
                placeholder="Enter a valid number"
                aria-describedby="input-live-feedback"
                type="number"
                min="0"
                :max="maxNumber"
              ></b-form-input>

              <b-form-invalid-feedback id="mana-select-feedback">{{
                this.numberErrorMessage
              }}</b-form-invalid-feedback>

              <p class="last" v-if="validSelectedNumber">
                Will burn {{ this.selectedNumber * this.manaPerNFT }} XMN
              </p>

              <b-button
                :disabled="!validSelectedNumber"
                variant="primary"
                @click="getCollectibles"
                >Get Collectibles</b-button
              >
            </card>
          </div>
        </b-col>
        <b-col lg="8" order-lg="1" class="d-flex justify-content-center">
          <!-- NOTE: If we do fungible power token, we'll want to change what we display here -->
          <apexchart
            width="400"
            type="pie"
            :options="pieChart.options"
            :series="pieChart.series"
          ></apexchart>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "GetCollectibles",

  data() {
    return {
      kittyCountKey: null,
      wizardCountKey: null,

      manaBalanceKey: null,

      selectedNumber: null,

      manaPerNFT: 100
    };
  },

  computed: {
    ...mapGetters("contracts", ["contractInstances"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized", "drizzleInstance"]),
    ...mapGetters("accounts", ["activeAccount"]),

    validSelectedNumber() {
      if (this.selectedNumber == null || this.maxNumber == 0) {
        return null;
      }
      return this.selectedNumber > 0 && this.selectedNumber <= this.maxNumber;
    },

    maxNumber() {
      if (
        this.manaBalanceKey != null &&
        this.manaBalanceKey in this.contractInstances.ManaBank.balanceOf
      ) {
        const manaBalance = parseInt(
          this.contractInstances.ManaBank.balanceOf[this.manaBalanceKey].value
        );
        return manaBalance / this.manaPerNFT;
      }
      return 0;
    },

    numberErrorMessage() {
      if (this.selectedNumber <= 0) {
        return "Please enter a positive number";
      }
      return "You do not have enough XMN";
    },

    pieChart() {
      if (this.wizardCountKey !== null && this.kittyCountKey !== null) {
        const tokenAddressToCountMap = this.contractInstances.ManaBank
          .tokenAddressToCount;

        if (
          this.kittyCountKey in tokenAddressToCountMap &&
          this.wizardCountKey in tokenAddressToCountMap
        ) {
          const kittyCount = parseInt(
            tokenAddressToCountMap[this.kittyCountKey].value
          );
          const wizardCount = parseInt(
            tokenAddressToCountMap[this.wizardCountKey].value
          );

          return {
            series: [wizardCount, kittyCount],
            options: {
              labels: ["CheezeWizards", "CryptoKitties"],
              colors: ["#ffe133", "#e96bd4"]
            }
          };
        }
      }

      return {
        series: [50, 50],
        options: {
          labels: ["CheezeWizards", "CryptoKitties"],
          colors: ["#ffe133", "#e96bd4"]
        }
      };
    }
  },

  methods: {
    loadPieChartData() {
      if (!this.isDrizzleInitialized) return;

      const kittyAddress = this.drizzleInstance.contracts.KittyCore.address;
      const kittyCountKey = this.drizzleInstance.contracts.ManaBank.methods[
        "tokenAddressToCount"
      ].cacheCall(kittyAddress);
      this.kittyCountKey = kittyCountKey;

      const wizardAddress = this.drizzleInstance.contracts.WizardPresale
        .address;
      const wizardCountKey = this.drizzleInstance.contracts.ManaBank.methods[
        "tokenAddressToCount"
      ].cacheCall(wizardAddress);
      this.wizardCountKey = wizardCountKey;
    },

    loadManaBalance() {
      if (!this.isDrizzleInitialized) return;

      const manaBalanceKey = this.drizzleInstance.contracts.ManaBank.methods[
        "balanceOf"
      ].cacheCall(this.activeAccount);
      this.manaBalanceKey = manaBalanceKey;
    },

    getCollectibles() {
      this.drizzleInstance.contracts.ManaBank.methods.burnMana.cacheSend(
        this.selectedNumber * this.manaPerNFT,
        { from: this.activeAccount }
      );
    }
  },

  mounted() {
    this.loadPieChartData();
    this.loadManaBalance();
  },

  watch: {
    isDrizzleInitialized() {
      this.loadPieChartData();
      this.loadManaBalance();
    }
  }
};
</script>

<style>
.get-collectible-form #mana-select {
  margin-bottom: 16px;
}
.card {
  text-align: center;
}
#mana-select-feedback {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 90%;
}
.get-collectibles .right-col {
  margin-bottom: 30px;
}
</style>

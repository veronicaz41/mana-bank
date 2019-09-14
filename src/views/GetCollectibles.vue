<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <!-- NOTE: If we do fungible power token, we'll want to change what we display here -->
          <apexchart width="350" type="pie" :options="pieChart.options" :series="pieChart.series"></apexchart>
        </b-col>

        <b-col cols="3">
          <div v-if="isDrizzleInitialized">
            <p>You can burn Mana to get random wizards or kitties</p>
            <p>Each wizard and kitty costs 100 Mana</p>
            <b-form-input
              id="mana-select"
              v-model="selectedMana"
              :state="validSelectedMana"
              placeholder="Enter mana to deposit"
              aria-describedby="input-live-feedback"
              type="number"
            ></b-form-input>

            <b-form-invalid-feedback
              id="mana-select-feedback"
            >Enter an amount of Mana you can afford</b-form-invalid-feedback>

            <b-button
              :disabled="!validSelectedMana"
              variant="primary"
              @click="getCollectibles"
            >Get Collectibles</b-button>
          </div>
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
      addressKey: null,

      kittyCountKey: null,
      wizardCountKey: null,

      manaBalanceKey: null,

      selectedMana: null
    };
  },

  computed: {
    ...mapGetters("contracts", ["contractInstances"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized", "drizzleInstance"]),
    ...mapGetters("accounts", ["activeAccount"]),

    // TODO: unify shitty null checking logic in all drizzle getters
    validSelectedMana() {
      if (this.selectedMana == null) {
        return null;
      }
      if (
        this.manaBalanceKey != null &&
        this.manaBalanceKey in this.contractInstances.ManaBank.balanceOf
      ) {
        const manaBalance = parseInt(
          this.contractInstances.ManaBank.balanceOf[this.manaBalanceKey].value
        );

        return this.selectedMana >= 0 && this.selectedMana <= manaBalance;
      } else {
        // TODO: Loading!
        return false;
      }
    },

    pieChart() {
      if (this.wizardCountKey !== null && this.kittyCountKey !== null) {
        const tokenAddressToCountMap = this.contractInstances.ManaBank
          .tokenAddressToCount;

        // TODO: Actually figure out why this doesn't work!
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
              labels: ["Wizards", "Kitties"]
            }
          };
        }

        // TODO: Loading or some indication that this didn't work
        return {
          series: [50, 50],
          options: {
            labels: ["Wizards", "Kitties"]
          }
        };
      }

      // TODO: should show a loading screen instead
      else {
        return {
          series: [50, 50],
          options: {
            labels: ["Wizards", "Kitties"]
          }
        };
      }
    }
  },

  methods: {
    loadPieChartData() {
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
      const manaBalanceKey = this.drizzleInstance.contracts.ManaBank.methods[
        "balanceOf"
      ].cacheCall(this.activeAccount);
      this.manaBalanceKey = manaBalanceKey;
    },

    getCollectibles() {
      this.drizzleInstance.contracts.ManaBank.methods.burnMana.cacheSend(
        this.selectedMana,
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

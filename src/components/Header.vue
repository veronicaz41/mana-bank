<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <div id="nav">
            <router-link to="/">Get Mana</router-link>|
            <router-link to="/get_collectibles">Get Collectibles</router-link>|
            <router-link to="/trade">Trade for ETH</router-link>
          </div>
        </b-col>

        <b-col cols="3">
          <div id="balance">Mana Balance: {{ this.manaBalance }}</div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",

  data() {
    return {
      manaBalanceKey: null
    };
  },

  computed: {
    ...mapGetters("contracts", ["contractInstances"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized", "drizzleInstance"]),
    ...mapGetters("accounts", ["activeAccount"]),

    manaBalance() {
      if (
        this.manaBalanceKey != null &&
        this.manaBalanceKey in this.contractInstances.ManaBank.balanceOf
      ) {
        const manaBalance = parseInt(
          this.contractInstances.ManaBank.balanceOf[this.manaBalanceKey].value
        );

        return manaBalance;
      } else {
        return NaN;
      }
    }
  },

  methods: {
    loadManaBalance() {
      const manaBalanceKey = this.drizzleInstance.contracts.ManaBank.methods[
        "balanceOf"
      ].cacheCall(this.activeAccount);
      this.manaBalanceKey = manaBalanceKey;
    }
  },

  watch: {
    isDrizzleInitialized() {
      this.loadManaBalance();
    }
  }
};
</script>

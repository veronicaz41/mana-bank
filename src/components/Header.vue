<template>
  <!-- <div class="navbar-main navbar-expand navbar-light">
    <b-container>
      <b-row>
        <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
            <img src="img/brand/white.png" alt="Mana Bank">
        </router-link>
        <div class="navbar-nav align-items-center">
          <router-link class="nav-item" to="/get_collectibles">Get Collectibles</router-link>
          <router-link class="nav-item" to="/about">About</router-link>
          <!-- TODO: Put back in with a link to Uniswap pool! -->
          <!--<router-link to="/trade">Trade for ETH</router-link>-->
        <!-- </div>
        <div class="navbar-nav align-items-center ml-auto">
          XMN Balance: {{ this.manaBalance }}
        </div>
      </b-row>
    </b-container>
  </div> -->
  <header class="header-global">
    <base-nav class="navbar-main" type="" effect="light" expand>
      <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
        <img src="../assets/logo.png" alt="Mana Bank">
        <span>Mana Bank</span>
      </router-link>

      <div slot="content-header" slot-scope="{closeMenu}" :manaBalance="manaBalance">
        <b-row>
          <div class="col-6 collapse-brand">
            <img src="../assets/logo.png" alt="Mana Bank">
            <span class="navbar-brand collapse-brand-text">Mana Bank</span>
          </div>
          <div class="col-6 collapse-close">
            <close-button @click="closeMenu"></close-button>
          </div>
        </b-row>
        <b-row>
          <b-col class="col-12 collapse-detail">
            XMN Balance: {{ manaBalance }}
          </b-col>
        </b-row>
      </div>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
        <li class="nav-item">
          <router-link class="nav-link" to="/get_collectibles">Get Collectibles</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/about">About</router-link>
        </li>
      </ul>
      <ul class="navbar-nav align-items-lg-center ml-lg-auto">
        <li class="nav-item d-none d-lg-block ml-lg-4">
          XMN Balance: {{ this.manaBalance }}
        </li>
      </ul>
    </base-nav>
  </header>
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

<style>
.navbar-light .navbar-toggler {
  border-style: none !important;
}
.collapse-detail {
  margin-top: 12px;
}
.collapse-brand-text {
  margin-right: 0px;
}
</style>

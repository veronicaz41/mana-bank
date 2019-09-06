<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <!-- NOTE: If we do fungible power token, we'll want to change what we display here -->
          <apexchart
            width="350"
            type="pie"
            :options="pieChart.options"
            :series="pieChart.series"
          ></apexchart>
        </b-col>

        <b-col cols="3">
          Vending machine
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// TODO: Key this by network and store thsi somewhere else... Also, use real values!
const KITTY_ADDRESS = "0xc0f0200a1c53D147109a185EBe0BDebc70f67aEC";
const WIZARDS_ADDRESS = "0x0000000000000000000000000000000000000000";

export default {
  name: "GetCollectibles",

  methods: {
    loadPieChartData() {
      const kittyCountKey = this.drizzleInstance.contracts["ManaBank"].methods[
        "tokenAddressToCount"
      ].cacheCall(KITTY_ADDRESS);
      this.kittyCountKey = kittyCountKey;

      const wizardCountKey = this.drizzleInstance.contracts["ManaBank"].methods[
        "tokenAddressToCount"
      ].cacheCall(WIZARDS_ADDRESS);
      this.wizardCountKey = wizardCountKey;
    }
  },

  computed: {
    ...mapGetters("contracts", ["contractInstances"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized", "drizzleInstance"]),

    pieChart() {
      if (this.wizardCountKey !== "" && this.kittyCountKey !== "") {
        const tokenAddressToCountMap = this.contractInstances["ManaBank"]
          .tokenAddressToCount;

        // TODO: Actually figure out why this doesn't work!
        if (this.kittyCountKey in tokenAddressToCountMap && this.wizardCountKey in tokenAddressToCountMap) {
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

  watch: {
    isDrizzleInitialized() {
      this.loadPieChartData();
    }
  },

  data() {
    return {
      kittyCountKey: "",
      wizardCountKey: ""
    };
  }
};
</script>

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import drizzleVuePlugin from "@drizzle/vue-plugin";
import drizzleOptions from "./drizzleOptions";

import VueApexCharts from "vue-apexcharts";

import Argon from "./plugins/argon-kit";

Vue.use(BootstrapVue);
Vue.use(VueApexCharts);
Vue.use(Argon);
Vue.use(drizzleVuePlugin, { store, drizzleOptions });

Vue.component("apexchart", VueApexCharts);

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

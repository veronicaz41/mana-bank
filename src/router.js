import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "GetMana",
      component: () => import("./views/GetMana.vue")
    },
    {
      path: "/get_collectibles",
      name: "GetCollectibles",
      component: () => import("./views/GetCollectibles.vue")
    },
    {
      path: "/trade",
      name: "Trade",
      component: () => import("./views/Trade.vue")
    }
  ]
});

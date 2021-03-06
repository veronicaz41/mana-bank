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
      path: "/get-collectibles",
      name: "GetCollectibles",
      component: () => import("./views/GetCollectibles.vue")
    },
    {
      path: "/about",
      name: "About",
      component: () => import("./views/About.vue")
    }
  ]
});

// =========================================================
// * Vue Argon Design System - v1.1.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/argon-design-system
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md)

// * Coded by www.creative-tim.com

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import "@/assets/vendor/font-awesome/css/font-awesome.css";
import "@/assets/scss/argon.scss";
import globalComponents from "./globalComponents";
import globalDirectives from "./globalDirectives";

export default {
  install(Vue) {
    Vue.use(globalComponents);
    Vue.use(globalDirectives);
  }
};

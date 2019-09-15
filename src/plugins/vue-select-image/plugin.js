// Adapted from vue-select-image
// Github: https://github.com/mazipan/vue-select-image
// npm: https://www.npmjs.com/package/vue-select-image

import "./vue-select-image.css";
import VueSelectImage from "./VueSelectImage.vue";

const plugin = {
  install: Vue => {
    Vue.component(VueSelectImage.name, VueSelectImage);
  }
};

VueSelectImage.install = plugin.install;

export default VueSelectImage;

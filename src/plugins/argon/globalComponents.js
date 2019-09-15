import Card from "./components/Card";
import BaseNav from "./components/BaseNav";
import CloseButton from "./components/CloseButton";

export default {
  install(Vue) {
    Vue.component(Card.name, Card);
    Vue.component(BaseNav.name, BaseNav);
    Vue.component(CloseButton.name, CloseButton);
  }
};

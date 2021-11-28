import Vue from "vue";
import App from "./App.vue";
import VueVirtualScroller from "vue-virtual-scroller";

import { Directive } from "@/directives/detect-viewport";

Vue.use(VueVirtualScroller);
Vue.directive("detect-viewport", Directive);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

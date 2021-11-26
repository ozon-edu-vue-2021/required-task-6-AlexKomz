import Vue from "vue";
import App from "./App.vue";

import { Directive } from "@/directives/detect-viewport";

Vue.directive("detect-viewport", Directive);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

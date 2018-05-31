import Vue from "vue"
import axios from "axios"
import App from "./App"
import router from "./router"
import VueSweetalert2 from "vue-sweetalert2"

Vue.use(VueSweetalert2)

if (!process.env.IS_WEB) Vue.use(require("vue-electron"))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: "<App/>"
}).$mount("#app")

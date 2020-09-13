import Vue from 'vue'
import App from './App.vue'
import "jspanel4/dist/jspanel.min.css"
import VueJsPanel from 'vue-js-panel/src'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

Vue.use(VueJsPanel)
Vue.use(Buefy)
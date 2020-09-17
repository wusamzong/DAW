import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
//import * as THREE from 'three'
//const THREE = require('three');
//Vue.use(THREE)
Vue.config.productionTip = false

new Vue({  
  //THREE,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

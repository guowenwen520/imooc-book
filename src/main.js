import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/style/icon.css'
// import './assets/fonts/daysOne.css'
import './assets/style/global.scss'
import './utils/boost'
// 以api的形式调用组件 实现组件间的解耦
import './utils/create-api'
// 语言国际化
import i18n from './lang'
// Mock.js模拟数据
// import './mock'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

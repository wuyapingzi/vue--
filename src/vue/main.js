import 'babel-polyfill'
import Vue from 'vue'

// css reset
import 'normalize.css/normalize.css'

import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'

import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import '@/assets/styles/index.stylus'

// UI framework
Vue.use(Mint)
// 全局格式化日期过滤器
Vue.filter('dateformat', function(dateStr, pattern = 'YYYY-MM-DD HH:mm:ss'){
  return moment(dateStr).format(pattern)
})
// 注册全局charts组件
Vue.component('chart', ECharts)

const TOKEN_INTERVAL = 3e5

function attachRouterEvent(router) {
  // https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
  router.beforeEach((to, from, next) => {
    const now = Date.now()
    const tokenTime = Number(store.getters.tokenTime) || 0
    if (!store.getters.token || TOKEN_INTERVAL < now - tokenTime) {
      // csrf token
      store
        .dispatch('updateToken')
        .then(() => {
          next()
        })
        .catch(err => {
          console.log(err)
          next()
        })
    } else {
      next()
    }
  })
  router.beforeResolve((to, from, next) => {
    next()
  })
  router.afterEach((to, from) => {
    //console.log('[afterEach]', to, from)
  })
}

attachRouterEvent(router)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App />',
  components: { App }
})

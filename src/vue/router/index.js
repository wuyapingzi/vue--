import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' +
  (process.env.NODE_ENV == 'production' ? 'production' : 'development'))
// https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

export const constantRouterMap = [
  { path: '/', name: 'home', component: _import('home/index') },
  { path: '/announce', name: 'announcement', component: _import('announcement/index') },
  { path: '/signup', name: 'signup', component: _import('signup/index')},
  { path: '/login', name: 'login', component: _import('login/index') },
  { path: '/forgot', name: 'forgot', component: _import('forgot/index') },
  { path: '/plan/buy/:id', name: 'planBuy', component: _import('plan/buy/index')},
  // { path: '/bankcard', name: 'bankcard', component: _import('bankcard/bankcard.info') },
  { path: '/open/avoid/login', name: 'avoidLogin', component: _import('avoidLogin/open.avoid.login')},
  { path: '/plan/:id', name: 'plan', component: _import('plan/detail/index')},
  { path: '/join', name: 'join', component: _import('plan/detail/join.list') },
  { path: '/invest', name: 'invest', component: _import('plan/detail/invest.list') },
  { path: '/depository/open', name: 'depository', component: _import('depository/opendeposit') },
  { path: '/bank/limit', name: 'bankLimit', component: _import('depository/bank.limit')},
  { path: '/account', name: 'account', component: _import('account/index') },
  { path: '/account/assets', name: 'assets', component: _import('account/assets/index') },
  { path: '/account/recharge', name: 'accountRecharge', component: _import('account/account.recharge') },
  { path: '/account/withdraw', name: 'accountWithdraw', component: _import('account/account.withdraw') },
  { path: '/account/withdraw/list', name: 'accountWithdrawList', component: _import('account/account.withdraw.list') },
  { path: '/account/bankcard', name: 'bankcard', component: _import('account/account.bankcard.info') },
  { path: '/account/bankcard/unbind', name: 'accountBankcardUnbind', component: _import('account/account.bankcard.unbind') },
  { path: '/account/bankcard/bind', name: 'accountBankcardBind', component: _import('account/account.bankcard.bind') },
  { path: '/thirdpart/:action/result', name: 'thirdpartResult', component: _import('thirdpart/thirdpart.result') },
  {
    path: '*',
    name: '404',
    component: _import('errorPage/404')
  }
]

export default new Router({
  // https://router.vuejs.org/zh/guide/essentials/history-mode.html
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

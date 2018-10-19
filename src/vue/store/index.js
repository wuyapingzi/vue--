import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

import app from './modules/app'
import home from './modules/home'
import user from './modules/user'
import plan from './modules/plan'
import signup from './modules/signup'
import planBuy from './modules/planBuy'
import account from './modules/account'
import avoidLogin from './modules/avoidLogin'
import forgot from './modules/forgot'
import depository from './modules/depository'
import bankcard from './modules/bankcard'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    home,
    user,
    plan,
    signup,
    planBuy,
    account,
    avoidLogin,
    forgot,
    depository,
    bankcard,
  },
  getters
})

export default store
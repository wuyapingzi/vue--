import {
  queryAccountAssets,
  queryAccountBankcard,
  accountBankcardBind,
  accountBankcardUnbind,
  queryAccountWithdrawList,
  accountRecharge,
  accountWithdraw,
} from '@/api/account'

const account = {
  state: {
    accountInfo: {},
    bankcardInfo: {},
  },
  mutations: {
    SET_ACCOUNTINFO(state, payload){
      state.accountInfo = payload
    },
    SET_ACCOUNTBANK(state, payload){
      state.bankcardInfo = payload
    },
  },
  actions: {
    getAccountInfo({ commit }){
      return new Promise((resolve, reject) => {
        queryAccountAssets().then(response => {
          console.log('GetAccountInfo =========', response)
          commit('SET_ACCOUNTINFO', response)
          console.log('this.state===', this.state)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAccountBankcard({commit}){
      console.log('action 获取账户绑定的银行卡')
      return new Promise((resolve, reject) => {
        queryAccountBankcard().then(response => {
          console.log('获取账户绑定的银行卡 结果===', response.quotaStatus)
          // response.cardId = safeBank(response.cardId)
          commit('SET_ACCOUNTBANK', response)
          resolve(response)
        }).catch(err => {
          console.log('获取用户绑定的银行卡出错', err)
          reject(err)
        })
      })
    },
    getAccountWithdrawList({commit}){
      console.log('store.module.geAccounttWithdrawList')
      return new Promise((resolve, reject) => {
        queryAccountWithdrawList().then(response => {
          console.log('获取提现记录请求结果--------', response)
          resolve(response)
        }).catch(err => {
          console.log('获取提现记录出错====', err)
          reject(err)
        })
      })
    },
    postBankcardBind({commit}, payload){
      console.log('store.module.postBankcardBind.request=========', payload)
      return new Promise((resolve, reject) => {
        accountBankcardBind(payload).then(response => {
          console.log('绑定银行卡后端 返回的 获取请求懒猫的数据', response)
          resolve(response)
        }).catch(err => {
          console.log('绑定银行卡获取请求懒猫数据结果出错', err)
          reject(err)
        })
      })
    },
    postBankcardUnbind({commit}){
      console.log('store.module.postBankcardUnbind.request..........')
      return new Promise((resolve, reject) => {
        accountBankcardUnbind().then(response => {
          console.log('解绑银行卡后端返回的 获取请求懒猫的数据结果==', response)
          resolve(response)
        }).catch(err => {
          console.log('解绑银行卡后端返回的 获取请求懒猫的数据结果出错==', err)
          reject(err)
        })
      })
    },
    postAccountRecharge({commit}, payload){
      console.log('store.module.postAccountRecharge.request..............')
      return new Promise((resolve, reject) => {
        accountRecharge(payload).then(response => {
          console.log('充值后端返回的  获取请求懒猫数据结果==', response)
          resolve(response)
        }).catch(err => {
          console.log('充值 后端返回的  获取懒猫数据结果出错XXX==', err)
          reject(err)
        })
      })
    },
    postAccountWithdraw({commit}, payload){
      console.log('store.module.postAccountWithdraw.request..............')
      return new Promise((resolve, reject) => {
        accountWithdraw(payload).then(response => {
          console.log('提现  后端反悔的  获取懒猫请求数据结果==', response)
          resolve(response)
        }).catch(err => {
          console.log('提现  后端返回的  获取懒猫请求结果出错XXX', err)
          reject(err)
        })
      })
    },
  }
}

export default account
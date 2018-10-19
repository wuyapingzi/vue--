import {
  queryBankChecked
} from '@/api/bankcard'
const bankcard = {
  state: {
    bankcardInfo: {},
  },
  mutations: {
    SET_BANKCARDINFO(state, payload) {
      state.bankcardInfo = payload
    }
  },
  actions: {
    getBankcardChecked({commit}, payload) {
      console.log('store.module.getBankcardChecked', payload)
      return new Promise((resolve, reject) => {
        queryBankChecked(payload).then(response => {
          console.log('查询所属银行，后端接口返回查询结果 + 请求数据 ', response, payload)
          commit('SET_BANKCARDINFO', response)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}

export default bankcard
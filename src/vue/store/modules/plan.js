import { planDetail, joinList, investList } from '@/api/plan'

const plan = {
  state: {
    detailData: {},
    joinList: [],
    investList: []
  },

  mutations: {
    QUERY_PLAN(state, payload) {
      Object.assign(state, {
        detailData: payload
      })
    },
    PLAN_LIST(state, payload) {
      Object.assign(state, {
        joinList: payload.dataList
      })
    },
    INVEST_LIST(state, payload) {
      Object.assign(state, {
        investList: payload.dataList
      })
    }
  },

  actions: {
    planDetail({ commit }) {
      return new Promise((resolve, reject) => {
        planDetail()
          .then(response => {
            commit('QUERY_PLAN', response)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    joinList({ commit }) {
      return new Promise((resolve, reject) => {
        joinList()
          .then(response => {
            commit('PLAN_LIST', response)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    investList({ commit }) {
      return new Promise((resolve, reject) => {
        investList()
          .then(response => {
            commit('INVEST_LIST', response)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  }
}

export default plan
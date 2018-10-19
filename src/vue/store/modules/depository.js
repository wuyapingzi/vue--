import { depositoryActive, bankLimitList, depositoryAccount } from "@/api/depository";

const depository = {
  state: {
    detailData: {},
    bankCodeData: []
  },

  mutations: {
    QUERY_DEPOSITORY(state, payload) {
      state.detailData = payload;
    },
    QUERY_BANK_LIMIT(state, payload) {
      state.bankCodeData = payload;
    }
  },

  actions: {
    depositoryActive({ commit }) {
      return new Promise((resolve, reject) => {
        depositoryActive()
          .then(response => {
            // commit("QUERY_DEPOSITORY", response)
            console.log(response)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    depositoryAccount({ commit }, payload) {
      return new Promise((resolve, reject) => {
        depositoryAccount(payload)
          .then(response => {
            console.log(response)
          })
      })
    },
    bankLimitList({ commit }) {
      return new Promise((resolve, reject)=> {
        bankLimitList()
          .then(response => {
            commit("QUERY_BANK_LIMIT", response)
            console.log(response)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }

}

export default depository

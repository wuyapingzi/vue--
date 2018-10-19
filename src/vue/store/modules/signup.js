import { sendSmsCode, checkMobile, userSignup } from '@/api/user'

const signup = {
  state: {
    isLogin: false
  },

  mutations: {
    SET_lOGIN(state, payload) {
      state.isLogin = payload
    }
  },

  actions: {
    sendSmsCode({ commit}, payload) {
      return new Promise((resolve, reject) => {
        sendSmsCode(payload)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    userSignup({ commit }, payload) {
      return new Promise((resolve, reject) => {
        userSignup(payload)
          .then(response => {
            commit('SET_lOGIN', true)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    checkMobile({}, payload) {
      return new Promise((resolve, reject) => {
        checkMobile(payload)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default signup
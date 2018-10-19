import { login, fetchToken } from '@/api/user'
// import router from '@/router/index'

const user = {
  state: {
    // info
    isLogin: false,
    token: '',
    tokenTime: 0,
    name: '',
    loginCount: 0,
    userState: {}
  },

  // https://vuex.vuejs.org/zh/guide/mutations.html
  mutations: {
    SET_LOGIN(state, payload) {
      state.isLogin = payload
    },
    SET_TOKEN(state, payload) {
      state.token = payload
      state.tokenTime = Date.now()
    },
    SET_LOGIN_TIMES(state, payload) {
      state.loginCount =  payload
    },
    SET_USER_STATE(state, payload) {
      state.userState = payload
    }
  },

  // https://vuex.vuejs.org/zh/guide/actions.html
  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        login(payload)
          .then(response => {
            console.log(response)
            commit('SET_LOGIN', true)
            commit('SET_LOGIN_TIMES', response.loginCount)
            commit('SET_USER_STATE', response.userState)
            resolve(response)
          })
          .catch(err => {
            console.log('--------------', err)
            commit('SET_LOGIN_TIMES', err._data.loginCount)
            reject(err)
          })
      })
    },

    logout({ commit }) {
      commit('SET_LOGIN', false)
    },

    updateToken({ commit }) {
      //commit('SET_TOKEN', payload)
      return new Promise((resolve, reject) => {
        fetchToken()
          .then(response => {
            commit('SET_TOKEN', response.csrf)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default user

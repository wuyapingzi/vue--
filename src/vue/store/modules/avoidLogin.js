import { avoidLoginOpen } from '@/api/user'

const avoidLogin = {
  state: {

  },

  mutations: {

  },

  actions: {
    avoidLoginOpen({ commit }, payload) {
      console.log('开启免登录按钮被点击')
      return new Promise((resolve, reject) => {
        avoidLoginOpen(payload)
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

export default avoidLogin
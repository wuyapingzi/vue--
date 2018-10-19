import { sendSmsCode, checkMobile, userForgot } from '@/api/user'

const forgot = {
  state: {

  },

  mutations: {

  },

  actions: {
    sendSmsCode({}, payload) {
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
    },

    userForgot({}, payload) {
      return new Promise((resolve, reject) => {
        userForgot(payload)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    }
  }
}

export default forgot
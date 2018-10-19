const getters = {
  isLogin: state => state.user.isLogin,
  token: state => state.user.token,
  tokenTime: state => state.user.tokenTime,
  userState: state => state.user.userState
}

// https://vuex.vuejs.org/zh/guide/getters.html
export default getters

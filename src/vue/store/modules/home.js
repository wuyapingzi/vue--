import { queryHome } from '@/api/home'

const home = {
  state: {
    bannerList: [],
    announcement: {},
    productList: {},
    orderKeys: [],
    platformData: {},
    platformIntroduce: []
  },

  // https://vuex.vuejs.org/zh/guide/mutations.html
  mutations: {
    QUERY_HOME_DATA(state, payload) {
      // state = {...state, ...payload}
      console.log("payload=====" + payload);
      Object.assign(state, payload);
    }
  },

  // https://vuex.vuejs.org/zh/guide/actions.html
  actions: {
    queryHomeData({ commit }) {
      return new Promise((resolve, reject) => {
        queryHome()
          .then(response => {
            commit("QUERY_HOME_DATA", response);
            resolve(response);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};

export default home

import {
  planJoin,
  chooseBestCoupon,
  couponList,
} from '@/api/plan'

const planBuy = {
  state: {
    planDetailData: {},
    totalInterest: '0',
    availableCoupons: [],
    unAvailableCoupons: [],
    bestCoupon: {},
    selectedCouponShow: false,
    usedCouponId: 0,
    isShowCouponList: false,
    bidAmount: '',
    selectCouponAmount: '',
    popupVisible: false,
    availableBalance: 0,
    valueActual: '',
    bankCode: '',
    bankName: '',
    bankLimit: []
  },

  mutations: {
    SET_PLAN_DETAIL(state, payload) {
      state.planDetailData = payload
    },
    SET_TOTAL_INTEREST(state, payload) {
      state.totalInterest = payload
    },
    SET_BEST_COUPON(state, payload) {
      state.bestCoupon = payload
    },
    SET_BEST_COUPON_SHOW(state, payload) {
      state.selectedCouponShow = payload
    },
    SET_USED_COUPON_ID(state, payload) {
      state.usedCouponId = payload
    },
    SET_AVAILABLE_COUPON(state, payload) {
      state.availableCoupons = payload
    },
    SET_UNAVAILABLE_COUPON(state, payload) {
      state.unAvailableCoupons = payload
    },
    SET_IS_SHOWCOUPONLIST(state, payload) {
      state.isShowCouponList = payload
    },
    SET_BIDAMOUNT(state, payload) {
      state.bidAmount = payload
    },
    SET_SELECTED_COUPON_AMOUNT(state, payload) {
      state.selectCouponAmount = payload
    },
    SET_POPUP_VISIBLE(state, payload) {
      state.popupVisible = payload
    },
    SET_PAY_ABLE(state, payload) {
      state.payAble = payload
    },
    SET_AVAILABLE_BALANCE(state, payload) {
      state.availableBalance = payload
    },
    SET_VALUE_ACTUAL(state, payload) {
      state.valueActual = payload
    },
    SET_BANK_INFO(state, payload) {
      state.bankCode = payload.bankCode
      state.bankName = payload.bankName
      state.bankLimit = payload.bankLimit
    }
  },

  actions: {
    planJoin({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        planJoin(payload).then(response => {
          console.log(response)
          commit('SET_PLAN_DETAIL', response.planDetailData)
          commit('SET_TOTAL_INTEREST', response.totalInterest)
          commit('SET_BEST_COUPON', response.bestCoupon)
          commit('SET_AVAILABLE_BALANCE', response.availablePoints)
          commit('SET_BANK_INFO', response)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },

    chooseBestCoupon({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        chooseBestCoupon(payload)
          .then(response => {
            commit('SET_BEST_COUPON', response.bestCoupon)
            commit('SET_BEST_COUPON_SHOW', response.hasCoupon)
            commit('SET_USED_COUPON_ID', response.bestCoupon.id)
            commit('SET_VALUE_ACTUAL', response.bestCoupon.valueActual)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    couponList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        couponList(payload)
          .then(response => {
            commit('SET_AVAILABLE_COUPON', response.dataList)
            commit('SET_UNAVAILABLE_COUPON', response.unusableList)
            commit('SET_IS_SHOWCOUPONLIST', true)
            commit('SET_POPUP_VISIBLE', true)
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    handChooseCoupon({ commit }, payload) {
      console.log('手动选择优惠券时传入store的优惠券：', payload.selectCoupon)
      commit('SET_IS_SHOWCOUPONLIST', false)
      commit('SET_BEST_COUPON_SHOW', true)
      commit('SET_POPUP_VISIBLE', false)
      commit('SET_USED_COUPON_ID', payload.id)
      commit('SET_BEST_COUPON', payload.selectCoupon)
      commit('SET_VALUE_ACTUAL', payload.selectCoupon && payload.selectCoupon.valueActual)
    },

    noChooseCoupon({ commit }) {
      commit('SET_IS_SHOWCOUPONLIST', false)
      commit('SET_BEST_COUPON_SHOW', false)
      commit('SET_POPUP_VISIBLE', false)
      commit('SET_VALUE_ACTUAL', '0')
    },

    changeBidAmount({ commit }, payload) {
      commit('SET_BIDAMOUNT', payload)
    },

    changeUsedCouponId({ commit }, payload) {
      commit('SET_USED_COUPON_ID', payload)
    }
  }
}

export default planBuy
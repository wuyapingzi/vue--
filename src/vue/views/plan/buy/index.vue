<template>
<div class="plan-buy">
  <mt-header class="header" title="红利智投">
    <router-link to="id" slot="left">
      <mt-button icon="back"></mt-button>
    </router-link>
  </mt-header>
  <plan-detail
    :planDetailData="planDetailData"
    :totalInterest="totalInterest"
    v-if="!isShowCouponList"
  ></plan-detail>
  <coupon-list 
    :availableCoupons="availableCoupons"
    :unAvailableCoupons="unAvailableCoupons"
    :bestCoupon="bestCoupon" 
    :isShowCouponList="isShowCouponList" 
    :selectedCouponShow="selectedCouponShow"
    :usedCouponId="usedCouponId"
    :showCouponList="showCouponList"
    :bidAmount="bidAmount"
    :popupVisible="popupVisible"
  ></coupon-list>
  <pay-way
    :availableBalance="availableBalance"
    :bidAmount="bidAmount"
    :valueActual="valueActual"
    :bankCode="bankCode"
    :bankName="bankName"
    :bankLimit="bankLimit"
  ></pay-way>
</div>
</template>

<script>
import planDetail from "./planDetail";
import couponList from "./coupon";
import payWay from "./pay"
import { mapState } from "vuex";
export default {
  name: "joinDetail",
  data() {
    return {
      id: 765,
      url: "/plan/" + this.id,
    };
  },
  created() {
    this.getPlanDetail();
  },
  components: {
    planDetail,
    couponList,
    payWay
  },
  computed: {
    ...mapState({
      planDetailData: state => state.planBuy.planDetailData,
      unAvailableCoupons: state => state.planBuy.unAvailableCoupons,
      availableCoupons: state => state.planBuy.availableCoupons,
      coupons: state => state.planBuy.coupons,
      totalInterest: state => state.planBuy.totalInterest,
      bestCoupon: state => state.planBuy.bestCoupon,
      selectedCouponShow: state => state.planBuy.selectedCouponShow,
      usedCouponId: state => state.planBuy.usedCouponId,
      isShowCouponList: state => state.planBuy.isShowCouponList,
      bidAmount: state => state.planBuy.bidAmount,
      popupVisible: state => state.planBuy.popupVisible,
      availableBalance: state => state.planBuy.availableBalance,
      valueActual: state => state.planBuy.valueActual,
      bankCode: state => state.planBuy.bankCode,
      bankName: state => state.planBuy.bankName,
      bankLimit: state => state.planBuy.bankLimit
    })
  },
  methods: {
    getPlanDetail() {
      this.$store.dispatch("planJoin");
    },
    showCouponList() {
      let data = {}
      data.id = this.id
      data.amount = this.bidAmount
      console.log('获取优惠券列表时出入input框的金额：', data)
      this.$store.dispatch('couponList', data)
    },
  }
};
</script>

<style lang='stylus' scoped>
.plan-buy
  background: #eee
.header
  background: #ffffff
  color: #333
  font-size: 18px
  line-height: 40px
  margin-bottom: 20px
</style>



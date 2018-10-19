<template>
  <div class="coupon">
    <div v-if="!isShowCouponList">
      <div class="coupon-title">优惠券</div>
      <div v-if="!selectedCouponShow">
        <div v-if="hasCoupons"  @click="showCouponList" class="coupon-detail">您有可用优惠券></div>
        <div v-else class="coupon-detail">无可用优惠券></div>
      </div>
      <div v-if="selectedCouponShow" @click="showCouponList">
        <div class="coupon-detail">-{{couponAmount}}元></div>
      </div>
    </div>
    <div>
      <mt-popup
        v-model="popupVisible"
        position="right"
        modal="false"
        class="coupon-list"
      >
        <mt-header title="选择优惠券" class="coupon-list-title">
        </mt-header>
        <div>
          <div v-if="!bidAmount && hasCoupons" class="coupon-use-tips">
            <span class="coupon-tips-icon"></span>
            请输入金额后使用
          </div>
          <div v-if="bidAmount">
            <div @click="noChooseCoupon" class="coupon-no-check">
              <input type="radio" name="usedCoupon" value="0" v-model="checkValue" :checked="usedCouponId == '0'" class="coupon-available-radio coupon-no-check-radio">
              <span :class="{'coupon-available-check-style': true , 'coupon-no-check-style': true, 'coupon-available-checked-style': 0 === usedCouponId}"></span>
              <div class="coupon-no-check-title">不选择优惠券</div>
            </div>
            <div class="coupon-disabled coupon-state">可用优惠券</div>
            <div
              v-for="(item, index) in availableCoupons"
              :key="index" 
              @click="handChooseCoupon"
              :class="{'unavailable-coupon-item': true, 'coupon-item': true, 'coupon-discount': item.couponType === 'DISCOUNT', 'coupon-available-discount': item.couponType === 'DISCOUNT', 'coupon-moneyoff': item.couponType !== 'DISCOUNT', 'coupon-available-moneyoff': item.couponType !== 'DISCOUNT'}"
            >
              <input
                type="radio"
                name="usedCoupon"
                v-model="checkValue"
                :value="item.id"
                :checked="usedCouponId == item.id"
                class="coupon-available-radio"
              >
              <span :class="{'coupon-available-check-style': true, 'coupon-available-checked-style': item.id === usedCouponId}"></span>
              <div class="coupon-rate coupon-available-rate" v-if="item.couponType === 'DISCOUNT'">{{item.dicountRate}}%抵扣率</div>
              <div class="coupon-money  coupon-available-money" v-if="item.couponType !== 'DISCOUNT'">{{item.derateAmount}}满减券</div>
              <span class="coupon-rate-limit coupon-available-limit" v-if="item.couponType === 'DISCOUNT'">满{{item.minInvestAmount}}元使用，最高{{item.maxDiscountAmount}}元</span>
              <span class="coupon-money-limit coupon-available-limit" v-if="item.couponType !== 'DISCOUNT'">满{{item.allowDerateInvest}}元使用</span>
              <div :class="{'actual-coupon-money': true, 'checked-coupon-money': item.id === usedCouponId}">-{{item.valueActual}}元</div>
            </div>
          </div>
          <div class="coupon-disabled coupon-state">不可用优惠券</div>
          <div>
            <div 
              v-for="(item, index) in unAvailableCoupons" 
              :key="item.id"
              :class="{'coupon-disabled': true, 'coupon-item': true, 'coupon-discount': item.couponType === 'DISCOUNT', 'coupon-moneyoff': item.couponType !== 'DISCOUNT'}"
            >
              <div class="coupon-rate" v-if="item.couponType === 'DISCOUNT'">{{item.dicountRate}}%抵扣率</div>
              <div class="coupon-money" v-if="item.couponType !== 'DISCOUNT'">{{item.derateAmount}}满减券</div>
              <span class="coupon-rate-limit" v-if="item.couponType === 'DISCOUNT'">满{{item.minInvestAmount}}元使用，最高{{item.maxDiscountAmount}}元</span>
              <span class="coupon-money-limit" v-if="item.couponType !== 'DISCOUNT'">满{{item.allowDerateInvest}}元使用</span>
            </div>
          </div>
        </div>
      </mt-popup>
    </div>
    
    <input type="hidden" :value="usedCouponId">
    
  </div>
  
</template>

<script>
import { Popup } from 'mint-ui';
export default {
  name: "coupon",
  data() {
    return {
    };
  },
  
  props: {
    availableCoupons: Array,
    unAvailableCoupons: Array,
    // coupons: Array,
    bestCoupon: Object,
    selectedCouponShow: Boolean,
    usedCouponId: Number,
    isShowCouponList: Boolean,
    showCouponList: Function,
    bidAmount: String,
    popupVisible: Boolean
  },
  computed: {
    showBestCoupon() {
      return JSON.stringify(this.bestCoupon) !== "{}";
    },
    couponAmount() {
      console.log('手动选择优惠券时设置最优的优惠券为选择的那个：', this.bestCoupon)
      return this.bestCoupon && this.bestCoupon.valueActual;
    },
    hasCoupons() {
      console.log('判断是否有可用优惠券', JSON.stringify(this.bestCoupon) !== "{}")
      return JSON.stringify(this.bestCoupon) !== "{}";
    },
    checkValue: {
      set(value) {
        value = Number(value)
        this.$store.dispatch('changeUsedCouponId', value)
      },
      get() {
        return this.$store.state.planBuy.usedCouponId
      },
    }
  },
  methods: {
    handChooseCoupon() {
      let data = {};
      data.couponId = this.checkValue;
      data.selectCoupon = this.availableCoupons.find((item) => item.id === this.checkValue)
      this.$store.dispatch("handChooseCoupon", data);
    },

    noChooseCoupon() {
      this.$store.dispatch('noChooseCoupon')
    }
  },
};
</script>

<style lang='stylus'>
$coupon-tips-color = #FEFCEC
$font-lighter-color = #999999
$white-color = #FFFFFF
$font-base-color = #333333
$container-bg-color = #EEEEEE
$border-lighter-color = #EFEFEF
$coupon-selected-color = #FD3636
.coupon
  background: $white-color;
  padding: 10px 20px;
  height: 50px;
  &-title
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    color: #333;
    float: left;
  &-detail
    line-height: 30px;
    float: right;
  &-disabled
    color: $font-lighter-color;
  &-list
    width: 100%
    height 100%
    background: $container-bg-color
  &-use-tips
    width: 100%
    height: 35px
    background: $coupon-tips-color
    line-height: 35px
    text-align: center
    color: $font-lighter-color
    font-size: 12px
    margin-bottom: 20px
  &-list-title
    width: 100%
    height: 40px
    background: $white-color
    color: $font-base-color
    font-size: 16px
    line-height: 40px
  &-discount
    position: relative
    &:before
      content: ''
      display: block
      width: 34px
      height: 34px
      left: 0
      top: 0
      position: absolute
      background: url('./unavailable-discount-coupon-icon.png') no-repeat center center
      background-size: contain
  &-available-discount
    &:before
      background: url('./available-discount-coupon-icon.png') no-repeat center center
      background-size: contain
  &-moneyoff
    position: relative
    &:before
      content: ''
      display: block
      width: 34px
      height: 34px
      position: absolute
      left: 0
      top: 0
      background: url('./unavailable-moneyoff-coupon-icon-2x.png') no-repeat
      background-size: contain
  &-available-moneyoff
    &:before
      background: url('./available-moneyoff-coupon-icon.png') no-repeat center center
      background-size: contain
  &-item
    padding: 14px 34px
    box-sizing: border-box
    overflow: hidden
  &-rate
    margin-left: 12px
    margin-bottom: 4px
    font-size: 15px
    line-height: 15px
    &-limit
      margin-left: 12px
      font-size: 12px
  &-money
    margin-left: 12px
    margin-bottom: 4px
    font-size: 15px
    line-height: 15px
    &-limit
      margin-left: 12px
      font-size: 12px
  &-available-rate
    color: $font-base-color
  &-available-money
    color: $font-base-color
  &-available-limit
    color: $font-lighter-color
  &-state
    padding-left: 20px
    margin-bottom: 10px
    margin-top: 20px
  &-item
    width: 100%
    height: 63px
    border-bottom: solid 1px $border-lighter-color
    background: $white-color
  &-tips-icon
    width: 13px
    height: 13px
    display: inline-block
    background: url('./coupon-use-tips-icon-2x.png') no-repeat center center
    background-size: contain
    margin-bottom: -2px
  &-available-radio
    position: absolute
    width: 17px
    height: 17px
    top: 24px
    left: 14px
    opacity: 0
  &-available-check-style
    float: left
    width: 16px
    height: 16px
    background: url('./coupon-available-radio-unchecked-style-2x.png') no-repeat center center
    background-size: contain
    overflow: visible
    margin-left: -20px
    margin-top: 10px
  &-available-checked-style
    background: url('./coupon-available-radio-checked-style-2x.png') no-repeat center center
    background-size: contain
  &-no-check
    height: 50px
    background: $white-color
    margin-top: 10px
    padding: 14px 34px
    box-sizing: border-box
    line-height: 22px
    position: relative
    &-style
      margin-top: 4px
      margin-left: -20px
    &-title
      margin-left: 12px
      font-size: 14px
      color: $font-base-color
    &-radio
      top: 18px
      z-index: 100
.actual-coupon-money
  float: right 
  font-size: 16px
  margin-top: -11px
  color: $font-base-color
.checked-coupon-money
  color: $coupon-selected-color
</style>

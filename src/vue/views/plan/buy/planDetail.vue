<template>
  <div class="plan-detail">
    <form action="" @submit.prevent="handlerSubmit">
      <label class="join-label">加入金额(元)</label>
      <div class="join-input-box">
        <input :placeholder="minInvest + '元起投，' + minIncrease + '元递增'"
          ref="bidAmount"
          v-model="bidAmount"
          @keyup="chooseBestCoupon"
          class="join-input"
        />
        <div class="error-message">{{errorMessage}}</div>
      </div>
      
      <div class="expect-income">预期收益：
        <span class="expect-income-value">{{expectedEarning}}</span>
        元
      </div>
      <div class="max-join">本期加入上限: {{maxJoinAmount}}元</div>
    </form>
  </div>
</template>

<script>

export default {
  name: "joinDetail",
  data() {
    return {
      errorMessage: ""
    };
  },
  props: {
    planDetailData: Object,
    totalInterest: String,
  },
  computed: {
    expectedEarning() {
      return this.bidAmount * this.totalInterest / 100 || 0;
    },
    minInvest() {
      return this.planDetailData.minRegisterAmount;
    },
    minIncrease() {
      return this.planDetailData.registerMultipleAmount;
    },
    maxJoinAmount() {
      return this.planDetailData.remainAmount;
    },
    bidAmount: {
      set(value) {
        this.$store.dispatch('changeBidAmount', value)
      },
      get() {
        return this.$store.state.planBuy.bidAmount
      }
    }
  },
  methods: {
    chooseBestCoupon() {
      let data = {}
      if (!this.bidAmount) {
        this.errorMessage = "请输入加入金额";
      } else if (
        this.bidAmount < this.minInvest ||
        (this.bidAmount - this.minInvest) % this.minIncrease !== 0
      ) {
        this.errorMessage = this.minInvest + "元起投，" + this.minIncrease + "元递增";
      } else if ((this.bidAmount > this.minInvest) && ((this.bidAmount - this.minInvest) % this.minIncrease == 0)){
        data.amount = this.bidAmount
        this.$store.dispatch("chooseBestCoupon", data);
        this.errorMessage = ""
        return;
      }
      this.$store.dispatch("noChooseCoupon");
    },
    handlerSubmit() {}
  }
};
</script>

<style lang='stylus'>
  $font-base-color = #333333
  $input-placeholder-color = #D1D6E0
  $expect-income-color = #FF7A7A
  $font-lighter-color = #9295A2
  $error-message-color = #FF4D41
  $font-size-small = 14px
  .plan-detail
    margin-top: 20px
    margin-bottom: 30px
    background: #ffffff
    padding: 10px 20px
    overflow: hidden
  .join-label
    font-size: 16px
    color: #333
    display: block
    margin-bottom: 20px
  .join-input
    border-top: none 
    border-left: none 
    border-right: none
    border-bottom-width: 1px
    padding: 5px 30px
    outline: none 
    box-shadow: none 
    font-size: 1.25rem
    font-weight: bold
    position: relative
    margin-bottom: 15px
    width: 315px
    &::placeholder
      color: $input-placeholder-color
      font-size: .9375rem
    &-box
      position: relative
      margin-bottom: 18px
      &:before
        content: '￥'
        display: block
        width: 28px
        height: 46px
        color: $font-base-color
        position: absolute
        left: 0
        top: 3px
        z-index: 1000
        font-size: 1.4375rem
        font-weight: bold
    &:before
      content: '￥'
      display: block
      width: 20px
      height: 20px
      font-weight: bold
      position: absolute
      left: 0
      color: black
  .expect-income
    font-size: 14px
    float: left
    color: $font-lighter-color
    &-value
      color: $expect-income-color
  .max-join
    float: right 
    font-size: 14px
    color: $font-lighter-color
  .error-message
    position: absolute
    left: 0
    top: 40px
    color: $error-message-color
    font-size: $font-size-small
</style>



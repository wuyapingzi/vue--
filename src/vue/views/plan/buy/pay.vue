<template>
  <div class="pay">
    <h2 class="pay-title">支付方式</h2>
    <div class="pay-content">
      <div :class="{'pay-way': true, 'pay-way-disabled': !payWay}">
        <div class="pay-way-detail">
          <div class="pay-way-title">可用余额</div>
          <div class="pay-way-desc">{{availableBalance}}元</div>
        </div>
        <div class="pay-able">支付{{payWay ? payAble : '0.00'}}元</div>
      </div>
      <div :class="['pay-way', bankCode ? bankCodeClass : '', payWay ? 'pay-way-disabled' : '']">
        <div class="pay-way-detail">
          <div class="pay-way-title">{{bankName}}</div>
          <span class="pay-way-desc">单笔限{{singleLimit}}，单日限{{dayLimit}}</span>
        </div>
        <div class="pay-able">支付{{!payWay ? payAble : '0.00'}}元</div>
      </div>
      <div class="pay-way pay-bind-card">
        <div class="pay-way-detail">
          <div class="bind-card">绑定银行卡</div>
        </div>
        <div class="bind-card-enter"></div>
      </div>
    </div>
    <input type="hidden" :value="payWay ? 'balance' : 'charge'">
  </div>
</template>

<script>
export default {
  name: 'pay',
  data() {
    return {

    }
  },
  methods: {

  },
  props: {
    availableBalance: Number,
    bidAmount: String,
    valueActual: String,
    bankCode: String,
    bankName: String,
    bankLimit: Object
  },
  computed: {
    payAble() {
      console.log('实际应该支付的金额：', parseFloat(Number(this.bidAmount) - Number(this.valueActual)))
      return parseFloat(Number(this.bidAmount) - Number(this.valueActual))
    },
    payWay() {
      console.log('用户约是否大于等于应付金额：', this.availableBalance >= (this.bidAmount - this.valueActual))
      return this.availableBalance >= (this.bidAmount - this.valueActual)
    },
    singleLimit() {
      return this.bankLimit[this.bankCode].single
    },
    dayLimit() {
      return this.bankLimit[this.bankCode].day
    },
    bankCodeClass () {
      return 'pay-bank-icon-' + this.bankCode
    }
  }
}
</script>

<style lang='stylus'>
  $font-lighter-color = #999999
  $white-color = #FFFFFF
  $font-base-color = #333333
  $container-bg-color = #EEEEEE
  $border-base-color = #EEEEF5
  $font-disabled-color = #9295A2
  _bgp()
    background-position: arguments
  $code = '0160' '0150' '0210' '0220' '5006' '5002' '0201' '5007' '5004' '5003' '5012' '5000' '5001' '5008' '5010' '5009' '5005' '0170' '5011' '5013' '1114' '0250' '5186'
  .pay
    width: 100%
    background: $white-color
    &-title
      font-size: .9375rem
      font-weight: normal
      height: 2.8125rem
      line-height: 2.8125rem
      border-bottom: solid 1px $border-base-color
      padding-left: .9375rem
      margin: .625rem 0 0
    &-content
      padding: 0 .9375rem
    &-way
      height: 4.1875rem
      padding: .9375rem 0 .9375rem 2.1875rem
      box-sizing: border-box
      &:before
        content: ''
        display: block
        width: 1.5rem
        height: 1.5rem
        position: absolute
        left: 0
        top: 1.3rem
      &:nth-child(1)
        border-bottom: solid 1px $border-base-color
        position: relative
        &:before
          background: url('./img/plan-bau-balance-pay-icon.png') no-repeat center center
          background-size: contain
      &-title
        font-size: .875rem
      &-desc
        font-size: .75rem
        color: $font-lighter-color
        margin-top: .4375rem
      &-disabled
        color: $font-disabled-color
        .pay-way-desc
          color: $font-disabled-color
    &-able
      float: right
      font-size: .875rem
      margin-top: -1.6rem
    &-bind-card
      position: relative
      &:before
        background: url('./plan-buy-bind-card.png') no-repeat
        background-size: contain
      .bind-card
        line-height: 2.093rem
        &-enter
          width: .5rem
          height: .875rem
          float: right
          margin-top: -1.6rem
          background: url('./plan-buy-bind-card-enter.png') no-repeat
          background-size: contain
  for code, index in $code
    .pay-bank-icon-{code}
      position: relative
      &:before
        background:url('./plan-buy-bank-logo.png') no-repeat
        _bgp(0px, (-53*index)px)
        background-size: cover
</style>

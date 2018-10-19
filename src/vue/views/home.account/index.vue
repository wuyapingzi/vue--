<template>
  <div class="detail " v-if="isLogin && accountInfo.isCreatEscrow">
  <!-- <div class="detail "> -->
    <router-link class="account" to="/account" tag="div">
      <span>查看我的账户</span>
    </router-link>
    <div class="yesterdy-earning">
      <span class="earn-title">昨日收益（元）</span>
      <p>{{accountInfo.earn}}1111</p>
    </div>
    <div class="account-detail clearfix">
      <div class="detail-item item-income">
        <span class="earn-title">累计收益（元）</span>
        <span>{{accountInfo.earn}}</span>
      </div>
      <div class="detail-item item-money">
        <span class="earn-title">可用金额（元）</span>
        <span>{{accountInfo.earn}}</span>
      </div>
    </div>
  </div>
  <div class="escrow" v-else-if="isLogin && !accountInfo.isCreatEscrow">
    <span>红小宝携手恒丰银行完成资金存管</span>
    <router-link to="/escrow">立即开通存管账户>></router-link>
  </div>
  <div class="login" v-else>
    <router-link to="/singup">注册立得1855元优惠券，立即注册>></router-link>
    <router-link to="/login">已有账户，立即登录>></router-link>
  </div>
</template>

<script>
export default {
  name: 'homeAccount',
  props: {
    isLogin: {
      type: Boolean,
    },
    accountInfo: {
      default: function () {
        return {}
      },
      type: Object,
    },
  },
  computed: {

  },
}
</script>

<style lang="stylus" scoped>
  .escrow
  .login
  .detail
    padding: 0 15px 25px 
    background: #fff
  .escrow
  .login
    a 
      text-decoration: none
      margin: 0 auto
      display: block
      background-image: linear-gradient(-135deg, #FF8359 0%, #FF413C 100%)
      border-radius: 2px
      width: 345px
      height: 35px
      line-height: 35px
      font-size: 15px
      color: #FFFFFF
      text-align: center
      margin-bottom: 10px
  .detail
    .earn-title
      font-size: 12px
      color: #666666
      letter-spacing: 0.6px
      text-align: right
    .item-income
      float: left
    .item-money
      float: right
    p  
      font-size: 32px
      color: #333333
      letter-spacing: 1.37px
      line-height: 32px
</style>

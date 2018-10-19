<template>
  <div class="account">
    <mt-header class="header" title="账户详情">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="detail">
      <mt-cell :title="replaceMobile" class="avatar" style="font-size: 12px">
        <span @click="logout" style="color: #4C66E7">安全退出</span>
        <img slot="icon" src="./icon-avatar.png" width="30" height="30">
      </mt-cell>
      <div class="account-info">
        <div class="interest-data">
          <router-link to="/account/assets" tag="div" class="interest-data-detail">
            <label>昨日收益（元）</label>
            <span class="yesterday-interest">{{yesterdayInterest}}</span>
            <div class="interest">
              <span>累计收益 {{earnTotal}}</span><span>资产总额 {{assetsTotal}}</span>
            </div>
          </router-link>
          <div class="eys" @click="safeAssets"></div>
        </div>
        <div class="available">
          <span class="available-point">
            <label>可用金额</label>{{availablePoint}}
          </span>
          <div>
            <router-link to="/charge" tag="span">
              <button class="recharge">充值</button>
            </router-link>
            <router-link to="/withdraw">
              <button class="withdraw">提现</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="welfare">
      <h4>我的福利</h4>
      <mt-cell title="优惠券" to="/splash" is-link class="account-cell">
        <span>你有<label>3</label>张优惠券</span>
        <img slot="icon" src="./icon-coupon.png" width="22" height="15">
      </mt-cell>
      <mt-cell title="邀请好友" to="/splash" class="account-cell">
        <img slot="icon" class="invite-icon" src="./icon-invite-friend.png" width="16" height="23">
      </mt-cell>
    </div>
    <div class="assets">
      <h4>我的资产</h4>
      <mt-cell title="红利智投" to="/account/plan" is-link class="account-cell">
        <span>10000元</span>
        <img slot="icon" src="./icon-plan.png" width="21" height="16">
      </mt-cell>
      <mt-cell title="散标债权" to="/account/loan" is-link class="account-cell">
        <span>10000元</span>
        <img slot="icon" src="./icon-loan.png" width="21" height="17">
      </mt-cell>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {safeMobile, desensitizaMoney} from 'utils/util'
import { conditionalExpression } from 'babel-types';

export default {
  name: 'account',
  data() {
    return {
      isDesensitiza: false
    }
  },
  computed: {
    ...mapState({
      // 用户相关数据
      // isLogin: state => state.user.isLogin,
      accountInfo: state => state.account.accountInfo
    }),
    replaceMobile() {
      return safeMobile(this.accountInfo.userInfo.mobile)
    },
    yesterdayInterest() {
      const money = this.accountInfo.userAssets.yesterdayInterest.toFixed(2)
      return desensitizaMoney(money, this.isDesensitiza)
    },
    earnTotal() {
      const money = this.accountInfo.userAssets.financePlanSumPlanInterest.toFixed(2)
      return desensitizaMoney(money, this.isDesensitiza)
    },
    assetsTotal() {
      const money = this.accountInfo.userAssets.assetsTotal.toFixed(2)
      return desensitizaMoney(money, this.isDesensitiza)
    },
    availablePoint() {
      return this.accountInfo.userAssets.availablePoint.toFixed(2)
    }
  },
  created() {
    this.getAccountInfo()
  },
  methods: {
    getAccountInfo() {
      this.$store.dispatch('getAccountInfo')
    },
    logout() {
      console.log(123)
    },
    safeAssets() {
        this.isDesensitiza = !this.isDesensitiza
    },
  }
}
</script>

<style lang="stylus">
  .avatar
    height 40px
  .account-info
    background: white
  .interest-data
    display flex
    justify-content space-between
    align-items: center
    padding 15px 15px 0
    &-detail
      flex: 1
    label
      display block
      height 34px
      line-height 34px
      padding-bottom 10px
    .yesterday-interest
      display: block
      height 40px
      font-size: 30px
      line-height 40px
      font-weight 600
      color #333
  .interest
    height 42px
    font-size: 12px
    line-height 42px
    span
      display: inline-block
      height: 12px
      line-height: 12px
      &:first-child
        padding-right 20px
        border-right 1px solid #333
      &:last-child
        padding-left 20px
  .eys
    height 40px
    width 40px
    background: url('./icon-eye-open.png') center center no-repeat
  .available
    display: flex
    justify-content: space-between
    align-items: center
    padding: 15px
    color: red
    border-top: 1px solid #EEEEF5
    label
      margin-right 5px
      font-size: 14px
      line-height 14px
      color: #333
    button
      height 28px
      width 70px
      border: 0
      border-radius: 4px
    .recharge
      margin-right 5px
      background-image: linear-gradient(45deg, #FF8359 0%, #FF413C 100%)
      color: #FFFFFF
    .withdraw
      border: 1px solid #FF4E4E
      background: #FFFFFF
      color: #FF4E4E
  .account
    min-height: 100%
    padding-bottom 10px
    background: #F5F5F9
    font-size: 12px
    .mint-cell-wrapper
      font-size: 12px
      padding: 0 15px
      img
        margin-right 8px
      .invite-icon
        margin: 0 12px  0 3px
    &-cell
      height 48px
      &:nth-of-type(1)
        border-bottom: 1px solid #F5F5F9
  .welfare, .assets
    margin-top: 10px
    color: #333333;
    h4
      height 48px
      padding-left 15px
      margin 0
      line-height 48px
      font-size: 14px
      background: white
    label
      color: red
    .mint-cell-title
      font-size: 14px
</style>

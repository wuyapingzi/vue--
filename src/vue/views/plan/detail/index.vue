<template>
  <div>
    <div class='plan-top'>
      <mt-header :title="planDetail.name">
        <router-link to="/" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header> 
      <div class='plan-top-rate'>
        <div>
          {{planDetail.baseInterestRate}}
          <span>%+{{planDetail.extraInterestRate}}%</span>
        </div>
        <div class='plan-top-rate-intro'>平均历史年化收益</div>
      </div> 
      <div class='plan-top-info'>
        <span>{{planDetail.extendLockPeriod}}</span>
        <div>使用出借期限(月)</div>
      </div>
      <div class='plan-top-info'>
        <span>{{planDetail.amount}}</span>
        <div>总金额(元)</div>
      </div>
    </div>
    
    <mt-cell
      title="恒丰银行存管"
      to="http://192.168.1.28:3300/"
      is-link
      value='安全合规'>
      <img src='./hengfeng-icon.png' slot="icon" width="32" height="24">
    </mt-cell>
    <process 
      :status='unifyStatus' 
      :lockPeriodDate='planDetail.lockPeriod' 
      :beginSellingTime='planDetail.beginSellingTime' 
      :lockStartTime='planDetail.lockStart' 
      :endLockingTime='planDetail.endLockingTime'></process>
    <div class='plan-body-intro'>
      <intro 
        titlt='收益处理方式' 
        :con='planDetail.cashType=="HXB"?planDetail.interestDate:planDetail.incomeApproach'></intro>
      <intro 
        titlt='起投金额' 
        :con='planDetail.minRegisterAmount'></intro>
      <intro 
        titlt='到期退出方式' 
        :con='planDetail.quitWaysDesc'></intro>
    </div>
    <div>
      <mt-cell title="待成交散标列表" to='/invest' is-link></mt-cell>
      <mt-cell title="加入记录" :to="{name: 'join', params: {planId: planDetail.id}}" is-link></mt-cell>
      <mt-cell title="服务协议" to='/' is-link></mt-cell>
    </div>
    <div class='plan-footer'>
      预计收益不代表实际收益，出借需谨慎
    </div>
    <float 
      :login='isLogin' 
      :status="planDetail.orderStatu" 
      :endTime="planDetail.beginSellingTime" 
      :diffTime="planDetail.diffTime">
    </float>
  </div> 
</template>

<script>
  import intro from './intro.vue'
  import process from './process.vue'
  import float from './float.vue'
  export default {
    name: 'plan',
    data() {
      return {
        unifyStatus: ''
      }
    },
    components: {
      intro,
      process,
      float
    },
    computed: {
      isLogin() {
        return this.$store.getters.isLogin
      },
      planDetail() {
        this.unifyStatus = this.$store.state.plan.detailData.unifyStatus
        return this.$store.state.plan.detailData
      }
    },
    mounted() {
      this.$store.dispatch('planDetail')
    }
  }
</script>

<style lang='stylus' scoped>
  $white-color = #fff
  $plan-bg-first-color = #FF413C
  $plan-bg-last-color = #FF8359
  $plan-footer-color = #9295A2
  $rate-size = 50px
  $small-size = 12px
  $huge-size = 22px
  $middle-size = 16px
  .mint-header
    background: transparent
  .mint-cell
    background: $white-color
  .plan-top
    color: $white-color
    background: linear-gradient(-135deg, $plan-bg-first-color 0%, $plan-bg-last-color 100%)
    text-align: center
    &-rate 
      margin-top: 20px
      font-size: $rate-size
      &-intro
        font-size: $small-size
        margin-bottom: 30px
      span
        font-size: $huge-size
        margin-left: -12px
    &-info
      width: 49%
      display: inline-block
      margin-bottom: 21px
      span
        font-size: $middle-size
      div
        font-size: $small-size
        margin-top: 10px
      &:first-child
        border-right: 1px solid $white-color
  .plan-body-intro
    background: $white-color
    margin: 10px 0
  .plan-footer
    padding: 10px 0 64px
    text-align: center
    font-size: $small-size
    color: $plan-footer-color
</style>


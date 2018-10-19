<template>
  <div class="account-withdraw-list">
    <mt-header class="base-title" title="提现记录">
      <router-link to="/account/withdraw" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="account-withdraw-list-item">
      <dl class="item-time item-time-handling">
        <dt>27日</dt>
        <dd>12:23</dd>
      </dl>
      <dl class="item-record">
        <dt>
          100元
          <span class="item-record-bank">兴业银行(尾号1234)</span>
        </dt>
        <dd>
          <span class="item-record-handling">处理中</span> 
          申请成功，等待银行处理
        </dd>
      </dl>
    </div>
    <div class="account-withdraw-list-item">
      <dl class="item-time item-time-success">
        <dt>27日</dt>
        <dd>12:23</dd>
      </dl>
      <dl class="item-record">
        <dt>
          100.00元
          <span class="item-record-bank">兴业银行(尾号1234)</span>
        </dt>
        <dd>
          <span class="item-record-success">提现成功</span> 
          预计2018-4-28到账
        </dd>
      </dl>
    </div>
    <div class="account-withdraw-list-item">
      <dl class="item-time item-time-faile">
        <dt>27日</dt>
        <dd>12:23</dd>
      </dl>
      <dl class="item-record">
        <dt>
          100元
          <span class="item-record-bank">兴业银行(尾号1234)</span>
        </dt>
        <dd>
          <span class="item-record-faile">提现失败</span> 
          银行账户信息有误
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accountWithdrawList',
  data(){
    return{}
  },
  mounted(){
    this.queryWithdrawList()
  },
  computed: {

  },
  methods:{
    queryWithdrawList(){
      console.log('进入查询提现记录')
      const {dispatch} = this.$store
      dispatch('getAccountWithdrawList').then(res => {
        console.log('获取提现记录  返回到组件  的结果', res)
      }).catch(err => {
        console.log('获取提现记录  返回到组件   的结果出错   ', err)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  $white-color = #ffffff
  $gray-color-deep = #333333
  $list-time-color = #9295A2
  $list-time-border = #F5F5F9
  $list-record-handling = #4C66E7
  $success-color =  #D1A97F
  $faile-color = #FF413C
  .account-withdraw-list
    &-item
      display: flex
      justify-content: space-around
      background-color: $white-color
      padding: 0 1rem
      height: 4.75rem
      dt 
        font-size: 0.875rem
        color: $gray-color-deep
      dd 
        margin: 0.625rem 0 0 0
        font-size: 0.75rem
      .item-time
        position: relative
        padding-right: 10%
        &:before
          content: ''
          width: 0.563rem
          height: @width 
          border-radius: @width 
          position: absolute 
          top: 0
          right: -0.25rem
          margin-left: .25rem
          z-index: 1
        &:after 
          content: ''
          width: 1px
          height: 4.75rem
          position: absolute
          top: -1rem
          right: 0
          border-right: 1px solid $list-time-border
        &-handling 
          &:before 
            background-color: $list-record-handling
        &-success 
          &:before
            background-color: $success-color
        &-faile 
          &:before
            background-color: $faile-color
        dd 
          margin: 0.3125rem 0 0 0
          color: $list-time-color
      .item-record 
        width: 80%
        padding-left: 10%
        &-bank 
          float: right  
          font-size: 0.75rem
          color: $list-time-color
        &-handling 
          color: $list-record-handling
        &-success 
          color: $success-color
        &-faile 
          color: $faile-color


</style>

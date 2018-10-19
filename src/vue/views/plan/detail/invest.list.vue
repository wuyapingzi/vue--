<template>
  <div>
    <mt-header title="待成交散标">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header> 
    <div class='item' v-for="val in investList">
      <div class='item-amount'>
        <span>{{val.amount}}</span>
        <span>借款金额</span>
      </div>
      <div class='item-loan'>
        <span class='item-title'>{{val.title}}(等级{{val.riskLevel}})</span>
        <div class='item-month'>
          <span>借款期限：</span>  
          <span>{{val.months}}个月</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'invest',
    data() {
      return {}
    },
    computed: {
      investList() {
        console.log(this.$store.state.plan.investList,'111')
        return this.$store.state.plan.investList
      }
    },
    created() {
      const { dispatch } = this.$store
      dispatch('investList')
    }
  }
</script>

<style lang="stylus" scoped>
  $header-bg = #ffffff
  $header-color = #333333
  $first-color = #FF413C
  $last-child = #9295A2
  $month-color = #151515
  $middle-size = 16px
  $large-size = 18px
  $small-size = 12px
  .mint-header
    background-color: $header-bg
    color: $header-color
    font-size: $large-size
    margin-bottom: 10px
  .item
    box-sizing: border-box
    margin: 10px
    height: 74px
    background: $header-bg
    padding: 22px 15px 18px
    &-amount
      width: 40%
      display: inline-block
      span
        display:block
        &:first-child
          color:  $first-color
          font-size: $middle-size
        &:last-child
          color: $last-child
          font-size: $small-size
          line-height: 18px
    &-loan
      width: 50%
      display: inline-block
    &-title
      color: $header-color
      font-size: $small-size
    &-month
      color: $last-child
      font-size: $small-size
      span:last-child
        color: $month-color
        line-height: 18px
</style>
<template>
  <div>
    <div v-if='show' class='J_deposit-account'>
      <div class='depository-supernatant'></div>
      <div class='depository-main'>
        <img src="./deposit-account.png">
        <div class='depository-text'>开通恒丰资金存管 保障账户资金安全</div>
        <router-link to='/depository/open' class='depository-btn'>开通恒丰银行存管账户</router-link>
        <div class='depository-close'>
          <span @click='closeHandler'>暂不开通</span>
        </div>
      </div>
      <div class='depository-x' @click='closeHandler'>
        <img src="./deposit-close.png">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'depositModal',
    data(){
      return {
        show: true
      }
    },
    methods: {
      closeHandler(){
        this.show = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .depository
    &-supernatant 
      position: absolute
      left: 0
      top: 0
      right: 0
      bottom: 0
      background-color: #000
      opacity: .5 
    &-main
      position: absolute
      top: 40%
      left: 50%
      width: 80%
      text-align: center
      background: #fff
      color: #E3BF80 
      transform: translate(-50%, -50%)
      margin: 0 auto
      img
        width: 100%
    &-text
      font-size: 14px
      margin: 20px auto
    &-btn
      width: 80%
      height: 36px
      color: #fff
      font-size: 14px
      text-align: center
      display: inline-block
      line-height: 36px
      background: #E3BF80
      margin: 0 auto
      text-decoration: none
      border-radius: 4px
    &-close
      width: 80%
      margin: 10px auto
      text-align: right
      color: #999
      font-size: 14px
    &-x
      position: absolute
      bottom: 15%
      left: 50%
      width: 30px
      height: 30px
      transform: translate(-50%, -50%)
      margin: 0 auto
      img
        width: 100%
</style>
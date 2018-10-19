<template>
  <div>
    <mt-header class="base-title" title="银行卡信息">
      <router-link to="/account/recharge" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="account-unbindcard-container">
      <accountBankcard></accountBankcard>
      <mt-button @click="bankcardUnbind" class="account-unbindcard-btn">解绑</mt-button>
      <router-link class="account-banklist-show" to="/banklist" >查看其他银行限额</router-link>
      <div v-if="isShowThirdpartForm">
        <thirdpartForm :thirdpartRes="thirdpartRes"></thirdpartForm>
      </div>
    </div>
  </div>
  


</template>

<script>
import accountBankcard from './account.bankcard.info'
import thirdpartForm from '../thirdpart/thirdpart.form'
import { Toast } from 'mint-ui'

export default {
  name: 'accountBankcardUnbind',
  data(){
    return {
      thirdpartRes: {
        result: {},
        url: '',
      },
      isShowThirdpartForm: false,
    }
  },
  methods: {
    bankcardUnbind(){
      Toast({
        message:'正在跳转至恒丰银行 ',
        position: 'middle',
        duration: 2000,
        iconClass: 'icon icon-success'
      })
      const { dispatch } = this.$store;
      dispatch('postBankcardUnbind').then(res => {
        console.log('发送action。。。解绑银行卡获取发送给懒猫的数据结果', res)
        this.thirdpartRes = res;
        this.isShowThirdpartForm = true;

      }).catch(err => {
        console.log('发送action。。。解绑银行卡获取发送给懒猫的数据结果出错==', err)
        this.isShowThirdpartForm = false;
      })
    }
  },
  components:{
    accountBankcard,
    thirdpartForm,
  }

}
</script>

<style lang="stylus">
  $base-gray = #333333
  $tips-bg = #FEFCEC
  $tips-color = #D1A97F
  $white-color = #ffffff
  $input-border = #EEEEF5
  $rooter-link-color = #4C66E7
  .base-title
    background-color: $white-color
    color: $base-gray
  .account-unbindcard
    &-container
      position: relative
      margin-top: 0.625rem
      padding: 0 1rem
    &-btn 
      color: $white-color
      font-size: 0.875rem
      position: absolute
      top: 1rem
      right: 2rem
      background-color: rgba(255,255,255,.1)
      height: 1.6rem
      border: 1px solid $white-color
      border-radius: 2px
  .account-banklist-show
    display: block
    text-decoration: none
    color: $rooter-link-color
    font-size: 0.875rem
    margin-top: 1.25rem
</style>



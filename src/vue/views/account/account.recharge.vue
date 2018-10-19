<template>
  <div>
    <mt-header class="base-title" title="充值">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="account-funds-using-tips">
      <span class="icon-tips"></span>
      如银行限额不足或不能使用，可
      <router-link class="account-funds-change-bankcard" to="/account/bankcard">
        更换其他银行卡
      </router-link>
    </div>
    <div class="account-funds">
      <accountBankcard class="account-funds-bankcard"> </accountBankcard>
      <div class="account-funds-form">
        <form action="" method="post" ref="rechargeForm" @submit.prevent="handlerSubmit">
          <p class="account-funds-form-amount">充值金额(元)</p>
          <label for="" class="form-amount">
            <span class="form-amount-yen">&yen;</span>
            <input class="form-amount-num"  type="text" ref="amount"
            name='amount' maxlength='9' autocomplete='off' placeholder='最小充值金额为1.00元' 
            v-model="rechargeForm.inputAmount"
            @keyup="parseAmount" @blur="parseAmount"
            >
          </label>
          <input type="hidden" name="_csrf" >
          <div class="account-funds-banlance">
            可用余额：
            <span> {{accountAssets.availablePoint}}</span>
            元
          </div>
          <div class="error-message" :class="{'error-hide': !isShowError,'error-show': isShowError}"> {{errMsg}} </div>
          <button class="form-submit" :disabled="disableSubmit"> 充值 </button>
        </form>
      </div>
      <div v-if="isShowThirdpartForm">
        <thirdpartForm :thirdpartRes="thirdpartRes"></thirdpartForm>
      </div>
      <div class="account-funds-contact-us">
        如有疑问可联系红小宝客服
        <a href="tel:400-1552-888">400-1552-888</a>
      </div>
    </div>
    
  </div>
</template>

<script>
import accountBankcard from './account.bankcard.info'
import { mapState } from 'vuex'
import Validator from '@/utils/validate'
import thirdpartForm from '../thirdpart/thirdpart.form'

const validateAmount = (rule, value, callback) => {
  console.log('value 验证输入的金额---------------', value)
  if(!value){
    callback(new Error('充值金额不能为空'))
  }else if(value < 1 ){
    callback(new Error('充值金额不能小于1元'))
  }else{
    callback()
  }
}
const rechargeRules = {
  inputAmount: { type: 'string', require: true, validator: validateAmount }
}

export default {
  name: 'accountRecharge',
  data(){
    return{
      rechargeForm:{
        inputAmount: '',
      },
      thirdpartRes: {
        result: {},
        url: '',
      },
      isShowError: false,
      errMsg: '',
      disableSubmit: false,
      isShowThirdpartForm: false,
    }
  },
  computed: mapState({
    accountAssets: state => state.account.accountInfo.userAssets,
  }),
  
  mounted(){
    this.queryAccountInfo()
  },
  methods: {
    queryAccountInfo(){
      console.log('进入 queryAccountInfo');
      const { dispatch } = this.$store;
      dispatch('getAccountInfo')
    },
    parseAmount: function(){
      if(isNaN(this.rechargeForm.inputAmount)){
        this.isShowError = true;
        this.errMsg = '不能包含特殊字符';
        this.disableSubmit = true;
        return false;
      }
      this.isShowError = false;
      this.disableSubmit = false;
      console.log('data.inputAmount,', this.rechargeForm.inputAmount)
      this.rechargeForm.inputAmount = this.rechargeForm.inputAmount
        .replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        .replace(/\b(0+)/, '');
    },
    handlerSubmit(e){
      const data = this.rechargeForm;
      const { dispatch } = this.$store;
      const rechargeValidator = new Validator(rechargeRules)
      rechargeValidator.validate(data, (errors => {
        if(errors){
          this.isShowError = true;
          this.disableSubmit = true;
          this.errMsg = errors[0].message;
          return;
        }
        const data = {
          amount: this.rechargeForm.inputAmount
        }
        dispatch('postAccountRecharge', data).then(res => {
          console.log('发送action  充值请求结果', res)
          this.thirdpartRes = res
          this.isShowThirdpartForm = true
        }).catch(err => {
          console.log('发送action  充值请求结果出错', err)
          this.isShowThirdpartForm = false
        })
      }))
    },
  },
  components:{
    accountBankcard,
    thirdpartForm,
  },
}
</script>

<style lang="stylus">
  $base-gray = #333333
  $tips-bg = #FEFCEC
  $tips-color = #D1A97F
  $white-color = #ffffff
  $input-border = #EEEEF5
  .base-title
    background-color: $white-color
    color: $base-gray
  .error-show
    display: block
  .error-hide 
    display: none
  .error-message 
    position: absolute
    bottom: 5rem
    width: 100%
    text-align: center
    font-size: 0.75rem
    color: red
  .account-funds
    padding: 0 0.625rem
    &-using-tips
      width: 100%
      height: 2.25rem
      line-height: 2.25rem
      color: $tips-color
      font-size: 0.875rem
      background-color: $tips-bg
      text-align: left
      margin-top: 0
      position: relative
      text-indent: 1rem
      .icon-tips
        display: block 
        position: absolute 
        top: 0.5rem 
        left: 0.5rem
        width: 1.06rem
        height: 1rem
        background: url('/@/assets/img/icon-reminder.png')
    &-bankcard 
      margin-top: 1rem
    &-form 
      position: relative
      padding: 1.875rem 0
      .form-amount
        display: block
        position: relative
      .form-amount-num
        display: block
        width: 100%
        height: 3.94rem
        line-height 3.94rem
        border: none 
        border-bottom: 1px solid $input-border
        text-indent: 1.2rem
        &::input-placeholder
          font-size: 0.75rem
        &:placeholder
          font-size: 0.75rem
        &:focus
          outline: none 
          border-bottom: 1px solid #FF413C
      .form-amount-yen 
        display: block
        font-size: 1.5rem
        position: absolute
        top: 1.2rem
        left: 0
        color: $base-gray
      .form-submit
        display: block
        width: 90%
        height: 2.56rem
        line-height: 2.56rem
        text-align: center
        margin: 3.75rem auto 0
        border: none 
        background-image: linear-gradient(-135deg, #FF413C 0%, #FF8359 100%)
        border-radius: 0.25rem
        color: $white-color
        
      &-amount 
        color: $base-gray
        font-size: 0.875rem
        margin-bottom: 0
      
    &-banlance 
      font-size: 0.75rem
      color: #9295A2
      margin-top: 0.625rem
      span
        color: #FF8359
    &-contact-us 
      margin-top: 3rem
      text-align: center
      font-size: 0.875rem
      color: $base-gray
      a 
        display: block
        text-decoration: none
        margin-top: 0.313rem
</style>



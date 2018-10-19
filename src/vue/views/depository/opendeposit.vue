<template>
  <div>
    <div>
      <mt-header title="开通存管账户">
        <router-link to="/" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header> 
    </div>
    <form ref='depositForm' @submit.prevent='handlerSubmit'>
      <div class="depository-info">
        <h3>安全认证</h3>
        <p>按国家规定投资用户需满18岁</p>
      </div>
      <div class='form-control'>
        <input 
        placeholder="请输入您的真实姓名" 
        v-model="depositForm.username" 
        ref="username"
        type='text' >
      </div>
      <div class='form-control form-id'>
        <input 
        placeholder="请输入您的身份证号"
        v-model="depositForm.idcard" 
        ref="idcard"
        type='number' 
        max-length='25'>
      </div>
      
      <div class="depository-info">
        <h3>银行卡</h3>
        <p>实名认证与银行卡需为同一人</p>
      </div>
      <div class='form-control form-backcard'>
        <input 
        type="number" 
        placeholder="请输入您的银行卡号" 
        v-model="depositForm.bankNumber" 
        @blur='selesctBankHandler' 
        ref="bankNumber" >
        <router-link to='/bank/limit' class='bank-limit'>查看银行限额</router-link>
      </div>
      <div class='form-submit'>
        <div v-if="isShowError" class="error">{{error}}</div>
        <mt-button size="large" class="depository-btn">开通恒丰银行存管账户</mt-button>
      </div>
    </form>
  </div> 
</template>

<script>
  import Validator, { reNickName, checkIdentityCard, reBankCardNo } from '@/utils/validate'
  import { Toast } from 'mint-ui'

  const validateNickName = (rule, value, callback) => {
    if(!reNickName(value)){
      callback(new Error('请输入正确的真实姓名'))
    }else{
      callback()
    }
  }

  const validateIdentityCard = (rule, value, callback) => {
    if(!checkIdentityCard(value)){
      callback(new Error('请输入正确的身份证号'))
    }else{
      callback()
    }
  }

  const validateBankCardNo = (rule, value, callback) => {
    if(!reBankCardNo(value)){
      callback(new Error('请输入正确的银行卡号'))
    }else{
      callback()
    }
  }

  const depositRules = () => {
    let rules = {
      username: [{type: 'string', required: true,  validator:validateNickName}],
      idcard: [{type: 'string', required: true,  validator:validateIdentityCard}],
      bankNumber: [{type: 'string', required: true,  validator:validateBankCardNo}]
    }
    return rules
  }
  export default {
    name: 'deposit',
    data(){
      return {
        depositForm: {
          username: '杜杜',
          idcard: '130623199508210947',
          bankNumber: '6212260200119844948'
        },
        isShowError: false,
        error: ''
      }
    },
    created(){
      console.log('111',this.$store.getters.userState)
    },
    methods: {
      handlerSubmit(e){
        let data = this.depositForm
        const depositValidator = new Validator(depositRules())
        depositValidator.validate(data, {firstFields: false}, (errors, fields) => {
          if(errors){
            this.isShowError = true
            this.error = errors[0].message
            return 
          }else {
            Toast({
              message: '正在跳转恒丰...',
              duration: 2000
            })
            const { dispatch } = this.$store
            setTimeout(function(){
              dispatch('depositoryAccount', data)
            }, 2000)
          }
        })
      },
      selesctBankHandler(){
        let bankNumber = this.depositForm.bankNumber
        if(!bankNumber){
          this.isShowError = true
          this.error = '银行卡号不能为空'
          return
        }else{
          this.$store.dispatch('selectBank')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  body
    box-sizing: border-box
  .mint-header
    background: #003D7E
    font-size: 18px
  .depository-info
    margin-top: 40px
    text-align: center
  h3 
    font-size: 15px
    color: #003D7E
    line-height: 15px
    &::after,&::before
      content: ''
      width: 5px 
      height: 5px
      display: inline-block
      border-radius: 50%
      background:#003D7E
      vertical-align: middle
      margin: 0 10px
  p
    font-size: 12px
    color: #999999
    line-height: 12px
    margin-bottom: 16px
  .form-control
    padding-left: 40px
    height: 60px
    background: url('./name.png') no-repeat 0 20px
    background-size: 20px 20px 
    margin: 0 15px
    border-bottom: 1px solid #ddd
    input
      border: none
      line-height: 58px
      outline: none
      width: 100%
  .form-backcard
    background-image: url('./card.png') 
    position: relative
  .form-id
    background-image: url('./id.png')
  .form-submit
    margin: 60px 10% 0
    width: 80%
    position: relative
  .bank-limit
    color: #5E95FF
    font-size: 14px 
    text-decoration: none
    position: absolute
    right: 0
    top: 23px
  .depository-btn
    background: #E3BF80
    color: #fff
    font-size: 16px
    &:after
      background: transparent
  .error  
    color: #f55151
    position: absolute
    font-size: 14px
    left: 0
    top: -28px
</style>

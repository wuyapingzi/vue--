<template>
  <div class="login-wrapper">
    <mt-header class="header" fixed title="登录红小宝">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <form ref="loginForm" @submit.prevent="handlerSubmit">
      <mt-field label="手机号" placeholder="请输入手机号" type="nubmer"
        class="form-control"
        ref="username"
        v-model="loginForm.username">
      </mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password"
        class="form-control"
        ref="password"
        v-model="loginForm.password">
      </mt-field>
      <div v-if="isShowCaptcha" class="form-control">
        <mt-field label="验证码" placeholder="请输入图片验证码" type="text"
          ref="captcha"
          v-model="loginForm.captcha"
          class="input-small"
        ></mt-field>
        <img
          :src="captchaUrl"
          alt='看不清，点击刷新'
          @click="captchaChange"
          class="captcha"
        />
      </div>
      <div class="form-submit">
        <div v-if="isShowError" class="error">{{error}}</div>
        <mt-button type="primary" size="large" class="login-btn">登录</mt-button>
      </div>
      
    </form>
    <router-link to="/signup" slot="left" class="signup-link">
        <mt-button type="primary" size="large" class="signup-btn">立即注册</mt-button>
    </router-link>
    <router-link to="/forgot" slot="left" class="argument">用户协议</router-link>
  </div>
</template>

<script>
import Validator, {validateMobile} from '@/utils/validate'
import {Field} from 'mint-ui'

const validateUserName = (rule, value, callback) => {
  if(!validateMobile(value)){
    callback(new Error('请输入正确的手机号'))
  }else{
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if(!value || value.length < 4 || value.length > 50){
    callback(new Error('请输入密码，长度4-20'))
  }else{
    callback()
  }
}
const validateCaptcha = (rule, value, callback) => {
  if(!value){
    callback(new Error('请输入图片验证码'))
  } else if ( value && (value.length < 4 || value.length > 4)){
    callback(new Error('请输入正确的图片验证码'))
  } else {
    callback()
  }
}

const loginRules = (hasCaptcha) => {
  let rules = {
    username: [{type: "string", required: true, validator: validateUserName}],
    password: {type: "string", required: true, validator: validatePassword},
  }
  if (hasCaptcha) {
    rules.captcha = {type: "string", require: true, validator: validateCaptcha}
  }
  return rules
}

export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: '18815151515',
        password: '1234qwer',
        captcha: ''
      },
      isShowError: false,
      error: '',
      captchaRandom: '',
    }
  },
  created() {
    this.captchaChange()
    this.$store.dispatch('login')
  },
  computed: {
    captchaUrl(){
      return "/captcha?_=" + this.captchaRandom
    },
    isShowCaptcha() {
      const loginCount = this.$store.state.user.loginCount
      return loginCount > 3
    }
  },
  methods: {
    handlerSubmit(e){
      const data = this.loginForm
      console.log('loginForm', data)
      const { dispatch } = this.$store;
      const loginValidator = new Validator(loginRules(this.isShowCaptcha))
      loginValidator.validate(data, {firstFields: false}, (errors, fields)=>{
        if(errors){
          // validation failed, errors is an array of all errors
          // fields is an object keyed by field name with an array of
          // errors per field
          this.isShowError = true
          this.error = errors[0].message
          return
        }
        this.$store.dispatch('login', data).then((res)=>{
          this.$router.push('/')
        }).catch((err)=>{
          this.isShowError = true
          this.error = err._message
        })
      })
      this.captchaChange()
    },
    captchaChange() {
      this.captchaRandom = Math.random().toString().substr(2,6)
    }
  }
}
</script>

<style lang="stylus" scoped>
  $login-bg-color = #FFF
  $login-title-color = #333
  $font-size-large = 18px
  $font-size-label = 16px
  $font-size-small = 14px
  $border-base-color = #F5F5F9
  $forget-link-color = #4C66E7
  $signup-border-color = #FD3636
  $error-message-color = #FF4D41
  $user-agreement-color = #B8B8B8
  .login-wrapper
    padding:0 20px
  form
    margin-top: 100px
  .header
    background-color: $login-bg-color
    color: $login-title-color
    font-size: $font-size-large
    height: 40px
    line-height: 40px
  .mint-field >>> .mint-cell-wrapper
    padding: 0
    color: $login-title-color
  .mint-field >>> .mint-cell-title
    width: 70px
    font-size: $font-size-label
  .mint-field >>> .mint-cell-text
    display: inline-block
    text-align: justify
    width: 50px
    height: 27px
    line-height: 27px
    &:after
      content: ''
      width: 100%
      display: inline-block
  .form-control
    padding: 8px 0
    border-bottom: solid 1px $border-base-color
  .captcha
    width: 90px
    height: 32px
    float: right
    margin-top: -36px
  .input-small
    width: 250px
  .forgot-link
    float: right
    margin-top: 10px
    text-decoration: none
    color: $forget-link-color
  .login-btn
    background:  linear-gradient(-135deg, #FF413C 0%, #FF8359 100%)
    border-radius: 4px 
    margin-top: 80px
  // .mint-button:not(.is-disabled):active::after
    // opacity: 0
  .signup-link
    display: block
    text-decoration: none
    margin-top: 20px
  .signup-btn
    border: solid 1px $signup-border-color
    background: $login-bg-color
    color: $signup-border-color
  .form-submit
    position: relative
  .error
    position: absolute
    top: -20px
    left: 0
    color: $error-message-color
    font-size: $font-size-small
  .argument
    position: absolute
    bottom: 50px
    left: 50%
    margin-left: -32px
    text-decoration: none 
    font-size: $font-size-small
    color: $user-agreement-color
</style>


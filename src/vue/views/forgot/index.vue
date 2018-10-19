<template>
  <div>
    <mt-header class="header" title="修改密码">
      <router-link to="/login" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class='forgot-main'>
      <form @submit.prevent="handlerSubmit">
        <div v-if='step1'>
          <mt-field label="手机号" placeholder="手机号" type="number"
            class="form-control"
            ref="mobile"
            v-model="forgotForm.mobile"
          ></mt-field>
          <div class="form-control">
            <mt-field label="验证码" placeholder="请输入图片验证码" type="text"
              max-length="[4, 4]"
              v-model="forgotForm.captcha"
              ref="captcha"
              class="input-small"
            ></mt-field>
            <img
              alt='看不清，点击刷新'
              class="captcha"
              :src="captchaUrl"
              @click="captchaChange"
            />
          </div>
        </div>
        <div v-if='step2'>
          <div class="smscode-tips">短信已发送到{{parseUserMobile}},请注意查收</div>
            <div class="form-control">
              <mt-field label="验证码" placeholder="短信验证"
                type="text"
                v-model="forgotForm.smscode"
                ref="smscode"
                class="input-small"
              ></mt-field>
              <mt-button size="small" class="smscode-btn" v-bind:class="{'disabled': isDisabled}" v-bind:disabled="isDisabled" @click="sendSmsCode('smsType')">{{smsCountDown}}</mt-button>
            </div>
            <mt-field label="新密码" placeholder="请输入密码"             type="password"
              class="form-control"
              ref="newPassword"
              v-model="forgotForm.newPassword"
            ></mt-field>
            <mt-field label="新密码" placeholder="请输入密码"             type="password"
              class="form-control"
              ref="repeatPassword"
              v-model="forgotForm.repeatPassword"
            ></mt-field>
            <div class="novice-code" @click="sendSmsCode('voiceType')">收不到短信验证码？</div>
        </div>
        <div class="form-submit">
          <div v-if="isShowError" class="error">{{error}}</div>
          <mt-button type="primary" size="large" class="forgot-btn" @click="handlerSubmit">{{btnText}}</mt-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import Validator, {validateMobile, validatePassword} from '@/utils/validate'
  import {parseMobile} from '@/utils/util'

  const validateUserMobile = (rule, value, callback) => {
    if (!value){
      callback(new Error('请输入的手机号'))
    } else if (!validateMobile(value)){
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  }

  const validateCaptcha = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入图片验证码'))
    } else if (value && (value.length < 4 || value.length > 4)){
      callback(new Error('请输入正确的图片验证码'))
    } else {
      callback()
    }
  }

  const validateSmsCode = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入短信验证码'))
    } else if (value && value.length < 6) {
      callback(new Error('请输入正确的短信验证码'))
    } else {
      callback()
    }
  }

  const validateUserPassword = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入密码'))
    } else if (!validatePassword(value)) {
      callback(new Error('密码不能包含特殊字符'))
    } else {
      callback()
    }
  }

  const forgotRules = (step1, step2) => {
    let rules = {}
    if (step1) {
      rules = {
        mobile: {type: 'string', required: true, validator: validateUserMobile},
        captcha: {type: 'string', required: true, validator: validateCaptcha}
      } 
    } else if(step2) {
        rules = {
          smscode: {type: 'string', required: true, validator: validateSmsCode},
          newPassword: {tyoe: 'string', required: true, validator: validateUserPassword},
          repeatPassword: {tyoe: 'string', required: true, validator: validateUserPassword}
        }
      }
    return rules
  }

  export default {
    name: 'forgot',
    data(){
      return {
        forgotForm: {
          mobile: '15899996666',
          captcha: '',
          smscode: '',
          newPassword: '',
          repeatPassword: '',
          smsType: ''
        },
        step1: true,
        step2: false,
        isShowError: false,
        countDownTime: 0,
        captchaRandom: '',
        error: '',
        isDisabled: true,
        btnText: '发送短信验证码'
      }
    },
    created() {
      this.captchaChange()
    },
    computed: {
      captchaUrl() {
        return '/captcha?_=' + this.captchaRandom
      },
      smsCountDown() {
        if (this.countDownTime <= 0) {
          this.isDisabled = false
          return "重新获取"
        }
        return `${this.countDownTime}s`
      },
      parseUserMobile() {
        return parseMobile(this.forgotForm.mobile)
      }
    },
    methods: {
      captchaChange(){
        this.captchaRandom = Math.random().toString().substr(2, 6)
      },
      handlerSubmit() {
        let data = this.forgotForm
        const {dispatch} = this.$store
        const forgotValidator = new Validator(forgotRules(this.step1, this.step2))
        forgotValidator.validate(data, {firstFields: true}, (errors, fields) => {
          if (errors) {
            this.isShowError = true
            this.error = errors[0].message
            return
          }
          if (this.step1) {
            this.$store.dispatch('sendSmsCode', data).then((res)=>{
              this.step1 = false
              this.step2 = true
              this.btnText = "完成"
              this.countDownTime = 10
              this.countDown()
              this.error = ""
            }).catch((err) => {
              this.isShowError = true
              this.error = err._message
              this.captchaChange()
            })
          } else if (this.step2) {
            this.$store.dispatch('userForgot', data).then((res)=>{
              router.push('login')
            }).catch((err) => {
              this.isShowError = true
              this.error = err._message
            })
          }
        })
      },
      sendSmsCode (type) {
        let data = this.forgotForm;
        const {dispatch} = this.$store
        const forgotValidator = new Validator(forgotRules(true, false))
        data.codeType = type;
        console.log('111',data.captcha, this.captchaUrl)
        forgotValidator.validate(data, {firstFields: true}, (errors, fields) => {
          if (errors) {
            this.isShowError = true
            this.error = errors[0].message
            return
          }
          this.$store.dispatch('sendSmsCode', data).then((res)=>{
            this.step1 = false
            this.step2 = true
            this.btnText = "完成"
            this.isDisabled = true
            this.countDownTime = 10
            this.countDown()
            return false
          }).catch((err) => {
            this.isShowError = true
            this.error = err._message
          })
          
        })
      },
      countDown() {
        let me = this;
        setInterval(function(){
          if (me.countDownTime <= 0) {
            clearInterval()
          } else {
          me.countDownTime = me.countDownTime -1
          }
        }, 1000)
      },
      checkMobile(value) {
        const data = {mobile: value}
        this.$store.dispatch('checkMobile', data).then((res)=> {
          return true
        }).catch((err)=> {
          return error._message
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  $white-color = #FFF
  $login-title-color = #333
  $font-size-large = 18px
  $font-size-label = 16px
  $font-size-small = 14px
  $border-base-color = #F5F5F9
  $forget-link-color = #4C66E7
  $signup-border-color = #FD3636
  $error-message-color = #FF4D41
  $user-agreement-color = #B8B8B8
  $disabled-bg-color = #ECECF0
  $disabled-font-color = #B8B8B8
  .signup-wrapper
    padding:0 20px
  form
    margin-top: 70px
    // padding: 0 20px
  .header
    background-color: $white-color
    color: $login-title-color
    font-size: $font-size-large
    height: 44px
    line-height: 44px
  .form-control
    padding: 8px 0
    border-bottom: solid 1px $border-base-color
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
  .captcha
    width: 90px
    height: 32px
    float: right
    margin-top: -36px
  .input-small
    width: 240px
  .signup-btn
    margin-top: 80px
  .smscode-btn
    background: linear-gradient(-135deg, #FF413C 0%, #FF8359 100%)
    width: 90px
    height: 30px
    padding: 0 5px
    color: $white-color
    float: right
    margin-top: -40px
  .smscode-tips
    font-size: 14px
    color: $login-title-color
    text-align: center
    margin-bottom: 15px
  .disabled
    background: $disabled-bg-color
    color: $disabled-font-color
  .signup-btn
    background:  linear-gradient(-135deg, #FF413C 0%, #FF8359 100%)
    border-radius: 4px 
    margin-top: 80px
  .login-link
    display: block
    text-decoration: none
    margin-top: 20px
  .login-btn
    border: solid 1px $signup-border-color
    background: $white-color
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
  .signup-result
    text-align: center
    margin-top: 44px
    border-top: solid 1px $border-base-color
    padding: 50px 20px 0
  .signup-success
    &-img
      width: 148px
      height: 92px
    &-title
      margin-top: 40px auto 10px
      font-size: 20px
      font-weight: normal
      color: #333
    &-desc
      font-size: 14px
      color: #999
      &-welfare
        color: #FF8359
  .signup-step2
    position: relative
  .novice-code
    position: absolute
    bottom: -28px
    right: 0
    color: #4C66E7
    margin-top: 10px
    font-size: 14px
</style>

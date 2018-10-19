<template>
  <div>
    <mt-header class="base-title" title="绑定银行卡">
      <router-link to="/account" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="account-info">
      持卡人：
      <span>{{safeRealname(accountInfo.realName)}}</span>
      <span>{{safeIdentity(accountInfo.idNo)}}</span>
    </div>
    <div class="account-bindcard-form">
      <form action="" method="post" @submit.prevent="handlerSubmit">
        <label for="" class="account-bindcard-form-bankcard"> 银行卡号
          <input type="text" name="bankcard" min-length="6" max-length="25"
            v-model="bindCardForm.inputBankcard"
            @keypress="onlyNumber" @blur="queryBankBelongs"
          >
        </label>
        <bankcardChecked ref="bankChecked" :bankcardNum="bindCardForm.inputBankcard" @passBankInfo="acceptBankInfo"> </bankcardChecked>
        <div class="account-bindcard-error"> {{errMsg}} </div>
        <button class="account-bindcard-form-btn">立即绑卡</button>
        <div v-if="isShowThirdpartForm">
          <thirdpartForm :thirdpartRes="thirdpartRes"></thirdpartForm>
        </div>
      </form>
    </div>
    
  </div>
</template>

<script>
import {
  safeRealname,
  safeIdentity,
  bankTips,
  bankCodeList
} from '@/utils/util';
import { mapState } from 'vuex';
import Validator from '@/utils/validate';
import bankcardChecked from '../bankcard/bankcard.checked';
import thirdpartForm from '../thirdpart/thirdpart.form'

const validateBankcard = function(rule, value, callback) {
  console.log('异步表单验证规则+ 数据', rule, value);
  if (!value) {
    callback(new Error('请输入银行卡号'));
  } else {
    callback();
  }
};
const bindCardRules = {
  inputBankcard: { type: 'string', require: true, validator: validateBankcard }
};

export default {
  name: 'accountBankcardBind',
  data() {
    return {
      bindCardForm: {
        inputBankcard: '',
        bankType: '',
        bankCode: ''
      },
      thirdpartRes: {
        result: {},
        url: '',
      },
      isShowError: false,
      errMsg: '',
      disableSubmit: false,
      isShowThirdpartForm: false,
    };
  },
  computed: mapState({
    accountInfo: state => state.account.accountInfo.userInfo
  }),
  mounted() {
    this.queryAccountInfo();
  },
  methods: {
    safeRealname,
    safeIdentity,
    queryAccountInfo() {
      console.log('进入 queryAccountInfo');
      const { dispatch } = this.$store;
      dispatch('getAccountInfo');
    },
    onlyNumber(event) {
      if (event.keyCode < 48 || event.keyCode > 57) {
        event.returnValue = false;
      }
    },
    queryBankBelongs() {
      if (!this.bindCardForm.inputBankcard) {
        this.isShowError = true;
        this.disableSubmit = true;
        this.errMsg = '请输入银行卡号';
        return false;
      } else {
        console.log(
          '子组件===bankChecked',
          bankcardChecked,
          this.$refs.bankChecked
        );
        this.$refs.bankChecked.queryBankChecked();
      }
    },
    acceptBankInfo(bankVal){
      console.log('父组件接受的子组件传来的银行卡信息', bankVal)
      this.bindCardForm.bankType = bankVal.bankType
      this.bindCardForm.bankCode = bankVal.bankCode
      this.errMsg = bankVal.errMsg
    },
    handlerSubmit() {
      const data = this.bindCardForm;
      const { dispatch } = this.$store;
      const bindCardValidator = new Validator(bindCardRules);
      console.log('绑定银行卡提交的数据===========', data);
      bindCardValidator.validate(data, (errors, fields) => {
        if (errors) {
          this.isShowError = true;
          this.disableSubmit = true;
          this.errMsg = errors[0].message;
          console.log('[error====]', errors, fields)
          return;
        }
        console.log('绑定银行卡校验成功', data )
        // 发送后端请求，获取请求懒猫的数据
        dispatch('postBankcardBind', data).then(res => {
          console.log('发送action，获取请求懒猫的数据结果==', res)
          this.thirdpartRes = res;
          this.isShowThirdpartForm = true;
        }).catch(err => {
          console.log('发送action，获取请求懒猫的数据jieguo出错==', err)
          this.isShowThirdpartForm = false;
        })
      });
    }
  },
  components: {
    bankcardChecked,
    thirdpartForm,
  }
};
</script>

<style lang="stylus" scoped>
  $color-gray-light = #999999
  $white-color = #ffffff
  $border-color = #dddddd
  $error-color = #fa5a5a
  .account-info
    text-align: center
    font-size: 0.875rem
    color: $color-gray-light
    height: 2.2rem
    line-height: 2.2rem
  .account-bindcard-form
    position: relative
    background-color: $white-color
    color: $color-gray-light
    font-size: 0.94rem
    padding: 0 1.25rem
    &-bankcard 
      display: block
      width: 100%
      height: 3rem
      line-height: 3rem
      border-bottom: 1px solid $border-color
      input 
        border: none
        &:focus 
          outline: none 
    &-btn
      display: block
      width: 90%
      height: 2.56rem
      margin: 4.25rem auto 0
      border: none 
      background-image: linear-gradient(-135deg, #FF413C 0%, #FF8359 100%)
      border-radius: 0.25rem
      color: $white-color
  .account-bindcard-error
    position: absolute 
    display: block 
    width: 100%
    text-align: center
    color: $error-color
    bottom: 3rem
    left: 0
    font-size: 0.75rem
</style>



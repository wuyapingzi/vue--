<template>
  <div class="bank-container">
    <label for="" class="bank-name"> 
      所属银行
      <input type="text" name="bankName" readonly :value="bankType">
      <input type="hidden" name="bankCode" :value="bankCode">
    </label>
    <router-link  to="/account" slot="right" class="bank-limit">
      查看银行限额
    </router-link>
    <!-- <div class="bank-error"> {{errMsg}} </div> -->
  </div>

</template>

<script>
// import { mapActions } from 'vuex';
import { bankName, bankTips } from '@/utils/util';

export default {
  name: 'bankcardChecked',
  data() {
    return {
      bankType: '',
      bankCode: '',
      errMsg: '',
    };
  },
  props: ['bankcardNum'],
  methods: {
    queryBankChecked() {
      const { dispatch } = this.$store;
      const data = { banknumber: this.$props.bankcardNum };
      dispatch('getBankcardChecked', data)
        .then(res => {
          console.log('dispatch: getBankcardCheckedXXXXXXXXXXXXXX', res);
          if(res.cardType == 'credit'){
            this.bankcardTypeErr({message: '不支持绑定信用卡，请使用储蓄卡进行绑定。'})
            return false;
          }
          this.bankcardTypeShow(res)
          const bankInfo = {
            bankType: this.bankType,
            bankCode: this.bankCode,
            errMsg: this.errMsg,
          }
          this.sendBankInfo(bankInfo);
        })
        .catch(err => {
          this.bankcardTypeErr(err)
          const bankInfo = {
            bankType: this.bankType,
            bankCode: this.bankCode,
            errMsg: this.errMsg,
          }
          this.sendBankInfo(bankInfo);
          console.log('dispatch:getBankcardChecked.err=====', err);
        });
    },
    bankcardTypeErr(err){
      this.bankType = ''
      this.bankCode = ''
      this.errMsg = err.message
    },
    bankcardTypeShow(res){
      if (res.bankCode in bankTips()){
        console.log('得到的银行名称====',res.bankCode, bankName(res.bankCode))
        this.bankType = bankName(res.bankCode)
        this.bankCode = res.bankCode
        this.errMsg = ''
      }
    },
    sendBankInfo(data){
      this.$emit('passBankInfo', data);
    },
  },
  
};
</script>

<style lang="stylus" scoped>
  $border-color = #dddddd
  $error-color = #fa5a5a
  $rooter-link-color = #4C66E7
  .bank-container
    position: relative
  .bank-name
    display: block
    width: 100%
    height: 3rem
    line-height: 3rem
    border-bottom: 1px solid $border-color
    input 
      border: none 
      &:focus
        outline: none
  .bank-limit
    position: absolute 
    right: 0
    bottom: 1rem
    text-align: right 
    font-size: 0.875rem
    color: $rooter-link-color 
    text-decoration: none
  
</style>



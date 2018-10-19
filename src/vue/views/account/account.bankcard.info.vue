<template>
  <div>
    <p v-if="!accountBankcard.hasBankcard">
      您没有绑定银行卡。
    </p>
    <div v-if="accountBankcard.hasBankcard" class="account-bankcard" :class="bankClass">
      <p class="account-bankcard-name" :class="bankNameClass">
        {{accountBankcardInfo.bankType}}
      </p>
      <p class="account-bankcard-num">
        {{safeBank(accountBankcardInfo.cardId)}}
      </p>
      <p class="account-bankcard-limit">银行限额：{{limitShow(accountBankcardInfo)}}</p>
      
    </div>
    
  </div>
</template>

<script>
import { safeBank, limitShow, bankTailNum } from '@/utils/util'
import {mapState} from 'vuex';

export default {
  name: 'accountBankcardInfo',
  data(){
    return{
      accountBankcard: {
        hasBankcard: false,
      }
    };
  },
  computed:
    mapState({
      accountBankcardInfo: state => state.account.bankcardInfo,
      bankClass: function(state){
        return 'account-bankcard-'+ state.account.bankcardInfo.bankCode
      },
      bankNameClass: function(state){
        return 'account-bankcard-name-'+ state.account.bankcardInfo.bankCode
      }
    })
  ,
  mounted(){
    // this.queryAccountInfo();
    this.queryAccountBank();
  },
  methods: {
    safeBank,
    limitShow,
    bankTailNum,
    queryAccountBank(){
      console.log('进入 queryAccountBank');
      const {dispatch} = this.$store;
      dispatch('getAccountBankcard')
      .then(res => {
        // 银行卡限额用limitShow还是quota？？？？？？？？？？？？？？？？？？
        // res.limitShow = limitShow(res);
        // res.cardId = safeBank(res.cardId);
        console.log('queryAccountBank == ', res);
        if(!res.enableUnbind){
          this.accountBankcard.hasBankcard = false;
        }else{
          this.accountBankcard.hasBankcard = true;
        }
      }).catch(err => {
        console.log('query card info error', err);
      })
    }
  }
}
</script>

<style lang="stylus">
  $white-color = #ffffff
  .account-bankcard
    position: relative
    height: 9.375rem
    background-image: linear-gradient(-135deg, #FF413C 0%, #FF8359 100%)
    border-radius: 0.25rem
    padding: 1.125rem 1.5rem 0
    color: $white-color
    box-sizing: border-box
    &-5006
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5004
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5005
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-0150
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-0201
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5012
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-0210
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5000
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5003
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-0160
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5007
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5008
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5002
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-5009
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-0220
      &:after
        content: ''
        width: 7.94rem
        height: 10rem
        position: absolute 
        top: 0
        right: 0
        background: url('~@/assets/img/bank-logo-big.png') no-repeat
        background-position: 0 -48rem
    &-name
      margin: 0
      display: block
      width: 100%
      font-size: 1.125rem
      position: relative
      text-indent: 2.8rem
      line-height: 1.875rem
      &-5006
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5004
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5005
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-0150
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-0201
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5012
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-0210
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5000
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5003
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-0160
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5008
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5007
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5002
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-5009
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      &-0220
        &:before
          content: ''
          width: 2.3rem
          height: 1.875rem
          position: absolute 
          top: 0
          left: 0
          background: url('~@/assets/img/bank-logo-small.png') no-repeat
          background-position: 0 -15rem
      
    &-num 
      margin: 1.5rem auto 1.2rem
      font-size: 1.5rem
      letter-spacing: 2px
    &-limit
      font-size: 0.75rem

</style>

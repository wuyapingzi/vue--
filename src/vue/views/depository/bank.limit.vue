<template>
  <div>
    <mt-header title="银行卡限额">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div v-for='val in bankCodeList'>
      <div v-if='bankTips[val]' class='item' :class='"item-"+val'> 
        <div class='item-name'>{{bankTips[val]['name']}}</div>
        <div v-if='bankTips[val]["quotaStatus"] == 2' class='item-limit'>限额：银行系统维护中</div>
        <div v-else class='item-limit'>
          <span v-if='bankTips[val]["single"]'>单笔{{bankTips[val]['single']}}</span>
          <span v-if='bankTips[val]["day"]'>单日{{bankTips[val]['day']}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  export default {
    name: 'bankLimit',
    computed:
      mapState({
        bankCodeList: state => state.depository.bankCodeData.bankCodeList,
        bankTips: state => state.depository.bankCodeData.bankTips,
      })
    ,
    mounted() {
      this.bankCodeData();
    },
    methods: {
      bankCodeData(){
        this.$store.dispatch('bankLimitList')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .mint-header
    background: #fff
    color: #333
    font-size: 18px
  .item
    height: 70px
    background-color: #fff
    box-sizing: border-box
    background: url('./bank_logo_simple.png') no-repeat 15px 15px
    padding-left: 70px
    border-bottom: 1px solid #ddd
    padding-top: 15px
    _bgp()
      background-position: arguments
    &-0160
      _bgp(15px, 15px)
    &-0150
      _bgp(15px, -45px)
    &-0210
      _bgp(15px, -105px)
    &-0220
      _bgp(15px, -165px)
    &-5006
      _bgp(15px, -225px)
    &-5002
      _bgp(15px, -285px)
    &-0201
      _bgp(15px, -345px)
    &-5007
      _bgp(15px, -405px)
    &-5004
      _bgp(15px, -465px)
    &-5003
      _bgp(15px, -525px)
    &-5012
      _bgp(15px, -585px)
    &-5000
      _bgp(15px, -645px)
    &-5008
      _bgp(15px, -765px)
    &-5009
      _bgp(15px, -885px)
    &-5005
      _bgp(15px, -945px)
    &-name
      font-size: 14px
      color: #2D2F46
    &-limit
      font-size: 12px
      margin-top: 10px
      color: #666
</style>
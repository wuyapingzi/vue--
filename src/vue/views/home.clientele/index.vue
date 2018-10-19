<template>
  <div class="clientele">
    <dl>
      <dt class="depository"></dt>
      <dd>恒丰银行存管</dd>
    </dl>
    <dl>
      <dt class="credit"></dt>
      <dd>AAA信用评级</dd>
    </dl>
    <dl>
      <dt class="signup"></dt>
      <dd>2亿注册资本</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'homeClientele',
  props: {
    isLogin: {
      type: Boolean,
    },
    accountInfo: {
      default: function () {
        return {}
      },
      type: Object,
    },
  },
  computed: {

  },
}
</script>

<style lang="stylus" scoped>

  @import '~@/assets/styles/mixin.stylus';

  .clientele
    display: flex
    background: #fff
    dl 
      flex: 1
    dt   
      px2rem('width', 30)
      px2rem('height', 30)
      margin: 0 auto
    dd   
      margin: 0 auto
      text-align: center
      px2rem('font-size', 13)
      color: #333333
      margin: 10px 0
    .depository
      background: url('~@/assets/images/home-clientele-bank.png') no-repeat center
      background-size: contain
    .credit
      background: url('~@/assets/images/home-clientele-aaa.png') no-repeat center
      background-size: contain
    .signup
      background: url('~@/assets/images/home-clientele-money.png') no-repeat center
      background-size: contain 
</style>


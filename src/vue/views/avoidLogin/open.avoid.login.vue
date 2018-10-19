<template>
  <div>
    <div v-if="!isOpenSuccess">
      <header class="header">
        <div class="header-back">< 返回</div>
        <div class="header-title">开启免登录</div>
      </header>
      <mt-button type="primary" class="avoid-login-button" @click="avoidLoginOpen">开启免登录</mt-button>
    </div>
    <div v-else>
      <mt-header title="成功开启免登录">
        <mt-button icon="back">返回</mt-button>
      </mt-header>
    </div>
  </div>
</template>

<script>
export default {
  name: 'openAvoidLogin',
  data(){
    return {
      isOpenSuccess: false
    }
  },
  methods: {
    avoidLoginOpen() {
      this.$store.dispatch('avoidLoginOpen')
    }
  }
}
</script>


<style lang="stylus">
  .header
    width: 100%
    background: #26a2ff
    text-align: center
    color: #fff
    &-title
      display: inline-block
      height: 42px
      line-height: 42px
    &-back
      line-height: 40px
      position: absolute 
      left: 20px
      color: #fff
  .avoid-login-button
    width 80%
    margin-top: 45%
    margin-left: 10%
</style>


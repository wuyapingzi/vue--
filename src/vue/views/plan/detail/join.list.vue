<template>
  <div>
    <mt-header title="加入记录">
      <router-link :to="/plan/+planId" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header> 
    <div v-if='joinList.length == 0'>
      暂无加入记录
    </div>
    <div v-else class='item' v-for="(val,key) in joinList">
      <span class='idx'>{{val.index}}</span>
      <div class='intro'>
        <span class='nick'>{{val.nickName}}</span>
        <span class='date'>{{val.joinTime}}</span>
      </div>
      <span class='amount'>{{val.amount}}</span>
    </div>
    
  </div>
</template>

<script>
  export default {
    name: 'join',
    computed: {
      joinList() {
        console.log(this.$store.state.plan.joinList)
        return this.$store.state.plan.joinList
      },
      planId() {
        return this.$route.params.planId
      }
    },
    created() {
      this.$store.dispatch('joinList')
    }
  }
</script>

<style lang="stylus" scoped>
  $header-bg = #ffffff
  $border-color = #dddddd
  $header-color = #333333
  $grey-color-lighter = #999999
  $large-size = 18px
  $small-size = 12px
  .mint-header
    background-color: $header-bg
    color: $header-color
    font-size: $large-size
    margin-bottom: 10px
  .item 
    height: 60px
    padding: 0 15px
    background: $header-bg
    border-bottom: 1px solid $border-color
  .idx
    float: left
    line-height: 60px
    width: 40px
  .intro
    display: inline-block
    padding: 10px 0
    span
      display: block
    .nick
      color: $header-color
      line-height: 20px
    .date
      color: $grey-color-lighter
      font-size: $small-size
      line-height: 20px
  .amount
    float: right
    line-height: 60px
</style>
<template>
    <div class='float-body'>
      <router-link to='/login' v-if='!login'>
        点此登录后加入
      </router-link>
      <div v-else>
        <plan-state-button :status="this.status" :endTime="this.endTime" :diffTime="this.diffTime"></plan-state-button>
      </div>
    </div>
</template>

<script>
  import planStateButton from '../../plan.button'
  export default {
    name: 'float',
    props: {
      login: {
        type: Boolean
      },
      status: {
        type: [String, Number],
        default: '5'
      },
      endTime: {
        type: [String, Number]
      },
      diffTime: {
        type: Number
      }
    },
    components: {
      planStateButton
    },
  }
</script>

<style lang="stylus">
  $float-bg-first = #FF413C
  $float-bg-last = #FF8359
  $white-color = #ffffff
  .float-body
    height: 54px
    width: 100%
    position: fixed
    bottom: 0
    background-image: linear-gradient(-135deg, $float-bg-first 0%, $float-bg-last 100%)
    text-align: center
    line-height: 54px
    a
      display: block
      color: $white-color 
      text-decoration: none
</style>


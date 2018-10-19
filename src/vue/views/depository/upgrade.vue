<template>
    <div>
      <div class='depository-supernatant'></div>
      <div class='depository-container'>
        <img src="./depository-upgrade.jpg"/>
        <div class="go-upgrade" @click='upgradeHandle'>立即升级</div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'upgrade',
    methods: {
      upgradeHandle: function() {
        this.$store.dispatch('depositoryActive')
      }
    }
  }
</script>

<style lang="stylus">
  .depository-supernatant 
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    background-color: #000
    opacity: .5 
  .depository-container
    position: absolute
    top: 50%
    left: 50%
    width: 86%
    text-align: center
    color: #fff
    transform: translate(-50%, -50%)
    margin: 0 auto
    img 
      width: 100%
  .go-upgrade
    position: absolute
    bottom: 10%
    background: #CEAB79
    left: 10%
    width: 80%
    line-height: 2.4rem
    font-size: 1rem
    color: #fff
    border-radius: 2px
</style>

<template>
  <div class='intro-body'>
    <div class='intro-title'>{{titlt}}</div>
    <div class='intro-content'>{{con}}</div>
  </div>
</template>

<script>
  export default {
    name: 'intro',
    data() {
      return {
      }
    },
    props: {
      titlt: {
        type: String
      },
      con: {
        type: String
      }
    }
  }
</script>

<style lang="stylus">
  $white-color = #ffffff
  $dark-color = #333333
  $intro-color = #f55151
  $grey-color = #666666
  $base-size = 14px
  .intro-body
    background: $white-color
    .intro-title
      color: $dark-color
      font-size:  $base-size
      padding: 10px 0 5px
      &:before
        content: ''
        display: inline-block
        margin-right: 10px
        width: 4px
        height: 16px
        vertical-align: middle
        background: $intro-color
    .intro-content
      font-size: $base-size
      padding: 5px 14px 10px
      color: $grey-color
</style>
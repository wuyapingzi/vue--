<template>
  <router-link to="/download" class="download-btn">
    <span class="close" @click.prevent="closeButton">关闭</span>
    <mt-button type="primary" size="large" >下载红小宝APP</mt-button>
  </router-link>
  
</template>

<script>
export default {
  methods: {
    closeButton() {
      this.$emit('closeDownloadBtn')
      
    },
  }
}
</script>

<style lang="stylus" scoped>
  .download-btn
    position fixed
    left 0
    bottom 0
    width 100%
    .close
      position absolute
      right 0
      top 0
      width 50px
      height 100%
      z-index 100
  a
    text-decoration: none
</style>


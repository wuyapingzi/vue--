<template>
  <div>
    <mt-header class="header" fixed title="公告详情">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <h4 class="announce-title">{{announce.title}}</h4>
    <!-- 注意格式化日期 -->
    <div class="time">{{announce.date | dateformat('YYYY年MM月DD日')}}</div>
    <div class="content" v-html="announce.content"></div>
  </div>
</template>

<script>
export default {
  name: 'announcement',
  computed: {
    announce(){
      return this.$store.state.home.announcement;
    },
  },
  mounted() {
    console.log(this.announce, 'asdf')
  }
}
</script>

<style lang="stylus" scoped>
  .title
    font-size: 16px
  .time
    font-size: 16px
  .content
    font-size: 16px
</style>

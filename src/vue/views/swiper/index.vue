<template>
  <div class="banner-wrap">
    <mt-swipe v-if="bannerList.length" :auto="4000">
      <mt-swipe-item v-for="(item, index) in bannerList" :key="index">
        <a class="banner-link" v-if="item.url" :href="item.url">
          <img class="banner-image" :src="item.image" :alt="item.title">
        </a>
        <img class="banner-image" v-else :src="item.image" :alt="item.title">
      </mt-swipe-item>
    </mt-swipe>
    <mt-swipe v-else>
      <mt-swipe-item>
        <img class="banner-image" :src="defaultBanner.image" :alt="defaultBanner.title">
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
export default {
  name: 'swiper',
  data() {
    return {
      defaultBanner: {
        title: '默认图片',
        image: '',
        url: '',
      }
    }
  },
  props: {
    bannerList: {
      default: function () {
        return []
      },
      type: Array
    }
  }
}
</script>

<style lang="stylus" scoped>
  .banner-wrap
    height: 75px
  .banner-link, .banner-image
    display: block
    width: 100%
    height: 100%
</style>

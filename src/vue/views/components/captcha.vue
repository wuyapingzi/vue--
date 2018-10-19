<template>
  <div>
    <!-- <mt-field label="验证码" placeholder="请输入图片验证码" type="text"
        ref="captcha"
        v-bind:value="value"
      ></mt-field> -->
      <img 
        :src="captcha"
        alt='看不清，点击刷新'
        @click="captchaChange"
      />
  </div>
</template>

<script>
export default {
  data() {
    return {
      captcha: "data:image/png;base64," + this.$store.state.user.captcha
    }
  },
  beforeCreate() {
    this.$store.dispatch('captcha')
    // this.captchaChange()
  },
  created(){
    // this.$store.dispatch('captcha')
    // this.captchaChange()
  },
  mounted() {
    // this.captchaChange()
    // this.$store.dispatch('captcha')
  },
  methods: {
    captchaChange() {
      console.log('12345678', this.$store)
      this.captcha = "data:image/png;base64," + this.$store.state.user.captcha
      this.$store.dispatch('captcha')
    }
  }
}
</script>

<style>

</style>



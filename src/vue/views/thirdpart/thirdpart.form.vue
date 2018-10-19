<template>
  <div>
    <form ref="thirdpartForm" method="post" :action="thirdpartRes.url">
      <input type="text" v-for="(value, key) in thirdpartRes.result" :name="key" :value="value">

    </form>
  </div>
</template>

<script>
export default {
  name: 'thirdpartForm',
  data(){
    return {}
  },
  props: ['thirdpartRes'],
  mounted(){
    this.triggerSubmit();
  },
  methods: {
    triggerSubmit(){
      console.log('三方生成的表单==', this.$refs.thirdpartForm);
      this.$refs.thirdpartForm.submit();
    }
  }
}
</script>


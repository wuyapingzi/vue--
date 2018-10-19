<template>
  <div>
    {{action}}
    <p>
      {{result.title}}
    </p>
    <p>
      {{result.content}}
    </p>
  </div>
</template>
<script>
export default {
  name: 'thirdpartResult',
  data(){
    return{
      action: '',
      result: {}
    }
  },
  mounted(){
    this.queryThirdpartResult()
  },
  methods: {
    queryThirdpartResult(){
      // const {dispatch} = this.$store;
      this.action = this.$route.params.action
      this.result = this.$route.query.ret 
      console.log('懒猫处理结果返回页面', this.$route.params.action, this.$route.query.ret.title, this.$route.query.ret.content )
    }
  }

}
</script>

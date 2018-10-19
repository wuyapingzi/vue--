<template>
  <div class="assets">
    <mt-header class="header" title="我的资产">
      <router-link to="/account" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>

    <chart style="width:100%; height:200px" :options="assetsPie" auto-resize ref="pie" class="chart"></chart>

    <ul>
      <li>
        <h3 class="plan-title">红利智投资产</h3>
        <div class="content">
          <span class="amount">金额：{{userAssets.financePlanAssets}}</span>
          <span class="earn-total">累计收益：{{userAssets.financePlanSumPlanInterest}}</span>
        </div>
      </li>
      <li>
        <h3 class="loan-title">散标债权资产</h3>
        <div class="content">
          <span class="amount">金额：{{userAssets.lenderPrincipal}}</span>
          <span class="earn-total">累计收益：{{userAssets.lenderEarned}}</span>
        </div>
      </li>
      <li>
        <h3 class="available-title">可用金额</h3>
        <div class="content">
          <span class="amount">金额：{{userAssets.availablePoint}}</span>
        </div>
      </li>
      <li>
        <h3 class="froze-title">冻结金额</h3>
        <div class="content">
          <span class="amount">金额：{{userAssets.frozenPoint}}</span>
        </div>
      </li>
    </ul>
  </div>
  
</template>

<script>

export default {
  data: function () {
    return {
      loading: true,
      pieOptions: {
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c}"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data:['红利智投资产','散标债权资产','可用金额','冻结金额']
        },
        series: [
          {
            name:'我的资产',
            type:'pie',
            radius: ['65%', '85%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                formatter: "{b}\n {c} 元",
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:[]
          }
        ],
        color: ['#8380FF', '#50B1EE', '#FF4E4E', '#FFBA59']
      }
    }
  },
  computed: {
    userAssets() {
      return this.$store.state.account.accountInfo.userAssets
    },
    formatPieData() {
      if (this.userAssets) {
        const assetsObj = {
          financePlanAssets: '红利智投资产',
          lenderPrincipal: '散标债权资产',
          availablePoint: '可用金额',
          frozenPoint: '冻结金额'
        }
        
        return Object.keys(assetsObj).map(item => {
          return {value: this.userAssets[item].toFixed(2), name: assetsObj[item]}
        })
      } else {
        return []
      }
    },
    assetsPie() {
      // const options = this.pieOptions
      this.pieOptions.series[0].data = this.formatPieData
      console.log(111, this.pieOptions)
      return this.pieOptions
    }
  },
  created() {
    this.getAccountInfo()
  },
  mounted() {
    // let pie = this.$refs.pie;
    // pie.showLoading()
  },
  methods: {
    getAccountInfo() {
      this.$store.dispatch('getAccountInfo')
    },
  }
}
</script>

<style lang="stylus" scoped>
  .assets
    background: #F5F5F9
    overflow: hidden
  .header
    font-size: 18px
    background: white
    color: #333
  .chart
    background: white
  ul
    padding: 0 8px
    margin: 5px 0
    background: white
  li
    height: 35px
    margin: 0
    padding: 8px 0
    list-style: none
    border-bottom: 1px solid #EEEEF5
    &:nth-of-type(4)
      border: none
    h3
      margin: 0
      padding-left: 5px
      font-size: 14px
      color: #333
      border-left: 2px solid #000
    div
      display: flex
      justify-content: space-between
      padding-top: 3px
    span
      padding-left 7px
      font-size: 12px
      color:  #9295A2
    .plan-title
      border-left-color: #8380FF
    .loan-title
      border-left-color: #50B1EE
    .available-title
      border-left-color: #FF4E4E
    .froze-title
      border-left-color: #FFBA59
</style>

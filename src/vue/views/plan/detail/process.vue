<template>
  <div class='process-body'>
    <div class='item' :class='{"active": isJoin}'>
      <span>{{time.beginTime}}</span>
      <span class='tip'>投资</span>
      <span class='line'></span>
      <div>加入</div>
    </div>
    <div class='item' :class='{"active": isRate}'>
      <span>{{time.startTime}}</span>
      <span class='tip'>开始计息</span>
      <span class='line'></span>
      <div>锁定期{{this.lockPeriodDate}}个月</div>
    </div>
    <div class='item' :class='{"active": isExit}'>
      <span>{{time.endTime}}</span>
      <span class='tip'>随时可退</span>
      <span class='line'></span>
      <div>开放期</div>
    </div>
  </div>
</template>

<script>
  import { parsePlanStatus, formatdate } from '../../../utils/util'
  export default {
    name: 'process',
    data(){
      return {
      }
    },
    props: {
      status: {
        type: [String, Number],
        default: '5'
      },
      lockPeriodDate: {
        type: [String, Number]
      },
      beginSellingTime: {
        type: [String, Number]
      },
      lockStartTime: {
        type: [String, Number]
      },
      endLockingTime: {
        type: [String, Number]
      },
    },
    computed: {
      stateObj(){
        return parsePlanStatus(this.status) || {}
      },
      time(){
        return {
          beginTime: formatdate('MM月DD日' ,this.beginSellingTime),
          startTime: formatdate('MM月DD日' ,this.lockStartTime),
          endTime: formatdate('MM月DD日' ,this.endLockingTime),
        }
      },
      isJoin(){
        let isJoin = this.stateObj['PERIOD_CLOSED'] || this.stateObj['PERIOD_EXITING'] || this.stateObj['PERIOD_OPEN'] || this.stateObj['PERIOD_LOCKING'] || this.stateObj['OPENING'] || this.stateObj['OPEN_FULL'];
        return isJoin;
      },
      isRate(){
        let isRate = this.stateObj['PERIOD_CLOSED'] || this.stateObj['PERIOD_EXITING'] || this.stateObj['PERIOD_OPEN'] || this.stateObj['PERIOD_LOCKING'];
        return isRate;
      },
      isExit(){
        let isExit = this.stateObj['PERIOD_CLOSED'] || this.stateObj['PERIOD_EXITING'] || this.stateObj['PERIOD_OPEN'];
        return isExit;
      }
    }
  }
</script>

<style lang="stylus" scoped>
  $white-color = #ffffff
  $border-color = #E8E6E6
  $active-color = #f55151
  $grey-color-lighter = #999999
  $small-size = 12px
  $bg-first = #FF8359
  $bg-last = #FF413C 
  .process-body
    padding: 20px
    background: $white-color
  .item
    width: 28% 
    display: inline-block
    span
      display: block 
      color: $grey-color-lighter
      font-size: $small-size
    .line
      border-left: 1px solid $border-color
      border-top: 1px solid $border-color
      width: 35px
      height: 16px
    .tip
      margin-bottom: 6px
    div
      width: 100%
      height: 16px
      background: $border-color
      color: $grey-color-lighter
      text-align: center
      font-size: $small-size
      line-height: 16px
    &:nth-child(2)
      width: 40%
  .active
    span
      color: $active-color
    .line
      border-left: 1px solid $active-color
      border-top: 1px solid $active-color
    div
      background-image: linear-gradient(45deg, $bg-first 0%, $bg-last 100%)
      color: $white-color
</style>
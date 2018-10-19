<template>
  <div>
    <button v-if="getPlanStatus['WAIT_OPEN']">{{endTime | dateformat('MM月DD日 HH:mm')}}开售</button>
    <button v-else-if="getPlanStatus['WAIT_RESERVE']">{{countdownText}}</button>
    <button v-else-if="getPlanStatus['OPENING']">立即加入</button>
    <button v-else-if="getPlanStatus['OPEN_FULL']">销售结束</button>
    <button v-else-if="getPlanStatus['PERIOD_LOCKING']">收益中</button>
  </div>
</template>

<script>
import {parsePlanStatus} from 'utils/util'
export default {
  data() {
    return {
      countdownText: '立即加入',
      countdownTime: this.diffTime/1000
    }
  },
  props: {
    status: {
      type: [String, Number],
      default: '5'
    },
    endTime: {
      type: [String, Number]
    },
    diffTime: {
      type: Number
    }
  },
  computed: {
    getPlanStatus(type) {
      console.log(parsePlanStatus(this.status))
      return parsePlanStatus(this.status)
    },
  },
  created() {
    // 判断是否执行倒计时
    if (this.getPlanStatus['WAIT_RESERVE'] && this.countdownTime > 0) {
      this.countdown()
    }
  },
  methods: {
    countdown(diffTime) {
      let timer = setTimeout(() => {
        // 倒计时
        // console.log('1', this.countdownTime)
        if (this.countdownTime <= 0) {
          this.countdownEnd()
          clearTimeout(timer)
          return
        }
        this.countdownTime = this.countdownTime - 1;

        // 格式化剩余时间
        this.countdownText = this.formatDate(this.countdownTime)

        this.countdown(this.countdownTime)
      }, 1000)
    },
    refresh() {
      this.$store.dispatch('queryHomeData')
    },
    countdownEnd() {

      this.refresh()
    },
    formatDate(diffTime) {
      const timeObj = this.diffTimeToObj(diffTime)
      switch (timeObj) {
        case timeObj.years > 0:
          return `${this.leadingZeros(timeObj.years)}年${this.leadingZeros(timeObj.days)}天`
        case timeObj.days > 0:
          return `${this.leadingZeros(timeObj.days)}天${this.leadingZeros(timeObj.hours)}时`
        case timeObj.hours > 0:
          return `${this.leadingZeros(timeObj.hours)}时${this.leadingZeros(timeObj.min)}分`
        default: 
          return `${this.leadingZeros(timeObj.min)}分${this.leadingZeros(timeObj.sec)}秒`
      }
      // if (date.days > 0) {
      //   return `${this.leadingZeros(date.days, 2)}天${this.leadingZeros(date.hours, 2)}小时`;
      // } else if (date.days == 0 && date.hours > 0) {
      //   return `${this.leadingZeros(date.hours, 2)}天${this.leadingZeros(date.min, 2)}小时`
      // } else {
      //   return `${this.leadingZeros(date.min, 2)}天${this.leadingZeros(date.sec, 2)}小时`
      // }
    },
    diffTimeToObj(diff = 0) {
      const dateData = {
        years: 0,
        days: 0,
        hours: 0,
        min: 0,
        sec: 0,
        millisec: 0
      };

      if (diff <= 0) {
        return dateData;
      }

      if (diff >= (365.25 * 86400)) {
        dateData.years = Math.floor(diff / (365.25 * 86400));
        diff -= dateData.years * 365.25 * 86400;
      }
      if (diff >= 86400) {
        dateData.days = Math.floor(diff / 86400);
        diff -= dateData.days * 86400;
      }
      if (diff >= 3600) {
        dateData.hours = Math.floor(diff / 3600);
        diff -= dateData.hours * 3600;
      }

      if (diff >= 60) {
        dateData.min = Math.floor(diff / 60);
        diff -= dateData.min * 60;
      }

      dateData.sec = Math.round(diff);

      dateData.millisec = diff % 1 * 1000;

      return dateData;
    },
    leadingZeros(num, length) {
      length = length || 2;
      num = String(num);
      if (num.length > length) {
        return num;
      }
      return (Array(length + 1).join('0') + num).slice(-length);
    },

  }
}
</script>

<style lang="stylus" scoped>

</style>


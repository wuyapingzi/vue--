<template>
  <div class="home" :class="{'extend-bottom-padding': showDownloadBtn}" ref="home">
    <swiper :bannerList="bannerList"></swiper>

    <router-link class="announcement"  to="/announce" tag="div">
      <i class="horn"></i> {{announcement.title}}
    </router-link>

    <!-- 首页banner下面的资质图标 -->
    <home-clientele></home-clientele>

    <home-account class="home-account" :isLogin="isLogin" :accountInfo="accountInfo"></home-account>
    <router-link to='/plan/8'>plan</router-link>

    <div v-for="(planType, index) in orderKeys" :key="index" class="plan">
      <!-- <plan-list :type=planType :plan-data=></plan-list> -->
      <div v-if="productList[planType].length">
        <h3 v-if="planType !== 'planNewbie'" class="plan-type-title">{{planTypeTile(planType)}}</h3>
        <ul>
          <li v-for="(item, index) in productList[planType]" :key="index" :class="{'bottom-border': index+1 !== productList[planType].length}">
            <div>
              <div class="left">
                <span v-if="item.flag" class="plan-investment">热门推荐</span>
                <!-- 根据设计稿还需要细分 -->
                <span class="plan-investment">{{item.name}}</span>
              </div>
              <!-- 下面会有各种状态的按钮，热销中，销售结束，倒计时，收益中 -->
              <div v-if="planType !== 'planNewbie'" class="right">
                <!-- <button>倒计时</button> -->
                <plan-state-button :status="item.orderStatu" :endTime="item.beginSellingTime" :diffTime="item.diffTime"></plan-state-button>
              </div>
            </div>
            <div>
              <div class="rate">
                <div>
                  {{item.baseInterestRate}}<span class="small">%</span><span v-if="item.extraInterestRate" class="small">{{item.extraInterestRate}}%</span>
                </div>
                <span class="desc">平均历史年化收益</span>
              </div>
              <button v-if="planType === 'planNewbie'">新手专享</button>
              <div v-else class="period">
                <div>
                  {{item.extendLockPeriod}}<span class="small">个月</span>
                </div>
                <span class="desc">适用出借期限</span>
              </div>
            </div>
            <div>
              <div class="coupon">
                <i class="full-reduction" v-if="item.hasMoneyOffCoupon">满减券</i><i class="discount" v-if="item.hasDiscountCoupon">抵扣券</i>
              </div>
              <div class="featured-slogan">
                {{item.featuredSlogan}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="platform-data">
      <mt-cell title="小宝数据" class="platform-data-title-wrapper">
        <span class="platform-data-date">数据截止：{{platformData.statDate-0 | dateformat('YYYY年MM月DD日')}}</span>
      </mt-cell>
      <div class="platform-data-item-wrapper">
        <div>
          <h4>{{platformData.totalBorrowAmount}}万元</h4>
          <span>累计交易金额</span>
        </div>
        <div>
          <h4>{{platformData.totalEarnInterest}}元</h4>
          <span>累计为用户赚取收益</span>
        </div>
      </div>
    </div>

    <div class="platform-introduce">
      <div class="platform-introduce-item" v-for="(item, index) in platformIntroduce" :key="index">
        <a :href="item.url">
          <img :src="item.image" alt="">
        </a>
      </div>
      
    </div>

    <!-- 底部下载组件 -->
    <download-app-button v-if="showDownloadBtn" @closeDownloadBtn="closeDownloadBtn"></download-app-button>
    <!-- <deposit-upgrade login='isLogin'></deposit-upgrade> -->
    <!-- <deposit-account login='isLogin'></deposit-account> -->

  </div>
</template>

<script>
import swiper from '../swiper';
import homeClientele from '../home.clientele';
import homeAccount from '../home.account';
import downloadAppButton from '../download.button';
import planStateButton from '../plan.button';
import {mapState} from 'vuex';
import depositUpgrade from '../depository/upgrade'
import depositAccount from '../depository/account.modal'

export default {
  name: 'home',
  data() {
    return {
      showDownloadBtn: true
    }
  },
  computed: {
    // 获取home里的banner,announce,plan,平台数据；登录后用户信息
    ...mapState({
      // home 相关数据
      bannerList: state => state.home.bannerList,
      announcement: state => state.home.announcement,
      orderKeys: state => state.home.orderKeys,
      productList: state => state.home.productList,
      platformData: state => state.home.platformData,
      platformIntroduce: state => state.home.platformIntroduce,
      // 用户相关数据
      isLogin: state => state.user.isLogin,
      accountInfo: state => state.account.accountInfo,
    }),
  },
  created() {
    // 发送获取home页数据请求
    this.getHomeData()
console.log(123)
    // 如果登录的话，去获取用户信息
    if (this.isLogin) {
      console.log(123)
      this.getAccountInfo()
    }
    
  },
  methods:{
    getHomeData() {
      this.$store.dispatch('queryHomeData')
    },
    getAccountInfo() {
      this.$store.dispatch('getAccountInfo')
    },
    planTypeTile(planType = '') {
      const titleMap = {
        plan: '收益复投',
        planMonth: '按月计息'
      }
      return titleMap[planType];
    },
    closeDownloadBtn() {
      this.showDownloadBtn = false;
    },
    pop(e) {
      console.log('e',e.target.parentNode('li'), e.currenttarget)
    }
  },
  components: {
    swiper,
    homeClientele,
    homeAccount,
    downloadAppButton,
    planStateButton,
    depositUpgrade,
    depositAccount
  }
}
</script>

<style lang="stylus" scoped>

  @import '~@/assets/styles/mixin.stylus';
  
  .home 
    background: #F5F5F9
  .extend-bottom-padding
    padding-bottom: 50px
  .platform-data
    background: #fff
    &-title-wrapper
      display: flex
      justify-content: space-between
      align-items: baseline
      .mint-cell-text
        font-size: 16px
    &-date
      font-size: 12px
    &-item-wrapper
      display: flex
      justify-content: space-between
      text-align center
      div
        flex: 1
  .platform-introduce
    display: flex
    justify-content: space-around
    &-item
      // flex: 0
      width: 160px
      height: 65px
      a
        display: inline-block
      a, img 
        width: 100%
        height: 100%
  .home-account
    margin-bottom: 10px
  .plan
    background: #fff
    box-shadow: 0 0 0 0 rgba(0,0,0,0.50)
    px2rem('margin-bottom', 10)
    overflow: hidden
    &-type-title
      color: #333
      px2rem('font-size', 17)
      px2rem('margin-left', 15)
      px2rem('margin-top', 15)
      px2rem('margin-bottom', 15)
      px2rem('line-height', 16)
    &-investment
      px2rem('font-size', 14)
      px2rem('line-height', 14)
      color: #333
    .rate 
      px2rem('font-size', 25)
      px2rem('line-height', 25)
      color: #FF413C
</style>
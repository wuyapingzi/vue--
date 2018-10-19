'use strict';

const util = require('../lib/util');
const ErrorStatus = require('../lib/status');
const PlanModel = require('../model/plan');

const {
  _,
  formatURL,
} = util;

function BannerModel(model = {}) {
  if (model.image) {
    model.image = formatURL(model.image);
  }
  // 默认h5页面
  if (!model.type) {
    model.type = 'h5';
  }
  if (!model.link) {
    model.link = model.url;
  }
  if (model.type !== 'h5') {
    model.url = '';
  }
  return model;
}

function PopupsModel(model = {}) {
  if (model.image) {
    model.image = formatURL(model.image);
  }
  // 默认h5页面
  if (!model.type) {
    model.type = 'h5';
  }
  if (!model.link) {
    model.link = model.url;
  }
  return model;
}

function PlatformIntroductionModel(model = [], h5host) {
  return model.map(item => {
    if (item.image) {
      item.image = formatURL(item.image, h5host);
    }
    // 默认h5页面
    if (!item.type) {
      item.type = 'h5';
    }
    if (item.type === 'h5') {
      item.url = formatURL(item.url, h5host);
    }
    return item;
  });
}

const home = async(ctx) => {
  const service = ctx.service;
  const cache = ctx.cache.home;

  const now = Date.now();
  const isAvailable = (item) => {
    // 有效期内
    const start = (_.get(item, 'start') - 0) || 0;
    const end = (_.get(item, 'end') - 0) || 0;
    if ((start < now) && (!end || now < end)) {
      return true;
    }
  };

  const {
    userId,
    ipAddress,
    platform,
    // isNewbie,
    // isLogin
  } = ctx.args;

  const query = {
    userId,
    ipAddress,
    platform
  };

  const homePlatformIntroduction = [
    {
      title: '信息披露',
      url: '/about/company',
      image: '/img/app-information-disclosure.png',
      type: 'h5'
    },
    {
      title: '资金存管',
      url: '/about/platform',
      image: '/img/app-platform-data.png',
      type: 'h5'
    }
  ];

  let ret;
  try {
    console.log('1111');
    const [
      bannerList = [],
      announceList = [],
      {h5host},
      {
        productList: {
          planNewbie = [],
          planMonth = [],
          plan = [],
        },
        orderKeys = [],
      },
      platformData
    ] = await Promise.all([
      cache.get_app_banner_list(),
      cache.get_app_announce_list(),
      cache.get_app_global(),
      service.plan.query(query, 'mobile/home/recommend'),
      service.about.query(query, 'platform')
    ]);
    console.log(bannerList, announceList);
    ret = {
      bannerList: bannerList.filter(isAvailable).map(BannerModel),
      announcement: announceList[0],
      productList: {
        planNewbie: planNewbie.map(PlanModel),
        planMonth: planMonth.map(PlanModel),
        plan: plan.map(PlanModel),
      },
      orderKeys,
      platformData,
      platformIntroduce: PlatformIntroductionModel(homePlatformIntroduction, h5host),
    };
    console.log(ret);
  } catch (error) {
    console.log(error);
    ctx.dumpJSON(ErrorStatus.SERVER_FAIL, error);
    return;
  }
  ctx.dumpJSON(ret);
};

// home popups
home.popups = async(ctx) => {
  const cache = ctx.cache.home;

  const now = Date.now();
  const isAvailable = (item) => {
    // 有效期内
    const start = (_.get(item, 'start') - 0) || 0;
    const end = (_.get(item, 'end') - 0) || 0;
    if ((start < now) && (!end || now < end)) {
      return true;
    }
  };

  let values;
  let ret;

  try {
    values = await cache.get_app_popups_list();
    ret = values && values.find(isAvailable);
    ret = ret && PopupsModel(ret);
  } catch (error) {
    logger.error('appAnnounceList', error);
    ctx.dumpJSON(ErrorStatus.FAIL, error);
    return;
  }
  ctx.dumpJSON(ret);
};

module.exports = home;

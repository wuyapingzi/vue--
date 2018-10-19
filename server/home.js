'use strict';

const util = require('../lib/util');
const ErrorStatus = require('../lib/status');
const PlanModel = require('../model/plan');

const {
  _,
  log4js,
  formatURL
} = util;

const logger = log4js.getLogger('API:home');

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
      item.image = formatURL(item.image);
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
    isNewbie,
    isLogin
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
      title: '平台数据',
      url: '/about/platform',
      image: '/img/app-platform-data.png',
      type: 'h5'
    }
  ];

  const NEWBIE_PRODUCT_VERSION = 'newbie'; //2.5.0版本（新手产品、推荐位包含按月提取收益）
  const MONTHLY_PRODUCT_VERSION = 'all'; //2.4.0版本（推荐位包含按月提取收益）
  const REDELIVERY_PRODUCT_VERSION = 'invest'; //2.4.0之前版本（推荐位不包含按月提取收益）
  const NEWBIE_MONTHLY_redelivery_PRODUCT = 'home/newbieVersionRecommend';

  // 不同版本接口action
  const actionMap = {
    [NEWBIE_PRODUCT_VERSION]: 'plan/newbieProduct',
    [MONTHLY_PRODUCT_VERSION]: 'home/all',
    [REDELIVERY_PRODUCT_VERSION]: 'home/featured'
  };

  let cashType = (ctx.checkQuery('cashType').value || '').toLowerCase(),
    shouldDisplayNewbieProduct,
    recommendAction,
    newbieAction,
    values,
    ret;

  // 根据cashType值区分不同版本home接口具有的功能
  const versionMap = {
    [NEWBIE_PRODUCT_VERSION](cashType) {
      shouldDisplayNewbieProduct = isNewbie || !isLogin;
      recommendAction = NEWBIE_MONTHLY_redelivery_PRODUCT;
      newbieAction = actionMap[cashType];
    },
    [MONTHLY_PRODUCT_VERSION](cashType) {
      recommendAction = actionMap[cashType];
    },
    def() {
      recommendAction = actionMap[REDELIVERY_PRODUCT_VERSION];
    }
  };

  versionMap[cashType] ? versionMap[cashType](cashType) : versionMap.def();

  try {
    values = await Promise.all([
      cache.get_app_banner_list(),
      service.plan.query(query, recommendAction),
      cache.get_app_global(),
      shouldDisplayNewbieProduct ? service.plan.query(query, newbieAction) : null
    ]);
    const appGlobalData = _.get(values, '[2]', []);
    const {
      planTitle,
      baseTitle,
      h5host,
    } = appGlobalData;
    ret = {
      bannerList: (_.get(values, '[0]', [])).filter(isAvailable).map(BannerModel),
      homePlanRecommend: (_.get(values, '[1].dataList', [])).map(PlanModel),
      homeTitle: {
        planTitle,
        baseTitle,
      },
      homePlatformIntroduction: PlatformIntroductionModel(homePlatformIntroduction, h5host),
    };
    if (shouldDisplayNewbieProduct) {
      const dataList = (_.get(values, '[3].dataList', [])).map(PlanModel);
      // 2.5版本新添加新手产品图片地址
      const {
        newbieProductImg,
        newbieProductUrl,
        h5host,
      } = _.get(values, '[2]', []);
      const img = formatURL(newbieProductImg);
      const url = formatURL(newbieProductUrl, h5host);
      const newbieProductData = {
        dataList,
        img,
        url,
      };
      Object.assign(ret, {newbieProductData});
    }
  } catch (error) {
    logger.error('home.Promise.all.error', error);
    ctx.dumpJSON(ErrorStatus.SERVER_FAIL, error);
    return;
  }
  ctx.dumpJSON(ret);
};

home.announceList = async(ctx) => {
  const cache = ctx.cache.home;

  const {
    pageSize,
    pageNumber
  } = ctx.args;
  const start = (pageNumber - 1) * pageSize;
  const end = pageNumber * pageSize;

  let value;
  let ret;

  try {
    value = await cache.get_app_announce_list();
    const totalCount = value.length;
    ret = {
      dataList: value.slice(start, end).map((x) => _.omit(x, 'content')),
      totalCount,
      pageSize,
      pageNumber
    };
  } catch (error) {
    logger.error('appAnnounceList', error);
    ctx.dumpJSON(ErrorStatus.FAIL, error);
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
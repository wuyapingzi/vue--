'use strict';

const ErrMsg = require('../lib/errormsg');
const {
  safeRealname,
  availableRaise,
  _,
  INCOME_TREATMENT
} = require('../lib/util');

const landing = async(next) => {
  await next();
};

landing.shareQrcode = async(ctx, next) => {
  const service = ctx.service;
  let staffId, query, ret;
  const {
    ipAddress,
    platform
  } = ctx.args;
  if (ctx.method === 'POST') {
    staffId = ctx.checkBody('staffId').value || '';
    query = {
      investCode: staffId,
      ipAddress,
      platform
    };
    if (ctx.errors) {
      return await next();
    }
    try {
      ret = await service.account.fetch(query, 'vertifyInviteCode');
    } catch (error) {
      ctx.addError('invite', ErrMsg.isStaffId);
      return await next();
    }
    if (!ret) {
      ctx.addError('invite', ErrMsg.def);
      return await next();
    }
    ctx.state.staffId = staffId;
    ctx.redirect('/landing/invite/' + staffId);
  }
  await next();
};
landing.inviteShare = async(ctx, next) => {
  const service = ctx.service;
  const staffId = ctx.checkParams('id').value || '';
  const {
    ipAddress,
    platform
  } = ctx.args;
  let query = {
    investCode: staffId,
    ipAddress,
    platform
  };
  let ret;
  try {
    ret = await service.account.fetch(query, 'vertifyInviteCode');
  } catch (error) {
    ctx.redirect('/landing/invite');
    return;
  }
  if (!ret) {
    ctx.redirect('/landing/invite');
    return;
  }
  ctx.state.staffId = staffId;

  await next();
};
landing.about = async(ctx, next) => {
  //const service = ctx.service;
  let staffId = ctx.checkParams('id').isInt().value || 0;
  if (ctx.errors) {
    staffId = 0;
  }
  const {
    utmSource
  } = ctx.args;
  // let query = {
  //   investCode: staffId,
  //   ipAddress,
  //   platform
  // };
  // let ret;
  // try{
  //   ret = await service.account.fetch(query, 'vertifyInviteCode');
  // }catch(error){
  //   ctx.redirect('/landing/invite');
  //   return;
  // }
  // if (!ret) {
  //   ctx.redirect('/landing/invite');
  //   return;
  // }

  Object.assign(ctx.state, {
    staffId,
    utmSource
  });
  await next();
};

landing.inviteRegister = async(ctx, next) => {
  const userId = ctx.checkParams('id').value - 0 || 0;
  let inviteSerial, realName;
  try {
    await ctx.cache.user.get_state(userId).then(
      function(value) {
        if (!value) {
          ctx.addError('register', ErrMsg.def);
          return;
        }
        ({
          inviteSerial,
          realName
        } = value);
      });
  } catch (err) {
    inviteSerial = '';
    realName = '';
  }

  Object.assign(ctx.state, {
    userId: userId,
    inviteSerial: inviteSerial || '',
    inviteRealname: realName ? safeRealname(realName) : '',
    utmSource: ctx.checkQuery('utmSource').value || ''
  });
  await next();
};

landing.carnival = async(ctx, next) => {
  let utmSource = ctx.checkQuery('utmSource').value || '';
  let interimReview = !ctx.checkParams('action').value;
  Object.assign(ctx.state, {
    utmSource,
    interimReview
  });
  await next();
};

landing.registerShare = async(ctx, next) => {
  let {
    utmSource
  } = ctx.args;
  Object.assign(ctx.state, {
    utmSource
  });
  await next();
};

landing.highPoint = async(ctx, next) => {
  let list = await ctx.cache.home.get_app_raiseList();
  let item = _.find(list, availableRaise);
  ctx.state.raiseList = item;
  await next();
};
landing.investedGift = async(ctx, next) => {
  const servicePlan = ctx.service.plan;
  const serviceAccount = ctx.service.account;

  //- 是否是京东卡活动
  let isJdActive;
  const {
    userId,
    isLogin,
    platform,
    ipAddress,
  } = ctx.args;
  const userInfo = await ctx.cache.user.get_state(userId) || {};
  const {
    promotion = '',
  } = userInfo;
  const isPromotion = promotion.indexOf('Group3') !== -1;
  const isPromotionGroup6 = promotion.indexOf('Group6') !== -1;
  if (isPromotion || isPromotionGroup6) {
    isJdActive = 1;
  }
  const query = {
    platform,
    ipAddress,
    isActivice: isJdActive,
    cashType: INCOME_TREATMENT.INVEST,
  };
  const jdCardQuery = {
    userId,
    platform,
    ipAddress,
  };
  let values;
  if (!isLogin) {
    return await next();
  }

  try {
    values = await Promise.all([
      servicePlan.query(query, 'planlist/recommend'),
      serviceAccount.query(jdCardQuery, 'account/jdCards')
    ]);

    Object.assign(ctx.state, {
      recommendList: _.get(values[0], 'dataList', []),
      jdCards: _.get(values[1], 'userCards', {})
    });
  } catch (error) {
    ctx.addError('page', error.message || ErrMsg.def);
    ctx.state.errors = ctx.errors;
  }

  await next();
};

landing.registerJdCard = async(ctx, next) => {
  const service = ctx.service.plan;

  const defaultList = [{
    lockPeriod: 1,
    expectedRate: '5.8'
  }, {
    lockPeriod: 3,
    expectedRate: '6.5'
  }, {
    lockPeriod: 6,
    expectedRate: '7.5'
  }, {
    lockPeriod: 12,
    expectedRate: '9.6'
  }];
  const utmSource = ctx.checkQuery('utmSource').value || '';
  const {
    ipAddress,
    platform
  } = ctx.args;
  const query = {
    cashType: INCOME_TREATMENT.INVEST,
    isActivice: 1,
    ipAddress,
    platform
  };
  let ret;
  let recommendPlanList;
  try {
    ret = await service.query(query, 'home/recommend');
    ({
      dataList: recommendPlanList = defaultList
    } = ret);
  } catch (error) {
    recommendPlanList = defaultList;
  }

  Object.assign(ctx.state, {
    recommendPlanList,
    utmSource
  });
  await next();
};

landing.miya = async(ctx, next) => {
  const service = ctx.service.plan;
  const { userId, ipAddress, platform, utmSource } = ctx.args;
  const query = {
    userId,
    ipAddress,
    platform,
    isActivice: '2',
    cashType: INCOME_TREATMENT.INVEST,
  };

  let ret;
  let planList;
  try {
    if (!ctx.state.isLogin || utmSource){
      planList = [
        {id: '1', lockPeriod: '1', baseInterestRate: '5.8', extraInterestRate: '1.0'},
        {id: '3', lockPeriod: '3', baseInterestRate: '6.5', extraInterestRate: ''},
        {id: '9', lockPeriod: '9', baseInterestRate: '9.6', extraInterestRate: '1.0'}
      ];
      Object.assign(ctx.state, {
        utmSource,
        planList
      });
      return await next();
    }
    ret = await service.query(query, 'home/recommend');
    planList = _.get(ret, 'dataList') || [];
  } catch (error) {
    ctx.addError('page', error.message || ErrMsg.def);
    ctx.state.errors = ctx.errors;
  }
  Object.assign(ctx.state, {
    utmSource,
    planList
  });
  await next();
};

module.exports = landing;
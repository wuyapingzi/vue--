'use strict';
const ErrMsg = require('../lib/errormsg');
const {
  _,
  bankTips
} = require('../lib/util');

const util = require('../lib/util');
const PlanModel = require('../model/plan');
const ErrorStatus = require('../lib/status');

const {
  parseAccountPlanListCashDrawDay,
  parsePlanCashType,
  parsePlanPayments,
  quitWayDefault,
  quitWaysDesc
} = util;
const plan = async(ctx, next) => {
  await next();
};

plan.planBuy = async(ctx) => {
  const service = ctx.service.plan;
  const accountService = ctx.service.account;
  const {userId, ipAddress, platform} = ctx.args;
  const query = {
    userId,
    ipAddress,
    platform,
    financePlanId: ctx.checkParams('id').value
  };
  let values;
  // let planDetailData;
  let data = {};
  try {
    values = await Promise.all([
      service.query(query, 'detail'),
      accountService.fetch(query, 'blance'),
      accountService.fetch(query, 'bankcard')
    ]);
    data.planDetailData = values && _.get(values, '[0].dataList[0]');
    data.totalInterest = values && _.get(values, '[0].totalInterest') || 0;
    data.bestCoupon = values && _.get(values, '[0].bestCoupon') || {};
    data.availablePoints = values && _.get(values, '[1].point') && _.get(values, '[1].point.availablePoints');
    data.bankCode = values && _.get(values, '[2].userBank') && _.get(values, '[2].userBank.bankCode') || '';
    data.bankName = values && _.get(values, '[2].userBank') && _.get(values, '[2].userBank.bankType') || '';
    data.bankLimit = bankTips || {};
    console.log('values', values[2]);
  } catch (error) {
    console.log(error);
    ctx.dumpJSON(400, error._message || ErrMsg.def);
    return;
  }

  console.log(data);
  ctx.dumpJSON(data);
};

plan.couponChoose = async() => {
  // const service = ctx.service.plan;
  // const {userId, ipAddress, platform} = ctx.args;
  // const query = {
  //   userId,
  //   ipAddress,
  //   platform,
  //   couponId: ctx.checkBody('couponId').value ||'',
  // };
};
plan.record = async(ctx) => {
  const service = ctx.service.plan;
  const {
    platform,
    userId,
    pageNumber,
    ipAddress
  } = ctx.args;

  const data = {
    platform,
    userId,
    pageNumber,
    ipAddress,
    financePlanId: ctx.checkParams('id').isInt().toInt().value,
    order: 'TIME'
  };
  let ret;

  try{
    ret = await service.query(data, 'plan/join');
    ctx.dumpJSON(ret);
  } catch (error) {
    ctx.dumpJSON(ErrorStatus.SERVER_FAIL, error);
    return;
  }
};

plan.investList = async(ctx) => {
  const service = ctx.service.plan;
  const {
    platform,
    userId,
    pageNumber,
    ipAddress
  } = ctx.args;

  const data = {
    platform,
    userId,
    pageNumber,
    ipAddress
  };
  let ret;

  try{
    ret = await service.query(data, 'plan/invest');
    ctx.dumpJSON(ret);
  } catch (error) {
    ctx.dumpJSON(ErrorStatus.SERVER_FAIL, error);
    return;
  }
};

plan.detail = async(ctx) => {
  const service = ctx.service.plan;
  const now = Date.now();
  const financePlanId = ctx.checkParams('id').isInt().toInt().value;

  const {
    userId,
    ipAddress,
    platform,
  } = ctx.args;
  const query = {
    userId,
    ipAddress,
    platform,
    financePlanId
  };

  let values, ret;

  try {
    values = await service.query(query, 'detail');

    const {
      dataList: [detailData]
    } = values;

    const {beginSellingTime, cashType, cashDrawDay} = detailData;
    const timestamp = util.moment(beginSellingTime).format('x');
    const diffTime = timestamp - now;

    ret = {
      ...values,
      ...PlanModel(detailData),
      dataList: [],
      diffTime,
      incomeApproach: parsePlanCashType(cashType),
      quitWayDefault,
      quitWaysDesc,
    };

    if (parsePlanPayments(cashType)) {
      const interestDate = parseAccountPlanListCashDrawDay(cashDrawDay);
      Object.assign(ret, {interestDate});
    }
  } catch (error) {
    ctx.dumpJSON(ErrorStatus.SERVER_FAIL, error);
    return;
  }
  ctx.dumpJSON(ret);
};

module.exports = plan;
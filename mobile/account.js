'use strict';

const util = require('../lib/util');
const ErrMsg = require('../lib/errormsg');
const { _, parseUserAgent, versionCompare } = util;
const share = require('./share');
const UserModel = require('../model/user');
const HTTP_POST = 'POST';

const account = async(ctx, next) => {
  await next();
};

account.planAgreement = async(ctx, next) => {
  const service = ctx.service.account;
  const {
    userId,
    platform,
    ipAddress
  } = ctx.args;

  const id = ctx.checkParams('id').notEmpty(ErrMsg.isProductEmptyId).trim().isInt(ErrMsg.isProductIdInt).toInt().value;

  let action = ctx.checkParams('action').trim().value;
  const isMonthlyPaymentsPlan = {
    'plan': false,
    'planMonth': true
  };
  action = (action in isMonthlyPaymentsPlan)? action : 'plan';
  isMonthlyPaymentsPlan[action] && (ctx.state.isMonthlyPaymentsPlan = true);
  const query = {
    financePlanId: id,
    userId,
    platform,
    ipAddress
  };

  if (ctx.errors) {
    ctx.state.errors = ctx.errors;
    return await next();
  }

  let ret;
  try {
    ret = await service.fetch(query, 'accountPlanAgreement');
    ctx.state.agreementData = ret;
  } catch (error) {
    ctx.addError('page', error._message || ErrMsg.def);
  }
  await next();
};

account.loanAgreement = async(ctx, next) => {
  const service = ctx.service.account;
  const {
    userId,
    ipAddress,
    platform
  } = ctx.args;

  const id = ctx.checkParams('id').notEmpty(ErrMsg.isProductEmptyId).trim().isInt(ErrMsg.isProductIdInt).toInt().value;

  const query = {
    loanId: id,
    userId,
    ipAddress,
    platform
  };

  if (ctx.errors) {
    ctx.state.errors = ctx.errors;
    return await next();
  }

  let ret;
  try{
    ret = await service.fetch(query, 'accountLoanAgreement');
    Object.assign(ctx.state, {
      agreementData: ret,
      agreementUserID: userId
    });
  }catch(error){
    ctx.addError('page', error._message || ErrMsg.def);
  }
  await next();
};

account.invite = async(ctx, next) => {
  const {
    isLogin,
    userId,
    ipAddress,
    platform
  } = ctx.args;

  const ACTIONS = {
    customerInvite: 'customerInvite',
    salesInvite: 'salesInvite'
  };

  const sellerTpl = './mobile/account.invite.seller.pug';
  const userAgent = ctx.get('x-hxb-user-agent');
  const { version } = parseUserAgent(userAgent);
  const minVersion = '2.3.0';
  const hasUpgradeMsg = versionCompare(version, minVersion) < 0;

  if (!isLogin) {
    Object.assign(ctx.state, {
      hasUpgradeMsg,
      isCustomerDisplay: true
    });
    return await next();
  }
  const query = {
    userId,
    ipAddress,
    platform
  };
  const {
    isCreateEscrowAcc,
    inviteRole,
    isSales,
    isDisplayInvite,
  } = UserModel(ctx.state.userState);
  const action = isSales ? ACTIONS.salesInvite : ACTIONS.customerInvite;

  let ret, inviteReward, staffId, shareId;
  !isSales && await ctx.proxy.inviteInfo(query)
    .then(function(value) {
      if (!value) {
        ctx.addError('invite', ErrMsg.def);
      }
      ret = JSON.parse(value);
      if (ret.status !== 0) {
        ctx.addError('invite', ret.message);
      }
      inviteReward = _.get(ret, 'data', {});
    }, function() {
      inviteReward = '';
    });

  isSales && await ctx.proxy.getEmployeeId(query)
    .then(function(value) {
      if (!value) {
        ctx.addError('salesInvite', ErrMsg.def);
      }
      ret = JSON.parse(value);
      if (ret.status !== 0) {
        ctx.addError('salesInvite', ret.message);
      }
      staffId = _.get(ret.data, 'employeeId', '') - 0;
    }, function() {
      staffId = 0;
    });
  shareId = isSales ? staffId : userId;
  Object.assign(ctx.state, {
    shareData: JSON.stringify(share(shareId, ACTIONS[action])),
    hasUpgradeMsg
  });
  if (isSales) {
    Object.assign(ctx.state, {
      tpl: sellerTpl,
      staffId,
      isSalesDisplay: isSales
    });
  } else {
    Object.assign(ctx.state, {
      inviteReward,
      isCreateEscrowAcc,
      hasNativeShowMsg: isSales || !inviteRole,
      isCustomerDisplay: !isSales,
      isDisplayInvite,
    });
  }
  await next();
};
account.bankcardAdd = async(ctx, next) => {
  const service = ctx.service.account;
  const bindcardReturnUrl = await util.getThirdPartyReturnUrl.call(ctx, 'bindcard', 'http://192.168.1.114:3200');
  const {
    userId,
    platform,
    ipAddress
  } = ctx.args;

  let data = {
    userId,
    platform,
    ipAddress
  };

  ctx.state.bankTips = util.bankTips;
  ctx.state.bankCodeList = util.bankCodeList;
  if (ctx.method === HTTP_POST) {

    data.bankCode = ctx.checkBody('bankCode').notEmpty(ErrMsg.isBankIdEmpty).trim().value;
    data.bankNum = ctx.checkBody('inputBankcard').notEmpty(ErrMsg.isEmpTyBankNo).trim().replace(/\s/g, '').value;

    if (ctx.errors) {
      ctx.dumpJSON(400, ctx.getError().message || ErrMsg.def, ctx.getErrors());
      return;
    }

    Object.assign(data, {
      redirectUrl: bindcardReturnUrl
    });

    let ret;
    try {
      ret = await service.update(data, 'bankcard/bind');
      if(!ret.url && ret.result.gatewayUrl) {
        ret.url = ret.result.gatewayUrl;
        delete ret.result.gatewayUrl;
      }
      ctx.dumpJSON(ret);
    } catch (error) {
      console.log(error);
      ctx.dumpJSON(400, error._message || ErrMsg.def);
    }
  }
  await next();
};
account.unbindBankCard = async(ctx, next) => {
  const service = ctx.service.account;
  const unbindcardReturnUrl = await util.getThirdPartyReturnUrl.call(ctx, 'unbindcard', 'http://192.168.1.114:3200');
  const {
    userId,
    platform,
    ipAddress
  } = ctx.args;

  let data = {
    userId,
    platform,
    ipAddress
  };

  let bankcardInfo;
  try{
    bankcardInfo = await service.fetch(data, 'bankcard');
    if (!bankcardInfo.enableUnbind) {
      ctx.dumpJSON(400, bankcardInfo.enableUnbindReason || ErrMsg.def);
      return;
    }
    ctx.state.userCard = _.get(bankcardInfo, 'data.userBank') || '';
  }catch(error){
    ctx.dumpJSON(400, error._message || ErrMsg.def);
    return;
  }

  Object.assign(data, {
    redirectUrl: unbindcardReturnUrl
  });

  let ret;
  try {
    ret = await service.update(data, 'bankcard/unbind');
    if(!ret.url && ret.result.gatewayUrl) {
      ret.url = ret.result.gatewayUrl;
      delete ret.result.gatewayUrl;
    }
  } catch (error) {
    ctx.dumpJSON(400, error._message || ErrMsg.def);
    return;
  }
  ctx.dumpJSON(ret);
  await next();
};
account.quickpay = async(ctx, next) => {
  const service = ctx.service.account;
  const quickpayReturnUrl = await util.getThirdPartyReturnUrl.call(ctx, 'quickpay', 'http://192.168.1.114:3200');
  const {
    userId,
    platform,
    ipAddress
  } = ctx.args;

  let userAssetsData = {
    userId,
    platform,
    ipAddress
  };

  // ctx.state.bankTips = util.bankTips;

  // let values;
  // try{
  //   values = await Promise.all([
  //     service.fetch(userAssetsData, 'asset'),
  //     service.fetch(userAssetsData, 'bankcard')
  //   ]);
  //   _.extend(ctx.state, {
  //     accountAvailableBalance: values[0] && _.get(values[0], 'availablePoint') || 0,
  //     userCard: values[1] && _.get(values[1], 'userBank') || ''
  //   });
  // }catch(error){
  //   ctx.throw(error);
  // }

  if (ctx.method === HTTP_POST) {

    let amount = ctx.checkBody('amount').notEmpty(ErrMsg.isEmptyCharge).trim().value;

    if (ctx.errors) {
      ctx.dumpJSON(400, ctx.getError().message || ErrMsg.def, ctx.getErrors());
      return;
    }
    Object.assign(userAssetsData,{
      amt: util.toFixed(amount, 2),
      returnUrl: quickpayReturnUrl,
    });
    console.log('充值金额：', userAssetsData);
    let ret;
    try{
      ret = await service.update(userAssetsData, 'quickpay');
      if(!ret.url && ret.result.gatewayUrl) {
        ret.url = ret.result.gatewayUrl;
        delete ret.result.gatewayUrl;
      }
      ctx.dumpJSON(ret);
    }catch(error){
      console.log('充值出错===', error);
      ctx.dumpJSON(400, error._message || ErrMsg.def);
    }
  }
  await next();
};

account.withdraw = async(ctx, next) => {
  const service = ctx.service.account;
  const withdrawReturnUrl = await util.getThirdPartyReturnUrl.call(ctx, 'withdraw', 'http://192.168.1.144:3200');
  const {
    userId,
    platform,
    ipAddress
  } = ctx.args;

  let userAssetsData = {
    userId,
    platform,
    ipAddress
  };

  let userAvailableBalance;

  let values;
  try{
    values = await Promise.all([
      service.fetch(userAssetsData, 'asset'),
      // service.fetch(userAssetsData, 'bankcard'),
      // service.fetch(userAssetsData,'accountWithdrawCount'),
    ]);
    // if (!values[0] || !values[1] || !values[2]) {
    //   ctx.addError('page', ErrMsg.def);
    //   return;
    // }
    if (!values[0]) {
      ctx.dumpJSON(400, ErrMsg.def);
      return;
    }
    userAvailableBalance = ctx.state.accountAvailableBalance = _.get(values[0], 'availablePoint') - 0 || 0;
    // ctx.state.userCard = _.get(values[1], 'userBank') || {};
    // ctx.state.accountwithdrawCount = _.get(values[2], 'inprocessCount') - 0 || 0;
  }catch(error){
    ctx.dumpJSON(400,  error._message || ErrMsg.def);
  }

  if (ctx.method === HTTP_POST) {

    let amount = ctx.checkBody('amount').notEmpty(ErrMsg.isEmptyCharge).trim().value;

    if (ctx.errors) {
      ctx.dumpJSON(400, ctx.getError().message || ErrMsg.def, ctx.getErrors());
      return;
    }

    Object.assign(userAssetsData, {
      amt: util.toFixed(amount, 2),
      returnUrl : withdrawReturnUrl
    });
    // ctx.state.amount = amount;

    if (userAssetsData.amt < 1) {
      ctx.dumpJSON(400, ErrMsg.withdrawError);
      return;
    }

    if (userAssetsData.amt > userAvailableBalance) {
      ctx.dumpJSON(400, ErrMsg.isAmountError);
      return;
    }

    let ret;
    try{
      ret = await service.update(userAssetsData, 'withdraw');
      if(!ret.url && ret.result.gatewayUrl) {
        ret.url = ret.result.gatewayUrl;
        delete ret.result.gatewayUrl;
      }
      ctx.dumpJSON(ret);
    }catch(error){
      ctx.dumpJSON(400, error._message || ErrMsg.def);
    }
  }
  await next();
};

account.withdrawList = async(ctx, next) => {
  // account/withdraw/list    service文件 接口名称
  // const serviceAccount = ctx.service.account;
  // const {
  //   userId,
  //   platform,
  //   ipAddress,
  // } = ctx.args;
  var userId = _.get(ctx.state, 'user.id') - 0 || 0;
  var pageData = util.getListPageData.call(ctx);
  _.extend(ctx.state, {
    page: pageData.pageNumber,
    pageUrl: '?page=',
    pageTotal: 0,
    pageSize: pageData.pageSize
  });
  const data = {
    userId: userId,
    ipAddress: ctx.ip,
    platform: 'pc',
    pageNumber: pageData.pageNumber,
    pageSize: pageData.pageSize
  };

  if (ctx.errors) {
    ctx.state.errors = ctx.errors;
    return next();
  }

  await ctx.proxy.accountWithdrawList(data)
    .then(function(val) {
      if (!val) {
        ctx.addError('page', ErrMsg.def);
        return;
      }
      var ret = JSON.parse(val);
      if (!ret || ret.status != 0) {
        ctx.addError('page', ret.message || ErrMsg.def);
        return;
      }

      var total = _.get(ret, 'data.totalCount', 0) - 0;
      var count = util.pageCount(total, data.pageSize);
      _.extend(ctx.state, {
        dataList: _.get(ret, 'data.dataList') || [],
        totalCount: total,
        pageTotal: count
      });
    }, function(error) {
      logger.error('account.withdrawList', error);
    });
  await next();
};

account.active = async(ctx) => {
  const service = ctx.service.account;
  const { ipAddress, platform } = ctx.args;
  // const activeReturnUrl = await util.getThirdPartyReturnUrl.call(
  //   ctx,
  //   'accountactive',
  //   ctx.origin
  // );
  const query = {
    userId: '300078',
    ipAddress,
    platform,
    redirectUrl: 'http://192.168.1.153:9000/login'
  };
  let ret;
  try {
    ret = await service.fetch(query, 'account/active');
    ctx.dumpJSON(ret);
  } catch (error) {
    console.log(error);
    ctx.dumpJSON(400, error._message || ErrMsg.def);
  }
};

account.depository = async ctx => {
  const service = ctx.service.account;
  const { ipAddress, platform } = ctx.args;
  const query = {
    userId: '300078',
    ipAddress,
    platform,
    name: ctx.checkBody('username').value,
    idNo: ctx.checkBody('idcard').value,
    cardNumber: ctx.checkBody('bankNumber').value,
    bankCode: '5006',
    redirectUrl: 'http://192.168.1.153:9000/login'
  };
  console.log(query);
  let ret;
  try{
    ret = await service.fetch(query, 'deposit/account');
    ctx.dumpJSON(ret);
  }catch(error){
    console.log(error);
    ctx.dumpJSON(400, error._message || ErrMsg.def);
  }
};

module.exports = account;
'use strict';

const util = require('../lib/util');
const ErrMsg = require('../lib/errormsg');
const ErrorStatus = require('../lib/status');
const cache = require('../cache');

const { _ } = util;

/**
 * get mobile
 */
function getMobile(k) {
  var ctx = this;
  if (!k) {
    k = 'mobile';
  }
  return ctx
    .checkBody(k)
    .notEmpty(ErrMsg.isMobile)
    .trim().value;
}

/**
 * get signup form data from req.body
 */
function getSignupData() {
  var ctx = this;
  var data = {
    mobile: ctx
      .checkBody('mobile')
      .notEmpty(ErrMsg.emptyMobile)
      .match(util.reMobile, ErrMsg.isMobile)
      .trim().value,
    smscode: ctx
      .checkBody('smscode')
      .notEmpty(ErrMsg.emptyPwd)
      .len(4, 6, ErrMsg.lenSmsCode)
      .trim().value,
    password: ctx
      .checkBody('password')
      .notEmpty(ErrMsg.emptyPwd)
      .len(8, 20, ErrMsg.lenPwd)
      .match(util.checkPassword, ErrMsg.purePwd)
      .trim().value
    // repeatPassword: ctx.checkBody('repwd').notEmpty(ErrMsg.emptyPwd).len(8, 20, ErrMsg.lenPwd).trim().value,
  };
  return data;
}

const user = async ctx => {
  ctx.dumpJSON({
    csrf: ctx.csrf,
    time: Date.now()
  });
};

user.loginPost = async ctx => {
  const service = ctx.service.user;
  const {ipAddress, platform, sessionId} = ctx.args;
  let data = {};
  let loginCount = ctx.session.loginCount = ctx.session.loginCount || 0;
  const code = _.get(ctx.session, 'captcha', '100000');
  loginCount = ctx.session.loginCount++;
  const captcha = ctx.checkBody('captcha').value;
  if (captcha && captcha !== code) {
    delete ctx.session.captcha;
    data.loginCount = loginCount;
    ctx.dumpJSON(400,  ErrMsg.isCaptcha || ErrMsg.def, {loginCount: loginCount});
    return;
  }
  const query = {
    mobile: ctx.checkBody('username').value,
    password: ctx.checkBody('password').value,
    sessionId,
    device: 'PC',
    ipAddress,
    platform
  };
  let ret;
  let userState;
  console.log(query);
  try {
    ret = await service.fetch(query, 'userLoginPost');
    ctx.session.isLogin = true;
    ctx.session.loginCount = 0;
    ctx.session.user = {
      id: _.get(ret, 'userId') - 0 || 0,
      name: _.get(ret, 'username') || '',
      mobile: query.mobile,
      time: Date.now()
    };
    data.loginCount = loginCount;
    userState = await cache.user.get_state(ctx.session.user.id);
    console.log(userState);
    data.userState = userState;
  } catch (error) {
    data.loginCount = loginCount;
    ctx.dumpJSON(400, error._message || ErrMsg.def, data);
    return;
  }
  ctx.dumpJSON(data);

};


user.checkCaptcha = async(ctx, next) => {
  var code = _.get(ctx.session, 'captcha', '100000');
  var captcha = ctx.checkBody('captcha').notEmpty(ErrMsg.lenCaptcha).trim().toLowercase().value;
  if (captcha && code !== captcha) {
    ctx.dumpJSON(400, ErrMsg.isCaptchaCorrect || ErrMsg.def);
    return;
  }
  await next();
};

user.sendSmsCode = async ctx => {
  const service = ctx.service.user;
  const {ipAddress, platform} = ctx.args;
  const type = ctx.checkBody('codeType').value;
  const query = {
    ipAddress,
    platform,
    mobile: getMobile.call(ctx),
    type: 'REGISTER'
  };

  try{
    await service.update(query, type === 'voiceType' ? 'verifycode/voice' : 'verifycode/sms');
  } catch(error) {
    ctx.dumpJSON(400, error._message || ErrMsg.def);
    return;
  }
  ctx.dumpJSON();
};

user.mobileCheck = async(ctx, next) => {
  const service = ctx.service.user;
  const { ipAddress, platform } = ctx.args;
  const query = {
    mobile: getMobile.call(ctx),
    ipAddress,
    platform
  };
  try{
    await service.query(query, 'userCheckMobile');
  } catch(error) {
    ctx.dumpJSON(400, error._message || ErrMsg.def);
    return;
  }
  await next();
};

user.mSignup = async(ctx, next) => {
  const service = ctx.service.user;
  const {ipAddress, platform} = ctx.args;
  let query = getSignupData.apply(ctx);
  const smscodeData = {
    mobile: query.mobile,
    smsCode: query.smscode,
    type: util.smscode['signup'],
    ipAddress,
    platform
  };
  Object.assign(query, {
    sessionId: ctx.sessionId,
    version: '1.0',
    isFromMobile: true,
    sourceValue: ctx.checkBody('inviteCode').value,
    device: '',
    repeatPassword: query.password,
    ipAddress,
    platform,
  });
  try{
    await service.fetch(smscodeData, 'verifycode/check');
  } catch(error) {
    ctx.dumpJSON(400, error._message || ErrMsg.def);
    return;
  }
  try{
    await service.update(query, 'signup');
  } catch(error) {
    ctx.dumpJSON(400, error._message || ErrMsg.def);
    return;
  }
  ctx.dumpJSON();
  await next();
};

user.test = async ctx => {
  // 测试 异步加载数据
  await new Promise(resolve => {
    setTimeout(() => {
      console.log(12345);
      resolve(true);
    }, 2000);
  });
  ctx.dumpJSON({
    dataList: [{ id: 1, name: 1 }, { id: 2, name: 2 }, { id: 3, name: 3 }]
  });
};

user.signupPost = async(ctx, next) => {
  const service = ctx.service;
  let data, checkSmsData;
  const SIGNUP_ACTION = 'signup';
  const ACTIONS = {
    inviteRegister: {
      shouldCheckCaptcha: false,
      shouldCheckInviteCode: false,
      shouldCheckInviteSerial: true,
      shouldReturnHtml: false
    },
    signup: {
      shouldCheckCaptcha: true,
      shouldCheckInviteCode: true,
      shouldCheckInviteSerial: false,
      shouldReturnHtml: true
    },
    carnival: {
      shouldCheckCaptcha: false,
      shouldCheckInviteCode: false,
      shouldCheckInviteSerial: false,
      shouldReturnHtml: false
    }
  };
  data = getSignupData.apply(ctx);
  const { ipAddress, platform, utmSource } = ctx.args;
  checkSmsData = {
    mobile: data.mobile,
    smsCode: data.smscode,
    type: util.smscode[SIGNUP_ACTION],
    ipAddress,
    platform
  };
  _.extend(data, {
    platform,
    sessionId: ctx.sessionId,
    version: '1.0',
    isFromMobile: false,
    ipAddress,
    utmSource,
    repeatPassword: ctx
      .checkBody('password')
      .notEmpty(ErrMsg.emptyPwd)
      .len(8, 20, ErrMsg.lenPwd)
      .match(util.checkPassword, ErrMsg.purePwd)
      .trim().value
  });
  let action = ctx.checkBody('action').value;
  if (!action || !(action in ACTIONS)) {
    action = SIGNUP_ACTION;
  }
  let {
    shouldCheckCaptcha,
    shouldCheckInviteCode,
    shouldCheckInviteSerial,
    shouldReturnHtml
  } = ACTIONS[action];

  data.smsCode = checkSmsData.smsCode;
  if (ctx.errors) {
    ctx.dumpJSON(ErrorStatus.FAIL);
    return;
  }
  if (shouldCheckInviteCode) {
    data.sourceValue = ctx
      .checkBody('inviteCode')
      .notEmpty(ErrMsg.isEmptyInviteCode)
      .trim().value;
  }
  //data.repeatPassword = ctx.checkBody('password').notEmpty(ErrMsg.emptyPwd).len(8, 20, ErrMsg.lenPwd).match(util.checkPassword, ErrMsg.purePwd).trim().value;
  //data.utmSource = ctx.checkBody('utmSource').value;
  if (shouldCheckCaptcha) {
    data.captcha = ctx
      .checkBody('captcha')
      .notEmpty(ErrMsg.emptyCaptcha)
      .trim().value;
  }
  if (shouldCheckInviteSerial) {
    data.inviteSerial = ctx.checkBody('inviteSerial').value;
  }
  try {
    await service.user.fetch(checkSmsData, 'verifycode/check');
  } catch (error) {
    ctx.dumpJSON(error._status, error._message || ErrMsg.def, ctx.getErrors());
    return;
  }
  try {
    await service.user.fetch(data, 'userSignupPost');
    if (!shouldReturnHtml) {
      ctx.dumpJSON();
      return;
    }
  } catch (error) {
    ctx.dumpJSON(error._status, error._message || ErrMsg.def, ctx.getErrors());
    return;
  }
  ctx.dumpJSON();
  await next();
};

user.checkMobile = async ctx => {
  // var _usermobile = getMobile.call(ctx);
  const service = ctx.service;
  const { ipAddress, platform } = ctx.args;
  const query = {
    mobile: getMobile.call(ctx),
    ipAddress,
    platform
  };
  let ret;
  try {
    ret = await service.user.query(query, 'userCheckMobile');
  } catch (error) {
    ctx.body = false;
    return;
  }
  if (!ret || ret.exist != 0) {
    ctx.body = false;
    return;
  }
  ctx.body = true;
};

// user.captcha = async(ctx) => {
//   await ctx.proxy.getCaptcha({
//       ipAddress: ctx.ip,
//       platform: 'MOBILE'
//     })
//     .then(function(value) {
//       if (!value) {
//         return;
//       }
//       var ret = JSON.parse(value);
//       if (ret.status !== 0) {
//         return;
//       }
//       var captcha = _.get(ret, 'data.base64');
//       var word = _.get(ret, 'data.image');
//       ctx.session.captcha = word.toLowerCase();
//       ctx.session.captchacount = 0;
//       ctx.type = 'image/png';
//       ctx.body = new Buffer(captcha, 'base64');
//     });
// };

/**
 * send Verify Code
 */
// user.sendVerifyCode = async(ctx, next) => {
//   const service = ctx.service;
//   const {
//     userId,
//     isLogin,
//     ipAddress,
//     platform
//   } = ctx.args;
//   let errMsg = ErrMsg.sendVerifyCodeError;
//   let action = ctx.checkBody('action').value;
//   let last = _.get(ctx.session, 'lastsms', 0) - 0;
//   const interval = 56 * 1000; // 60sec
//   let usermobile = ctx.checkBody('mobile').value || _.get(ctx.state, 'user.mobile', null);
//   let data, ret;
//   // echo verifyCode error
//   if (ctx.errors) {
//     ctx.dumpJSON(ErrorStatus.FAIL);
//     return;
//   }
//   if (!action || action.length < 3) {
//     ctx.dumpJSON(ErrorStatus.FAIL);
//     return;
//   }
//   // just singup need verifyCode
//   // not singup clean error
//   if (action && action.length && action !== 'signup') {
//     ctx.errors = null;
//   }

//   // check time interval
//   if ((Date.now() - last) < interval) {
//     ctx.dumpJSON(ErrorStatus.FAIL, ErrMsg.quickSmsCode);
//     return;
//   }

//   data = {
//     mobile: isLogin ? usermobile : getMobile.apply(ctx),
//     userId,
//     type: (isLogin && (action === 'paypass' || action === 'check')) ? '' : util.smscode[action],
//     ipAddress,
//     platform
//   };

//   // validate err
//   if (ctx.errors) {
//     ctx.dumpJSON(ErrorStatus.FAIL);
//     return;
//   }

// // //   // log verifyCode

//   // TODO: check mobile not blacklist
//   try{
//     ret = service.user.query(data, 'sendValidateCode');
//   }catch(error){
//     ctx.dumpJSON(ErrorStatus.FAIL, error._message || errMsg);
//     return;
//   }
//   if (!ret) {
//     ctx.dumpJSON(ErrorStatus.FAIL, ErrMsg.def);
//     return;
//   }
//   ctx.dumpJSON();

//   ctx.session.lastsms = Date.now();
//   await next();
// };

// verify captcha
user.verifyCaptcha = async(ctx, next) => {
  const action = ctx.checkBody('action').value || '';
  if (action && action === 'inviteRegister') {
    return await next();
  }
  if (action && action === 'carnival') {
    return await next();
  }
  ctx.session.captchacount = ctx.session.captchacount || 1;
  ctx.session.captchacount++;
  var code = _.get(ctx.session, 'captcha', '100000');
  var captcha = ctx
    .checkBody('captcha')
    .notEmpty(ErrMsg.lenCaptcha)
    .trim()
    .toLowercase().value;

  if (ctx.errors || code !== captcha) {
    ctx.addError('captcha', ErrMsg.isCaptchaCorrect);
    return await next();
  }

  await next();
};

user.ajaxWeixinSign = async ctx => {
  const service = ctx.service;

  const data = {
    url: ctx
      .checkBody('url')
      .trim()
      .notEmpty().value,
    ipAddress: ctx.ip
  };
  let ret;
  if (ctx.errors) {
    ctx.dumpJSON(ErrorStatus.FAIL);
    return;
  }
  try {
    ret = await service.user.fetch(data, 'getWechatSignature');
  } catch (error) {
    ctx.dumpJSON(ErrorStatus.SERVER_FAIL, error);
    return;
  }
  if (!ret) {
    ctx.dumpJSON(ErrorStatus.FAIL);
    return;
  }

  ctx.dumpJSON(ret);
};

user.openAvoidLogin = async() => {
  console.log('开启免登录中间件');
};
user.bankLimit = async ctx => {
  const data = {
    bankCodeList: util.bankCodeList,
    bankTips: util.bankTips
  };
  ctx.dumpJSON(data);
};

module.exports = user;

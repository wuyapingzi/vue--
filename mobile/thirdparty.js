'use strict';

const {
  disabledDisplayInvite,
  moment,
} = require('../lib/util');

const BuyResultModel = require('../model/buyResult');
const UserModel = require('../model/user');

const SUCCESS = 'success';
const ERROR = 'error';
const TIMEOUT = 'timeout';
const ERROR_TYPE_PROCESSING = 'PROCESSING'; //购买结果处理中

// 结果默认超时数据
const TIMEOUT_DATA = {
  title: '处理中',
  content: '请求处理中，请稍后至账户内查看结果'
};

const resultTextConfMap = {
  'escrow': {
    loadingTitle: '开通恒丰银行资金存管',
    loadingText: '开户处理中',
    successTitle: '开户成功',
    successText: '',
    errorTitle: '开户失败',
  },
  'bindcard': {
    loadingTitle: '绑定银行卡',
    loadingText: '绑卡处理中',
    successTitle: '绑卡成功',
    successText: '银行卡绑定成功，现在可以进行充值提现操作',
    errorTitle: '绑卡失败',
  },
  'unbindcard': {
    loadingTitle: '解绑银行卡',
    loadingText: '解绑卡处理中',
    successTitle: '解绑卡成功',
    successText: '',
    errorTitle: '解绑卡失败',
  },
  'withdraw': {
    loadingTitle: '提现',
    loadingText: '提现申请处理中',
    successTitle: '提现申请已受理',
    successText: '',
    errorTitle: '提现申请失败',
  },
  'quickpay': {
    loadingTitle: '充值',
    loadingText: '充值处理中',
    successTitle: '充值成功',
    successText: '',
    errorTitle: '充值失败',
  },
  'passwordedit': {
    loadingTitle: '交易密码',
    loadingText: '设置交易密码处理中',
    successTitle: '设置成功',
    successText: '',
    errorTitle: '设置失败',
  },
  'transfersale': {
    loadingTitle: '债权转让',
    loadingText: '债权转让处理中',
    successTitle: '转让成功',
    successText: '',
    errorTitle: '转让失败',
  },
  'plan': {
    loadingTitle: '计划购买',
    loadingText: '计划购买处理中',
    successTitle: '加入成功',
    successText: '',
    errorTitle: '加入失败',
  },
  'loan': {
    loadingTitle: '散标购买',
    loadingText: '散标购买处理中',
    successTitle: '出借成功',
    successText: '放款前系统将会冻结您的投资资金，放款成功后开始计息',
    errorTitle: '购买失败',
  },
  'transfer': {
    loadingTitle: '债权购买',
    loadingText: '债权购买处理中',
    successTitle: '购买成功',
    successText: '',
    errorTitle: '购买失败',
  },
  'accountactive': {
    loadingTitle: '存管升级',
    loadingText: '存管升级处理中',
    successTitle: '存管升级完成',
    successText: '',
    errorTitle: '存管升级失败',
  },
};

const ERROR_TYPE_MAP = {
  // app 显示处理中页面
  [ERROR_TYPE_PROCESSING]: {
    codes: [-999, 3016],
    title: '处理中',
    content: '结果正在处理，可稍后至账户内查看结果'
  },
  // 其他情况待产品定
};

const resultModelMap = {
  'plan': planBuyResultModel,
  'loan': null,
  'transfer': transferBuyResultModel,
};

class GetResultData {
  constructor({action, resultType = '', data = {}, error}) {
    // 失败时content取后端真实错误message
    if (error && error._message) {
      data.content = error._message;
      data.title = resultTextConfMap[action].errorTitle;
    }
    // 购买时特殊结果处理[processing处理中等]
    if (error && Status(error._status, ERROR_TYPE_MAP)) {
      // data添加错误类型、改写title等字段
      Object.assign(data, Status(error._status, ERROR_TYPE_MAP));
    }
    this.action = action;
    this.result = resultType;
    this.data = data;
  }
}

function isInErrorTypeMap(code, obj) {
  return Object.keys(obj).some(key => {
    return obj[key].codes.includes(code);
  });
}

function getSpecificErrorTypeData(code, obj) {
  const errorTypeKey = Object.keys(obj).find(key => {
    return obj[key].codes.includes(code);
  });
  return {
    title: obj[errorTypeKey].title,
    errorType: errorTypeKey,
    content: obj[errorTypeKey].content
  };
}

function Status(code, errorTypeMap) {
  if (!code) return;

  if (isInErrorTypeMap(code, errorTypeMap)) {
    return getSpecificErrorTypeData(code, errorTypeMap);
  }
}

function planBuyResultModel(model = {}) {
  return model = {
    ...model,
    content: model.lockStart && `预计${moment(model.lockStart).format('MM-DD')}开始计息`,
  };
}

function transferBuyResultModel(model = {}) {
  return model = {
    ...model,
    content: model.nextRepayDate && `下一还款日：${moment(model.nextRepayDate).format('YYYY-MM-DD')}`,
    tips: '公允利息为您垫付的转让人持有天利息，还款人将会在下个还款日予以返回'
  };
}

const thirdparty = async(next) => {
  await next();
};

// 统一处理action
thirdparty.result = async(ctx, next) => {
  const service = ctx.service.thirdparty;
  // 获取懒猫回调参数
  const serviceName = ctx.checkBody('serviceName').value || '';
  const platformNo = ctx.checkBody('platformNo').value || '';
  const responseType = ctx.checkBody('responseType').value || '';
  const keySerial = ctx.checkBody('keySerial').value || '';
  const respData = ctx.checkBody('respData').value || '';
  const sign = ctx.checkBody('sign').value || '';

  // 把懒猫回调url的action、具体的页面title传给页面,
  const action = ctx.checkParams('action').value || '';

  const {
    userId,
    ipAddress,
    platform
  } = ctx.args;

  const query = {
    userId,
    ipAddress,
    platform,
    serviceName,
    platformNo,
    responseType,
    keySerial,
    respData,
    sign
  };

  // 统一处理title，content
  Object.assign(ctx.state, {
    title: resultTextConfMap[action].loadingTitle,
    content: resultTextConfMap[action].loadingText,
  });
  let ret;
  try {
    let value = await service.fetch(query, action);

    // 根据action, 加工不同接口的model
    if (resultModelMap.hasOwnProperty(action)) {
      // 获取用户userId来判断
      let {platformUserNo} = JSON.parse(respData);
      if (!platformUserNo) {
        ({platformUserNo} = value);
      }
      // userId有效性校验成功后、去获取userInfo
      let userInfo = await ctx.cache.user.get_state(platformUserNo);
      // 向userInfo挂载新字段
      userInfo = {
        ...(userInfo && UserModel(userInfo))
      };

      // 销售禁用活动提示处理
      value = BuyResultModel(value, {
        disableActivity: disabledDisplayInvite(userInfo)
      });

      // loan购买不处理
      resultModelMap[action] && (value = resultModelMap[action](value));
    }
    ret = {
      title: resultTextConfMap[action].successTitle,
      content: resultTextConfMap[action].successText,
      ...value,
    };
    console.log('处理懒猫返回的结果====', ret);
    ctx.redirect('http://192.168.1.114:9000/thirdpart/'+action+'/result?ret='+ret);
    Object.assign(ctx.state, {
      resultData: new GetResultData({action, resultType: SUCCESS, data: ret})
    });
  } catch (error) {
    console.log('处理懒猫返回结果出错====', error);
    // 状态码不为0失败的结果
    if (error._status) {
      Object.assign(ctx.state, {
        resultData: new GetResultData({action, resultType: ERROR, error})
      });
      return await next();
    }
    // 超时的处理及接口失败都展示超时
    ret = TIMEOUT_DATA;
    Object.assign(ctx.state, {
      resultData: new GetResultData({action, resultType: TIMEOUT, data: ret})
    });
  }
  await next();
};

module.exports = thirdparty;
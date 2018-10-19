'use strict';

/**
 * plan
 */
const request = require('../lib/request.js');
const { config } = require('../lib/util.js');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

const HTTP_POST = 'POST';

module.exports = {
  fetch(values, action = 'def') {
    let map = {
      // 懒猫回调H5获取结果
      'escrow': '/redirect/personalRegisterExpand',
      'bindcard': '/redirect/personalBindBankcard ',
      'unbindcard': '/redirect/unBindcard',
      'withdraw': '/paycenter/withDrawSynCallBack',
      'quickpay': '/escrow/recharge/synchronizeQuickConfirm',
      'transfersale': '/loantransfer/loanTransferCallBack',
      'plan': '/financeplan/rechageOrCheckRegisterfinanceplan',
      'loan': '/lend/loanLenderCallBack',
      'transfer': '/loantransfer/userPreTransactionCallBack',
      'passwordedit': '/redirect/resetPassword',
      'accountactive': 'redirect/activeUser',
      'def': '',
    };
    let url = action && map[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(url, {
      method: HTTP_POST,
      form: values,
      baseUrl: API_BASE
    });
  },
};
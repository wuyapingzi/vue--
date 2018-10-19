const moment = require('moment')
const reMobileRepeat = /^(\d{3})(.*)(\d{4})$/
const reBankCardReplace = /^(.{4})(.*)(.{4})$/
const reRealnameReplace = /^(.*)(.{1})$/
const reIdentityReplace = /^(.{3})(.*)(.{3})$/
const reUserNameReplace = /^(.{3})(.*)(.{4})$/
const reMoneyReplace = /^\d+\.?\d*$/
const defaultBankList = {
  '5006': {
    'name': '招商银行',
    'single': '20万',
    'day': '20万'
  },
  '5004': {
    'name': '民生银行',
    'single': '50万',
    'day': '500万'
  },
  '5005': {
    'name': '广发银行',
    'single': '50万',
    'day': '无限额'
  },
  '0150': {
    'name': '农业银行',
    'single': '10万',
    'day': '20万'
  },
  '0201': {
    'name': '交通银行',
    'single': '10万',
    'day': '10万'
  },
  '5012': {
    'name': '北京银行',
    'single': '5万',
    'day': '10万'
  },
  '0210': {
    'name': '中国银行',
    'single': '5万',
    'day': '20万'
  },
  '5000': {
    'name': '邮储银行',
    'single': '5万',
    'day': '10万'
  },
  '5003': {
    'name': '华夏银行',
    'single': '5万',
    'day': '10万'
  },
  '0160': {
    'name': '工商银行',
    'single': '5万',
    'day': '5万'
  },
  '5007': {
    'name': '兴业银行',
    'single': '5万',
    'day': '5万'
  },
  '5008': {
    'name': '浦发银行',
    'single': '5万',
    'day': '5万'
  },
  '5002': {
    'name': '光大银行',
    'single': '5万',
    'day': '5万'
  },
  '5009': {
    'name': '平安银行',
    'single': '5万',
    'day': '5万'
  },
  '0220': {
    'name': '建设银行',
    'single': '2万',
    'day': '2万'
  }
}
let bankList = {}
let bankCode = []

const defaultBankCodeList = [
  '5006',
  '5004',
  '5005',
  '0150',
  '0201',
  '5012',
  '0210',
  '5000',
  '5003',
  '0160',
  '5007',
  '5008',
  '5002',
  '5009',
  '0220',
  '5001',
  '0170',
  '5011',
  '5013',
  '1114',
  '0250',
  '5186'
]
var parseBankList = function(value) {
  bankCode.splice(0)
  bankList = value.reduce(function(bankItem, currentValue) {
    if (currentValue.quotaStatus != '0') {
      bankItem[currentValue.bankCode] = {
        name: currentValue.bankName,
        single: currentValue.perSumQuota,
        day: currentValue.perDayQuota,
        quotaStatus: currentValue.quotaStatus
      }
    }
    return bankItem
  }, {})
  bankCode = value.reduce(function(accumulator, currentValue) {
    accumulator.push(currentValue.bankCode)
    return accumulator
  }, [])
}

export function bankCodeList() {
  get: () => {
    if (bankCode.length) {
      return bankCode
    }
    return defaultBankCodeList
  }
  set: value => {
    if (value) {
      parseBankList(value)
    }
  }
}

export function bankTips() {
  if (Object.keys(bankList).length) {
    return bankList
  }
  return defaultBankList
}

export function bankName(code) {
  if (!code) {
    return
  }
  return defaultBankList[code].name || ''
}

export function safeBank(val) {
  if (!val || val.length < 8) {
    return '****'
  }
  return val.replace(reBankCardReplace, '$1 **** **** $3')
}
// 截取银行尾号
export function bankTailNum(val) {
  if (!val || val.length < 8) {
    return '****'
  }
  return val.substr(val.length - 4)
}


export function safeMobile(val) {
  if (!val || val.length < 7) {
    return '*******'
  }
  return val.replace(reMobileReplace, '$1****$3')
}

// safe realname
export function safeRealname(val) {
  if (!val) {
    return '**'
  }
  return val.replace(reRealnameReplace, '*$2')
}


/**
 * safe username
 */
export function safeUserName(val) {
  if (!val || val.length < 8) {
    return '****'
  }
  const value = val.toLowerCase()
  return value.replace(reUserNameReplace, '$1***$3')
}

export function limitShow(obj = {}, isLimitTip) {
  if (obj.quotaStatus == '2') {
    return '银行系统维护中'
  } else {
    const limitSingleTips = obj.single ? '单笔限额' + obj.single : ''
    const limitDayTips = obj.day ? '单日限额' + obj.day : ''
    const limitTipWord = !limitSingleTips && !limitDayTips ? '' : '限额：'
    return isLimitTip ?
      limitTipWord + limitSingleTips + limitDayTips :
      limitSingleTips + '、' + limitDayTips
  }
}

// safe IDcard
export function safeIdentity(val) {
  if (!val || val.length < 18) {
    return '****'
  }
  return val.replace(reIdentityReplace, '$1** **** **** *$3')
}

export function parseMobile(val) {
  if (!val) {
    return null
  }
  return val.replace(reMobileRepeat, '$1 **** $3')
}

export function formatdate(format, date) {
  format = format || 'YYYY-MM-DD'
  var time = date || new Date()
  return moment(time).format(format)
}

// 计划状态
export function parsePlanStatus(status = '') {
  let ret = {}
  const PLAN_STATUS = {
    '0': {'code': 'BOOKFAR', 'name': '等待预售开始超过30分'},
    '1': {'code': 'BOOKNEAR', 'name': '等待预售开始小于30分钟'},
    '2': {'code': 'BOOK', 'name': '预定'},
    '3': {'code': 'BOOKFULL', 'name': '预定满额'},
    '4': {'code': 'WAIT_OPEN', 'name': '等待开放购买大于30分钟'},
    '5': {'code': 'WAIT_RESERVE', 'name': '等待开放购买小于30分钟'},
    '6': {'code': 'OPENING', 'name': '开放加入'},
    '7': {'code': 'OPEN_FULL', 'name': '加入满额'},
    '8': {'code': 'PERIOD_LOCKING', 'name': '收益中'},
    '9': {'code': 'PERIOD_OPEN', 'name': '开放期'},
    '10': {'code': 'PERIOD_CLOSED', 'name': '已退出'},
    '11': {'code': 'PERIOD_EXITING', 'name': '退出中'}
  }
  if (!(status in PLAN_STATUS)) return

  for (const item in PLAN_STATUS) {
    ret[PLAN_STATUS[item].code] = item == status ? true : false
  }
  return ret
}

export function desensitizaMoney(money = 0, isDesensitiza = false) {
  // const money = this.accountInfo.userAssets.yesterdayInterest.toFixed(2)
  if (isDesensitiza) {
    return money.replace(reMoneyReplace, '****')
  } else {
    return money
  }
}

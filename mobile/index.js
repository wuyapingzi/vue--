'use strict';

const send = require('koa-send');

const mobile = config => {
  return async(ctx, next) => {
    await next();
    if (404 !== ctx.status) {
      return;
    }
    await send(ctx, 'index.html', {
      root: config.static
    });
  };
};

mobile.home = require('./home');
mobile.about = require('./about');
mobile.riskvail = require('./riskvail');
mobile.account = require('./account');
mobile.user = require('./user');
mobile.landing = require('./landing');
mobile.plan = require('./plan');
mobile.thirdparty = require('./thirdparty');

module.exports = mobile;

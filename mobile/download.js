'use strict';

const { formatURL } = require('../lib/util');

const download = async(ctx, next) => {
  await next();
};

download.getServerDomain = async(ctx, next) => {
  ctx.state.webDomain = formatURL('/');
  await next();
};
module.exports = download;
'use strict';

/**
 * splash model
 */
const { formatURL } = require('../lib/util');

function spalsh(model = {}) {
  // absolute image url
  if (model.image) {
    model.image = formatURL(model.image);
  }
  return model;
}

spalsh.availableSplash = sholdCheckDisabled => {
  return function(ele) {
    // 被禁用
    if (!!sholdCheckDisabled && !!ele.disabled) {
      return;
    }
    const now = Date.now();
    const start = ele.start - 0 || 0;
    const end = ele.end - 0 || 0;
    // 在有效期
    if (start < now && (!end || now < end)) {
      return true;
    }
  };
};

// exports splash
module.exports = spalsh;

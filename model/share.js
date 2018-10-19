'use strict';

/**
 * share model
 */
const { formatURL } = require('../lib/util');

function share(model = {}) {
  // absolute image url
  if (model.image) {
    model.image = formatURL(model.image);
  }
  return model;
}

// exports splash
module.exports = share;

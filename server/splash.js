'use strict';

/**
 * splash
 */
const {
  parseUserAgent,
  versionCompare
} = require('../lib/util');
const SplashModel = require('../model/splash');

const DEVICE_ANDROID = 'android';
const DEVICE_IOS = 'ios';
const DEVICE_IPHONE_X = 'iphoneX';

const splash = async(ctx) => {
  const cache = ctx.cache.splash;

  const {
    userAgent
  } = ctx.args;

  const {
    isIPhoneX,
    isAndroid,
    isIOS,
    version,
  } = parseUserAgent(userAgent);
  const platform = isAndroid ? 'android' : 'ios';

  let url;
  let outOfBounds;
  let action = DEVICE_IOS;

  if (isIPhoneX) {
    action = DEVICE_IPHONE_X;
  } else if (isAndroid) {
    action = DEVICE_ANDROID;
  } else if (isIOS) {
    action = DEVICE_IOS;
  }

  try {
    let lastest = await ctx.cache.home.get_app_lastest_version(platform);
    let lastestVersion = lastest && lastest.version;
    if (version && lastestVersion) {
      outOfBounds = versionCompare(version, lastestVersion) > 0;
    }
    let list = await cache.query(action);
    let item = list.find(SplashModel.availableSplash(outOfBounds));
    if (item) {
      url = SplashModel(item).image;
    }
  } catch (error) {
    // do nothing
  }
  //let id = ~~(Math.random() * 10);
  //url = `https://picsum.photos/720/1280/?image=${id}`;
  ctx.dumpJSON({
    url: url || '',
  });
};

module.exports = splash;
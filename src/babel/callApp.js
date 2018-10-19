'user strict';

var callApp = {
  jumpToApp: function() {
    var bridge = app.util.webviewBridge;
    $('.J_jump-to-app').on('click', function() {
      var _path = $(this).data('path');
      var _productId = $(this).data('productid') || '';
      bridge.callHandler('startPage', {
        path: _path,
        productId: _productId
      });
    });
  },
  init: function() {
    var me = this;
    me.jumpToApp();
  }
};

exports = module.exports = callApp;
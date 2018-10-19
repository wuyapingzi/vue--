import webviewBridge from './bridge';

export default {
  openAppPage(params) {
    webviewBridge.callHandler('startPage', params);
  },
  share(params) {
    webviewBridge.callHandler('share', params);
  },
  showMessage(params) {
    webviewBridge.callHandler('showMessage', params);
  },
};
import * as util from './util';
import heartBeat from './heartBeat';
import Riskvail from './riskvail';
import CallApp from './callApp';
import Download  from './download';
import Questions from './questions';
import LandingAbout from './landing.about';
import LandingInvite from './landing.invite';
import landingOrdinary from './landing.ordinary';
import landingMiyaSignup from './landing.miya.signup';
import registerJdCard from './landing.register.jdcard';
import appInvite from './invite';
import interactive from './interactiveBridge';
import judgeInstallApp from './judgeInstallApp';
import landingCarnival from './landing.carnival';
import aboutPlatform from './about.platform';
import aboutCompany from './about.company';
import popModal from './modal';
import scrollPosition from './about.scroll.position';
import miyaActive from './landing.miya';
require('../js/customValidate');

let app = {
  CSRFProtection(xhr){
    let token = $('meta[name="csrf-token"]').attr('content');
    if (token) {
      xhr.setRequestHeader('X-CSRF-Token', token);
    }
  },
  refreshCSRFTokens(){
    let csrfToken = $('meta[name=csrf-token]').attr('content');
    let csrfParam = $('meta[name=csrf-param]').attr('content');
    $('form input[name="' + csrfParam + '"]').val(csrfToken);
  },
  attachCSRF(){
    $.ajaxPrefilter((options, originalOptions, xhr) => {
      if (!options.crossDomain) {
        app.CSRFProtection(xhr);
      }
    });
    app.refreshCSRFTokens();
  },
  util: util.default,
  heartBeat,
  init(){
    app.attachCSRF();
    app.heartBeat();
  },
  riskvail: Riskvail,
  callApp: CallApp,
  download: Download,
  questions: Questions,
  landingAbout: LandingAbout,
  landingInvite: LandingInvite,
  landingOrdinary,
  landingMiyaSignup,
  appInvite: appInvite,
  interactive,
  landingCarnival: landingCarnival,
  judgeInstallApp,
  aboutPlatform,
  aboutCompany,
  popModal,
  registerJdCard,
  scrollPosition,
  miyaActive
};

if (!window['app']) {
  window['app'] = app;
  app.init();
}

$(function() {
  FastClick.attach(document.body);
});

export default app;

var wxjs = {
  init: false,
  run: function (fn) {
    if (!wxjs.init) {
      if(!wxjs.jsApiList) {
        wxjs.jsApiList = [];
      }
      if(wxjs.hideMenu && wxjs.jsApiList.indexOf('hideOptionMenu')==-1) {
        wxjs.jsApiList.push('hideOptionMenu');
      }
      $.get('<%=ConfigureUtils.getSite(ConfigureManager.getWxConfigure())%>/wxjs/getJsapiSignature.json', {
            wxid: '${wxid}',
            authUrl: window.location.href.split('#')[0]
          },
          function (result) {
            var config = {
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: result.data.appid, // 必填，公众号的唯一标识
              timestamp: result.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: result.data.noncestr, // 必填，生成签名的随机串
              signature: result.data.signature,// 必填，签名，见附录1
              jsApiList: wxjs.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            };
            wx.config(config);

            wx.ready(function () {
              if (wxjs.hideMenu) {
                wx.hideOptionMenu();
              }
              if (!("undefined" == typeof wxjsAfterReload)) {
                wxjsAfterReload();
              }
              wxjs.init = true;
              fn && fn();
            });

            wx.error(function (res) {
              alert('微信JSAPI初始化失败!出错原因:' + res.errMsg);
            });
          },
          'jsonp');
    } else {
      fn && fn();
    }
  }
}

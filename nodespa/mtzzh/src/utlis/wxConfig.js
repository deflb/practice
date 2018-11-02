import wx from 'weixin-js-sdk';
import { request } from '../request';
import api from '../request/api';

const _request_info = ({ reslove, reject, url, jsApiList }) => {
    request({ url: api.getWxConfig, data: { url } }).then(data => {
        const { appId, timestamp, nonceStr, signature } = data;
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature,// 必填，签名
            jsApiList, // 必填，需要使用的JS接口列表 所有JS接口列表见(微信开发文档js-sdk调用)附录2
        });
        wx.ready(function () {
            wx.checkJsApi({
                jsApiList, // 需要检测的JS接口列表,
                success: function (res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    reslove(res)
                }
            });
        });
        wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
            // 对于SPA可以在这里更新签名
            _request_info({ reslove, reject, url, jsApiList })
        });
    }).catch(err => {
        reject(err)
    })
}

const wx_config = ({ jsApiList = [] } = {}) => new Promise((reslove, reject) => {
    const { href } = window.location,
        url = href.replace(/#.*/, '');
    console.log(url);
    _request_info({ reslove, reject, url, jsApiList })
})

export {
    wx_config,
    wx,
}
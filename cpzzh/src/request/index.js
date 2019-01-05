import axios from 'axios';
import jsencrypt from 'jsencrypt';
import { encode } from 'querystring';
import { address, crmFileAddress } from './baseURL';
import api from './api';
import { setCookie, delCookie } from '../utlis';
import { globalLoadingToggle } from '../store/action';
import { Toast } from 'antd-mobile';

let Authorization = '', dispatch = function () { };
const timeout = 15000;
const X_Requested_Key = '2,';

// 基础
const request = ({ method = 'post', url, data = {}, config = {} }) => { // config 里的字段为 axios 可配置字段
    return axios({
        method,
        url,
        data,
        timeout,
        baseURL: address,
        ...config,
        headers: {
            'Authorization': Authorization,
            X_Requested_Key
        }
    })
}
axios.interceptors.request.use(function (config) {
    dispatch(globalLoadingToggle(true));
    return config;
}, function (error) {
    return Promise.reject(error);
})
axios.interceptors.response.use(function (response) {
    const { msgcode, data } = response.data;
    dispatch(globalLoadingToggle(false));
    if (msgcode === 0)
        return data;
    // 其他状态 提示 错误信息
    Toast.fail(data, 1);
    return Promise.reject({ msgcode, data });
}, function (error) {
    dispatch(globalLoadingToggle(false));
    let msg = new RegExp('timeout').test(error) ? '请求超时' : '网络错误';
    Toast.fail(msg, 1);
    return Promise.reject(error);
})

// form 格式 (x-www-form-urlencoded)
const request_form = axios.create({
    timeout,
    baseURL: address,
    transformRequest: [function (data) {
        return encode(data)
    }]
})
request_form.interceptors.request.use(function (config) {
    dispatch(globalLoadingToggle(true));
    return config;
}, function (error) {
    return Promise.reject(error);
})
request_form.interceptors.response.use(function (response) {
    const { msgcode, data } = response.data;
    dispatch(globalLoadingToggle(false));
    if (msgcode === 0)
        return data;
    // 其他状态 提示 错误信息
    Toast.fail(data, 1);
    return Promise.reject({ msgcode, data });
}, function (error) {
    dispatch(globalLoadingToggle(false));
    let msg = new RegExp('timeout').test(error) ? '请求超时' : '网络错误';
    Toast.fail(msg, 1);
    return Promise.reject(error);
})

// crm3.0文件上传接口
const crm3_upload = axios.create({
    timeout,
    baseURL: crmFileAddress
})
crm3_upload.interceptors.request.use(function (config) {
    dispatch(globalLoadingToggle(true));
    return config;
}, function (error) {
    return Promise.reject(error);
})
crm3_upload.interceptors.response.use(function (response) {
    const { error, message, filepath, title } = response.data;
    dispatch(globalLoadingToggle(false));
    if (error === 0)
        return { url: filepath, fileName: title };
    // 其他状态 提示 错误信息
    Toast.fail(message, 1);
    return Promise.reject({ error, message });
}, function (error) {
    dispatch(globalLoadingToggle(false));
    let msg = new RegExp('timeout').test(error) ? '请求超时' : '网络错误';
    Toast.fail(msg, 1);
    return Promise.reject(error);
})

const _getPublicKey = (merchantCode, userName) => request_form.post(api.getPublicKey, { merchantCode, userName }).then(res => res).catch(err => null),
    _encodePassword = ({ publicKey, password }) => {
        const crypt = new jsencrypt.JSEncrypt({ default_key_size: 1024 });
        crypt.setPrivateKey(publicKey);
        return crypt.encrypt(password);
    }

request.login = async ({ captcha = '', merchantCode, userName, password }) => {
    const publicKey = await _getPublicKey(merchantCode, userName);
    if (publicKey) {
        const param = {
            captcha,
            // clientType: 2, // 1:WEB端 2:客户端
            loginType: 1, // 0单用户模式 1普通模式(多端同时在线)
            merchantCode,
            userName,
        };
        param.password = _encodePassword({ publicKey, password });
        return request_form.post(api.login, param).then(uuid => {
            setCookie('uuid', uuid);
            Authorization = 'Bearer ' + uuid;
            return uuid;
        })
    }
    return Promise.reject('error')
}

request.logout = () => {
    return request({ method: 'get', url: api.logout }).then(res => {
        delCookie('uuid')
        Authorization = '';
        return res;
    })
}

request.setAuthorization = uuid => {
    setCookie('uuid', uuid);
    Authorization = 'Bearer ' + uuid;
}

request.setDispatch = fn => { dispatch = fn }

request.getAuthUrl = async () => {
    if (process.env.NODE_ENV === "production") { // 上线
        window.location.href = address + api.getAuthUrl + `?redirectUrl=${encodeURIComponent(window.location.href)}`;
    } else { // 内网(模拟外网环境)测试配置(发起授权 获取uuid)
        const uuid = await request.login({ merchantCode: 'mt', userName: 'leibo_wxtest', password: '123456' }),
            { href, search } = window.location;
        window.location.href = search ? href + '&uuid=' + uuid : href + '?uuid=' + uuid;
    }
}

export {
    request,
    request_form,
    crm3_upload
}
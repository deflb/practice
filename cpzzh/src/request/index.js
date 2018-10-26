import axios from 'axios';
import jsencrypt from 'jsencrypt';
import { encode } from 'querystring';
import { address } from './baseURL';
import api from './api';
import { setCookie, delCookie } from '../utlis';
import { Toast } from 'antd-mobile';

const timeout = 5000;
// 基础
const request = ({ method = 'post', url, data = {}, config = {} }) => { // config 里的字段为 axios 可配置字段
    return axios({
        method,
        url,
        data,
        timeout,
        baseURL: address,
        ...config
    })
}
// form 格式 (x-www-form-urlencoded)
const request_form = ({ method, url, data }) => request({
    method,
    url,
    data,
    config: {
        transformRequest: [function (data) {
            return encode(data)
        }]
    }
})

axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
})
axios.interceptors.response.use(function (response) {
    const { msgcode, data } = response.data;
    if (msgcode === 0)
        return data;
    // 其他状态 提示 错误信息
    Toast.fail(data, 1);
    return Promise.reject({ msgcode, data });
}, function (error) {
    return Promise.reject(error);
})

const _getPublicKey = (merchantCode, userName) => request_form({ url: api.getPublicKey, data: { merchantCode, userName } }).then(res => res).catch(err => null),
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
        return request_form({ url: api.login, data: param }).then(res => {
            setCookie('merchantCode', merchantCode);
            setCookie('userName', userName);
            setCookie('uuid', res);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + res;
            return res;
        })
    }
    return Promise.reject('error')
}

request.logout = () => {
    return request({ method: 'get', url: api.logout }).then(res => {
        delCookie('merchantCode')
        delCookie('userName')
        delCookie('uuid')
        delete axios.defaults.headers.common['Authorization'];
        return res;
    })
}

request.setAuthorization = uuid => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + uuid;
}

export {
    request,
    request_form
}
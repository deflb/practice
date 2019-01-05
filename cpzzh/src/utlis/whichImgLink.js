import api from '../request/api';
import { imgAddress, crmFileAddress } from '../request/baseURL';

export default (url) => {
    if (/^[A-Z]{1}:/.test(url)) // 盘符开头 -- 来源C#
        return crmFileAddress + api.crmFileUrl(url)
    if (/^http/.test(url)) // http|https开头 -- 外链
        return url
    if(/^\/static/.test(url)) // 本地图片资源
        return url;
    return imgAddress + url // 其他 来源JAVA
}
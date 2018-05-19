(function () {
    function fullScreen(ele = document.documentElement) { // 全屏
        if (ele.requestFullscreen)
            ele.requestFullscreen();
        else if (ele.mozRequestFullScreen)
            ele.mozRequestFullScreen();
        else if (ele.webkitRequestFullscreen)
            ele.webkitRequestFullscreen();
        else if (ele.msRequestFullscreen)
            ele.msRequestFullscreen();
    }

    function exitScreen(ele = document) { // 取消全屏
        if (ele.exitFullscreen)
            ele.exitFullscreen()
        else if (ele.mozCancelFullScreen)
            ele.mozCancelFullScreen()
        else if (ele.webkitExitFullscreen)
            ele.webkitExitFullscreen()
        else if (ele.msExitFullscreen)
            ele.msExitFullscreen()
    }

    function formatDateTime(date, onlyDate = false, onlyTime = false) { // 日期时间 格式化
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        const formatNumber = n => {
            n = n.toString()
            return n[1] ? n : '0' + n
        }

        if (onlyDate)
            return [year, month, day].map(formatNumber).join('/')
        else if (onlyTime)
            return [hour, minute, second].map(formatNumber).join(':')
        else
            return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }

    function getusermediainfo() { // 获取设备显卡信息
        try {
            let cav = document.createElement('canvas')
            if (cav.getContext) {
                let draw = cav.getContext('experimental-webgl'),
                    debuginfo = draw.getExtension('WEBGL_debug_renderer_info')
                return draw.getParameter(debuginfo.UNMASKED_RENDERER_WEBGL)
            }
        } catch (error) {
            console.warn('浏览器不支持!')
        }
    }

    function serialize(formEle) { // 表单序列化
        try {
            formEle = formEle.nodeType === 1 ? formEle : document.querySelector(formEle);
            let serialize = '';
            if ('FormData' in window) {
                let _fmd = new FormData(formEle);
                _fmd.forEach((val, name) => {
                    serialize += name + '=' + val + '&'
                })
            } else {
                let cEle = formEle.children, len = cEle.length;
                for (var v of cEle) {
                    if(v.tagName === 'BUTTON' || v.type === 'submit' || v.type === 'reset')
                        return serialize.replace(/\&$/, '')
                    switch (v.type) {
                        case 'checkbox':
                        case 'radio':
                            var _val = v.checked ? 'on' : 'off'
                            serialize += v.name + '=' + _val + '&'
                            break;
                        case 'file':
                            serialize += v.name + '=' + v.files[0] + '&'
                            break;
                        default:
                            serialize += v.name + '=' + v.value + '&'
                    }
                }
            }
            return serialize.replace(/\&$/, '')
        } catch (error) {
            console.warn(error)
        }
    }



    window.weapon = {
        fullScreen,
        exitScreen,
        formatDateTime,
        getusermediainfo,
        serialize
    }

})()
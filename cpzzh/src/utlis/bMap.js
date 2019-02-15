import BMap from 'BMap';
import { Toast } from 'antd-mobile';

function coordConvertor(pointArr = [], from = 1, to = 5) { // pointArr [{longitude,latitude}]  from 1-8 to 3-6 数值具体含义查看百度坐标转换服务文档
    return new Promise((resolve, reject) => {
        const convertor = new BMap.Convertor();
        convertor.translate(pointArr.map(item => new BMap.Point(item.longitude, item.latitude)), from, to, (data) => {
            if (data.status === 0) {
                resolve(data.points)
            } else
                reject(data)
        })
    })
}

function geocoder(lngAndLat = {}, callBack = function () { }) { // 逆地址解析(根据坐标得到地址描述：百度坐标)
    let geo = new BMap.Geocoder();
    geo.getLocation(new BMap.Point(lngAndLat.longitude, lngAndLat.latitude), (result) => { // 请求回调 异步
        if (result) {
            callBack(result.addressComponents, result.address) // 地址描述对象 详细地址字符串
        }
    });
}

function mapInstanceSimple(lngAndLat = {}, eleSelector = '') { // lngAndLat：百度坐标 eleSelector: DOM元素选择器
    const bm = new BMap.Map(eleSelector),
        lng = lngAndLat.longitude,
        lat = lngAndLat.latitude,
        _bm_userPos = sessionStorage.getItem('bm_userPos');
    if (_bm_userPos) {
        const { longitude, latitude } = JSON.parse(_bm_userPos),
            distanceY = longitude - lng,
            distanceX = latitude - lat,
            cnterLng = distanceY >= 0 ? lng + distanceY / 2 : longitude + distanceY / 2,
            cnterLat = distanceX >= 0 ? lat + distanceX / 2 : latitude + distanceX / 2;
        bm.centerAndZoom(new BMap.Point(cnterLng, cnterLat), 12);
        // DrivingRoute TransitRoute WalkingRoute
        const Route = new BMap.DrivingRoute(bm, {
            renderOptions: {
                map: bm,
                autoViewport: true
            }
        })
        Route.search(new BMap.Point(longitude, latitude), new BMap.Point(lng, lat))
    } else {
        bm.centerAndZoom(new BMap.Point(lng, lat), 16);
        bm.enableScrollWheelZoom(true);
        bm.addControl(new BMap.NavigationControl());
        bm.addOverlay(new BMap.Marker({ lng, lat }));
    }
}

function mapInstance(lngAndLat = {}, eleSelector = '', callBack = function () { }, triggleWxPosition = function () { }) { // 实例化地图(地图展示) lngAndLat：百度坐标  eleSelector: DOM元素选择器
    let marker = null,
        currentAddress = '',
        bm = new BMap.Map(eleSelector);
    // 允许鼠标滚轮缩放
    bm.enableScrollWheelZoom(true);
    function updateMyAddress(text) { // 更新自定义控件 MyAddress
        let MyAddress = bm.getContainer().querySelector('#MyAddress');
        MyAddress.innerText = text
    }
    function updateMakerAndMap(pos) { // 更新marker 并更新地图中心点及级别
        let { lng, lat } = pos;
        bm.removeOverlay(marker);
        bm.centerAndZoom(new BMap.Point(lng, lat), 16);
        bm.setCenter({ lng, lat });
        marker = new BMap.Marker(pos);
        marker.enableDragging();
        marker.addEventListener('click', (e) => {
            Toast.info(currentAddress, 0.7);
        })
        marker.addEventListener('dragend', (e) => {
            let { point } = e,
                { lng, lat } = point;
            updateMyAddress('定位中');
            geocoder({ longitude: lng, latitude: lat }, (addressComponents, address) => {
                currentAddress = address;
                Toast.info(address, 1);
                updateMyAddress(addressComponents.city);
                bm.centerAndZoom(new BMap.Point(lng, lat), 16);
                bm.setCenter({ lng, lat });
                callBack({ longitude: lng, latitude: lat });
            })
        })
        bm.addOverlay(marker);
    }
    // 内置控件
    bm.addControl(new BMap.NavigationControl());
    bm.addControl(new BMap.MapTypeControl());

    // 左上角自定义控件(展示定位城市)
    function MyAddress(param = {}) {
        this.defaultAnchor = param.anchor ? param.anchor : window.BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = param.offset ? param.offset : new BMap.Size(10, 10);
    }
    MyAddress.prototype = new BMap.Control();
    MyAddress.prototype.initialize = (map) => {
        let div = document.createElement('div');
        div.id = 'MyAddress';
        div.appendChild(document.createTextNode('定位中'))
        div.style.backgroundColor = 'rgba(0,0,0,0.5)';
        div.style.color = '#fff';
        div.style.fontSize = '14px';
        div.style.padding = '2px 6px';
        div.style.borderRadius = '4px';
        map.getContainer().appendChild(div);
        return div;
    }
    bm.addControl(new MyAddress());

    // 右下角自定义控件(触发点位)
    function CustomPosition(param = {}) {
        this.defaultAnchor = param.anchor ? param.anchor : window.BMAP_ANCHOR_BOTTOM_LEFT;
        this.defaultOffset = param.offset ? param.offset : new BMap.Size(10, 30);
    }
    CustomPosition.prototype = new BMap.Control();
    CustomPosition.prototype.initialize = (map) => {
        let div = document.createElement('div'),
            icon = document.createElement('i');
        icon.className = 'iconfont icon-position';
        div.appendChild(icon);
        div.style.lineHeight = 1;
        div.style.padding = '7px';
        div.style.backgroundColor = 'rgba(0,0,0,0.3)';
        div.style.color = '#fff';
        div.style.borderRadius = '4px';
        div.onclick = () => {
            updateMyAddress('定位中');
            triggleWxPosition((location) => {
                geocoder(location, (addressComponents, address) => {
                    let lng = location.longitude,
                        lat = location.latitude;
                    Toast.info(address, 1);
                    currentAddress = address;
                    updateMakerAndMap({ lng, lat });
                    updateMyAddress(addressComponents.city);
                    callBack({ longitude: lng, latitude: lat });
                })
            })
        }
        map.getContainer().appendChild(div);
        return div;
    }
    bm.addControl(new CustomPosition());

    geocoder(lngAndLat, (addressComponents, address) => {
        currentAddress = address;
        Toast.info(address, 1);
        updateMyAddress(addressComponents.city);
        updateMakerAndMap({ lng: lngAndLat.longitude, lat: lngAndLat.latitude });
        callBack(lngAndLat);
    });
    // label
    // marker.setLabel(new BMap.Label("当前位置", { offset: new BMap.Size(20, -10) }));
}

export {
    geocoder,
    mapInstanceSimple,
    mapInstance,
    coordConvertor
}
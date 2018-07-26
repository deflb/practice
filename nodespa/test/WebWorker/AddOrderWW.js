// import { address, axiospost, getAxios } from "../../http/http" 
//importScripts("../..http.js")

onmessage = function (e) {
    if (typeof (fetch) === "undefined") {
        postMessage("nofetch")
    }
    else {
        let data = e.data
        type = data.type;//获取类型
        let header = data.header
        let address = header.address
        if (type === "addorder_calPropBefore") {//新增订单，拆解前
            let fgoodsidList = data.fgoodsidList;
            let goodscodeList = data.goodscodeList;

            let goodAttrUrl = "/order/door/getItemGoodsAttr";
            let funArr = []
            for (let idItem of fgoodsidList) {
                let option = getInitOption(header, "POST", {
                    goodsId: idItem
                })
                let p = new Promise((resolve, reject) => {
                    resolve(
                        fetch(address + goodAttrUrl, option).then((res) => {
                            return res.json()
                        }).then((res) => {
                            if (res.data && res.data.msgcode === 0) {
                                //  resolve(res)
                                return res
                            }
                            else {
                                // reject(res)
                                return res
                            }
                        })
                    )
                })
                funArr.push(p);
            }
            Promise.all(funArr).then(res => {
                let ItemGoodsAttr = [];//拆解1
                let ItemCheckAttr = [];//拆解3
                let result = true
                //   let inDoorItem = parList.doorItem //放在state的doorItem
                for (let i = 0; i < res.length; i++) {
                    let item = res[i];
                    if (item === undefined) {
                        postMessage({ "msg": "获取项次商品属性出错", "msgcode": -1, "data": "" })
                        result = false
                        break
                    }

                    let arr = [];
                    let checkarr = [];
                    let itemdata = item.data;
                    for (let k = 0; k < itemdata.length; k++) {
                        let obj = {}
                        let check = {}
                        obj.fdcshowseqno = itemdata[k].fdcshowseqno
                        obj.fdesc = itemdata[k].fdesc
                        obj.fcode = itemdata[k].fcode
                        obj.fpropertycode = itemdata[k].fpropertycode
                        obj.fstcpropcode = goodscodeList[i];
                        obj.fgoodsid = fgoodsidList[i]
                        arr.push(obj)
                        check.fpropertynname = itemdata[k].fpropertynname
                        check.fprotype = itemdata[k].fprotype
                        check.fpropsno = itemdata[k].fpropsno
                        checkarr.push(check)
                    }
                    Array.prototype.push.apply(ItemGoodsAttr, arr)
                    Array.prototype.push.apply(ItemCheckAttr, checkarr)
                }
                postMessage({
                    "msg": "成功", "msgcode": 0, "data": {
                        ItemGoodsAttr: ItemGoodsAttr,
                        ItemCheckAttr: ItemCheckAttr
                    }
                })
            })
        }
        //    case "addorder_calProp":
        else if (type === "addorder_calProp") {//web worker新增订单 拆解1
            let values = data.values;
            let ItemGoodsAttr = data.ItemGoodsAttr;
            let ItemCheckAttr = data.ItemCheckAttr;
            let groupNo = data.groupNo;
            let parList = data.parList;

            let ItemGoodsAttrCopy = ItemGoodsAttr
            let fsalebindid = values.fsalebindid;

            let fsalebindcode = parList.fsalebindcode
            //获取洞口名称的fsalebindid和fsalebindcode
            let doorpropval = []//calPropsValParams的参数1
            let doorAttr = parList.doorAttr;//放在state的doorAttr
            let doorAttrOp = parList.doorAttrOp //下拉项
            let doorItem = parList.doorItem;

            let propdataval = []//参数1
            for (let name in values) {
                if (name.indexOf("fpropertyname_") !== -1) {//洞口属性
                    let attrData = doorAttrOp[name];
                    let nameArr = name.split("_")
                    let fpropertycode = nameArr[nameArr.length - 1]
                    let attr = doorAttr.find(item => item.fpropertycode === fpropertycode)
                    //找出洞口属性
                    let doorpropObj = {}
                    let attrOp = {}
                    if (attr.fprotype.toString() !== "3") {
                        if (attrData) {
                            attrOp = attrData
                            // .find(item => {
                            //     return item.fcode.toString() === values[name].toString()
                            // })//找出下拉项
                        }
                    }
                    doorpropObj.fpropertycode = fpropertycode
                    doorpropObj.fcode = values[name];
                    doorpropObj.fdesc = attr.fprotype.toString() !== "3"
                        && attrOp ? attrOp.fname : values[name];
                    doorpropval.push(doorpropObj)

                    for (let item of ItemGoodsAttrCopy) {
                        if (item.fpropertycode.toString() === fpropertycode.toString()
                            && item.fdesc === "" && item.fcode === "") {
                            item.fcode = values[name];
                            item.fdesc = attr.fprotype.toString() !== "3"
                                && attrOp ? attrOp.fname : values[name];
                        }
                    }
                }
            }
            let params = {
                doorpropval: doorpropval,
                stcpropval: ItemGoodsAttrCopy,
                fsalebindcode: fsalebindcode
            }
            let calPropValUrl = "/order/door/calPropVal"

            let option = getInitOption(header, "POST", params)
            fetch(address + calPropValUrl, option).then((res) => {
                return res.json()
            }).then((res) => {
                res = formatRes(res)
                postMessage(res)
            })
        }
        else if (type === "addorder_stcUnitQty") {//新增订单 拆解2
            let values = data.values;
            let fgoodscode = data.fgoodscode;
            let groupNo = data.groupNo;
            let parList = data.parList;

            let propdataval = []//参数1 拆解2
            let stcgoodsval = []//参数2 拆解2

            let doorAttr = parList.doorAttr;
            let doorAttrOp = parList.doorAttrOp;
            let doorItemOp = parList.doorItemOp;//洞口项次下拉项

            for (let name in values) {
                let nameArr = name.split("_")
                if (name.indexOf("fpropertyname_") !== -1) {//洞口属性

                    let fpropertycode = nameArr[nameArr.length - 1]
                    let attr = doorAttr.find(
                        item => item.fpropertycode.toString()
                            === fpropertycode.toString()
                    )
                    let attrData = doorAttrOp[name];
                    let attrItem
                    if (attrData) {
                        attrItem = attrData
                    }
                    let propdataObj = {};//propdataval 拆解2
                    //     let doorpropdataObj = {};//doorpropdata 拆解3
                    propdataObj.fpropertycode = fpropertycode;
                    propdataObj.fpropertyname = attr.fprotype.toString() !== "3"
                        && attrItem ? attrItem.fpropertyname : attr.fpropertyname;
                    propdataObj.fcode = values[name];
                    propdataObj.fdesc = attr.fprotype.toString() !== "3" && attrItem ?
                        attrItem.fname : values[name];
                    propdataObj.fprotype = attr.fprotype;
                    propdataObj.fdcshowseqno = attr.fdcshowseqno;
                    propdataval.push(propdataObj)
                }
                else if (name.indexOf("fstcpropname_") !== -1) {//洞口项次
                    if (values[name] !== "") {
                        let stcgoodsObj = {};

                        let fstcpropcode = nameArr[nameArr.length - 1];
                        stcgoodsObj.fstcpropcode = fstcpropcode
                        let DoorItem = doorItemOp.find((item => {
                            return item.key === name
                        })).data.find((ditem) => {
                            return ditem.fgoodsid.toString() === values[name].toString()
                        })
                        stcgoodsObj.fstcgoodscode = DoorItem.fgoodscode
                        stcgoodsval.push(stcgoodsObj)
                    }
                }
            }
            let params = {
                propdata: propdataval,
                stcgoods: stcgoodsval,
                fgoodscode: fgoodscode
            }
            let getStcUnitQtyUrl = "/order/door/getStcUnitQty";
            let option = getInitOption(header, "POST", params)
            fetch(address + getStcUnitQtyUrl, option).then((res) => {
                return res.json()
            }).then((res) => {
                res = formatRes(res)
                postMessage(res)
            })
        }
    }
}
formatRes = (res) => {
    if (res.data) {
        if (res.data.errorMsg) {
            res.data.data = res.data.errorMsg;
        }
    }
    return res
}
function obj2String(obj, arr = [], idx = 0) {
    for (let item in obj) {
        arr[idx++] = [item, obj[item]]
    }
    return new URLSearchParams(arr).toString()
}
getInitOption = (header, method, param) => {
    let headers = getFetchHeaders(header.uuid, header.loginType, header.funid);
    return {
        method: method,
        headers: headers,
        body: JSON.stringify(param)
    }
}
getFetchHeaders = (storeuuid, logintype, funid) => {
    let headers = new Headers({
        "Authorization": 'Bearer ' + storeuuid,
        'X_Requested_Key': logintype + "," + funid,
        //  'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Accept": "application/json"
    })
    return headers
}
function commonFetcdh(url, headers, options, method = 'GET') {
    //  const searchStr = obj2String(options)
    let initObj = {}
    if (method === 'GET') { // 如果是GET请求，拼接url
        // url += '?' + searchStr
        // initObj = {
        //     method: method,
        //     credentials: 'include'
        // }
    } else {
        initObj = {
            method: method,
            headers: headers,
            body: JSON.stringify(options)
        }
    }
    fetch(url, initObj).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}



findSelectDoorItemOp = (values, doorItem, doorItemOp) => {
    //用于找选中的洞口项次下拉项，方便之后新增产品的深克隆和拆解过程中的查找
    let arr = [];
    for (let i = 0; i < doorItem.length; i++) {
        let fstcpropcode = doorItem[i].fstcpropcode;
        let key = "fstcpropname_" + fstcpropcode;
        for (let k = 0; k < doorItemOp.length; k++) {
            if (doorItemOp[k].key === key) {
                if (!values[key] || values[key] === "") {
                    continue;
                }
                let selectObj = doorItemOp[k].data.find(item =>
                    item.fgoodsid.toString() === values[key].toString())
                let obj = {
                    data: [selectObj],
                    key: key
                }
                arr.push(obj);
                break;
            }
        }
    }
    return arr
}
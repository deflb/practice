let address = "http://192.168.5.77:9999";//一般的请求地址
let fileaddress = "http://192.168.5.77:62506";//文件上传地址
let crmFileAddress = "http://192.168.2.6:8060";//CRM的C#上传文件地址
let imgAddress = 'http://192.168.5.77/'; //富文本编辑器之类的 直接获取图片
// http://125.93.252.232:9999
// http://125.93.252.232:1203

if (process.env.NODE_ENV === "production") { // 生产环境 地址由外部设置
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const addressObj = JSON.parse(xhr.responseText);
            address = addressObj.address;
            fileaddress = addressObj.fileaddress;
            crmFileAddress = addressObj.crmFileAddress;
            imgAddress = addressObj.imgAddress;
        }
    }
    xhr.open("GET", `${process.env.PUBLIC_URL}/address.json`, false);
    xhr.send();
}

export {
    address,
    fileaddress,
    crmFileAddress,
    imgAddress
}
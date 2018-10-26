let address = "http://192.168.5.77:9999";//一般的请求地址
let fileaddress = "http://192.168.5.77:62506";//文件上传地址
let crmFileAddress = "http://192.168.2.6:2220";//CRM的C#上传文件地址
let imgAddress = 'http://192.168.5.77/'; //富文本编辑器之类的 直接获取图片

if (process.env.NODE_ENV === "production") {
    // 生产环境下
}

export {
    address,
    fileaddress,
    crmFileAddress,
    imgAddress
}
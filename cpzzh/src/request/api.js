export default {
    // CRM的C#文件获取路径
    crmFileUrl: (filepath, filename) => {
        const base = '/javascript/kindeditor/asp.net/appfile_download.ashx';
        return filename ? `${base}?filepath=${filepath}&filename=${filename}` : `${base}?filepath=${filepath}`;
    },
    crmUploadFile: '/javascript/kindeditor/asp.net/appupload_json.ashx?dir=image', // C# 上传url

    getPublicKey: '/auth/sso/publicKey', // 从服务器获取公钥
    login: '/auth/sso/login', // 统一登录接口
    logout: '/auth/sso/logout', // 统一退出接口
    getPhoneCode: ' /auth/sso/getValidCode', // 获取手机校验码
    fileUpload: '/upc/upload?type=1', // 普通上传，支持所有文件，不支持断点续传 (0文件需登录访问；1文件无需登录访问)
    fileDelete: '/upc/delete', // 删除文件

    userInfo: '/order/wechat/user/userInfo', // 获取用户信息
    bindPhone: '/order/wechat/user/bindPhone', // 绑定手机号
    sendValidCode: '/order/wechat/user/sendValidCode', // 获取手机验证码
    levelInfo: '/order/wechat/user/levelInfo', // 获取用户等级详情

    getWxConfig: '/order/wechat/getWxConfig', // 获取wx.config参数
    getAuthUrl: '/order/wechat/getAuthUrl', // 向后台发起微信授权

    getBuildingList: '/manage/common/getBuilding', // 获取楼盘
    getProvince: '/manage/common/getProvince', // 获取省份列表
    getCity: '/manage/common/getCity', // 获取城市列表
    getDistrict: '/manage/common/getDistrict', // 获取地区列表
    getCityByName: '/manage/common/getCityByName', // 根据城市名称获取城市id

    getProvinceJps: '/storejps/common/getProvince', // 获取省份列表storejps
    getCityJps: '/storejps/common/getCity', // 获取城市列表storejps
    getDistrictJps: '/storejps/common/getDistrict', // 获取地区列表storejps

    // 沟通宝
    caseBaseList: '/case/data/list', // 案例基础数据
    pageCase: '/case/detail/pageCase', // 案例更多方案列表
    caseDetail: '/case/detail/getById', // 案例详情
    saveLikes: '/case/detail/saveLikes', // 点赞
    pageCommentList: '/case/comment/pageCommentList', // 获取评论列表
    saveCollects: '/case/detail/saveCollects', // 收藏/取消收藏
    saveComment: '/case/comment/saveComment', // 保存评论
    saveCommentReply: '/case/comment/saveCommentReply', // 保存评论回复
    caseCollectList: '/case/detail/collectList', // 我的收藏(案例)

    boardTypeList: '/case/board/boardTypeList', // 色板类别列表
    boardDetailList: '/case/board/boardDetailList', // 色板列表
    boardDetail: '/case/board/getInfoBoardDetail', // 色板详情

    partSortList: '/case/part/partSortList', // 配件分类列表
    brandList: '/case/part/brandList', // 品牌列表
    partDetailList: '/case/part/partDetailList', // 配件列表
    partDetail: '/case/part/getInfoPartDetail', // 配件详情

    // 个人中心
    getMessages: '/storejps/News/GetMessages', // 消息列表
    updateMessageRead: '/storejps/News/UpdateMessageRead', // 更新消息为已读
    myCoupon: '/order/wechat/user/myCoupon', // 优惠券列表
    saveFeedback: '/storejps/feedback/save', // 保存意见反馈

    //售后服务
    getStoreList: '/storejps/claim/list',//售后列表
    getStoreDetail: '/storejps/claim/getById',//售后详情
    getBaseDataList: '/storejps/common/getBaseDataList',//获取诉求下拉
    saveStore: '/storejps/claim/save',//保存售后

    //订单服务
    getOrderList: "/storejps/Orders/getCusOrderList",//订单列表
    getOrderDetail: '/storejps/Orders/GetPreorderInfo?orderNo=',//预订单详情
    getOfficalDetail: '/storejps/Orders/GetSaleOrder?orderNo=',//正式详情
    getOrderProgress: "/storejps/Orders/getOrderProgress",//获取任务进度
    getOrderserve: "/storejps/SerPrj/getOrderSerPrjList",//获取订单服务
    getTaskCompleteInfo: '/storejps/tasks/getTaskCompleteInfo',//进度详情信息

    //评价功能
    saveEvaluate: "/storejps/evaluate/evaluateCus",//提交评价
    getEvaluateTemp: '/storejps/evaluate/getCusEvaluateTemp',//获取模板
    getSalesEvaluateDetail: "/storejps/evaluate/getSalesEvaluateDetail",

    // 附近门店
    nearShop: '/storejps/shop/nearShop', // 附近门店列表
    shopGuideList: '/storejps/shop/shopGuideList', // 门店家居顾问
    shopDesignerList: '/storejps/shop/shopDesignerList', // 门店设计师
    shopStaffDetail: '/storejps/shop/shopStaffDetail', // 家居顾问/设计师详情
    shopDetail: '/storejps/shop/shopDetail', // 门店详情
    appointMeasure: '/storejps/shop/appointMeasure', // 预约量房

    // 晒家相关
    houseShowDelete: '/manage/houseShow/appDelete', // 删除晒家
    myHouseShowList: '/manage/houseShow/myHouseShow', // 我的晒家列表
    myHouseShowCollect: '/manage/houseShow/myCollection', // 我的收藏
    houseShowList: '/manage/houseShow/searchPage', // 晒家有礼列表
    HouseShowDetail: '/manage/houseShow/getHouseShow', // 晒家详情
    saveHouseShow: '/manage/houseShow/appSave', // 保存晒家
    pageHsCommentList: '/manage/houseShow/comment/pageHsCommentList', // 获取评论列表
    saveHsComment: '/manage/houseShow/comment/saveHsComment', // 发表评论
    saveHsCommentReply: '/manage/houseShow/comment/saveHsCommentReply', // 发表评论回复
    houseShowLike: '/manage/houseShow/like', // 点赞/取消点赞
    houseShowCollect: '/manage/houseShow/collect', // 收藏/取消收藏
    addViewCount: '/manage/houseShow/addViewCount', // 浏览量+1

    // 微信活动
    activityDetail: '/manage/wechatActivity/activityDetail', // 活动详情
    saveCustomerActivity: '/manage/wechatActivity/saveCustomerActivity', // 客户参加活动

    // 商机报备
    myBusinessReward: '/manage/business/myBusinessReward', // 我已获得奖励
    getBusiness: '/manage/business/getBusiness', // 商机详情
    myBusiness: '/manage/business/myBusiness', // 我的商机报备
    saveBusiness: '/manage/business/saveBusiness', // 报备商机-保存商机
    pageGuideReward: '/manage/business/pageGuideReward', // 报备商机-导购员列表
    getCustomerInfo: '/manage/business/getCustomerInfo', // 报备商机-获取客户信息
    getReporterReward: '/manage/business/getReporterReward', // 报备商机-获取报备人奖励
}
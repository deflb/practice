export default {
    // CRM的C#文件获取路径
    crmFileUrl: (filepath, filename) => {
        const base = '/javascript/kindeditor/asp.net/appfile_download.ashx';
        return filename ? `${base}?filepath=${filepath}&filename=${filename}` : `${base}?filepath=${filepath}`;
    },

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

    saveFeedback: '/storejps/feedback/save', // 保存意见反馈

    // 附近门店
    nearShop: '/storejps/shop/nearShop', // 附近门店列表
    shopGuideList: '/storejps/shop/shopGuideList', // 门店家居顾问
    shopDesignerList: '/storejps/shop/shopDesignerList', // 门店设计师
    shopStaffDetail: '/storejps/shop/shopStaffDetail', // 家居顾问/设计师详情
    shopDetail: '/storejps/shop/shopDetail', // 门店详情
    appointMeasure: '/storejps/shop/appointMeasure', // 预约量房

}
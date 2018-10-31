// 前端路由基础路径 (开发环境下项目被托管在根路径'/' 默认为根路径 打包前需确认项目被托管的服务路径同时修改package.json的homePage配置)
/***项目中在做路由跳转时 如果没用match.patch 则需要在路径前加上 routerBase***/
const routerBase = ''; // 由于前端路由起始位都有 / 所以根路径为 ''

export default routerBase;
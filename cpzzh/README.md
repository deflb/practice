# :large_orange_diamond: 梦天公众号 [`React`](https://github.com/facebook/react)

脚手架 [Create React App](https://github.com/facebook/create-react-app)

UI框架 [Ant Design Mobile](https://github.com/ant-design/ant-design-mobile)

## 初始化

```sh
git clone git@192.168.5.102:soonfor/mtzzh.git
```

## 开始

- [安装依赖](#install)
- [启动](#start)
- [测试](#test)
- [打包](#build)

## 项目简介

- 适配
    - 布局 [rem]
    - 字体(媒体查询) [px]
    - 内外边距 [px]
- 样式
    - [Less Modules](#less-modules)
- [自定义图标](#custom-icon)
    - [`iconfont`](http://www.iconfont.cn)
- 路由 [React-router](https://github.com/ReactTraining/react-router)
    - H5 [history pushState](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)
    - BaseUrl 可配置
- [Redux](https://github.com/reduxjs/react-redux)
    - 路由状态纳入redux管理 [react-router-redux](https://github.com/reactjs/react-router-redux)
    - 支持异步action [redux-thunk](https://github.com/reduxjs/redux-thunk)
- 请求
    - 基于 [axios](https://github.com/axios/axios)封装
    - BaseUrl 可配置
- 其他
    支持 H5 [serviceWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker)

## install

```sh
yarn
```
```sh
yarn install
```

## start

```sh
yarn start
```

## test

```sh
yarn run rest
```

## build

`产生sourcemap`
```sh
yarn run build
```
`不产生sourcemap`
```sh
set "GENERATE_SOURCEMAP=false" && yarn run build
```

## Less Modules

### `demo.less`

```less
:gloabl(.theme){ // 全局样式类

}
.error { // 模块化样式类

}
```

### `demo.js`

```js
import React, { Component } from 'react';
import styles from './demo.less'; // 引入

export default class demo extends Component {
  render() {
    return <div className='theme'>
        <button className={styles.error}>Error Button</button>
    </div>
  }
}
```

## Custom Icon

```js
export default ({...props}) => <i className='iconfont icon-xxx' />
```
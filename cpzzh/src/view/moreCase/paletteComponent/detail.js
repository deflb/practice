import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomCarousel from '../../../component/customCarousel';
import hasTransformFullScreen from '../../../component/fullScreen/hasTransformFullScreen';
import EnabledIosScrollViewSimple from '../../../component/enabledIosScrollView/simple';
import TitleContent from '../../../component/titleContent';
import { request } from '../../../request';
import api from '../../../request/api';
import { getLocationSearch, wholeUrl } from '../../../utlis';
import wx from 'weixin-js-sdk';
import wxConfig from '../../../utlis/wxConfig';
import whichImgLink from '../../../utlis/whichImgLink';

export default hasTransformFullScreen(class paletteDetail extends Component {
    state = {
        detail: {}
    }

    componentDidMount() {
        document.title = '色板详情'
        const { location } = this.props,
            { state = {} } = location,
            id = state.id || getLocationSearch('id');
        if (id)
            request({ url: api.boardDetail, data: { id } }).then(res => {
                const { location } = this.props, { pathname } = location;
                wxConfig({ wx, jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'] }).then(() => {
                    wx.updateTimelineShareData({
                        title: '色板详情',
                        link: wholeUrl(pathname + `?id=${res.id}`),
                        imgUrl: whichImgLink(res.imgUrl)
                    })
                    wx.updateAppMessageShareData({
                        title: '色板详情',
                        desc: res.title,
                        link: wholeUrl(pathname + `?id=${res.id}`),
                        imgUrl: whichImgLink(res.imgUrl)
                    })
                })
                this.setState({ detail: res })
            }).catch(err => { })
    }

    render() {
        const { detail } = this.state,
            { title, imgUrl = '', remark, details } = detail;
        return <EnabledIosScrollViewSimple>
            <CustomCarousel
                source={[imgUrl]}
            />
            <Card full>
                <Card.Header
                    title={<div className='twoRowsOverflowOmit'>{title}</div>}
                />
                <Card.Body>
                    {remark}
                </Card.Body>
            </Card>
            <CustomWhiteSpace />
            <TitleContent title='色板案例'>
                <div dangerouslySetInnerHTML={{ __html: details }} style={{ padding: '7px 15px 0' }} className='rich_text_global' />
            </TitleContent>
        </EnabledIosScrollViewSimple>
    }
})
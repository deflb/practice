import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import InfoList from '../../../component/infoList';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomCarousel from '../../../component/customCarousel';
import hasTransformFullScreen from '../../../component/fullScreen/hasTransformFullScreen';
import EnabledIosScrollViewSimple from '../../../component/enabledIosScrollView/simple';
import TitleContent from '../../../component/titleContent';
import { request } from '../../../request';
import api from '../../../request/api';
import { getLocationSearch, wholeUrl } from "../../../utlis";
import wx from 'weixin-js-sdk';
import wxConfig from '../../../utlis/wxConfig';
import whichImgLink from '../../../utlis/whichImgLink';

export default hasTransformFullScreen(class mountingsDetail extends Component {
    state = {
        detail: {}
    }

    componentWillMount() {
        document.title = '配件详情';
        const { location } = this.props,
            { state = {} } = location,
            id = state.id || getLocationSearch('id');
        if (id)
            request({ url: api.partDetail, data: { id } }).then(res => {
                const { location } = this.props, { pathname } = location;
                wxConfig({ wx, jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'] }).then(() => {
                    wx.updateTimelineShareData({
                        title: '配件详情',
                        link: wholeUrl(pathname + `?id=${res.id}`),
                        imgUrl: whichImgLink(res.surfacePlotUrl)
                    })
                    wx.updateAppMessageShareData({
                        title: '配件详情',
                        desc: res.name,
                        link: wholeUrl(pathname + `?id=${res.id}`),
                        imgUrl: whichImgLink(res.surfacePlotUrl)
                    })
                })
                this.setState({ detail: res })
            }).catch(err => { })
    }

    render() {
        const { detail } = this.state,
            { name, imgUrlList = [], details, brandname, sortname, specification } = detail;
        return <EnabledIosScrollViewSimple>
            <CustomCarousel
                source={imgUrlList}
            />
            <Card full>
                <Card.Header
                    title={<div className='twoRowsOverflowOmit'>{name}</div>}
                />
                <Card.Body>
                    <InfoList data={[
                        { label: '品牌', value: brandname },
                        { label: '名称', value: sortname },
                        { label: '规格', value: specification },
                    ]} />
                </Card.Body>
            </Card>
            <CustomWhiteSpace />
            <TitleContent title='产品详情'>
                <div dangerouslySetInnerHTML={{ __html: details }} style={{ padding: '7px 15px 0' }} className='rich_text_global' />
            </TitleContent>
        </EnabledIosScrollViewSimple>
    }
})
import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import InfoList from '../../../component/infoList';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomCarousel from '../../../component/customCarousel';
import hasTransformFullScreen from '../../../component/fullScreen/hasTransformFullScreen';
import EnabledIosScrollView from '../../../component/enabledIosScrollView/simple';
import { request } from '../../../request';
import api from '../../../request/api';

export default hasTransformFullScreen(class mountingsDetail extends Component {
    state = {
        detail: {}
    }

    componentDidMount() {
        const { location } = this.props,
            { state = {} } = location,
            { id } = state;
        if (id)
            request({ url: api.partDetail, data: { id } }).then(res => {
                this.setState({ detail: res })
            }).catch(err => {  })
    }

    render() {
        const { detail } = this.state,
            { name, imgUrlList = [], details, brandname, sortname, specification } = detail;
        return <EnabledIosScrollView>
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
            <Card full>
                <Card.Header
                    title="详情"
                />
                <Card.Body>
                    <div dangerouslySetInnerHTML={{ __html: details }} className='rich_text_global' />
                </Card.Body>
            </Card>
        </EnabledIosScrollView>
    }
})
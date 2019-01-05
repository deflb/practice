import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomCarousel from '../../../component/customCarousel';
import hasTransformFullScreen from '../../../component/fullScreen/hasTransformFullScreen';
import EnabledIosScrollView from '../../../component/enabledIosScrollView/simple';
import { request } from '../../../request';
import api from '../../../request/api';

export default hasTransformFullScreen(class paletteDetail extends Component {
    state = {
        detail: {}
    }

    componentDidMount() {
        const { location } = this.props,
            { state = {} } = location,
            { id } = state;
        if (id)
            request({ url: api.boardDetail, data: { id } }).then(res => {
                this.setState({ detail: res })
            }).catch(err => { })
    }

    render() {
        const { detail } = this.state,
            { title, imgUrl = '', remark, details } = detail;
        return <EnabledIosScrollView>
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
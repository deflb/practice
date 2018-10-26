import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import DetailCarousel from '../common/detailCarousel';
import fullScreen from '../../../component/fullScreen';
import { request } from '../../../request';
import api from '../../../request/api';
import { imgAddress } from '../../../request/baseURL';

export default fullScreen(class paletteDetail extends Component {
    state = {
        detail: {}
    }

    componentDidMount() {
        const { location } = this.props, { state } = location;
        request({ url: api.boardDetail, data: { id: state.id } }).then(res => {
            this.setState({ detail: res })
        }).catch(err => { console.log(err) })
    }

    render() {
        const { detail } = this.state,
            { title, imgUrl, remark, details } = detail;
        return <div>
            <DetailCarousel
                source={[imgAddress + imgUrl]}
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
                    <div dangerouslySetInnerHTML={{ __html: details }} style={{ overflow: 'auto' }} />
                </Card.Body>
            </Card>
        </div>
    }
})
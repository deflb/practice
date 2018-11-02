import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Toast } from 'antd-mobile';
import InfoList from '../../../component/infoList';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import DetailCarousel from '../common/detailCarousel';
import fullScreen from '../../../component/fullScreen';
import Evaluate from '../../../component/evaluate';
import EvaluateBar from '../../../component/evaluate/bar';
import { request } from '../../../request';
import api from '../../../request/api';
import { imgAddress } from '../../../request/baseURL';
import styles from './detail.less';
import { formatDate } from '../../../utlis';

export default connect(state => ({
    userInfo: state.userInfo
}))(fullScreen(class caseDetail extends Component {
    state = {
        detail: {}
    }

    static propTypes = {
        updateCurrentItem: PropTypes.func,
    }
    static defaultProps = {
        updateCurrentItem: function () { }
    }

    getDetail = () => { // 获取案例详情
        const { location, updateCurrentItem } = this.props,
            { state = {} } = location,
            { id } = state;
        if (id)
            request({ url: api.caseDetail, data: { id } }).then(res => {
                this.setState({ detail: res });
                // 更新查看数
                updateCurrentItem('views', state.index)
            }).catch(err => { })
    }

    componentDidMount() {
        this.getDetail()
    }

    collect = (id, status) => { // 收藏|取消收藏
        request({ url: api.saveCollects, data: { id, status } }).then(res => {
            Toast.success(res, 0.7)
            const { detail } = this.state;
            if (status === 1) {
                ++detail.collects;
                detail.flagLike = 1;
            } else {
                detail.collects--;
                detail.flagLike = 0;
            }
            this.setState({ detail: { ...detail } })
        }).catch(err => { })
    }

    onSave = () => { // 评价保存后
        this.evaluateBar.hide();
        const { detail } = this.state,
            { location, updateCurrentItem } = this.props,
            { state } = location;
        detail.comments++;
        this.setState({ detail: { ...detail } })
        // 更新评价数
        updateCurrentItem('comments', state.index)
    }

    onSend = info => { // 发送评价
        this.evaluate.saveComment(info)
    }

    render() {
        const { detail } = this.state,
            { location, userInfo } = this.props,
            { state = {} } = location,
            { title, effectImageUrlList = [], remark, creator, createTime, content,
                areaName, houseName, priceName, spaceName, styleName,
                collects, comments, flagLike, likes, views,
                // intents
            } = detail;
        return <div className={styles.wrapper}>
            <div className={styles.wrapper_body}>
                <DetailCarousel
                    source={effectImageUrlList.map(item => imgAddress + item)}
                />
                <Card full>
                    <Card.Header
                        title={<div className={styles.wrapper_body_title}>
                            <div>{title}</div>
                            <div onClick={this.collect.bind(this, state.id, flagLike === 1 ? 0 : 1)} style={{ color: flagLike ? '#FFCC33' : null }}>
                                <i className='iconfont icon-collect' />
                                <div>{flagLike ? '取消收藏' : '收藏'}</div>
                            </div>
                        </div>}
                    />
                    <Card.Body>
                        <div className={styles.wrapper_body_info}>
                            <div className={styles.wrapper_body_info_des}>
                                <ul>
                                    <li>{creator}</li>
                                    <li>{formatDate(new Date(createTime), 'YY-MM-DD')}</li>
                                </ul>
                                <div>{remark}</div>
                            </div>
                            <InfoList data={[
                                { label: '面积', value: areaName, span: 12 },
                                { label: '户型', value: houseName, span: 12 },
                                { label: '价位', value: priceName, span: 12 },
                                { label: '空间名称', value: spaceName, span: 12 },
                                { label: '风格', value: styleName, span: 12 },
                                // { label: '楼盘', value: <span>成都天语小区 <a href='/x'>同楼盘方案</a></span>, },
                            ]} />
                        </div>
                    </Card.Body>
                </Card>
                <CustomWhiteSpace />
                <Card full>
                    <Card.Header
                        title="详情"
                    />
                    <Card.Body>
                        <div dangerouslySetInnerHTML={{ __html: content }} style={{ overflow: 'auto' }} />
                    </Card.Body>
                </Card>
                <CustomWhiteSpace />
                <Evaluate
                    ref={instance => this.evaluate = instance}
                    userInfo={userInfo}
                    caseId={state.id}
                    onSave={this.onSave}
                />
            </div>
            <EvaluateBar
                ref={instance => this.evaluateBar = instance}
                detail={{ collects, comments, likes, views }}
                onSend={this.onSend}
            />
        </div>
    }
}))
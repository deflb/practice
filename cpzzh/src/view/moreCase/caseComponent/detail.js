import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Card, Toast } from 'antd-mobile';
import InfoList from '../../../component/infoList';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomCarousel from '../../../component/customCarousel';
import hasTransformFullScreen from '../../../component/fullScreen/hasTransformFullScreen';
import Evaluate from '../../../component/evaluate';
import EvaluateBar from '../../../component/evaluate/bar';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './detail.less';

export default hasTransformFullScreen(class caseDetail extends Component {
    state = {
        isLoading: false,
        detail: {}
    }

    static propTypes = {
        updateCurrentItem: PropTypes.func,
        collectBack: PropTypes.func,
    }
    static defaultProps = {
        updateCurrentItem: function () { },
        collectBack: function () { },
    }

    getDetail = () => { // 获取案例详情
        const { location, updateCurrentItem } = this.props,
            { state = {} } = location,
            { id } = state;
        if (id) {
            this.setState({ isLoading: true })
            request({ url: api.caseDetail, data: { id } }).then(res => {
                this.setState({ detail: res, isLoading: false });
                // 更新查看数
                updateCurrentItem('views', state.index)
            }).catch(err => {
                this.setState({ isLoading: false })
            })
        }
    }

    componentDidMount() {
        document.title = '案例详情'
        this.getDetail()
    }

    onCollect = () => { // 收藏|取消收藏
        const { location, collectBack } = this.props,
            { state = {} } = location,
            { detail } = this.state,
            { flagLike } = detail,
            status = flagLike ? 0 : 1;
        request({ url: api.saveCollects, data: { id: state.id, status } }).then(res => {
            Toast.success(res, 0.7);
            if (status === 1) {
                ++detail.collects;
                detail.flagLike = 1;
            } else {
                detail.collects--;
                detail.flagLike = 0;
            }
            collectBack();
            this.setState({ detail: { ...detail } })
        }).catch(err => { })
    }

    onLike = () => { // 点赞
        const { detail } = this.state,
            { location, updateCurrentItem } = this.props,
            { state = {} } = location;
        request({ url: api.saveLikes, data: { id: state.id, status: 1 } }).then(res => {
            Toast.success(res, 0.7);
            detail.likes++;
            this.setState({ detail: { ...detail } })
            // 更新列表点赞数
            updateCurrentItem('likes', state.index)
        }).catch(err => { })
    }

    onSave = () => { // 评价保存后
        const { detail } = this.state,
            { location, updateCurrentItem } = this.props,
            { state } = location;
        detail.comments++;
        this.setState({ detail: { ...detail } })
        // 更新列表评价数
        updateCurrentItem('comments', state.index)
    }

    onSend = info => { // 发送评价
        this.evaluate.saveComment(info)
    }

    onComment = () => {
        ReactDOM.findDOMNode(this.evaluate).scrollIntoView()
    }

    render() {
        const { detail } = this.state,
            { location } = this.props,
            { state = {} } = location,
            { title, effectImageUrlList = [], remark, content,
                areaName, houseName, priceName, spaceName, styleName,
                collects, comments, flagLike, likes, views,
                // intents
            } = detail;
        return <div className={styles.wrapper}>
            <div className={styles.wrapper_container}>
                <CustomCarousel
                    source={effectImageUrlList}
                />
                <Card full>
                    <Card.Header title={<div className={styles.wrapper_title}>{title}</div>} />
                    <Card.Body>
                        <div className={styles.wrapper_info}>
                            <p className={styles.wrapper_info_des}>{remark}</p>
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
                        <div dangerouslySetInnerHTML={{ __html: content }} className='rich_text_global' />
                    </Card.Body>
                </Card>
                <CustomWhiteSpace />
                <Evaluate
                    ref={instance => this.evaluate = instance}
                    listApi={api.pageCommentList}
                    replyApi={api.saveCommentReply}
                    commentApi={api.saveComment}
                    id={state.id}
                    field='caseId'
                    onSave={this.onSave}
                />
            </div>
            <EvaluateBar
                detail={{ collects, comments, likes, views, collected: flagLike }}
                onLike={this.onLike}
                onSend={this.onSend}
                onCollect={this.onCollect}
                onComment={this.onComment}
            />
        </div>
    }
})
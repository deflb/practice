import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import fullScreen from '../../../component/fullScreen';
// import CustomCarousel from '../../../component/customCarousel';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import Evaluate from '../../../component/evaluate';
import EvaluateBar from '../../../component/evaluate/bar';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';
import { imgAddress } from '../../../request/baseURL';

export default fullScreen(class detail extends Component {
    state = {
        detail: {}
    }
    componentDidMount() {
        this.getDetail();
    }
    getDetail = () => {
        const { location } = this.props,
            { state = {} } = location;
        request({ url: api.HouseShowDetail, data: { id: state.id } }).then(res => {
            this.setState({ detail: res })
        }).catch(err => { })
    }
    onSave = () => { // 评价保存后
        this.evaluateBar.hide();
    }
    onSend = info => { // 发送评价
        this.evaluate.saveComment(info)
    }
    render() {
        const { detail } = this.state,
            { location } = this.props,
            { state = {} } = location,
            { title, building, creatorName, creatorAvatar, content,
                viewCount, collectCount, likeCount, shareCount
            } = detail;
        return (<div className={styles.wrapper}>
            <div className={styles.wrapper_content}>
                {/* <CustomCarousel
                    source={[]}
                /> */}
                <Card full>
                    <Card.Header
                        title={<div className={styles.wrapper_content_title}>{title}</div>}
                    />
                    <Card.Body>
                        <ul className={styles.wrapper_content_info}>
                            <li className={styles.wrapper_content_info_user}>
                                <div className={styles.wrapper_content_info_user_avator}>
                                    {creatorAvatar ? <img src={imgAddress + creatorAvatar} alt='' /> : null}
                                </div>
                                <ul className={styles.wrapper_content_info_user_info}>
                                    <li className={styles.wrapper_content_info_user_info_name}>{creatorName}</li>
                                    <li className={styles.wrapper_content_info_user_info_address}><i className='iconfont icon-address' />{building}</li>
                                </ul>
                            </li>
                            <li className={styles.wrapper_content_info_collect}>
                                <i className='iconfont icon-collect' />
                                <div>{false ? '取消收藏' : '收藏'}</div>
                            </li>
                        </ul>
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
                    listApi={api.pageHsCommentList}
                    replyApi={api.saveHsCommentReply}
                    commentApi={api.saveHsComment}
                    id={state.id}
                    field='houseShowId'
                    onSave={this.onSave}
                />
            </div>
            <EvaluateBar
                ref={instance => this.evaluateBar = instance}
                detail={{ collects: collectCount, shares: shareCount, likes: likeCount, views: viewCount }}
                onSend={this.onSend}
            />
        </div>)
    }
})
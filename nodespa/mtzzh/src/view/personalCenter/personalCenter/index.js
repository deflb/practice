import React, { Component } from 'react';
import { Card, List } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import GoToVerify from './goToVerify';
import portrait_png from '../../../assets/image/portrait.png';
import list_thumb_png from '../../../assets/image/list_thumb.png';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';

export default class personalCenter extends Component {

    state = {
        hadVerify: false
    }

    getLevelInfo = () => {
        request({ url: api.levelInfo }).then(res => {
            console.log(res)
        }).catch(err => { })
    }

    componentDidMount() {
        this.state.hadVerify && this.getLevelInfo()
    }

    jumpTo = ({ pathname, state = {} }) => {
        const { history } = this.props;
        history.push({
            pathname,
            state
        })
    }

    render() {
        const { hadVerify } = this.state,
            { match } = this.props, { path } = match;
        return (
            <div>
                {hadVerify ? <Card full className={styles.had_verify}>
                    <Card.Header
                        thumb={<div className={styles.had_verify_avator}>
                            <img src={portrait_png} alt='' />
                        </div>}
                        title={<div>
                            <div className='highFontSizeC'>陈莉莉 <span className={`textFontSizeC ${styles.had_verify_level}`}>普通会员</span></div>
                            <div className='textFontSizeC shallowGreyColor'>再有<span className='redColor'>3200</span>成长值即可升级为铜牌会员</div>
                        </div>}
                        extra={<i onClick={this.jumpTo.bind(this, { pathname: path + '/message' })} className='iconfont icon-message highFontSizeC' />}
                    />
                    <Card.Body>
                        <div className={styles.had_verify_options}>
                            <div onClick={this.jumpTo.bind(this, { pathname: path + '/grade' })}>
                                <div className='titleFontSizeC redColor'>30000</div>
                                <div className='textFontSizeC shallowGreyColor'>成长值</div>
                            </div>
                            <div className='yBoth1px' onClick={this.jumpTo.bind(this, { pathname: path + '/discountCoupon' })}>
                                <div className='titleFontSizeC'>5</div>
                                <div className='textFontSizeC shallowGreyColor'>优惠券</div>
                            </div>
                            <div onClick={this.jumpTo.bind(this, { pathname: path + '/integral' })}>
                                <div className='titleFontSizeC'>256</div>
                                <div className='textFontSizeC shallowGreyColor'>积分</div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                    :
                    <div className={styles.no_verify}>
                        <div className={styles.no_verify_info}>
                            <i className='iconfont icon-message highFontSizeC' onClick={this.jumpTo.bind(this, { pathname: path + '/message' })} />
                            <div className={styles.no_verify_info_avator}>
                                {/* <img src={portrait_png} alt='' /> */}
                            </div>
                            <p className='highFontSizeC'>陈莉莉</p>
                        </div>
                        <CustomWhiteSpace />
                        <GoToVerify />
                    </div>
                }
                <CustomWhiteSpace />
                <List className={styles.operate}>
                    <List.Item
                        className={styles.operate_item}
                        arrow="horizontal"
                        thumb={list_thumb_png}
                        extra={<span className={`${styles.list_item_extra} textFontSizeC`}>2</span>}
                        onClick={this.jumpTo.bind(this, { pathname: '/myOrder' })}
                    >
                        <span className='titleFontSizeC'>我的订单</span>
                    </List.Item>
                    <List.Item
                        className={styles.operate_item}
                        arrow="horizontal"
                        thumb={list_thumb_png}
                        extra={<span className={`${styles.list_item_extra} textFontSizeC`}>1</span>}
                        onClick={this.jumpTo.bind(this, { pathname: '/myAfterSale' })}
                    >
                        <span className='titleFontSizeC'>我的售后</span>
                    </List.Item>
                </List>
                <CustomWhiteSpace />
                <List>
                    <List.Item
                        className={styles.operate_item}
                        arrow="horizontal"
                        thumb={list_thumb_png}
                        onClick={this.jumpTo.bind(this, { pathname: path + '/collect' })}
                    >
                        <span className='titleFontSizeC'>我的收藏</span>
                    </List.Item>
                    <List.Item
                        className={styles.operate_item}
                        arrow="horizontal"
                        thumb={list_thumb_png}
                        onClick={this.jumpTo.bind(this, { pathname: path + '/suggestionFeedback' })}
                    >
                        <span className='titleFontSizeC'>意见反馈</span>
                    </List.Item>
                </List>
            </div>
        );
    }
}
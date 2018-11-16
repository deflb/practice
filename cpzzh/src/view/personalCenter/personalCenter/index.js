import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, List } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import GoToVerify from './goToVerify';
import list_thumb_png from '../../../assets/image/list_thumb.png';
import routerBase from '../../../router/routerBase';
import styles from './index.less';

export default connect(state => ({
    userInfo: state.userInfo
}))(class personalCenter extends Component {

    jumpTo = ({ pathname, state = {} }) => {
        const { history } = this.props;
        history.push({
            pathname,
            state
        })
    }

    render() {
        const { match, userInfo } = this.props,
            { path } = match,
            { avatar, name, userLevel, growthValue, needValue, nextLevel, couponCount, score, isAuth, orderCount, claimCount } = userInfo;
        return (
            <div>
                {isAuth === 1 ? <Card full className={styles.had_verify}>
                    <Card.Header
                        thumb={<div className={styles.had_verify_avator}>
                            {avatar ? <img src={avatar} alt='' /> : null}
                        </div>}
                        title={<div className={styles.had_verify_title}>
                            <div className={styles.had_verify_title_header}>
                                <div className={styles.had_verify_title_header_info}>{name} {userLevel ? <span className={styles.had_verify_title_header_info_level}>{userLevel}</span> : null}</div>
                                <i className='iconfont icon-message' onClick={this.jumpTo.bind(this, { pathname: path + '/message' })} />
                            </div>
                            <div className={styles.had_verify_title_footer}>再有<span className={styles.had_verify_title_footer_tip}>{needValue}</span>成长值即可升级为{nextLevel}</div>
                        </div>}
                    />
                    <Card.Body>
                        <div className={styles.had_verify_options}>
                            <div className={styles.had_verify_options_item} onClick={this.jumpTo.bind(this, { pathname: path + '/grade', state: { avatar, name, userLevel } })}>
                                <div className={`${styles.had_verify_options_item_text} ${styles.growth_value}`}>{growthValue}</div>
                                <div className={styles.had_verify_options_item_title}>成长值</div>
                            </div>
                            <div className={styles.had_verify_options_item}
                                onClick={this.jumpTo.bind(this, { pathname: path + '/discountCoupon' })}
                            >
                                <div className={styles.had_verify_options_item_text}>{couponCount}</div>
                                <div className={styles.had_verify_options_item_title}>优惠券</div>
                            </div>
                            <div
                                className={styles.had_verify_options_item}
                            // onClick={this.jumpTo.bind(this, { pathname: path + '/integral' })}
                            >
                                <div className={styles.had_verify_options_item_text}>{score}</div>
                                <div className={styles.had_verify_options_item_title}>积分</div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                    :
                    <div className={styles.no_verify}>
                        <div className={styles.no_verify_info}>
                            <i className='iconfont icon-message' onClick={this.jumpTo.bind(this, { pathname: path + '/message' })} />
                            <div className={styles.no_verify_info_avator}>
                                {avatar ? <img src={avatar} alt='' /> : null}
                            </div>
                            <p>{name}</p>
                        </div>
                        <CustomWhiteSpace />
                        <GoToVerify />
                    </div>
                }
                {isAuth === 1 ? <CustomWhiteSpace /> : null}
                {isAuth === 1 ? <List className={styles.operate}>
                    <List.Item
                        className={styles.operate_item}
                        arrow="horizontal"
                        thumb={list_thumb_png}
                        extra={<span className={styles.list_item_extra}>{orderCount}</span>}
                        onClick={this.jumpTo.bind(this, { pathname: routerBase + '/myOrder' })}
                    >
                        <span className={styles.operate_item_text}>我的订单</span>
                    </List.Item>
                    <List.Item
                        className={styles.operate_item}
                        arrow="horizontal"
                        thumb={list_thumb_png}
                        extra={<span className={styles.list_item_extra}>{claimCount}</span>}
                        onClick={this.jumpTo.bind(this, { pathname: routerBase + '/myAfterSale' })}
                    >
                        <span className={styles.operate_item_text}>我的售后</span>
                    </List.Item>
                </List> : null}
                <CustomWhiteSpace />
                <List>
                    <List.Item
                        className={styles.operate_item}
                        arrow="horizontal"
                        thumb={list_thumb_png}
                        onClick={this.jumpTo.bind(this, { pathname: path + '/collect' })}
                    >
                        <span className={styles.operate_item_text}>我的收藏</span>
                    </List.Item>
                    <List.Item
                        className={styles.operate_item}
                        arrow="horizontal"
                        thumb={list_thumb_png}
                        onClick={this.jumpTo.bind(this, { pathname: path + '/suggestionFeedback' })}
                    >
                        <span className={styles.operate_item_text}>意见反馈</span>
                    </List.Item>
                </List>
            </div>
        );
    }
})
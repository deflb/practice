import React, { Component } from 'react';
import { Card, List, Modal, InputItem, Icon } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace'
import portrait_png from '../../../assets/image/portrait.png';
import list_thumb_png from '../../../assets/image/list_thumb.png';
import styles from './index.less';

export default class personalCenter extends Component {

    state = {
        flag: true,
        visible: false
    }

    jumpTo = ({ pathname, state = {} }) => {
        const { history } = this.props;
        history.push({
            pathname,
            state
        })
    }

    onClose = () => {
        this.setState({ visible: false })
    }
    onOk = () => {

        this.onClose()
    }

    render() {
        const { flag, visible } = this.state,
            { match } = this.props, { path } = match;
        return (
            <div>
                {!flag ? <Card full className={styles.had_verify}>
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
                            <div className='xBoth1px' onClick={this.jumpTo.bind(this, { pathname: path + '/discountCoupon' })}>
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
                        <List>
                            <List.Item extra={
                                <span className={styles.no_verify_gotoVerify} onClick={e => { this.setState({ visible: true }) }}>去验证</span>
                            }>验证成功后，订单信息一手掌握</List.Item>
                        </List>
                        <Modal
                            className={styles.verify_modal}
                            visible={visible}
                            transparent
                            onClose={this.onClose}
                            title={<div className={styles.verify_modal_title}>验证登陆<Icon type='cross-circle' onClick={this.onClose} /></div>}
                            footer={[{ text: <div className={styles.verify_modal_footer}>确定</div>, onPress: this.onOk }]}
                        // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                        >
                            <List>
                                <InputItem clear type='phone' placeholder='输入手机号' />
                                <InputItem clear extra={<div>获取验证码</div>} type='number' placeholder='输入验证码' />
                            </List>
                        </Modal>
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
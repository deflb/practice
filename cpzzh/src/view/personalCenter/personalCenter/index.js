import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
// import EnabledIosScrollView from '../../../component/enabledIosScrollView';
import CustomModal from '../../../component/customModal';
import order_icon from '../../../assets/icon/order_icon@3x.png';
import after_sale_icon from '../../../assets/icon/after_sale_icon@3x.png';
import business_opportunity_icon from '../../../assets/icon/business_opportunity_icon@3x.png';
import sun_home_icon from '../../../assets/icon/sun_home_icon@3x.png';
import collect_icon from '../../../assets/icon/collect_icon@3x.png';
import inform_icon from '../../../assets/icon/vip_service_icon@3x.png';
import opinion_icon from '../../../assets/icon/opinion_icon@3x.png';
import routerBase from '../../../router/routerBase';
import whichImgLink from '../../../utlis/whichImgLink';
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

    goToVerify = () => {
        let { dispatch, userInfo } = this.props;
        CustomModal.verify({ dispatch, userInfo })
    }

    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }

    render() {
        const { userInfo, dispatch } = this.props,
            { avatar, name, userLevel, growthValue, needValue, nextLevel, couponCount, score, isAuth, orderCount, claimCount } = userInfo;
        return (<React.Fragment>
            {isAuth === 1 ? <div>
                <div className={styles.had_verify_header}>
                    <ul className={styles.content}>
                        <li className={styles.content_avator}>
                            {avatar ? <img src={whichImgLink(avatar)} alt='' /> : null}
                        </li>
                        <li className={styles.content_info}>
                            <div className={styles.content_info_top}>
                                <span className={styles.content_info_top_name}>{name}</span>{userLevel ? <span className={styles.content_info_top_level}>{userLevel}</span> : null}
                            </div>
                            {!needValue || !nextLevel
                                ? <div className={styles.content_info_bottom}>再有3200成长值即可升级为银牌会员</div>
                                : <div className={styles.content_info_bottom}>再有{needValue}成长值即可升级为{nextLevel}</div>}
                        </li>
                    </ul>
                    <i className={styles.message} onClick={this.jumpTo.bind(this, { pathname: routerBase + '/myMessage' })} />
                </div>
                <ul className={styles.had_verify_options}>
                    {[
                        { router: '/grade', text: '成长值', value: <span className={styles.growth_value}>{growthValue}</span>, state: { avatar, name, userLevel } },
                        { router: '/bounty', text: '奖励金', value: 1300, state: {} },
                        { router: '/discountCoupon', text: '优惠券', value: couponCount, state: {} },
                        { router: '/integral', text: '积分', value: score, state: { score } },
                    ].map(item => (<li key={item.router} className={styles.had_verify_options_item} onClick={this.jumpTo.bind(this, { pathname: routerBase + item.router, state: item.state })}>
                        <div className={styles.had_verify_options_item_title}>{item.value}</div>
                        <div className={styles.had_verify_options_item_text}>{item.text}</div>
                    </li>))}
                </ul>
            </div>
                :
                <div className={styles.no_verify}>
                    <div className={styles.no_verify_info}>
                        <i className={styles.message} onClick={this.jumpTo.bind(this, { pathname: routerBase + '/myMessage' })} />
                        <div className={styles.no_verify_info_avator}>
                            {avatar ? <img src={whichImgLink(avatar)} alt='' /> : null}
                        </div>
                        <p>{name}</p>
                    </div>
                    <CustomWhiteSpace />
                    <ul className={styles.no_verify_operate}>
                        <li className={styles.no_verify_operate_text}>验证成功后，订单信息一手掌握</li>
                        <li className={styles.no_verify_operate_btn} onClick={this.goToVerify}>去验证</li>
                    </ul>
                </div>
            }
            <CustomWhiteSpace />
            <ul className={styles.operate}>
                {[
                    { text: '我的订单', router: '/myOrder/detail', extra: <span className={styles.operate_item_extra}>{orderCount}</span>, icon: <img src={order_icon} alt='' /> },
                    { text: '我的售后', router: '/myAfterSale', extra: <span className={styles.operate_item_extra}>{claimCount}</span>, icon: <img src={after_sale_icon} alt='' /> },
                ].map(item => <li key={item.router} className={styles.operate_item} onClick={() => {
                    if (CustomModal.verify({ dispatch, userInfo }))
                        this.jumpTo({ pathname: routerBase + item.router })
                }}>
                    {item.icon}
                    <span className={styles.operate_item_text}>{item.text}</span>
                    {isAuth === 1 ? item.extra : null}
                </li>)}
            </ul>
            <CustomWhiteSpace />
            <ul className={styles.operate}>
                {[
                    { text: '我的商机报备', router: '/myBusinessReport', icon: <img src={business_opportunity_icon} alt='' /> },
                    { text: '我的晒家', router: '/myShowHome', icon: <img src={sun_home_icon} alt='' /> },
                    { text: '我的收藏', router: '/myCollect', icon: <img src={collect_icon} alt='' /> },
                    { text: '客服中心', router: '/customServiceCenter', icon: <img src={inform_icon} alt='' /> },
                    { text: '意见反馈', router: '/suggestionFeedback', icon: <img src={opinion_icon} alt='' /> }
                ].map(item => <li key={item.router} className={styles.operate_item} onClick={this.jumpTo.bind(this, { pathname: routerBase + item.router })}>
                    {item.icon}
                    <span className={styles.operate_item_text}>{item.text}</span>
                    {item.extra}
                </li>)}
            </ul>
        </React.Fragment>);
    }
})
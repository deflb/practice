import React, { Component } from 'react';
import fullScreen from '../../../../component/fullScreen';
import whichImgLink from '../../../../utlis/whichImgLink';
import Overview from '../component/overview';
import CustomModal from '../../../../component/customModal';
import EnabledIosScrollView from '../../../../component/enabledIosScrollView';
import { request } from '../../../../request';
import api from '../../../../request/api';
import { formatDate } from '../../../../utlis';
import styles from './index.less';

export default fullScreen(class detail extends Component {
    state = {
        visible: false,
        detail: {},
    }
    componentDidMount() {
        const { location } = this.props, { state = {} } = location;
        document.title = `商机详情--${state.customerName}`;
        if (state.businessId)
            request({ url: api.getBusiness, data: { id: state.businessId } }).then(res => {
                this.setState({ detail: res })
            })
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    render() {
        const { visible, detail } = this.state, guideInfo = detail.guideInfo || {};
        return (<EnabledIosScrollView><ul className={styles.wrapper}>
            <li className={styles.header}>
                <ul className={styles.header_date}>
                    <li>报备日期：{formatDate(detail.reportTime, 'YYYY/MM/DD hh:mm')}</li>
                    <li>{detail.statusStr}</li>
                </ul>
                <div className={styles.header_record}>{detail.reward}元<span onClick={() => { this.setState({ visible: true }) }} className={styles.header_record_text}><i className='iconfont icon-message' />调整记录</span></div>
            </li>
            {detail.status ? <li className={styles.detail}>
                {detail.status === 1 ? <Overview
                    className={styles.detail_valid}
                    source={[
                        { number: detail.gainReward, unit: '元', des: '商机奖励' },
                        { number: detail.gainBonus, unit: '元', des: '成交提成' },
                        { number: detail.gainScore, des: '积分' },
                    ]}
                /> : null}
                {detail.status === 2 ? <ul className={styles.detail_void}>
                    <li className={styles.detail_void_title}>商机无效原因</li>
                    <li className={styles.detail_void_content}>客户无相关需求</li>
                </ul> : null}
                <p className={styles.detail_date}>确认完成时间：{formatDate(detail.confirmTime, 'YYYY/MM/DD hh:mm')}</p>
            </li> : null}
            {detail.guideId ? <li className={styles.title}>指定导购员</li> : null}
            {detail.guideId ? <li className={styles.guide}>
                <div className={styles.info}>
                    <ul className={styles.info_header}>
                        <li className={styles.info_header_title}>
                            <span className={styles.info_header_title_icon}>
                                <i className='iconfont icon-user' />
                            </span>
                            {guideInfo.guideName}
                            <span className={styles.info_header_title_des}>成交率 {guideInfo.dealRate}%</span>
                        </li>
                        <li className={styles.info_header_extra}>
                            <span className={styles.info_header_extra_thumb}>
                                {guideInfo.guideAvatar ? <img src={whichImgLink(guideInfo.guideAvatar)} alt='' /> : null}
                            </span>
                            <a href={`tel://${guideInfo.phone}`}><i className='iconfont icon-phone redColor' /></a>
                        </li>
                    </ul>
                </div>
            </li> : null}
            <li className={styles.title}>客户信息</li>
            <li className={styles.custom}>
                <div className={styles.info}>
                    <ul className={styles.info_header}>
                        <li className={styles.info_header_title}>
                            <span className={styles.info_header_title_icon}>
                                <i className='iconfont icon-user' />
                            </span>
                            {detail.customerName}
                            {detail.isOld ? <span className={styles.info_header_title_des}>老客户</span> : null}
                        </li>
                    </ul>
                </div>
                <a className={styles.info} href={`tel://${detail.customerPhone}`}>
                    <ul className={styles.info_header}>
                        <li className={styles.info_header_title}>
                            <span className={styles.info_header_title_icon}>
                                <i className='iconfont icon-user' />
                            </span>
                            {detail.customerPhone}
                        </li>
                        <li className={styles.info_extra}>
                            <i className='iconfont icon-phone redColor' />
                        </li>
                    </ul>
                </a>
                <div className={styles.info}>
                    <ul className={styles.info_header}>
                        <li className={styles.info_header_title}>
                            <span className={styles.info_header_title_icon}>
                                <i className='iconfont icon-user' />
                            </span>
                            {detail.province}-{detail.city}-{detail.district}
                        </li>
                    </ul>
                </div>
                <div className={styles.info}>
                    <ul className={styles.info_header}>
                        <li className={styles.info_header_title}>
                            <span className={styles.info_header_title_icon}>
                                <i className='iconfont icon-user' />
                            </span>
                            <span className={styles.info_header_title_text}>客户需求</span>
                        </li>
                    </ul>
                    <div className={styles.info_content}>
                        {detail.customerDemand}
                    </div>
                </div>
            </li>
            <CustomModal
                title='调整记录'
                visible={visible}
                onClose={() => { this.setState({ visible: false }) }}
            >
                <div className={styles.record_list}>
                    <ul className={styles.record_list_header}>
                        <li>奖励金（元）</li>
                        <li>变化记录</li>
                    </ul>
                    <ul>
                        <li>130</li>
                        <li>初始奖励金</li>
                    </ul>
                    <ul>
                        <li>117</li>
                        <li>自动降10%</li>
                    </ul>
                    <div className={styles.record_list_tip}>每超过3小时未被抢，自动降10%</div>
                </div>
            </CustomModal>
        </ul></EnabledIosScrollView>)
    }
})
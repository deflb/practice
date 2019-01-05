import React, { Component } from 'react';
import fullScreen from '../../../../component/fullScreen';
// import whichImgLink from '../../../../utlis/whichImgLink';
import Overview from '../component/overview';
import CustomModal from '../../../../component/customModal';
import EnabledIosScrollView from '../../../../component/enabledIosScrollView';
import styles from './index.less';

export default fullScreen(class detail extends Component {
    state = {
        visible: false,
    }
    componentDidMount() {
        document.title = '商机详情--刘星';
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    render() {
        let { visible } = this.state;
        return (<EnabledIosScrollView><ul className={styles.wrapper}>
            <li className={styles.header}>
                <ul className={styles.header_date}>
                    <li>报备日期：2018/10/12 10:05</li>
                    <li>待确认</li>
                </ul>
                <div className={styles.header_record}>104元<span onClick={() => { this.setState({ visible: true }) }} className={styles.header_record_text}><i className='iconfont icon-message' />调整记录</span></div>
            </li>
            <li className={styles.detail}>
                <Overview
                    className={styles.detail_valid}
                    source={[
                        { number: 120, unit: '元', des: '商机奖励' },
                        { number: 300, unit: '元', des: '成交提成' },
                        { number: 5000, des: '积分' },
                    ]}
                />
                <ul className={styles.detail_void}>
                    <li className={styles.detail_void_title}>商机无效原因</li>
                    <li className={styles.detail_void_content}>客户无相关需求</li>
                </ul>
                <p className={styles.detail_date}>确认完成时间：2018/10/13 09:50</p>
            </li>
            <li className={styles.title}>指定导购员</li>
            <li className={styles.guide}>
                <div className={styles.info}>
                    <ul className={styles.info_header}>
                        <li className={styles.info_header_title}>
                            <span className={styles.info_header_title_icon}>
                                <i className='iconfont icon-user' />
                            </span>
                            吴亮
                            <span className={styles.info_header_title_des}>成交率 96%</span>
                        </li>
                        <li className={styles.info_header_extra}>
                            <span className={styles.info_header_extra_thumb}>
                                {/* <img src='' alt='' /> */}
                            </span>
                            <a href='tel://18622005511'><i className='iconfont icon-phone redColor' /></a>
                        </li>
                    </ul>
                </div>
            </li>
            <li className={styles.title}>客户信息</li>
            <li className={styles.custom}>
                <div className={styles.info}>
                    <ul className={styles.info_header}>
                        <li className={styles.info_header_title}>
                            <span className={styles.info_header_title_icon}>
                                <i className='iconfont icon-user' />
                            </span>
                            刘星
                            <span className={styles.info_header_title_des}>老客户</span>
                        </li>
                    </ul>
                </div>
                <a className={styles.info} href='tel://18622005511'>
                    <ul className={styles.info_header}>
                        <li className={styles.info_header_title}>
                            <span className={styles.info_header_title_icon}>
                                <i className='iconfont icon-user' />
                            </span>
                            18680085566
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
                            广东-东莞-南城
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
                        需要装修一个儿童房
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
import React, { Component } from 'react';
import dial_icon from '../../assets/icon/dial_icon@3x.png';
import online_service_icon from '../../assets/icon/online_service_icon@3x.png';
import arrow_right_icon from '../../assets/icon/arrow_right@3x.png';
import online_service_order_icon from '../../assets/icon/online_service_order@3x.png';
import online_service_service_icon from '../../assets/icon/online_service_service@3x.png';
import online_service_member_icon from '../../assets/icon/online_service_member@3x.png';
import online_service_integral_icon from '../../assets/icon/online_service_integral@3x.png';
import styles from './index.less';

export default class onlineCustomService extends Component {
    render() {
        return (<div className={styles.wrapper}>
            <div className={styles.main}>
                <div className={styles.content}>
                    <p className={styles.content_title}>常见问题</p>
                    <div className={styles.content_box}>
                        {[
                            { icon: online_service_order_icon, title: '订单问题', content: ['订单如何查看进度', '如何进行订单的售后申请'] },
                            { icon: online_service_service_icon, title: '服务问题', content: ['在哪里查看我的订单服务', '服务的最高标准分几个等级'] },
                            { icon: online_service_member_icon, title: '会员问题', content: ['如何进行会员卡充值', '如何进行订单的售后申请'] },
                            { icon: online_service_integral_icon, title: '积分问题', content: ['积分兑换的商品如何获取', '如何进行订单的售后申请'] },
                        ].map(item => (<ul key={item.title} className={styles.content_box_item}>
                            <li className={styles.content_box_item_left}>
                                <div>
                                    <img src={item.icon} alt={item.title} /><p>{item.title}</p>
                                </div>
                                <img src={arrow_right_icon} alt='' />
                            </li>
                            <li className={styles.content_box_item_right}>
                                {item.content.map(text => (<p key={text}>{text}</p>))}
                            </li>
                        </ul>))}
                    </div>
                </div>
            </div>
            <ul className={styles.footer}>
                <li>
                    <img src={online_service_icon} alt='' />
                    在线客服
                </li>
                <li>
                    <img src={dial_icon} alt='' />
                    一键拨打
                </li>
            </ul>
        </div>)
    }
}
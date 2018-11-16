import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomProgress from '../../../component/customProgress';
import styles from './index.less';

export default class grade extends Component {
    render() {
        const { location } = this.props,
            { state = {} } = location,
            { avatar, name, userLevel } = state;
        return (
            <div>
                <div className={styles.grade_wrapper}>
                    <i className='iconfont icon-question' />
                    <div className={styles.grade_wrapper_avator}>{avatar ? <img src={avatar} alt='' /> : null}</div>
                    <p className={styles.grade_wrapper_name}>{name}</p>
                    <span className={styles.grade_wrapper_tip}>{userLevel}</span>
                    <CustomProgress />
                </div>
                <CustomWhiteSpace />
                <Card full className={styles.power}>
                    <Card.Header title={<span className={styles.power_title}>会员尊享权益</span>} />
                    <Card.Body className={styles.power_content}>
                        {/* {[
                            { title: '下单获积分', extra: '' },
                            { title: '每月送积分', extra: '' },
                            { title: '积分兑换', extra: '' },
                            { title: '专属客服', extra: '金牌会员专享' },
                        ].map(item => <div key={item.title} className={styles.power_content_item}>
                            <img className={styles.power_content_item_thumb} src={list_thumb_png} alt={item.title} />
                            <p className={styles.power_content_item_title}>{item.title}</p>
                            <p className={styles.power_content_item_extra}>{item.extra}</p>
                        </div>)} */}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}